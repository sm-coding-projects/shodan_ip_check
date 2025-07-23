(() => {
  // Mobile Navigation System
  const MobileNavManager = {
    // DOM Elements
    elements: {
      mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
      mobileNav: document.querySelector('.mobile-nav')
    },
    
    // Initialize mobile navigation
    init() {
      if (!this.elements.mobileMenuToggle) return;
      
      // Set up event listeners
      this.setupEventListeners();
    },
    
    // Set up event listeners
    setupEventListeners() {
      // Mobile menu toggle click
      this.elements.mobileMenuToggle.addEventListener('click', () => {
        this.toggleMobileNav();
      });
      
      // Close mobile nav when clicking outside
      document.addEventListener('click', (e) => {
        if (
          this.elements.mobileNav.classList.contains('active') && 
          !e.target.closest('.mobile-nav') && 
          !e.target.closest('.mobile-menu-toggle')
        ) {
          this.closeMobileNav();
        }
      });
      
      // Close mobile nav on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.elements.mobileNav.classList.contains('active')) {
          this.closeMobileNav();
        }
      });
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && this.elements.mobileNav.classList.contains('active')) {
          this.closeMobileNav();
        }
      });
    },
    
    // Toggle mobile navigation
    toggleMobileNav() {
      this.elements.mobileNav.classList.toggle('active');
      
      if (this.elements.mobileNav.classList.contains('active')) {
        this.elements.mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
        document.body.style.overflow = 'hidden';
      } else {
        this.elements.mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
      }
    },
    
    // Close mobile navigation
    closeMobileNav() {
      this.elements.mobileNav.classList.remove('active');
      this.elements.mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      document.body.style.overflow = '';
    }
  };

  // Theme System
  const ThemeManager = {
    // DOM Elements
    elements: {
      html: document.documentElement,
      toggleBtn: document.getElementById('theme-toggle'),
      toggleIcon: document.getElementById('theme-toggle')?.querySelector('i') || document.getElementById('theme-toggle')?.querySelector('svg')
    },
    
    // Theme options
    themes: {
      light: {
        name: 'light',
        icon: 'fas fa-moon',
        label: 'Switch to dark theme'
      },
      dark: {
        name: 'dark',
        icon: 'fas fa-sun',
        label: 'Switch to light theme'
      }
    },
    
    // Initialize theme system
    init() {
      // Create theme indicator element
      this.createThemeIndicator();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Initialize theme based on preference
      this.initializeTheme();
    },
    
    // Create theme indicator element
    createThemeIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'theme-indicator';
      document.body.appendChild(indicator);
    },
    
    // Set up event listeners
    setupEventListeners() {
      // Theme toggle button click
      this.elements.toggleBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
      
      // System preference change
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
      
      // Handle keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Alt+T to toggle theme
        if (e.altKey && e.key === 't') {
          this.toggleTheme();
        }
      });
    },
    
    // Initialize theme based on preference
    initializeTheme() {
      // Prevent transitions on initial load
      this.elements.html.classList.add('theme-transitioning');
      
      // Get theme from storage or system preference
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      
      // Set initial theme without animation
      this.setTheme(initialTheme, false);
      
      // Remove transition prevention after a short delay
      setTimeout(() => {
        this.elements.html.classList.remove('theme-transitioning');
      }, 100);
    },
    
    // Toggle between light and dark themes
    toggleTheme() {
      const currentTheme = this.elements.html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme, true);
    },
    
    // Set theme with optional animation
    setTheme(theme, animate = true) {
      const currentTheme = this.elements.html.getAttribute('data-theme');
      const themeData = this.themes[theme];
      
      // Skip if theme is already set
      if (theme === currentTheme && !animate) return;
      
      // Temporarily disable transitions if not animating
      if (!animate) {
        this.elements.html.classList.add('theme-transitioning');
      }
      
      // Apply theme
      this.elements.html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      // Update icon with animation
      if (animate) {
        this.animateThemeChange(theme);
      } else {
        this.elements.toggleIcon.className = themeData.icon;
      }
      
      // Update accessibility attributes
      this.elements.toggleBtn.setAttribute('aria-label', themeData.label);
      
      // Re-enable transitions if they were disabled
      if (!animate) {
        setTimeout(() => {
          this.elements.html.classList.remove('theme-transitioning');
        }, 100);
      }
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('themechange', { 
        detail: { theme, previousTheme: currentTheme } 
      }));
    },
    
    // Animate theme change
    animateThemeChange(theme) {
      const themeData = this.themes[theme];
      
      // Add animation class to button
      this.elements.toggleBtn.classList.add('theme-toggle-animation');
      
      // Update icon halfway through animation
      setTimeout(() => {
        this.elements.toggleIcon.className = themeData.icon;
      }, 250);
      
      // Remove animation class after animation completes
      setTimeout(() => {
        this.elements.toggleBtn.classList.remove('theme-toggle-animation');
      }, 500);
      
      // Animate theme indicator
      const indicator = document.querySelector('.theme-indicator');
      if (indicator) {
        indicator.style.transform = 'scale(15)';
        indicator.style.opacity = '0';
        
        setTimeout(() => {
          indicator.style.transform = 'scale(1)';
          indicator.style.opacity = '0.7';
        }, 500);
      }
      
      // Announce theme change for screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('class', 'sr-only');
      announcement.textContent = `Theme changed to ${theme} mode`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 3000);
    }
  };
  
  // Theme preference management
  const ThemePreferenceManager = {
    // DOM Elements
    elements: {
      prefButtons: document.querySelectorAll('.theme-pref-btn')
    },
    
    // Initialize theme preference system
    init() {
      this.setupEventListeners();
      this.updateActiveButton();
    },
    
    // Set up event listeners
    setupEventListeners() {
      this.elements.prefButtons.forEach(button => {
        button.addEventListener('click', () => {
          const preference = button.getAttribute('data-theme-pref');
          this.setThemePreference(preference);
        });
      });
    },
    
    // Set theme preference
    setThemePreference(preference) {
      if (preference === 'system') {
        // Remove stored theme to use system preference
        localStorage.removeItem('theme');
        
        // Apply system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        ThemeManager.setTheme(systemPrefersDark ? 'dark' : 'light', true);
      } else {
        // Store and apply explicit preference
        localStorage.setItem('theme', preference);
        ThemeManager.setTheme(preference, true);
      }
      
      // Update active button
      this.updateActiveButton();
    },
    
    // Update active button based on current preference
    updateActiveButton() {
      const storedTheme = localStorage.getItem('theme');
      const currentPreference = storedTheme ? storedTheme : 'system';
      
      this.elements.prefButtons.forEach(button => {
        const buttonPref = button.getAttribute('data-theme-pref');
        if (buttonPref === currentPreference) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    }
  };
  
  // Responsive Layout Manager
  const ResponsiveLayoutManager = {
    // Initialize responsive layout system
    init() {
      // Add layout transition class to prevent transitions on initial load
      document.documentElement.classList.add('layout-transitioning');
      
      // Remove transition prevention after a short delay
      setTimeout(() => {
        document.documentElement.classList.remove('layout-transitioning');
      }, 100);
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Set viewport height variable for mobile browsers
      this.setViewportHeight();
    },
    
    // Set up event listeners
    setupEventListeners() {
      // Handle window resize
      let resizeTimer;
      window.addEventListener('resize', () => {
        // Add transition prevention during rapid resizing
        document.documentElement.classList.add('layout-transitioning');
        
        // Clear previous timeout
        clearTimeout(resizeTimer);
        
        // Set new timeout to remove transition prevention
        resizeTimer = setTimeout(() => {
          document.documentElement.classList.remove('layout-transitioning');
          
          // Update viewport height variable
          this.setViewportHeight();
        }, 250);
      });
      
      // Handle orientation change
      window.addEventListener('orientationchange', () => {
        // Add transition prevention during orientation change
        document.documentElement.classList.add('layout-transitioning');
        
        // Remove transition prevention after orientation change completes
        setTimeout(() => {
          document.documentElement.classList.remove('layout-transitioning');
          
          // Update viewport height variable
          this.setViewportHeight();
        }, 250);
      });
    },
    
    // Set viewport height CSS variable for mobile browsers
    setViewportHeight() {
      // Set CSS variable to viewport height
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
  };

  // Initialize systems
  ThemeManager.init();
  ThemePreferenceManager.init();
  MobileNavManager.init();
  ResponsiveLayoutManager.init();

  // Form Validation System
  const FormValidator = {
    // DOM Elements
    elements: {
      form: document.getElementById('lookup-form'),
      apiKeyInput: document.getElementById('apiKey'),
      ipInput: document.getElementById('ipAddr'),
      submitButton: document.getElementById('lookup-btn')
    },
    
    // Initialize form validation
    init() {
      if (!this.elements.form) return;
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Initialize input states
      this.initializeInputStates();
    },
    
    // Set up event listeners
    setupEventListeners() {
      // Real-time validation for API key
      this.elements.apiKeyInput.addEventListener('input', () => {
        this.validateApiKey();
      });
      
      // Real-time validation for IP address
      this.elements.ipInput.addEventListener('input', () => {
        this.validateIpAddress();
      });
      
      // Blur events for validation
      this.elements.apiKeyInput.addEventListener('blur', () => {
        this.validateApiKey(true);
      });
      
      this.elements.ipInput.addEventListener('blur', () => {
        this.validateIpAddress(true);
      });
      
      // Form submission validation
      this.elements.form.addEventListener('submit', (e) => {
        if (!this.validateForm()) {
          e.preventDefault();
        }
      });
    },
    
    // Initialize input states
    initializeInputStates() {
      // Check if inputs have values (e.g., from browser autofill)
      if (this.elements.apiKeyInput.value.trim()) {
        this.validateApiKey();
      }
      
      if (this.elements.ipInput.value.trim()) {
        this.validateIpAddress();
      }
    },
    
    // Validate API key
    validateApiKey(showError = false) {
      const input = this.elements.apiKeyInput;
      const value = input.value.trim();
      
      // Simple validation - API key should be at least 32 characters
      const isValid = value.length >= 32;
      
      // Update input state
      this.updateInputState(input, isValid, showError);
      
      return isValid;
    },
    
    // Validate IP address
    validateIpAddress(showError = false) {
      const input = this.elements.ipInput;
      const value = input.value.trim();
      
      // IP address pattern validation
      const ipPattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
      const isValid = ipPattern.test(value);
      
      // Additional validation for valid IP ranges
      if (isValid) {
        const octets = value.split('.');
        for (const octet of octets) {
          const num = parseInt(octet, 10);
          if (num < 0 || num > 255) {
            this.updateInputState(input, false, showError);
            return false;
          }
        }
      }
      
      // Update input state
      this.updateInputState(input, isValid, showError);
      
      return isValid;
    },
    
    // Update input state based on validation
    updateInputState(input, isValid, showError) {
      // Remove existing state classes
      input.classList.remove('is-valid', 'is-invalid');
      
      // Add appropriate state class
      if (input.value.trim()) {
        if (isValid) {
          input.classList.add('is-valid');
        } else if (showError) {
          input.classList.add('is-invalid');
        }
      }
    },
    
    // Validate entire form
    validateForm() {
      const isApiKeyValid = this.validateApiKey(true);
      const isIpValid = this.validateIpAddress(true);
      
      return isApiKeyValid && isIpValid;
    },
    
    // Create ripple effect on button
    createRipple(event) {
      const button = event.currentTarget;
      
      // Remove existing ripples
      const ripples = button.getElementsByClassName('ripple');
      for (const ripple of ripples) {
        ripple.remove();
      }
      
      // Create new ripple
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
      circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
      circle.classList.add('ripple');
      
      button.appendChild(circle);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        circle.remove();
      }, 600);
    }
  };
  
  // Initialize form validation
  FormValidator.init();

  // Button ripple effect
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', FormValidator.createRipple);
  });

  // Loading State Manager
  const LoadingStateManager = {
    // Loading state types
    types: {
      FORM: 'form',
      RESULTS: 'results',
      OVERLAY: 'overlay'
    },
    
    // Show loading state
    show(type, options = {}) {
      switch(type) {
        case this.types.FORM:
          return this.showFormLoading(options);
        case this.types.RESULTS:
          return this.showResultsLoading(options);
        case this.types.OVERLAY:
          return this.showOverlayLoading(options);
        default:
          console.error('Unknown loading state type:', type);
      }
    },
    
    // Hide loading state
    hide(type, element) {
      switch(type) {
        case this.types.FORM:
          return this.hideFormLoading(element);
        case this.types.RESULTS:
          return this.hideResultsLoading(element);
        case this.types.OVERLAY:
          return this.hideOverlayLoading();
        default:
          console.error('Unknown loading state type:', type);
      }
    },
    
    // Show form loading state
    showFormLoading(options = {}) {
      const { element, button } = options;
      
      if (element) {
        element.classList.add('form-loading');
      }
      
      if (button) {
        button.classList.add('btn-loading');
        button.disabled = true;
      }
    },
    
    // Hide form loading state
    hideFormLoading(options = {}) {
      const { element, button } = options;
      
      if (element) {
        element.classList.remove('form-loading');
      }
      
      if (button) {
        button.classList.remove('btn-loading');
        button.disabled = false;
      }
    },
    
    // Show results loading state with skeleton screens
    showResultsLoading(options = {}) {
      const { element, type = 'default' } = options;
      
      if (!element) return;
      
      // Different skeleton templates based on context
      const templates = {
        default: this.getDefaultSkeletonTemplate(),
        summary: this.getSummarySkeletonTemplate(),
        vulnerability: this.getVulnerabilitySkeletonTemplate(),
        service: this.getServiceSkeletonTemplate(),
        error: this.getErrorSkeletonTemplate()
      };
      
      element.innerHTML = templates[type] || templates.default;
      
      // Add staggered animation to skeleton elements
      const skeletons = element.querySelectorAll('.skeleton-card');
      skeletons.forEach((skeleton, index) => {
        skeleton.style.animationDelay = `${index * 0.1}s`;
      });
      
      return element;
    },
    
    // Hide results loading state
    hideResultsLoading(element) {
      if (!element) return;
      element.innerHTML = '';
      return element;
    },
    
    // Show overlay loading state
    showOverlayLoading(options = {}) {
      const { message = 'Loading...', submessage = 'Please wait' } = options;
      
      // Create overlay if it doesn't exist
      let overlay = document.querySelector('.loading-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        
        overlay.innerHTML = `
          <div class="loading-overlay-content">
            <div class="loading-overlay-spinner">
              <div class="circular-progress"></div>
            </div>
            <div class="loading-overlay-message">${message}</div>
            <div class="loading-overlay-submessage">${submessage}</div>
          </div>
        `;
        
        document.body.appendChild(overlay);
      } else {
        // Update existing overlay
        overlay.querySelector('.loading-overlay-message').textContent = message;
        overlay.querySelector('.loading-overlay-submessage').textContent = submessage;
      }
      
      // Show overlay with animation
      setTimeout(() => {
        overlay.classList.add('active');
      }, 10);
      
      return overlay;
    },
    
    // Hide overlay loading state
    hideOverlayLoading() {
      const overlay = document.querySelector('.loading-overlay');
      if (!overlay) return;
      
      overlay.classList.remove('active');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    },
    
    // Empty state templates
    getEmptyStateTemplate(options = {}) {
      const { 
        type = 'default',
        icon = 'fas fa-search',
        title = 'No Results Found',
        message = 'We couldn\'t find any information for your query.',
        actionButton = ''
      } = options;
      
      return `
        <div class="empty-state empty-${type}">
          <div class="empty-state-icon">
            <i class="${icon}"></i>
          </div>
          <h3 class="empty-state-title">${title}</h3>
          <p class="empty-state-message">${message}</p>
          ${actionButton ? `<div class="empty-state-action">${actionButton}</div>` : ''}
        </div>
      `;
    },
    
    // Skeleton templates
    getDefaultSkeletonTemplate() {
      return `
        <div class="skeleton-card">
          <div class="skeleton-card-header">
            <div class="skeleton-loader skeleton-text skeleton-title"></div>
          </div>
          <div class="skeleton-card-body">
            <div class="skeleton-loader skeleton-text"></div>
            <div class="skeleton-loader skeleton-text"></div>
            <div class="skeleton-loader skeleton-text"></div>
          </div>
        </div>
      `;
    },
    
    getSummarySkeletonTemplate() {
      return `
        <div class="skeleton-card skeleton-summary-card">
          <div class="skeleton-card-header">
            <div class="skeleton-loader skeleton-text skeleton-title"></div>
          </div>
          <div class="skeleton-card-body">
            <div class="skeleton-grid">
              <div class="skeleton-grid-item">
                <div class="skeleton-loader skeleton-text skeleton-label"></div>
                <div class="skeleton-loader skeleton-text"></div>
              </div>
              <div class="skeleton-grid-item">
                <div class="skeleton-loader skeleton-text skeleton-label"></div>
                <div class="skeleton-loader skeleton-text"></div>
              </div>
              <div class="skeleton-grid-item">
                <div class="skeleton-loader skeleton-text skeleton-label"></div>
                <div class="skeleton-loader skeleton-text"></div>
              </div>
              <div class="skeleton-grid-item">
                <div class="skeleton-loader skeleton-text skeleton-label"></div>
                <div class="skeleton-loader skeleton-text"></div>
              </div>
            </div>
            
            <div>
              <div class="skeleton-loader skeleton-text skeleton-label"></div>
              <div class="skeleton-loader skeleton-badge" style="display: inline-block; margin-right: 8px;"></div>
              <div class="skeleton-loader skeleton-badge" style="display: inline-block; margin-right: 8px;"></div>
              <div class="skeleton-loader skeleton-badge" style="display: inline-block;"></div>
            </div>
          </div>
          <div class="skeleton-card-footer">
            <div class="skeleton-loader skeleton-text" style="width: 40%;"></div>
          </div>
        </div>
      `;
    },
    
    getVulnerabilitySkeletonTemplate() {
      return `
        <div class="skeleton-card skeleton-vulnerability-card">
          <div class="skeleton-card-header">
            <div class="skeleton-loader skeleton-text skeleton-title"></div>
          </div>
          <div class="skeleton-card-body">
            <div>
              <div class="skeleton-loader skeleton-text skeleton-label"></div>
              <div class="skeleton-loader skeleton-badge" style="display: inline-block; margin-right: 8px;"></div>
              <div class="skeleton-loader skeleton-badge" style="display: inline-block; margin-right: 8px;"></div>
              <div class="skeleton-loader skeleton-badge" style="display: inline-block;"></div>
            </div>
            
            <div style="margin-top: 16px;">
              <div class="skeleton-loader skeleton-text skeleton-label"></div>
              <div class="skeleton-loader skeleton-vulnerability-item"></div>
              <div class="skeleton-loader skeleton-vulnerability-item"></div>
              <div class="skeleton-loader skeleton-vulnerability-item"></div>
            </div>
          </div>
        </div>
      `;
    },
    
    getServiceSkeletonTemplate() {
      return `
        <div class="skeleton-card">
          <div class="skeleton-card-header">
            <div class="skeleton-loader skeleton-text skeleton-title"></div>
          </div>
          <div class="skeleton-card-body">
            <div class="skeleton-loader skeleton-text" style="width: 30%; margin-bottom: 12px;"></div>
            
            <div class="skeleton-service-item">
              <div class="skeleton-loader skeleton-port"></div>
              <div class="skeleton-service-details">
                <div class="skeleton-loader skeleton-text"></div>
                <div class="skeleton-loader skeleton-text" style="width: 60%;"></div>
              </div>
            </div>
            
            <div class="skeleton-service-item">
              <div class="skeleton-loader skeleton-port"></div>
              <div class="skeleton-service-details">
                <div class="skeleton-loader skeleton-text"></div>
                <div class="skeleton-loader skeleton-text" style="width: 40%;"></div>
              </div>
            </div>
            
            <div class="skeleton-loader skeleton-text" style="width: 30%; margin: 16px 0 12px 0;"></div>
            
            <div class="skeleton-service-item">
              <div class="skeleton-loader skeleton-port"></div>
              <div class="skeleton-service-details">
                <div class="skeleton-loader skeleton-text"></div>
              </div>
            </div>
          </div>
          <div class="skeleton-card-footer">
            <div class="skeleton-loader skeleton-text" style="width: 30%;"></div>
          </div>
        </div>
      `;
    },
    
    getErrorSkeletonTemplate() {
      return `
        <div class="skeleton-card">
          <div class="skeleton-card-header">
            <div class="skeleton-loader skeleton-text skeleton-title"></div>
          </div>
          <div class="skeleton-card-body">
            <div class="skeleton-loader skeleton-text"></div>
            <div class="skeleton-loader skeleton-text" style="width: 80%; margin-top: 16px;"></div>
          </div>
        </div>
      `;
    }
  };

  // Lookup handler
  document.getElementById('lookup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const key = document.getElementById('apiKey').value.trim();
    const ip = document.getElementById('ipAddr').value.trim();
    const results = document.getElementById('results');
    const form = document.getElementById('lookup-form');
    const submitButton = document.getElementById('lookup-btn');
    
    // Show loading states
    LoadingStateManager.show(LoadingStateManager.types.FORM, {
      button: submitButton
    });
    
    // Show contextual skeleton loading screens
    results.innerHTML = '';
    
    // Create progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container progress-indeterminate';
    progressContainer.innerHTML = '<div class="progress-bar"></div>';
    results.appendChild(progressContainer);
    
    // Add skeleton screens with staggered delay for better UX
    setTimeout(() => {
      // Remove progress indicator
      results.removeChild(progressContainer);
      
      // Add summary skeleton
      const summaryContainer = document.createElement('div');
      results.appendChild(summaryContainer);
      LoadingStateManager.show(LoadingStateManager.types.RESULTS, {
        element: summaryContainer,
        type: 'summary'
      });
      
      // Add vulnerability skeleton with delay
      setTimeout(() => {
        const vulnContainer = document.createElement('div');
        results.appendChild(vulnContainer);
        LoadingStateManager.show(LoadingStateManager.types.RESULTS, {
          element: vulnContainer,
          type: 'vulnerability'
        });
      }, 200);
      
      // Add service skeleton with delay
      setTimeout(() => {
        const serviceContainer = document.createElement('div');
        results.appendChild(serviceContainer);
        LoadingStateManager.show(LoadingStateManager.types.RESULTS, {
          element: serviceContainer,
          type: 'service'
        });
      }, 400);
    }, 500);

    try {
      // Show overlay loading for API request
      LoadingStateManager.show(LoadingStateManager.types.OVERLAY, {
        message: 'Fetching IP data...',
        submessage: 'Connecting to Shodan API'
      });
      
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, ip })
      });
      
      // Update overlay message
      const overlay = document.querySelector('.loading-overlay');
      if (overlay) {
        overlay.querySelector('.loading-overlay-message').textContent = 'Processing data...';
        overlay.querySelector('.loading-overlay-submessage').textContent = 'Analyzing results';
      }
      
      const data = await res.json();
      
      // Hide loading states
      LoadingStateManager.hide(LoadingStateManager.types.FORM, {
        button: submitButton
      });
      LoadingStateManager.hide(LoadingStateManager.types.OVERLAY);
      
      // Handle API errors
      if (!res.ok) {
        // Clear results
        results.innerHTML = '';
        
        // Show error alert in results container
        AlertStateManager.show({
          type: AlertStateManager.types.ERROR,
          title: 'Error Fetching Data',
          message: data.detail || 'An unknown error occurred while fetching data from Shodan API.',
          container: results,
          dismissible: true,
          animation: true
        });
        
        // Show toast notification
        AlertStateManager.toast({
          type: AlertStateManager.types.ERROR,
          title: 'API Error',
          message: data.detail || 'Failed to fetch data from Shodan API.',
          position: AlertStateManager.positions.TOP_RIGHT,
          autoClose: true,
          autoCloseDelay: 8000
        });
        
        return;
      }

      // Clear all loading states
      results.innerHTML = '';
      
      // Show success toast
      AlertStateManager.toast({
        type: AlertStateManager.types.SUCCESS,
        title: 'Data Retrieved Successfully',
        message: `Found information for IP: ${data.ip_str || ip}`,
        position: AlertStateManager.positions.TOP_RIGHT,
        autoClose: true
      });
      
      const cards = [];

      // Summary card
      const summary = document.createElement('div');
      summary.className = 'card card-summary';
      
      // Create summary card content with modern structure
      let summaryContent = `
        <div class="card-header">
          <h2 class="card-title"><i class="fas fa-info-circle"></i> Summary</h2>
        </div>
        <div class="card-body">
          <div class="data-grid">
            <div class="data-group">
              <span class="data-label">IP Address</span>
              <div class="data-value">${data.ip_str || ip}</div>
            </div>
            
            <div class="data-group">
              <span class="data-label">Organization</span>
              <div class="data-value">${data.org || '<span class="empty">Not Available</span>'}</div>
            </div>
            
            <div class="data-group">
              <span class="data-label">Operating System</span>
              <div class="data-value">${data.os || '<span class="empty">Not Available</span>'}</div>
            </div>
            
            <div class="data-group">
              <span class="data-label">Location</span>
              <div class="data-value">${data.city ? `${data.city}, ` : ''}${data.country_name || '<span class="empty">Not Available</span>'}</div>
            </div>
          </div>
          
          <div class="data-group">
            <span class="data-label">Open Ports</span>
            <div class="data-value">
              ${(data.ports && data.ports.length) ? 
                data.ports.map(port => `<span class="code-text">${port}</span>`).join(' ') : 
                '<span class="empty">No open ports detected</span>'}
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <span class="text-muted">Last updated: ${new Date().toLocaleString()}</span>
        </div>
      `;
      
      summary.innerHTML = summaryContent;
      cards.push(summary);
      
      // Vulnerabilities card (if available)
      if (data.vulns && data.vulns.length) {
        const vulnCard = document.createElement('div');
        vulnCard.className = 'card card-vulnerabilities';
        
        // Sort vulnerabilities by severity
        const sortedVulns = [...data.vulns].sort((a, b) => {
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, none: 0 };
          const severityA = a.severity ? severityOrder[a.severity.toLowerCase()] || 0 : 0;
          const severityB = b.severity ? severityOrder[b.severity.toLowerCase()] || 0 : 0;
          return severityB - severityA;
        });
        
        // Create vulnerabilities card content
        let vulnContent = `
          <div class="card-header">
            <h2 class="card-title"><i class="fas fa-exclamation-triangle"></i> Vulnerabilities</h2>
          </div>
          <div class="card-body">
            <div class="vuln-summary">
              <span class="vuln-count">${sortedVulns.length} vulnerabilities detected</span>
              <div class="vuln-badges">
        `;
        
        // Count vulnerabilities by severity
        const severityCounts = sortedVulns.reduce((counts, vuln) => {
          const severity = (vuln.severity || 'unknown').toLowerCase();
          counts[severity] = (counts[severity] || 0) + 1;
          return counts;
        }, {});
        
        // Add severity badges
        if (severityCounts.critical) {
          vulnContent += `<span class="vuln-badge vuln-critical">Critical: ${severityCounts.critical}</span>`;
        }
        if (severityCounts.high) {
          vulnContent += `<span class="vuln-badge vuln-high">High: ${severityCounts.high}</span>`;
        }
        if (severityCounts.medium) {
          vulnContent += `<span class="vuln-badge vuln-medium">Medium: ${severityCounts.medium}</span>`;
        }
        if (severityCounts.low) {
          vulnContent += `<span class="vuln-badge vuln-low">Low: ${severityCounts.low}</span>`;
        }
        
        vulnContent += `
              </div>
            </div>
            
            <div class="vuln-list">
        `;
        
        // Add vulnerability items
        sortedVulns.forEach(vuln => {
          const severity = (vuln.severity || 'unknown').toLowerCase();
          vulnContent += `
            <div class="vuln-item vuln-${severity}">
              <div class="vuln-header">
                <span class="vuln-id">${vuln.id || 'Unknown'}</span>
                <span class="vuln-severity vuln-severity-${severity}">${vuln.severity || 'Unknown'}</span>
              </div>
              <div class="vuln-details">
                <div class="vuln-description">${vuln.description || 'No description available'}</div>
                ${vuln.references ? `
                  <div class="vuln-references">
                    <a href="${vuln.references}" target="_blank" rel="noopener noreferrer">
                      <i class="fas fa-external-link-alt"></i> More Information
                    </a>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        });
        
        vulnContent += `
            </div>
          </div>
        `;
        
        vulnCard.innerHTML = vulnContent;
        cards.push(vulnCard);
      }
      
      // Services card
      if (data.data && data.data.length) {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'card card-services';
        
        // Create services card content
        let serviceContent = `
          <div class="card-header">
            <h2 class="card-title"><i class="fas fa-server"></i> Services</h2>
          </div>
          <div class="card-body">
        `;
        
        // Group services by category
        const serviceCategories = data.data.reduce((categories, service) => {
          const category = service.product ? 'Identified Services' : 'Other Ports';
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(service);
          return categories;
        }, {});
        
        // Add services by category
        Object.entries(serviceCategories).forEach(([category, services]) => {
          serviceContent += `
            <div class="service-category">
              <h3 class="service-category-title">${category}</h3>
              <div class="service-list">
          `;
          
          services.forEach(service => {
            serviceContent += `
              <div class="service-item">
                <div class="service-port">${service.port}</div>
                <div class="service-details">
                  <div class="service-name">
                    ${service.product ? `${service.product} ${service.version || ''}` : `${service.transport || 'tcp'}/${service.port}`}
                  </div>
                  ${service.banner ? `
                    <div class="service-banner">
                      <pre>${service.banner.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                    </div>
                  ` : ''}
                </div>
              </div>
            `;
          });
          
          serviceContent += `
              </div>
            </div>
          `;
        });
        
        serviceContent += `
          </div>
          <div class="card-footer">
            <span class="text-muted">${data.data.length} services detected</span>
          </div>
        `;
        
        serviceCard.innerHTML = serviceContent;
        cards.push(serviceCard);
      }
      
      // Add cards to results container with staggered animation
      cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        results.appendChild(card);
      });
      
      // If no cards were added, show empty state
      if (cards.length === 0) {
        results.innerHTML = LoadingStateManager.getEmptyStateTemplate({
          icon: 'fas fa-search',
          title: 'No Information Found',
          message: 'We couldn\'t find any information for this IP address in the Shodan database.',
          actionButton: '<button class="btn btn-primary" onclick="window.location.reload()"><i class="fas fa-redo"></i> Try Again</button>'
        });
      }
      
    } catch (error) {
      console.error('Error:', error);
      
      // Hide loading states
      LoadingStateManager.hide(LoadingStateManager.types.FORM, {
        button: submitButton
      });
      LoadingStateManager.hide(LoadingStateManager.types.OVERLAY);
      
      // Clear results
      results.innerHTML = '';
      
      // Show error alert in results container
      AlertStateManager.show({
        type: AlertStateManager.types.ERROR,
        title: 'Error Processing Request',
        message: 'An unexpected error occurred while processing your request. Please try again later.',
        container: results,
        dismissible: true,
        animation: true
      });
      
      // Show error toast
      AlertStateManager.toast({
        type: AlertStateManager.types.ERROR,
        title: 'Request Failed',
        message: 'An unexpected error occurred. Please try again.',
        position: AlertStateManager.positions.TOP_RIGHT,
        autoClose: true
      });
    }
  });

  // Add demo alerts for testing
  window.showDemoAlerts = () => {
    // Success alert
    AlertStateManager.show({
      type: AlertStateManager.types.SUCCESS,
      title: 'Operation Successful',
      message: 'Your request has been processed successfully.',
      container: document.getElementById('results'),
      dismissible: true,
      animation: true
    });
    
    // Error alert
    setTimeout(() => {
      AlertStateManager.show({
        type: AlertStateManager.types.ERROR,
        title: 'Error Occurred',
        message: 'There was a problem processing your request. Please try again.',
        container: document.getElementById('results'),
        dismissible: true,
        animation: true
      });
    }, 500);
    
    // Warning alert
    setTimeout(() => {
      AlertStateManager.show({
        type: AlertStateManager.types.WARNING,
        title: 'Warning',
        message: 'This action may take a while to complete.',
        container: document.getElementById('results'),
        dismissible: true,
        animation: true
      });
    }, 1000);
    
    // Info alert
    setTimeout(() => {
      AlertStateManager.show({
        type: AlertStateManager.types.INFO,
        title: 'Information',
        message: 'Your session will expire in 10 minutes.',
        container: document.getElementById('results'),
        dismissible: true,
        animation: true
      });
    }, 1500);
    
    // Toast notifications
    setTimeout(() => {
      AlertStateManager.toast({
        type: AlertStateManager.types.SUCCESS,
        title: 'Success Toast',
        message: 'Operation completed successfully.',
        position: AlertStateManager.positions.TOP_RIGHT,
        autoClose: true
      });
    }, 2000);
    
    setTimeout(() => {
      AlertStateManager.toast({
        type: AlertStateManager.types.ERROR,
        title: 'Error Toast',
        message: 'Failed to complete operation.',
        position: AlertStateManager.positions.TOP_RIGHT,
        autoClose: true
      });
    }, 2500);
    
    // Modal alert
    setTimeout(() => {
      AlertStateManager.modal({
        type: AlertStateManager.types.INFO,
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed with this action?',
        confirmText: 'Yes, Proceed',
        cancelText: 'Cancel',
        onConfirm: () => {
          AlertStateManager.toast({
            type: AlertStateManager.types.SUCCESS,
            title: 'Action Confirmed',
            message: 'You confirmed the action.',
            position: AlertStateManager.positions.TOP_RIGHT,
            autoClose: true
          });
        },
        onCancel: () => {
          AlertStateManager.toast({
            type: AlertStateManager.types.INFO,
            title: 'Action Cancelled',
            message: 'You cancelled the action.',
            position: AlertStateManager.positions.TOP_RIGHT,
            autoClose: true
          });
        }
      });
    }, 3000);
  };
})();