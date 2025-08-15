// --- Functions for the Cart Page (cart.html) ---
function changeQty(index, delta) {
	if (!cart[index]) return // Safety check

	cart[index] += delta
	if (cart[index] <= 0) {
		delete cart[index]
	}
	recalculateTotalItems()
	saveCartToCookie()
	updateCartCount()
	updateCartPreview()
	renderFullCart() // Re-render function cart.js
}

function renderFullCart() {
	const container = document.getElementById("cart-page-items-container")
	if (!container) return // Only run if on the cart page

	const subtotalDisplay = document.getElementById("cart-subtotal")
	const totalDisplay = document.getElementById("cart-grand-total")
	const summarySection = document.getElementById("cart-summary-section")

	const cartKeys = Object.keys(cart)

	if (cartKeys.length === 0) {
		container.innerHTML = "<p style='text-align:center; font-size: 18px; color: #6c84a2; padding: 50px 0'>Your cart is empty. <a href='shop.html' style='text-decoration: none'>Click here to start shopping!</a></p>"
		if (summarySection) summarySection.style.display = "none"
		return
	}

	if (summarySection) summarySection.style.display = "flex"
	container.innerHTML = `
		<table>
			<thead><tr><td></td><td></td><td>Product Name</td><td>Price</td><td>Quantity</td><td>Subtotal</td></tr></thead>
			<tbody></tbody>
		</table>`
	const tbody = container.querySelector("tbody")
	let total = 0

	cartKeys.forEach((index) => {
		const item = productList[index]
		if (!item) return
		const qty = cart[index]
		const subtotal = qty * item.price
		total += subtotal
		const itemRow = document.createElement("tr")
		itemRow.innerHTML = `
			<td><button class="button-remove" onclick="changeQty(${index}, -${qty})">×</button></td>
			<td><img src="${item.img}" alt="${item.name}"></td>
			<td>${item.name}</td>
			<td>$${item.price.toFixed(2)}</td>
			<td>
				<div class="quantity-controls-cart">
					<button onclick="changeQty(${index}, -1)" ${qty <= 1 ? "disabled" : ""}>−</button>
					<span>${qty}</span>
					<button onclick="changeQty(${index}, 1)">+</button>
				</div>
			</td>
			<td><strong>$${subtotal.toFixed(2)}</strong></td>`
		tbody.appendChild(itemRow)
	})

	subtotalDisplay.textContent = `$${total.toFixed(2)}`
	totalDisplay.textContent = `$${total.toFixed(2)}`
}

// --- Initialize Cart Page ---
document.addEventListener("coreDataLoaded", () => {
	if (document.getElementById("cart-page-items-container")) {
		renderFullCart()
	}
})
