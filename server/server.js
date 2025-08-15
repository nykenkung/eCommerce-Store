// --- Dependencies ---
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const cors = require("cors")
const jwt = require("jsonwebtoken") // Import jsonwebtoken
require("dotenv").config() // To read variables from a .env file

// --- Express App Initialization ---
const app = express()
const PORT = process.env.PORT || 3000

// --- Middleware ---
const corsOptions = {
	origin: (origin, callback) => {
		// For development, allow all origins. In production, you should restrict this.
		callback(null, true)
	},
	// origin: process.env.ORIGIN_URL, // Use this for production
	credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())

// --- MongoDB Connection ---
const mongoURI = process.env.MONGO_URI
mongoose
	.connect(mongoURI)
	.then(() => console.log("Successfully connected to MongoDB!"))
	.catch((error) => console.error("MongoDB connection error:", error))

// --- Mongoose Schemas and Models ---

// User Schema
const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, default: false },
		cart: { type: Object, default: {} },
	},
	{ timestamps: true }
)
const User = mongoose.model("User", userSchema)

// Order Schema
const orderSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	items: { type: Object, required: true },
	total: { type: String, required: true },
	shippingDetails: { type: Object, required: true },
	orderNumber: { type: String, required: true, unique: true },
	orderDate: { type: Date, default: Date.now },
})
const Order = mongoose.model("Order", orderSchema)

// --- Authentication Middleware ---

/**
 * Middleware to verify JWT token from the Authorization header.
 * If valid, it attaches the user's data to the request object.
 */
const verifyToken = (req, res, next) => {
	console.log("Verifying token for a protected route!")
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

	if (!token) {
		console.log("Token verification failed: No token provided!")
		return res.status(401).json({ message: "Access denied. No token provided." })
	}

	try {
		// Verify the token using the secret key
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decoded // Add decoded user payload to request
		console.log("Token verified successfully!")
		next()
	} catch (error) {
		console.log("Token verification failed: Invalid token!")
		res.status(400).json({ message: "Invalid token." })
	}
}

/**
 * Middleware to verify if the user is an admin.
 * This should be used after verifyToken.
 */
const verifyAdmin = async (req, res, next) => {
	console.log("Verifying admin privileges!")
	try {
		const user = await User.findById(req.user.id)
		if (!user || !user.isAdmin) {
			console.log("Admin verification failed: User is not an admin!")
			return res.status(403).json({ message: "Access denied: Administrator only!" })
		}
		console.log("Admin verified successfully!")
		next()
	} catch (error) {
		console.error("Administrator verification error:", error)
		res.status(500).json({ message: "Server error during administrator verification!" })
	}
}

// --- API Routes ---

// Prefix all API routes with /api
const apiRouter = express.Router()

/* @route   GET /api/check-auth
 * @desc    This route can be used to verify a token from the client-side.
 * @access  Private (requires token) */
