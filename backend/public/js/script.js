

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorElement = document.getElementById('error');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent page reload

        // Get and trim input values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Clear previous errors
        errorElement.textContent = '';

        // Validate inputs
        if (!username || !password) {
            errorElement.textContent = 'Username and password are required.';
            return;
        }

        try {
            // Send a POST request to the backend login API
            const response = await fetch(`${BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Login successful!');
                localStorage.setItem('token', result.token);

                // Redirect to dashboard or another page
                window.location.href = 'index.html';
            } else {
                errorElement.textContent = result.error || 'Invalid login credentials.';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorElement.textContent = 'An error occurred. Please try again.';
        }
    });

    // Remove error message when the user starts typing
    document.getElementById('username').addEventListener('input', () => errorElement.textContent = '');
    document.getElementById('password').addEventListener('input', () => errorElement.textContent = '');
});

