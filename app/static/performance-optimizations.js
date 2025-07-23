/**
 * Performance Optimizations for JavaScript
 * This file contains optimizations to improve JavaScript performance
 */

// Performance Optimization Manager
const PerformanceOptimizer = {
  // Initialize performance optimizations
  init() {
    // Apply all optimizations
    this.optimizeAnimations();
    this.optimizeEventListeners();
    this.optimizeScrolling();
    this.optimizeMediaLoading();
    this.detectReducedMotion();
    this.optimizeRendering();
  },
  
  // Optimize animations for performance
  optimizeAnimations() {
    // Check if device is low-end
    const isLowEndDevice = this.isLowEndDevice();
    
    if (isLowEndDevice) {
      // Apply simplified animations for low-end devices
      document.documentElement.classList.add('simplified-animations');
    }
    
    // Use requestAnimationFrame for animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length === 0) return;
    
    // Throttled scroll handler using requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScrollAnimations(animateElements);
          ticking = false;
        });
        ticking = true;
      }
    });
  },
  
  // Handle scroll animations efficiently
  handleScrollAnimations(elements) {
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  },
  
  // Optimize event listeners
  optimizeEventListeners() {
    // Use passive event listeners for touch and scroll events
    const passiveSupported = this.isPassiveSupported();
    const passiveOption = passiveSupported ? { passive: true } : false;
    
    // Apply passive listeners to common events
    window.addEventListener('scroll', () => {}, passiveOption);
    window.addEventListener('touchstart', () => {}, passiveOption);
    window.addEventListener('touchmove', () => {}, passiveOption);
    
    // Debounce resize event
    let resizeTimer;
    window.addEventListener('resize', () => {
      // Add transition prevention during rapid resizing
      document.documentElement.classList.add('layout-transitioning');
      
      // Clear previous timeout
      clearTimeout(resizeTimer);
      
      // Set new timeout to remove transition prevention
      resizeTimer = setTimeout(() => {
        document.documentElement.classList.remove('layout-transitioning');
      }, 250);
    });
  },
  
  // Check if passive event listeners are supported
  isPassiveSupported() {
    let passiveSupported = false;
    
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      
      window.addEventListener("test", null, options);
      window.removeEventListener("test", null, options);
    } catch (err) {
      passiveSupported = false;
    }
    
    return passiveSupported;
  },
  
  // Optimize scrolling performance
  optimizeScrolling() {
    // Find elements that might cause scroll jank
    const heavyElements = document.querySelectorAll('.card, .results-container');
    
    // Apply will-change only when needed
    heavyElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.willChange = 'transform';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.willChange = 'auto';
      });
    });
  },
  
  // Optimize media loading
  optimizeMediaLoading() {
    // Use Intersection Observer to lazy load images
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers that don't support Intersection Observer
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  },
  
  // Detect and handle reduced motion preference
  detectReducedMotion() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Apply reduced motion class to root element
      document.documentElement.classList.add('reduced-motion');
      
      // Disable animations
      this.disableAnimations();
    }
    
    // Listen for changes in motion preference
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
      if (e.matches) {
        document.documentElement.classList.add('reduced-motion');
        this.disableAnimations();
      } else {
        document.documentElement.classList.remove('reduced-motion');
        this.enableAnimations();
      }
    });
  },
  
  // Disable animations for reduced motion
  disableAnimations() {
    // Replace animations with immediate state changes
    const animatedElements = document.querySelectorAll('.skeleton-loader, .progress-bar, .circular-progress');
    animatedElements.forEach(element => {
      element.style.animation = 'none';
    });
    
    // Disable transitions
    document.documentElement.style.setProperty('--transition-normal', '0.01ms');
    document.documentElement.style.setProperty('--transition-fast', '0.01ms');
    document.documentElement.style.setProperty('--transition-slow', '0.01ms');
  },
  
  // Enable animations
  enableAnimations() {
    // Restore animation properties
    const animatedElements = document.querySelectorAll('.skeleton-loader, .progress-bar, .circular-progress');
    animatedElements.forEach(element => {
      element.style.animation = '';
    });
    
    // Restore transition durations
    document.documentElement.style.setProperty('--transition-normal', '300ms');
    document.documentElement.style.setProperty('--transition-fast', '150ms');
    document.documentElement.style.setProperty('--transition-slow', '500ms');
  },
  
  // Optimize rendering performance
  optimizeRendering() {
    // Use requestIdleCallback for non-critical operations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Perform non-critical operations during idle time
        this.preconnectToAPIs();
        this.prefetchResources();
      });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => {
        this.preconnectToAPIs();
        this.prefetchResources();
      }, 1000);
    }
  },
  
  // Preconnect to APIs for faster subsequent requests
  preconnectToAPIs() {
    // Create preconnect link for API domain
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://api.shodan.io';
    document.head.appendChild(preconnect);
  },
  
  // Prefetch resources that might be needed later
  prefetchResources() {
    // Only prefetch if not on a metered connection
    if ('connection' in navigator && navigator.connection.saveData) {
      return; // Respect data saver mode
    }
    
    // Prefetch critical resources
    const resources = [
      '/static/icons.svg'
    ];
    
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  },
  
  // Check if device is low-end
  isLowEndDevice() {
    // Check for hardware concurrency
    if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) {
      return true;
    }
    
    // Check for device memory
    if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
      return true;
    }
    
    return false;
  }
};

// Initialize performance optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  PerformanceOptimizer.init();
});

// Optimize initial page load
(function() {
  // Add class to prevent animations during page load
  document.documentElement.classList.add('page-loading');
  
  // Remove class after page has loaded
  window.addEventListener('load', () => {
    // Use setTimeout to ensure smooth transition
    setTimeout(() => {
      document.documentElement.classList.remove('page-loading');
    }, 100);
  });
})();