// Formats any number into PHP currency format (₱x,xxx.xx)

export const formatPrice = (amount) => {
    if (isNaN(amount)) return "₱0.00"; // fallback for invalid numbers

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(amount);
};
