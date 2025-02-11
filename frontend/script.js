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


// login form Script
const loginForm = document.getElementById('loginForm');

// Handle the form submission
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the page from reloading

    // Get the input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the backend login API
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // If login is successful
            alert('Login successful! Token: ' + result.token);
            // Optionally, save the token in local storage for future use
            localStorage.setItem('token', result.token);
        } else {
            // If login failed, show the error message
            document.getElementById('error').textContent = result.error;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error').textContent = 'An error occurred. Please try again.';
    }
});