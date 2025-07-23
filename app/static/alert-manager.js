// Alert State Manager
const AlertStateManager = {
  // Alert types
  types: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  },
  
  // Alert positions for toast notifications
  positions: {
    TOP_RIGHT: 'toast-top-right',
    TOP_LEFT: 'toast-top-left',
    BOTTOM_RIGHT: 'toast-bottom-right',
    BOTTOM_LEFT: 'toast-bottom-left',
    TOP_CENTER: 'toast-top-center',
    BOTTOM_CENTER: 'toast-bottom-center'
  },
  
  // Create and show an alert
  show(options = {}) {
    const {
      type = this.types.INFO,
      title = '',
      message = '',
      icon = this.getIconForType(type),
      container = null,
      dismissible = true,
      autoClose = false,
      autoCloseDelay = 5000,
      animation = true,
      onClose = null
    } = options;
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    if (!animation) alert.style.animation = 'none';
    
    // Check if we should use SVG icons
    const useSvgIcons = document.querySelector('svg symbol#icon-check-circle') !== null;
    
    // Create alert content
    if (useSvgIcons) {
      alert.innerHTML = `
        <div class="alert-icon">
          <svg class="svg-icon svg-icon-md" aria-hidden="true">
            <use href="#${icon}"></use>
          </svg>
        </div>
        <div class="alert-content">
          ${title ? `<div class="alert-title">${title}</div>` : ''}
          ${message ? `<div class="alert-message">${message}</div>` : ''}
        </div>
        ${dismissible ? `
          <button type="button" class="alert-close" aria-label="Close">
            <svg class="svg-icon svg-icon-sm" aria-hidden="true">
              <use href="#icon-close"></use>
            </svg>
          </button>
        ` : ''}
      `;
    } else {
      alert.innerHTML = `
        <div class="alert-icon">
          <i class="${icon}"></i>
        </div>
        <div class="alert-content">
          ${title ? `<div class="alert-title">${title}</div>` : ''}
          ${message ? `<div class="alert-message">${message}</div>` : ''}
        </div>
        ${dismissible ? `
          <button type="button" class="alert-close" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        ` : ''}
      `;
    }
    
    // Add event listener for close button
    if (dismissible) {
      const closeButton = alert.querySelector('.alert-close');
      closeButton.addEventListener('click', () => {
        this.close(alert, onClose);
      });
    }
    
    // Auto close if enabled
    if (autoClose) {
      setTimeout(() => {
        if (document.body.contains(alert)) {
          this.close(alert, onClose);
        }
      }, autoCloseDelay);
      
      // Add progress bar for auto-close
      const progressBar = document.createElement('div');
      progressBar.className = 'toast-progress';
      alert.appendChild(progressBar);
      
      // Animate progress bar
      setTimeout(() => {
        progressBar.style.transition = `transform ${autoCloseDelay}ms linear`;
        progressBar.style.transform = 'scaleX(0)';
      }, 10);
    }
    
    // Append alert to container or body
    if (container) {
      container.appendChild(alert);
    } else {
      document.body.appendChild(alert);
    }
    
    // Add accessibility attributes
    alert.setAttribute('role', 'alert');
    alert.setAttribute('aria-live', type === this.types.ERROR ? 'assertive' : 'polite');
    
    // Return the alert element
    return alert;
  },
  
  // Show a toast notification
  toast(options = {}) {
    const {
      position = this.positions.TOP_RIGHT,
      type = this.types.INFO,
      title = '',
      message = '',
      icon = this.getIconForType(type),
      dismissible = true,
      autoClose = true,
      autoCloseDelay = 5000,
      animation = true,
      onClose = null
    } = options;
    
    // Get or create toast container
    let container = document.querySelector(`.toast-container.${position}`);
    if (!container) {
      container = document.createElement('div');
      container.className = `toast-container ${position}`;
      document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast alert alert-${type}`;
    if (!animation) toast.style.animation = 'none';
    
    // Create toast content
    toast.innerHTML = `
      <div class="alert-icon">
        <i class="${icon}"></i>
      </div>
      <div class="alert-content">
        ${title ? `<div class="alert-title">${title}</div>` : ''}
        ${message ? `<div class="alert-message">${message}</div>` : ''}
      </div>
      ${dismissible ? `
        <button type="button" class="alert-close" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      ` : ''}
      ${autoClose ? `<div class="toast-progress"></div>` : ''}
    `;
    
    // Add event listener for close button
    if (dismissible) {
      const closeButton = toast.querySelector('.alert-close');
      closeButton.addEventListener('click', () => {
        this.closeToast(toast, container, onClose);
      });
    }
    
    // Auto close if enabled
    if (autoClose) {
      setTimeout(() => {
        if (document.body.contains(toast)) {
          this.closeToast(toast, container, onClose);
        }
      }, autoCloseDelay);
      
      // Animate progress bar
      const progressBar = toast.querySelector('.toast-progress');
      setTimeout(() => {
        progressBar.style.transition = `transform ${autoCloseDelay}ms linear`;
        progressBar.style.transform = 'scaleX(0)';
      }, 10);
    }
    
    // Append toast to container
    container.appendChild(toast);
    
    // Add accessibility attributes
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', type === this.types.ERROR ? 'assertive' : 'polite');
    
    // Return the toast element
    return toast;
  },
  
  // Show a modal alert
  modal(options = {}) {
    const {
      type = this.types.INFO,
      title = '',
      message = '',
      icon = this.getIconForType(type),
      confirmText = 'OK',
      cancelText = null,
      animation = true,
      onConfirm = null,
      onCancel = null,
      onClose = null
    } = options;
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-alert-overlay';
    if (!animation) overlay.style.animation = 'none';
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = `modal-alert modal-alert-${type}`;
    if (!animation) modal.style.animation = 'none';
    
    // Create modal content
    modal.innerHTML = `
      <div class="modal-alert-icon">
        <i class="${icon}"></i>
      </div>
      ${title ? `<div class="modal-alert-title">${title}</div>` : ''}
      ${message ? `<div class="modal-alert-message">${message}</div>` : ''}
      <div class="modal-alert-actions">
        <button type="button" class="btn btn-primary modal-confirm">${confirmText}</button>
        ${cancelText ? `<button type="button" class="btn modal-cancel">${cancelText}</button>` : ''}
      </div>
    `;
    
    // Add event listeners for buttons
    const confirmButton = modal.querySelector('.modal-confirm');
    confirmButton.addEventListener('click', () => {
      this.closeModal(overlay, modal, onConfirm, onClose);
    });
    
    if (cancelText) {
      const cancelButton = modal.querySelector('.modal-cancel');
      cancelButton.addEventListener('click', () => {
        this.closeModal(overlay, modal, onCancel, onClose);
      });
    }
    
    // Close on escape key
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape' && document.body.contains(overlay)) {
        document.removeEventListener('keydown', escHandler);
        this.closeModal(overlay, modal, onCancel, onClose);
      }
    }.bind(this));
    
    // Append modal to overlay and overlay to body
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Add accessibility attributes
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', title ? 'modal-title' : null);
    modal.setAttribute('aria-describedby', message ? 'modal-message' : null);
    
    // Focus the confirm button
    setTimeout(() => {
      confirmButton.focus();
    }, 100);
    
    // Return the modal element
    return { overlay, modal };
  },
  
  // Show a form feedback message
  formFeedback(options = {}) {
    const {
      type = this.types.INFO,
      message = '',
      icon = this.getIconForType(type),
      container = null,
      autoClose = false,
      autoCloseDelay = 5000,
      animation = true,
      onClose = null
    } = options;
    
    if (!container) {
      console.error('Container is required for form feedback');
      return null;
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback form-feedback-${type}`;
    if (!animation) feedback.style.animation = 'none';
    
    // Create feedback content
    feedback.innerHTML = `
      <div class="form-feedback-icon">
        <i class="${icon}"></i>
      </div>
      <div class="form-feedback-message">${message}</div>
    `;
    
    // Auto close if enabled
    if (autoClose) {
      setTimeout(() => {
        if (document.body.contains(feedback)) {
          this.close(feedback, onClose);
        }
      }, autoCloseDelay);
    }
    
    // Append feedback to container
    container.appendChild(feedback);
    
    // Add accessibility attributes
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', type === this.types.ERROR ? 'assertive' : 'polite');
    
    // Return the feedback element
    return feedback;
  },
  
  // Show a status indicator
  statusIndicator(options = {}) {
    const {
      type = this.types.INFO,
      message = '',
      container = null,
      animation = true
    } = options;
    
    if (!container) {
      console.error('Container is required for status indicator');
      return null;
    }
    
    // Create indicator element
    const indicator = document.createElement('div');
    indicator.className = `status-indicator status-${type}`;
    if (!animation) indicator.style.animation = 'none';
    
    // Create indicator content
    indicator.innerHTML = `
      <div class="status-indicator-dot"></div>
      <div class="status-indicator-message">${message}</div>
    `;
    
    // Append indicator to container
    container.appendChild(indicator);
    
    // Return the indicator element
    return indicator;
  },
  
  // Close an alert
  close(alert, callback = null) {
    if (!alert) return;
    
    // Add disappear animation
    alert.classList.add('alert-disappear');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
        
        // Call callback if provided
        if (typeof callback === 'function') {
          callback();
        }
      }
    }, 300);
  },
  
  // Close a toast notification
  closeToast(toast, container, callback = null) {
    if (!toast) return;
    
    // Add disappear animation
    toast.classList.add('toast-out');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
        
        // Remove container if empty
        if (container && container.children.length === 0) {
          container.parentNode.removeChild(container);
        }
        
        // Call callback if provided
        if (typeof callback === 'function') {
          callback();
        }
      }
    }, 300);
  },
  
  // Close a modal alert
  closeModal(overlay, modal, actionCallback = null, closeCallback = null) {
    if (!overlay || !modal) return;
    
    // Call action callback if provided
    if (typeof actionCallback === 'function') {
      actionCallback();
    }
    
    // Remove from DOM
    document.body.removeChild(overlay);
    
    // Call close callback if provided
    if (typeof closeCallback === 'function') {
      closeCallback();
    }
  },
  
  // Get icon for alert type
  getIconForType(type) {
    // Check if we should use SVG icons
    const useSvgIcons = document.querySelector('svg symbol#icon-check-circle') !== null;
    
    if (useSvgIcons) {
      switch (type) {
        case this.types.SUCCESS:
          return 'icon-check-circle';
        case this.types.ERROR:
          return 'icon-alert-circle';
        case this.types.WARNING:
          return 'icon-alert-triangle';
        case this.types.INFO:
        default:
          return 'icon-info';
      }
    } else {
      // Fallback to Font Awesome icons
      switch (type) {
        case this.types.SUCCESS:
          return 'fas fa-check-circle';
        case this.types.ERROR:
          return 'fas fa-exclamation-circle';
        case this.types.WARNING:
          return 'fas fa-exclamation-triangle';
        case this.types.INFO:
        default:
          return 'fas fa-info-circle';
      }
    }
  }
};

// Export AlertStateManager to window for debugging
window.AlertStateManager = AlertStateManager;