# Shodan IP Inspector

A modern, responsive web application that allows you to quickly look up information about any IP address using the Shodan API. This application provides a sleek, user-friendly interface with both light and dark themes, optimized for performance and accessibility.

![Shodan IP Inspector Screenshot](https://via.placeholder.com/800x450.png?text=Shodan+IP+Inspector+-+Modern+UI+with+Light+and+Dark+Themes)

## Features

- **Modern UI**: Clean, responsive design with light and dark theme support
- **Real-time IP Lookup**: Instantly retrieve detailed information about any IPv4 address
- **Comprehensive Data**: View open ports, services, vulnerabilities, geolocation, and more
- **Performance Optimized**: Fast loading times with optimized CSS and JavaScript
- **Accessibility Support**: Full keyboard navigation and reduced motion preferences
- **Mobile Friendly**: Responsive design that works on all device sizes
- **SVG Iconography**: Modern, scalable icons for a crisp visual experience
- **Secure**: Client-side validation and secure API handling

## Information Provided

The Shodan IP Inspector provides the following information about IP addresses:

- **Open ports & detected services**
- **Known vulnerabilities (CVEs)**
- **Geolocation & hostnames**
- **Organization, OS, and more**

## Getting Started

### Prerequisites

- Docker installed on your system
- A valid Shodan API key (get one at [https://account.shodan.io](https://account.shodan.io))

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/shodan-ip-inspector.git
cd shodan-ip-inspector

# 2. Build the Docker image
docker build -t shodan-ip-inspector .

# 3. Run the container
docker run --rm -p 8000:8000 shodan-ip-inspector

# 4. Open in your browser
# Visit http://localhost:8000
```

### Running Without Docker

If you prefer to run the application without Docker:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/shodan-ip-inspector.git
cd shodan-ip-inspector

# 2. Install dependencies
pip install -r app/requirements.txt

# 3. Run the application
uvicorn app.main:app --host 0.0.0.0 --port 8000

# 4. Open in your browser
# Visit http://localhost:8000
```

## Usage

1. Open the application in your web browser
2. Enter your Shodan API key in the designated field
3. Enter the IP address you want to look up
4. Click the "Lookup" button
5. View the detailed information about the IP address

## Technical Details

### Frontend

- **HTML5**: Semantic markup for better accessibility and SEO
- **CSS3**: Modern CSS with variables, flexbox, and grid for responsive layouts
- **JavaScript**: Vanilla JS with no external dependencies
- **SVG Icons**: Custom SVG icon system for crisp visuals at any scale
- **Theme System**: Dynamic theme switching with system preference detection
- **Performance Optimizations**: Lazy loading, code splitting, and minification

### Backend

- **FastAPI**: Modern, fast web framework for building APIs with Python
- **Uvicorn**: ASGI server for serving the FastAPI application
- **HTTPX**: Asynchronous HTTP client for making requests to the Shodan API

### Performance Optimizations

- **CSS Optimization**: Minified CSS with critical CSS loaded first
- **JavaScript Optimization**: Deferred loading and execution
- **Reduced Motion Support**: Respects user preferences for reduced motion
- **Lazy Loading**: Non-critical resources loaded on demand
- **Hardware Acceleration**: Used for smoother animations and transitions
- **Responsive Images**: Optimized for different screen sizes and resolutions
- **Resource Prioritization**: Critical resources are loaded first
- **Code Splitting**: JavaScript is split into smaller chunks
- **Tree Shaking**: Unused code is removed from the final bundle
- **Caching Strategy**: Proper cache headers for optimal browser caching
- **Network Optimization**: Preconnect and prefetch for faster loading
- **Minimal Dependencies**: No external JavaScript libraries required
- **Efficient Animations**: CSS animations optimized for performance
- **Debouncing and Throttling**: Prevents performance issues with frequent events

## Accessibility

The application is designed with accessibility in mind:

- **Keyboard Navigation**: All interactive elements are accessible via keyboard
- **Screen Reader Support**: Proper ARIA attributes and semantic HTML
- **Reduced Motion**: Respects user preferences for reduced motion
- **Color Contrast**: Meets WCAG 2.1 AA standards for color contrast
- **Responsive Design**: Works on all screen sizes and orientations

## Browser Support

The application is tested and works on the following browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Android Chrome)

### Browser Compatibility Features

- **Progressive Enhancement**: Core functionality works without JavaScript
- **Fallbacks**: CSS and JavaScript fallbacks for older browsers
- **Polyfills**: Automatic feature detection and polyfills for modern APIs
- **Responsive Design**: Works on all screen sizes and orientations
- **Touch Support**: Optimized for touch devices with appropriate hit targets
- **High Contrast**: Supports high contrast mode for accessibility
- **Print Styles**: Optimized for printing with dedicated print styles

## Development

### Recent Fixes

- Fixed theme toggle icon handling for better compatibility with SVG icons
- Added proper null checks for DOM elements to prevent potential errors
- Enhanced SVG icon support in alert notifications
- Added missing SVG icon definitions for better visual consistency
- Improved accessibility with proper ARIA attributes and keyboard navigation

### Project Structure

```
shodan-ip-lookup/
├── app/
│   ├── static/
│   │   ├── alert-manager.js
│   │   ├── alert-states.css
│   │   ├── card-components.css
│   │   ├── fine-tuning.css
│   │   ├── icon-manager.js
│   │   ├── icons.svg
│   │   ├── index.html
│   │   ├── loading-states.css
│   │   ├── micro-interactions.css
│   │   ├── modern-iconography.css
│   │   ├── performance-optimizations.js
│   │   ├── performance-optimizations.min.css
│   │   ├── responsive-layout.css
│   │   ├── script.js
│   │   └── style.css
│   ├── main.py
│   └── requirements.txt
├── Dockerfile
└── README.md
```

### Building and Testing

```bash
# Build the Docker image
docker build -t shodan-ip-inspector .

# Run the container
docker run --rm -p 8000:8000 shodan-ip-inspector

# Run tests (if available)
# pytest app/tests
```

## API Reference

The application uses the Shodan API to retrieve information about IP addresses. For more information about the Shodan API, visit [https://developer.shodan.io/api](https://developer.shodan.io/api).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shodan](https://www.shodan.io) for providing the API
- [FastAPI](https://fastapi.tiangolo.com) for the backend framework
- [Feather Icons](https://feathericons.com) for inspiration on SVG icons

---

Created with ❤️ by the Shodan IP Inspector Team