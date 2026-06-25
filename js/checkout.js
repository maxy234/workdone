// Checkout page specific functions

// Validate checkout form
function validateCheckoutForm(formData) {
    const errors = [];
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
        errors.push('Please enter your full name');
    }
    
    if (!formData.phone || formData.phone.trim().length < 8) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!formData.location || formData.location.trim().length < 3) {
        errors.push('Please enter your delivery location');
    }
    
    return errors;
}

// Calculate delivery fee based on location
function calculateDeliveryFee(location) {
    const zones = {
        'accra': 15,
        'tema': 20,
        'kumasi': 30,
        'takoradi': 35,
        'cape coast': 35,
        'sunyani': 40,
        'tamale': 50,
        'other': 45
    };
    
    const normalized = location.toLowerCase().trim();
    for (const [key, fee] of Object.entries(zones)) {
        if (normalized.includes(key)) {
            return fee;
        }
    }
    return zones.other;
}

// Generate order summary HTML
function generateOrderSummary(cart, products) {
    if (!cart || cart.length === 0) {
        return `
            <div style="text-align:center;padding:40px 0;">
                <i class="fas fa-shopping-cart" style="font-size:3rem;color:#ddd;display:block;margin-bottom:15px;"></i>
                <p style="color:#999;">Your cart is empty</p>
                <a href="shop.html" class="btn" style="margin-top:15px;display:inline-block;">Continue Shopping</a>
            </div>
        `;
    }
    
    let subtotal = 0;
    let itemsHtml = '';
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            itemsHtml += `
                <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <div>
                        <strong>${product.name}</strong>
                        <div style="font-size:0.85rem;color:#999;">x${item.quantity} | ${item.size || 'M'} | ${item.color || 'Black'}</div>
                    </div>
                    <div style="font-weight:600;">GH₵${itemTotal}</div>
                </div>
            `;
        }
    });
    
    const deliveryFee = 20;
    const total = subtotal + deliveryFee;
    
    return `
        <h3 style="margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #f0f0f0;">Order Summary</h3>
        ${itemsHtml}
        <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f0f0f0;">
            <span style="color:#666;">Subtotal</span>
            <span>GH₵${subtotal}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f0f0f0;">
            <span style="color:#666;">Delivery Fee</span>
            <span>GH₵${deliveryFee}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:15px 0;font-size:1.3rem;font-weight:700;color:var(--primary);">
            <span>Total</span>
            <span>GH₵${total}</span>
        </div>
        <div style="margin-top:15px;padding:15px;background:#f8f6f3;border-radius:10px;font-size:0.9rem;color:#666;">
            <i class="fas fa-info-circle" style="color:var(--gold);"></i>
            Delivery within 24-48 hours. You will receive a confirmation via WhatsApp.
        </div>
    `;
}

// Process checkout and create order
function processCheckout(formData) {
    const cart = getCart();
    const products = getProducts();
    
    if (cart.length === 0) {
        return { success: false, message: 'Your cart is empty' };
    }
    
    // Calculate totals
    let subtotal = 0;
    const orderItems = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            return {
                ...item,
                name: product.name,
                code: product.code,
                price: product.price,
                total: itemTotal
            };
        }
        return null;
    }).filter(item => item !== null);
    
    const deliveryFee = 20;
    const total = subtotal + deliveryFee;
    
    // Create order object
    const order = {
        id: 'EFYA-' + Date.now(),
        orderNumber: generateOrderNumber(),
        customer: formData.fullName.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        notes: formData.notes ? formData.notes.trim() : '',
        items: orderItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        date: new Date().toLocaleString(),
        status: 'Pending',
        timestamp: Date.now()
    };
    
    // Save order
    saveOrder(order);
    
    // Reduce stock
    orderItems.forEach(item => {
        updateStock(item.id, -item.quantity);
    });
    
    // Clear cart
    clearCart();
    
    return { success: true, order: order };
}

// Save order to localStorage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('efya_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('efya_orders', JSON.stringify(orders));
}

// Generate order number
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `EFYA${year}${month}${day}${random}`;
}

// Send order confirmation via WhatsApp
function sendOrderConfirmation(order) {
    const message = buildOrderMessage(order);
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

// Build order message for WhatsApp
function buildOrderMessage(order) {
    let message = '🛍️ EFYA PAPABI COLLECTIONS - ORDER CONFIRMATION\n\n';
    message += `📋 Order Number: ${order.orderNumber}\n`;
    message += `👤 Customer: ${order.customer}\n`;
    message += `📱 Phone: ${order.phone}\n`;
    message += `📍 Location: ${order.location}\n`;
    if (order.notes) {
        message += `📝 Notes: ${order.notes}\n`;
    }
    message += `📅 Date: ${order.date}\n\n`;
    message += '━═━═━═━═━═━═━═━\n\n';
    message += '🛒 ITEMS ORDERED:\n\n';
    
    order.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   📦 Code: ${item.code}\n`;
        message += `   🔢 Qty: ${item.quantity}\n`;
        message += `   💰 Price: GH₵${item.price}\n`;
        message += `   📐 Size: ${item.size || 'M'} | 🎨 Color: ${item.color || 'Black'}\n`;
        message += `   ────────────────\n`;
    });
    
    message += '\n━═━═━═━═━═━═━═━\n\n';
    message += `💰 Subtotal: GH₵${order.subtotal}\n`;
    message += `🚚 Delivery Fee: GH₵${order.deliveryFee}\n`;
    message += `💳 TOTAL: GH₵${order.total}\n\n`;
    message += '━═━═━═━═━═━═━═━\n\n';
    message += '✅ Thank you for your order!\n';
    message += '📞 For inquiries, call us on 0544527889\n';
    message += '📍 Accra - Madina, Ghana\n';
    message += '🌐 EFYA PAPABI COLLECTIONS';
    
    return message;
}

// Auto-fill checkout form with saved user data
function loadSavedUserData() {
    const saved = JSON.parse(localStorage.getItem('efya_user_data') || '{}');
    return saved;
}

// Save user data for future checkouts
function saveUserData(data) {
    localStorage.setItem('efya_user_data', JSON.stringify(data));
}

// Estimate delivery time
function estimateDeliveryTime(location) {
    const zones = {
        'accra': 'Same day (if ordered before 12pm)',
        'tema': 'Next day',
        'kumasi': '2-3 days',
        'takoradi': '2-3 days',
        'cape coast': '2-3 days',
        'sunyani': '3-4 days',
        'tamale': '4-5 days'
    };
    
    const normalized = location.toLowerCase().trim();
    for (const [key, time] of Object.entries(zones)) {
        if (normalized.includes(key)) {
            return time;
        }
    }
    return '3-5 days';
}

// Check if customer qualifies for free delivery
function qualifiesForFreeDelivery(subtotal) {
    return subtotal >= 500;
}

// Apply promo code (mock function)
function applyPromoCode(code, subtotal) {
    const promos = {
        'EFYA10': 0.10,
        'EFYA20': 0.20,
        'EFYA30': 0.30
    };
    
    if (promos[code]) {
        const discount = subtotal * promos[code];
        return {
            valid: true,
            discount: discount,
            message: `✅ Promo code applied! You saved GH₵${discount}`
        };
    }
    
    return {
        valid: false,
        discount: 0,
        message: '❌ Invalid promo code'
    };
}