import React from 'react';
import { Dialog } from '@headlessui/react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure you want to delete?',
    message = '',
    confirmText = 'Yes',
    cancelText = 'No',
    type = 'default', // 'logout', 'delete', or 'default'
}) => {
    // Style variants based on type
    const getButtonClasses = () => {
        switch (type) {
            case 'delete':
                return {
                    confirm: 'bg-red-100 text-red-700 hover:bg-red-200',
                    cancel: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                };
            case 'logout':
                return {
                    confirm: 'bg-violet-100 text-violet-700 hover:bg-violet-200',
                    cancel: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                };
            default:
                return {
                    confirm: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
                    cancel: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                };
        }
    };

    const { confirm, cancel } = getButtonClasses();

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
        >
            <div className="w-full max-w-sm px-4">
                <Dialog.Panel className="bg-white rounded-xl shadow-xl p-6 md:p-7 text-center space-y-5">

                    {/* Modal Title */}
                    <Dialog.Title className="text-lg font-semibold text-gray-800">
                        {title}
                    </Dialog.Title>

                    {/* Modal Message */}
                    {message && (
                        <Dialog.Description className="text-sm text-gray-600">
                            {message}
                        </Dialog.Description>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${cancel}`}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${confirm}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ConfirmationModal;