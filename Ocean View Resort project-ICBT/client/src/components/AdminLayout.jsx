import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBed,
  FaCalendarCheck,
  FaUtensils,
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";
import { useState } from "react";
import { authAPI } from "../services/api";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = authAPI.getCurrentUser();

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/admin/rooms", icon: FaBed, label: "Room Management" },
    { path: "/admin/bookings", icon: FaCalendarCheck, label: "Bookings" },
    {
      path: "/admin/availability",
      icon: FaCalendarAlt,
      label: "Room Availability",
    },
    { path: "/admin/food-orders", icon: FaUtensils, label: "Food Orders" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-primary to-primary-dark text-white fixed lg:relative h-screen transition-all duration-300 z-50 ${
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-2xl font-bold">Admin Panel</h2>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-white text-primary shadow-lg"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Icon className="text-xl flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="font-semibold">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-white/20">
            <div
              className={`flex items-center gap-3 mb-3 ${sidebarOpen ? "" : "justify-center"}`}
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaUser />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {user?.fullName || "Admin"}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all w-full ${
                sidebarOpen ? "" : "justify-center"
              }`}
            >
              <FaSignOutAlt />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">
              Ocean View Resort
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaBars className="text-primary" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">{children}</div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
