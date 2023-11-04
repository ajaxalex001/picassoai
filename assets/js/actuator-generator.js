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
    
        await Promise.all(animationFramePromises);
        const scriptTag = document.createElement('script');
        scriptTag.src = 'assets/js/main.js';
        document.body.appendChild(scriptTag);
        
        loadingSpinner.style.display = 'none'; // Hide the loading spinner after content is loaded
    } catch (error) {
        console.error('Error fetching data:', error);
        loadingSpinner.style.display = 'none'; // Hide the loading spinner in case of an error
    }
}
// fetchAndGenerateHTML();

window.addEventListener('load',  (event) => {
    fetchAndGenerateHTML(); //.then(() => {initalizePage()});
});


// initalizePage();

// function test() {
//     // $(window).on('load', function() {
//         // console.log(document.documentElement.outerHTML)
//         var portfolioIsotope = $('.portfolio-container').isotope({
//           itemSelector: '.portfolio-item'
//         });
    
//         $('#portfolio-flters li').on('click', function() {
//           $("#portfolio-flters li").removeClass('filter-active');
//           $(this).addClass('filter-active');
    
//           portfolioIsotope.isotope({
//             filter: $(this).data('filter')
//           });
//           aos_init();
//         });
    
//         // Initiate venobox (lightbox feature used in portofilo)
//         $(document).ready(function() {
//           $('.venobox').venobox();
//         });
//     //   });
//     //   console.log(document.documentElement.outerHTML);
// }

// function aos_init() {
//     AOS.init({
//       duration: 1000,
//       once: true
//     });
//   }

function initalizePage() {
    "use strict";
  
    // Smooth scroll for the navigation menu and links with .scrollto classes
    $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        if (target.length) {
          e.preventDefault();
  
          var scrollto = target.offset().top;
  
          if ($('#header').length) {
            scrollto -= $('#header').outerHeight()
          }
  
          if ($(this).attr("href") == '#header') {
            scrollto = 0;
          }
  
          $('html, body').animate({
            scrollTop: scrollto
          }, 1500, 'easeInOutExpo');
  
          if ($(this).parents('.nav-menu, .mobile-nav').length) {
            $('.nav-menu .active, .mobile-nav .active').removeClass('active');
            $(this).closest('li').addClass('active');
          }
  
          if ($('body').hasClass('mobile-nav-active')) {
            $('body').removeClass('mobile-nav-active');
            $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
            $('.mobile-nav-overly').fadeOut();
          }
          return false;
        }
      }
    });
  
    // Mobile Navigation
    if ($('.nav-menu').length) {
      var $mobile_nav = $('.nav-menu').clone().prop({
        class: 'mobile-nav d-lg-none'
      });
      $('body').append($mobile_nav);
      $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
      $('body').append('<div class="mobile-nav-overly"></div>');
  
      $(document).on('click', '.mobile-nav-toggle', function(e) {
        $('body').toggleClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        $('.mobile-nav-overly').toggle();
      });
  
      $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
        e.preventDefault();
        $(this).next().slideToggle(300);
        $(this).parent().toggleClass('active');
      });
  
      $(document).click(function(e) {
        var container = $(".mobile-nav, .mobile-nav-toggle");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          if ($('body').hasClass('mobile-nav-active')) {
            $('body').removeClass('mobile-nav-active');
            $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
            $('.mobile-nav-overly').fadeOut();
          }
        }
      });
    } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
      $(".mobile-nav, .mobile-nav-toggle").hide();
    }
  
    // Intro carousel
    var heroCarousel = $("#heroCarousel");
    var heroCarouselIndicators = $("#hero-carousel-indicators");
    heroCarousel.find(".carousel-inner").children(".carousel-item").each(function(index) {
      (index === 0) ?
      heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "' class='active'></li>"):
        heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "'></li>");
    });
  
    heroCarousel.on('slid.bs.carousel', function(e) {
      $(this).find('.carousel-content ').addClass('animated fadeInDown');
    });
  
    // Back to top button
    $(window).scroll(function() {
      if ($(this).scrollTop() > 100) {
        $('.back-to-top').fadeIn('slow');
      } else {
        $('.back-to-top').fadeOut('slow');
      }
    });
  
    $('.back-to-top').click(function() {
      $('html, body').animate({
        scrollTop: 0
      }, 1500, 'easeInOutExpo');
      return false;
    });
  
    // Porfolio isotope and filter
    $(window).on('load', function() {
      // console.log(document.documentElement.outerHTML)
      var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item'
      });
  
      $('#portfolio-flters li').on('click', function() {
        $("#portfolio-flters li").removeClass('filter-active');
        $(this).addClass('filter-active');
  
        portfolioIsotope.isotope({
          filter: $(this).data('filter')
        });
        aos_init();
      });
  
      // Initiate venobox (lightbox feature used in portofilo)
      $(document).ready(function() {
        $('.venobox').venobox();
      });
    });
  
    // Skills section
    $('.skills-content').waypoint(function() {
      $('.progress .progress-bar').each(function() {
        $(this).css("width", $(this).attr("aria-valuenow") + '%');
      });
    }, {
      offset: '80%'
    });
  
    // Portfolio details carousel
    $(".portfolio-details-carousel").owlCarousel({
      autoplay: true,
      dots: true,
      loop: true,
      items: 1
    });
  
    // Initi AOS
    function aos_init() {
      AOS.init({
        duration: 1000,
        once: true
      });
    }
    aos_init();
  
  };
