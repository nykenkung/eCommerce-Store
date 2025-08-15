// --- Functions for the Shop Page ---
function addToCart(index) {
	cart[index] = (cart[index] || 0) + 1 // Add or increment item
	recalculateTotalItems()
	saveCartToCookie()
	updateCartCount()
	updateCartPreview()
	updateProductViews() // Update the specific product card view
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
	renderProducts() // Re-render function shop.js
}

function renderProducts(filteredList = productList) {
	const grid = document.getElementById("product-grid")
	if (!grid) return
	grid.innerHTML = ""

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
			</div>`
		grid.appendChild(card)
	})
	updateProductViews()
}

function updateProductViews() {
	// First, hide all quantity controls
	document.querySelectorAll(".quantity-controls").forEach((el) => (el.style.display = "none"))

	// Then, show controls only for items in the cart
	for (const [index, qty] of Object.entries(cart)) {
		if (qty > 0) {
			const qtyControls = document.getElementById(`qty-controls-${index}`)
			const qtySpan = document.getElementById(`qty-${index}`)
			if (qtyControls && qtySpan) {
				qtyControls.style.display = "flex"
				qtySpan.textContent = qty
			}
		}
	}
}

function setupShopPageListeners() {
	const searchBar = document.getElementById("search-bar")
	if (searchBar) {
		searchBar.addEventListener("input", function () {
			const query = this.value.toLowerCase()
			const filtered = productList.filter((item) => item.name.toLowerCase().includes(query))
			renderProducts(filtered)
		})
	}

	const categoryLinks = document.querySelectorAll(".category-nav a")
	categoryLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault()
			const category = this.textContent.trim().toUpperCase()
			let filteredList = productList
			if (category === "FROM 70% OFF") {
				filteredList = productList.filter((item) => item.discount === "-70%")
			} else if (category !== "VIEW ALL") {
				filteredList = productList.filter((item) => item.category === category)
			}
			renderProducts(filteredList)
		})
	})
}

// --- Initialize Shop Page ---
document.addEventListener("coreDataLoaded", () => {
	if (document.getElementById("product-grid")) {
		renderProducts()
		setupShopPageListeners()
	}
})
