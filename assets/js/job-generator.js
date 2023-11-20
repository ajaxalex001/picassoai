// Get container to put all the children
const portfolioContainer = document.querySelector('.row.jobs-container');

async function fetchData(fileName) {
    const response = await fetch(`assets/jobapps/${fileName}`);
    const data = await response.json();
    return data;
  }

async function fetchAndGenerateHTML() {

    const loadingSpinner = document.querySelector('.loading-spinner');

    try {
        const response = await fetch('assets/jobapps/fileList.txt');
        const text = await response.text();
        const fileNames = text.split('\n').filter(fileName => fileName.trim() !== '').map(fileName => `${fileName.trim()}.json`);

        // Remove dynamically generated elements
        const dynamicElements = document.querySelectorAll('.dynamically-generated');
        dynamicElements.forEach(element => {
            element.remove();
        });

        const fetchPromises = fileNames.map(fileName => fetchData(fileName));
        const dataList = await Promise.all(fetchPromises);
        const jobsContainer = document.getElementById('jobs-container');

        const animationFramePromises = dataList.map(job => {
            return new Promise(resolve => {
                requestAnimationFrame(() => {
                    const jobHTML = `
                    <div class="job">
                        <div class="job-text">
                            <div class="job-title"><strong>${job.title}</strong></div>
                            <div class="job-description">${job.description}</div>
                            <div class="job-description"><strong>Tasks:</strong> ${job.tasks}</div>
                            <div class="job-description"><strong>Skills:</strong> ${job.skills}</div>
                            <button class="apply-button";" onclick="openPopup('${job.title} Job Application')">Apply</button>
                        </div>
                        
                    </div>
                `;

                jobsContainer.innerHTML += jobHTML;
                resolve(); // Resolve the promise after the animation frame callback is executed
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

function openPopup(subject) {

    // Create a div element for the popup
    const popup = document.createElement('div');
    popup.className = 'popup';

    // Create a paragraph element with the popup message and email link
    const message = document.createElement('p');
    message.innerHTML = `
    Please email <a href="mailto:info@picassointelligence.com">info@picassointelligence.com</a> with the following items:
    <ul>
        <li>Subject: ${subject}</li>
        <li>Resume (pdf or docx)</li>
        <li>Cover letter (optional)</li>
        <li>Why you would be a good fit for this role</li>
    </ul>`;
    
    // Create a close button for the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.className = 'close-button';

    // Append the message and close button to the popup
    popup.appendChild(message);
    popup.appendChild(closeButton);

    // Append the popup to the body of the document
    document.body.appendChild(popup);


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

    setTimeout(() => {
        popup.classList.add('active');
    }, 10); // Adding a slight delay for smoother animation

    // Event listener for the close button to close the popup
    closeButton.addEventListener('click', closePopup);

    // Event listener to close the popup when clicking outside its area
    document.addEventListener('click', function closePopupOutside(e) {
        if (!popup.contains(e.target) && popup.classList.contains('active')) {
            closePopup();
        }
    });
};

window.addEventListener('load',  (event) => {
    fetchAndGenerateHTML().then(() => {
    }); 
});
