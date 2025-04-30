// Search inventory
async function searchInventory() {
    const query = document.getElementById('inventorySearch').value;

    try {
        const response = await fetch(`/api/inventory/search?query=${query}`);
        const data = await response.json();
        displayResults(data, 'inventory');
    } catch (err) {
        console.error('Error searching inventory:', err);
    }
}

// Search sales
async function searchSales() {
    const query = document.getElementById('salesSearch').value;

    try {
        const response = await fetch(`/api/sales/search?query=${query}`);
        const data = await response.json();
        displayResults(data, 'sales');
    } catch (err) {
        console.error('Error searching sales:', err);
    }
}

// Function to display results
function displayResults(data, type) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (data.length === 0) {
        resultsContainer.innerHTML = `<p>No ${type} found matching the search term.</p>`;
        return;
    }

    const table = document.createElement('table');
    const header = type === 'inventory' ? 
        '<tr><th>Item Name</th><th>Category</th><th>Quantity</th><th>Price</th></tr>' : 
        '<tr><th>Item Name</th><th>Quantity</th><th>Sale Date</th><th>Total Price</th></tr>';
    table.innerHTML = header;

    data.forEach(item => {
        const row = document.createElement('tr');
        if (type === 'inventory') {
            row.innerHTML = `<td>${item.item_name}</td><td>${item.category}</td><td>${item.quantity}</td><td>${item.price}</td>`;
        } else {
            row.innerHTML = `<td>${item.item_name}</td><td>${item.quantity}</td><td>${item.sale_date}</td><td>${item.total_price}</td>`;
        }
        table.appendChild(row);
    });

    resultsContainer.appendChild(table);
}
