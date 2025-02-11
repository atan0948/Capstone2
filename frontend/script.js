//Search Bar Script
document.addEventListener('DOMContentLoaded', function() {
    function searchTable() {
        const input = document.querySelector('.search-bar input');
        const filter = input.value.toUpperCase();
        const tables = document.querySelectorAll('table');

        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                let found = false;
                cells.forEach(cell => {
                    if (cell.textContent.toUpperCase().includes(filter)) {
                        found = true;
                    }
                });
                if (found) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }

    const searchButton = document.querySelector('.search-bar button');
    if (searchButton) {  
      searchButton.addEventListener('click', searchTable);
    }


    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) { 
      searchInput.addEventListener('keyup', function(event) {
          if (event.key === 'Enter') {
              searchTable();
          }
      });
    }

});


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
    // ... (Your existing image cycling and search code)

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        errorMessage.textContent = ""; // Clear any previous errors

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.ok) {
                // Successful login
                console.log('Login successful!', result);
                localStorage.setItem('token', result.token); // Store the token
                // Redirect or update UI as needed
                window.location.href = "index.html"; // Example: redirect to dashboard
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
});