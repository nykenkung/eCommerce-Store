// Enhanced checkout.js with Payment API integrations
let currentPaymentMethod = "credit-card"
let paypalButtonsInstance = null
let googlePayButtonsInstance = null

// Functions for Check Out Page (checkout.html)
// Renders the order summary section
function renderOrderSummary() {
	const container = document.getElementById("summary-items")
	if (!container) {
		console.error("Error: Could not find the '#summary-items' element.")
		return
	}

	const subtotalDisplay = document.getElementById("summary-subtotal")
	const totalDisplay = document.getElementById("summary-grand-total")
	container.innerHTML = ""
	let total = 0

	const placeOrderBtn = document.querySelector(".place-order-btn")
	const token = localStorage.getItem("authToken")
	if (!token) {
		placeOrderBtn.disabled = true
		placeOrderBtn.style.backgroundColor = "#ccc"
		placeOrderBtn.textContent = "Please Login"
	}
	if (Object.keys(cart).length === 0) container.innerHTML = "<p style='text-align:center; font-size: 18px; padding: 5px'>Your cart is empty!</p>"
	if (Object.keys(cart).length === 0 && token) {
		placeOrderBtn.disabled = true
		placeOrderBtn.style.backgroundColor = "#ccc"
		placeOrderBtn.textContent = "Cart is Empty"
		return
	}

	Object.keys(cart).forEach((index) => {
		const item = productList[index]
		if (!item) return
		const qty = cart[index]
		const subtotal = qty * item.price
		total += subtotal

		const div = document.createElement("div")
		div.className = "summary-item"
		div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div>
                <span>${item.name}</span>
                <span>Qty: ${qty}</span>
            </div>
            <strong>$${subtotal.toFixed(2)}</strong>`
		container.appendChild(div)
	})

	if (subtotalDisplay) subtotalDisplay.textContent = `$${total.toFixed(2)}`
	if (totalDisplay) totalDisplay.textContent = `$${total.toFixed(2)}`

	// Update payment buttons with new total
	updatePaymentButtons(total)
}

// PayPal Integration
function initializePayPal(total) {
	const paypalContainer = document.getElementById("paypal-button-container")
	if (!paypalContainer) {
		document.getElementById("paypal").innerHTML = `
            <div id="paypal-button-container"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">
                Secure payment with PayPal. You'll be redirected to complete your purchase.
            </p>
        `
	}

	if (paypalButtonsInstance) {
		paypalButtonsInstance.close()
	}

	if (typeof paypal !== "undefined") {
		paypalButtonsInstance = paypal.Buttons({
			createOrder: function (data, actions) {
				return actions.order.create({
					purchase_units: [
						{
							amount: {
								value: total.toFixed(2),
								currency_code: "USD",
							},
							description: "CISC 3140 Active Wear Purchase",
						},
					],
				})
			},
			onApprove: function (data, actions) {
				return actions.order.capture().then(function (details) {
					console.log("PayPal payment successful:", details)
					processPaymentSuccess("paypal", details)
				})
			},
			onError: function (error) {
				console.error("PayPal payment error:", error)
				showModal("Payment Error", "There was an error processing your PayPal payment. Please try again!")
			},
			onCancel: function (data) {
				console.log("PayPal payment cancelled:", data)
				showModal("Payment Cancelled", "Your PayPal payment was cancelled!")
			},
		})

		paypalButtonsInstance.render("#paypal-button-container")
	} else {
		document.getElementById("paypal").innerHTML = `
            <p style="color: red; text-align: center;">PayPal SDK not loaded. Please refresh the page!</p>
        `
	}
}

// Google Pay Integration
function initializeGooglePay(total) {
	const googlePayContainer = document.getElementById("google-pay-button-container")
	if (!googlePayContainer) {
		document.getElementById("google-pay").innerHTML = `
            <div id="google-pay-button-container"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">
                Pay securely with Google Pay using your saved payment methods!
            </p>
        `
	}

	if (typeof google !== "undefined" && google.payments && google.payments.api) {
		const paymentsClient = new google.payments.api.PaymentsClient({
			environment: PAYMENT_CONFIG.googlePay.environment,
		})

		const paymentDataRequest = {
			apiVersion: 2,
			apiVersionMinor: 0,
			allowedPaymentMethods: [
				{
					type: "CARD",
					parameters: {
						allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
						allowedCardNetworks: ["MASTERCARD", "VISA", "AMEX", "DISCOVER"],
					},
					tokenizationSpecification: {
						type: "PAYMENT_GATEWAY",
						parameters: {
							gateway: "example",
							gatewayMerchantId: "exampleGatewayMerchantId",
						},
					},
				},
			],
			merchantInfo: {
				merchantId: PAYMENT_CONFIG.googlePay.merchantId,
				merchantName: PAYMENT_CONFIG.googlePay.merchantName,
			},
			transactionInfo: {
				totalPriceStatus: "FINAL",
				totalPrice: total.toFixed(2),
				currencyCode: "USD",
			},
		}

		paymentsClient
			.isReadyToPay({
				apiVersion: 2,
				apiVersionMinor: 0,
				allowedPaymentMethods: paymentDataRequest.allowedPaymentMethods,
			})
			.then(function (response) {
				if (response.result) {
					const button = paymentsClient.createButton({
						onClick: function () {
							paymentsClient
								.loadPaymentData(paymentDataRequest)
								.then(function (paymentData) {
									console.log("Google Pay payment successful:", paymentData)
									processPaymentSuccess("google-pay", paymentData)
								})
								.catch(function (error) {
									console.error("Google Pay payment error:", error)
									showModal("Payment Error", "There was an error processing your Google Pay payment. Please try again.")
								})
						},
					})

					const container = document.getElementById("google-pay-button-container")
					container.innerHTML = ""
					container.appendChild(button)
				} else {
					document.getElementById("google-pay").innerHTML = `
                    <p style="color: #666; text-align: center;">Google Pay is not available on this device/browser!</p>
                `
				}
			})
			.catch(function (error) {
				console.error("Google Pay initialization error:", error)
				document.getElementById("google-pay").innerHTML = `
                <p style="color: red; text-align: center;">Error initializing Google Pay! Please try another payment method!</p>
            `
			})
	} else {
		document.getElementById("google-pay").innerHTML = `
            <p style="color: red; text-align: center;">Google Pay SDK not loaded! Please refresh the page!</p>
        `
	}
}

// Apple Pay Integration
function initializeApplePay(total) {
	const applePayContainer = document.getElementById("apple-pay-button-container")
	if (!applePayContainer) {
		document.getElementById("apple-pay").innerHTML = `
            <div id="apple-pay-button-container"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">
                Pay securely with Touch ID or Face ID using Apple Pay!
            </p>
        `
	}

	if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
		const button = document.createElement("button")
		button.className = "apple-pay-button"
		button.style.cssText = `
            width: 100%;
            height: 44px;
            background: black;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        `
		button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Pay with Apple Pay
        `

		button.addEventListener("click", function () {
			const paymentRequest = {
				countryCode: "US",
				currencyCode: "USD",
				supportedNetworks: ["visa", "masterCard", "amex", "discover"],
				merchantCapabilities: ["supports3DS"],
				total: {
					label: PAYMENT_CONFIG.applePay.merchantDisplayName,
					amount: total.toFixed(2),
				},
			}

			const session = new ApplePaySession(3, paymentRequest)

			session.onvalidatemerchant = function (event) {
				console.log("Apple Pay merchant validation required")
				// In a real implementation, you would validate the merchant on your server
				showModal("Apple Pay Setup Required", "Apple Pay merchant validation needs to be implemented on your server!")
				session.abort()
			}

			session.onpaymentauthorized = function (event) {
				console.log("Apple Pay payment authorized:", event.payment)
				session.completePayment(ApplePaySession.STATUS_SUCCESS)
				processPaymentSuccess("apple-pay", event.payment)
			}

			session.oncancel = function (event) {
				console.log("Apple Pay payment cancelled")
				showModal("Payment Cancelled", "Your Apple Pay payment was cancelled!")
			}

			session.begin()
		})

		const container = document.getElementById("apple-pay-button-container")
		container.innerHTML = ""
		container.appendChild(button)
	} else {
		document.getElementById("apple-pay").innerHTML = `
            <p style="margin-top: 10px; font-size: 16px; text-align: center">Apple Pay is not available on this device/browser!</p>
        `
	}
}

// Affirm Integration
function initializeAffirm(total) {
	const affirmContainer = document.getElementById("affirm-button-container")
	if (!affirmContainer) {
		document.getElementById("affirm").innerHTML = `
            <div id="affirm-button-container"></div>
            <div id="affirm-promo-container" style="margin-top: 10px;"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">Pay over time with flexible payment plans. No hidden fees.</p>
        `
	}

	if (typeof affirm !== "undefined") {
		// Configure Affirm
		affirm.ui.ready(function () {
			// Create checkout data
			const checkoutData = {
				merchant: {
					user_confirmation_url: window.location.origin + "/index.html",
					user_cancel_url: window.location.origin + "/checkout.html",
					user_confirmation_url_action: "POST",
				},
				order_id: "ORDER_" + Date.now(),
				shipping_amount: 0, // Free shipping
				tax_amount: 0,
				total: Math.round(total * 100), // Affirm expects cents
				items: [],
			}

			// Add cart items to Affirm checkout data
			Object.keys(cart).forEach((index) => {
				const item = productList[index]
				if (item) {
					const qty = cart[index]
					checkoutData.items.push({
						display_name: item.name,
						sku: `ITEM_${index}`,
						unit_price: Math.round(item.price * 100), // Convert to cents
						qty: qty,
						item_image_url: window.location.origin + "/" + item.img,
						item_url: window.location.origin + "/shop.html",
					})
				}
			})

			// Create Affirm button
			const button = document.createElement("button")
			button.className = "affirm-payment-button"
			button.style.cssText = `
                width: 100%;
                height: 44px;
                background: #0176D3;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                font-weight: bold;
            `
			button.textContent = "Pay with Affirm"

			button.addEventListener("click", function () {
				affirm.checkout(checkoutData)
			})

			const container = document.getElementById("affirm-button-container")
			container.innerHTML = ""
			container.appendChild(button)

			// Add promotional messaging
			const promoContainer = document.getElementById("affirm-promo-container")
			if (promoContainer && total >= 50) {
				affirm.ui.promo({
					promo_id: "default",
					amount: Math.round(total * 100),
					container: "#affirm-promo-container",
				})
			}
		})

		// Handle Affirm checkout callbacks
		affirm.checkout.success = function (checkoutToken) {
			console.log("Affirm checkout successful:", checkoutToken)
			processPaymentSuccess("affirm", { checkoutToken })
		}

		affirm.checkout.cancelled = function () {
			console.log("Affirm checkout cancelled")
			showModal("Payment Cancelled", "Your Affirm payment was cancelled!")
		}

		affirm.checkout.error = function (reason) {
			console.error("Affirm checkout error:", reason)
			showModal("Payment Error", "There was an error processing your Affirm payment! Please try again.")
		}
	} else {
		document.getElementById("affirm").innerHTML = `
            <p style="color: red; text-align: center;">Affirm SDK not loaded! Please refresh the page.</p>
        `
	}
}

// Process successful payment from any provider
async function processPaymentSuccess(paymentMethod, paymentData) {
	const token = localStorage.getItem("authToken")
	if (!token) {
		showModal("Authentication Required", "Please log in to complete your order! You will now be redirected to login page.", () => {
			window.location.href = "login.html"
		})
		return
	}

	// Gather shipping details
	const shippingDetails = {
		firstName: document.getElementById("first-name").value,
		lastName: document.getElementById("last-name").value,
		email: document.getElementById("email").value,
		phone: document.getElementById("phone").value,
		shippingAddress: {
			address: document.getElementById("address").value,
			city: document.getElementById("city").value,
			state: document.getElementById("state").value,
			zipCode: document.getElementById("zip-code").value,
		},
		mailingAddress: document.getElementById("sameAsShipping").checked
			? "Same as shipping"
			: {
					address: document.getElementById("mail-address").value,
					city: document.getElementById("mail-city").value,
					state: document.getElementById("mail-state").value,
					zipCode: document.getElementById("mail-zip-code").value,
				},
		paymentMethod: paymentMethod,
		paymentData: paymentData,
	}

	const orderPayload = {
		items: cart,
		total: document.getElementById("summary-grand-total").textContent,
		shippingDetails: shippingDetails,
	}

	try {
		const response = await fetch(`${config.apiBaseUrl}/order`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(orderPayload),
		})

		const result = await response.json()

		if (response.ok) {
			// Clear cart after successful order
			Object.keys(cart).forEach((key) => delete cart[key])
			saveCartToCookie()
			showModal("Order Successful!", `Your order has been placed successfully using ${paymentMethod}! You will now be redirected to your order history.`, () => {
				window.location.href = "order.html"
			})
		} else {
			showModal(`Order Failed!`, result.message || "An unexpected error occurred while processing your order!")
		}
	} catch (error) {
		console.error("Failed to complete order:", error)
		showModal("Connection Error!", "There was a problem connecting to the server. Please try again later!")
	}
}

