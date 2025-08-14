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
	// --- DOM Element References ---
	const loginForm = document.getElementById("login-form")
	const registerForm = document.getElementById("register-form")
	const recoveryButton = document.getElementById("send-recovery-email")
	const loginLogoutLink = document.getElementById("login-logout-link")
	const modal = document.getElementById("modal")

	// --- Event Handlers ---
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
				// *** Store the token in localStorage ***
				localStorage.setItem("authToken", result.token)
				showModal("Login Successful!", result.message, () => {
					window.location.href = "index.html"
				})
			} else {
				showModal("Login Failed!", result.message || "An unknown error occurred.")
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
		showModal("Confirm Logout?", "Are you sure you want to log out?", () => {
			// *** Remove the token from localStorage ***
			localStorage.removeItem("authToken")
			// Update UI immediately
			updateUIToLoggedOutState()
			// Show confirmation and then reload
			showModal("Logout Successful", "You have been successfully logged out.", () => {
				window.location.reload()
			})
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

	// --- UI Update Functions ---
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

	// --- Authentication Check ---
	const checkLoginStatus = () => {
		const token = localStorage.getItem("authToken")
		if (token) {
			// Here you could add a call to /api/check-auth to verify the token with the server
			// For now, we'll trust the token's existence.
			updateUIToLoggedInState()
		} else {
			updateUIToLoggedOutState()
		}
	}

	// --- Initialize Page ---
	if (loginForm) loginForm.addEventListener("submit", handleLogin)
	if (registerForm) registerForm.addEventListener("submit", handleRegister)
	if (recoveryButton) recoveryButton.addEventListener("click", handlePasswordRecovery)

	// Close modal on outside click
	if (modal) {
		window.addEventListener("click", (e) => {
			if (e.target === modal) {
				modal.classList.remove("active")
			}
		})
	}

	checkLoginStatus()
})
