// Advanced search functionality

// Search options
const SEARCH_OPTIONS = {
    EXACT: 'exact',
    CONTAINS: 'contains',
    STARTS_WITH: 'starts_with',
    ENDS_WITH: 'ends_with'
};

// Perform search
function performSearch(query, options = {}) {
    const products = getProducts();
    const q = query.toLowerCase().trim();
    
    if (!q) return products;
    
    const {
        categories = [],
        minPrice = 0,
        maxPrice = Infinity,
        sortBy = 'relevance',
        searchMode = SEARCH_OPTIONS.CONTAINS
    } = options;
    
    let results = products.filter(p => {
        // Text search
        let matches = false;
        const searchFields = [p.name, p.code, p.category, p.description].join(' ').toLowerCase();
        
        switch (searchMode) {
            case SEARCH_OPTIONS.EXACT:
                matches = searchFields === q;
                break;
            case SEARCH_OPTIONS.STARTS_WITH:
                matches = searchFields.startsWith(q);
                break;
            case SEARCH_OPTIONS.ENDS_WITH:
                matches = searchFields.endsWith(q);
                break;
            default:
                matches = searchFields.includes(q);
        }
        
        // Category filter
        if (categories.length > 0 && !categories.includes(p.category)) {
            matches = false;
        }
        
        // Price filter
        if (p.price < minPrice || p.price > maxPrice) {
            matches = false;
        }
        
        return matches;
    });
    
    // Sort results
    switch (sortBy) {
        case 'price_asc':
            results.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            results.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'relevance':
        default:
            // Score by relevance (simple implementation)
            results = results.map(p => {
                let score = 0;
                const searchStr = (p.name + ' ' + p.code + ' ' + p.category).toLowerCase();
                if (searchStr.includes(q)) score += 10;
                if (p.name.toLowerCase().includes(q)) score += 5;
                if (p.code.toLowerCase().includes(q)) score += 3;
                if (p.category.toLowerCase().includes(q)) score += 2;
                return { ...p, _score: score };
            }).sort((a, b) => b._score - a._score);
            break;
    }
    
    return results;
}

// Get search suggestions
function getSearchSuggestions(query) {
    const products = getProducts();
    const q = query.toLowerCase().trim();
    
    if (!q) return [];
    
    const suggestions = new Set();
    const maxSuggestions = 5;
    
    products.forEach(p => {
        if (suggestions.size >= maxSuggestions) return;
        
        const name = p.name.toLowerCase();
        if (name.includes(q) && !suggestions.has(p.name)) {
            suggestions.add(p.name);
        }
    });
    
    return Array.from(suggestions);
}

// Highlight search terms in text
function highlightSearchTerms(text, query) {
    const q = query.toLowerCase().trim();
    if (!q) return text;
    
    const regex = new RegExp(`(${q})`, 'gi');
    return text.replace(regex, '<mark style="background:#d4af37;color:white;padding:0 5px;border-radius:3px;">$1</mark>');
}

// Search analytics (track search terms)
function trackSearchTerm(term) {
    let history = JSON.parse(localStorage.getItem('efya_search_history') || '[]');
    history.unshift({
        term: term,
        timestamp: Date.now()
    });
    // Keep last 50 searches
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    localStorage.setItem('efya_search_history', JSON.stringify(history));
}

// Get popular searches
function getPopularSearches() {
    const history = JSON.parse(localStorage.getItem('efya_search_history') || '[]');
    const counts = {};
    history.forEach(h => {
        counts[h.term] = (counts[h.term] || 0) + 1;
    });
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([term]) => term);
}

// Clear search history
function clearSearchHistory() {
    localStorage.removeItem('efya_search_history');
}