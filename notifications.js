// Notification system

// Notification types
const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Notification icons
const NOTIFICATION_ICONS = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
};

// Show notification
function showNotification(message, type = NOTIFICATION_TYPES.SUCCESS, duration = 3000) {
    const existing = document.querySelector('.notification-container');
    if (existing) {
        existing.remove();
    }
    
    const container = document.createElement('div');
    container.className = 'notification-container';
    container.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        z-index: 10000;
        max-width: 400px;
        width: 100%;
    `;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(120%);
        transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
    `;
    
    notification.innerHTML = `
        <span style="font-size:1.5rem;">${NOTIFICATION_ICONS[type] || '📢'}</span>
        <span style="flex:1;">${message}</span>
        <button onclick="this.closest('.notification').style.transform='translateX(120%)'" style="background:transparent;border:none;color:white;font-size:1.2rem;cursor:pointer;opacity:0.7;">
            ✕
        </button>
    `;
    
    container.appendChild(notification);
    document.body.appendChild(container);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 50);
    
    // Auto dismiss
    if (duration > 0) {
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                container.remove();
            }, 500);
        }, duration);
    }
    
    return notification;
}

// Get notification color
function getNotificationColor(type) {
    switch (type) {
        case NOTIFICATION_TYPES.SUCCESS:
            return '#28a745';
        case NOTIFICATION_TYPES.ERROR:
            return '#dc3545';
        case NOTIFICATION_TYPES.WARNING:
            return '#f39c12';
        case NOTIFICATION_TYPES.INFO:
            return '#0f3460';
        default:
            return '#0f3460';
    }
}

// Show success notification
function showSuccess(message, duration = 3000) {
    return showNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);
}

// Show error notification
function showError(message, duration = 3000) {
    return showNotification(message, NOTIFICATION_TYPES.ERROR, duration);
}

// Show warning notification
function showWarning(message, duration = 3000) {
    return showNotification(message, NOTIFICATION_TYPES.WARNING, duration);
}

// Show info notification
function showInfo(message, duration = 3000) {
    return showNotification(message, NOTIFICATION_TYPES.INFO, duration);
}

// Create a toast notification (compatible with existing system)
function createToast(message, type = 'success', duration = 3000) {
    return showNotification(message, type, duration);
}

// Notification badge updater
function updateNotificationBadge(count) {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Request notification permission (for browser notifications)
function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
}

// Send browser notification
function sendBrowserNotification(title, body, icon = null) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: icon || 'https://via.placeholder.com/128x128/0f3460/ffffff?text=EFYA'
        });
    }
}

// Initialize notifications
function initNotifications() {
    // Check for browser notification support
    requestNotificationPermission();
    
    // Create notification container
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            z-index: 10000;
            max-width: 400px;
            width: 100%;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

// Show order confirmation notification
function showOrderConfirmation(order) {
    const message = `Order #${order.orderNumber || order.id} confirmed! Total: GH₵${order.total}`;
    showSuccess(message);
    
    // Browser notification
    sendBrowserNotification(
        'Order Confirmed! 🎉',
        `Order #${order.orderNumber || order.id} - GH₵${order.total}`,
        'https://via.placeholder.com/128x128/0f3460/ffffff?text=EFYA'
    );
}

// Show low stock notification
function showLowStockAlert(product) {
    showWarning(`⚠️ Low stock alert: ${product.name} (${product.stock} remaining)`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initNotifications();
    
    // Check for low stock on admin page
    if (window.location.pathname.includes('admin.html')) {
        const lowStock = getLowStockProducts(10);
        if (lowStock.length > 0) {
            setTimeout(() => {
                showWarning(`${lowStock.length} product(s) running low on stock`);
            }, 1000);
        }
    }
});