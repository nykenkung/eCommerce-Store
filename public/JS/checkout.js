// Functions for Check Out Page (checkout.html)
// List of form field IDs to save to the cookie
const fieldsToSave = ["first-name", "last-name", "email", "phone", "address", "city", "state", "zip-code", "sameAsShipping", "mail-address", "mail-city", "mail-state", "mail-zip-code"]

// Saves the content of the checkout form to a cookie
function saveCheckoutFormToCookie() {
	const formData = {}
	fieldsToSave.forEach((id) => {
		const element = document.getElementById(id)
		if (element) {
			// Handle checkboxes vs. regular input fields
			formData[id] = element.type === "checkbox" ? element.checked : element.value
		}
	})
	// The setCookie function is available globally from cart-preview.js
	setCookie("checkoutFormData", JSON.stringify(formData), 7) // Save for 7 days
}

// Loads and populates the checkout form from the cookie
function loadCheckoutFormFromCookie() {
	// The getCookie function is available globally from cart-preview.js
	const savedData = getCookie("checkoutFormData")
	if (savedData) {
		const formData = JSON.parse(savedData)
		fieldsToSave.forEach((id) => {
			const element = document.getElementById(id)
			if (element && formData[id] !== undefined) {
				if (element.type === "checkbox") {
					element.checked = formData[id]
				} else {
					element.value = formData[id]
				}
			}
		})

		// After loading, manually trigger the change event for the checkbox to ensure the billing address visibility is correctly updated
		const sameAsShippingCheckbox = document.getElementById("sameAsShipping")
		if (sameAsShippingCheckbox) {
			const event = new Event("change")
			sameAsShippingCheckbox.dispatchEvent(event)
		}
	}
}

function setupPhoneAutoFormat() {
	const phoneInput = document.getElementById("phone")
	if (!phoneInput) return
	phoneInput.addEventListener("input", (e) => {
		// Keep only digits
		let digits = e.target.value.replace(/\D/g, "")

		// Limit to 10 digits
		if (digits.length > 10) digits = digits.slice(0, 10)

		let formatted = digits
		if (digits.length > 6) {
			formatted = digits.replace(/(\d{3})(\d{3})(\d{1,4})/, "$1-$2-$3")
		} else if (digits.length > 3) {
			formatted = digits.replace(/(\d{3})(\d{1,3})/, "$1-$2")
		}

		e.target.value = formatted
	})
}

// Central function to style a field based on its validity
function styleValidity(element) {
	if (element.checkValidity()) {
		element.classList.add("valid")
		element.classList.remove("invalid")
	} else {
		element.classList.add("invalid")
		element.classList.remove("valid")
	}
}

// Function to validate all fields
function validateAllFields() {
	document.querySelectorAll("#checkout-form-element input[required], #checkout-form-element select[required]").forEach((input) => {
		styleValidity(input)
	})
}

// Run validation on input for real-time feedback
document.querySelectorAll("#checkout-form-element input[required], #checkout-form-element select[required]").forEach((input) => {
	input.addEventListener("input", () => styleValidity(input))
})

// Render order summary section
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
		placeOrderBtn.textContent = "Please Login To Proceed Checkout"
		return
	}
	if (Object.keys(cart).length === 0) {
		container.innerHTML = "<p style='text-align:center; font-size: 18px; padding: 5px'>Your cart is empty!</p>"

		// Even if logged in, disable button if cart is empty
		placeOrderBtn.disabled = true
		placeOrderBtn.style.backgroundColor = "#ccc"
		placeOrderBtn.textContent = "Cart is Empty"
		// Set totals to 0 when cart is empty
		if (subtotalDisplay) subtotalDisplay.textContent = "$0.00"
		if (totalDisplay) totalDisplay.textContent = "$0.00"
		updatePaymentButtons(0) // Update payment buttons with zero total
		return
	}

	// If cart is not empty, ensure the button is enabled
	placeOrderBtn.disabled = false
	placeOrderBtn.style.backgroundColor = "" // Revert to original style
	placeOrderBtn.textContent = "Place Order"

	Object.keys(cart).forEach((index) => {
		const item = productList[index]
		if (!item) return
		const qty = cart[index]
		const subtotal = qty * item.price
		total += subtotal

		// Use the same structure and classes as cart-preview for identical styling
		const div = document.createElement("div")
		div.className = "summary-item" // Use cart-item class
		div.innerHTML = `
            <button class="button-remove" onclick="changeQty(${index}, -${qty})">×</button>
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
                <div class="cart-item-qty-controls">
                    <button onclick="changeQty(${index}, -1)" ${qty <= 1 ? "disabled" : ""}>-</button>
                    <span class="cart-item-qty">${qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
            <strong class="cart-item-price">$${subtotal.toFixed(2)}</strong>`
		container.appendChild(div)
	})

	if (subtotalDisplay) subtotalDisplay.textContent = `$${total.toFixed(2)}`
	if (totalDisplay) totalDisplay.textContent = `$${total.toFixed(2)}`

	// Update payment buttons with new total
	updatePaymentButtons(total)
}

