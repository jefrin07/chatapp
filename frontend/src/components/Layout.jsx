import { useState } from "react"; // ✅ must be included
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="h-full flex">
      {showSidebar && (
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      )}

      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
