// Get the quantity display element and buttons
const quantityDisplay = document.getElementById('quantity-display');
const increaseBtn = document.getElementById('increase-btn');
const decreaseBtn = document.getElementById('decrease-btn');
const quoteBtn = document.getElementById('quote-btn');
//TODO: get product name from document
//TODO: get client email address
const productName = 'Product Name';

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

quoteBtn.addEventListener('click', function(event) {

    emailjs.init("");

    emailjs.send("","",{
        from_name: "Picasso Intelligence",
        to_name: "[insert name]",
        });

    return;
    event.preventDefault();

    // Create a div element for the popup
    const popup = document.createElement('div');
    popup.className = 'popup';

    // Create a paragraph element with the popup message and email link
    const message = document.createElement('p');
    message.innerHTML = 'Online ordering is temporarily down. Contact <a href="mailto:info@picassointelligence.com">info@picassointelligence.com</a> for a quote.';
    
    // Create a close button for the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.className = 'close-button';

    // Append the message and close button to the popup
    popup.appendChild(message);
    popup.appendChild(closeButton);

    // Append the popup to the body of the document
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('active');
    }, 10); // Adding a slight delay for smoother animation

    function closePopup() {
        // Remove the 'active' class to trigger the closing animation
        popup.classList.remove('active');

        // Wait for the animation to complete before removing the popup from the DOM
        popup.addEventListener('transitionend', function handleTransitionEnd() {
            // Check if the popup is still a child of the document body
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }

            // Remove the event listener to prevent memory leaks
            popup.removeEventListener('transitionend', handleTransitionEnd);
        });
    }

    // Event listener for the close button to close the popup
    closeButton.addEventListener('click', closePopup);

    // Event listener to close the popup when clicking outside its area
    document.addEventListener('click', function closePopupOutside(e) {
        if (!popup.contains(e.target) && popup.classList.contains('active')) {
            closePopup();
        }
    });
});