// Update all payment buttons when total changes
function updatePaymentButtons(total) {
	if (currentPaymentMethod === "paypal") {
		initializePayPal(total)
	} else if (currentPaymentMethod === "google-pay") {
		initializeGooglePay(total)
	} else if (currentPaymentMethod === "apple-pay") {
		initializeApplePay(total)
	} else if (currentPaymentMethod === "affirm") {
		initializeAffirm(total)
	}
}

// Original credit card processing function
async function placeOrder() {
	if (currentPaymentMethod !== "credit-card") {
		showModal("Payment Method Selected", `Please use the ${currentPaymentMethod} button to complete your payment.`)
		return
	}

	const token = localStorage.getItem("authToken")
	if (!token) {
		showModal("Authentication Required", "Please log in to proceed to checkout! You will now be redirected to the login page.", () => {
			window.location.href = "login.html"
		})
		return
	}

	// Validate form
	const form = document.getElementById("checkout-form-element")
	if (!form.checkValidity()) {
		showModal("Missing Information!", "Please fill out all required fields correctly!")
		form.querySelectorAll("input[required], select[required]").forEach((input) => {
			if (!input.checkValidity()) {
				input.classList.add("invalid")
				input.classList.remove("valid")
			}
		})
		return
	}

	// Validate credit card fields
	const cardNumber = document.getElementById("card-number").value
	const cardName = document.getElementById("card-name").value
	const cardExpiry = document.getElementById("card-expiry").value
	const cardCvc = document.getElementById("card-cvc").value

	if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
		showModal("Missing Payment Information!", "Please fill out all credit card fields!")
		return
	}

	// For demo purposes, we'll simulate credit card processing
	showModal("Credit Card Payment", "In a real implementation, this would process your credit card through a secure payment processor.", () => {
		processPaymentSuccess("credit-card", {
			cardLast4: cardNumber.slice(-4),
			cardType: "Credit Card",
		})
	})
}

