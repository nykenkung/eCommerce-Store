let productList = []
const cart = {}
let totalItems = 0

// Notify other scripts when product list is ready
const onCoreDataLoaded = new CustomEvent("coreDataLoaded")

// Cookie Functions
function setCookie(name, value, days) {
	let expires = ""
	if (days) {
		const date = new Date()
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = "; expires=" + date.toUTCString()
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

function getCookie(name) {
	const nameEQ = name + "="
	const ca = document.cookie.split(";")
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i]
		while (c.charAt(0) === " ") c = c.substring(1, c.length)
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
	}
	return null
}

// Cart Data Management
function saveCartToCookie() {
	setCookie("shoppingCart", JSON.stringify(cart), 7)
}

function loadCartFromCookie() {
	const savedCart = getCookie("shoppingCart")
	if (savedCart) {
		const parsedCart = JSON.parse(savedCart)
		Object.assign(cart, parsedCart)
	}
}

async function loadCartFromServer() {
	const token = localStorage.getItem("authToken")
	if (!token) return // Should not happen if called correctly

	try {
		const response = await fetch(`${config.apiBaseUrl}/cart`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (response.ok) {
			const serverCart = await response.json()
			Object.keys(cart).forEach((key) => delete cart[key]) // Clear local cart
			Object.assign(cart, serverCart) // Assign server cart to local object
		} else {
			console.error("Failed to load cart from server!")
		}
	} catch (error) {
		console.error("Error fetching cart from server:", error)
	}
}

async function saveCartToServer() {
	const token = localStorage.getItem("authToken")
	if (!token) return

	try {
		await fetch(`${config.apiBaseUrl}/cart`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ cart }),
		})
	} catch (error) {
		console.error("Error saving cart to server:", error)
	}
}

// Saving cart to server if log in
function saveCart() {
	const token = localStorage.getItem("authToken")
	if (token) {
		saveCartToServer()
	} else {
		saveCartToCookie()
	}
}

function recalculateTotalItems() {
	totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0)
}

// UI Update Functions on every pages
function updateCartCount() {
	const cartCountEl = document.getElementById("cart-count")
	if (cartCountEl) {
		cartCountEl.textContent = totalItems
	}
}

function updateCartPreview() {
	const container = document.getElementById("cart-items")
	const totalDisplay = document.getElementById("cart-total")
	if (!container || !totalDisplay || productList.length === 0) return

	container.innerHTML = ""
	let total = 0

	// Use Object.entries for a cleaner loop.
	for (const [index, qty] of Object.entries(cart)) {
		const item = productList[index]
		if (!item) continue // Skip if item not found.

		const subtotal = qty * item.price
		total += subtotal

		const div = document.createElement("div")
		div.className = "cart-item"
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
	}
	totalDisplay.textContent = total.toFixed(2)
}

function changeQty(index, change) {
	// If item not exist in the cart, set current quantity to 0
	const currentQty = cart[index] || 0
	const newQty = currentQty + change

	if (newQty > 0) {
		cart[index] = newQty
	} else {
		delete cart[index]
	}

	recalculateTotalItems()
	saveCart()
	updateCartCount()
	updateCartPreview()

	// If on the cart page, re-render full cart view
	if (typeof renderFullCart === "function") {
		renderFullCart()
	}
	// If on the shop page, re-render product buttons
	if (typeof renderProducts === "function") {
		updateProductViews()
	}
	// If on the checkout page, re-render the order summary
	if (typeof renderOrderSummary === "function") {
		renderOrderSummary()
	}
}

// Main Initialization Sequence
document.addEventListener("DOMContentLoaded", () => {
	fetch("products.json")
		.then((response) => {
			if (!response.ok) throw new Error("Network response occurs error!")
			return response.json()
		})
		.then(async (data) => {
			productList = data
			const token = localStorage.getItem("authToken")

			if (token) {
				await loadCartFromServer()
			} else {
				loadCartFromCookie()
			}
			recalculateTotalItems()
			updateCartCount()
			updateCartPreview()
			document.dispatchEvent(onCoreDataLoaded)
		})
		.catch((error) => {
			console.error("Error fetching or initializing core data:", error)
		})
})
