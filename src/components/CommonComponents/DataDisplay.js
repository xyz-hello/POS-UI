const DataDisplay = ({ items, viewMode, renderTable, renderGrid, loading }) => {
    if (loading) return <p className="text-center py-10 text-gray-400">Loading...</p>;
    if (!items.length) return <p className="text-center py-10 text-gray-400">No data found.</p>;

    return viewMode === "table" ? renderTable(items) : renderGrid(items);
};

export default DataDisplay;
