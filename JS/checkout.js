// --- Functions for the Checkout Page ---
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

function placeOrder() {
	const isSameAsShipping = document.getElementById("sameAsShipping").checked
	const order = {
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
		items: cart,
		total: document.getElementById("summary-grand-total").textContent,
		orderDate: new Date().toISOString(),
	}

	// --- CORRECTED LOGIC ---
	// 1. Get existing history from the cookie.
	// NOTE: This assumes getCookie() is available, as defined in cart-core.js.
	const historyCookie = getCookie("orderHistory")
	let orderHistory = []

	// 2. If history exists, parse it into our array.
	if (historyCookie) {
		try {
			orderHistory = JSON.parse(historyCookie)
			// Ensure it's an array, in case of old/bad data
			if (!Array.isArray(orderHistory)) {
				orderHistory = []
			}
		} catch (e) {
			console.error("Could not parse order history cookie:", e)
			orderHistory = [] // Reset if cookie is corrupt
		}
	}

	// 3. Add the new order to the start of the history array.
	orderHistory.unshift(order)

	// 4. Save the updated array back to the cookie.
	setCookie("orderHistory", JSON.stringify(orderHistory), 30)

	setCookie("shoppingCart", "", -1) // Clear the shopping cart
	alert("Your order has been placed successfully!")
	window.location.href = "order.html" // Redirect to order history to see the new order
}

function setupCheckoutPageListeners() {
	const sameAsShippingCheckbox = document.getElementById("sameAsShipping")
	const mailingAddressFields = document.getElementById("mailingAddressFields")
	if (sameAsShippingCheckbox) {
		sameAsShippingCheckbox.addEventListener("change", function () {
			mailingAddressFields.style.display = this.checked ? "none" : "block"
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
			target.classList.add("active")
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
