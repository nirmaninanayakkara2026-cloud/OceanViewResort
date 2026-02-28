import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaCalendarCheck,
  FaUtensils,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { authAPI } from "../services/api";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, [location.pathname]); // Re-check when route changes

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-primary to-primary-light text-white py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center px-8 gap-8">
        <div className="logo">
          <Link to="/" className="no-underline text-white">
            <h1 className="text-3xl font-bold tracking-wide mb-0">
              Ocean View Resort
            </h1>
            <p className="text-sm opacity-90 italic mb-0">
              Experience Paradise
            </p>
          </Link>
        </div>

        <nav className="flex gap-6 items-center flex-1 justify-center">
          <Link
            to="/"
            className={`text-white no-underline font-medium py-2 px-4 rounded transition-all duration-300 text-[0.95rem] hover:bg-white/10 hover:-translate-y-0.5 ${isActive("/") ? "bg-white/20 border-b-2 border-accent" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/check-availability"
            className={`text-white no-underline font-medium py-2 px-4 rounded transition-all duration-300 text-[0.95rem] hover:bg-white/10 hover:-translate-y-0.5 ${isActive("/check-availability") ? "bg-white/20 border-b-2 border-accent" : ""}`}
          >
            Check Availability
          </Link>
          <Link
            to="/book-rooms"
            className={`text-white no-underline font-medium py-2 px-4 rounded transition-all duration-300 text-[0.95rem] hover:bg-white/10 hover:-translate-y-0.5 ${isActive("/book-rooms") ? "bg-white/20 border-b-2 border-accent" : ""}`}
          >
            Book Rooms
          </Link>
          <Link
            to="/order-foods"
            className={`text-white no-underline font-medium py-2 px-4 rounded transition-all duration-300 text-[0.95rem] hover:bg-white/10 hover:-translate-y-0.5 ${isActive("/order-foods") ? "bg-white/20 border-b-2 border-accent" : ""}`}
          >
            Order Foods
          </Link>
          <Link
            to="/packages"
            className={`text-white no-underline font-medium py-2 px-4 rounded transition-all duration-300 text-[0.95rem] hover:bg-white/10 hover:-translate-y-0.5 ${isActive("/packages") ? "bg-white/20 border-b-2 border-accent" : ""}`}
          >
            Packages
          </Link>
          <Link
            to="/gallery"
            className={`text-white no-underline font-medium py-2 px-4 rounded transition-all duration-300 text-[0.95rem] hover:bg-white/10 hover:-translate-y-0.5 ${isActive("/gallery") ? "bg-white/20 border-b-2 border-accent" : ""}`}
          >
            Gallery
          </Link>
          {user && (
            <>
              <Link
                to="/my-bookings"
                className={`text-white no-underline font-medium py-2 px-4 rounded transition-all duration-300 text-[0.95rem] hover:bg-white/10 hover:-translate-y-0.5 ${isActive("/my-bookings") ? "bg-white/20 border-b-2 border-accent" : ""}`}
              >
                My Bookings
              </Link>
              <Link
                to="/my-orders"
                className={`text-white no-underline font-medium py-2 px-4 rounded transition-all duration-300 text-[0.95rem] hover:bg-white/10 hover:-translate-y-0.5 ${isActive("/my-orders") ? "bg-white/20 border-b-2 border-accent" : ""}`}
              >
                My Orders
              </Link>
            </>
          )}
        </nav>

        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-white font-medium text-sm">
                Welcome, {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-2.5 px-5 rounded-full font-medium transition-all duration-300 text-[0.9rem] bg-red-500 text-white border-0 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 py-2.5 px-5 rounded-full no-underline font-medium transition-all duration-300 text-[0.9rem] bg-accent text-primary border-0 hover:bg-yellow-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30"
            >
              <FaUser /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
