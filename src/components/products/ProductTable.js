import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";

// Utility function to format price in PHP currency
const formatPrice = (amount) => {
    if (isNaN(amount)) return "₱0.00";
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(amount);
};

// Helper component for product image with placeholder fallback
const ProductImage = ({ imageUrl, name, uploadsBaseURL, size = 48 }) => {
    const [src, setSrc] = React.useState(imageUrl ? `${uploadsBaseURL}/${imageUrl}` : null);

    return src ? (
        <img
            src={src}
            alt={name}
            className={`h-${size} w-${size} object-cover rounded border`}
            onError={() => setSrc("/placeholder.png")}
        />
    ) : (
        <span className="text-gray-400 text-xs">{name[0]}</span>
    );
};

// ProductTable component for admin product management
export default function ProductTable({ products = [], onEdit, onDelete, uploadsBaseURL }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3 text-left">Image</th>
                        <th className="px-4 py-3 text-left">Code</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Description</th>
                        <th className="px-4 py-3 text-left">Price (₱)</th>
                        <th className="px-4 py-3 text-left">Unit</th>
                        <th className="px-4 py-3 text-left">Created</th>
                        <th className="px-4 py-3 text-left">Updated</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="text-center text-gray-400 py-6">
                                No products found.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <ProductImage
                                        imageUrl={product.image_url}
                                        name={product.name}
                                        uploadsBaseURL={uploadsBaseURL}
                                        size={12} // 48px = 12 * 4px Tailwind
                                    />
                                </td>
                                <td className="px-4 py-3 text-gray-800">{product.product_code}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{product.description || "—"}</td>
                                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                                <td className="px-4 py-3">{product.unit_type}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">
                                    {new Date(product.createdAt).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">
                                    {new Date(product.updatedAt).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                                </td>
                                <td className="px-4 py-3 text-center space-x-2">
                                    <button onClick={() => onEdit(product)} className="text-[#081A4B] hover:text-[#061533]" title="Edit Product">
                                        <MdEdit size={18} />
                                    </button>
                                    <button onClick={() => onDelete(product)} className="text-red-500 hover:text-red-700" title="Delete Product">
                                        <MdDelete size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
