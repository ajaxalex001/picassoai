async function fetchData(filepath) {
    try {
        const response = await fetch(filepath);
        const data = await response.json();

        // Set product title
        document.querySelector('.section-title h2').textContent = data.title;

        // Set product image
        const productImage = document.getElementById('product-image');
        productImage.src = data.image;

        // Calculate 1/3rd of the total screen width
        const oneThirdScreenWidth = window.innerWidth / 3;


        // Set width of the image to 1/3rd of the total screen width
        productImage.style.width = `${oneThirdScreenWidth}px`;

        // Set product price
        const productPriceElement = document.getElementById('product-price');
        productPriceElement.textContent = data.price;
        productPriceElement.innerHTML = `<strong>Price:</strong> $500`;
        productPriceElement.style.color = '#1ed33c'; //FIXME: query from CSS instead of hardcoding
        productPriceElement.style.fontSize = 'larger';

        // Set product description
        const productDescriptionElement = document.getElementById('description');
        productDescriptionElement.textContent = data.description;

        // Populate specifications dynamically
        const specifications = data.specifications;
        const specificationsCount = Object.keys(specifications).length;
        let leftSpecsHTML = '<tr><th class="green-text"></tr>';
        let rightSpecsHTML = '<tr><th class="green-text"></tr>';

        let count = 0;
        for (const spec in specifications) {
            // Apply green-text class to property labels for green color
            const specHTML = `<tr><td class="green-text">${spec}</td><td>${specifications[spec]}</td></tr>`;

            if (count < specificationsCount / 2) {
                leftSpecsHTML += specHTML;
            } else {
                rightSpecsHTML += specHTML;
            }
            count++;
        }

        // Display specifications in the respective columns
        document.getElementById('left-specs-table').innerHTML = leftSpecsHTML;
        document.getElementById('right-specs-table').innerHTML = rightSpecsHTML;
    } catch (error) {
        console.error('Error fetching or displaying product data:', error);
    }
}
