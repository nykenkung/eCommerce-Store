const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;
const HOST = '108.54.71.208';

// In-memory user store
const users = new Map();

app.use(cors({
	origin: 'https://cunymeganlubin.github.io',
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
	if (!user || user.password !== password) {
		return res.status(401).json({ message: 'Invalid email or password!' });
	}

  // Set cookie for login status, expires in 1 day
	res.cookie('loginUser', JSON.stringify({ firstName: user.firstName, lastName: user.lastName }), {
		httpOnly: true,
		secure: true,        // Required for cross-site cookies on HTTPS
		sameSite: 'None',    // Required for cross-site cookies
		maxAge: 24 * 60 * 60 * 1000,
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});