// Orders management functions

// Get all orders
function getAllOrders() {
    return JSON.parse(localStorage.getItem('efya_orders') || '[]');
}

// Get order by ID
function getOrderById(orderId) {
    const orders = getAllOrders();
    return orders.find(o => o.id === orderId || o.orderNumber === orderId);
}

// Update order status
function updateOrderStatus(orderId, status) {
    const orders = getAllOrders();
    const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('efya_orders', JSON.stringify(orders));
        return order;
    }
    return null;
}

// Delete order
function deleteOrder(orderId) {
    let orders = getAllOrders();
    orders = orders.filter(o => o.id !== orderId && o.orderNumber !== orderId);
    localStorage.setItem('efya_orders', JSON.stringify(orders));
    return orders;
}

// Get orders by customer
function getOrdersByCustomer(customerName) {
    const orders = getAllOrders();
    return orders.filter(o => 
        o.customer.toLowerCase().includes(customerName.toLowerCase())
    );
}

// Get orders by date range
function getOrdersByDateRange(startDate, endDate) {
    const orders = getAllOrders();
    return orders.filter(o => {
        const orderDate = new Date(o.timestamp || o.date);
        return orderDate >= startDate && orderDate <= endDate;
    });
}

// Get orders by status
function getOrdersByStatus(status) {
    const orders = getAllOrders();
    return orders.filter(o => o.status === status);
}

// Get today's orders
function getTodayOrders() {
    const orders = getAllOrders();
    const today = new Date().toDateString();
    return orders.filter(o => {
        const orderDate = new Date(o.timestamp || o.date);
        return orderDate.toDateString() === today;
    });
}

// Get monthly orders
function getMonthlyOrders(month, year) {
    const orders = getAllOrders();
    return orders.filter(o => {
        const date = new Date(o.timestamp || o.date);
        return date.getMonth() === month && date.getFullYear() === year;
    });
}

// Calculate order statistics
function calculateOrderStats(orders) {
    const totalOrders = orders.length;
    let totalRevenue = 0;
    let totalItems = 0;
    const statusCounts = {};
    const dailyData = {};
    
    orders.forEach(o => {
        totalRevenue += o.total || 0;
        totalItems += o.items ? o.items.length : 0;
        
        const status = o.status || 'Pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        
        const date = new Date(o.timestamp || o.date);
        const day = date.toDateString();
        dailyData[day] = (dailyData[day] || 0) + 1;
    });
    
    return {
        totalOrders,
        totalRevenue,
        totalItems,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        statusCounts,
        dailyData,
        pendingOrders: statusCounts['Pending'] || 0,
        completedOrders: statusCounts['Completed'] || 0,
        cancelledOrders: statusCounts['Cancelled'] || 0
    };
}

