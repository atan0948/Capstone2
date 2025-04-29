document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Page Loaded - Fetching Garments...");
    fetchGarments(); // Ensure table updates on page load

    const form = document.getElementById("addGarmentForm");

    if (!form) {
        console.error("❌ Form element 'addGarmentForm' not found. Check your HTML.");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(this);

        if (!formData.get("item_name")) {
            alert("Item Name is required!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/garments', {
                method: "POST",
                headers: { "Authorization": localStorage.getItem("token") },
                body: formData // ✅ Correctly sending FormData (not JSON)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Garment added successfully!");
                this.reset();
                fetchGarments();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
            alert("Failed to add garment.");
        }
    });

    // Event listener for filtering
    document.addEventListener('DOMContentLoaded', function () {
        const params = new URLSearchParams(window.location.search);
        const filter = params.get('filter');

        if (filter === 'low-stock') {
            fetchAndRenderLowStockItems();
        } else {
            fetchAndRenderAllInventory();
        }
    });
});

async function fetchGarments() {
    try {
        console.log("Fetching garments...");
        const response = await fetch('http://localhost:3000/api/garments', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });

        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const garments = await response.json();
        console.log("Garments:", garments);
        renderInventoryTable(garments, document.getElementById('inventoryTableBody')); // Pass the table body
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}

/**
 * Renders the inventory table.
 *
 * @param {Array} garments - An array of garment objects.
 * @param {HTMLElement} tableBody - The <tbody> element of the table.
 */
function renderInventoryTable(garments, tableBody) {
    tableBody.innerHTML = '';

    if (!garments || garments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="13" style="text-align: center;">No garments found.</td></tr>';
        return;
    }

    garments.forEach(garment => {
        const price = parseFloat(garment.price) || 0;
        const cost_price = parseFloat(garment.cost_price) || 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${garment.id || 'N/A'}</td>
            <td>${garment.item_name || 'N/A'}</td>
            <td>${garment.category || 'N/A'}</td>
            <td>${garment.size || 'N/A'}</td>
            <td>${garment.color || 'N/A'}</td>
            <td>${garment.quantity || 0}</td>
            <td>₱${price.toFixed(2)}</td>
            <td>₱${cost_price.toFixed(2)}</td>
            <td>${garment.supplier || 'N/A'}</td>
            <td>${garment.location || 'N/A'}</td>
            <td>${garment.status || 'Available'}</td>
            <td>
                <img src="${garment.image_url ? `/uploads/${garment.image_url}` : 'https://via.placeholder.com/50'}"
                width="50" height="50" style="object-fit: cover; border-radius: 5px;">
            </td>
            <td>
                <button class="edit-btn-${garment.id}" style="${getButtonStyle('edit')}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-btn-${garment.id}" style="${getButtonStyle('delete')}">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);

        // Add event listeners and inline styles.
        const editButton = document.querySelector(`.edit-btn-${garment.id}`);
        const deleteButton = document.querySelector(`.delete-btn-${garment.id}`);

        if (editButton) {
            editButton.addEventListener('click', () => {
                editGarment(garment.id, garment.item_name, garment.category, garment.size, garment.color, garment.quantity, price, cost_price, garment.supplier, garment.location, garment.image_url);
            });
            // Apply hover effect using JavaScript
            editButton.addEventListener('mouseover', () => {
                editButton.style.backgroundColor = '#218838';
            });
            editButton.addEventListener('mouseout', () => {
                editButton.style.backgroundColor = '#28a745';
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                deleteGarment(garment.id);
            });
            // Apply hover effect using JavaScript
            deleteButton.addEventListener('mouseover', () => {
                deleteButton.style.backgroundColor = '#c82333';
            });
            deleteButton.addEventListener('mouseout', () => {
                deleteButton.style.backgroundColor = '#dc3545';
            });
        }
    });
    console.log("✅ Table updated successfully.");
}

