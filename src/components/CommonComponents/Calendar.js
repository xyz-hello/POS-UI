// filepath: src/components/CommonComponents/Calendar.js
import React, { useState } from "react";

export default function Calendar() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [hoverDate, setHoverDate] = useState(null);
    const [view, setView] = useState("month"); // day, week, month, year

    const today = new Date();
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const isSameDay = (a, b) => a && b && a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

    const isInRange = (date) => {
        if (!startDate) return false;
        if (startDate && !endDate && hoverDate) return date > startDate && date <= hoverDate;
        if (startDate && endDate) return date > startDate && date < endDate;
        return false;
    };

    const handleDateClick = (date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (date < startDate) {
                setEndDate(startDate);
                setStartDate(date);
            } else {
                setEndDate(date);
            }
        }
    };

    const clearSelection = () => {
        setStartDate(null);
        setEndDate(null);
        setHoverDate(null);
    };

    // Month view days
    const selectedDate = startDate || today;
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();

    const monthDays = [];
    for (let i = 0; i < startDay; i++) monthDays.push(null);
    for (let d = 1; d <= endOfMonth.getDate(); d++) monthDays.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d));

    // Week view days
    const weekDays = [];
    if (view === "week") {
        const dayOfWeek = selectedDate.getDay();
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            weekDays.push(date);
        }
    }

    return (
        <div className="w-full max-w-5xl ml-4 md:ml-6 bg-white rounded-lg p-6 flex flex-col gap-4
                shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-2xl font-semibold text-[#1F2937]">
                    {view === "year"
                        ? selectedDate.getFullYear()
                        : `${selectedDate.toLocaleString("default", { month: "long" })} ${selectedDate.getFullYear()}`}
                </h2>

                {/* View switch */}
                <div className="flex gap-2 flex-wrap">
                    {["day", "week", "month", "year"].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200
                ${view === v ? "bg-[#081A4B] text-white" : "bg-gray-100 text-[#081A4B] hover:bg-gray-200"}`}
                        >
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* From / To display */}
            <div className="flex gap-2 mb-2">
                <div className="flex-1 bg-gray-50 border border-gray-300 rounded-md p-2 text-center text-sm font-medium text-[#081A4B]">
                    From: {startDate ? startDate.toLocaleDateString() : "--/--/----"}
                </div>
                <div className="flex-1 bg-gray-50 border border-gray-300 rounded-md p-2 text-center text-sm font-medium text-[#081A4B]">
                    To: {endDate ? endDate.toLocaleDateString() : "--/--/----"}
                </div>
                <button
                    onClick={clearSelection}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
                >
                    Clear
                </button>
            </div>

            {/* Month view */}
            {view === "month" && (
                <div className="grid grid-cols-7 gap-0.5">
                    {weekdays.map((day) => (
                        <div key={day} className="text-center py-1 text-xs font-semibold text-[#081A4B]">{day}</div>
                    ))}
                    {monthDays.map((date, idx) => {
                        if (!date) return <div key={idx} className="h-12 bg-transparent" />;
                        const isToday = isSameDay(date, today);
                        const isStart = isSameDay(date, startDate);
                        const isEnd = isSameDay(date, endDate);
                        const inRange = isInRange(date);

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => handleDateClick(date)}
                                onMouseEnter={() => setHoverDate(date)}
                                className={`w-full h-12 flex items-center justify-center text-sm rounded-md transition-colors duration-200
                  ${isToday ? "bg-[#E0E7FF] text-[#081A4B] font-semibold" : ""}
                  ${isStart || isEnd ? "bg-[#081A4B] text-white font-semibold shadow" : ""}
                  ${inRange ? "bg-[#F0F4FF]" : "hover:bg-[#F0F4FF]"}`}
                            >
                                {date.getDate()}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Week view */}
            {view === "week" && (
                <div className="grid grid-cols-7 gap-0.5">
                    {weekDays.map((date) => {
                        const isToday = isSameDay(date, today);
                        const isStart = isSameDay(date, startDate);
                        const isEnd = isSameDay(date, endDate);
                        const inRange = isInRange(date);
                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => handleDateClick(date)}
                                onMouseEnter={() => setHoverDate(date)}
                                className={`flex flex-col items-center justify-center p-2 rounded-md
                  ${isToday ? "bg-[#E0E7FF] font-semibold text-[#081A4B]" : ""}
                  ${isStart || isEnd ? "bg-[#081A4B] text-white font-semibold shadow" : ""}
                  ${inRange ? "bg-[#F0F4FF]" : "hover:bg-[#F0F4FF]"}`}
                            >
                                <span className="text-xs font-medium">{weekdays[date.getDay()]}</span>
                                <span className="text-sm">{date.getDate()}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Day view */}
            {view === "day" && (
                <div className="flex flex-col gap-0.5">
                    {Array.from({ length: 24 }, (_, i) => (
                        <div key={i} className="h-10 flex items-center px-2 text-xs text-gray-700 border-b border-gray-100 last:border-b-0">
                            {i.toString().padStart(2, "0")}:00
                        </div>
                    ))}
                </div>
            )}

            {/* Year view */}
            {view === "year" && (
                <div className="grid grid-cols-4 gap-2">
                    {months.map((month, idx) => (
                        <button
                            key={idx}
                            onClick={() => setStartDate(new Date(selectedDate.getFullYear(), idx, 1))}
                            className="flex items-center justify-center p-4 rounded-md hover:bg-[#F0F4FF] transition-colors duration-200"
                        >
                            {month}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
