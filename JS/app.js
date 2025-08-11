// All codes wrapped in one DOMContentLoaded listener.
document.addEventListener("DOMContentLoaded", () => {
	const config = {
		apiBaseUrl: "http://127.0.0.1:3000",
	}

	// --- DOM Element References ---
	const loginForm = document.getElementById("login-form")
	const registerForm = document.getElementById("register-form")
	const loginLogoutLink = document.getElementById("login-logout-link")
	const modal = document.getElementById("modal")
	const modalTitle = document.getElementById("modal-title")
	const modalMessage = document.getElementById("modal-message")
	const modalOkButton = document.getElementById("modal-ok-button")

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

	// --- UI Update Functions ---
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

	// --- Event Handlers ---
	const handleLoginLinkClick = () => true

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

	const handleLogin = async (event) => {
		event.preventDefault()
		const formData = new FormData(loginForm)
		const data = Object.fromEntries(formData.entries())
		try {
			const response = await fetch(`${config.apiBaseUrl}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
				credentials: "include",
			})
			const result = await response.json()
			if (response.ok) {
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

	const handleLogout = async (event) => {
		event.preventDefault()
		showModal("Confirm Logout?", "Are you sure you want to log out?")
		modalOkButton.onclick = async () => {
			try {
				await fetch(`${config.apiBaseUrl}/logout`, {
					credentials: "include",
				})
				updateUIToLoggedOutState()
				window.location.reload()
			} catch (error) {
				console.error("Logout Error:", error)
				showModal("Logout Failed", "An error occurred during logout. Please try again!")
			}
		}
	}

	// --- Authentication Check ---
	const checkLoginStatus = async () => {
		try {
			const response = await fetch(`${config.apiBaseUrl}/check-auth`, {
				method: "GET",
				credentials: "include",
			})
			if (!response.ok) {
				updateUIToLoggedOutState()
				return
			}
			const result = await response.json()
			if (result.loggedIn) {
				updateUIToLoggedInState()
			} else {
				updateUIToLoggedOutState()
			}
		} catch (error) {
			console.error("Authentication Check Error:", error)
			updateUIToLoggedOutState()
		}
	}

	// --- Initialize Page ---
	// Attach event listeners to forms if they exist on the page
	if (loginForm) loginForm.addEventListener("submit", handleLogin)
	if (registerForm) registerForm.addEventListener("submit", handleRegister)

	// Perform the initial login check when the page loads
	checkLoginStatus()
})
