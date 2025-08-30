// Credit card input formatting
document.addEventListener("DOMContentLoaded", function () {
	// Format card number input
	const cardNumberInput = document.getElementById("card-number")
	if (cardNumberInput) {
		cardNumberInput.addEventListener("input", function (e) {
			let value = e.target.value.replace(/\D/g, "")
			value = value.replace(/(\d{4})(?=\d)/g, "$1 ")
			e.target.value = value
		})
	}

	// Format expiry date input
	const cardExpiryInput = document.getElementById("card-expiry")
	if (cardExpiryInput) {
		cardExpiryInput.addEventListener("input", function (e) {
			let value = e.target.value.replace(/\D/g, "")
			if (value.length >= 2) {
				value = value.substring(0, 2) + " / " + value.substring(2, 4)
			}
			e.target.value = value
		})
	}

	// Format CVC input (numbers only)
	const cardCvcInput = document.getElementById("card-cvc")
	if (cardCvcInput) {
		cardCvcInput.addEventListener("input", function (e) {
			e.target.value = e.target.value.replace(/\D/g, "")
		})
	}
})

// Original credit card processing function
async function placeOrder() {
	const token = localStorage.getItem("authToken")
	if (!token) {
		showModal("Authentication Required", "Please log in to proceed to checkout! You will now be redirected to the login page.", () => {
			window.location.href = "login.html"
		})
		return
	}

	if (!validateShippingForm()) return

	const cardNumberInput = document.getElementById("card-number")
	const cardNumberValue = cardNumberInput.value.replace(/\s/g, "")
	showModal("Credit Card Payment", "In a real implementation, this would process your credit card through a secure payment processor.", () => {
		processPaymentSuccess("credit-card", {
			cardLast4: cardNumberValue.slice(-4), // Use the correct variable here
			cardType: "Credit Card",
		})
	})
}
