// filepath: src/pos/components/products/POSProductImage.js
import React from "react";

export default function POSProductImage({ imageUrl, name }) {
    // Always ensure trailing slash
    const uploadsBaseURL = process.env.REACT_APP_API_URL
        ? `${process.env.REACT_APP_API_URL}/uploads/`
        : "http://localhost:4000/uploads/";

    // Build final URL correctly
    const srcUrl = imageUrl
        ? imageUrl.startsWith("http")
            ? imageUrl
            : `${uploadsBaseURL}${imageUrl.replace(/^\/+/, "")}`
        : null;

    // Debug logs
    console.log("POSProductImage Debug:");
    console.log("  imageUrl prop:", imageUrl);
    console.log("  uploadsBaseURL:", uploadsBaseURL);
    console.log("  final srcUrl:", srcUrl);

    return srcUrl ? (
        <img
            src={srcUrl}
            alt={name || "Product"}
            className="w-full h-28 object-cover rounded-lg"
            onError={(e) => {
                console.error("Image failed to load:", srcUrl);
                e.currentTarget.src = "/placeholder.png"; // fallback
            }}
        />
    ) : (
        <span className="flex items-center justify-center h-28 w-full rounded bg-gray-100 text-gray-400 text-lg font-medium">
            {name ? name[0] : "?"}
        </span>
    );
}
