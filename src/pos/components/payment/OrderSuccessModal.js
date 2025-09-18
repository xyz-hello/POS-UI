// src/components/POS/payment/OrderSuccessModal.js
import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessModal({ isOpen, onClose, orderNumber }) {
    const [show, setShow] = useState(false);

    // Animate modal appearance
    useEffect(() => {
        if (isOpen) {
            setShow(true); // Start animation
        } else {
            setShow(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        // Overlay background
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            {/* Modal container with fade-in/scale animation */}
            <div
                className={`bg-white rounded-xl w-96 p-6 flex flex-col items-center shadow-lg transform transition-all duration-300 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
            >
                {/* Success Icon */}
                <CheckCircle size={48} className="text-green-500 mb-4 animate-bounce" />

                {/* Title */}
                <h3 className="text-xl font-bold text-neutralDark mb-2 text-center">
                    Order Created!
                </h3>

                {/* Order number and success message */}
                <p className="text-sm text-neutralGray mb-6 text-center">
                    Order <span className="font-semibold">{orderNumber}</span> created successfully.
                </p>

                {/* Close button */}
                <button
                    onClick={onClose} // Close modal
                    className="bg-brandGreen hover:bg-brandGreenDark text-white font-semibold px-6 py-2 rounded-md text-center transition-colors duration-200"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
