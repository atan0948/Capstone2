document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    // Fetch and display data
    fetchInventoryChanges();
    fetchTodayDefects();
    fetchLowStockCount();
});

async function fetchInventoryChanges() {
    try {
        const response = await fetch("http://192.168.229.207:3000/api/inventory/inventory-changes");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("🐞 Inventory Changes Data:", data);

        if (!data.length) {
            console.warn("⚠️ No inventory data found.");
            renderInventoryChart([], []);
            return;
        }

        const labels = data.map(entry => new Date(entry.date_added).toLocaleDateString());
        const quantities = data.map(entry => entry.quantity);        

        renderInventoryChart(labels, quantities);
    } catch (error) {
        console.error("❌ Error fetching inventory changes:", error);
    }
}

let inventoryChartInstance = null;

function renderInventoryChart(labels, quantities) {
    const ctx = document.getElementById("inventoryChart").getContext("2d");

    if (inventoryChartInstance) {
        inventoryChartInstance.data.labels = labels;
        inventoryChartInstance.data.datasets[0].data = quantities;
        inventoryChartInstance.update();
    } else {
        inventoryChartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Inventory Over Time",
                    data: quantities,
                    borderColor: "#3498db",
                    backgroundColor: "rgba(52, 152, 219, 0.2)",
                    borderWidth: 2,
                    fill: true,
                    pointBackgroundColor: "#2980b9",
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "Date" } },
                    y: { title: { display: true, text: "Total Quantity" } }
                }
            }
        });
    }

    console.log("📊 Inventory chart updated successfully.");
}


function fetchTodayDefects() {
    fetch('http://192.168.229.207:3000/api/defects/today', {
        headers: {
            "Cache-Control": "no-cache"
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("🐞 Today's Defects:", data);
            const count = data.defectCount !== undefined ? data.defectCount : 0;
            document.getElementById('todayDefectCount').textContent = count;
        })
        .catch(err => console.error('❌ Error fetching defect count:', err));
}

async function fetchLowStockCount() {
    try {
        const response = await fetch('http://192.168.229.207:3000/api/dashboard/low-stock');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const categories = data.categories ?? [];

        // Total count from all categories
        const total = categories.reduce((sum, cat) => sum + cat.count, 0);
        document.getElementById('lowStockCount').textContent = total;

        // Optional logic for warning/critical (you can customize this further)
        const critical = total >= 10 ? 5 : total;
        const warning = total - critical;

        document.getElementById('criticalItems').textContent = `${critical} Critical`;
        document.getElementById('warningItems').textContent = `${warning > 0 ? warning : 0} Warning`;

        // ⬇️ Show category breakdown
        const detailContainer = document.getElementById('lowStockCategoryDetails');
        detailContainer.innerHTML = '';

        categories.forEach(cat => {
            const item = document.createElement('div');
            item.classList.add('category-item');
            item.textContent = `${cat.category}: ${cat.count}`;
            detailContainer.appendChild(item);
        });

        console.log('📦 Low stock by category:', categories);
    } catch (err) {
        console.error('❌ Error fetching low stock count:', err);
        document.getElementById('lowStockCount').textContent = 'Error';
    }
}

async function fetchTotalSalesOrders() {
    try {
        const response = await fetch('http://192.168.229.207:3000/api/sales/total-orders');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById('totalSalesOrders').textContent = data.total;
        console.log("🧾 Total sales orders:", data.total);
    } catch (err) {
        console.error('❌ Error fetching total sales orders:', err);
        document.getElementById('totalSalesOrders').textContent = 'Error';
    }
}

fetchTotalSalesOrders();

// dashboard.js

async function fetchInventoryOverview() {
    try {
        const response = await fetch('http://192.168.229.207:3000/api/inventory/current');
        const data = await response.json();

        if (data) {
            const totalQuantity = data.totalQuantity;
            const categories = data.categories;

            // Update total inventory
            document.getElementById('totalInventory').textContent = totalQuantity;

            // Display categories and quantities
            const categoryDetails = document.getElementById('categoryDetails');
            categoryDetails.innerHTML = ''; // Clear previous data
            categories.forEach(category => {
                const categoryItem = document.createElement('div');
                categoryItem.classList.add('category-item');
                categoryItem.textContent = `${category.category}: ${category.category_quantity}`;
                categoryDetails.appendChild(categoryItem);
            });

            console.log("Inventory overview fetched and displayed.");
        } else {
            console.error("Failed to fetch inventory data.");
        }
    } catch (error) {
        console.error('Error fetching inventory overview:', error);
        document.getElementById('totalInventory').textContent = 'Error';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchInventoryOverview(); // Call this function when the page loads
});
