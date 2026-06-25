// WhatsApp integration functions
const WHATSAPP_NUMBER = '233544527889';

// Send order to WhatsApp
function sendOrderToWhatsApp(order) {
    const products = getProducts();
    let message = 'EFYA PAPABI COLLECTIONS ORDER\n\n';
    message += `Order Number: ${order.id}\n`;
    message += `Customer Name: ${order.customer}\n`;
    message += `Phone: ${order.phone}\n`;
    message += `Location: ${order.location}\n`;
    if (order.notes) message += `Notes: ${order.notes}\n`;
    message += '\nItems Ordered:\n';
    
    order.items.forEach((item, index) => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            message += `${index+1}. ${product.name}\n`;
            message += `   Code: ${product.code}\n`;
            message += `   Qty: ${item.quantity}\n`;
            message += `   Price: GH₵${product.price}\n`;
            message += `   Size: ${item.size || 'M'} | Color: ${item.color || 'Black'}\n\n`;
        }
    });
    
    message += `Total: GH₵${order.total}`;
    
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

// Send cart to WhatsApp
function sendCartToWhatsApp() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Cart is empty', 'error');
        return null;
    }
    
    const products = getProducts();
    const order = {
        id: 'EFYA-' + Date.now(),
        customer: 'Customer',
        phone: '0240000000',
        location: 'Delivery Location',
        notes: '',
        items: cart,
        total: getCartTotal() + 20
    };
    
    return sendOrderToWhatsApp(order);
}

// Send product inquiry to WhatsApp
function sendProductInquiry(productId) {
    const product = getProductById(productId);
    if (!product) {
        showToast('Product not found', 'error');
        return null;
    }
    
    const message = `EFYA PAPABI PRODUCT INQUIRY\n\n`;
    message += `Product: ${product.name}\n`;
    message += `Code: ${product.code}\n`;
    message += `Price: GH₵${product.price}\n`;
    message += `Category: ${product.category}\n`;
    message += `\nI would like to know more about this product.`;
    
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

// Send general inquiry to WhatsApp
function sendGeneralInquiry(name, email, subject, message) {
    const msg = `EFYA PAPABI INQUIRY\n\n`;
    msg += `Name: ${name}\n`;
    msg += `Email: ${email}\n`;
    msg += `Subject: ${subject}\n`;
    msg += `Message: ${message}`;
    
    const encoded = encodeURIComponent(msg);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

// Open WhatsApp chat
function openWhatsApp(message) {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
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