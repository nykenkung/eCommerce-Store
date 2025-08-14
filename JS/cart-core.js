// --- Global Variables ---
let productList = []
const cart = {}
let totalItems = 0

// --- Custom Event for Data Loading ---
// This event will notify other scripts when the product list is ready.
const onCoreDataLoaded = new CustomEvent("coreDataLoaded")

// --- Core Cart Data Management using localStorage ---
function saveCartToStorage() {
	// Save the cart object to localStorage as a JSON string.
	localStorage.setItem("shoppingCart", JSON.stringify(cart))
}

function loadCartFromStorage() {
	// Retrieve the cart from localStorage.
	const savedCart = localStorage.getItem("shoppingCart")
	if (savedCart) {
		const parsedCart = JSON.parse(savedCart)
		Object.assign(cart, parsedCart) // Load the saved cart data.
	}
	recalculateTotalItems()
}

function recalculateTotalItems() {
	totalItems = 0
	// Use Object.values for a more modern approach to sum quantities.
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

// --- Main Initialization Sequence ---
document.addEventListener("DOMContentLoaded", () => {
	fetch("products.json")
		.then((response) => {
			if (!response.ok) throw new Error("Network response was not ok")
			return response.json()
		})
		.then((data) => {
			productList = data
			loadCartFromStorage() // Load cart from localStorage instead of cookies.

			// Run universal updates for the header cart.
			updateCartCount()
			updateCartPreview()

			// Notify other scripts that the core data is ready.
			document.dispatchEvent(onCoreDataLoaded)
		})
		.catch((error) => {
			console.error("Error fetching or initializing core data:", error)
		})
})
