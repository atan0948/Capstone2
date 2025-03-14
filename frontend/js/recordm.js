document.getElementById("downloadReport").addEventListener("click", function () {
    window.location.href = "http://localhost:3000/api/records/export";
});

document.getElementById("generateReportBtn").addEventListener("click", async function () {
    const selectedDate = document.getElementById("reportDate").value;

    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/records/report/${selectedDate}`, {
            headers: { 'Authorization': localStorage.getItem('token') }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch report: ${response.statusText}`);
        }

        const data = await response.json();
        updateReportTable(data);
    } catch (error) {
        console.error("❌ Error fetching report:", error);
        alert("Failed to load report.");
    }
});

function updateReportTable(records) {
    const tableBody = document.getElementById("reportTableBody");
    tableBody.innerHTML = ''; // Clear previous data

    if (!records.length) {
        tableBody.innerHTML = '<tr><td colspan="10">No records found for this date.</td></tr>';
        return;
    }

    records.forEach(record => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.item_name}</td>
            <td>${record.category}</td>
            <td>${record.size}</td>
            <td>${record.color}</td>
            <td>${record.quantity}</td>
            <td>₱${parseFloat(record.price).toFixed(2)}</td>
            <td>${record.supplier}</td>
            <td>${record.location}</td>
            <td>${formatDate(record.date_added)}</td>
        `;
        tableBody.appendChild(row);
    });

    console.log("✅ Report table updated successfully.");
}

// Function to format the date properly
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Formats as "DD/MM/YYYY"
}

