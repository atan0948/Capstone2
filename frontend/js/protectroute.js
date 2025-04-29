document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault(); // 🚫 stops the default link behavior
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

// protectroute.js

document.addEventListener('DOMContentLoaded', () => {
    // ✅ Check for auth token
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // ✅ Logout button behavior
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // stop default <a href="..."> behavior
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }
});
// protectroute.js

document.addEventListener('DOMContentLoaded', () => {
    // ✅ Check for auth token
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // ✅ Logout button behavior
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // stop default <a href="..."> behavior
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }
});
