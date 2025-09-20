// src/components/CommonComponents/Pagination.js
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const prevPage = () => currentPage > 1 && onPageChange(currentPage - 1);
    const nextPage = () => currentPage < totalPages && onPageChange(currentPage + 1);

    // Define window size (max 10 pages shown)
    const maxPagesToShow = 10;
    const startPage = Math.floor((currentPage - 1) / maxPagesToShow) * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="mt-8 flex justify-center items-center gap-1">
            {/* Prev button */}
            <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#081A4B] hover:bg-[#061533] text-white"
                    }`}
            >
                Prev
            </button>

            {/* Page numbers (max 10) */}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-2 py-1 rounded-md text-xs font-semibold border ${currentPage === page
                            ? "bg-[#081A4B] text-white border-[#081A4B]"
                            : "bg-white text-[#081A4B] border border-[#081A4B] hover:bg-gray-100"
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Next button */}
            <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 rounded-md text-xs font-medium ${currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#081A4B] hover:bg-[#061533] text-white"
                    }`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
