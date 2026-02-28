import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { bookingAPI, roomAPI, foodAPI } from "../../services/api";
import {
  FaBed,
  FaCalendarCheck,
  FaUtensils,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    foodOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data
      const [roomsRes, bookingsRes, ordersRes] = await Promise.all([
        roomAPI.getAllRooms(),
        bookingAPI.getAllBookings(),
        foodAPI.getAllFoodOrders(),
      ]);

      const rooms = roomsRes.data || [];
      const bookings = bookingsRes.data || [];
      const orders = ordersRes.data || [];

      // Calculate stats
      const availableRooms = rooms.filter((r) => r.available).length;
      const pendingBookings = bookings.filter(
        (b) => b.status === "PENDING",
      ).length;
      const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

      // Calculate revenue (simple sum of booking prices)
      const revenue = bookings
        .filter((b) => b.status === "CONFIRMED")
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      setStats({
        totalRooms: rooms.length,
        availableRooms,
        totalBookings: bookings.length,
        pendingBookings,
        foodOrders: orders.length,
        pendingOrders,
        revenue,
      });

      // Get recent bookings (last 5)
      setRecentBookings(bookings.slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`text-2xl text-${color}-600`} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-semibold mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome to Ocean View Resort Admin Panel
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FaBed}
            title="Total Rooms"
            value={stats.totalRooms}
            subtitle={`${stats.availableRooms} available`}
            color="blue"
          />
          <StatCard
            icon={FaCalendarCheck}
            title="Total Bookings"
            value={stats.totalBookings}
            subtitle={`${stats.pendingBookings} pending`}
            color="green"
          />
          <StatCard
            icon={FaUtensils}
            title="Food Orders"
            value={stats.foodOrders}
            subtitle={`${stats.pendingOrders} pending`}
            color="orange"
          />
          <StatCard
            icon={FaDollarSign}
            title="Revenue"
            value={`Rs. ${(stats.revenue / 1000).toFixed(0)}K`}
            subtitle="Confirmed bookings"
            color="purple"
          />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Reservation #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Guest Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Room Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No bookings yet
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {booking.reservationNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.guestName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.roomType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        Rs. {booking.totalPrice?.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
