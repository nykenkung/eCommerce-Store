// Configuration object for the API base URL.
const config = {
	apiBaseUrl: "http://127.0.0.1:3000",
}

// This event listener runs when the HTML document has been completely loaded.
document.addEventListener("DOMContentLoaded", () => {
	// --- DOM Element References ---
	const loginForm = document.getElementById("login-form")
	const registerForm = document.getElementById("register-form")
	const loginMessage = document.getElementById("login-message")
	const registerMessage = document.getElementById("register-message")
	const loginLogoutLink = document.getElementById("login-logout-link")

	// Checks the user's login status by making a request to the server.
	// This function is called on every page load to ensure the UI is up-to-date.
	const checkLoginStatus = async () => {
		try {
			const response = await fetch(`${config.apiBaseUrl}/check-auth`, {
				method: "GET",
				// 'credentials: include' is essential for sending the browser's cookies to the server.
				credentials: "include",
			})

			if (!response.ok) {
				// If the server responds with an error, assume logged out for safety.
				updateUIToLoggedOutState()
				return
			}

			const result = await response.json()

			// Update the UI based on the server's response.
			if (result.loggedIn) {
				updateUIToLoggedInState()
			} else {
				updateUIToLoggedOutState()
			}
		} catch (error) {
			console.error("Authentication Check Error:", error)
			// If the fetch fails (e.g., server is down), default to the logged-out state.
			updateUIToLoggedOutState()
		}
	}

	// --- UI Update Functions ---
	// Updates the navigation link to a "Logout" button.
	const updateUIToLoggedInState = () => {
		if (loginLogoutLink) {
			loginLogoutLink.textContent = "Logout"
			loginLogoutLink.href = "#" // Prevent navigation on click.
			// Remove any old event listeners and add the logout handler.
			loginLogoutLink.removeEventListener("click", handleLoginLinkClick)
			loginLogoutLink.addEventListener("click", handleLogout)
		}
	}

	// Updates the navigation link to a "Login/Register" link.
	const updateUIToLoggedOutState = () => {
		if (loginLogoutLink) {
			loginLogoutLink.textContent = "Login/Register"
			loginLogoutLink.href = "login.html" // Set the link back to the login page.
			// Remove any old event listeners and add the default navigation handler.
			loginLogoutLink.removeEventListener("click", handleLogout)
			loginLogoutLink.addEventListener("click", handleLoginLinkClick)
		}
	}

	// Default handler for the link when it says "Login/Register".
	// Allows the default link behavior (navigate to login.html).
	const handleLoginLinkClick = (event) => {
		return true
	}

	/**
	 * Displays a message to the user in a specified element.
	 * @param {HTMLElement} element - The HTML element where the message will be displayed.
	 * @param {string} text - The message text.
	 * @param {boolean} isError - If true, the message will be styled as an error.
	 */
	const showMessage = (element, text, isError = false) => {
		if (element) {
			element.textContent = text
			element.className = "message" // Reset classes
			element.classList.add(isError ? "error" : "success")
		}
	}

	// Handles the user registration form submission.
	const handleRegister = async (event) => {
		event.preventDefault() // Prevent the default form submission.
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
				showMessage(registerMessage, result.message)
				// After successful registration, switch to the login tab and pre-fill the email.
				setTimeout(() => {
					document.getElementById("login-tab").click()
					document.getElementById("login-email").value = data.email
				}, 2000)
			} else {
				showMessage(registerMessage, result.message, true)
			}
		} catch (error) {
			console.error("Registration Error:", error)
			showMessage(registerMessage, "Could not connect to the server. Please try again later.", true)
		}
	}

	// Handles the user login form submission.
	const handleLogin = async (event) => {
		event.preventDefault()
		const formData = new FormData(loginForm)
		const data = Object.fromEntries(formData.entries())

		try {
			const response = await fetch(`${config.apiBaseUrl}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
				// 'credentials: include' is crucial for the browser to receive and save the cookie from the server.
				credentials: "include",
			})

			const result = await response.json()

			if (response.ok) {
				showMessage(loginMessage, result.message)
				updateUIToLoggedInState()
				// Redirect to the home page after a short delay to show the success message.
				setTimeout(() => {
					window.location.href = "index.html"
				}, 1500)
			} else {
				showMessage(loginMessage, result.message, true)
			}
		} catch (error) {
			console.error("Login Error:", error)
			showMessage(loginMessage, "Could not connect to the server. Please try again later.", true)
		}
	}

	// Handles the user logout process.
	const handleLogout = async (event) => {
		event.preventDefault()
		try {
			await fetch(`${config.apiBaseUrl}/logout`, {
				// 'credentials: include' is necessary to send the cookie that needs to be cleared.
				credentials: "include",
			})

			updateUIToLoggedOutState()
			// Redirect to the login page after logout.
			window.location.href = "login.html"
		} catch (error) {
			console.error("Logout Error:", error)
			alert("Logout failed. Please try again.")
		}
	}

	// --- Attach Event Listeners ---
	if (loginForm) loginForm.addEventListener("submit", handleLogin)
	if (registerForm) registerForm.addEventListener("submit", handleRegister)

	// --- Initial Check on Page Load ---
	checkLoginStatus()
})
