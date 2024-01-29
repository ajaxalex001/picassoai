const noImage = 'assets/img/products/na.png';
const tempImage = 'assets/img/products/nographic.png';

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
                const encodedUrl = encodeURIComponent(url == noImage ? tempImage : url);
        
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
        productPriceElement.innerHTML = data.price > 0 ? `<strong>Price:</strong> $${data.price.toFixed(2)}` : "Price not available. Request a quote for more details.";
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

        // Generate the downloads section
        if (data.downloads && data.downloads.length > 0) {
            // Create the HTML string for the downloads section
            const downloadsHTML = `
              <section id="services" class="services section-bg">
                <div class="container" data-aos="fade-up">
                  <h4 class="specs-title text-center">Downloads</h4>
                  <div class="row">
                    ${data.downloads.map(download => `
                      <div class="col-sm-3 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="100">
                        <div class="icon-box iconbox-blue">
                          <div class="icon"><a href="${download.ref}">
                            <svg width="100" height="100" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                              <path stroke="none" stroke-width="0" fill="#f5f5f5" d="M300,521.0016835830174C376.1290562159157,517.8887921683347,466.0731472004068,529.7835943286574,510.70327084640275,468.03025145048787C554.3714126377745,407.6079735673963,508.03601936045806,328.9844924480964,491.2728898941984,256.3432110539036C474.5976632858925,184.082847569629,479.9380746630129,96.60480741107993,416.23090153303,58.64404602377083C348.86323505073057,18.502131276798302,261.93793281208167,40.57373210992963,193.5410806939664,78.93577620505333C130.42746243093433,114.334589627462,98.30271207620316,179.96522072025542,76.75703585869454,249.04625023123273C51.97151888228291,328.5150500222984,13.704378332031375,421.85034740162234,66.52175969318436,486.19268352777647C119.04800174914682,550.1803526380478,217.28368757567262,524.383925680826,300,521.0016835830174"></path>
                            </svg>
                            <i class="bx bx-stop-circle"></i>
                          </div></a>
                          <h5><a href="${download.ref}">${download.name}</a></h5>
                          <p>${download.description}</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </section>
            `;
          
            // Append the new section to the bottom of the product details section
            const mainElement = document.querySelector('main');
            if (mainElement) {
                mainElement.insertAdjacentHTML('beforeend', downloadsHTML);
            }
          }
    } catch (error) {
        console.error('Error fetching or displaying product data:', error);
    }
}

fetchData();