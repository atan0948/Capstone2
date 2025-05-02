document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();


    if (!username || !password) {
        document.getElementById('error').textContent = 'Please enter both username and password.';
        return;
    }

    fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.role === 'admin') {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'yaerinzinventory.html';
            }
        } else {
            document.getElementById('error').textContent = data.error || 'Login failed';
        }
    })
    .catch(err => {
        document.getElementById('error').textContent = 'Server error. Please try again later.';
        console.error('Login error:', err);
    });
});
