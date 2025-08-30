document.addEventListener("DOMContentLoaded", () => {
	const loginTab = document.getElementById("login-tab")
	const registerTab = document.getElementById("register-tab")
	const loginForm = document.getElementById("login-form")
	const registerForm = document.getElementById("register-form")
	const forgotPasswordLink = document.getElementById("forgot-password")
	const passwordRecoverySection = document.getElementById("password-recovery-section")

	// Autofill email from cookie if it exists
	const savedEmail = getCookie("savedUserEmail")
	if (savedEmail) {
		document.getElementById("login-email").value = savedEmail
	}

	loginTab.addEventListener("click", () => {
		loginTab.classList.add("active")
		registerTab.classList.remove("active")
		loginForm.classList.add("active")
		registerForm.classList.remove("active")
	})
	registerTab.addEventListener("click", () => {
		registerTab.classList.add("active")
		loginTab.classList.remove("active")
		registerForm.classList.add("active")
		loginForm.classList.remove("active")
	})
	forgotPasswordLink.addEventListener("click", (e) => {
		e.preventDefault()
		loginTab.style.display = "none"
		registerTab.style.display = "none"
		loginForm.style.display = "none"
		registerForm.style.display = "none"
		passwordRecoverySection.style.display = "block"
	})
})

document.querySelectorAll(".toggle-password").forEach((icon) => {
	icon.addEventListener("click", () => {
		const input = document.querySelector(icon.getAttribute("toggle"))
		const isPassword = input.type === "password"
		input.type = isPassword ? "text" : "password"
		icon.classList.toggle("fa-eye")
		icon.classList.toggle("fa-eye-slash")
	})
})
document.querySelectorAll("input").forEach((input) => {
	input.addEventListener("input", () => {
		if (input.checkValidity()) {
			input.classList.add("valid")
			input.classList.remove("invalid")
		} else {
			input.classList.add("invalid")
			input.classList.remove("valid")
		}
	})
})