// Form validation
document.querySelectorAll("input[required], select[required]").forEach((input) => {
	input.addEventListener("input", () => {
		if (input.checkValidity()) {
			input.classList.add("valid")
			input.classList.remove("invalid")
		} else {
			input.classList.add("invalid")
			input.classList.remove("valid")
		}
	})
})

// Set up event listeners
function setupCheckoutPageListeners() {
	const sameAsShippingCheckbox = document.getElementById("sameAsShipping")
	const billingAddressFields = document.getElementById("billingAddressFields")
	if (sameAsShippingCheckbox && billingAddressFields) {
		sameAsShippingCheckbox.addEventListener("change", function () {
			billingAddressFields.style.display = this.checked ? "none" : "block"
		})
	}

	const tabs = document.querySelectorAll(".payment-tabs .tab-link")
	const tabContents = document.querySelectorAll(".tab-content")
	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			const target = document.getElementById(tab.dataset.tab)
			currentPaymentMethod = tab.dataset.tab

			tabs.forEach((t) => t.classList.remove("active"))
			tab.classList.add("active")
			tabContents.forEach((content) => content.classList.remove("active"))

			if (target) {
				target.classList.add("active")

				// Initialize the selected payment method
				const total = parseFloat(document.getElementById("summary-grand-total").textContent.replace("$", ""))
				if (total > 0) {
					updatePaymentButtons(total)
				}
			}
		})
	})
}

// Initialize Check Out Page
document.addEventListener("coreDataLoaded", () => {
	if (document.getElementById("checkout-page")) {
		// Check user login status
		const token = localStorage.getItem("authToken")
		if (!token) {
			showModal("Authentication Required", "Please log in to proceed to checkout! You will now be redirected to the login page.", () => {
				window.location.href = "login.html"
			})
		}
		// Shopping cart is empty
		if (Object.keys(cart).length === 0 && token) {
			showModal("Your shopping cart is empty!", "Please add your first item to proceed to checkout! You will now be redirected to the shop page.", () => {
				window.location.href = "shop.html"
			})
		}
		renderOrderSummary()
		setupCheckoutPageListeners()

		// Initialize default payment method
		const total = parseFloat(document.getElementById("summary-grand-total")?.textContent?.replace("$", "") || "0")
		if (total > 0) {
			updatePaymentButtons(total)
		}
	}
})
