// --- Functions for the Checkout Page ---

/**
 * Creates and displays a modal dialog on the checkout page.
 * This function builds the modal from scratch and removes it when done.
 * @param {string} title - The title for the modal window.
 * @param {string} message - The message text to be displayed.
 * @param {function} [onOk] - Optional callback for when the OK button is clicked.
 */
function createCheckoutModal(title, message, onOk) {
	// Remove any existing modal first to be safe
	const existingModal = document.getElementById("checkout-modal-overlay")
	if (existingModal) {
		existingModal.remove()
	}

	// Create modal overlay and apply the CSS class
	const overlay = document.createElement("div")
	overlay.className = "modal active" // Use CSS classes

	// Create modal content box and apply the CSS class
	const content = document.createElement("div")
	content.className = "modal-content" // Use CSS class

	// Create title (inline style is fine for simple element-specific overrides)
	const h2 = document.createElement("h2")
	h2.textContent = title

	// Create message
	const p = document.createElement("p")
	p.innerHTML = message

	// Create OK button
	const button = document.createElement("button")
	button.textContent = "OK"

	// Button click action
	button.onclick = () => {
		if (onOk) {
			onOk()
		}
		overlay.remove() // **CRITICAL**: Always remove the modal
	}

	// Assemble the modal
	content.appendChild(h2)
	content.appendChild(p)
	content.appendChild(button)
	overlay.appendChild(content)

	// Add to the page
	document.body.appendChild(overlay)
}

/**
 * Renders the order summary section on the checkout page.
 */
function renderOrderSummary() {
	const container = document.getElementById("summary-items")
	const subtotalDisplay = document.getElementById("summary-subtotal")
	const totalDisplay = document.getElementById("summary-grand-total")
	if (!container) return

	let total = 0
	container.innerHTML = ""
	const cartKeys = Object.keys(cart)

	if (cartKeys.length === 0) {
		container.innerHTML = "<p>Your cart is empty.</p>"
		const placeOrderBtn = document.querySelector(".place-order-btn")
		if (placeOrderBtn) {
			placeOrderBtn.disabled = true
			placeOrderBtn.style.backgroundColor = "#ccc"
			placeOrderBtn.textContent = "Cart is Empty"
		}
		return
	}

	cartKeys.forEach((index) => {
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

	subtotalDisplay.textContent = `$${total.toFixed(2)}`
	totalDisplay.textContent = `$${total.toFixed(2)}`
}

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

// Gathers form data, validates it, and sends it to the server to create a new order.
async function placeOrder() {
	const token = localStorage.getItem("authToken")
	if (!token) {
		createCheckoutModal("Authentication Required", "You must be logged in to place an order. Redirecting you to the login page.", () => {
			window.open("login.html", "_blank")
		})
		return
	}

	// REFACTORED VALIDATION LOGIC
	const form = document.getElementById("checkout-form-element")

	// Check all 'required' fields, email formats, etc., defined in the HTML.
	if (!form.checkValidity()) {
		createCheckoutModal("Missing Information", "Please fill out all required fields correctly.")
		// Explicitly trigger validation UI for any untouched fields so they turn red.
		form.querySelectorAll("input[required], select[required]").forEach((input) => {
			if (!input.checkValidity()) {
				input.classList.add("invalid")
				input.classList.remove("valid")
			}
		})
		return
	}

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

	const orderPayload = {
		items: cart,
		total: document.getElementById("summary-grand-total").textContent,
		shippingDetails: shippingDetails,
	}

	const placeOrderBtn = document.querySelector(".place-order-btn")
	placeOrderBtn.disabled = true
	placeOrderBtn.textContent = "Placing Order..."

	try {
		const response = await fetch(`${config.apiBaseUrl}/orders`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(orderPayload),
		})

		const result = await response.json()

		if (response.ok) {
			Object.keys(cart).forEach((key) => delete cart[key])
			saveCartToCookie()
			createCheckoutModal("Order Successful!", "Your order has been placed. You will now be redirected to your order history.", () => {
				window.location.href = "order.html"
			})
		} else {
			placeOrderBtn.disabled = false
			placeOrderBtn.textContent = "Place Order"
			createCheckoutModal(`Order Failed`, result.message || "An unexpected error occurred.")
		}
	} catch (error) {
		console.error("Failed to place order:", error)
		placeOrderBtn.disabled = false
		placeOrderBtn.textContent = "Place Order"
		createCheckoutModal("Connection Error", "There was a problem connecting to the server. Please try again later.")
	}
}

/**
 * Sets up event listeners for the checkout page.
 */
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
			tabs.forEach((t) => t.classList.remove("active"))
			tab.classList.add("active")
			tabContents.forEach((content) => content.classList.remove("active"))
			if (target) {
				target.classList.add("active")
			}
		})
	})
}

// --- Initialize Checkout Page ---
document.addEventListener("coreDataLoaded", () => {
	if (document.getElementById("checkout-page")) {
		renderOrderSummary()
		setupCheckoutPageListeners()
	}
})
