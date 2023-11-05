// Get container to put all the children
const portfolioContainer = document.querySelector('.row.portfolio-container');

async function fetchData(fileName) {
    const response = await fetch(`assets/specdata/${fileName}`);
    const data = await response.json();
    return data;
  }
  
function generateHTML(data) {
    const fileName = data.title.replace(/ /g, "-") + ".json";
    const imageSrc = data.image;
    const actuatorLink = `actuator_specs.html?fileName=${fileName}`;
    const actuatorName = data.title;
    const blurb = data.blurb.replace(/\n/g, '<br>');
    
    const html = `
      <div class="col-lg-4 col-md-6 portfolio-item filter-act dynamically-generated">
        <a href="${actuatorLink}" class="actuator-link"><img src="${imageSrc}" class="img-fluid" title="More Details"></a>
        <div class="portfolio-info ">
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
                    const newDiv = document.createElement('div');
                    newDiv.className = 'col-lg-4 col-md-6 portfolio-item filter-act dynamically-generated';
                    newDiv.innerHTML = generatedHTML;
    
                    portfolioContainer.appendChild(newDiv.firstElementChild);
                    resolve(); // Resolve the promise after the animation frame callback is executed
                });
            });
        });
    
        console.log('awaiting product load')
        await Promise.all(animationFramePromises);
        console.log('product load finished')
        const scriptTag = document.createElement('script');
        scriptTag.src = 'assets/js/main.js';
        document.body.appendChild(scriptTag);
        
        loadingSpinner.style.display = 'none'; // Hide the loading spinner after content is loaded
    } catch (error) {
        console.error('Error fetching data:', error);
        loadingSpinner.style.display = 'none'; // Hide the loading spinner in case of an error
    }
}

window.addEventListener('load',  (event) => {
    fetchAndGenerateHTML(); 
});
