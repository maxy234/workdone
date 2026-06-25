// Analytics and tracking functions

// Track page view
function trackPageView(page) {
    const views = JSON.parse(localStorage.getItem('efya_page_views') || '{}');
    views[page] = (views[page] || 0) + 1;
    views['_total'] = (views['_total'] || 0) + 1;
    localStorage.setItem('efya_page_views', JSON.stringify(views));
}

// Track product view
function trackProductView(productId) {
    const views = JSON.parse(localStorage.getItem('efya_product_views') || '{}');
    views[productId] = (views[productId] || 0) + 1;
    localStorage.setItem('efya_product_views', JSON.stringify(views));
}

// Track add to cart
function trackAddToCart(productId, quantity) {
    const events = JSON.parse(localStorage.getItem('efya_cart_events') || '[]');
    events.push({
        type: 'add_to_cart',
        productId: productId,
        quantity: quantity,
        timestamp: Date.now()
    });
    // Keep last 100 events
    if (events.length > 100) {
        events.shift();
    }
    localStorage.setItem('efya_cart_events', JSON.stringify(events));
}

// Track purchase
function trackPurchase(order) {
    const purchases = JSON.parse(localStorage.getItem('efya_purchases') || '[]');
    purchases.push({
        orderId: order.id,
        total: order.total,
        items: order.items.length,
        timestamp: Date.now()
    });
    localStorage.setItem('efya_purchases', JSON.stringify(purchases));
}

// Get analytics data
function getAnalytics() {
    const pageViews = JSON.parse(localStorage.getItem('efya_page_views') || '{}');
    const productViews = JSON.parse(localStorage.getItem('efya_product_views') || '{}');
    const cartEvents = JSON.parse(localStorage.getItem('efya_cart_events') || '[]');
    const purchases = JSON.parse(localStorage.getItem('efya_purchases') || '[]');
    
    // Most viewed products
    const mostViewed = Object.entries(productViews)
        .map(([id, views]) => ({ id, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
    
    // Get product names for most viewed
    const products = getProducts();
    const mostViewedWithNames = mostViewed.map(mv => {
        const product = products.find(p => p.id === mv.id);
        return {
            id: mv.id,
            name: product ? product.name : 'Unknown',
            views: mv.views
        };
    });
    
    // Cart abandonment rate
    const addToCartEvents = cartEvents.filter(e => e.type === 'add_to_cart');
    const totalAdds = addToCartEvents.length;
    const totalPurchases = purchases.length;
    const abandonmentRate = totalAdds > 0 ? ((totalAdds - totalPurchases) / totalAdds * 100) : 0;
    
    // Average order value
    const avgOrderValue = purchases.length > 0 
        ? purchases.reduce((sum, p) => sum + p.total, 0) / purchases.length 
        : 0;
    
    // Total revenue
    const totalRevenue = purchases.reduce((sum, p) => sum + p.total, 0);
    
    return {
        pageViews,
        totalPageViews: pageViews._total || 0,
        mostViewedProducts: mostViewedWithNames,
        totalAddsToCart: totalAdds,
        totalPurchases: totalPurchases,
        abandonmentRate: Math.round(abandonmentRate),
        avgOrderValue: Math.round(avgOrderValue),
        totalRevenue: Math.round(totalRevenue),
        conversionRate: totalAdds > 0 ? Math.round((totalPurchases / totalAdds) * 100) : 0
    };
}

// Track user session
function startSession() {
    const session = {
        startTime: Date.now(),
        pageViews: 0,
        productsViewed: [],
        cartActions: 0
    };
    localStorage.setItem('efya_session', JSON.stringify(session));
}

// Update session data
function updateSession(data) {
    const session = JSON.parse(localStorage.getItem('efya_session') || '{}');
    Object.assign(session, data);
    localStorage.setItem('efya_session', JSON.stringify(session));
}

// Get session duration
function getSessionDuration() {
    const session = JSON.parse(localStorage.getItem('efya_session') || '{}');
    if (session.startTime) {
        return Math.round((Date.now() - session.startTime) / 1000);
    }
    return 0;
}

// Track scroll depth
function trackScrollDepth() {
    let maxDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const depth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (depth > maxDepth) {
            maxDepth = depth;
            if (depth >= 25 && depth < 50) {
                trackEvent('scroll_25');
            } else if (depth >= 50 && depth < 75) {
                trackEvent('scroll_50');
            } else if (depth >= 75 && depth < 100) {
                trackEvent('scroll_75');
            } else if (depth >= 100) {
                trackEvent('scroll_100');
            }
        }
    });
}

// Track custom event
function trackEvent(eventName, data = {}) {
    const events = JSON.parse(localStorage.getItem('efya_events') || '[]');
    events.push({
        event: eventName,
        data: data,
        timestamp: Date.now()
    });
    // Keep last 200 events
    if (events.length > 200) {
        events.shift();
    }
    localStorage.setItem('efya_events', JSON.stringify(events));
}

// Initialize analytics
function initAnalytics() {
    // Track page view
    const page = window.location.pathname.split('/').pop() || 'index.html';
    trackPageView(page);
    
    // Start session if not exists
    if (!localStorage.getItem('efya_session')) {
        startSession();
    }
    
    // Track scroll depth
    trackScrollDepth();
    
    // Track time on page
    window.addEventListener('beforeunload', () => {
        const duration = getSessionDuration();
        trackEvent('session_end', { duration });
    });
}

// Auto-initialize analytics
document.addEventListener('DOMContentLoaded', initAnalytics);