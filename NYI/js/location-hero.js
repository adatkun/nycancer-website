// ================================================
// NEW YORK IMAGING SPECIALISTS
// Location Hero Gallery
// js/location-hero.js
// ================================================

document.addEventListener('DOMContentLoaded', function() {
  const hero = document.querySelector('.location-hero');
  
  // Only run if hero exists on page
  if (!hero) return;
  
  const backgrounds = hero.querySelectorAll('.hero-bg');
  const dots = hero.querySelectorAll('.hero-dot');
  const prevBtn = hero.querySelector('.hero-arrow.prev');
  const nextBtn = hero.querySelector('.hero-arrow.next');
  
  let currentIndex = 0;
  let autoPlayInterval = null;
  let isPaused = false;
  
  function showSlide(index) {
    // Ensure index is within bounds
    if (index < 0) index = backgrounds.length - 1;
    if (index >= backgrounds.length) index = 0;
    
    backgrounds.forEach((bg, i) => {
      bg.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }
  
  function nextSlide() {
    showSlide(currentIndex + 1);
  }
  
  function prevSlide() {
    showSlide(currentIndex - 1);
  }
  
  // Clear any existing interval before starting new one
  function startAutoPlay() {
    stopAutoPlay();
    if (!isPaused) {
      autoPlayInterval = setInterval(nextSlide, 5000);
    }
  }
  
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }
  
  function resetAutoPlay() {
    stopAutoPlay();
    if (!isPaused) {
      autoPlayInterval = setInterval(nextSlide, 5000);
    }
  }
  
  // Arrow click handlers
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      nextSlide();
      resetAutoPlay();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      prevSlide();
      resetAutoPlay();
    });
  }
  
  // Dot click handlers
  dots.forEach(dot => {
    dot.addEventListener('click', function(e) {
      e.preventDefault();
      const index = parseInt(this.dataset.index);
      if (!isNaN(index)) {
        showSlide(index);
        resetAutoPlay();
      }
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoPlay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoPlay();
    }
  });
  
  // Touch/Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  hero.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  hero.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoPlay();
    }
  }
  
  // Start autoplay on load
  startAutoPlay();
});