/**
 * Returns a string of CSS styles for the buttons.
 *
 * @param {string} type - The type of button ('edit' or 'delete').
 * @returns {string} - A string of CSS styles.
 */
function getButtonStyle(type) {
    const baseStyles = `
        padding: 8px 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9em;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        gap: 5px;
        height:25px;
        width:75px;
    `;

    if (type === 'edit') {
        return baseStyles + `
            background-color: #659287;
            color: white;
        `;
    } else if (type === 'delete') {
        return baseStyles + `
            background-color: #dc3545;
            color: white;
        `;
    }
    return baseStyles;
}

window.deleteGarment = async function (id) {
    if (!confirm("Are you sure you want to delete this garment?")) return;

    console.log(`🗑 Attempting to delete garment ID: ${id}`);

    try {
        const response = await fetch(`http://localhost:3000/api/garments/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': localStorage.getItem('token') }
        });

        const result = await response.json();
        console.log("🔍 Response received:", result);

        if (response.ok) {
            alert("Garment deleted successfully!");
            fetchGarments();
        } else {
            console.error("❌ Error deleting garment:", result);
            alert("Failed to delete garment.");
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
        alert("An error occurred while deleting.");
    }
};

window.editGarment = function (
    id, item_name, category, size, color, quantity, price, cost_price, supplier, location, status
) {
    document.getElementById("editId").value = id;
    document.getElementById("editItemName").value = item_name;
    document.getElementById("editCategory").value = category;
    document.getElementById("editSize").value = size;
    document.getElementById("editColor").value = color;
    document.getElementById("editQuantity").value = quantity;
    document.getElementById("editPrice").value = price;
    document.getElementById("editCostPrice").value = cost_price;
    document.getElementById("editSupplier").value = supplier;
    document.getElementById("editLocation").value = location;
    document.getElementById("editStatus").value = status;

    document.getElementById("editModal").style.display = "block";
};


function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

document.getElementById('editGarmentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const id = document.getElementById('editId').value;

    const formData = new FormData();
    formData.append('item_name', document.getElementById('editItemName').value);
    formData.append('category', document.getElementById('editCategory').value);
    formData.append('size', document.getElementById('editSize').value);
    formData.append('color', document.getElementById('editColor').value);
    formData.append('quantity', document.getElementById('editQuantity').value);
    formData.append('price', document.getElementById('editPrice').value);
    formData.append('cost_price', document.getElementById('editCostPrice').value);
    formData.append('supplier', document.getElementById('editSupplier').value);
    formData.append('location', document.getElementById('editLocation').value);
    formData.append('status', document.getElementById('editStatus').value);

    const image = document.getElementById('editImage').files[0];
    if (image) {
        formData.append('image', image);
    }

    fetch(`http://localhost:3000/api/garments/${id}`, {
        method: 'PUT',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            alert('Garment updated successfully!');
            location.reload();
        })
        .catch(err => {
            alert('Error updating garment: ' + err.message);
            console.error(err);
        });
});

async function fetchAndRenderLowStockItems() {
    try {
        console.log("Fetching low stock garments...");
        const response = await fetch('http://localhost:3000/api/garments/low-stock', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });

        if (!response.ok) throw new Error(`Failed to fetch low stock items: ${response.statusText}`);

        const garments = await response.json();
        console.log("Low Stock Garments:", garments);
        renderInventoryTable(garments, document.getElementById('inventoryTableBody'));
    } catch (error) {
        console.error('Error fetching low stock inventory:', error);
        alert('Failed to fetch low stock items.');
    }
}

async function fetchAndRenderAllInventory() {
    try {
        console.log("Fetching all inventory garments...");
        const response = await fetch('http://localhost:3000/api/garments', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch inventory: ${response.status}`);
        }
        const data = await response.json();
        console.log("Inventory data:", data);
        renderInventoryTable(data, document.getElementById('inventoryTableBody'));
    } catch (error) {
        console.error("Error fetching all inventory:", error);
        alert('Failed to fetch inventory.');
    }
}