// Update all payment buttons when total changes
function updatePaymentButtons(total) {
	if (currentPaymentMethod === "paypal") initializePayPal(total)
	else if (currentPaymentMethod === "google-pay") initializeGooglePay(total)
	else if (currentPaymentMethod === "apple-pay") initializeApplePay(total)
	else if (currentPaymentMethod === "affirm") initializeAffirm(total)
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
	}
	// Create detailed and validated list of items for the order
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

	if (detailedItems.length === 0) {
		showModal("Order Creation Failed!", "Could not verify the items in your cart. Please clear your cart and try again.")
		return
	}

	const orderPayload = {
		items: detailedItems,
		total: document.getElementById("summary-grand-total").textContent,
		shippingDetails: shippingDetails,
		paymentDetails: paymentData, // Add the raw payment details directly to the payload
	}

	try {
		const response = await fetch(`${apiBaseUrl}/order`, {
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

// Function validate
function validateShippingForm() {
	// Re-run validation styling for all fields before showing a modal
	validateAllFields()
	// Also validate credit card fields if that's the current method
	if (typeof validateAllCardFields === "function") {
		validateAllCardFields()
	}

	if (!document.getElementById("checkout-form-element").checkValidity()) {
		showModal("Missing Information!", "Please fill out all required contact and shipping fields before proceeding with payment!")
		return false
	} else if (currentPaymentMethod === "credit-card" && !document.getElementById("checkout-card-element").checkValidity()) {
		showModal("Missing Payment Information!", "Please fill out all required credit card fields!")
		return false
	}
	return true
}

let currentPaymentMethod = "credit-card"

// Set up event listeners
function setupCheckoutPageListeners() {
	setupPhoneAutoFormat()

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
	// Add event listeners to automatically save form data on change
	fieldsToSave.forEach((id) => {
		const element = document.getElementById(id)
		if (element) {
			element.addEventListener("input", saveCheckoutFormToCookie)
		}
	})
}

// Fetches and populates saved credit card information for a logged-in user
async function loadSavedCardInfo() {
	const token = localStorage.getItem("authToken")
	if (!token) return // Exit if user is not logged in
	try {
		// Assumes an endpoint exists to get saved payment info
		const response = await fetch(`${apiBaseUrl}/card`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		if (response.ok) {
			const cardInfo = await response.json()
			// Check if the returned object has card data
			if (cardInfo && cardInfo.cardNumber) {
				const cardNumberInput = document.getElementById("card-number")
				const cardNameInput = document.getElementById("card-name")
				const cardExpiryInput = document.getElementById("card-expiry")
				const cardCvvInput = document.getElementById("card-cvv")
				const saveCardContainer = document.getElementById("save-card-info").parentElement
				if (cardNumberInput) cardNumberInput.value = cardInfo.cardNumber
				if (cardNameInput) cardNameInput.value = cardInfo.cardName
				if (cardExpiryInput) cardExpiryInput.value = cardInfo.cardExpiry
				if (cardCvvInput) cardCvvInput.value = cardInfo.cardCvv
				if (typeof validateAllCardFields === "function") validateAllCardFields()
			}
		} else if (response.status !== 404) console.error("Could not fetch saved card info! Status:", response.status)
	} catch (error) {
		console.error("Error loading saved card information:", error)
	}
}

// Initialize Check Out Page
document.addEventListener("coreDataLoaded", () => {
	if (document.getElementById("checkout-page")) {
		// Load form data from cookie first
		loadCheckoutFormFromCookie()

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
		loadSavedCardInfo()

		// Initialize default payment method
		const total = parseFloat(document.getElementById("summary-grand-total")?.textContent?.replace("$", "") || "0")
		if (total > 0) {
			updatePaymentButtons(total)
		}
	}
})
