import React from "react";

// Reusable error state component
export default function ErrorState({ icon: Icon, message, onRetry }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-10 text-red-500">
            {Icon && <Icon className="w-20 h-20 mb-3 text-red-400" />}
            <p className="text-lg mb-4">{message || "Something went wrong"}</p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                >
                    Retry
                </button>
            )}
        </div>
    );
}
