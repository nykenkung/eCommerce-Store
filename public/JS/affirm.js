// Affirm configuration
;(function (l, g, m, e, a, f, b) {
	var d,
		c = l[a] || (l[a] = {}),
		h = document.createElement(f),
		n = document.getElementsByTagName(f)[0],
		k = function (a, b, c) {
			return function () {
				a[b]._.push([c, arguments])
			}
		}
	c[e] = k(c, e, "set")
	d = c[e]
	c[g] = k(c, g, "require")
	c[f] = k(c, f, "load")
	for (var b = 0; b < m.length; b++) d._.push([m[b], []])
	// Use 'i' for the loop variable instead of 'b'
	// for (var i = 0; i < m.length; i++) d._.push([m[i], []])
	h.async = !0
	h.src = b
	n.parentNode.insertBefore(h, n)
})(window, "affirm", "checkout ui", _affirm_config.public_api_key, "_affirm", _affirm_config.script, "script")

// Affirm Integration
function initializeAffirm(total) {
	const affirmContainer = document.getElementById("affirm-button-container")
	if (!affirmContainer) {
		document.getElementById("affirm").innerHTML = `
            <div id="affirm-button-container"></div>
            <div id="affirm-promo-container" style="margin-top: 10px;"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">Pay over time with flexible payment plans. No hidden fees.</p>
        `
	}
	if (typeof affirm !== "undefined") {
		// Configure Affirm
		affirm.ui.ready(function () {
			// Create checkout data
			const checkoutData = {
				merchant: {
					user_confirmation_url: window.location.origin + "/index.html",
					user_cancel_url: window.location.origin + "/checkout.html",
					user_confirmation_url_action: "POST",
				},
				order_id: "ORDER_" + Date.now(),
				shipping_amount: 0, // Free shipping
				tax_amount: 0,
				total: Math.round(total * 100), // Affirm expects cents
				items: [],
			}
			// Add cart items to Affirm checkout data
			Object.keys(cart).forEach((index) => {
				const item = productList[index]
				if (item) {
					const qty = cart[index]
					checkoutData.items.push({
						display_name: item.name,
						sku: `ITEM_${index}`,
						unit_price: Math.round(item.price * 100), // Convert to cents
						qty: qty,
						item_image_url: window.location.origin + "/" + item.img,
						item_url: window.location.origin + "/shop.html",
					})
				}
			})
			// Create Affirm button
			const button = document.createElement("button")
			button.className = "affirm-payment-button"
			button.style.cssText = `
                width: 100%;
                height: 44px;
                background: #0176D3;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                font-weight: bold;
            `
			button.textContent = "Pay with Affirm"

			button.addEventListener("click", function () {
				if (!validateShippingForm()) return
				affirm.checkout(checkoutData)
			})
			const container = document.getElementById("affirm-button-container")
			container.innerHTML = ""
			container.appendChild(button)

			// Add promotional messaging
			const promoContainer = document.getElementById("affirm-promo-container")
			if (promoContainer && total >= 50) {
				affirm.ui.promo({
					promo_id: "default",
					amount: Math.round(total * 100),
					container: "#affirm-promo-container",
				})
			}
		})

		// Handle Affirm checkout callbacks
		affirm.checkout.success = function (checkoutToken) {
			console.log("Affirm checkout successful:", checkoutToken)
			processPaymentSuccess("affirm", { checkoutToken })
		}
		affirm.checkout.cancelled = function () {
			console.log("Affirm checkout cancelled")
			showModal("Payment Cancelled", "Your Affirm payment was cancelled!")
		}
		affirm.checkout.error = function (reason) {
			console.error("Affirm checkout error:", reason)
			showModal("Payment Error", "There was an error processing your Affirm payment! Please try again.")
		}
	} else {
		document.getElementById("affirm").innerHTML = `
            <p style="color: red; text-align: center;">Affirm SDK not loaded! Please refresh the page.</p>
        `
	}
}
