import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed z-50 lg:static top-0 left-0 transform lg:transform-none transition-transform duration-300 w-64  h-full bg-base-200 border-r border-base-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Scrollable content wrapper */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo */}
          <div className="p-5 border-b border-base-300">
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Chatapp
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 ">
            <Link
              to="/"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/" ? "btn-active" : ""
              }`}
              onClick={closeSidebar}
            >
              <HomeIcon className="size-5 text-base-content opacity-70" />
              <span>Home</span>
            </Link>

            <Link
              to="/friends"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/friends" ? "btn-active" : ""
              }`}
              onClick={closeSidebar}
            >
              <UsersIcon className="size-5 text-base-content opacity-70" />
              <span>Friends</span>
            </Link>

            <Link
              to="/notifications"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/notifications" ? "btn-active" : ""
              }`}
              onClick={closeSidebar}
            >
              <BellIcon className="size-5 text-base-content opacity-70" />
              <span>Notifications</span>
            </Link>
          </nav>

          {/* Profile footer */}
          <div className="p-4 border-t border-base-300 mt-auto">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={authUser?.profilePic} alt="User Avatar" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{authUser?.fullname}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="size-2 rounded-full bg-success inline-block" />
                  Online
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
