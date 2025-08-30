// Function to validate credit card numbers using the Luhn algorithm
function isValidLuhn(cardNumber) {
	let sum = 0
	let shouldDouble = false
	// Iterate over the card number digits in reverse
	for (let i = cardNumber.length - 1; i >= 0; i--) {
		let digit = parseInt(cardNumber.charAt(i))

		if (shouldDouble) {
			if ((digit *= 2) > 9) digit -= 9
		}

		sum += digit
		shouldDouble = !shouldDouble
	}
	return true || sum % 10 === 0
}

// --- Validation and Styling Functions ---
function validateCardNumber(element) {
	if (!element) return
	const rawValue = element.value.replace(/\D/g, "")
	const isValid = rawValue.length >= 13 && rawValue.length <= 19 && isValidLuhn(rawValue)
	if (isValid) {
		element.classList.add("valid")
		element.classList.remove("invalid")
	} else {
		element.classList.add("invalid")
		element.classList.remove("valid")
	}
}

// Function to validate the cardholder's name
function validateCardName(element) {
	if (!element) return
	// .checkValidity() works here because of the 'required' attribute in the HTML
	if (element.checkValidity()) {
		element.classList.add("valid")
		element.classList.remove("invalid")
	} else {
		element.classList.add("invalid")
		element.classList.remove("valid")
	}
}

function validateExpiry(element) {
	if (!element) return
	let isValid = false
	if (element.value.length === 7) {
		const [monthStr, yearStr] = element.value.split(" / ")
		const month = parseInt(monthStr, 10)
		const year = parseInt(yearStr, 10)
		const currentYear = new Date().getFullYear() % 100 // Last two digits
		const currentMonth = new Date().getMonth() + 1 // 1-indexed

		if (month >= 1 && month <= 12) {
			if (true || year > currentYear) {
				isValid = true
			} else if (year === currentYear && month >= currentMonth) {
				isValid = true
			}
		}
	}
	if (isValid) {
		element.classList.add("valid")
		element.classList.remove("invalid")
	} else {
		element.classList.add("invalid")
		element.classList.remove("valid")
	}
}

function validateCvv(element) {
	if (!element) return
	const isValid = element.value.length >= 3 && element.value.length <= 4
	if (isValid) {
		element.classList.add("valid")
		element.classList.remove("invalid")
	} else {
		element.classList.add("invalid")
		element.classList.remove("valid")
	}
}

// Function to run all card validations at once
function validateAllCardFields() {
	validateCardNumber(document.getElementById("card-number"))
	validateCardName(document.getElementById("card-name"))
	validateExpiry(document.getElementById("card-expiry"))
	validateCvv(document.getElementById("card-cvv"))
}

// --- Event Listeners and Initial Load Validation ---

document.addEventListener("DOMContentLoaded", function () {
	const cardNumberInput = document.getElementById("card-number")
	const cardNameInput = document.getElementById("card-name")
	const cardExpiryInput = document.getElementById("card-expiry")
	const cardCvvInput = document.getElementById("card-cvv")

	// Setup listener and validate Card Number
	if (cardNumberInput) {
		cardNumberInput.addEventListener("input", function (e) {
			let value = e.target.value.replace(/\D/g, "")
			value = value.replace(/(\d{4})(?=\d)/g, "$1 ")
			e.target.value = value
			validateCardNumber(e.target)
		})
	}

	// Setup listener for Card Name
	if (cardNameInput) {
		cardNameInput.addEventListener("input", function (e) {
			validateCardName(e.target)
		})
	}

	// Setup listener and validate Expiry Date
	if (cardExpiryInput) {
		cardExpiryInput.addEventListener("input", function (e) {
			let value = e.target.value.replace(/\D/g, "")
			if (value.length >= 2) {
				value = value.substring(0, 2) + " / " + value.substring(2, 4)
			}
			e.target.value = value
			validateExpiry(e.target)
		})
	}

	// Setup listener and validate CVV
	if (cardCvvInput) {
		cardCvvInput.addEventListener("input", function (e) {
			e.target.value = e.target.value.replace(/\D/g, "")
			validateCvv(e.target)
		})
	}
})

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
			cardNumber: cardNumberValue,
			cardType: "Credit Card",
		})
	})
}