apiRouter.get("/check-auth", verifyToken, (req, res) => {
	console.log("Responding to authentication check request!")
	// If verifyToken middleware passes, the token is valid.
	try {
		if (req.user) {
			// User authenticated
			const { firstName, lastName, email } = req.user
			res.status(200).json({
				status: "success",
				message: `${firstName} ${lastName} (${email}) is authenticated!`,
				loggedIn: true,
				user: req.user,
			})
		} else {
			// Token invalid or user not found
			res.status(401).json({
				status: "fail",
				message: req.user ? `${req.user.firstName} ${req.user.lastName} (${req.user.email}) failed authentication!` : "Authentication failed: invalid token or missing credentials!",
				loggedIn: false,
			})
		}
	} catch (error) {
		// Unexpected server error
		console.error("Error during authentication check:", error)
		res.status(500).json({
			status: "error",
			message: "Internal server error during authentication check!",
			loggedIn: false,
		})
	}
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

/* @route   POST /api/register
 * @desc    Handle new user registration.
 * @access  Public */
apiRouter.post("/register", async (req, res) => {
	console.log("Processing new user registration request!")
	try {
		const { firstName, lastName, email, password } = req.body

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
		console.log(`User ${email} registered successfully!`)
		res.status(201).json({ message: `Dear ${newUser.firstName} ${newUser.lastName}, your registration is successful. Please log in!` })
	} catch (error) {
		console.error("Registration server error:", error)
		res.status(500).json({ message: "Server error during registration!" })
	}
})

/* @route   POST /api/login
 * @desc    Handle user login and return a JWT.
 * @access  Public */
apiRouter.post("/login", async (req, res) => {
	console.log("Processing user login request!")
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

		// Create JWT Payload
		const payload = {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			isAdmin: user.isAdmin,
		}

		// Sign the token
		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
		console.log(`User ${email} logged in successfully!`)
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

/* @route   GET /api/order
 * @desc    Get order history for the logged-in user.
 * @access  Private */
apiRouter.get("/order", verifyToken, async (req, res) => {
	console.log("Fetching order history for a user!")
	try {
		const userId = req.user.id
		const orders = await Order.find({ userId: userId }).sort({ orderDate: -1 }) // Get newest orders first
		console.log(`Found ${orders.length} orders for user ${userId}!`)
		res.status(200).json(orders)
	} catch (error) {
		console.error("Error fetching order history:", error)
		res.status(500).json({ message: "Server error while fetching order history!" })
	}
})

/* @route   POST /api/order
 * @desc    Create a new order.
 * @access  Private */
apiRouter.post("/order", verifyToken, async (req, res) => {
	console.log("Processing new order creation request!")
	try {
		const { items, total, shippingDetails } = req.body
		const userId = req.user.id // Get user ID from the verified token

		if (!items || !total || !shippingDetails) {
			return res.status(400).json({ message: "Missing order data." })
		}

		// Create a unique order number (e.g., based on timestamp and a random string)
		const orderNumber = `${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

		const newOrder = new Order({
			userId,
			items,
			total,
			shippingDetails,
			orderNumber,
		})

		await newOrder.save()
		console.log(`New order ${orderNumber} created successfully!`)
		res.status(201).json({ message: "Order placed successfully!", order: newOrder })
	} catch (error) {
		console.error("Error placing order:", error)
		res.status(500).json({ message: "Server error while placing order!" })
	}
})

// --- Admin Routes ---
/* @route   GET /api/admin-dbs
 * @desc    Get all documents from both Users and Orders collections.
 * @access  Administrator only */
apiRouter.get("/admin-dbs", verifyToken, verifyAdmin, async (req, res) => {
	console.log("Admin request to fetch all database documents!")
	try {
		const users = await User.find()
		const orders = await Order.find()
		console.log(`Fetched ${users.length} users and ${orders.length} orders!`)
		res.status(200).json({ users, orders })
	} catch (error) {
		console.error("Error fetching all database documents:", error)
		res.status(500).json({ message: "Server error while fetching all documents!" })
	}
})

/* @route   GET /api/admin-reset
 * @desc    Drops the entire database and re-creates the admin account.
 * @access  Administrator only */
apiRouter.get("/admin-reset", verifyToken, verifyAdmin, async (req, res) => {
	console.log("Admin request to reset the entire database!")
	try {
		// Drop the database
		await mongoose.connection.db.dropDatabase()
		console.log("Database dropped successfully!")

		console.log("Deleting existing admin user 'a@a' before reset!")
		await User.findOneAndDelete({ email: "a@a" })

		// Create the default admin account
		const adminPassword = "aaaa"
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(adminPassword, salt)

		const adminUser = new User({
			firstName: "3140",
			lastName: "Administrator",
			email: "a@a",
			password: hashedPassword,
			isAdmin: true,
		})
		await adminUser.save()
		console.log(`Created successfully! Administrator account: ${adminUser.firstName} ${adminUser.lastName} (${adminUser.email}) Password: ${adminPassword}`)
	} catch (error) {
		console.error("Error resetting database:", error)
		res.status(500).json({ message: "Server error during database reset!" })
	}
})

// Use the apiRouter for all routes starting with /api
app.use("/api", apiRouter)

// --- Server Startup ---
const os = require("os")
const https = require("https")
const fs = require("fs")

// Helper to get local IPv4 address
const getLocalIp = () =>
	Object.values(os.networkInterfaces())
		.flat()
		.find((iface) => iface.family === "IPv4" && !iface.internal)?.address || "127.0.0.1"

try {
	const httpsOptions = {
		key: fs.readFileSync("server.key"),
		cert: fs.readFileSync("server.cert"),
	}
	const localIP = getLocalIp()

	https.createServer(httpsOptions, app).listen(PORT, () => {
		console.log(`Backend Server is running on https://${localIP}:${PORT}`)
		console.log(`Accepting requests from origin: ${process.env.ORIGIN_URL || "any"}`)
		console.log(`Accessing MongoDB on: ${process.env.MONGO_URI}`)
		console.log(`JWT Secret is ${process.env.JWT_SECRET ? "loaded" : "MISSING"}`)
	})
} catch (error) {
	console.error("Failed to start HTTPS server. Ensure server.key and server.cert are present!", error.message)
	console.log("Falling back to HTTP server!")
	app.listen(PORT, () => {
		console.log(`Backend Server is running on http://localhost:${PORT}`)
	})
}
