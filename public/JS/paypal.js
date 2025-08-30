// PayPal Integration with dynamic SDK loading
let paypalButtonsInstance = null
let isPayPalSDKLoading = false

// Renders the PayPal buttons once the SDK is available
function renderPayPalButtons(total) {
	const paypalContainer = document.getElementById("paypal-button-container")
	if (!paypalContainer) {
		document.getElementById("paypal").innerHTML = `
            <div id="paypal-button-container"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">
                Secure payment with PayPal. You'll be redirected to complete your purchase.
            </p>
        `
	}
	if (paypalButtonsInstance) {
		paypalButtonsInstance.close()
	}

	paypalButtonsInstance = paypal.Buttons({
		createOrder: function (data, actions) {
			return actions.order.create({
				purchase_units: [
					{
						amount: {
							value: total.toFixed(2),
							currency_code: "USD",
						},
						description: "3140 Active Wear Purchase",
					},
				],
			})
		},
		onApprove: function (data, actions) {
			return actions.order.capture().then(function (details) {
				console.log("PayPal payment successful:", details)
				processPaymentSuccess("paypal", details)
			})
		},
		onError: function (error) {
			console.error("PayPal payment error:", error)
			showModal("Payment Error", "There was an error processing your PayPal payment. Please try again!")
		},
		onCancel: function (data) {
			console.log("PayPal payment cancelled:", data)
			showModal("Payment Cancelled", "Your PayPal payment was cancelled!")
		},
	})
	paypalButtonsInstance.render("#paypal-button-container")
}

// Main initialization function that loads the SDK if needed
function initializePayPal(total) {
	// If SDK is already loaded, just render the buttons
	if (typeof paypal !== "undefined") {
		renderPayPalButtons(total)
		return
	}

	// Prevent injecting the script multiple times if called while loading
	if (isPayPalSDKLoading) {
		return
	}

	// Check that the Client ID is configured in api-config.js
	if (typeof PAYPAL_CLIENT_ID === "undefined") {
		console.error("PayPal Client ID is not defined in api-config.js")
		document.getElementById("paypal").innerHTML = `<p style="color: red; text-align: center;">PayPal is not configured.</p>`
		return
	}

	isPayPalSDKLoading = true
	document.getElementById("paypal").innerHTML = `<p style="text-align: center; color: #666;">Loading PayPal...</p>`

	// Create and inject the PayPal SDK script tag into the page
	const script = document.createElement("script")
	script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`

	script.onload = () => {
		console.log("PayPal SDK loaded successfully.")
		isPayPalSDKLoading = false
		renderPayPalButtons(total) // Now that the SDK is loaded, render the buttons
	}

	script.onerror = () => {
		console.error("Failed to load the PayPal SDK.")
		isPayPalSDKLoading = false
		document.getElementById("paypal").innerHTML = `<p style="color: red; text-align: center;">Failed to load PayPal. Please refresh the page.</p>`
	}

	document.head.appendChild(script)
}
