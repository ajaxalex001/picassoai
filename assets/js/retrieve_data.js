// Access the product data passed from HTML
const data = productData;

// Set product image
document.getElementById('product-image').src = data.image;

// Create a simple map for specifications
const specifications = data.specifications;
let specHTML = '<h2>Specifications</h2><ul>';
for (const spec in specifications) {
    specHTML += `<li><strong>${spec}:</strong> ${specifications[spec]}</li>`;
}
specHTML += '</ul>';

// Display specifications
document.getElementById('spec-details').innerHTML = specHTML;
