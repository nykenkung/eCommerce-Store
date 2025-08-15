// --- Global Variables ---
let productList = []
const cart = {}
let totalItems = 0

// --- Custom Event for Data Loading ---
// This event will notify other scripts when the product list is ready.
const onCoreDataLoaded = new CustomEvent("coreDataLoaded")

// --- Cookie Functions ---
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

// --- Core Cart Data Management ---
function saveCartToCookie() {
	setCookie("shoppingCart", JSON.stringify(cart), 7)
}

function loadCartFromCookie() {
	const savedCart = getCookie("shoppingCart")
	if (savedCart) {
		const parsedCart = JSON.parse(savedCart)
		Object.assign(cart, parsedCart)
	}
	recalculateTotalItems()
}

function recalculateTotalItems() {
	totalItems = 0
	// Use Object.values for a more modern approach to sum quantities
	totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0)
}

// --- Universal UI Update Functions ---
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
		<img src="${item.img}" alt="${item.name}" class="cart-item-img">
		<div class="cart-item-details">
			<span class="cart-item-name">${item.name}</span>
			<div class="cart-item-qty-controls">
				<button onclick="changeQty(${index}, -1)">-</button>
				<span class="cart-item-qty">x ${qty}</span>
				<button onclick="changeQty(${index}, 1)">+</button>
			</div>
		</div>
		<strong class="cart-item-price">$${subtotal.toFixed(2)}</strong>`
		container.appendChild(div)
	}
	totalDisplay.textContent = total.toFixed(2)
}

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
}

// --- Main Initialization Sequence ---
document.addEventListener("DOMContentLoaded", () => {
	fetch("products.json")
		.then((response) => {
			if (!response.ok) throw new Error("Network response was not ok")
			return response.json()
		})
		.then((data) => {
			productList = data
			loadCartFromCookie()

			// Run universal updates for the header cart
			updateCartCount()
			updateCartPreview()

			// Notify other scripts that the core data is ready
			document.dispatchEvent(onCoreDataLoaded)
		})
		.catch((error) => {
			console.error("Error fetching or initializing core data:", error)
		})
})
