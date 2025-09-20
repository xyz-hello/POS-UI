import { useState, useEffect } from "react";

export default function AddProductModal({ isOpen, onClose, onSubmit, editData }) {
    const [productData, setProductData] = useState({
        name: "",
        price: "",
        unit_type: "",
        description: "",
        image: null,
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (editData) {
            setProductData({
                name: editData.name || "",
                price: editData.price || "",
                unit_type: editData.unit_type || "",
                description: editData.description || "",
                image: null,
            });
            setPreview(editData.image || null); // full URL from backend
        } else {
            setProductData({ name: "", price: "", unit_type: "", description: "", image: null });
            setPreview(null);
        }
    }, [editData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];
            setProductData({ ...productData, image: file });
            setPreview(file ? URL.createObjectURL(file) : null);
        } else {
            setProductData({ ...productData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("price", productData.price);
        formData.append("unit_type", productData.unit_type);
        formData.append("description", productData.description);

        if (productData.image) {
            formData.append("image", productData.image);
        }

        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">{editData ? "Edit Product" : "Add Product"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} className="border px-2 py-1 rounded" required />
                    <input name="price" type="number" placeholder="Price" value={productData.price} onChange={handleChange} className="border px-2 py-1 rounded" min="0" step="0.01" required />
                    <select name="unit_type" value={productData.unit_type} onChange={handleChange} className="border px-2 py-1 rounded" required>
                        <option value="">Select unit type</option>
                        <option value="pcs">Piece</option>
                        <option value="kg">Kg</option>
                        <option value="liter">Liter</option>
                        <option value="pack">Pack</option>
                    </select>
                    <textarea name="description" placeholder="Product Description" value={productData.description} onChange={handleChange} className="border px-2 py-1 rounded resize-none" rows={3} />
                    <input type="file" name="image" accept="image/*" onChange={handleChange} className="border px-2 py-1 rounded" />
                    {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded mt-2 border" />}
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={onClose}>Cancel</button>
                        <button type="submit" className="px-3 py-1 bg-primaryNavy text-white rounded hover:bg-primaryHover">{editData ? "Update" : "Add"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
