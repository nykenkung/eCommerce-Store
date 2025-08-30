// This function needs to be accessible globally by other scripts like checkout.js
function showModal(title, message, onOk) {
	const modal = document.getElementById("modal")
	const modalTitle = document.getElementById("modal-title")
	const modalMessage = document.getElementById("modal-message")
	const modalOkButton = document.getElementById("modal-ok-button")

	if (modal && modalTitle && modalMessage && modalOkButton) {
		modalTitle.textContent = title
		modalMessage.innerHTML = message // Use innerHTML to allow for links etc.
		modal.classList.add("active")

		// Set the action for the OK button, or default to just closing the modal
		modalOkButton.onclick = onOk || (() => modal.classList.remove("active"))
	}
}

document.addEventListener("DOMContentLoaded", () => {
	// DOM Element References
	const loginForm = document.getElementById("login-form")
	const registerForm = document.getElementById("register-form")
	const recoveryButton = document.getElementById("send-recovery-email")
	const loginLogoutLink = document.getElementById("login-logout-link")
	const modal = document.getElementById("modal")

	// Event Handlers
	const handleLogin = async (event) => {
		event.preventDefault()
		const formData = new FormData(loginForm)
		const data = Object.fromEntries(formData.entries())
		try {
			const response = await fetch(`${apiBaseUrl}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			})
			const result = await response.json()
			if (response.ok && result.token) {
				// Store token "authToken" in local storage
				localStorage.setItem("authToken", result.token)

				// Save the email to a cookie for 30 days
				setCookie("savedUserEmail", data.email, 30)

				// Merge shopping after login
				const guestCartCookie = getCookie("shoppingCart")
				if (guestCartCookie) {
					try {
						const guestCart = JSON.parse(guestCartCookie)
						// If the guest cart has items, send them to the server
						if (Object.keys(guestCart).length > 0) {
							await fetch(`${apiBaseUrl}/cart`, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${result.token}`,
								},
								// Send  entire guest cart to the server to merge
								body: JSON.stringify({ cart: guestCart }),
							})
						}
						// Clear the cookie after syncing
						setCookie("shoppingCart", "", -1)
					} catch (error) {
						console.error("Error parsing or syncing guest cart:", error)
					}
				}

				showModal("Login Successful!", result.message, () => {
					window.location.href = "index.html"
				})
			} else {
				showModal("Login Failed!", result.message || "An unknown error occurred!")
			}
		} catch (error) {
			console.error("Login Error:", error)
			showModal("Connection Error", "Could not connect to the server. Please try again later!")
		}
	}

	const handleRegister = async (event) => {
		event.preventDefault()
		const formData = new FormData(registerForm)
		const data = Object.fromEntries(formData.entries())
		try {
			const response = await fetch(`${apiBaseUrl}/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			})
			const result = await response.json()
			if (response.ok) {
				showModal("Registration Successful!", result.message, () => {
					document.getElementById("login-tab").click()
					document.getElementById("login-email").value = data.email
					registerForm.reset()
					document.getElementById("modal").classList.remove("active")
				})
			} else {
				showModal("Registration Failed", result.message)
			}
		} catch (error) {
			console.error("Registration Error:", error)
			showModal("Connection Error", "Could not connect to the server. Please try again later!")
		}
	}

	const handleLogout = (event) => {
		event.preventDefault()
		showModal("Confirm Logout?", "Are you sure you want to log out?", async () => {
			try {
				// Optionally to completely logout on server side
				await fetch(`${apiBaseUrl}/logout`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				})
			} catch (error) {
				console.error("Error calling logout API:", error)
				// Even if the API call fails, proceed with client-side logout
			} finally {
				// Remove token "authToken" from localStorage
				localStorage.removeItem("authToken")
				// Update UI immediately
				updateUIToLoggedOutState()
				showModal("Logout Successful", "You have been successfully logged out.", () => {
					window.location.reload()
				})
			}
		})
	}

	const handlePasswordRecovery = (event) => {
		event.preventDefault()
		const recoveryEmailInput = document.getElementById("recovery-email")
		if (recoveryEmailInput && recoveryEmailInput.checkValidity()) {
			showModal(`Password Recovery Instructions sent to ${recoveryEmailInput.value}`, `We just sent you an email with password recovery instructions. Please check your inbox to reset your password and login your account. If you don't see the email, be sure to check your spam folder.`)
		} else if (recoveryEmailInput) {
			recoveryEmailInput.reportValidity()
		}
	}

	// Update UI Functions
	const updateUIToLoggedInState = () => {
		if (loginLogoutLink) {
			loginLogoutLink.textContent = "Logout"
			loginLogoutLink.href = "#"
			loginLogoutLink.onclick = handleLogout // Use onclick to easily override
		}
	}

	const updateUIToLoggedOutState = () => {
		if (loginLogoutLink) {
			loginLogoutLink.textContent = "Login/Register"
			loginLogoutLink.href = "login.html"
			loginLogoutLink.onclick = null // Remove the logout handler
		}
	}

	// Authentication Check
	const checkLoginStatus = async () => {
		const token = localStorage.getItem("authToken")
		if (token) {
			try {
				// Validates token "authToken" in localStorage with server
				const response = await fetch(`${apiBaseUrl}/check-auth`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				if (response.ok) {
					updateUIToLoggedInState() // Token is valid, show "Logout"
				} else {
					localStorage.removeItem("authToken") // Token is invalid, remove from localStorage
					updateUIToLoggedOutState()
				}
			} catch (error) {
				console.error("Authentication check failed:", error)
				updateUIToLoggedOutState()
			}
		} else {
			updateUIToLoggedOutState()
		}
	}

	// Initialize Page
	if (loginForm) loginForm.addEventListener("submit", handleLogin)
	if (registerForm) registerForm.addEventListener("submit", handleRegister)
	if (recoveryButton) recoveryButton.addEventListener("click", handlePasswordRecovery)

	// Close modal on outside click
	if (modal) {
		window.addEventListener("click", (event) => {
			if (event.target === modal) {
				modal.classList.remove("active")
			}
		})
	}
	checkLoginStatus()
})
