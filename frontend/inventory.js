document.getElementById('addGarmentForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const form = this;
    const id = form.dataset.editingId || null; // Get stored ID (null if adding new)
    const item_name = document.getElementById('item_name').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const price = document.getElementById('price').value.trim();
    const supplier = document.getElementById('supplier').value.trim();
    const errorElement = document.getElementById('addError');

    if (!item_name || !quantity || !price || !supplier) {
        errorElement.textContent = 'All fields are required.';
        return;
    }

    try {
        const url = id ? `http://localhost:3000/api/garments/${id}` : 'http://localhost:3000/api/garments';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ item_name, quantity, price, supplier })
        });

        const result = await response.json();
        if (response.ok) {
            alert(id ? 'Garment updated successfully!' : 'Garment added successfully!');
            form.reset();
            delete form.dataset.editingId; // ✅ Corrected typo
            document.getElementById('submitButton').textContent = "Add Garment";
            fetchGarments(); // Refresh table
        } else {
            errorElement.textContent = result.error || 'Failed to save garment.';
        }
    } catch (error) {
        errorElement.textContent = 'An error occurred. Try again.';
    }
});

// Fetch and display inventory data
async function fetchGarments() {
    try {
        const response = await fetch('http://localhost:3000/api/garments', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const garments = await response.json();

        const tableBody = document.getElementById('inventoryTableBody');
        tableBody.innerHTML = ''; // Clear previous data

        garments.forEach(garment => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${garment.id}</td>
                <td>${garment.item_name}</td>
                <td>${garment.quantity}</td>
                <td>$${garment.price}</td>
                <td>${garment.supplier}</td>
                <td>
                    <button onclick="editGarment(${garment.id}, '${garment.item_name}', ${garment.quantity}, ${garment.price}, '${garment.supplier}')">Edit</button>
                    <button onclick="deleteGarment(${garment.id})">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}

// Edit Garment
function editGarment(id, item_name, quantity, price, supplier) {
    document.getElementById('item_name').value = item_name;
    document.getElementById('quantity').value = quantity;
    document.getElementById('price').value = price;
    document.getElementById('supplier').value = supplier;
    
    // Store the ID in the form's dataset
    document.getElementById('addGarmentForm').dataset.editingId = id;

    // Change button text to indicate edit mode
    document.getElementById('submitButton').textContent = "Update Garment";
}

// Delete Garment
async function deleteGarment(id) {
    if (!confirm('Are you sure you want to delete this garment?')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/garments/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': localStorage.getItem('token') }
        });

        if (response.ok) {
            alert('Garment deleted successfully!');
            fetchGarments(); // Refresh table
        } else {
            alert('Failed to delete garment.');
        }
    } catch (error) {
        alert('An error occurred. Try again.');
    }
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchGarments);
