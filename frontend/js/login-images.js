document.addEventListener('DOMContentLoaded', function() {
    // Image Cycling
    const productImage = document.getElementById('productImage');
    const imageArray = [
        'images/prod1.png',
        'images/prod2.png',
        'images/prod3.png'
    ];
    let currentImageIndex = 0;
    const dots = document.querySelectorAll('.dot');

    if (productImage && imageArray.length > 0) {
        setInterval(() => {
            productImage.src = imageArray[currentImageIndex];

            currentImageIndex++;
            if (currentImageIndex >= imageArray.length) {
                currentImageIndex = 0;
            }
        }, 3000);

        setInterval(() => {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentImageIndex].classList.add('active');
        }, 3000);
    } else {
        console.error("Product image element or image array not found.");
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentImageIndex--;
            if (currentImageIndex < 0) {
                currentImageIndex = imageArray.length - 1;
            }
            productImage.src = imageArray[currentImageIndex];
            updateDots();
        });

        nextBtn.addEventListener('click', () => {
            currentImageIndex++;
            if (currentImageIndex >= imageArray.length) {
                currentImageIndex = 0;
            }
            productImage.src = imageArray[currentImageIndex];
            updateDots();
        });
    }

    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentImageIndex].classList.add('active');
    }
});