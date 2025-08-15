// --- Functions for the Checkout Page ---
// Renders the order summary section on checkout page
function renderOrderSummary() {
	const container = document.getElementById("summary-items")
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

// Gather form data and validate, send to server to create new order
async function placeOrder() {
	const token = localStorage.getItem("authToken")
	if (!token) {
		showModal("Authentication Required", "Please log in to proceed to checkout! You will now be redirected to the login page.", () => {
			window.location.href = "login.html"
		})
		return
	}

	// REFACTORED VALIDATION LOGIC
	const form = document.getElementById("checkout-form-element")

	// Check all 'required' fields, email formats, etc., defined in the HTML.
	if (!form.checkValidity()) {
		showModal("Missing Information!", "Please fill out all required fields correctly!")

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
			Object.keys(cart).forEach((key) => delete cart[key])
			saveCartToCookie()
			showModal("Order Successful!", "Your order has been placed. You will now be redirected to your order history.", () => {
				window.location.href = "order.html"
			})
		} else {
			placeOrderBtn.disabled = false
			placeOrderBtn.textContent = "Place Order"
			showModal(`Order Failed!`, result.message || "An unexpected error occurred!")
		}
	} catch (error) {
		console.error("Failed to place order:", error)
		placeOrderBtn.disabled = false
		placeOrderBtn.textContent = "Place Order"
		showModal("Connection Error!", "There was a problem connecting to the server. Please try again later!")
	}
}

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
			tabs.forEach((t) => t.classList.remove("active"))
			tab.classList.add("active")
			tabContents.forEach((content) => content.classList.remove("active"))
			if (target) {
				target.classList.add("active")
			}
		})
	})
}

// Initialize Checkout Page
document.addEventListener("coreDataLoaded", () => {
	if (document.getElementById("checkout-page")) {
		// Check user login status
		const token = localStorage.getItem("authToken")
		if (!token) {
			showModal("Authentication Required", "Please log in to proceed to checkout! You will now be redirected to the login page.", () => {
				window.location.href = "login.html"
			})
		}
		// Check cart is not empty
		if (Object.keys(cart).length === 0 && token) {
			showModal("Your shopping cart is empty!", "Please add your first item to procees to checkout! You will now be redirected  to the shop page.", () => {
				window.location.href = "shop.html"
			})
		}
		renderOrderSummary()
		setupCheckoutPageListeners()
	}
})