// Export orders to CSV
function exportOrdersToCSV(orders = null) {
    const data = orders || getAllOrders();
    if (data.length === 0) {
        showToast('No orders to export', 'error');
        return;
    }
    
    const headers = ['Order Number', 'Customer', 'Phone', 'Location', 'Items', 'Subtotal', 'Delivery', 'Total', 'Status', 'Date'];
    const rows = data.map(o => [
        o.orderNumber || o.id,
        o.customer,
        o.phone,
        o.location,
        o.items ? o.items.length : 0,
        o.subtotal || 0,
        o.deliveryFee || 20,
        o.total || 0,
        o.status || 'Pending',
        o.date
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Print order receipt
function printOrderReceipt(order) {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    const products = getProducts();
    
    let itemsHtml = '';
    order.items.forEach((item, index) => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            itemsHtml += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${item.quantity}</td>
                    <td>GH₵${product.price}</td>
                    <td>GH₵${product.price * item.quantity}</td>
                </tr>
            `;
        }
    });
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order Receipt - ${order.orderNumber}</title>
            <style>
                body { font-family: 'Inter', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                .header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { color: #0f3460; font-size: 2rem; }
                .header h1 span { color: #d4af37; }
                .header p { color: #666; }
                .order-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; }
                .order-info .label { font-weight: 600; color: #333; }
                .order-info .value { color: #666; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th { background: #f8f6f3; padding: 12px; text-align: left; font-weight: 600; }
                td { padding: 12px; border-bottom: 1px solid #f0f0f0; }
                .totals { margin-top: 30px; border-top: 2px solid #f0f0f0; padding-top: 20px; }
                .totals .row { display: flex; justify-content: space-between; padding: 8px 0; }
                .totals .grand-total { font-size: 1.3rem; font-weight: 700; color: #0f3460; }
                .footer { margin-top: 40px; text-align: center; color: #999; font-size: 0.9rem; border-top: 1px solid #eee; padding-top: 20px; }
                .status { display: inline-block; padding: 5px 15px; border-radius: 50px; font-size: 0.85rem; font-weight: 600; }
                .status-pending { background: #fff3cd; color: #856404; }
                .status-completed { background: #d4edda; color: #155724; }
                .status-cancelled { background: #f8d7da; color: #721c24; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>EFYA <span>PAPABI</span></h1>
                <p>COLLECTIONS - ORDER RECEIPT</p>
                <p style="font-size:0.85rem;">Accra - Madina | 0544527889</p>
            </div>
            
            <div class="order-info">
                <div><span class="label">Order Number:</span> <span class="value">${order.orderNumber || order.id}</span></div>
                <div><span class="label">Status:</span> <span class="status status-${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span></div>
                <div><span class="label">Customer:</span> <span class="value">${order.customer}</span></div>
                <div><span class="label">Phone:</span> <span class="value">${order.phone}</span></div>
                <div><span class="label">Location:</span> <span class="value">${order.location}</span></div>
                <div><span class="label">Date:</span> <span class="value">${order.date}</span></div>
                ${order.notes ? `<div style="grid-column: 1/-1;"><span class="label">Notes:</span> <span class="value">${order.notes}</span></div>` : ''}
            </div>
            
            <h3>Items Ordered</h3>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div class="totals">
                <div class="row"><span>Subtotal</span><span>GH₵${order.subtotal}</span></div>
                <div class="row"><span>Delivery Fee</span><span>GH₵${order.deliveryFee || 20}</span></div>
                <div class="row grand-total"><span>Total</span><span>GH₵${order.total}</span></div>
            </div>
            
            <div class="footer">
                <p>Thank you for shopping with EFYA PAPABI COLLECTIONS</p>
                <p>📍 Accra - Madina | 📞 0544527889 | 🚚 Nationwide Delivery</p>
                <p style="font-size:0.8rem;margin-top:10px;">This is a computer-generated receipt. No signature required.</p>
            </div>
            
            <div style="text-align:center;margin-top:20px;" class="no-print">
                <button onclick="window.print()" style="padding:10px 30px;background:#0f3460;color:white;border:none;border-radius:50px;cursor:pointer;font-weight:600;">Print Receipt</button>
                <button onclick="window.close()" style="padding:10px 30px;background:#dc3545;color:white;border:none;border-radius:50px;cursor:pointer;font-weight:600;margin-left:10px;">Close</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Get weekly order summary
function getWeeklySummary() {
    const orders = getAllOrders();
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekOrders = orders.filter(o => {
        const date = new Date(o.timestamp || o.date);
        return date >= weekAgo;
    });
    
    const dailyData = {};
    for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toDateString();
        dailyData[key] = { orders: 0, revenue: 0 };
    }
    
    weekOrders.forEach(o => {
        const date = new Date(o.timestamp || o.date);
        const key = date.toDateString();
        if (dailyData[key]) {
            dailyData[key].orders++;
            dailyData[key].revenue += o.total || 0;
        }
    });
    
    return {
        totalOrders: weekOrders.length,
        totalRevenue: weekOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        dailyData: dailyData
    };
}