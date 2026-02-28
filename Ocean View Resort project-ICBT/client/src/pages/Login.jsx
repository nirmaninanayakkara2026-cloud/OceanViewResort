import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
} from "react-icons/fa";
import { authAPI } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login user or admin
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });

        // Check user role - roles can be array, set, or object
        let userRoles = [];
        if (Array.isArray(response.roles)) {
          userRoles = response.roles;
        } else if (response.roles) {
          userRoles = Array.from(response.roles);
        }

        console.log("User roles:", userRoles);
        const hasAdminRole = userRoles.includes("ADMIN");
        const hasUserRole = userRoles.includes("USER");

        if (isAdminLogin && !hasAdminRole) {
          setError("Access denied. Admin credentials required.");
          setLoading(false);
          return;
        }

        if (!isAdminLogin && hasAdminRole && !hasUserRole) {
          setError("Please use admin login for administrator accounts.");
          setLoading(false);
          return;
        }

        alert(`Welcome back, ${response.fullName}!`);

        // Navigate based on role
        if (hasAdminRole) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        // Register new user
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }

        if (!formData.fullName || !formData.phone) {
          setError("Please fill in all required fields.");
          setLoading(false);
          return;
        }

        await authAPI.signup({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });

        alert("Registration successful! Welcome to Ocean View Resort.");
        navigate("/");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative bg-gradient-to-br from-primary via-primary-light to-primary bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-12 text-center">
            <h2 className="text-5xl font-bold mb-4">Ocean View Resort</h2>
            <p className="text-xl mb-12 text-white/90">
              Your perfect beachside getaway awaits
            </p>
            <div className="space-y-4 text-left w-full max-w-md">
              <div className="flex items-center gap-3 text-lg">
                <span className="text-accent">✓</span> Luxury Accommodations
              </div>
              <div className="flex items-center gap-3 text-lg">
                <span className="text-accent">✓</span> Beachfront Location
              </div>
              <div className="flex items-center gap-3 text-lg">
                <span className="text-accent">✓</span> World-Class Service
              </div>
              <div className="flex items-center gap-3 text-lg">
                <span className="text-accent">✓</span> Exclusive Packages
              </div>
            </div>
          </div>
        </div>

        <div className="p-16 flex items-center">
          <div className="w-full max-w-md mx-auto">
            {/* Admin/User Toggle for Login */}
            {isLogin && (
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setIsAdminLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    !isAdminLogin
                      ? "bg-primary text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaUser className="inline mr-2" />
                  User Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    isAdminLogin
                      ? "bg-primary text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaShieldAlt className="inline mr-2" />
                  Admin Login
                </button>
              </div>
            )}

            <div className="mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">
                {isLogin
                  ? isAdminLogin
                    ? "Admin Portal"
                    : "Welcome Back"
                  : "Create Account"}
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? isAdminLogin
                    ? "Administrator access only"
                    : "Login to manage your bookings"
                  : "Join us for exclusive benefits"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                      <FaUser /> Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                      <FaPhone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                  <FaEnvelope /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                  <FaLock /> Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaLock /> Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" />
                    <span className="text-gray-700">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-primary-light hover:text-primary font-semibold"
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary-light to-primary text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isLogin ? "Logging in..." : "Signing up..."}
                  </span>
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  className="text-primary-light hover:text-primary font-semibold"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-semibold">
                  OR
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 hover:border-primary-light transition-all duration-300">
                <span>🔍</span> Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 hover:border-primary-light transition-all duration-300">
                <span>📘</span> Continue with Facebook
              </button>
            </div>

            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-3">Just browsing?</p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
