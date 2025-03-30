document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Logout functionality
    document.getElementById('logout').addEventListener('click', () => {
        localaStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // Fetch and display data
    fetchInventoryChanges();
    fetchTodayDefects();
});
