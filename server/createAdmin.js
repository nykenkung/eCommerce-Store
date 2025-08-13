// --- Dependencies ---
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config() // Make sure .env has MONGO_URI

// --- MongoDB Connection ---
const mongoURI = process.env.MONGO_URI
if (!mongoURI) {
	console.error("MONGO_URI is missing from environment variables!")
	process.exit(1)
}
mongoose
	.connect(mongoURI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => {
		console.error("MongoDB connection error:", err)
		process.exit(1)
	})

// --- User Schema ---
const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, default: false },
	},
	{ timestamps: true }
)
const User = mongoose.model("User", userSchema)

// --- Reset DB & Create Admin ---
async function resetAndCreateAdmin() {
	try {
		/* Drop the entire database
		await mongoose.connection.dropDatabase()
		console.log("Database dropped successfully") */

		await User.findOneAndDelete({ email: "a@a" }) // Delete user "a@a" if existed
		const adminPassword = "aaaa"
		const adminUser = new User({
			// Add admin credentials
			firstName: "3140",
			lastName: "Administrator",
			email: "a@a",
			password: await bcrypt.hash(adminPassword, 10),
			isAdmin: true,
		})
		await adminUser.save()
		console.log(`Administrator account created: ${adminUser.email} Password: ${adminPassword}`)
		process.exit(0)
	} catch (error) {
		console.error("Error resetting DB or creating administrator:", error)
		process.exit(1)
	}
}
resetAndCreateAdmin()
