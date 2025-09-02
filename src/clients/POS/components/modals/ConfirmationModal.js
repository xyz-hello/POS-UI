import React, { useRef, useEffect } from "react";

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
    const modalRef = useRef();

    // Close if click is outside the modal box
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onCancel(); // Trigger cancel if clicked outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onCancel]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className="bg-white rounded-xl p-6 w-80 shadow-lg"
            >
                {/* Title */}
                <h2 className="text-lg font-semibold mb-2">{title}</h2>

                {/* Message */}
                <p className="text-gray-600 mb-4">{message}</p>

                {/* Buttons */}
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
