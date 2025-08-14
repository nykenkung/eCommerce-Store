// --- Dependencies ---
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken") // Import jsonwebtoken
const cors = require("cors")
require("dotenv").config() // To read variables from a .env file

// --- Express App Initialization ---
const app = express()
const PORT = process.env.PORT || 3000

// --- Middleware ---
// Configure CORS to allow requests from the frontend origin.
const corsOptions = {
	origin: (origin, callback) => {
		callback(null, true) // Always approve CORS requests from any local origin
	},
	// origin: process.env.ORIGIN_URL, // Uncomment to restrict to a specific URL
	credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json()) // To parse incoming JSON request bodies

// --- MongoDB Connection ---
const mongoURI = process.env.MONGO_URI
mongoose
	.connect(mongoURI)
	.then(() => console.log("Successfully connected to MongoDB!"))
	.catch((err) => console.error("MongoDB connection error:", err))

// --- User Schema and Model ---
const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, default: false }, // Admin flag
	},
	{ timestamps: true }
)
const User = mongoose.model("User", userSchema)

// Order Schema
const orderSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		orderNumber: { type: String, required: true, unique: true },
		orderDate: { type: Date, default: Date.now },
		total: { type: String, required: true },
		items: { type: Object, required: true },
		shippingDetails: {
			firstName: String,
			lastName: String,
			email: String,
			phone: String,
			shippingAddress: Object,
			mailingAddress: mongoose.Schema.Types.Mixed, // Can be an object or a string
		},
	},
	{ timestamps: true }
)
const Order = mongoose.model("Order", orderSchema)
// --- JWT Verification Middleware ---
/* @middleware verifyToken
 * @desc     Verifies the JWT token from the Authorization header.
 */
const verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1] // Extract token from "Bearer <token>"

	if (!token) {
		return res.status(401).json({ message: "Access denied! No token provided!" })
	}

	try {
		// Verify the token using the secret key.
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decoded // Add the decoded user payload to the request object
		next()
	} catch (error) {
		console.error("Token verification error:", error)
		res.status(403).json({ message: "Invalid or expired toke!" })
	}
}

/* @middleware verifyAdmin
 * @desc     Checks if the authenticated user is an administrator.
 * This middleware must run *after* verifyToken.
 */
const verifyAdmin = (req, res, next) => {
	// The req.user object is attached by the verifyToken middleware.
	if (!req.user || !req.user.isAdmin) {
		return res.status(403).json({ message: "Access denied: Administrator only!" })
	}
	next() // User is an admin, proceed to the route handler.
}

// --- API Routes ---
/* @route   POST /api/register
 * @desc    Handle new user registration.
 * @access  Public */
app.post("/api/register", async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body

		// --- Validation ---
		if (!firstName || !lastName || !email || !password) {
			return res.status(400).json({ message: "All fields are required!" })
		}
		if (password.length < 4) {
			return res.status(400).json({ message: "Password must be at least 4 characters long!" })
		}

		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return res.status(409).json({ message: "An account with this email already exists!" })
		}

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const newUser = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
		})
		await newUser.save()
		res.status(201).json({ message: `Dear ${newUser.firstName} ${newUser.lastName}, your registration is successful. Please log in!` })
	} catch (error) {
		console.error("Registration server error:", error)
		res.status(500).json({ message: "Server error during registration!" })
	}
})

/* @route   POST /api/login
 * @desc    Handle user login and return a JWT.
 * @access  Public */
app.post("/api/login", async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required!" })
		}

		const user = await User.findOne({ email })
		if (!user) {
			return res.status(401).json({ message: `The user ${email} could not be found!` })
		}

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(401).json({ message: "Wrong Password entered!" })
		}

		// Create JWT payload
		const payload = {
			id: user._id,
			isAdmin: user.isAdmin,
		}

		// Sign the token
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1d", // Token expires in 24 hours
		})

		console.log("Token generated for user:", user.firstName, user.lastName)
		res.status(200).json({
			message: `Welcome back, ${user.firstName} ${user.lastName}!`,
			token: token, // Send the token to the client
		})
	} catch (error) {
		console.error("Login server error:", error)
		res.status(500).json({ message: "Server error during login!" })
	}
})

/* @route   GET /api/logout
 * @desc    Acknowledge user logout. The client is responsible for clearing the token.
 * @access  Public */
app.get("/api/logout", (req, res) => {
	// This endpoint is now primarily for acknowledgment.
	// The actual logout process (clearing the token) is handled client-side.
	res.status(200).json({ message: "You have been successfully logged out!" })
})

/* @route   GET /api/check-auth
 * @desc    Check if the user's token is valid.
 * @access  Private */
app.get("/api/check-auth", verifyToken, (req, res) => {
	// If verifyToken middleware passes, the user is authenticated.
	res.status(200).json({ isAuthenticated: true, user: req.user })
})

/* @route   GET /api/profile
 * @desc    Get the profile information for the logged-in user.
 * @access  Private */
app.get("/api/profile", verifyToken, async (req, res) => {
	try {
		// Find the user by the ID from the token, but exclude the password.
		const user = await User.findById(req.user.id).select("-password")
		if (!user) {
			return res.status(404).json({ message: "User not found!" })
		}
		res.status(200).json({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
		})
	} catch (error) {
		console.error("Profile fetch error:", error)
		res.status(500).json({ message: "Server error while fetching profile." })
	}
})

// --- NEW CART ROUTES ---

/* @route   GET /api/cart
 * @desc    Get the user's shopping cart from the database.
 * @access  Private */
