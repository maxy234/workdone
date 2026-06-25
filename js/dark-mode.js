// Dark mode functionality

const DARK_MODE_KEY = 'efya_dark_mode';

// Check if dark mode is enabled
function isDarkMode() {
    return localStorage.getItem(DARK_MODE_KEY) === 'true';
}

// Enable dark mode
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem(DARK_MODE_KEY, 'true');
    updateDarkModeIcon(true);
}

// Disable dark mode
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem(DARK_MODE_KEY, 'false');
    updateDarkModeIcon(false);
}

// Toggle dark mode
function toggleDarkMode() {
    if (isDarkMode()) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Update dark mode icon
function updateDarkModeIcon(isDark) {
    const icon = document.getElementById('darkModeIcon');
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        icon.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
}

// Initialize dark mode
function initDarkMode() {
    // Check if dark mode is saved
    if (isDarkMode()) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    
    // Create toggle button if it doesn't exist
    if (!document.getElementById('darkModeToggle')) {
        const toggle = document.createElement('button');
        toggle.id = 'darkModeToggle';
        toggle.className = 'dark-mode-toggle';
        toggle.innerHTML = `<i id="darkModeIcon" class="${isDarkMode() ? 'fas fa-sun' : 'fas fa-moon'}"></i>`;
        toggle.onclick = toggleDarkMode;
        toggle.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: ${isDarkMode() ? '#d4af37' : '#0f3460'};
            color: white;
            font-size: 1.3rem;
            cursor: pointer;
            z-index: 999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(toggle);
    }
}

// Dark mode CSS variables
const darkModeStyles = `
    .dark-mode {
        --bg-primary: #1a1a2e;
        --bg-secondary: #2a2a3e;
        --bg-card: #2a2a3e;
        --text-primary: #ffffff;
        --text-secondary: #aaaaaa;
        --border-color: #333333;
        --shadow-color: rgba(0,0,0,0.4);
        --input-bg: #333344;
        --input-border: #444455;
    }
    
    .dark-mode body {
        background: #1a1a2e;
        color: #ffffff;
    }
    
    .dark-mode .navbar {
        background: #1a1a2e;
        border-bottom: 1px solid #333;
    }
    
    .dark-mode .navbar a {
        color: #ffffff;
    }
    
    .dark-mode .product-card,
    .dark-mode .feature-card,
    .dark-mode .testimonial-card,
    .dark-mode .sidebar,
    .dark-mode .cart-item,
    .dark-mode .checkout-form,
    .dark-mode .order-summary,
    .dark-mode .contact-form,
    .dark-mode .contact-info,
    .dark-mode .business-hours,
    .dark-mode .admin-section,
    .dark-mode .stat-card {
        background: #2a2a3e;
        color: #ffffff;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    }
    
    .dark-mode .product-card .info h3,
    .dark-mode .feature-card h3,
    .dark-mode .testimonial-card h4 {
        color: #ffffff;
    }
    
    .dark-mode .product-card .info .code,
    .dark-mode .product-card .info .rating,
    .dark-mode .feature-card p,
    .dark-mode .testimonial-card p,
    .dark-mode .cart-item .item-info .code,
    .dark-mode .cart-item .item-info .details {
        color: #aaaaaa;
    }
    
    .dark-mode .btn {
        background: #d4af37;
        color: #1a1a2e;
    }
    
    .dark-mode .btn:hover {
        background: #c5a028;
        color: #1a1a2e;
    }
    
    .dark-mode .btn-gold {
        background: #d4af37;
        color: #1a1a2e;
    }
    
    .dark-mode input,
    .dark-mode textarea,
    .dark-mode select {
        background: #333344;
        border-color: #444455;
        color: #ffffff;
    }
    
    .dark-mode input:focus,
    .dark-mode textarea:focus {
        border-color: #d4af37;
    }
    
    .dark-mode .cart-summary,
    .dark-mode .admin-sidebar {
        background: #1a1a2e;
        color: #ffffff;
    }
    
    .dark-mode .admin-sidebar .menu-item {
        color: #aaaaaa;
    }
    
    .dark-mode .admin-sidebar .menu-item:hover,
    .dark-mode .admin-sidebar .menu-item.active {
        background: #2a2a3e;
        color: #ffffff;
    }
    
    .dark-mode .footer {
        background: #0f0f1a;
    }
    
    .dark-mode .back-to-top {
        background: #d4af37;
        color: #1a1a2e;
    }
    
    .dark-mode .whatsapp-float {
        background: #25d366;
    }
    
    .dark-mode .toast {
        background: #2a2a3e;
        color: #ffffff;
    }
    
    .dark-mode .toast.success {
        background: #28a745;
    }
    
    .dark-mode .toast.error {
        background: #dc3545;
    }
    
    .dark-mode .hero {
        background: linear-gradient(135deg, #0a0a1a, #1a1a2e, #2a1a3e);
    }
    
    .dark-mode .delivery-info {
        background: linear-gradient(135deg, #1a1a2e, #2a2a3e);
    }
    
    .dark-mode .testimonials {
        background: #1a1a2e;
    }
    
    .dark-mode .category-item {
        background: #2a2a3e;
        color: #ffffff;
    }
    
    .dark-mode .category-item:hover {
        background: #3a3a4e;
    }
    
    .dark-mode .modal-content {
        background: #2a2a3e;
        color: #ffffff;
    }
    
    .dark-mode .modal-content input,
    .dark-mode .modal-content textarea,
    .dark-mode .modal-content select {
        background: #333344;
        border-color: #444455;
        color: #ffffff;
    }
    
    .dark-mode .modal-content .btn-cancel {
        background: #dc3545;
        color: white;
    }
    
    .dark-mode .product-table th {
        background: #1a1a2e;
        color: #ffffff;
    }
    
    .dark-mode .product-table td {
        border-bottom-color: #333;
    }
    
    .dark-mode .product-table .actions button:hover {
        background: #333;
    }
    
    .dark-mode .orders-table th {
        background: #1a1a2e;
        color: #ffffff;
    }
    
    .dark-mode .orders-table td {
        border-bottom-color: #333;
    }
`;

// Inject dark mode styles
const styleSheet = document.createElement('style');
styleSheet.textContent = darkModeStyles;
document.head.appendChild(styleSheet);