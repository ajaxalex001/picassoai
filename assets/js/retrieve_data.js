function getYouTubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
    const match = url.match(regex);
    return match && match[1];
}

function preventAutoScroll() {
    // Find the carousel element
    var heroCarousel = document.getElementById("heroCarousel");

    // Remove the data-ride attribute to stop automatic sliding
    heroCarousel.removeAttribute("data-ride");

    // Stop the interval that handles automatic sliding
    $('.carousel').carousel('pause');
}

let youtubePlayer;

async function fetchData() {
    try {
        // Get the value of the fileName parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get('fileName');
        const filePath = `assets/specdata/${fileName}`;

        const response = await fetch(filePath);
        const data = await response.json();

        // Set product title
        document.querySelector('.section-title h2').textContent = data.title;

        // Set product images
        var imageUrls = Array.isArray(data.image) ? data.image : [data.image ?? "assets/img/products/na.png"];
        var carouselInner = document.getElementById('carousel-inner');

        // Iterate through image URLs and create carousel items
        imageUrls.forEach(function (url, index) {
            const isActive = index === 0;
        
            // Check if the imageUrl contains "youtube.com"
            if (url.includes("youtube.com")) {
                // Extract the video ID from the YouTube URL
                const videoId = getYouTubeVideoId(url);
        
                // Create an iframe element for the YouTube video
                const iframe = document.createElement('iframe');
                iframe.src = 'https://www.youtube.com/embed/' + videoId;
                iframe.style.width = '90%';
                iframe.style.height = '90%';
                iframe.style.border = 'none';
                iframe.allowFullscreen = true;
        
                // Create carousel item
                const carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item' + (isActive ? ' active' : '');

                carouselItem.style.display = 'flex';
                carouselItem.style.justifyContent = 'center';
                carouselItem.style.alignItems = 'center';

                carouselItem.appendChild(iframe);
                carouselInner.appendChild(carouselItem);

                preventAutoScroll();
            } else {
                // Encode the URL to handle spaces
                const encodedUrl = encodeURIComponent(url);
        
                // Create carousel item
                const carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item' + (isActive ? ' active' : '');
                carouselItem.style.backgroundImage = 'url(' + encodedUrl + ')';
                carouselItem.style.backgroundSize = 'contain';
                carouselInner.appendChild(carouselItem);
            }
        
            // Create carousel indicator
            const indicator = document.createElement('li');
            indicator.setAttribute('data-target', '#heroCarousel');
            indicator.setAttribute('data-slide-to', index);
            indicator.className = isActive ? 'active' : '';
            document.getElementById('hero-carousel-indicators').appendChild(indicator);
        });
        const aspectRatio = 1;

        // Move these lines to adjust the width and height dynamically
        const heroSection = document.getElementById('hero');
        heroSection.style.width = 'calc(80% - 20px)';
        // heroSection.style.height = `calc((80% - 20px) * ${aspectRatio})`;


        // Set product price
        const productPriceElement = document.getElementById('product-price');
        productPriceElement.textContent = data.price;
        productPriceElement.innerHTML = `<strong>Price:</strong> $${data.price.toFixed(2)}`;
        productPriceElement.style.color = '#1ed33c'; //FIXME: query from CSS instead of hardcoding
        productPriceElement.style.fontSize = 'larger';

        // Set product description
        const productDescriptionElement = document.getElementById('description');
        productDescriptionElement.innerHTML = data.description;

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

fetchData();