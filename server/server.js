// --- Dependencies ---
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config() // To read variables from a .env file

// --- Express App Initialization ---
const app = express()
const PORT = process.env.PORT || 3000

// --- Middleware ---
// Configure CORS to allow requests from the frontend origin and to handle credentials (cookies).
const corsOptions = {
	origin: (origin, callback) => {
		callback(null, true)
	}, // Always approve the CORS request from any local
	// origin: process.env.ORIGIN_URL,	// Only allow CORS request from specific URL
	credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json()) // To parse incoming JSON request bodies
app.use(cookieParser()) // To parse cookies from incoming requests

// --- MongoDB Connection ---
const mongoURI = process.env.MONGO_URI
mongoose
	.connect(mongoURI)
	.then(() => console.log("Successfully connected to MongoDB."))
	.catch((err) => console.error("MongoDB connection error:", err))

// --- User Schema and Model ---
const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
)
const User = mongoose.model("User", userSchema)

// --- API Routes ---
/* @route   GET /check-auth
 * @desc    Verify user's login status based on the presence of the 'loggedIn' cookie.
 * @access  Public */
app.get("/check-auth", async (req, res) => {
	try {
		// Check if the 'loggedIn' cookie exists in the request.
		if (req.cookies.loggedIn) {
			// If it exists, the user is considered authenticated.
			return res.status(200).json({ loggedIn: true })
		}
		// If the cookie doesn't exist, the user is not authenticated.
		res.status(200).json({ loggedIn: false })
	} catch (error) {
		console.error("Auth check error:", error)
		res.status(500).json({ message: "Server error during authorization check!" })
	}
})

/* @route   GET /logout
 * @desc    Handle user logout by clearing the cookie.
 * @access  Public */
app.get("/logout", (req, res) => {
	try {
		// To clear a cookie, you must provide the same options with which it was set.
		res.clearCookie("loggedIn", {
			httpOnly: true,
			secure: true,
			sameSite: "None",
		})
		// Respond with a success message in JSON format.
		res.status(200).json({ message: "You have been successfully logged out!" })
	} catch (error) {
		console.error("Logout error:", error)
		res.status(500).json({ message: "Server error during logout!" })
	}
})

/* @route   POST /register
 * @desc    Handle new user registration.
 * @access  Public */
app.post("/register", async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body

		// --- Validation ---
		if (!firstName || !lastName || !email || !password) {
			return res.status(400).json({ message: "All fields are required!" })
		}
		if (password.length < 4) {
			return res.status(400).json({ message: "Password must be at least 4 characters long!" })
		}

		// Check if a user with the given email already exists.
		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return res.status(409).json({ message: "An account with this email already exists!" })
		}

		// Hash the password before saving it to the database.
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		// Create and save the new user.
		const newUser = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
		})
		await newUser.save()

		// Corrected line: Use `newUser` instead of `user`
		res.status(201).json({ message: `Dear ${newUser.firstName} ${newUser.lastName}, your registration is successful. Please log in!` })
	} catch (error) {
		console.error("Registration server error:", error)
		res.status(500).json({ message: "Server error during registration!" })
	}
})

/* @route   POST /login
 * @desc    Handle user login and set an HTTP-only cookie upon success.
 * @access  Public */
app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required!" })
		}

		// Find the user by email.
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(401).json({ message: `The user ${email} could not be found!` })
		}

		// Compare the provided password with the hashed password in the database.
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(401).json({ message: "Wrong Password entered!" })
		}
		// If credentials are valid, set the cookie.
		// These settings are crucial for security and cross-origin functionality.
		res.cookie("loggedIn", user._id, {
			httpOnly: true, // Prevents client-side JS from accessing the cookie.
			secure: true, // Ensures the cookie is sent only over HTTPS.
			sameSite: "None", // Required for cross-origin cookie setting.
			maxAge: 24 * 60 * 60 * 1000, // Expires in 1 day.
		})
		console.log("Cookie should be set for user:", user.firstName, " ", user.lastName)
		res.status(200).json({ message: `Welcome back, ${user.firstName} ${user.lastName}!` })
	} catch (error) {
		console.error("Login server error:", error)
		res.status(500).json({ message: "Server error during login!" })
	}
})

// --- Developmental Routes (Disabled in Production) ---
if (process.env.NODE_ENV !== "production") {
	console.log("Developmental routes are enabled.")
	/* @route   GET /users
	 * @desc    Get all users from the database.
	 * @access  Development-only */
	app.get("/users", async (req, res) => {
		try {
			// Find all users and exclude the password field for security.
			const users = await User.find().select("-password")
			res.status(200).json(users)
		} catch (error) {
			console.error("Error fetching users:", error)
			res.status(500).json({ message: "Server error while fetching users." })
		}
	})
	/* @route   GET /cookies
	 * @desc    Get all cookies sent with the request.
	 * @access  Development-only */
	app.get("/cookies", (req, res) => {
		try {
			// The cookie-parser middleware populates req.cookies with the cookies from the request.
			res.status(200).json(req.cookies)
		} catch (error) {
			console.error("Error fetching cookies:", error)
			res.status(500).json({ message: "Server error while fetching cookies." })
		}
	})
}

/* --- HTTP Server Setup ---
app.listen(PORT, () => {
	console.log(`Backend Server is now running on http://127.0.0.1:${PORT}`)
	console.log(`Accepting requests from origin: ${process.env.ORIGIN_URL}`)
	console.log(`Accessing MongoDB on: ${process.env.MONGO_URI}`)
}) --- */

// --- HTTPS Server Setup ---
const https = require("https")
const fs = require("fs")
const httpsOptions = {
	key: fs.readFileSync("server.key"),
	cert: fs.readFileSync("server.cert"),
}
https.createServer(httpsOptions, app).listen(PORT, () => {
	console.log(`Backend Server is now running on https://127.0.0.1:${PORT}`)
	// Log the current environment
	console.log(`Current environment: ${process.env.NODE_ENV || "development"}`)
	console.log(`Accepting requests from origin: ${process.env.ORIGIN_URL}`)
	console.log(`Accessing MongoDB on: ${process.env.MONGO_URI}`)
})
