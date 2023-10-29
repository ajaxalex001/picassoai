async function fetchData(filepath) {
    try {
        const response = await fetch(filepath);
        const data = await response.json();

        // Set product title
        document.querySelector('.section-title h2').textContent = data.title;

        // Set product image
        document.getElementById('product-image').src = data.image;

        // Populate specifications dynamically
        const specifications = data.specifications;
        let specHTML = '<h7><table border="1" width="650" height="550" class="text-center"><caption></caption><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>';

        for (const spec in specifications) {
            specHTML += `<tr><td>${spec}</td><td>${specifications[spec]}</td></tr>`;
        }

        specHTML += '</tbody></table></h7>';

        // Display specifications
        document.getElementById('spec-details').innerHTML = specHTML;
    } catch (error) {
        console.error('Error fetching or displaying product data:', error);
    }
}
