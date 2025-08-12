import React from 'react';

const TIMEZONES = ['UTC', 'GMT+1', 'GMT-5'];

export default function AppPreferences({ timezone, setTimezone, darkMode, setDarkMode, disabled }) {
    return (
        <>
            {/* Timezone selector */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[#0f1e40] mb-1">Timezone</label>
                <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    disabled={disabled}
                    className="w-full px-4 py-2 border border-[#0f1e40] rounded-md bg-white text-[#0f1e40] focus:ring-2 focus:ring-[#0f1e40] focus:outline-none"
                >
                    <option value="">Select timezone</option>
                    {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                            {tz}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dark mode toggle */}
            <div className="mb-4 flex items-center gap-4">
                <label className="text-sm font-medium text-[#0f1e40]">Dark Mode</label>
                <button
                    onClick={() => setDarkMode(false)}
                    disabled={disabled}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${!darkMode ? 'bg-[#081A4B] text-white' : 'bg-gray-200 text-[#0f1e40]'
                        }`}
                >
                    Off
                </button>
                <button
                    onClick={() => setDarkMode(true)}
                    disabled={disabled}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${darkMode ? 'bg-[#081A4B] text-white' : 'bg-gray-200 text-[#0f1e40]'
                        }`}
                >
                    On
                </button>
            </div>
        </>
    );
}
