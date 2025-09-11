import {
    ShoppingCart,
    User,
    ListOrdered,
    Package,
    BarChart2,
    HelpCircle,
    Settings,
    LogOut,
} from "lucide-react";

// Primary cashier menu (sales-related)
export const primaryMenu = [
    { name: "Sales", icon: ShoppingCart },    // Checkout / POS
    { name: "Order Line", icon: ListOrdered },// Past & on-hold transactions
    { name: "Customers", icon: User },        // Customer lookup
    { name: "Products", icon: Package },      // Quick product/price check
    { name: "Reports", icon: BarChart2 },     // Shift/day sales summary
];

// Secondary utilities (tools)
export const secondaryMenu = [
    { name: "Help Center", icon: HelpCircle },
    { name: "Settings", icon: Settings },
    { name: "Logout", icon: LogOut },
];
