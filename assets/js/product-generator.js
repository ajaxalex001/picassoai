// Get container to put all the children
const portfolioContainer = document.querySelector('.row.portfolio-container');
const showAllSymbol = '!ALL!'

const scriptSrc = document.currentScript.src;
const url = new URL(scriptSrc);
const showParam = url.searchParams.get('show');
const showList = showParam ? showParam.split(',') : [showAllSymbol];

const noImage = 'assets/img/products/na.png';

async function fetchData(fileName) {
    const response = await fetch(`assets/specdata/${fileName}`);
    const data = await response.json();
    data.fileName = fileName;
    return data;
  }
  
function generateHTML(data) {
    const imageSrc = (Array.isArray(data.image) ? data.image[0] : data.image) ?? noImage;

    const filterList = (Array.isArray(data.filter) ? data.filter : [data.filter ?? 'act']);

    if(!showList.includes(showAllSymbol) && !filterList.some(f => showList.includes(f))) {
      return;
    }

    const filterSrc = filterList.map(f => `filter-${f}`).join(' ');
    const actuatorLink = `product_specs.html?fileName=${data.fileName}`;
    const actuatorName = data.title;

    const blurb = Array.isArray(data.blurb) ? 
    data.blurb.map(
      (item) =>
        `<p>${item}: <span style="float: right; font-weight: bold;">${
          data.specifications[item] ?? 'N/A'
        }</span></p>`
    )
    .join('') : data.blurb;
    
    const html = `
      <div class="col-lg-4 col-md-6 portfolio-item ${filterSrc} dynamically-generated">
        <a href="${actuatorLink}" class="actuator-link"><img src="${imageSrc}" alt="Picture of ${actuatorName}" class="img-fluid custom-border" title="More Details"></a>
        <div class="portfolio-info ${imageSrc == noImage ? "always-show-portfolio-info" : ""}">
          <h4><a href="${actuatorLink}" class="text-danger actuator-name">${actuatorName}</a></h4>
          <p>${blurb}</p>
        </div>
      </div>
    `;
    
    return html;
}

async function fetchAndGenerateHTML() {
    try {
        const loadingSpinner = document.querySelector('.loading-spinner');
        loadingSpinner.style.display = 'block';
        
        // fetch all products
        const response = await fetch('assets/specdata/fileList.txt');
        const text = await response.text();
        const fileNames = text.split('\n').filter(fileName => fileName.trim() !== '').map(fileName => `${fileName.trim()}.json`);

        // Remove dynamically generated elements
        const dynamicElements = document.querySelectorAll('.dynamically-generated');
        dynamicElements.forEach(element => {
            element.remove();
        });

        const fetchPromises = fileNames.map(fileName => fetchData(fileName));
        const dataList = await Promise.all(fetchPromises);

        const animationFramePromises = dataList.map(data => {
            return new Promise(resolve => {
                requestAnimationFrame(() => {
                    const generatedHTML = generateHTML(data);
                    if(generatedHTML !== undefined) {
                      const newDiv = document.createElement('div');
                      newDiv.className = 'col-lg-4 col-md-6 portfolio-item filter-act dynamically-generated';
                      newDiv.innerHTML = generatedHTML;
      
                      portfolioContainer.appendChild(newDiv.firstElementChild);
                      resolve(); // Resolve the promise after the animation frame callback is executed
                    }
                    resolve();
                });
            });
        });
    
        await Promise.all(animationFramePromises);
        const scriptTag = document.createElement('script');
        scriptTag.src = 'assets/js/mainMod.js';
        document.body.appendChild(scriptTag);
        
        loadingSpinner.style.display = 'none'; // Hide the loading spinner after content is loaded
    } catch (error) {
        console.error('Error fetching data:', error);
        loadingSpinner.style.display = 'none'; // Hide the loading spinner in case of an error
    }
}

window.addEventListener('load',  (event) => {
    fetchAndGenerateHTML().then(() => {
    }); 
});
