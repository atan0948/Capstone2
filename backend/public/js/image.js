const formData = new FormData(addGarmentForm);
formData.forEach((value, key) => console.log(`📩 Sending: ${key} = ${value}`)); // Debug data

try {
    const response = await fetch("http://192.168.78.207:3000/api/garments", {
        method: "POST",
        // ❌ Do NOT set "Content-Type", it will be set automatically for `FormData`
        body: formData, 
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log("✅ Response received:", data);
} catch (error) {
    console.error("❌ Fetch error:", error);
}
