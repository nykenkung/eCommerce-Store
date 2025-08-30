// Apple Pay Integration
function initializeApplePay(total) {
	const applePayContainer = document.getElementById("apple-pay")
	let buttonContainer = document.getElementById("apple-pay-button-container")
	if (!buttonContainer) {
		applePayContainer.innerHTML = `
            <div id="apple-pay-button-container"></div>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">
                Pay quickly and securely with Apple Pay!
            </p>
        `
		buttonContainer = document.getElementById("apple-pay-button-container")
	}

	if (false && (!window.ApplePaySession || !ApplePaySession.canMakePayments())) {
		buttonContainer.innerHTML = `<p style="color: #666; text-align: center;">Apple Pay is not available on this device or browser!</p>`
		return
	}
	const button = document.createElement("apple-pay-button")
	button.setAttribute("buttonstyle", "white-outline")
	button.setAttribute("type", "pay")
	button.setAttribute("locale", "en-US")
	button.style.width = "100%"
	button.style.height = "40px"
	button.style.setProperty("--apple-pay-button-border-radius", "100px")
	buttonContainer.style.display = "flex"
	buttonContainer.style.justifyContent = "center"

	button.addEventListener("click", function () {
		if (!validateShippingForm()) return

		const paymentRequest = {
			countryCode: "US",
			currencyCode: "USD",
			total: {
				label: APPLE_PAY_CONFIG.merchantName, // Use config for Merchant Name
				amount: total.toFixed(2),
			},
			supportedNetworks: ["visa", "masterCard", "amex", "discover"],
			merchantCapabilities: ["supports3DS"],
		}

		const session = new ApplePaySession(3, paymentRequest)

		session.onvalidatemerchant = async (event) => {
			try {
				const response = await fetch(`${apiBaseUrl}/apple-merchant`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ validationURL: event.validationURL }),
				})
				const merchantSession = await response.json()
				session.completeMerchantValidation(merchantSession)
			} catch (error) {
				console.error("Apple Pay merchant validation failed:", error)
				session.abort()
			}
		}

		session.onpaymentauthorized = (event) => {
			const payment = event.payment
			console.log("Apple Pay payment authorized:", payment)
			processPaymentSuccess("apple-pay", payment)
			session.completePayment(ApplePaySession.STATUS_SUCCESS)
		}
		session.oncancel = () => {
			console.log("Apple Pay cancelled")
			showModal("Payment Cancelled", "Your Apple Pay payment was cancelled!")
		}
		session.begin()
	})

	buttonContainer.innerHTML = ""
	buttonContainer.appendChild(button)
}
