document.addEventListener('DOMContentLoaded', function() {
    // Load the header
    
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('components/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                
                // Initialize mobile menu after header is loaded
                initializeMobileMenu();
            })
            .catch(error => console.error('Error loading header:', error));
    }
    
    // Load the footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('components/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
    
    // Initialize accordions if they exist on the page
    const firstAccordionHeader = document.querySelector(".accordion-header");
    if (firstAccordionHeader) {
        // Simulate a click on the first accordion header to open it by default
        firstAccordionHeader.click();
    }
});

// Function to initialize mobile menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
        });
        
        // For mobile: make dropdown toggles work with touch
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link && link.classList.contains('dropdown-toggle')) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 991) {
                        e.preventDefault();
                        item.classList.toggle('active');
                        
                        navItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });
                    }
                });
            }
        });
        
        // For submenu toggles on mobile
        const hasSubmenus = document.querySelectorAll('.has-submenu');
        hasSubmenus.forEach(item => {
            const link = item.querySelector('.dropdown-item');
            if (link) {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 991) {
                        e.preventDefault();
                        item.classList.toggle('active');
                        
                        const siblings = item.parentElement.querySelectorAll('.has-submenu');
                        siblings.forEach(sibling => {
                            if (sibling !== item) {
                                sibling.classList.remove('active');
                            }
                        });
                    }
                });
            }
        });
    }
}

/**
 * Toggles the accordion content visibility
 * @param {HTMLElement} element - The accordion header element that was clicked
 */
function toggleAccordion(element) {
    // Toggle the active class on the clicked header
    element.classList.toggle("active");
    
    // Get the content element that follows the header
    var content = element.nextElementSibling;
    
    // Toggle the display of the content
    if (content.style.display === "block") {
        content.style.display = "none";
        element.querySelector(".accordion-icon").textContent = "+";
    } else {
        content.style.display = "block";
        element.querySelector(".accordion-icon").textContent = "-";
    }
}

/**
 * Toggles the FAQ answer visibility
 * @param {HTMLElement} element - The FAQ question element that was clicked
 */
function toggleFaq(element) {
    // Toggle the active class on the clicked question
    element.classList.toggle("active");
    
    // Get the answer element that follows the question
    var answer = element.nextElementSibling;
    
    // Toggle the display of the answer
    if (answer.style.display === "block") {
        answer.style.display = "none";
        element.querySelector(".faq-icon").textContent = "+";
    } else {
        answer.style.display = "block";
        element.querySelector(".faq-icon").textContent = "-";
    }
}