app.get("/api/cart", verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
		if (!user) {
			return res.status(404).json({ message: "User not found!" })
		}
		res.status(200).json(user.cart || {})
	} catch (error) {
		console.error("Cart fetch error:", error)
		res.status(500).json({ message: "Server error while fetching cart." })
	}
})

/* @route   POST /api/cart
 * @desc    Update the user's shopping cart in the database.
 * @access  Private */
app.post("/api/cart", verifyToken, async (req, res) => {
	try {
		const { cart } = req.body // Expects the entire cart object
		if (typeof cart !== "object") {
			return res.status(400).json({ message: "Invalid cart format." })
		}
		// Find the user and update their cart.
		await User.findByIdAndUpdate(req.user.id, { cart: cart })
		res.status(200).json({ message: "Cart updated successfully!" })
	} catch (error) {
		console.error("Cart update error:", error)
		res.status(500).json({ message: "Server error while updating cart." })
	}
})

// Order Routes
/* @route   POST /api/order
 * @desc    Create a new order for the authenticated user.
 * @access  Private (requires token) */
app.post("/api/order", verifyToken, async (req, res) => {
	try {
		const { items, total, shippingDetails } = req.body
		const userId = req.user.id // Get user ID from the verified token

		// Generate a unique order number (e.g., timestamp + random part)
		const orderNumber = `${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`

		const newOrder = new Order({
			userId,
			orderNumber,
			items,
			total,
			shippingDetails,
		})

		await newOrder.save()
		res.status(201).json({ message: "Order placed successfully!", order: newOrder })
	} catch (error) {
		console.error("Order creation error:", error)
		res.status(500).json({ message: "Server error while placing order." })
	}
})

/* @route   GET /api/order
 * @desc    Get the order history for the authenticated user.
 * @access  Private (requires token) */
app.get("/api/order", verifyToken, async (req, res) => {
	try {
		const userId = req.user.id
		// Find all orders for the user and sort by the most recent date
		const orders = await Order.find({ userId }).sort({ orderDate: -1 })
		res.status(200).json(orders)
	} catch (error) {
		console.error("Error fetching order history:", error)
		res.status(500).json({ message: "Server error while fetching order history." })
	}
})

/* @route   GET /api/admin-dbs
 * @desc    Show all documents in the user and order collections.
 * @access  Administrator only */
app.get("/api/admin-dbs", verifyToken, verifyAdmin, async (req, res) => {
	try {
		// Fetch all documents from the User and Order collections simultaneously
		const [users, orders] = await Promise.all([
			User.find().select("-password"), // Get all users, exclude passwords
			Order.find(), // Get all orders
		])

		res.status(200).json({
			database: mongoose.connection.name,
			collections: {
				users: users,
				orders: orders,
			},
		})
	} catch (error) {
		console.error("DB data fetch error:", error)
		res.status(500).json({ message: "Server error while fetching database documents." })
	}
})

/* @route   GET /api/admin-reset
 * @desc    Drop all data and create a default admin account.
 * @access  Administrator only */
app.get("/api/admin-reset", verifyToken, verifyAdmin, async (req, res) => {
	try {
		// Drop collections
		await User.collection.drop()
		await Order.collection.drop()
		console.log("Dropped User and Order collections.")

		// Create default admin
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash("aaaa", salt)

		const adminUser = new User({
			firstName: "3140",
			lastName: "Administrator",
			email: "a@a",
			password: hashedPassword,
			isAdmin: true,
		})
		await adminUser.save()
		console.log("Default admin account created.")

		res.status(200).json({ message: "Database has been reset. All data deleted and a default admin account (a@a) has been created." })
	} catch (error) {
		// Handle case where collections might not exist
		if (error.code === 26) {
			// NamespaceNotFound error code
			console.log("Collections did not exist, proceeding to create admin.")
			// Re-run admin creation logic if collections didn't exist to be dropped
			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash("aaaa", salt)
			const adminUser = new User({
				firstName: "3140",
				lastName: "Administrator",
				email: "a@a",
				password: hashedPassword,
				isAdmin: true,
			})
			await adminUser.save()
			return res.status(200).json({ message: "Database has been reset. Default admin account (a@a) has been created." })
		}
		console.error("Admin reset error:", error)
		res.status(500).json({ message: "Server error during database reset." })
	}
})

// --- Server Startup ---
const os = require("os")
// Helper to get local IPv4 address
const localIP =
	Object.values(os.networkInterfaces())
		.flat()
		.find((iface) => iface.family === "IPv4" && !iface.internal)?.address || "127.0.0.1"

// --- HTTPS Server Setup ---
const https = require("https")
const fs = require("fs")

try {
	const httpsOptions = {
		key: fs.readFileSync("server.key"),
		cert: fs.readFileSync("server.cert"),
	}
	https.createServer(httpsOptions, app).listen(PORT, () => {
		console.log(`Running back-end server on https://${localIP}:${PORT}`)
		console.log(`Accepting requests from origin: ${process.env.ORIGIN_URL}`)
		console.log(`Accessing MongoDB on: ${process.env.MONGO_URI}`)
		if (!process.env.JWT_SECRET) {
			console.warn("Warning: JWT_SECRET is not set in your .env file. Please add a strong secret key!")
		}
	})
} catch (error) {
	console.error("Failed to start HTTPS server. Ensure server.key and server.cert exist!", error)
	console.log("Falling back to HTTP server.")
	app.listen(PORT, () => {
		console.log(`Running back-end server on http://${localIP}:${PORT}`)
		if (!process.env.JWT_SECRET) {
			console.warn("Warning: JWT_SECRET is not set in your .env file. Please add a strong secret key!")
		}
	})
}
