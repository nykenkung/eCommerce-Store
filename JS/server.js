const express = require('express');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const path = require('path');

const app = express();
const PORT = 3000;

// Read SSL certificate and key
const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'server.cert'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// In-memory user store
const users = new Map();

app.use(cors({
	origin: true,
	credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

// Register endpoint
app.post('/register', (req, res) => {
	const { firstName, lastName, email, password } = req.body;
	if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'Missing fields!' });
	if (users.has(email)) return res.status(409).json({ message: `${email} already registered!` });
	users.set(email, { firstName, lastName, password });
	res.status(201).json({ message: 'User registered', firstName, lastName });
});

// Login endpoint
app.post('/login', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ message: 'Missing fields!' });
	const user = users.get(email);
	if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid email or password!' });

  // Set cookie for login status, expires in 1 day
	res.cookie('loginUser', JSON.stringify({ firstName: user.firstName, lastName: user.lastName }), {
		httpOnly: false,
		secure: true,		// Ensure the cookie is only sent over HTTPS
		sameSite: 'None',	// Allow cross-site cookies
		maxAge: 24 * 60 * 60 * 1000,	// 1 day
	});
	res.json({ firstName: user.firstName, lastName: user.lastName });
});

// Optional: route to check cookie (not required, but useful)
app.get('/welcome', (req, res) => {
	const loginUser = req.cookies.loginUser;
	if (!loginUser) {
		return res.status(401).json({ message: '\nMessage from 3140 Clothing Brand:\n\nDon\'t forget to login for exclusive promotion!\n\nSign in to claim your promotional offer today!' });
	}
	try {
		const user = JSON.parse(loginUser);
		res.json({ message: `Welcome back, ${user.firstName} ${user.lastName}!` });
	} catch {
		res.status(400).json({ message: 'Invalid cookie data!' });
	}
});

https.createServer(credentials, app).listen(PORT, () => {	// app.listen(PORT,
	console.log(`Server running at https://localhost:${PORT}`);
});