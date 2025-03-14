document.addEventListener("DOMContentLoaded", function () {
    const addGarmentForm = document.getElementById("addGarmentForm");

    if (!addGarmentForm) {
        console.error("❌ Form element not found!");
        return;
    }

    addGarmentForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("✅ Form submitted!");

        const formData = new FormData(addGarmentForm);

        try {
            const response = await fetch("http://localhost:3000/api/garments/add", {
                method: "POST", // ✅ Added HTTP method
                body: formData, // ✅ Sending form data
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json(); // ✅ Ensure JSON response
            console.log("Response received:", data);

            if (data.image_url) {
                console.log("✅ Image uploaded successfully:", data.image_url);
            } else {
                console.error("❌ Image upload failed!");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    });
});
