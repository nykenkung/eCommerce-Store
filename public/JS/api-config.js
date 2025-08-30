// Automatically select the API URL based on the current hostname
// Use 127.0.0.1 (localhost) or empty string (local file), otherwise use online URL
const apiBaseUrl = window.location.hostname === "127.0.0.1"
|| window.location.hostname === "localhost"
|| window.location.hostname === ""
? "https://127.0.0.1:3000/api"
: "https://e-commerceproject-x4gr.onrender.com/api"

const product = `${apiBaseUrl}/product` // Fetch by JS/cart-preview.js
// const product = "products.json"		// Or use local products file

const PAYPAL_CLIENT_ID = "AYk6lFOBFe_nP98YJ7UvlGj-mS8lp32oXRIysMN9cuSMvFXsbbyavABiiqAfNmD1vFPdbymMSsLvRyud"

const GOOGLE_PAY_CONFIG = {
	environment: "TEST", // Use "PRODUCTION" for live transactions
	merchantId: "BCR2DN4TZCLPNAKX",
	merchantName: "3140 Active Wear",
}

_affirm_config = {
	public_api_key: "L21N0Y12W4Y5A4I4",
	script: "https://cdn1-sandbox.affirm.com/js/v2/affirm.js",
}
