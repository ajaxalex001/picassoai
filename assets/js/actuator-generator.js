// Find all elements with class filter-act
const filterActElements = document.querySelectorAll('.filter-act');

// Loop through each element and update the href attribute
filterActElements.forEach(element => {
    try {
        // Find the elements with classes actuator-link and actuator-name inside the current element
        const linkElements = element.querySelectorAll('.actuator-link, .actuator-name');

        // Extract the name and replace spaces with dashes
        const name = linkElements[1].textContent.trim().replace(/ /g, '-');

        // Update the href attribute with the dynamically generated fileName for both links
        linkElements[0].href = `actuator_specs.html?fileName=${name}.json`;
        linkElements[1].href = `actuator_specs.html?fileName=${name}.json`;
    } catch (error) {
        // Handle the error by logging a warning message
        console.warn('Failed to replace element:', error);
    }
});


