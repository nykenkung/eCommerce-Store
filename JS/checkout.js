// --- Functions for the Checkout Page ---

/**
 * Renders the order summary section on the checkout page using items from the global cart object.
 */
function renderOrderSummary() {
	const container = document.getElementById("summary-items")
	const subtotalDisplay = document.getElementById("summary-subtotal")
	const totalDisplay = document.getElementById("summary-grand-total")
	if (!container) return // Exit if not on checkout page

	let total = 0
	container.innerHTML = ""
	const cartKeys = Object.keys(cart)

	if (cartKeys.length === 0) {
		container.innerHTML = "<p>Your cart is empty.</p>"
		// Disable the place order button if the cart is empty
		const placeOrderBtn = document.querySelector(".place-order-btn")
		if (placeOrderBtn) {
			placeOrderBtn.disabled = true
			placeOrderBtn.style.backgroundColor = "#ccc"
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

/**
 * Gathers form data, sends it to the server to create a new order.
 * This is an async function to handle the API call.
 */
async function placeOrder() {
	const token = localStorage.getItem("authToken")
	if (!token) {
		alert("You must be logged in to place an order.")
		window.location.href = "login.html"
		return
	}

	// Collect all shipping and contact details from the form.
	const isSameAsShipping = document.getElementById("sameAsShipping").checked
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
		mailingAddress: isSameAsShipping
			? "Same as shipping"
			: {
					address: document.getElementById("mail-address").value,
					city: document.getElementById("mail-city").value,
					state: document.getElementById("mail-state").value,
					zipCode: document.getElementById("mail-zip-code").value,
			  },
	}

	// Construct the payload for the API request.
	const orderPayload = {
		items: cart,
		total: document.getElementById("summary-grand-total").textContent,
		shippingDetails: shippingDetails,
	}

	try {
		const response = await fetch("https://e-commerceproject-x4gr.onrender.com/api/orders", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`, // Include the JWT for authentication
			},
			body: JSON.stringify(orderPayload),
		})

		const result = await response.json()

		if (response.ok) {
			// If order is placed successfully, clear the cart from localStorage.
			localStorage.removeItem("shoppingCart")
			alert("Your order has been placed successfully!")
			window.location.href = "order.html" // Redirect to the order history page.
		} else {
			// If the server returns an error, show it to the user.
			alert(`Order failed: ${result.message}`)
		}
	} catch (error) {
		console.error("Failed to place order:", error)
		alert("There was a problem connecting to the server. Please try again later.")
	}
}

/**
 * Sets up event listeners for the checkout page, like the address checkbox and payment tabs.
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
// Wait for the core data (products, cart) to be loaded before setting up the page.
document.addEventListener("coreDataLoaded", () => {
	if (document.getElementById("checkout-page")) {
		renderOrderSummary()
		setupCheckoutPageListeners()
	}
})
