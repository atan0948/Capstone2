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
        alert(data.error || 'Login failed');
    }
});
