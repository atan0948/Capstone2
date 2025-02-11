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
    if (searchButton) {  // Check if the button exists before adding listener
      searchButton.addEventListener('click', searchTable);
    }


    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) { // Check if the input exists before adding listener
      searchInput.addEventListener('keyup', function(event) {
          if (event.key === 'Enter') {
              searchTable();
          }
      });
    }

});


//Picture in login Script
setInterval(() => {
    productImage.src = imageArray[currentImageIndex]; // Change image source

    currentImageIndex++; // Increment index
    if (currentImageIndex >= imageArray.length) {
        currentImageIndex = 0; // Reset index to 0 when it exceeds array length
    }
}, 3000); // Change image every 3 seconds (adjust as needed)


// Pagination (Optional - If you want the dots to update too)
const dots = document.querySelectorAll('.dot');

setInterval(() => {
    // Remove active class from all dots
    dots.forEach(dot => dot.classList.remove('active'));
    // Add active class to the current dot
    dots[currentImageIndex].classList.add('active');
}, 3000); // Same interval as image change