

document.getElementById('generateReportBtn').addEventListener('click', async () => {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;

    if (!fromDate || !toDate) {
        alert("Please select both dates.");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/api/records/report?start=${fromDate}&end=${toDate}`);
        if (!res.ok) {
            throw new Error('Failed to fetch report');
        }

        const reportData = await res.json();

        populateInventoryTable(reportData.inventory);
        populateSalesTable(reportData.sales);

    } catch (err) {
        console.error('❌ Error fetching report:', err);
        alert("There was an error generating the report.");
    }
});

function populateInventoryTable(data) {
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10">No inventory records found for this date range.</td></tr>';
        return;
    }

    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.item_name}</td>
                <td>${item.category}</td>
                <td>${item.size}</td>
                <td>${item.color}</td>
                <td>${item.quantity}</td>
                <td>₱${parseFloat(item.price).toFixed(2)}</td>
                <td>${item.supplier}</td>
                <td>${item.location}</td>
                <td>${new Date(item.date_added).toLocaleDateString()}</td>
            </tr>
        `;
    });
}

function populateSalesTable(data) {
    const tbody = document.getElementById('recordsTableBody');
    tbody.innerHTML = '';
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No sales records found for this date range.</td></tr>';
        return;
    }

    data.forEach(sale => {
        tbody.innerHTML += `
            <tr>
                <td>${sale.id}</td>
                <td>${sale.item_name}</td>
                <td>${sale.quantity_sold}</td>
                <td>₱${parseFloat(sale.total).toFixed(2)}</td>
                <td>${sale.customer_name || '-'}</td>
                <td>${sale.payment_type || '-'}</td>
                <td>${new Date(sale.sale_date).toLocaleString()}</td>
            </tr>
        `;
    });
}

document.getElementById("downloadInventoryBtn").addEventListener("click", () => {
    const start = document.getElementById("fromDate").value;
    const end = document.getElementById("toDate").value;

    if (!start || !end) {
        alert("Please select both start and end dates.");
        return;
    }

    // Update to point to PDF export route
    const url = `${BASE_URL}/api/records/export-inventory-range?start=${start}&end=${end}`;
    window.open(url, "_blank");
});

document.getElementById("downloadSalesBtn").addEventListener("click", () => {
    const start = document.getElementById("fromDate").value;
    const end = document.getElementById("toDate").value;

    if (!start || !end) {
        alert("Please select both start and end dates.");
        return;
    }

    // Update to point to PDF export route
    const url = `${BASE_URL}/api/records/export-sales-range?start=${start}&end=${end}`;
    window.open(url, "_blank");
});


