// src/pages/SettingsPage.js
import React, { useState, useEffect } from 'react';
import { showSuccessToast, showErrorToast, showWarnToast } from '../utils/toast';
import AppPreferences from '../components/settings/AppPreferences';

export default function SettingsPage({ isOpen, onClose, initialSettings = {}, onSave }) {
    const [timezone, setTimezone] = useState('UTC');
    const [darkMode, setDarkMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Prefill from initialSettings on open
    useEffect(() => {
        if (initialSettings) {
            setTimezone(initialSettings.timezone || 'UTC');
            setDarkMode(!!initialSettings.darkMode);
        }
    }, [initialSettings, isOpen]);

    if (!isOpen) return null; // Don't render modal if closed

    const handleSubmit = async () => {
        if (!timezone) {
            showWarnToast('Please select a timezone.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate saving delay or replace with real API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Callback to parent with new settings
            onSave?.({ timezone, darkMode });

            showSuccessToast('Settings saved successfully!');
            onClose();
        } catch (error) {
            console.error(error);
            showErrorToast('Failed to save settings.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full">
                {/* Modal Title */}
                <h2 className="text-xl font-semibold text-[#0f1e40] mb-6">Settings</h2>

                {/* Preferences Form */}
                <AppPreferences
                    timezone={timezone}
                    setTimezone={setTimezone}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    disabled={isSubmitting}
                />

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="w-[100px] h-[38px] border border-[#0f1e40] bg-white text-[#0f1e40] rounded-md text-sm font-medium focus:ring-2 focus:ring-[#0f1e40] focus:outline-none transition duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-[100px] h-[38px] rounded-md text-sm font-medium text-white transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#081A4B] hover:bg-[#061533]'
                            }`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
