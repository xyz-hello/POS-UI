import React from "react";

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        // Fullscreen overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {/* Modal box */}
            <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
                {/* Title */}
                <h2 className="text-lg font-semibold mb-2">{title}</h2>

                {/* Message */}
                <p className="text-gray-600 mb-4">{message}</p>

                {/* Action buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
