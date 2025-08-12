// --- Functions for the Order History Page (order.html) ---

function renderOrderHistory() {
	console.log("Attempting to render order history...")

	const container = document.getElementById("order-list-container")
	if (!container) {
		console.error("Error: Could not find the '#order-list-container' element on the page.")
		return
	}

	const orderHistoryCookie = getCookie("orderHistory")
	console.log("Raw orderHistory cookie string:", orderHistoryCookie)

	if (!orderHistoryCookie) {
		container.innerHTML = "<p class='no-orders-message'>You have no past orders.</p>"
		console.log("No order history cookie found. Displaying 'no orders' message.")
		return
	}

	let orderHistory = []
	try {
		orderHistory = JSON.parse(orderHistoryCookie)
		console.log("Successfully parsed order history:", orderHistory)
	} catch (error) {
		console.error("Error parsing order history cookie. The cookie might be corrupt.", error)
		container.innerHTML = "<p class='no-orders-message'>Could not load order history.</p>"
		return
	}

	if (!Array.isArray(orderHistory) || orderHistory.length === 0) {
		container.innerHTML = "<p class='no-orders-message'>You have no past orders.</p>"
		console.log("Order history is empty. Displaying 'no orders' message.")
		return
	}

	// Clear the container before adding new elements
	container.innerHTML = ""

	// .reverse() shows the newest order first
	orderHistory.reverse().forEach((order) => {
		console.log("Processing order #:", order.orderNumber)

		const orderCard = document.createElement("div")
		orderCard.className = "order-card"

		const orderDate = new Date(order.orderDate).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		})

		let itemsHtml = ""
		if (order.items && typeof order.items === "object") {
			for (const [index, qty] of Object.entries(order.items)) {
				const product = productList[index]
				if (product) {
					console.log(`Found product for index ${index}:`, product.name)
					itemsHtml += `
						<div class="order-item">
							<img src="${product.img}" alt="${product.name}">
							<div class="item-details">
								<span class="item-name">${product.name}</span>
								<span class="item-qty">Quantity: ${qty}</span>
							</div>
							<span class="item-price">$${(product.price * qty).toFixed(2)}</span>
						</div>
					`
				} else {
					console.warn(`Warning: Product with index ${index} not found in productList.`)
				}
			}
		}

		orderCard.innerHTML = `
			<div class="order-header">
				<div>
					<span class="header-label">ORDER PLACED</span>
					<span>${orderDate}</span>
				</div>
				<div>
					<span class="header-label">TOTAL</span>
					<span>${order.total}</span>
				</div>
				<div>
					<span class="header-label">SHIPPED TO</span>
					<span>${order.firstName} ${order.lastName}</span>
				</div>
				<div>
					<span class="header-label">ORDER #</span>
					<span>${order.orderNumber || "N/A"}</span>
				</div>
			</div>
			<div class="order-body">
				${itemsHtml}
			</div>
		`
		container.appendChild(orderCard)
	})
}

// --- Initialize Order History Page ---
document.addEventListener("coreDataLoaded", () => {
	console.log("'coreDataLoaded' event received. Product list should be ready.")
	if (document.getElementById("order-history-page")) {
		renderOrderHistory()
	}
})

// A fallback in case the event listener doesn't fire for some reason
window.addEventListener("load", () => {
	// A small delay to ensure coreDataLoaded has a chance to run first
	setTimeout(() => {
		const container = document.getElementById("order-list-container")
		// If the container is still empty, it means renderOrderHistory was never called
		if (container && container.innerHTML.trim() === "") {
			console.warn("Fallback triggered: 'coreDataLoaded' event may not have fired. Trying to render history now.")
			renderOrderHistory()
		}
	}, 500)
})
