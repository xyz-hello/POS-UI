const ProductCard = ({ product, uploadsBaseURL, onEdit }) => (
    <div
        className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
        onClick={onEdit}
    >
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
            {product.image_url ? (
                <img src={`${uploadsBaseURL}/${product.image_url}`} alt={product.name} className="object-cover w-full h-full rounded-lg" />
            ) : (
                <span className="text-gray-400 text-xl">{product.name[0]}</span>
            )}
        </div>
        <p className="text-sm font-medium text-[#081A4B]">{product.name}</p>
        <p className="text-xs text-gray-500">${product.price}</p>
    </div>
);

export default ProductCard;
