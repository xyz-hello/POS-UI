// Utility function to filter products by search and category
export const filterProducts = (products, search, category) => {
    return products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "All" || product.category === category;
        return matchesSearch && matchesCategory;
    });
};
