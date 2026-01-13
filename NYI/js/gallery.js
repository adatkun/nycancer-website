// ================================================
// NEW YORK IMAGING SPECIALISTS
// Gallery Functionality - /js/gallery.js
// ================================================

// Gallery images: 001.jpeg through 042.jpeg
const galleryImages = [];
for (let i = 1; i <= 42; i++) {
  galleryImages.push({
    src: String(i).padStart(3, '0') + '.jpeg',
    alt: `NY Imaging facility photo ${i}`
  });
}

const GALLERY_BASE_PATH = "/img/gallery/";

// ================================================
// GALLERY CLASS
// ================================================
class NYIGallery {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Gallery container #${containerId} not found`);
      return;
    }

    this.options = {
      images: galleryImages,
      basePath: GALLERY_BASE_PATH,
      enableLightbox: true,
      layout: "masonry",
      ...options
    };

    this.currentIndex = 0;
    this.lightbox = null;

    this.init();
  }

  init() {
    this.render();
    if (this.options.enableLightbox) {
      this.createLightbox();
      this.bindLightboxEvents();
    }
  }

  render() {
    let gridClass = "gallery-masonry";
    if (this.options.layout === "grid") gridClass = "gallery-grid";
    else if (this.options.layout === "compact") gridClass = "gallery-grid compact";
    else if (this.options.layout === "large") gridClass = "gallery-grid large";

    let html = `<div class="${gridClass}">`;
    this.options.images.forEach((image, index) => {
      html += this.renderItem(image, index);
    });
    html += `</div>`;

    this.container.innerHTML = html;
    this.bindItemEvents();
  }

  renderItem(image, index) {
    const imgSrc = this.options.basePath + image.src;
    
    return `
      <div class="gallery-item" data-index="${index}">
        <img src="${imgSrc}" alt="${image.alt}" loading="lazy">
        ${this.options.enableLightbox ? `
          <div class="gallery-zoom">
            <i class="fas fa-search-plus"></i>
          </div>
        ` : ''}
      </div>
    `;
  }

  createLightbox() {
    const existing = document.getElementById('gallery-lightbox');
    if (existing) existing.remove();

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.id = "gallery-lightbox";
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="lightbox-nav lightbox-next" aria-label="Next">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div class="lightbox-content">
        <img src="" alt="">
      </div>
      <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lightbox);
    this.lightbox = lightbox;
  }

  bindItemEvents() {
    this.container.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", () => {
        this.openLightbox(parseInt(item.dataset.index));
      });
    });
  }

  bindLightboxEvents() {
    if (!this.lightbox) return;

    this.lightbox.querySelector(".lightbox-close").addEventListener("click", () => this.closeLightbox());
    this.lightbox.querySelector(".lightbox-prev").addEventListener("click", () => this.navigate(-1));
    this.lightbox.querySelector(".lightbox-next").addEventListener("click", () => this.navigate(1));
    this.lightbox.addEventListener("click", (e) => {
      if (e.target === this.lightbox) this.closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!this.lightbox.classList.contains("active")) return;
      if (e.key === "Escape") this.closeLightbox();
      if (e.key === "ArrowLeft") this.navigate(-1);
      if (e.key === "ArrowRight") this.navigate(1);
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxContent();
    this.lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeLightbox() {
    this.lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  navigate(direction) {
    this.currentIndex += direction;
    const total = this.options.images.length;
    if (this.currentIndex < 0) this.currentIndex = total - 1;
    else if (this.currentIndex >= total) this.currentIndex = 0;
    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const image = this.options.images[this.currentIndex];
    const img = this.lightbox.querySelector(".lightbox-content img");
    const counter = this.lightbox.querySelector(".lightbox-counter");

    img.src = this.options.basePath + image.src;
    img.alt = image.alt;
    counter.textContent = `${this.currentIndex + 1} / ${this.options.images.length}`;
  }
}

// Auto-initialize
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll("[data-gallery]").forEach(el => {
    new NYIGallery(el.id, {
      layout: el.dataset.layout || "masonry"
    });
  });
});

window.NYIGallery = NYIGallery;