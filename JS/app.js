// All codes wrapped in one DOMContentLoaded listener.
document.addEventListener("DOMContentLoaded", () => {
	// --- DOM Element References ---
	const loginForm = document.getElementById("login-form")
	const registerForm = document.getElementById("register-form")
	const recoveryButton = document.getElementById("send-recovery-email")
	const loginLogoutLink = document.getElementById("login-logout-link")
	const modal = document.getElementById("modal")
	const modalTitle = document.getElementById("modal-title")
	const modalMessage = document.getElementById("modal-message")
	const modalOkButton = document.getElementById("modal-ok-button")

	// --- Event Handlers ---
	const handleLoginLinkClick = () => true

	const handleLogin = async (event) => {
		event.preventDefault()
		const formData = new FormData(loginForm)
		const data = Object.fromEntries(formData.entries())
		try {
			const response = await fetch(`${config.apiBaseUrl}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			})
			const result = await response.json()
			if (response.ok && result.token) {
				// On successful login, save the token to localStorage.
				localStorage.setItem("authToken", result.token)
				updateUIToLoggedInState()
				showModal("Login Successful!", result.message)
				modalOkButton.onclick = () => {
					window.location.href = "index.html"
				}
			} else {
				showModal("Login Failed!", result.message)
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
			const response = await fetch(`${config.apiBaseUrl}/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			})
			const result = await response.json()
			if (response.ok) {
				showModal("Registration Successful!", result.message)
				modalOkButton.onclick = () => {
					modal.classList.remove("active")
					document.getElementById("login-tab").click()
					document.getElementById("login-email").value = data.email
					registerForm.reset()
				}
			} else {
				showModal("Registration Failed", result.message)
			}
		} catch (error) {
			console.error("Registration Error:", error)
			showModal("Connection Error", "Could not connect to the server. Please try again later!")
		}
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

	// --- Authentication Check ---
	const checkLoginStatus = () => {
		// Check for the auth token in localStorage instead of making an API call.
		const token = localStorage.getItem("authToken")
		if (token) {
			updateUIToLoggedInState()
		} else {
			updateUIToLoggedOutState()
		}
	}

	const updateUIToLoggedInState = () => {
		if (loginLogoutLink) {
			loginLogoutLink.textContent = "Logout"
			loginLogoutLink.href = "#"
			loginLogoutLink.removeEventListener("click", handleLoginLinkClick)
			loginLogoutLink.addEventListener("click", handleLogout)
		}
	}

	const updateUIToLoggedOutState = () => {
		if (loginLogoutLink) {
			loginLogoutLink.textContent = "Login/Register"
			loginLogoutLink.href = "login.html"
			loginLogoutLink.removeEventListener("click", handleLogout)
			loginLogoutLink.addEventListener("click", handleLoginLinkClick)
		}
	}

	const handleLogout = (event) => {
		event.preventDefault()
		showModal("Confirm Logout?", "Are you sure you want to log out?")

		// Define the action for the confirmation modal's "OK" button.
		modalOkButton.onclick = () => {
			// Remove the token from localStorage.
			localStorage.removeItem("authToken")
			// Update the UI immediately.
			updateUIToLoggedOutState()
			// Show a confirmation message.
			showModal("Logout Successful", "You have been successfully logged out!")
			// Set the "OK" button's action to reload the page to clear any sensitive state.
			modalOkButton.onclick = () => {
				window.location.reload()
			}
		}
	}

	/** --- Modal Functions ---
	 * Displays a message to the user in a popup modal.
	 * @param {string} title - The title for the modal window.
	 * @param {string} message - The message text to be displayed.
	 */
	const showModal = (title, message) => {
		if (modal && modalTitle && modalMessage && modalOkButton) {
			modalTitle.textContent = title
			modalMessage.textContent = message
			modal.classList.add("active")

			// Default "OK" button behavior is to just close the modal
			modalOkButton.onclick = () => {
				modal.classList.remove("active")
			}
		}
	}
	// Close the modal if the user clicks outside of the modal content.
	window.addEventListener("click", (e) => {
		if (e.target === modal) {
			modal.classList.remove("active")
		}
	})

	// --- Initialize Page ---
	// Attach event listeners to forms if they exist on the page
	if (loginForm) loginForm.addEventListener("submit", handleLogin)
	if (registerForm) registerForm.addEventListener("submit", handleRegister)
	if (recoveryButton) recoveryButton.addEventListener("click", handlePasswordRecovery)

	// Perform the initial login check when the page loads
	checkLoginStatus()
})
