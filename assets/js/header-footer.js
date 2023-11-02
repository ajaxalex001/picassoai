fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;

        // Get the current page URL
        const currentPageFull = window.location.href;
        const currentPage = currentPageFull.substring(currentPageFull.lastIndexOf('/') + 1);

        // List of menu items with their corresponding URLs
        // TODO: fold in all product pages
        const menuItems = {
            'index.html': 'index.html',
            'about.html': ['about.html', 'team.html'],
            'products.html': ['products.html', 'products_exo.html', 'products_act.html', 'products_sen.html', 'products_elc.html'],
            'contact.html': 'contact.html'
        };

        // Find the correct menu item and add the 'active' class
        for (const menuItem in menuItems) {
            const itemURL = Array.isArray(menuItems[menuItem]) ? menuItems[menuItem] : [menuItems[menuItem]];
            if (itemURL.includes(currentPage)) {
                document.querySelector('a[href="' + menuItem + '"]').parentNode.classList.add('active');
                break;
            }
        }
    })
    .catch(error => {
        console.error('Error fetching header:', error);
    });

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-container').innerHTML = data;
    });