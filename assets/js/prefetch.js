console.log('prefetching')
// Fetch the list of JSON files from fileList.txt
fetch('assets/specdata/fileList.txt')
  .then(response => response.text())
  .then(fileList => {
    // Split the file list into an array of JSON file paths and append ".json" to each item
    const jsonFiles = fileList.split('\n').filter(Boolean).map(filename => `${filename.trim()}.json`);

    // Prefetch JSON files and their associated image files
    jsonFiles.forEach(jsonFile => {
      // Prefetch JSON file
      const jsonLink = document.createElement('link');
      jsonLink.rel = 'prefetch';
      jsonLink.href = `assets/specdata/${jsonFile}`;
      document.head.appendChild(jsonLink);

      // Parse the JSON file to get the image file path
      fetch(`assets/specdata/${jsonFile}`)
        .then(response => response.json())
        .then(data => {
          const imageFilePath = data.image; // Assuming the image attribute is called 'image'

          // Prefetch the associated image file
          const imageLink = document.createElement('link');
          imageLink.rel = 'prefetch';
          imageLink.href = imageFilePath;
          document.head.appendChild(imageLink);
        })
        .catch(error => {
          console.error(`Error fetching JSON file: ${error}`);
        });
    });
  })
  .catch(error => {
    console.error(`Error fetching file list: ${error}`);
  });
  console.log('prefetch complete')