import { useState, useEffect } from "react";
import { bookingAPI } from "../services/api";
import {
  FaCalendarAlt,
  FaUsers,
  FaBed,
  FaMoneyBillWave,
  FaTicketAlt,
  FaTimesCircle,
} from "react-icons/fa";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.email) {
        alert("Please login to view your bookings");
        window.location.href = "/login";
        return;
      }

      const response = await bookingAPI.getBookingsByEmail(user.email);
      // Sort bookings by createdAt date (newest first)
      const sortedBookings = (response.data || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, reservationNumber) => {
    if (
      !confirm(
        `Are you sure you want to cancel booking ${reservationNumber}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await bookingAPI.cancelBooking(bookingId);
      alert("Booking cancelled successfully!");
      fetchMyBookings(); // Refresh the list
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "ALL") return true;
    return booking.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            View and manage your hotel reservations
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-gray-700 font-medium">Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="ALL">All Bookings</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <span className="text-gray-500 ml-auto">
              {filteredBookings.length} booking(s)
            </span>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500 mb-6">
              {filterStatus === "ALL"
                ? "You haven't made any bookings yet."
                : `You don't have any ${filterStatus.toLowerCase()} bookings.`}
            </p>
            <a
              href="/book-rooms"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
            >
              Book a Room
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
              >
                {/* Header with Reservation Number and Status */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <FaTicketAlt />
                      <span className="font-mono font-semibold">
                        {booking.reservationNumber}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Booked on{" "}
                      {new Date(booking.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Room Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaBed className="text-primary text-lg" />
                    <div>
                      <p className="font-semibold">{booking.roomType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <FaCalendarAlt className="text-primary text-lg" />
                    <div className="text-sm">
                      <p>
                        <span className="font-semibold">Check-in:</span>{" "}
                        {new Date(booking.checkInDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">Check-out:</span>{" "}
                        {new Date(booking.checkOutDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <FaUsers className="text-primary text-lg" />
                    <p className="text-sm">
                      {booking.numberOfGuests}{" "}
                      {booking.numberOfGuests === 1 ? "Guest" : "Guests"}
                    </p>
                  </div>
                </div>

                {/* Package */}
                {booking.packageName && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">Package</p>
                    <p className="font-semibold text-gray-800">
                      {booking.packageName}
                    </p>
                  </div>
                )}

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">Special Requests</p>
                    <p className="text-sm text-gray-800">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}

                {/* Total Price */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaMoneyBillWave className="text-primary text-lg" />
                    <span className="text-sm">Total Amount</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    LKR {booking.totalPrice?.toLocaleString()}
                  </span>
                </div>

                {/* Cancel Button - Only show for PENDING bookings */}
                {booking.status === "PENDING" && (
                  <button
                    onClick={() =>
                      handleCancelBooking(booking.id, booking.reservationNumber)
                    }
                    className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                  >
                    <FaTimesCircle />
                    Cancel Booking
                  </button>
                )}

                {/* Info message for CONFIRMED bookings */}
                {booking.status === "CONFIRMED" && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 text-center">
                      ✓ Your booking is confirmed! Check in on{" "}
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
