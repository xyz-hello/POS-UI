import React from "react";

export default function CartItem({ item }) {
    return (
        <li className="flex justify-between items-center text-sm">
            <span>
                {item.name} <span className="text-gray-500">x{item.qty}</span>
            </span>
            <span className="font-medium">₱{item.price * item.qty}</span>
        </li>
    );
}
