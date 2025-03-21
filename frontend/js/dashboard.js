document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login if no token is found
        window.location.href = 'login.html';
    }

    // Logout functionality
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token'); // Remove token
        window.location.href = 'login.html'; // Redirect to login
    });

    // Fetch data
    fetchInventoryChanges();
    fetchTodayDefects(); // 👈 Call the function for today's defects
});

async function fetchInventoryChanges() {
    try {
        const response = await fetch("http://localhost:3000/api/inventory/inventory-changes");
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.length) {
            console.warn("⚠️ No inventory data found.");
            renderInventoryChart([], []); // Avoid breaking the chart
            return;
        }

        const labels = data.map(entry => entry.date);
        const quantities = data.map(entry => entry.total_quantity);

        renderInventoryChart(labels, quantities);
    } catch (error) {
        console.error("❌ Error fetching inventory changes:", error);
    }
}

function renderInventoryChart(labels, quantities) {
    const ctx = document.getElementById("inventoryChart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels.length ? labels : ["No Data"],
            datasets: [{
                label: "Inventory Over Time",
                data: quantities.length ? quantities : [0],
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

    console.log("📊 Inventory chart updated successfully.");
}

function fetchTodayDefects() {
    fetch('http://localhost:3000/api/defects/today')
        .then(res => res.json())
        .then(data => {
            document.getElementById('todayDefectCount').textContent = data.defectCount;
        })
        .catch(err => console.error('Error fetching defect count:', err));
}
