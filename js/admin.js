// Admin specific functions

// Get sales statistics
function getSalesStats() {
    const orders = JSON.parse(localStorage.getItem('efya_orders') || '[]');
    const products = getProducts();
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalItems = orders.reduce((sum, o) => sum + o.items.length, 0);
    
    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Top selling products
    const productSales = {};
    orders.forEach(o => {
        o.items.forEach(item => {
            const id = item.id;
            if (!productSales[id]) {
                productSales[id] = { quantity: 0, revenue: 0 };
            }
            productSales[id].quantity += item.quantity;
            const product = products.find(p => p.id === id);
            if (product) {
                productSales[id].revenue += product.price * item.quantity;
            }
        });
    });
    
    const topProducts = Object.entries(productSales)
        .map(([id, data]) => {
            const product = products.find(p => p.id === id);
            return {
                id,
                name: product ? product.name : 'Unknown',
                ...data
            };
        })
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
    
    return {
        totalOrders,
        totalRevenue,
        totalItems,
        avgOrderValue,
        topProducts
    };
}

// Get order by ID
function getOrderById(orderId) {
    const orders = JSON.parse(localStorage.getItem('efya_orders') || '[]');
    return orders.find(o => o.id === orderId);
}

// Update order status
function updateOrderStatus(orderId, status) {
    const orders = JSON.parse(localStorage.getItem('efya_orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('efya_orders', JSON.stringify(orders));
        return order;
    }
    return null;
}

// Get orders by date range
function getOrdersByDateRange(startDate, endDate) {
    const orders = JSON.parse(localStorage.getItem('efya_orders') || '[]');
    return orders.filter(o => {
        const orderDate = new Date(o.date);
        return orderDate >= startDate && orderDate <= endDate;
    });
}

// Export orders to CSV
function exportOrdersToCSV() {
    const orders = JSON.parse(localStorage.getItem('efya_orders') || '[]');
    if (orders.length === 0) {
        showToast('No orders to export', 'error');
        return;
    }
    
    const headers = ['Order ID', 'Customer', 'Phone', 'Location', 'Items', 'Total', 'Date', 'Status'];
    const rows = orders.map(o => [
        o.id,
        o.customer,
        o.phone,
        o.location,
        o.items.length,
        o.total,
        o.date,
        o.status || 'Pending'
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Initialize admin dashboard
function initAdminDashboard() {
    const stats = getSalesStats();
    
    // Update stats cards
    document.querySelectorAll('.stat-card .number').forEach((el, index) => {
        const values = [
            stats.totalOrders,
            stats.totalRevenue,
            stats.totalItems,
            Math.round(stats.avgOrderValue)
        ];
        if (index < values.length) {
            el.textContent = index === 1 ? `GH₵${values[index]}` : values[index];
        }
    });
    
    // Update recent orders table
    const orders = JSON.parse(localStorage.getItem('efya_orders') || '[]');
    const recentOrders = orders.slice(0, 5);
    const recentOrdersContainer = document.querySelector('#recentOrders');
    if (recentOrdersContainer) {
        if (recentOrders.length === 0) {
            recentOrdersContainer.innerHTML = '<p style="color:#999;text-align:center;padding:20px;">No orders yet</p>';
        } else {
            recentOrdersContainer.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recentOrders.map(o => `
                            <tr>
                                <td>${o.id}</td>
                                <td>${o.customer}</td>
                                <td>${o.items.length}</td>
                                <td>GH₵${o.total}</td>
                                <td><span class="status-${(o.status || 'pending').toLowerCase()}">${o.status || 'Pending'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    }
    
    // Update low stock alert
    const lowStock = getLowStockProducts(10);
    const lowStockContainer = document.querySelector('#lowStockAlert');
    if (lowStockContainer) {
        if (lowStock.length === 0) {
            lowStockContainer.innerHTML = '<p style="color:#28a745;">✅ All products have sufficient stock</p>';
        } else {
            lowStockContainer.innerHTML = `
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
                    ${lowStock.map(p => `
                        <div style="background:#fff5f5;padding:15px;border-radius:10px;border:1px solid #ffcdd2;">
                            <h4>${p.name}</h4>
                            <p style="color:#dc3545;font-weight:700;">Stock: ${p.stock || 0}</p>
                            <p style="font-size:0.85rem;color:#666;">${p.code}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}