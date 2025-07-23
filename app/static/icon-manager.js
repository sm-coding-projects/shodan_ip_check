/**
 * Icon Manager - Modern Iconography System
 * Handles dynamic icon creation, state management, and visual enhancements
 */

const IconManager = {
  // Icon mappings for different data types and states
  iconMappings: {
    // Service protocol icons
    protocols: {
      'http': 'icon-http',
      'https': 'icon-https',
      'ssh': 'icon-ssh',
      'ftp': 'icon-ftp',
      'telnet': 'icon-telnet',
      'smtp': 'icon-mail',
      'dns': 'icon-dns',
      'rdp': 'icon-rdp',
      'sql': 'icon-sql',
      'mysql': 'icon-sql',
      'mssql': 'icon-sql',
      'postgres': 'icon-sql',
      'mongodb': 'icon-database',
      'redis': 'icon-database',
      'webcam': 'icon-webcam',
      'rtsp': 'icon-webcam',
      'api': 'icon-api',
      'default': 'icon-server'
    },
    
    // Vulnerability severity icons
    severity: {
      'critical': 'icon-severity-critical',
      'high': 'icon-severity-high',
      'medium': 'icon-severity-medium',
      'low': 'icon-severity-low',
      'info': 'icon-severity-info'
    },
    
    // Port status icons
    portStatus: {
      'open': 'icon-port-open',
      'closed': 'icon-port-closed',
      'filtered': 'icon-shield-alert'
    },
    
    // Data type icons
    dataTypes: {
      'location': 'icon-location',
      'organization': 'icon-building',
      'server': 'icon-server',
      'vulnerability': 'icon-vulnerability',
      'service': 'icon-globe',
      'cve': 'icon-cve',
      'exploit': 'icon-exploit',
      'malware': 'icon-malware',
      'threat': 'icon-threat',
      'firewall': 'icon-firewall',
      'network': 'icon-network',
      'scan': 'icon-scan'
    },
    
    // Loading state icons
    loadingStates: {
      'default': 'icon-loader',
      'dots': 'icon-loading-dots',
      'bars': 'icon-loading-bars',
      'progress': 'icon-progress'
    },
    
    // Data visualization icons
    dataViz: {
      'chart': 'icon-bar-chart',
      'pie': 'icon-pie-chart',
      'trend-up': 'icon-trending-up',
      'trend-down': 'icon-trending-down',
      'activity': 'icon-activity'
    }
  },
  
  /**
   * Create an SVG icon element
   * @param {string} iconId - The icon ID to use
   * @param {Object} options - Configuration options
   * @returns {SVGElement} The created SVG element
   */
  createIcon(iconId, options = {}) {
    const {
      size = 'md',
      className = '',
      ariaHidden = true,
      title = null,
      interactive = false,
      tooltip = null
    } = options;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    
    // Set basic attributes
    svg.classList.add('svg-icon', `svg-icon-${size}`);
    if (className) {
      svg.classList.add(...className.split(' '));
    }
    
    if (ariaHidden) {
      svg.setAttribute('aria-hidden', 'true');
    }
    
    if (title) {
      svg.setAttribute('aria-label', title);
      const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleElement.textContent = title;
      svg.appendChild(titleElement);
    }
    
    if (interactive) {
      svg.classList.add('icon-interactive');
      svg.setAttribute('tabindex', '0');
      svg.setAttribute('role', 'button');
    }
    
    if (tooltip) {
      svg.classList.add('icon-tooltip');
      svg.setAttribute('data-tooltip', tooltip);
    }
    
    // Set the icon reference
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${iconId}`);
    svg.appendChild(use);
    
    return svg;
  },
  
  /**
   * Create a service protocol icon with enhanced styling
   * @param {string} protocol - The protocol name
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created protocol icon container
   */
  createProtocolIcon(protocol, options = {}) {
    const {
      showLabel = false,
      size = 'md',
      interactive = false
    } = options;
    
    const container = document.createElement('div');
    const iconId = this.iconMappings.protocols[protocol.toLowerCase()] || this.iconMappings.protocols.default;
    const protocolClass = `protocol-${protocol.toLowerCase()}`;
    
    container.className = `protocol-icon ${protocolClass}`;
    
    if (interactive) {
      container.classList.add('icon-interactive');
      container.setAttribute('tabindex', '0');
      container.setAttribute('role', 'button');
      container.setAttribute('aria-label', `${protocol.toUpperCase()} service`);
    }
    
    const icon = this.createIcon(iconId, { size, ariaHidden: !showLabel });
    container.appendChild(icon);
    
    if (showLabel) {
      const label = document.createElement('span');
      label.className = 'protocol-label';
      label.textContent = protocol.toUpperCase();
      container.appendChild(label);
    }
    
    return container;
  },
  
  /**
   * Create a vulnerability severity indicator
   * @param {string} severity - The severity level
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created severity indicator
   */
  createSeverityIndicator(severity, options = {}) {
    const {
      showIcon = true,
      showLabel = true,
      count = null,
      interactive = false
    } = options;
    
    const container = document.createElement('div');
    const severityClass = `vuln-${severity.toLowerCase()}`;
    
    container.className = `vuln-severity-indicator ${severityClass}`;
    
    if (interactive) {
      container.classList.add('icon-interactive');
      container.setAttribute('tabindex', '0');
      container.setAttribute('role', 'button');
    }
    
    if (showIcon) {
      const iconId = this.iconMappings.severity[severity.toLowerCase()] || this.iconMappings.severity.info;
      const icon = this.createIcon(iconId, { size: 'xs', ariaHidden: !showLabel });
      container.appendChild(icon);
    }
    
    if (showLabel) {
      const label = document.createElement('span');
      label.textContent = severity.charAt(0).toUpperCase() + severity.slice(1);
      if (count !== null) {
        label.textContent += ` (${count})`;
      }
      container.appendChild(label);
    }
    
    return container;
  },
  
  /**
   * Create a port status indicator
   * @param {string} status - The port status
   * @param {string} port - The port number
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created port status indicator
   */
  createPortStatusIndicator(status, port, options = {}) {
    const {
      showPort = true,
      showStatus = true,
      interactive = false
    } = options;
    
    const container = document.createElement('div');
    const statusClass = `port-status-${status.toLowerCase()}`;
    
    container.className = `port-status ${statusClass}`;
    
    if (interactive) {
      container.classList.add('icon-interactive');
      container.setAttribute('tabindex', '0');
      container.setAttribute('role', 'button');
      container.setAttribute('aria-label', `Port ${port} is ${status}`);
    }
    
    const iconId = this.iconMappings.portStatus[status.toLowerCase()] || this.iconMappings.portStatus.closed;
    const icon = this.createIcon(iconId, { size: 'sm', ariaHidden: false });
    container.appendChild(icon);
    
    if (showPort || showStatus) {
      const label = document.createElement('span');
      let labelText = '';
      
      if (showPort) {
        labelText += port;
      }
      
      if (showStatus) {
        if (showPort) labelText += ' ';
        labelText += `(${status})`;
      }
      
      label.textContent = labelText;
      container.appendChild(label);
    }
    
    return container;
  },
  
  /**
   * Create a data type indicator
   * @param {string} type - The data type
   * @param {string} value - The data value
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created data type indicator
   */
  createDataTypeIndicator(type, value, options = {}) {
    const {
      copyable = false,
      interactive = false,
      truncate = false,
      maxLength = 30
    } = options;
    
    const container = document.createElement('div');
    const typeClass = `data-type-${type.toLowerCase()}`;
    
    container.className = `data-type-indicator ${typeClass}`;
    
    if (interactive) {
      container.classList.add('icon-interactive');
      container.setAttribute('tabindex', '0');
      container.setAttribute('role', 'button');
    }
    
    const iconId = this.iconMappings.dataTypes[type.toLowerCase()] || this.iconMappings.dataTypes.server;
    const icon = this.createIcon(iconId, { size: 'xs', ariaHidden: false });
    container.appendChild(icon);
    
    const valueSpan = document.createElement('span');
    let displayValue = value;
    
    if (truncate && value.length > maxLength) {
      displayValue = value.substring(0, maxLength) + '...';
      valueSpan.setAttribute('title', value);
    }
    
    valueSpan.textContent = displayValue;
    container.appendChild(valueSpan);
    
    if (copyable) {
      const copyButton = this.createCopyButton(value);
      container.appendChild(copyButton);
    }
    
    return container;
  },
  
  /**
   * Create a copy button with icon
   * @param {string} textToCopy - The text to copy
   * @returns {HTMLElement} The created copy button
   */
  createCopyButton(textToCopy) {
    const button = document.createElement('button');
    button.className = 'copy-icon icon-interactive';
    button.setAttribute('aria-label', 'Copy to clipboard');
    button.setAttribute('title', 'Copy to clipboard');
    
    const icon = this.createIcon('icon-copy', { size: 'xs', ariaHidden: true });
    button.appendChild(icon);
    
    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Visual feedback
        button.classList.add('copied');
        icon.classList.add('icon-state-success');
        
        // Reset after animation
        setTimeout(() => {
          button.classList.remove('copied');
          icon.classList.remove('icon-state-success');
        }, 1000);
        
      } catch (err) {
        console.error('Failed to copy text: ', err);
        
        // Error feedback
        icon.classList.add('icon-state-error');
        setTimeout(() => {
          icon.classList.remove('icon-state-error');
        }, 500);
      }
    });
    
    return button;
  },
  
  /**
   * Create a vulnerability badge with enhanced visual styling
   * @param {string} severity - The severity level
   * @param {string} cveId - The CVE ID (optional)
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created vulnerability badge
   */
  createVulnerabilityBadge(severity, cveId = null, options = {}) {
    const {
      showIcon = true,
      showLabel = true,
      interactive = true,
      pulsate = severity === 'critical' || severity === 'high'
    } = options;
    
    const container = document.createElement('div');
    const severityClass = `vuln-${severity.toLowerCase()}`;
    
    container.className = `vulnerability-badge ${severityClass}`;
    
    if (pulsate) {
      container.classList.add('badge-pulsate');
    }
    
    if (interactive) {
      container.classList.add('icon-interactive');
      container.setAttribute('tabindex', '0');
      container.setAttribute('role', 'button');
      container.setAttribute('aria-label', `${severity} vulnerability${cveId ? ': ' + cveId : ''}`);
    }
    
    if (showIcon) {
      const iconId = this.iconMappings.severity[severity.toLowerCase()] || this.iconMappings.severity.info;
      const icon = this.createIcon(iconId, { size: 'sm', ariaHidden: !showLabel });
      container.appendChild(icon);
    }
    
    if (showLabel) {
      const label = document.createElement('span');
      label.className = 'vuln-label';
      label.textContent = severity.charAt(0).toUpperCase() + severity.slice(1);
      container.appendChild(label);
    }
    
    if (cveId) {
      const cveLabel = document.createElement('span');
      cveLabel.className = 'vuln-cve-id';
      cveLabel.textContent = cveId;
      container.appendChild(cveLabel);
    }
    
    return container;
  },
  
  /**
   * Create a network service badge
   * @param {string} service - The service name
   * @param {string} port - The port number
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created service badge
   */
  createServiceBadge(service, port, options = {}) {
    const {
      showPort = true,
      showIcon = true,
      interactive = true
    } = options;
    
    const container = document.createElement('div');
    const serviceKey = service.toLowerCase();
    const serviceClass = `service-${serviceKey}`;
    
    container.className = `service-badge ${serviceClass}`;
    
    if (interactive) {
      container.classList.add('icon-interactive');
      container.setAttribute('tabindex', '0');
      container.setAttribute('role', 'button');
      container.setAttribute('aria-label', `${service} service on port ${port}`);
    }
    
    if (showIcon) {
      const iconId = this.iconMappings.protocols[serviceKey] || this.iconMappings.protocols.default;
      const icon = this.createIcon(iconId, { size: 'sm', ariaHidden: true });
      container.appendChild(icon);
    }
    
    const serviceLabel = document.createElement('span');
    serviceLabel.className = 'service-name';
    serviceLabel.textContent = service.toUpperCase();
    container.appendChild(serviceLabel);
    
    if (showPort) {
      const portLabel = document.createElement('span');
      portLabel.className = 'service-port';
      portLabel.textContent = `:${port}`;
      container.appendChild(portLabel);
    }
    
    return container;
  },
  
  /**
   * Create a connection status indicator
   * @param {string} status - The connection status
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created connection status indicator
   */
  createConnectionStatus(status, options = {}) {
    const {
      showLabel = false,
      label = status
    } = options;
    
    const container = document.createElement('div');
    const statusClass = `connection-${status.toLowerCase()}`;
    
    container.className = `connection-status ${statusClass}`;
    container.setAttribute('aria-label', `Connection status: ${status}`);
    
    if (showLabel) {
      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      labelSpan.className = 'connection-label';
      container.appendChild(labelSpan);
    }
    
    return container;
  },
  
  /**
   * Create a loading state icon
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created loading icon
   */
  createLoadingIcon(options = {}) {
    const {
      size = 'md',
      message = 'Loading...',
      type = 'default',
      showText = false
    } = options;
    
    const container = document.createElement('div');
    container.className = 'icon-loading-state is-loading';
    container.setAttribute('aria-label', message);
    
    const iconId = this.iconMappings.loadingStates[type] || this.iconMappings.loadingStates.default;
    const icon = this.createIcon(iconId, { size, ariaHidden: !showText });
    icon.classList.add('icon-loading');
    container.appendChild(icon);
    
    if (showText) {
      const textEl = document.createElement('span');
      textEl.className = 'loading-text';
      textEl.textContent = message;
      container.appendChild(textEl);
    }
    
    return container;
  },
  
  /**
   * Create a data visualization icon
   * @param {string} type - The visualization type
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created data visualization icon
   */
  createDataVizIcon(type, options = {}) {
    const {
      size = 'md',
      interactive = false,
      label = null,
      tooltip = null
    } = options;
    
    const container = document.createElement('div');
    container.className = `data-viz-icon data-viz-${type}`;
    
    if (interactive) {
      container.classList.add('icon-interactive');
      container.setAttribute('tabindex', '0');
      container.setAttribute('role', 'button');
    }
    
    if (tooltip) {
      container.classList.add('icon-tooltip');
      container.setAttribute('data-tooltip', tooltip);
    }
    
    const iconId = this.iconMappings.dataViz[type] || this.iconMappings.dataViz.chart;
    const icon = this.createIcon(iconId, { size, ariaHidden: !label });
    container.appendChild(icon);
    
    if (label) {
      const labelEl = document.createElement('span');
      labelEl.className = 'data-viz-label';
      labelEl.textContent = label;
      container.appendChild(labelEl);
    }
    
    return container;
  },
  
  /**
   * Create a status indicator with enhanced visual styling
   * @param {string} status - The status value
   * @param {string} type - The status type
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created status indicator
   */
  createStatusIndicator(status, type, options = {}) {
    const {
      showIcon = true,
      showLabel = true,
      pulsate = false,
      size = 'md'
    } = options;
    
    const container = document.createElement('div');
    container.className = `status-indicator status-${type} status-${status.toLowerCase()}`;
    
    if (pulsate) {
      container.classList.add('status-pulsate');
    }
    
    let iconId;
    switch (type) {
      case 'vulnerability':
        iconId = this.iconMappings.severity[status.toLowerCase()] || this.iconMappings.severity.info;
        break;
      case 'port':
        iconId = this.iconMappings.portStatus[status.toLowerCase()] || this.iconMappings.portStatus.closed;
        break;
      case 'service':
        iconId = this.iconMappings.protocols[status.toLowerCase()] || this.iconMappings.protocols.default;
        break;
      default:
        iconId = 'icon-info';
    }
    
    if (showIcon) {
      const icon = this.createIcon(iconId, { size, ariaHidden: !showLabel });
      container.appendChild(icon);
    }
    
    if (showLabel) {
      const label = document.createElement('span');
      label.className = 'status-label';
      label.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      container.appendChild(label);
    }
    
    return container;
  },
  
  /**
   * Update theme-aware icons when theme changes
   */
  updateThemeIcons() {
    // Update theme toggle icons
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const moonIcon = themeToggle.querySelector('svg:first-of-type use');
      const sunIcon = themeToggle.querySelector('svg:last-of-type use');
      
      if (moonIcon && sunIcon) {
        if (currentTheme === 'dark') {
          moonIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-moon');
          sunIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-sun');
        } else {
          moonIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-moon');
          sunIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-sun');
        }
      }
    }
  },
  
  /**
   * Initialize the icon system
   */
  init() {
    // Listen for theme changes
    window.addEventListener('themechange', () => {
      this.updateThemeIcons();
    });
    
    // Add accessibility enhancements
    this.setupAccessibility();
    
    // Initialize theme icons
    this.updateThemeIcons();
    
    // Setup reduced motion preferences
    this.setupReducedMotion();
    
    // Setup icon tooltips
    this.setupTooltips();
    
    // Initialize dynamic icon states
    this.initDynamicIcons();
  },
  
  /**
   * Setup reduced motion preferences
   */
  setupReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (mq) => {
      if (mq.matches) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    };
    
    // Initial check
    handleReducedMotion(mediaQuery);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleReducedMotion);
  },
  
  /**
   * Setup icon tooltips
   */
  setupTooltips() {
    // Add tooltip functionality for dynamically created icons
    document.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('icon-tooltip') || e.target.closest('.icon-tooltip')) {
        const tooltipEl = e.target.classList.contains('icon-tooltip') ? e.target : e.target.closest('.icon-tooltip');
        const tooltip = tooltipEl.getAttribute('data-tooltip');
        
        if (tooltip) {
          // Position tooltip based on available space
          const rect = tooltipEl.getBoundingClientRect();
          const spaceAbove = rect.top;
          const spaceBelow = window.innerHeight - rect.bottom;
          
          tooltipEl.classList.add('tooltip-visible');
          
          if (spaceAbove > spaceBelow && spaceAbove > 40) {
            tooltipEl.classList.add('tooltip-top');
            tooltipEl.classList.remove('tooltip-bottom');
          } else {
            tooltipEl.classList.add('tooltip-bottom');
            tooltipEl.classList.remove('tooltip-top');
          }
        }
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      if (e.target.classList.contains('icon-tooltip') || e.target.closest('.icon-tooltip')) {
        const tooltipEl = e.target.classList.contains('icon-tooltip') ? e.target : e.target.closest('.icon-tooltip');
        tooltipEl.classList.remove('tooltip-visible', 'tooltip-top', 'tooltip-bottom');
      }
    });
  },
  
  /**
   * Initialize dynamic icon states
   */
  initDynamicIcons() {
    // Add any dynamic icon behaviors here
    this.setupIconAnimations();
  },
  
  /**
   * Setup icon animations
   */
  setupIconAnimations() {
    // Add intersection observer for animate-on-scroll icons
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('icon-animate');
        } else {
          entry.target.classList.remove('icon-animate');
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all animate-on-scroll icons
    document.querySelectorAll('.icon-animate-on-scroll').forEach(icon => {
      observer.observe(icon);
    });
  },
  
  /**
   * Setup accessibility enhancements for icons
   */
  setupAccessibility() {
    // Add keyboard navigation for interactive icons
    document.addEventListener('keydown', (e) => {
      if (e.target.classList.contains('icon-interactive')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.target.click();
        }
      }
    });
    
    // Add focus management
    document.addEventListener('focusin', (e) => {
      if (e.target.classList.contains('icon-interactive')) {
        e.target.classList.add('icon-focused');
      }
    });
    
    document.addEventListener('focusout', (e) => {
      if (e.target.classList.contains('icon-interactive')) {
        e.target.classList.remove('icon-focused');
      }
    });
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IconManager;
} else if (typeof window !== 'undefined') {
  window.IconManager = IconManager;
}