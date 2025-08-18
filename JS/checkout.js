// Functions for Check Out Page (checkout.html)
let currentPaymentMethod = "credit-card"
let paypalButtonsInstance = null
let googlePayButtonsInstance = null
let googlePayClientInstance = null

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
							description: "3140 Active Wear Purchase",
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
	const googlePayContainer = document.getElementById("google-pay")
	let buttonContainer = document.getElementById("google-pay-button-container")

	// If the button container doesn't exist, create the basic structure for it.
	if (!buttonContainer) {
		googlePayContainer.innerHTML = `
            <div id="google-pay-button-container"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">
                Pay securely with Google Pay using your saved payment methods!
            </p>
        `
		buttonContainer = document.getElementById("google-pay-button-container")
	}

	// Check if the Google Pay API is available. If not, display an error and exit.
	if (typeof google === "undefined" || !google.payments || !google.payments.api) {
		buttonContainer.innerHTML = `<p style="color: red; text-align: center;">Google Pay SDK not loaded. Please refresh the page!</p>`
		return
	}

	// Initialize the PaymentsClient once and reuse it.
	if (!googlePayClientInstance) {
		// Assume PAYMENT_CONFIG is globally available from api-config.js
		if (typeof PAYMENT_CONFIG === "undefined" || !PAYMENT_CONFIG.googlePay) {
			console.error("PAYMENT_CONFIG for Google Pay is not defined.")
			buttonContainer.innerHTML = `<p style="color: red; text-align: center;">Google Pay is not configured!</p>`
			return
		}
		googlePayClientInstance = new google.payments.api.PaymentsClient({
			environment: PAYMENT_CONFIG.googlePay.environment,
		})
	}

	// Define the payment data request.
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

	// Check if the user is ready to pay.
	googlePayClientInstance
		.isReadyToPay({
			apiVersion: 2,
			apiVersionMinor: 0,
			allowedPaymentMethods: paymentDataRequest.allowedPaymentMethods,
		})
		.then(function (response) {
			if (response.result) {
				// Create the Google Pay button.
				const button = googlePayClientInstance.createButton({
					onClick: function () {
						if (!validateShippingForm()) return
						googlePayClientInstance
							.loadPaymentData(paymentDataRequest)
							.then(function (paymentData) {
								console.log("Google Pay payment successful:", paymentData)
								processPaymentSuccess("google-pay", paymentData)
							})
							.catch(function (error) {
								console.error("Google Pay payment error:", error)
								// Only show error modal if it wasn't a user cancellation
								if (error.statusCode !== "CANCELED") {
									showModal("Payment Error", "There was an error processing your Google Pay payment! Please try again.")
								} else {
									showModal("Payment Cancelled", "Your Google Pay payment was cancelled!")
								}
							})
					},
					// You can add other button options here, e.g., buttonColor, buttonType
				})
				// Add the button to the container.
				buttonContainer.innerHTML = ""
				buttonContainer.appendChild(button)
			} else {
				// Google Pay is not available.
				buttonContainer.innerHTML = `<p style="color: #666; text-align: center;">Google Pay is not available on this device orbrowser!</p>`
			}
		})
		.catch(function (error) {
			console.error("Google Pay initialization error:", error)
			buttonContainer.innerHTML = `<p style="color: red; text-align: center;">Error initializing Google Pay. Please try another payment method!</p>`
		})
}

