// --- Functions for the Order History Page (order.html) ---

/**
 * Fetches and renders the order history for the logged-in user.
 */
async function renderOrderHistory() {
	const container = document.getElementById("order-list-container")
	if (!container) {
		console.error("Error: Could not find the '#order-list-container' element.")
		return
	}

	const token = localStorage.getItem("authToken")
	if (!token) {
		container.innerHTML = "<p class='no-orders-message'>Please <a href='login.html'>log in</a> to view your order history.</p>"
		return
	}

	// Show a loading message while fetching data.
	container.innerHTML = "<p>Loading your order history...</p>"

	try {
		const response = await fetch(`${config.apiBaseUrl}/order`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`, // Authenticate the request with the JWT
			},
		})

		if (!response.ok) {
			const errorResult = await response.json()
			// If token is invalid/expired, prompt user to log in again.
			if (response.status === 401 || response.status === 400) {
				throw new Error("Your session has expired. Please <a href='login.html'>log in</a> again.")
			}
			throw new Error(errorResult.message || "Failed to fetch orders.")
		}

		const orderHistory = await response.json()

		if (!Array.isArray(orderHistory) || orderHistory.length === 0) {
			container.innerHTML = "<p class='no-orders-message'>You have no past orders. <a href='shop.html'>Start shopping!</a></p>"
			return
		}

		// Clear the loading message.
		container.innerHTML = ""

		// Iterate over the fetched orders and create a card for each one.
		orderHistory.forEach((order) => {
			const orderCard = document.createElement("div")
			orderCard.className = "order-card"

			const orderDate = new Date(order.orderDate).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})

			// Build the HTML for the items in the order.
			// It's crucial that productList is loaded from cart-core.js before this runs.
			let itemsHtml = ""
			if (order.items && typeof order.items === "object" && productList.length > 0) {
				for (const [index, qty] of Object.entries(order.items)) {
					const product = productList[index]
					if (product) {
						itemsHtml += `
                            <div class="order-item">
                                <img src="${product.img}" alt="${product.name}">
                                <div class="item-details">
                                    <span class="item-name">${product.name}</span>
                                    <span class="item-qty">Quantity: ${qty}</span>
                                </div>
                                <span class="item-price">$${(product.price * qty).toFixed(2)}</span>
                            </div>`
					}
				}
			}

			// Build the full order card HTML.
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
                        <span>${order.shippingDetails.firstName} ${order.shippingDetails.lastName}</span>
                    </div>
                    <div>
                        <span class="header-label">ORDER #</span>
                        <span>${order.orderNumber}</span>
                    </div>
                </div>
                <div class="order-body">${itemsHtml || "<p>Item details not available.</p>"}</div>`
			container.appendChild(orderCard)
		})
	} catch (error) {
		console.error("Error fetching order history:", error)
		container.innerHTML = `<p class='no-orders-message'>Could not load order history. ${error.message}</p>`
	}
}

// --- Initialize Order History Page ---
// This event comes from cart-core.js and ensures the product list is loaded before we try to render orders.
document.addEventListener("coreDataLoaded", () => {
	if (document.getElementById("order-history-page")) {
		renderOrderHistory()
	}
})
