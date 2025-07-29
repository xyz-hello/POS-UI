import React from 'react';
import { Dialog } from '@headlessui/react';

// DeleteModal - Confirmation popup used when deleting a customer
const DeleteModal = ({ isOpen, onClose, onConfirm, message }) => {
    return (
        // Main dialog container
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">

                {/* Modal panel */}
                <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">

                    {/* Title: bold with customer name */}
                    <Dialog.Title className="text-lg font-bold text-gray-800 mb-2">
                        Delete {message}
                    </Dialog.Title>

                    {/* Description: regular message */}
                    <Dialog.Description className="text-sm text-gray-600 mb-4">
                        Are you sure you want to delete this?
                    </Dialog.Description>

                    {/* Action buttons */}
                    <div className="flex justify-center gap-3">
                        {/* Cancel button */}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                            No
                        </button>

                        {/* Confirm delete button */}
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Yes
                        </button>
                    </div>

                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default DeleteModal;
