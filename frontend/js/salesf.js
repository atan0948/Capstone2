document.addEventListener('DOMContentLoaded', function () {
    fetchInventory(); // Load inventory items
    fetchSales(); // Load sales records

    document.getElementById('salesForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const item_id = document.getElementById('item').value;
        const quantity_sold = document.getElementById('quantity').value.trim();
        const errorElement = document.getElementById('salesError');

        if (!item_id || !quantity_sold || quantity_sold <= 0) {
            errorElement.textContent = 'Please select an item and enter a valid quantity.';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ item_id, quantity_sold })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Sale recorded successfully!');
                fetchInventory(); // Refresh inventory
                fetchSales(); // Refresh sales list
                document.getElementById('salesForm').reset();
            } else {
                errorElement.textContent = result.error || 'Failed to record sale.';
            }
        } catch (error) {
            errorElement.textContent = 'An error occurred. Try again.';
        }
    });
});

// Fetch inventory items to populate dropdown
async function fetchInventory() {
    try {
        const response = await fetch('http://localhost:3000/api/garments', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });

        const garments = await response.json();
        const itemDropdown = document.getElementById('item');

        itemDropdown.innerHTML = '<option value="">Select an item</option>'; // Reset dropdown

        garments.forEach(garment => {
            const option = document.createElement('option');
            option.value = garment.id;
            option.textContent = `${garment.item_name} (Stock: ${garment.quantity})`;
            itemDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}

// Fetch and display sales records
async function fetchSales() {
    try {
        const response = await fetch('http://localhost:3000/api/sales', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });

        const sales = await response.json();
        const salesTableBody = document.getElementById('salesTableBody');

        salesTableBody.innerHTML = ''; // Clear table

        sales.forEach(sale => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${sale.id}</td>
                <td>${sale.item_name}</td>
                <td>${sale.quantity_sold}</td>
                <td>${new Date(sale.sale_date).toLocaleString()}</td>
            `;

            salesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching sales:', error);
    }
}
