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
                fetchGarments(); // ✅ Refresh table after adding
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
            alert("Failed to add garment.");
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
        displayGarments(garments);
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}

function displayGarments(garments) {
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = ''; // Clear previous data

    if (!garments || garments.length === 0) {
        console.warn("⚠ No garments found.");
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
            <td>
                <img src="${garment.image_url ? `/uploads/${garment.image_url}` : 'https://via.placeholder.com/50'}"
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
            fetchGarments(); // ✅ Refresh the inventory
        } else {
            console.error("❌ Error deleting garment:", result);
            alert("Failed to delete garment.");
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
        alert("An error occurred while deleting.");
    }
};
