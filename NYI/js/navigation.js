// ================================================
// NEW YORK IMAGING SPECIALISTS
// Navigation & Mobile Menu Functionality
// js/navigation.js
// ================================================

// Setup mobile menu functionality
// Called by components.js after header is loaded
window.setupMobileMenu = function() {
  console.log('setupMobileMenu called');
  
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const body = document.body;

  console.log('hamburger:', hamburger);
  console.log('mobileNav:', mobileNav);

  if (!hamburger || !mobileNav) {
    console.warn('Mobile menu elements not found. Skipping mobile menu setup.');
    return;
  }

  // Helper function to close the menu
  function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    body.classList.remove('mobile-menu-open');
  }

  // Toggle menu on hamburger click
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    console.log('Hamburger clicked');
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    body.classList.toggle('mobile-menu-open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Close menu when clicking a link (not a toggle button)
  mobileNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      setTimeout(closeMenu, 100);
    });
  });

  // Setup collapsible submenus
  const toggleButtons = mobileNav.querySelectorAll('.mobile-nav-toggle');
  
  toggleButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const targetId = this.getAttribute('data-target');
      const submenu = document.getElementById(targetId);
      const icon = this.querySelector('i');
      
      if (submenu) {
        // Close other open submenus
        toggleButtons.forEach(function(otherButton) {
          if (otherButton !== button) {
            const otherId = otherButton.getAttribute('data-target');
            const otherSubmenu = document.getElementById(otherId);
            const otherIcon = otherButton.querySelector('i');
            
            if (otherSubmenu) {
              otherSubmenu.classList.remove('open');
              otherButton.classList.remove('active');
              if (otherIcon) {
                otherIcon.style.transform = 'rotate(0deg)';
              }
            }
          }
        });
        
        // Toggle current submenu
        submenu.classList.toggle('open');
        this.classList.toggle('active');
        
        if (icon) {
          if (submenu.classList.contains('open')) {
            icon.style.transform = 'rotate(180deg)';
          } else {
            icon.style.transform = 'rotate(0deg)';
          }
        }
      }
    });
  });

// ================================================
// SCROLL-AWARE HEADER
// Moves with scroll - 1:1 with page movement
// ================================================

(function() {
  const header = document.querySelector('.scan-header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let headerOffset = 0;
  const headerHeight = header.offsetHeight;

  window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    // Update header offset based on scroll direction
    headerOffset = headerOffset - scrollDelta;

    // Clamp the offset between -headerHeight and 0
    headerOffset = Math.min(0, Math.max(-headerHeight, headerOffset));

    // Apply the transform
    header.style.transform = `translateY(${headerOffset}px)`;

    lastScrollY = currentScrollY;
  }, { passive: true });
})();

  console.log('✓ Mobile menu event listeners attached');
  console.log('✓ Found', toggleButtons.length, 'collapsible sections');
};

console.log('navigation.js loaded, setupMobileMenu is:', typeof window.setupMobileMenu);