// Automatically select the API URL based on the current hostname
// Will use local URL on 127.0.0.1 (localhost) or empty string (local file), otherwise use online URL
const config = {
	apiBaseUrl: window.location.hostname
	=== "127.0.0.1"|| window.location.hostname === "localhost"
	|| window.location.hostname === ""
	? "https://127.0.0.1:3000/api"
	: "https://e-commerceproject-x4gr.onrender.com/api",
}

const PAYMENT_CONFIG = {
	googlePay: {
		environment: "TEST", // Use "PRODUCTION" for live transactions
		merchantId: "12345678901234567890", // Replace with your Google Pay merchant ID
		merchantName: "3140 Active Wear",
	},
	applePay: {
		merchantIdentifier: "merchant.com.example.applepaydemo", // Replace with your registered merchant identifier
		merchantDisplayName: "3140 Active Wear",
		// Backend endpoint validate Apple Pay merchant with Apple's servers
		// merchantValidationUrl: POST /apple-merchant implement endpoint in server.js file
	},
	paypal: {
		// Replace with your PayPal Sandbox or Production Client ID
		clientId: "AYk6lFOBFe_nP98YJ7UvlGj-mS8lp32oXRIysMN9cuSMvFXsbbyavABiiqAfNmD1vFPdbymMSsLvRyud",
	},
}
