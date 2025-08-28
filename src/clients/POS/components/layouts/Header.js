import React from "react";
import { MagnifyingGlassCircleIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Header() {
    const user = JSON.parse(localStorage.getItem("user"));
    const displayName = user?.username || "User";

    return (
        <header className="w-full flex justify-between items-center p-4 sm:p-5 bg-neutralCard border-b border-neutralBorder fixed top-0 left-0 z-50 h-16">

            {/* Search */}
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

            {/* Notifications & User */}
            <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-full hover:bg-brandGreenLight/30 transition">
                    {/* <BellIcon className="w-6 h-6 text-neutralDark" /> */}
                    {/* <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span> */}
                </button>

                <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-brandGreenLight/30 transition">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-neutralLight border-2 border-neutralBorder">
                        <UserIcon className="w-5 h-5 text-neutralGray" />
                    </div>
                    <span className="text-neutralDark font-medium truncate max-w-[100px]">{displayName}</span>
                </div>
            </div>
        </header>
    );
}
