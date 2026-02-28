import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaBed, FaSearch } from "react-icons/fa";
import { roomAPI } from "../services/api";

const CheckAvailability = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
    roomType: "any",
  });

  const [availableRooms, setAvailableRooms] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Fetch all rooms from backend
      const response = await roomAPI.getAllRooms();
      const allRooms = response.data || [];

      // Filter rooms based on criteria
      const guestCount = parseInt(formData.guests);
      let filtered = allRooms.filter((room) => {
        // Check if room has available rooms
        if (!room.availableRooms || room.availableRooms === 0) return false;

        // Check capacity
        if (room.capacity < guestCount) return false;

        // Check room type if specified
        if (formData.roomType !== "any") {
          const typeMatch = room.type
            ?.toLowerCase()
            .includes(formData.roomType.toLowerCase());
          if (!typeMatch) return false;
        }

        return true;
      });

      setAvailableRooms(filtered);
      setSearched(true);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to fetch available rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (room) => {
    // Navigate to book rooms page with pre-filled data
    navigate("/book-rooms", {
      state: {
        selectedRoom: room,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-16 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">Check Availability</h1>
        <p className="text-xl opacity-90">
          Find the perfect room for your stay
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-8">
        <div className="bg-white p-10 rounded-2xl shadow-xl -mt-12 relative z-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-primary flex items-center gap-2">
                  <FaCalendarAlt /> Check-in Date
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                  <FaCalendarAlt /> Check-out Date
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  min={
                    formData.checkIn || new Date().toISOString().split("T")[0]
                  }
                  required
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                  <FaUser /> Number of Guests
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                  <FaBed /> Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                >
                  <option value="any">Any Type</option>
                  <option value="standard">Standard Room</option>
                  <option value="deluxe">Deluxe Ocean View</option>
                  <option value="suite">Suite</option>
                  <option value="presidential">Presidential Suite</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-primary-light to-primary text-white rounded-full text-lg font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300 self-center min-w-[250px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>Loading...</>
              ) : (
                <>
                  <FaSearch /> Search Available Rooms
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
        </div>

        {searched && !loading && (
          <div className="py-12">
            <h2 className="text-3xl font-bold text-primary mb-8">
              Available Rooms ({availableRooms.length} results)
            </h2>

            {availableRooms.length > 0 ? (
              <div className="flex flex-col gap-8">
                {availableRooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-[350px_1fr] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative">
                      <div className="h-full min-h-[250px] bg-gradient-to-br from-primary-light/30 to-primary/30 flex items-center justify-center text-6xl">
                        {room.imageUrl || "🏠"}
                      </div>
                      {room.availableRooms <= 2 && (
                        <span className="absolute top-4 left-4 bg-red-500 text-white py-2 px-4 rounded-full font-bold text-sm">
                          Only {room.availableRooms} left!
                        </span>
                      )}
                    </div>

                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-3xl font-bold text-primary mb-3">
                          {room.name}
                        </h3>
                        <p className="text-gray-600 mb-4">{room.description}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {room.amenities?.map((amenity, index) => (
                            <span
                              key={index}
                              className="bg-primary-light/10 text-primary-light px-4 py-2 rounded-full text-sm font-semibold"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-2">
                            <FaUser /> Up to {room.capacity} guests
                          </span>
                          <span className="flex items-center gap-2">
                            <FaBed /> {room.availableRooms} rooms available
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-sm text-gray-500">From</span>
                          <span className="text-4xl font-bold text-accent mx-2">
                            Rs. {room.pricePerNight?.toLocaleString() || "N/A"}
                          </span>
                          <span className="text-gray-500">/ night</span>
                        </div>

                        <button
                          className="px-8 py-3 bg-gradient-to-r from-primary-light to-primary text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                          onClick={() => handleBookNow(room)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
                <FaBed className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No rooms available for the selected dates and criteria.
                </p>
                <p className="text-gray-500 mt-2">
                  Please try different dates or guest count.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckAvailability;
