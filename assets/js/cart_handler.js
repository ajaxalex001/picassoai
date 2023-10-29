// Get the quantity display element and buttons
const quantityDisplay = document.getElementById('quantity-display');
const increaseBtn = document.getElementById('increase-btn');
const decreaseBtn = document.getElementById('decrease-btn');

// Initial quantity value
let quantity = 1;

// Function to update the quantity display
function updateQuantity() {
    quantityDisplay.textContent = quantity;
}

// Event listener for increase button
increaseBtn.addEventListener('click', function() {
    // Increase the quantity when the + button is clicked
    quantity++;
    updateQuantity();
});

// Event listener for decrease button
decreaseBtn.addEventListener('click', function() {
    // Decrease the quantity but ensure it doesn't go below 1
    quantity = Math.max(quantity - 1, 1);
    updateQuantity();
});
