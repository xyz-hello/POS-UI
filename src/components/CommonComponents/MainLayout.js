import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar (fixed width, scrollable if needed) */}
        <aside className="w-64 h-screen flex-shrink-0 bg-white shadow overflow-y-auto">
            <Sidebar />
        </aside>

        {/* Right content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Sticky header */}
            <Header />

            {/* Scrollable main content */}
            <main className="flex-1 px-6 py-8 bg-gray-50 overflow-y-auto">
                {children}
            </main>
        </div>
    </div>
);

export default MainLayout;
