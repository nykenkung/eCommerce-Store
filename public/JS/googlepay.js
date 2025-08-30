// Google Pay callback
function onGooglePayLoaded() {
	console.log("Google Pay SDK loaded!")
}

// Google Pay Integration
let googlePayClientInstance = null

function initializeGooglePay(total) {
	const googlePayContainer = document.getElementById("google-pay")
	let buttonContainer = document.getElementById("google-pay-button-container")

	// If the button container doesn't exist, create the basic structure for it.
	if (!buttonContainer) {
		googlePayContainer.innerHTML = `
            <div id="google-pay-button-container"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">
                Pay securely with Google Pay using your saved payment methods!
            </p>
        `
		buttonContainer = document.getElementById("google-pay-button-container")
	}

	// Check if the Google Pay API is available. If not, display an error and exit.
	if (typeof google === "undefined" || !google.payments || !google.payments.api) {
		buttonContainer.innerHTML = `<p style="color: red; text-align: center;">Google Pay SDK could not be loaded. Please refresh the page!</p>`
		return
	}

	// Initialize the PaymentsClient once and reuse it.
	if (!googlePayClientInstance) {
		// GOOGLE_PAY_CONFIG globally available from api-config.js
		if (typeof GOOGLE_PAY_CONFIG === "undefined") {
			console.error("GOOGLE_PAY_CONFIG for Google Pay is not defined.")
			buttonContainer.innerHTML = `<p style="color: red; text-align: center;">Google Pay is not configured!</p>`
			return
		}
		googlePayClientInstance = new google.payments.api.PaymentsClient({
			environment: GOOGLE_PAY_CONFIG.environment,
		})
	}

	// Define the payment data request.
	const paymentDataRequest = {
		apiVersion: 2,
		apiVersionMinor: 0,
		allowedPaymentMethods: [
			{
				type: "CARD",
				parameters: {
					allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
					allowedCardNetworks: ["MASTERCARD", "VISA", "AMEX", "DISCOVER"],
				},
				tokenizationSpecification: {
					type: "PAYMENT_GATEWAY",
					parameters: {
						gateway: "example",
						gatewayMerchantId: "exampleGatewayMerchantId",
					},
				},
			},
		],
		merchantInfo: {
			merchantId: GOOGLE_PAY_CONFIG.merchantId,
			merchantName: GOOGLE_PAY_CONFIG.merchantName,
		},
		transactionInfo: {
			totalPriceStatus: "FINAL",
			totalPrice: total.toFixed(2),
			currencyCode: "USD",
		},
	}

	// Check if the user is ready to pay.
	googlePayClientInstance
		.isReadyToPay({
			apiVersion: 2,
			apiVersionMinor: 0,
			allowedPaymentMethods: paymentDataRequest.allowedPaymentMethods,
		})
		.then(function (response) {
			if (response.result) {
				// Create the Google Pay button.
				const button = googlePayClientInstance.createButton({
					onClick: function () {
						if (!validateShippingForm()) return
						googlePayClientInstance
							.loadPaymentData(paymentDataRequest)
							.then(function (paymentData) {
								console.log("Google Pay payment successful:", paymentData)
								processPaymentSuccess("google-pay", paymentData)
							})
							.catch(function (error) {
								console.error("Google Pay payment error:", error)
								// Only show error modal if it wasn't a user cancellation
								if (error.statusCode !== "CANCELED") {
									showModal("Payment Error", "There was an error processing your Google Pay payment! Please try again.")
								} else {
									showModal("Payment Cancelled", "Your Google Pay payment was cancelled!")
								}
							})
					},
					// You can add other button options here, e.g., buttonColor, buttonType
				})
				// Add the button to the container.
				buttonContainer.innerHTML = ""
				buttonContainer.appendChild(button)
			} else {
				// Google Pay is not available.
				buttonContainer.innerHTML = `<p style="color: #666; text-align: center;">Google Pay is not available on this device orbrowser!</p>`
			}
		})
		.catch(function (error) {
			console.error("Google Pay initialization error:", error)
			buttonContainer.innerHTML = `<p style="color: red; text-align: center;">Error initializing Google Pay. Please try another payment method!</p>`
		})
}
