// --- Functions for the Order History Page (order.html) ---
// Fetches and renders the order history for the logged-in user.
async function renderOrderHistory() {
	const container = document.getElementById("order-list-container")
	if (!container) {
		console.error("Error: Could not find the '#order-list-container' element.")
		return
	}

	container.innerHTML = "<p style='text-align: center; margin: 20px'>Loading your order history...</p>"

	const token = localStorage.getItem("authToken")
	try {
		const response = await fetch(`${config.apiBaseUrl}/order`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`, // Authenticate the request with the JWT
			},
		})

		if (!response.ok) {
			const errorResult = await response.json()
			// Token is invalid/expired
			if (response.status === 401 || response.status === 400) {
				throw new Error("Expired or invalid login session, please login to view your order history.")
			}
			throw new Error(errorResult.message || "Failed to fetch orders!")
		}

		const orderHistory = await response.json()
		if (!Array.isArray(orderHistory) || orderHistory.length === 0) {
			container.innerHTML = "<p style='text-align:center; font-size: 18px; color: #6c84a2; padding: 50px 0;'>You have no past orders.</p>"
			return
		}

		container.innerHTML = "" // Clear loading message
		orderHistory.forEach((order) => {
			const orderCard = document.createElement("div")
			orderCard.className = "order-card"

			const orderDate = new Date(order.orderDate).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})

			// Build HTML for order items
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

			// Build HTML for order card
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

                <div class="order-body">${itemsHtml || "<p style='text-align: center'>Item details not available!</p>"}</div>`
			container.appendChild(orderCard)
		})
	} catch (error) {
		console.error("Error fetching order history:", error)
		container.innerHTML = `<p style='text-align: center; margin: 20px'>Could not load order history! ${error.message}</p>`
	}
}

// Initialize Order History Page after core data is loaded
document.addEventListener("coreDataLoaded", () => {
	if (document.getElementById("order-history-page")) {
		// Check user login status
		const token = localStorage.getItem("authToken")
		if (!token) {
			showModal("Authentication Required", "Please log in to view your order history! You will now be redirected to the login page.", () => {
				window.location.href = "login.html"
			})
		}
		// Order history is empty
		if (productList.length === 0 && token) {
			showModal("Your order history is empty!", "Please add your first item to procees to checkout! You will now be redirected to the shop page.", () => {
				window.location.href = "shop.html"
			})
		}
		renderOrderHistory()
	}
})
