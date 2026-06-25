// Recently viewed products with localStorage
const RECENTLY_VIEWED_KEY = 'efya_recently_viewed';
const MAX_RECENTLY_VIEWED = 10;

// Get recently viewed products
function getRecentlyViewed() {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing recently viewed:', e);
        }
    }
    return [];
}

// Save recently viewed
function saveRecentlyViewed(recentlyViewed) {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
}

// Add product to recently viewed
function addToRecentlyViewed(productId) {
    let recentlyViewed = getRecentlyViewed();
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    // Add to front
    recentlyViewed.unshift(productId);
    // Limit size
    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
        recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    }
    saveRecentlyViewed(recentlyViewed);
    return recentlyViewed;
}

// Get recently viewed products with full details
function getRecentlyViewedProducts() {
    const ids = getRecentlyViewed();
    const products = getProducts();
    return ids.map(id => products.find(p => p.id === id)).filter(p => p);
}

// Clear recently viewed
function clearRecentlyViewed() {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
}

// Render recently viewed products
function renderRecentlyViewed(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const products = getRecentlyViewedProducts();
    
    if (products.length === 0) {
        container.innerHTML = `
            <p style="color:#999;text-align:center;padding:20px 0;">No recently viewed products</p>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:15px;">
            ${products.map(p => `
                <div onclick="window.location.href='product.html?id=${p.id}'" style="cursor:pointer;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);transition:all 0.3s;">
                    <img src="${p.image || 'https://via.placeholder.com/180x180/0f3460/ffffff?text='+p.name}" alt="${p.name}" style="width:100%;height:150px;object-fit:cover;">
                    <div style="padding:10px;">
                        <h4 style="font-size:0.9rem;">${p.name}</h4>
                        <p style="color:var(--primary);font-weight:600;">GH₵${p.price}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}