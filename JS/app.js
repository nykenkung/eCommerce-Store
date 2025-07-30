document.addEventListener('DOMContentLoaded', () => {
	const BASE_URL = 'https://108.54.71.208:3000';
	const loginForm = document.getElementById('login-form');
	const registerForm = document.getElementById('register-form');
	let justLoggedIn = false;

	const handleForm = async (endpoint, form) => {
		const data = Object.fromEntries(new FormData(form).entries());

		try {
			const res = await fetch(`${BASE_URL}/${endpoint}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(data),
			});

			const result = await res.json();

			if (res.ok) {
				if (endpoint === 'login') {
					alert(`Welcome back, ${result.firstName} ${result.lastName}!`);
					justLoggedIn = true;
				} else {
					alert(`Dear ${result.firstName} ${result.lastName},\nThank you for registering! You can now log in!`);
				}
				form.reset();
			} else {
				alert(result.message || 'Something went wrong!');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Server error!');
		}
	};

	loginForm.addEventListener('submit', async e => {
		e.preventDefault();
		await handleForm('login', loginForm);
	});

	registerForm.addEventListener('submit', async e => {
		e.preventDefault();
		await handleForm('register', registerForm);
	});

	// Welcome message from cookie
	fetch(`${BASE_URL}/welcome`, { credentials: 'include' })
		.then(res => res.json())
		.then(data => {
			if (data.message && !justLoggedIn) alert(data.message);
		})
		.catch(() => {});
});
