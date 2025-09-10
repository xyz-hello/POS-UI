// src/components/CommonComponents/Pagination.js
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const prevPage = () => currentPage > 1 && onPageChange(currentPage - 1);
    const nextPage = () => currentPage < totalPages && onPageChange(currentPage + 1);

    return (
        <div className="mt-8 flex justify-center items-center gap-1">
            <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#081A4B] hover:bg-[#061533] text-white"}`}
            >
                Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-2 py-1 rounded-md text-xs font-semibold border ${currentPage === i + 1 ? "bg-[#081A4B] text-white border-[#081A4B]" : "bg-white text-[#081A4B] border border-[#081A4B] hover:bg-gray-100"}`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#081A4B] hover:bg-[#061533] text-white"}`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
