import React from "react";
import { XCircle } from "lucide-react";

export default function OrderFailedModal({ isOpen, onClose, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-xl w-96 p-6 flex flex-col items-center shadow-lg text-center">

                {/* Error Icon */}
                <XCircle size={48} className="text-red-500 mb-4" />

                {/* Title */}
                <h3 className="text-xl font-bold text-neutralDark mb-2">Order Failed</h3>

                {/* Error message */}
                <p className="text-sm text-neutralGray mb-6">
                    {message || "Failed to process order. Please try again."}
                </p>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
