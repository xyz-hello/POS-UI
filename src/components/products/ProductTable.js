// filepath: src/components/products/ProductTable.js
import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { Package } from "lucide-react";
import IconButton from "../CommonComponents/IconButton";
import EmptyState from "../CommonComponents/EmptyState";

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
const ProductImage = ({ imageUrl, name, uploadsBaseURL }) => {
    const [src, setSrc] = React.useState(imageUrl ? `${uploadsBaseURL}/${imageUrl}` : null);

    return src ? (
        <img
            src={src}
            alt={name}
            className="h-10 w-10 object-cover rounded border"
            onError={() => setSrc("/placeholder.png")}
        />
    ) : (
        <span className="flex items-center justify-center h-10 w-10 rounded bg-gray-100 text-gray-400 text-sm font-medium">
            {name[0]}
        </span>
    );
};

// ProductTable component for admin product management
export default function ProductTable({ products = [], onEdit, onDelete, uploadsBaseURL }) {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-[#081A4B] text-white text-xs uppercase">
                    <tr>
                        <th className="px-3 py-2 text-left">Image</th>
                        <th className="px-3 py-2 text-left">Code</th>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Price</th>
                        <th className="px-3 py-2 text-left">Unit</th>
                        <th className="px-3 py-2 text-left">Created</th>
                        <th className="px-3 py-2 text-left">Updated</th>
                        <th className="px-3 py-2 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={8}>
                                <EmptyState
                                    icon={Package}
                                    message="No products found"
                                    size="default"
                                />
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition">
                                <td className="px-3 py-2">
                                    <ProductImage
                                        imageUrl={product.image_url}
                                        name={product.name}
                                        uploadsBaseURL={uploadsBaseURL}
                                    />
                                </td>
                                <td className="px-3 py-2 text-gray-800">{product.product_code}</td>
                                <td className="px-3 py-2 font-medium text-gray-900">{product.name}</td>
                                <td className="px-3 py-2">{formatPrice(product.price)}</td>
                                <td className="px-3 py-2">{product.unit_type}</td>
                                <td className="px-3 py-2 text-xs text-gray-500">
                                    {new Date(product.createdAt).toLocaleDateString("en-PH", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-500">
                                    {new Date(product.updatedAt).toLocaleDateString("en-PH", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <IconButton
                                            icon={MdEdit}
                                            title="Edit"
                                            onClick={() => onEdit(product)}
                                            variant="edit" x
                                        />
                                        <IconButton
                                            icon={MdDelete}
                                            title="Delete"
                                            onClick={() => onDelete(product)}
                                            variant="delete"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
