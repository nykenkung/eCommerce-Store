// Automatically select the API URL based on the current hostname
// Will use local URL on 127.0.0.1 (localhost) or empty string (local file), otherwise use online URL
const config = {
	apiBaseUrl: window.location.hostname
	=== "127.0.0.1" || window.location.hostname === "localhost"
	|| window.location.hostname === ""
	? "https://127.0.0.1:3000/api"
	: "https://e-commerceproject-x4gr.onrender.com/api",
}
const product = `${config.apiBaseUrl}/product` // Fetch from JS/cart-preview.js
// const product = "products.json"		// Or use local products file

const PAYMENT_CONFIG = {
	googlePay: {
		environment: "TEST", // Use "PRODUCTION" for live transactions
		merchantId: "BCR2DN4TZCLPNAKX",
		merchantName: "3140 Active Wear",
	},
	applePay: {
		merchantIdentifier: "merchant.com.example.applepaydemo",
		merchantDisplayName: "3140 Active Wear",
		// Backend endpoint validate Apple Pay merchant with Apple's servers
		// merchantValidationUrl: POST /apple-merchant implement endpoint in server.js file
	},
	paypal: {
		// Replace with your PayPal Sandbox or Production Client ID
		clientId: "AYk6lFOBFe_nP98YJ7UvlGj-mS8lp32oXRIysMN9cuSMvFXsbbyavABiiqAfNmD1vFPdbymMSsLvRyud",
	},
}
