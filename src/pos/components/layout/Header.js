import React from "react";
import { MagnifyingGlassCircleIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Header() {
    const user = JSON.parse(localStorage.getItem("user"));
    const displayName = user?.username || "User";

    return (
        <header className="w-full flex justify-between items-center p-4 sm:p-5 bg-neutralCard border-b border-neutralBorder fixed top-0 left-0 z-50 h-16">

            {/* Logo / Store Name on the left */}
            <div className="flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl font-paypayan text-neutralDark">
                    Paypayan
                </h1>
            </div>

            {/* Search centered */}
            <div className="flex-1 flex justify-center mt-3 sm:mt-0">
                <div className="w-full max-w-xl relative px-4 sm:px-0">
                    <MagnifyingGlassCircleIcon
                        className="w-5 h-5 text-neutralGray absolute left-3 top-1/2 -translate-y-1/2"
                    />
                    <input
                        type="text"
                        placeholder="Search menu, orders and more"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutralBorder focus:outline-none focus:ring-2 focus:ring-brandGreen"
                    />
                </div>
            </div>

            {/* Notifications & User on the right */}
            <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-full hover:bg-brandGreenLight/30 transition">
                    {/* Optional bell icon */}
                </button>

                <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-brandGreenLight/30 transition">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neutralLight border-2 border-neutralBorder">
                        <UserIcon className="w-5 h-5 text-neutralGray" />
                    </div>
                    <span className="text-neutralDark font-medium truncate max-w-[100px]">
                        {displayName}
                    </span>
                </div>
            </div>
        </header>
    );
}
