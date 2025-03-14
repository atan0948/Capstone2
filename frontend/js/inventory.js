document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("addGarmentForm");

    if (!form) {
        console.error("❌ Form element 'addGarmentForm' not found. Check your HTML.");
        return; // Stop execution if form is missing
    }

    form.addEventListener("submit", async function (event) {  
        event.preventDefault();
        console.log("✅ Form submission started...");
    
        const formData = new FormData(this);
        const id = this.dataset.editingId || null;
    
        const jsonData = {};
        formData.forEach((value, key) => { jsonData[key] = value; }); // Convert FormData to JSON
    
        try {
            const url = id ? `http://localhost:3000/api/garments/${id}` : 'http://localhost:3000/api/garments';
            const method = id ? 'PUT' : 'POST';
    
            const response = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') 
                },
                body: JSON.stringify(jsonData) // Send JSON instead of FormData
            });
    
            const result = await response.json();
            if (response.ok) {
                alert(id ? 'Garment updated successfully!' : 'Garment added successfully!');
                this.reset();
                delete this.dataset.editingId;
                document.getElementById('submitButton').textContent = "Add Garment"; // Reset button text
                fetchGarments();
            } else {
                console.error("❌ Server responded with an error:", result);
                document.getElementById('addError').textContent = result.error || 'Failed to save garment.';
            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
            document.getElementById('addError').textContent = 'An error occurred. Try again.';
        }
    });
    

    function displayGarments(garments) {
        const tableBody = document.getElementById('inventoryTableBody');
        tableBody.innerHTML = ''; // Clear previous data
    
        if (!garments || garments.length === 0) {
            console.warn("⚠ No garments found.");
            return;
        }
    
        garments.forEach(garment => {
            // Ensure price and cost_price are numbers
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
                <td>
                    <img src="${garment.image_url ? garment.image_url : 'https://via.placeholder.com/50'}"
     width="50" height="50" style="object-fit: cover; border-radius: 5px;">
                </td>
                <td>
                    <button onclick="editGarment(${garment.id}, '${garment.item_name}', '${garment.category}', '${garment.size}', '${garment.color}', ${garment.quantity}, ${price}, ${cost_price}, '${garment.supplier}', '${garment.location}', '${garment.image_url}')">Edit</button>
                    <button onclick="deleteGarment(${garment.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    
        console.log("✅ Table updated successfully.");
    }
    

    // Fetch and display inventory data
    async function fetchGarments() {
        try {
            console.log("Fetching garments...");
            const response = await fetch('http://localhost:3000/api/garments', {
                headers: { 'Authorization': localStorage.getItem('token') }
            });

            if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

            const garments = await response.json();
            console.log("Garments:", garments);
            displayGarments(garments);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    }

    // Fetch inventory on page load
    window.fetchGarments = fetchGarments;

    fetchGarments();
});

window.editGarment = function(id, item_name, category, size, color, quantity, price, cost_price, supplier, location, image_url) {
    const form = document.getElementById("addGarmentForm");
    if (!form) {
        console.error("❌ Form not found.");
        return;
    }

    console.log(`✏ Editing garment ID: ${id}`);
    
    form.dataset.editingId = id; // Store ID for update
    form.item_name.value = item_name;
    form.category.value = category;
    form.size.value = size;
    form.color.value = color;
    form.quantity.value = quantity;
    form.price.value = price;
    form.cost_price.value = cost_price;
    form.supplier.value = supplier;
    form.location.value = location;
    document.getElementById("submitButton").textContent = "Update Garment"; // Change button text
};

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
            window.fetchGarments(); // ✅ Refresh the inventory
        } else {
            console.error("❌ Error deleting garment:", result);
            alert("Failed to delete garment.");
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
        alert("An error occurred while deleting.");
    }
};

async function updateGarment(id, item_name, quantity, price, supplier) {
    console.log(`✏️ Updating garment ID: ${id}`);
    
    try {
        const response = await fetch(`http://localhost:3000/api/garments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ item_name, quantity, price, supplier }),
        });

        const data = await response.json();
        console.log("✅ Update Response:", data);

        if (data.error) {
            console.error("❌ Error updating garment:", data.error);
            return;
        }

        // ✅ Refresh the inventory list (DON'T append new row!)
        fetchGarments(); 
    } catch (error) {
        console.error("❌ Fetch error:", error);
    }
}
