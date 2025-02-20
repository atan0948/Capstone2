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