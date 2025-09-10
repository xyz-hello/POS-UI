import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => (
    <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 px-6 py-8 bg-gray-50">{children}</main>
        </div>
    </div>
);

export default MainLayout;