// Apple Pay Integration
function initializeApplePay(total) {
	const applePayContainer = document.getElementById("apple-pay")
	let buttonContainer = document.getElementById("apple-pay-button-container")
	if (!buttonContainer) {
		applePayContainer.innerHTML = `
            <div id="apple-pay-button-container"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">
                Pay quickly and securely with Apple Pay!
            </p>
        `
		buttonContainer = document.getElementById("apple-pay-button-container")
	}

	if (false && (!window.ApplePaySession || !ApplePaySession.canMakePayments())) {
		buttonContainer.innerHTML = `<p style="color: #666; text-align: center;">Apple Pay is not available on this device or browser!</p>`
		return
	}
	const button = document.createElement("apple-pay-button")
	button.setAttribute("buttonstyle", "white-outline")
	button.setAttribute("type", "pay")
	button.setAttribute("locale", "en-US")
	button.style.width = "100%"
	button.style.height = "40px"
	button.style.setProperty("--apple-pay-button-border-radius", "100px")
	buttonContainer.style.display = "flex"
	buttonContainer.style.justifyContent = "center"

	button.addEventListener("click", function () {
		if (!validateShippingForm()) return

		const paymentRequest = {
			countryCode: "US",
			currencyCode: "USD",
			total: {
				label: "3140 Active Wear Purchase",
				amount: total.toFixed(2),
			},
			supportedNetworks: ["visa", "masterCard", "amex", "discover"],
			merchantCapabilities: ["supports3DS"],
		}

		const session = new ApplePaySession(3, paymentRequest)

		session.onvalidatemerchant = async (event) => {
			try {
				const response = await fetch(`${config.apiBaseUrl}/apple-merchant`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ validationURL: event.validationURL }),
				})
				const merchantSession = await response.json()
				session.completeMerchantValidation(merchantSession)
			} catch (error) {
				console.error("Apple Pay merchant validation failed:", error)
				session.abort()
			}
		}

		session.onpaymentauthorized = (event) => {
			const payment = event.payment
			console.log("Apple Pay payment authorized:", payment)
			processPaymentSuccess("apple-pay", payment)
			session.completePayment(ApplePaySession.STATUS_SUCCESS)
		}
		session.oncancel = () => {
			console.log("Apple Pay cancelled")
			showModal("Payment Cancelled", "Your Apple Pay payment was cancelled!")
		}
		session.begin()
	})

	buttonContainer.innerHTML = ""
	buttonContainer.appendChild(button)
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
				if (!validateShippingForm()) return
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
		return
	}
	if (Object.keys(cart).length === 0) container.innerHTML = "<p style='text-align:center; font-size: 18px; padding: 5px'>Your cart is empty!</p>"
	if (Object.keys(cart).length === 0 && token) {
		placeOrderBtn.disabled = true
		placeOrderBtn.style.backgroundColor = "#ccc"
		placeOrderBtn.textContent = "Please Login First to Checkout"
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

// Process successful payment from any provider
async function processPaymentSuccess(paymentMethod, paymentData) {
	const token = localStorage.getItem("authToken")
	if (!token) {
		showModal("Authentication Required", "Please log in to complete your order! You will now be redirected to login page.", () => {
			window.location.href = "login.html"
		})
		return
	}
	if (!validateShippingForm()) return

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
	// Create a detailed and validated list of items for the order
	const detailedItems = Object.keys(cart)
		.map((id) => {
			const item = productList[id]
			const quantity = cart[id]

			// VALIDATION: Ensure the product exists in productList before adding it
			if (item && item.name) {
				return {
					productId: id,
					name: item.name,
					price: item.price,
					quantity: quantity,
					img: item.img,
				}
			}
			return null // Return null for any item that can't be found
		})
		.filter((item) => item !== null) // Filter out any null items

	// If, after filtering, there are no valid items, stop the order.
	if (detailedItems.length === 0) {
		showModal("Order Creation Failed", "Could not verify the items in your cart. Please clear your cart and try again.")
		return
	}

	const orderPayload = {
		items: detailedItems, // Validated list of items
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
			saveCart()
			if (typeof updateCartPreview === "function") {
				updateCartPreview()
			}
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
	if (currentPaymentMethod === "paypal") initializePayPal(total)
	else if (currentPaymentMethod === "google-pay") initializeGooglePay(total)
	else if (currentPaymentMethod === "apple-pay") initializeApplePay(total)
	else if (currentPaymentMethod === "affirm") initializeAffirm(total)
}

// Original credit card processing function
async function placeOrder() {
	const token = localStorage.getItem("authToken")
	if (!token) {
		showModal("Authentication Required", "Please log in to proceed to checkout! You will now be redirected to the login page.", () => {
			window.location.href = "login.html"
		})
		return
	}

	if (!validateShippingForm()) return

	const cardNumberInput = document.getElementById("card-number")
	const cardNumberValue = cardNumberInput.value.replace(/\s/g, "")
	showModal("Credit Card Payment", "In a real implementation, this would process your credit card through a secure payment processor.", () => {
		processPaymentSuccess("credit-card", {
			cardLast4: cardNumberValue.slice(-4), // Use the correct variable here
			cardType: "Credit Card",
		})
	})
}

// Function validate
function validateShippingForm() {
	document.querySelectorAll("input[required], select[required], #card-number, #card-name, #card-expiry, #card-cvc").forEach((input) => {
		if (!input.checkValidity()) {
			input.classList.add("invalid")
			input.classList.remove("valid")
		} else {
			input.classList.add("valid")
			input.classList.remove("invalid")
		}
	})
	if (!document.getElementById("checkout-form-element").checkValidity()) {
		showModal("Missing Information!", "Please fill out all required contact and shipping fields before proceeding with payment!")
		return false
	} else if (currentPaymentMethod !== "credit-card") return true
	else if (!document.getElementById("checkout-card-element").checkValidity()) {
		showModal("Missing Payment Information!", "Please fill out all credit card fields!")
		return false
	}
	return true
}

// Always run validation on input for real-time feedback
document.querySelectorAll("input[required], select[required], #card-number, #card-name, #card-expiry, #card-cvc").forEach((input) => {
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
	tabs.forEach((tab) => {
		tab.addEventListener("click", () => {
			const target = document.getElementById(tab.dataset.tab)
			currentPaymentMethod = tab.dataset.tab
			const placeOrderBtn = document.querySelector(".place-order-btn")
			placeOrderBtn.style.display = currentPaymentMethod === "credit-card" ? "block" : "none"

			tabs.forEach((t) => t.classList.remove("active"))
			tab.classList.add("active")
			document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"))
			document.getElementById(tab.dataset.tab).classList.add("active")

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
