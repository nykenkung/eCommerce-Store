// Global variables
let productList = [] // Will be populated from products.json
const cart = {}
let totalItems = 0

// --- Cookie Functions ---
/* Sets a cookie with a given name, value, and expiration in days.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to store.
 * @param {number} days - The number of days until the cookie expires. */
function setCookie(name, value, days) {
	let expires = ""
	if (days) {
		const date = new Date()
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = "; expires=" + date.toUTCString()
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

/* Retrieves a cookie by its name.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The cookie's value or null if not found. */
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

// Saves the current state of the cart to a cookie.
function saveCartToCookie() {
	setCookie("shoppingCart", JSON.stringify(cart), 7) // Cookie expires in 7 days
}

// Loads the cart from the cookie when the page loads.
function loadCartFromCookie() {
	const savedCart = getCookie("shoppingCart")
	if (savedCart) {
		const parsedCart = JSON.parse(savedCart)
		Object.assign(cart, parsedCart) // Restore cart object
		recalculateTotalItems()
		updateCartCount()
		updateCartPreview()
	}
}

// Recalculates the total number of items in the cart.
function recalculateTotalItems() {
	totalItems = 0
	for (const index in cart) {
		totalItems += cart[index]
	}
}

function updateCartCount() {
	document.getElementById("cart-count").textContent = totalItems
}

// Updates the visual state of product cards to show quantity controls if the item is in the cart.
function updateProductViews() {
	Object.keys(cart).forEach((index) => {
		const qty = cart[index]
		if (qty > 0) {
			const qtyControls = document.getElementById(`qty-controls-${index}`)
			const qtySpan = document.getElementById(`qty-${index}`)
			if (qtyControls && qtySpan) {
				qtyControls.style.display = "flex"
				qtySpan.textContent = qty
			}
		}
	})
}

function renderProducts(filteredList = productList) {
	const grid = document.getElementById("product-grid")
	grid.innerHTML = "" // Clear grid

	filteredList.forEach((item, index) => {
		const card = document.createElement("div")
		card.className = "product-card"
		card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <p class="product-title">${item.name}</p>
      <p class="price">
        <span class="original-price">$${item.original}</span>
        <span class="discount">${item.discount}</span>
        <span class="final-price">$${item.price}</span>
      </p>
      <button class="add-to-cart" onclick="addToCart(${index})">Add to Cart</button>
      <div class="quantity-controls" id="qty-controls-${index}" style="display:none;">
        <button onclick="changeQty(${index}, -1)">−</button>
        <span id="qty-${index}">1</span>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>
    `
		grid.appendChild(card)
	})
}

function addToCart(index) {
	if (!cart[index]) {
		cart[index] = 1
		document.getElementById(`qty-controls-${index}`).style.display = "flex"
		document.getElementById(`qty-${index}`).textContent = 1
	} else {
		cart[index]++
	}
	totalItems++
	updateCartCount()
	updateCartPreview()
	document.getElementById(`qty-${index}`).textContent = cart[index]
	saveCartToCookie() // Save cart after modification
}

function changeQty(index, delta) {
	if (cart[index]) {
		cart[index] += delta
		totalItems += delta

		if (cart[index] <= 0) {
			delete cart[index]
			document.getElementById(`qty-controls-${index}`).style.display = "none"
		} else {
			document.getElementById(`qty-${index}`).textContent = cart[index]
		}
		updateCartCount()
		updateCartPreview()
		saveCartToCookie() // Save cart after modification
	}
}

function updateCartPreview() {
	const container = document.getElementById("cart-items")
	const totalDisplay = document.getElementById("cart-total")
	container.innerHTML = ""
	let total = 0

	Object.keys(cart).forEach((index) => {
		const item = productList[index]
		const qty = cart[index]
		const subtotal = qty * item.price
		total += subtotal

		const div = document.createElement("div")
		div.className = "cart-item"
		div.innerHTML = `${item.name} x ${qty} = $${subtotal.toFixed(2)}`
		container.appendChild(div)
	})

	totalDisplay.textContent = total.toFixed(2)
}

// --- Initial Page Load Sequence ---
document.addEventListener("DOMContentLoaded", () => {
	// Fetch product data from the JSON file
	fetch("products.json")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok " + response.statusText)
			}
			return response.json()
		})
		.then((data) => {
			productList = data // Assign the fetched data to the global productList

			// Now that products are loaded, initialize the rest of the page
			loadCartFromCookie()
			renderProducts()
			updateProductViews()

			// Setup event listeners that depend on productList
			setupEventListeners()
		})
		.catch((error) => {
			console.error("Error fetching products:", error)
			const grid = document.getElementById("product-grid")
			if (grid) {
				grid.innerHTML = '<p style="text-align: center; color: red;">Could not load products. Please try again later.</p>'
			}
		})
})

// Function to setup event listeners after products are loaded
function setupEventListeners() {
	// Search functionality
	const searchBar = document.getElementById("search-bar")
	if (searchBar) {
		searchBar.addEventListener("input", function () {
			const query = this.value.toLowerCase()
			const filtered = productList.filter((item) => item.name.toLowerCase().includes(query))
			renderProducts(filtered)
			updateProductViews() // Re-apply quantity displays after filtering
		})
	}

	// Category filter
	const categoryLinks = document.querySelectorAll(".category-nav a")
	categoryLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault()
			const category = this.textContent.trim().toUpperCase()
			if (category === "VIEW ALL") {
				renderProducts(productList)
			} else if (category === "FROM 70% OFF") {
				renderProducts(productList.filter((item) => item.discount === "-70%"))
			} else {
				renderProducts(productList.filter((item) => item.category === category))
			}
			updateProductViews() // Re-apply quantity displays after filtering
		})
	})
}
