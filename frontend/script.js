


//Picture in login Script
setInterval(() => {
    productImage.src = imageArray[currentImageIndex]; 

    currentImageIndex++; // Increment index
    if (currentImageIndex >= imageArray.length) {
        currentImageIndex = 0; 
    }
}, 3000); 


const dots = document.querySelectorAll('.dot');

setInterval(() => {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentImageIndex].classList.add('active');
}, 3000); 

//Login Scriptttt
document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) { // Check if the form element exists
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent page reload

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            errorMessage.textContent = ""; // Clear any previous errors

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (response.ok) {
                    // Successful login
                    console.log('Login successful!', result);
                    localStorage.setItem('token', result.token); // Store the token

                    // Redirect to index.html
                    window.location.href = "index.html";  // Correct path!

                } else {
                    // Login failed
                    console.error('Login failed:', result);
                    errorMessage.textContent = result.error || "Invalid username or password"; // Display error
                }
            } catch (error) {
                console.error('Error:', error);
                errorMessage.textContent = "An error occurred. Please try again later.";
            }
        });
    } else {
        console.error("Login form element not found.");
    }
});