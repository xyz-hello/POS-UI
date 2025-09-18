// src/components/CommonComponents/EmptyState.js
import React from "react";

export default function EmptyState({ icon: Icon, message, onRetry, size = "default" }) {
    if (size === "small") {
        return (
            <p className="text-center text-neutralGray text-sm mt-2 flex items-center justify-center gap-1">
                {Icon && <Icon size={16} />} {message}
            </p>
        );
    }

    return (
        <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
            {/* Icon */}
            {Icon && <Icon className="w-20 h-20 mb-3 text-gray-400" />}

            {/* Message */}
            <p className="text-lg mb-4 text-center">{message}</p>

            {/* Retry button (optional) */}
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
