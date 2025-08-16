/* Automatically select the API URL based on the current hostname
	If it's '127.0.0.1', 'localhost', or an empty string (local file), use the local URL
	Otherwise, use the online URL */
const config = {
	apiBaseUrl: window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost" || window.location.hostname === ""
	? "https://127.0.0.1:3000/api"
	: "https://e-commerceproject-x4gr.onrender.com/api"
}