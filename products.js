// Product data management with localStorage
const PRODUCTS_KEY = 'efya_products';
const DEFAULT_PRODUCTS = [
    {
        id: 'prod-1',
        name: 'Classic Leather Shoes',
        code: 'EPC-SHO-001',
        category: 'shoes',
        price: 150,
        stock: 25,
        description: 'Premium leather shoes perfect for any occasion. Features include cushioned insole and durable rubber sole.',
        image: 'https://via.placeholder.com/300x300/0f3460/ffffff?text=Classic+Shoes',
        sizes: ['38', '39', '40', '41', '42', '43'],
        colors: ['Black', 'Brown', 'Tan'],
        badge: 'Best Seller',
        rating: 4.8,
        reviews: 127
    },
    {
        id: 'prod-2',
        name: 'Designer Handbag',
        code: 'EPC-BAG-001',
        category: 'bags',
        price: 250,
        stock: 15,
        description: 'Elegant handbag made from premium materials. Spacious interior with multiple compartments.',
        image: 'https://via.placeholder.com/300x300/0f3460/ffffff?text=Handbag',
        sizes: ['One Size'],
        colors: ['Black', 'Gold', 'Red'],
        badge: 'New',
        rating: 4.9,
        reviews: 89
    },
    {
        id: 'prod-3',
        name: 'Elegant Evening Dress',
        code: 'EPC-DRS-001',
        category: 'dresses',
        price: 180,
        stock: 10,
        description: 'Stunning evening dress perfect for special occasions. Flowing fabric with elegant design.',
        image: 'https://via.placeholder.com/300x300/0f3460/ffffff?text=Dress',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'Black', 'Navy'],
        badge: 'Sale',
        rating: 4.7,
        reviews: 156
    },
    {
        id: 'prod-4',
        name: 'Comfort Night Wear',
        code: 'EPC-NWT-001',
        category: 'nightwear',
        price: 80,
        stock: 30,
        description: 'Ultra-comfortable night wear made from soft cotton blend. Perfect for a good night\'s sleep.',
        image: 'https://via.placeholder.com/300x300/0f3460/ffffff?text=Night+Wear',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Pink', 'Blue', 'Grey'],
        badge: 'Popular',
        rating: 4.6,
        reviews: 92
    },
    {
        id: 'prod-5',
        name: 'Casual Shirt',
        code: 'EPC-SHT-001',
        category: 'shirts',
        price: 120,
        stock: 20,
        description: 'Stylish casual shirt perfect for everyday wear. Made from high-quality breathable fabric.',
        image: 'https://via.placeholder.com/300x300/0f3460/ffffff?text=Shirt',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Blue', 'Black'],
        badge: 'Trending',
        rating: 4.5,
        reviews: 78
    },
    {
        id: 'prod-6',
        name: 'Comfort Slippers',
        code: 'EPC-SLP-001',
        category: 'slippers',
        price: 60,
        stock: 35,
        description: 'Comfortable slippers for indoor and outdoor use. Soft cushioning and durable sole.',
        image: 'https://via.placeholder.com/300x300/0f3460/ffffff?text=Slippers',
        sizes: ['37', '38', '39', '40', '41'],
        colors: ['Black', 'Brown', 'Grey'],
        badge: 'Bestseller',
        rating: 4.4,
        reviews: 203
    }
];

// Get all products
function getProducts() {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
        try {
            const products = JSON.parse(stored);
            if (products && products.length > 0) {
                return products;
            }
        } catch (e) {
            console.error('Error parsing products:', e);
        }
    }
    // Initialize with default products
    saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
}

// Save products
function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// Get product by ID
function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === id);
}

// Get products by category
function getProductsByCategory(category) {
    const products = getProducts();
    return products.filter(p => p.category === category);
}

// Search products
function searchProducts(query) {
    const products = getProducts();
    const q = query.toLowerCase().trim();
    return products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.code.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
}

// Generate product code
function generateProductCode(category) {
    const prefix = category.substring(0, 3).toUpperCase();
    const products = getProducts();
    const count = products.filter(p => p.category === category).length + 1;
    return `EPC-${prefix}-${String(count).padStart(3, '0')}`;
}

// Add new product
function addProduct(product) {
    const products = getProducts();
    const newProduct = {
        ...product,
        id: 'prod-' + Date.now(),
        code: generateProductCode(product.category),
        rating: product.rating || 0,
        reviews: product.reviews || 0
    };
    products.push(newProduct);
    saveProducts(products);
    return newProduct;
}

// Update product
function updateProduct(id, updates) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
        products[index] = { ...products[index], ...updates };
        saveProducts(products);
        return products[index];
    }
    return null;
}

// Delete product
function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
}

// Get low stock products
function getLowStockProducts(threshold = 10) {
    const products = getProducts();
    return products.filter(p => (p.stock || 0) < threshold);
}

// Update stock
function updateStock(id, quantity) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
        product.stock = Math.max(0, (product.stock || 0) + quantity);
        saveProducts(products);
        return product;
    }
    return null;
}