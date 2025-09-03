// Utility to format any number into PHP currency
export const formatPrice = (amount) => {
    if (isNaN(amount)) return "₱0.00"; // fallback for invalid numbers

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Utility to format product price
// If sold by weight → show "₱x.xx/g"
// Else → show standard "₱x.xx"
export const formatProductPrice = (product) => {
    if (product.soldByWeight && product.pricePerGram) {
        return `${formatPrice(product.pricePerGram)}/g`;
    }
    return formatPrice(product.price);
};
