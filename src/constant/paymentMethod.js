// src/constants/paymentMethods.js
export const PAYMENT_METHODS = [
    { key: "cash", label: "Cash" },
    { key: "ewallet", label: "E-Wallet" },
    { key: "scan", label: "Scan" },
];

// Derived map for easy lookup
export const PAYMENT_LABELS = Object.fromEntries(
    PAYMENT_METHODS.map(method => [method.key, method.label])
);
