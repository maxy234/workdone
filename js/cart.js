// Cart management with localStorage
const CART_KEY = 'efya_cart';

// Get cart items
function getCart() {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing cart:', e);
        }
    }
    return [];
}

// Save cart
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add item to cart
function addToCart(productId, quantity = 1, size = 'M', color = 'Black') {
    const cart = getCart();
    const existing = cart.find(item => item.id === productId && item.size === size && item.color === color);
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity, size, color });
    }
    
    saveCart(cart);
    updateCartCount();
    return cart;
}

// Remove item from cart
function removeFromCart(productId, size = null, color = null) {
    let cart = getCart();
    if (size && color) {
        cart = cart.filter(item => !(item.id === productId && item.size === size && item.color === color));
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    saveCart(cart);
    updateCartCount();
    return cart;
}

// Update item quantity
function updateCartItemQuantity(productId, quantity, size = null, color = null) {
    const cart = getCart();
    const item = cart.find(i => {
        if (size && color) {
            return i.id === productId && i.size === size && i.color === color;
        }
        return i.id === productId;
    });
    
    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId, size, color);
        }
        item.quantity = quantity;
        saveCart(cart);
        updateCartCount();
        return cart;
    }
    return cart;
}

// Clear cart
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    const products = getProducts();
    let total = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            total += product.price * item.quantity;
        }
    });
    return total;
}

// Get cart item count
function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Update cart count display
function updateCartCount() {
    const count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Check if product is in cart
function isInCart(productId) {
    const cart = getCart();
    return cart.some(item => item.id === productId);
}

// Get cart item by product
function getCartItem(productId) {
    const cart = getCart();
    return cart.find(item => item.id === productId);
}

// Merge carts (for future use)
function mergeCart(externalCart) {
    const currentCart = getCart();
    externalCart.forEach(externalItem => {
        const existing = currentCart.find(item => 
            item.id === externalItem.id && 
            item.size === externalItem.size && 
            item.color === externalItem.color
        );
        if (existing) {
            existing.quantity += externalItem.quantity;
        } else {
            currentCart.push(externalItem);
        }
    });
    saveCart(currentCart);
    updateCartCount();
    return currentCart;
}