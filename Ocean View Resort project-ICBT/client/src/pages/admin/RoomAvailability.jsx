import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { bookingAPI, roomAPI } from "../../services/api";
import {
  FaCalendarAlt,
  FaBed,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaSearch,
} from "react-icons/fa";

const RoomAvailability = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("ALL");
  const [viewMode, setViewMode] = useState("date"); // 'date' or 'room'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, roomsRes] = await Promise.all([
        bookingAPI.getAllBookings(),
        roomAPI.getAllRooms(),
      ]);
      setBookings(bookingsRes.data || []);
      setRooms(roomsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings that are not cancelled
  const activeBookings = bookings.filter(
    (booking) => booking.status !== "CANCELLED",
  );

  // Get bookings by date
  const getBookingsForDate = (date) => {
    return activeBookings.filter((booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const selectedDateObj = new Date(date);

      return selectedDateObj >= checkIn && selectedDateObj < checkOut;
    });
  };

  // Get bookings by room type
  const getBookingsByRoomType = (roomType) => {
    if (roomType === "ALL") return activeBookings;
    return activeBookings.filter((booking) => booking.roomType === roomType);
  };

  // Get unique room types from rooms (remove duplicates)
  const roomTypes = [...new Set(rooms.map((room) => room.type))];

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Get date range for the next 30 days
  const getDateRange = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const dateRange = getDateRange();

  // Filter based on view mode
  const filteredBookings =
    viewMode === "date" && selectedDate
      ? getBookingsForDate(selectedDate)
      : getBookingsByRoomType(selectedRoomType);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading availability data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Room Availability
          </h1>
          <p className="text-gray-600">
            View room bookings by date and room type
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <label className="text-gray-700 font-semibold">View By:</label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setViewMode("date");
                  setSelectedRoomType("ALL");
                }}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "date"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaCalendarAlt className="inline mr-2" />
                By Date
              </button>
              <button
                onClick={() => {
                  setViewMode("room");
                  setSelectedDate("");
                }}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === "room"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaBed className="inline mr-2" />
                By Room Type
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Filter (for date view) */}
            {viewMode === "date" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="">-- Select a date --</option>
                  {dateRange.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Room Type Filter (for room view) */}
            {viewMode === "room" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Room Type
                </label>
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="ALL">All Room Types</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-800">
                {activeBookings.length}
              </p>
              <p className="text-sm text-blue-600">Active Bookings</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <p className="text-2xl font-bold text-yellow-800">
                {activeBookings.filter((b) => b.status === "PENDING").length}
              </p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-800">
                {activeBookings.filter((b) => b.status === "CONFIRMED").length}
              </p>
              <p className="text-sm text-green-600">Confirmed</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <p className="text-2xl font-bold text-purple-800">
                {roomTypes.length}
              </p>
              <p className="text-sm text-purple-600">Room Types</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {viewMode === "date" && selectedDate && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Bookings for{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <span className="text-lg font-semibold text-primary">
                {filteredBookings.length} booking(s)
              </span>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookings for this date</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>
        )}

        {viewMode === "room" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedRoomType === "ALL"
                  ? "All Active Bookings"
                  : `${selectedRoomType} Bookings`}
              </h2>
              <span className="text-lg font-semibold text-primary">
                {filteredBookings.length} booking(s)
              </span>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <FaBed className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Reservation #
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Room Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Guest
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Check-in
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Check-out
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Nights
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 text-sm font-mono text-primary font-semibold">
                          {booking.reservationNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {booking.roomType}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {booking.guestName}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {booking.guestEmail}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {booking.numberOfNights} night(s)
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              booking.status,
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Calendar Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            30-Day Calendar Overview
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  {roomTypes.map((type) => (
                    <th
                      key={type}
                      className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700"
                    >
                      {type}
                    </th>
                  ))}
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {dateRange.slice(0, 14).map((date) => {
                  const dateBookings = getBookingsForDate(date);
                  return (
                    <tr key={date} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {new Date(date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </p>
                        </div>
                      </td>
                      {roomTypes.map((type) => {
                        const roomBookings = dateBookings.filter(
                          (b) => b.roomType === type,
                        );
                        return (
                          <td
                            key={type}
                            className="border border-gray-200 px-4 py-2 text-center"
                          >
                            {roomBookings.length > 0 ? (
                              <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {roomBookings.length}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        <span className="font-bold text-gray-800">
                          {dateBookings.length}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Showing next 14 days. Use filters above to view specific dates or
            room types.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

// Booking Card Component
const BookingCard = ({ booking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <FaBed className="text-primary text-lg" />
          <span className="font-bold text-gray-800">{booking.roomType}</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
            booking.status,
          )}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FaUser className="text-gray-400" />
          <span className="font-semibold">{booking.guestName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaEnvelope className="text-gray-400" />
          <span className="truncate">{booking.guestEmail}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaPhone className="text-gray-400" />
          <span>{booking.guestPhone}</span>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Check-in to Check-out</span>
          </div>
          <div className="font-semibold text-gray-800 text-sm">
            {new Date(booking.checkIn).toLocaleDateString()} →{" "}
            {new Date(booking.checkOut).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            {booking.numberOfNights} night(s)
          </span>
          <span className="font-mono text-sm text-gray-500">
            {booking.reservationNumber}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoomAvailability;
