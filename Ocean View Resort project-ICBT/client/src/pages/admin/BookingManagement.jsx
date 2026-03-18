import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { bookingAPI, roomAPI } from "../../services/api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaCalendarCheck,
  FaSearch,
  FaEye,
  FaCheck,
  FaTimes,
  FaPlus,
  FaFilePdf,
} from "react-icons/fa";

const USER_BOOKING_ROOM_TYPES = [
  { value: "Standard Room", label: "Standard Room - Rs. 15,000/night" },
  {
    value: "Deluxe Ocean View",
    label: "Deluxe Ocean View - Rs. 25,000/night",
  },
  { value: "Suite", label: "Suite - Rs. 40,000/night" },
  {
    value: "Presidential Suite",
    label: "Presidential Suite - Rs. 50,000/night",
  },
];

const USER_ROOM_TYPE_LABEL_MAP = USER_BOOKING_ROOM_TYPES.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {},
);

const REPORT_HEADER_NAME = "Ocean View Resort Restaurant";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestAddress: "",
    roomType: "Standard Room",
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
    selectedPackage: "",
    drinkPackage: "",
    foodPreferences: [],
    specialRequests: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const availableRoomTypes = [
    ...new Set([
      ...USER_BOOKING_ROOM_TYPES.map((room) => room.value),
      ...rooms.flatMap((room) => [room?.roomType, room?.type, room?.name]),
    ]),
  ].filter(Boolean);

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomAPI.getAllRooms();
      setRooms(response.data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    filterBookingsData();
  }, [searchTerm, filterStatus, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filterBookingsData = () => {
    let filtered = [...bookings];

    // Filter by status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.guestName?.toLowerCase().includes(term) ||
          b.guestEmail?.toLowerCase().includes(term) ||
          b.reservationNumber?.toLowerCase().includes(term),
      );
    }

    setFilteredBookings(filtered);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, newStatus);
      alert("Booking status updated successfully!");
      fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error updating booking:", error);
      alert(error.response?.data?.message || "Failed to update booking");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await bookingAPI.cancelBooking(bookingId);
      alert("Booking cancelled successfully!");
      fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const newPreferences = checked
        ? [...formData.foodPreferences, value]
        : formData.foodPreferences.filter((p) => p !== value);
      setFormData((prev) => ({
        ...prev,
        foodPreferences: newPreferences,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.guestName ||
      !formData.guestEmail ||
      !formData.guestPhone ||
      !formData.guestAddress ||
      !formData.roomType ||
      !formData.checkIn ||
      !formData.checkOut ||
      !formData.numberOfGuests
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate dates
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    if (checkInDate >= checkOutDate) {
      alert("Check-out date must be after check-in date");
      return;
    }

    try {
      setSubmitting(true);
      const bookingData = {
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        guestAddress: formData.guestAddress,
        roomType: formData.roomType,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        numberOfGuests: parseInt(formData.numberOfGuests),
        selectedPackage: formData.selectedPackage || null,
        drinkPackage: formData.drinkPackage || null,
        foodPreferences: formData.foodPreferences.length > 0 ? formData.foodPreferences : null,
      };

      await bookingAPI.createBooking(bookingData);
      alert("Booking created successfully!");
      
      // Reset form
      setFormData({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        guestAddress: "",
        roomType: "Standard Room",
        checkIn: "",
        checkOut: "",
        numberOfGuests: 1,
        selectedPackage: "",
        drinkPackage: "",
        foodPreferences: [],
        specialRequests: "",
      });
      
      setShowAddBookingModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "-";
    return parsedDate.toLocaleDateString();
  };

  const handleDownloadPdfReport = () => {
    const reportRows = filteredBookings.map((booking) => [
      booking.reservationNumber || "-",
      booking.guestName || "-",
      booking.guestEmail || "-",
      booking.guestPhone || "-",
      booking.roomType || "-",
      booking.numberOfGuests?.toString() || "-",
      formatDate(booking.checkIn),
      formatDate(booking.checkOut),
      booking.status || "-",
      `Rs. ${(booking.totalPrice || 0).toLocaleString()}`,
    ]);

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const generatedOn = new Date().toLocaleString();
    const reportTitle = "Booking Report";

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(REPORT_HEADER_NAME, 40, 40);

    doc.setFontSize(14);
    doc.text(reportTitle, 40, 68);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated On: ${generatedOn}`, 40, 88);
    doc.text(`Status Filter: ${filterStatus}`, 40, 104);
    doc.text(`Search: ${searchTerm || "None"}`, 40, 120);
    doc.text(`Total Records: ${filteredBookings.length}`, 40, 136);

    autoTable(doc, {
      startY: 152,
      head: [[
        "Reservation #",
        "Guest Name",
        "Guest Email",
        "Phone",
        "Room Type",
        "Guests",
        "Check-in",
        "Check-out",
        "Status",
        "Total",
      ]],
      body: reportRows.length > 0 ? reportRows : [["No bookings found for current filter", "", "", "", "", "", "", "", "", ""]],
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "middle",
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: {
        left: 24,
        right: 24,
      },
      theme: "grid",
    });

    doc.save(`booking-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Booking Management
            </h1>
            <p className="text-gray-600">View and manage all hotel bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdfReport}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <FaFilePdf /> Download PDF Report
            </button>
            <button
              onClick={() => setShowAddBookingModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <FaPlus /> Add Booking
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or reservation number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {bookings.length}
              </p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === "PENDING").length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {bookings.filter((b) => b.status === "CONFIRMED").length}
              </p>
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {bookings.filter((b) => b.status === "COMPLETED").length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Reservation #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Guest Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Room Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {booking.reservationNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {booking.guestName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {booking.guestEmail}
                          </p>
                          <p className="text-xs text-gray-600">
                            {booking.guestPhone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {booking.roomType}
                        <p className="text-xs text-gray-500">
                          {booking.numberOfGuests} guests
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>
                          <p>
                            In: {new Date(booking.checkIn).toLocaleDateString()}
                          </p>
                          <p>
                            Out:{" "}
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "COMPLETED"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        Rs. {booking.totalPrice?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                Booking Details
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Reservation Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">
                  Reservation Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Reservation Number</p>
                    <p className="font-semibold">
                      {selectedBooking.reservationNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedBooking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : selectedBooking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedBooking.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div>
                <h3 className="font-bold text-lg mb-2">Guest Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{selectedBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">
                      {selectedBooking.guestEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">
                      {selectedBooking.guestPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold">
                      {selectedBooking.guestAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="font-bold text-lg mb-2">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Room Type</p>
                    <p className="font-semibold">{selectedBooking.roomType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Number of Guests</p>
                    <p className="font-semibold">
                      {selectedBooking.numberOfGuests}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-semibold">
                      {new Date(selectedBooking.checkIn).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-semibold">
                      {new Date(selectedBooking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package & Preferences */}
              {selectedBooking.selectedPackage && (
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Package & Preferences
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Selected Package</p>
                      <p className="font-semibold">
                        {selectedBooking.selectedPackage}
                      </p>
                    </div>
                    {selectedBooking.foodPreferences &&
                      selectedBooking.foodPreferences.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">
                            Food Preferences
                          </p>
                          <p className="font-semibold">
                            {selectedBooking.foodPreferences.join(", ")}
                          </p>
                        </div>
                      )}
                    {selectedBooking.drinkPackage && (
                      <div>
                        <p className="text-sm text-gray-600">Drink Package</p>
                        <p className="font-semibold">
                          {selectedBooking.drinkPackage}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Special Requests</h3>
                  <p className="text-gray-700">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              {/* Pricing */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Price</span>
                    <span className="font-semibold">
                      Rs. {selectedBooking.roomPrice?.toLocaleString()}
                    </span>
                  </div>
                  {selectedBooking.packagePrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package Price</span>
                      <span className="font-semibold">
                        Rs. {selectedBooking.packagePrice?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-primary">
                      Rs. {selectedBooking.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedBooking.status !== "CANCELLED" &&
                selectedBooking.status !== "COMPLETED" && (
                  <div className="flex gap-3">
                    {selectedBooking.status === "PENDING" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedBooking.id, "CONFIRMED")
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        <FaCheck /> Confirm Booking
                      </button>
                    )}
                    {selectedBooking.status === "CONFIRMED" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedBooking.id, "COMPLETED")
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <FaCheck /> Mark as Completed
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelBooking(selectedBooking.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      <FaTimes /> Cancel Booking
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Add New Booking</h2>
              <button
                onClick={() => setShowAddBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleAddBooking} className="p-6 space-y-4">
              {/* Guest Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Guest Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Name *
                    </label>
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="guestEmail"
                      value={formData.guestEmail}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="guestPhone"
                      value={formData.guestPhone}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="guestAddress"
                      value={formData.guestAddress}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type *
                    </label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    >
                      <option value="">Select Room Type</option>
                      {availableRoomTypes.map((type) => (
                        <option key={type} value={type}>
                          {USER_ROOM_TYPE_LABEL_MAP[type] || type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests *
                    </label>
                    <input
                      type="number"
                      name="numberOfGuests"
                      value={formData.numberOfGuests}
                      onChange={handleFormChange}
                      min="1"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Optional Preferences */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Optional Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package
                    </label>
                    <input
                      type="text"
                      name="selectedPackage"
                      value={formData.selectedPackage}
                      onChange={handleFormChange}
                      placeholder="Enter package name"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drink Package
                    </label>
                    <input
                      type="text"
                      name="drinkPackage"
                      value={formData.drinkPackage}
                      onChange={handleFormChange}
                      placeholder="Enter drink package"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <FaCheck /> {submitting ? "Creating..." : "Create Booking"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBookingModal(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default BookingManagement;
