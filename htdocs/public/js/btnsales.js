// Open Quick Sale Modal
document.getElementById('openQuickSale').addEventListener('click', () => {
    document.getElementById('quickSaleModal').style.display = 'block';
  });
  
  // Close Modal via Close Button
  document.getElementById('closeQuickSale').addEventListener('click', () => {
    document.getElementById('quickSaleModal').style.display = 'none';
  });
  
  // Optional: Close Modal When Clicking Outside of Modal Content
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('quickSaleModal');
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  document.getElementById('openQuickSale').addEventListener('click', () => {
    document.getElementById('quickSaleModal').style.display = 'block';
    loadItemsForQuickSale(); // Call here
  });
  