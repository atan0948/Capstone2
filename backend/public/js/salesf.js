document.addEventListener('DOMContentLoaded', function () {
    fetchInventory(); // Load inventory items for regular sale
    fetchSales();     // Load sales records
    loadItemsForQuickSale(); // Load inventory items for quick sale modal

    // Regular Sale Form
    document.getElementById('salesForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const item_id = document.getElementById('item').value;
        const quantity_sold = document.getElementById('quantity').value.trim();
        const customer_name = document.getElementById('customerName').value.trim();
        const payment_type = document.getElementById('paymentType').value;                       

        if (!item_id || !quantity_sold || quantity_sold <= 0) {
            errorElement.textContent = 'Please select an item and enter a valid quantity.';
            return;
        }

        try {
            const response = await fetch('http://192.168.229.207:3000/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ item_id, quantity_sold, customer_name, payment_type })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Sale recorded successfully!');
                fetchInventory();
                fetchSales();
                document.getElementById('salesForm').reset();
            } else {
                errorElement.textContent = result.error || 'Failed to record sale.';
            }
        } catch (error) {
            errorElement.textContent = 'An error occurred. Try again.';
        }
    });

    // Quick Sale Form Submission
    document.getElementById('quickSaleForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const item_id = document.getElementById('quickSaleItem').value;
        const quantity_sold = document.getElementById('quantitySold').value.trim();
        const customer_name = document.getElementById('quickCustomerName').value.trim();
        const payment_type = document.getElementById('quickPaymentType').value;
        const errorElement = document.getElementById('salesError');        
        
        if (!item_id || !quantity_sold || quantity_sold <= 0 || !payment_type) {
            errorElement.textContent = 'Please fill out all required fields.';
            return;
        }

        try {
            const response = await fetch('http://192.168.229.207:3000/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ item_id, quantity_sold, payment_type })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Quick Sale recorded successfully!');
                fetchInventory();
                fetchSales();
                document.getElementById('quickSaleForm').reset();
                document.getElementById('quickSaleModal').style.display = 'none';
            } else {
                errorElement.textContent = result.error || 'Failed to record sale.';
            }
        } catch (error) {
            errorElement.textContent = 'An error occurred. Try again.';
        }
    });

    // Auto-update stock and total price
    document.getElementById('quickSaleItem').addEventListener('change', async function () {
        const itemId = this.value;
        if (!itemId) return;

        try {
            const response = await fetch(`http://192.168.229.207:3000/api/garments/${itemId}`, {
                headers: { 'Authorization': localStorage.getItem('token') }
            });
            const item = await response.json();

            document.getElementById('availableStock').value = item.quantity;
            document.getElementById('totalPrice').value = ''; // Reset until quantity entered

            document.getElementById('quantitySold').addEventListener('input', function () {
                const qty = parseInt(this.value);
                const total = isNaN(qty) ? 0 : qty * item.price;
                document.getElementById('totalPrice').value = `₱${total.toFixed(2)}`;
            });

        } catch (err) {
            console.error('Error loading item info:', err);
        }
    });
});

// Fetch inventory items for regular sales dropdown
async function fetchInventory() {
    try {
        const response = await fetch('http://192.168.229.207:3000/api/garments', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });

        const garments = await response.json();
        const itemDropdown = document.getElementById('item');
        itemDropdown.innerHTML = '<option value="">Select an item</option>';

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
        const response = await fetch('http://192.168.229.207:3000/api/sales', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });

        const sales = await response.json();
        const salesTableBody = document.getElementById('salesTableBody');
        salesTableBody.innerHTML = '';

        sales.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.item_name}</td>
            <td>₱${parseFloat(sale.price).toFixed(2)}</td>
            <td>${sale.quantity_sold}</td>
            <td>₱${parseFloat(sale.total).toFixed(2)}</td>
            <td>${sale.customer_name || '-'}</td>
            <td>${sale.payment_type || '-'}</td>
            <td>${new Date(sale.sale_date).toLocaleString()}</td>
        `;
            salesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching sales:', error);
    }
}

// Load garments into Quick Sale modal
async function loadItemsForQuickSale() {
    try {
        const response = await fetch('http://192.168.229.207:3000/api/garments', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const garments = await response.json();
        const select = document.getElementById('quickSaleItem');
        select.innerHTML = '<option value="">-- Select Item --</option>';

        garments.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.item_name} (₱${item.price})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load items for quick sale:', error);
    }
}
