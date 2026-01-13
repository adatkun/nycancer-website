// ================================================
// NEW YORK IMAGING SPECIALISTS
// Component Loader & Site Functionality
// js/components.js
// ================================================

// Load external HTML components
async function loadComponent(elementId, filePath) {
  console.log(`Attempting to load ${filePath} into #${elementId}`);

  try {
    const response = await fetch(filePath);
    console.log(`Fetch response for ${filePath}:`, response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log(`Successfully fetched ${filePath}, length: ${html.length}`);

    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
      console.log(`✓ Loaded component: ${filePath}`);
    } else {
      console.error(`✗ Element not found: #${elementId}`);
    }
  } catch (error) {
    console.error(`✗ Error loading component ${filePath}:`, error);

    // Show error message in the placeholder
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `
        <div style="padding: 20px; background: #fee; color: #c00; border: 1px solid #fcc; margin: 10px; border-radius: 5px;">
          <strong>Error loading ${filePath}:</strong><br>
          ${error.message}<br>
          <small>Make sure you're running a local server, not opening files directly.</small>
        </div>
      `;
    }
  }
}

// Initialize all components and functionality
async function initializeSite() {
  console.log("🚀 Initializing NYI site...");
  console.log("Current URL:", window.location.href);
  console.log("Current protocol:", window.location.protocol);

  // Check if running from file:// protocol
  if (window.location.protocol === "file:") {
    console.warn("⚠️ Running from file:// protocol. Fetch API may not work!");
    console.warn("Please run a local server instead:");
    console.warn("VS Code: Use Live Server extension");
    console.warn("Python 3: python -m http.server 8000");
    console.warn("Node.js: npx http-server");
  }


  
  // Load header (if placeholder exists)
  if (document.getElementById("header-placeholder")) {
    await loadComponent("header-placeholder", "/header2.html");
  }


  // Load footer (if placeholder exists)
  if (document.getElementById("footer-placeholder")) {
    await loadComponent("footer-placeholder", "/footer.html");
  }

  // Load "Why Choose NYI" section (if placeholder exists)
  if (document.getElementById("why-choose-nyi-placeholder")) {
    await loadComponent("why-choose-nyi-placeholder", "/components/why-choose-nyi.html");
  }

  console.log("Components loaded, setting up functionality...");

  // Setup mobile menu after header is loaded
  if (typeof window.setupMobileMenu === "function") {
    window.setupMobileMenu();
    console.log("✓ Mobile menu setup complete");
  } else {
    console.error(
      "✗ setupMobileMenu function not found. Make sure navigation.js is loaded."
    );
  }

  // Setup smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const yOffset = -80; // Account for fixed header
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    });
  });

  console.log("✅ NYI site initialization complete!");
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing site...");
  initializeSite();
});

// ================================================
// EXPLANATION OF JAVASCRIPT FUNCTIONALITY
// ================================================
/*
 * This website uses JavaScript for several key features:
 *
 * 1. COMPONENT LOADING (components.js)
 *    - Loads header.html and footer.html into placeholder divs
 *    - Keeps code DRY (Don't Repeat Yourself)
 *    - Makes updates easier - change once, affects all pages
 *    - Waits for components to load before initializing functionality
 *
 * 2. MOBILE NAVIGATION (navigation.js)
 *    - Creates hamburger menu on mobile devices
 *    - Toggles mobile menu open/closed
 *    - Prevents body scroll when menu is open
 *    - Closes menu when clicking outside
 *    - Animates hamburger icon to X when open
 *
 * 3. SMOOTH SCROLLING
 *    - Makes anchor links scroll smoothly to sections
 *    - Accounts for fixed header height
 *
 * INITIALIZATION ORDER:
 * 1. DOM loads
 * 2. Components are fetched and inserted
 * 3. Mobile menu is set up after header exists
 * 4. Event listeners are attached
 */