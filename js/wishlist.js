// Wishlist management with localStorage
const WISHLIST_KEY = 'efya_wishlist';

// Get wishlist items
function getWishlist() {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing wishlist:', e);
        }
    }
    return [];
}

// Save wishlist
function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

// Add to wishlist
function addToWishlist(productId) {
    const wishlist = getWishlist();
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        saveWishlist(wishlist);
        showToast('Added to wishlist! ❤️', 'success');
        return true;
    }
    showToast('Already in wishlist', 'warning');
    return false;
}

// Remove from wishlist
function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlist(wishlist);
    showToast('Removed from wishlist', 'success');
    return wishlist;
}

// Toggle wishlist
function toggleWishlist(productId) {
    const wishlist = getWishlist();
    if (wishlist.includes(productId)) {
        return removeFromWishlist(productId);
    } else {
        return addToWishlist(productId);
    }
}

// Check if product is in wishlist
function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.includes(productId);
}

// Get wishlist products
function getWishlistProducts() {
    const wishlist = getWishlist();
    const products = getProducts();
    return products.filter(p => wishlist.includes(p.id));
}

// Get wishlist count
function getWishlistCount() {
    return getWishlist().length;
}

// Clear wishlist
function clearWishlist() {
    localStorage.removeItem(WISHLIST_KEY);
    showToast('Wishlist cleared', 'success');
}

// Render wishlist items
function renderWishlist(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const products = getWishlistProducts();
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px 0;">
                <i class="far fa-heart" style="font-size:4rem;color:#ddd;display:block;margin-bottom:20px;"></i>
                <h3>Your wishlist is empty</h3>
                <p style="color:#999;">Save your favorite items here</p>
                <a href="shop.html" class="btn" style="margin-top:15px;display:inline-block;">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:25px;">
            ${products.map(p => `
                <div class="product-card" style="position:relative;">
                    <button onclick="removeFromWishlist('${p.id}')" style="position:absolute;top:15px;right:15px;background:white;border:none;border-radius:50%;width:35px;height:35px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.1);color:#dc3545;font-size:1.2rem;z-index:10;">
                        <i class="fas fa-heart"></i>
                    </button>
                    <img src="${p.image || 'https://via.placeholder.com/300x300/0f3460/ffffff?text='+p.name}" alt="${p.name}" style="width:100%;height:280px;object-fit:cover;">
                    <div style="padding:20px;">
                        <h3 style="font-size:1rem;">${p.name}</h3>
                        <p style="color:#999;font-size:0.8rem;">${p.code}</p>
                        <p style="color:var(--primary);font-weight:700;font-size:1.2rem;">GH₵${p.price}</p>
                        <button class="btn" onclick="addToCart('${p.id}')" style="width:100%;margin-top:10px;">Add to Cart</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}