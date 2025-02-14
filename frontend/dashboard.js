document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login if no token is found
        window.location.href = 'login.html';
    }

    // Logout functionality
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token'); // Remove token
        window.location.href = 'login.html'; // Redirect to login
    });
});
  