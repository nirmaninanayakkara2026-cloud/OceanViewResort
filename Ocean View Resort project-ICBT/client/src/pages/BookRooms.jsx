import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBed,
  FaHeart,
  FaCamera,
  FaUtensils,
  FaCocktail,
} from "react-icons/fa";
import { packageAPI, bookingAPI } from "../services/api";

const BookRooms = () => {
  const location = useLocation();
  const preFilledData = location.state || {};

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    // Guest Information
    fullName: "",
    email: "",
    phone: "",
    address: "",
    idDocument: null,

    // Booking Details
    checkIn: preFilledData.checkIn || "",
    checkOut: preFilledData.checkOut || "",
    roomType: preFilledData.selectedRoom?.name || "standard",
    numberOfGuests: preFilledData.guests || "2",

    // Special Requests
    selectedPackage: null,
    foodPreference: [],
    drinkPackage: "none",
    specialRequests: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservationNumber, setReservationNumber] = useState("");

  // Fetch packages from backend on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await packageAPI.getAllPackages();
        // Transform backend data to match frontend format
        const transformedPackages = response.data.map((pkg) => ({
          id: pkg.packageId,
          name: pkg.name,
          price: pkg.price,
          icon: pkg.icon,
          features: pkg.features || [],
          popular: pkg.popular || false,
        }));
        setPackages(transformedPackages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages. Using default options.");
        setLoading(false);
        // Fallback to static data if API fails
        setPackages([
          {
            id: "honeymoon",
            name: "Honeymoon Package",
            price: 25000,
            icon: "💑",
            features: [
              "Romantic room setup",
              "Champagne bottle",
              "Flower decoration",
              "Candlelit dinner",
              "Couples spa session",
              "Late checkout",
            ],
            popular: true,
          },
          {
            id: "anniversary",
            name: "Anniversary Package",
            price: 20000,
            icon: "💝",
            features: [
              "Anniversary cake",
              "Rose petals",
              "Special dinner",
              "Champagne",
              "Photo session",
              "Room decoration",
            ],
            popular: false,
          },
          {
            id: "birthday",
            name: "Birthday Celebration",
            price: 15000,
            icon: "🎂",
            features: [
              "Birthday cake",
              "Balloon decoration",
              "Party setup",
              "Special menu",
              "Complimentary dessert",
              "Gift voucher",
            ],
            popular: false,
          },
          {
            id: "family",
            name: "Family Fun Package",
            price: 18000,
            icon: "👨‍👩‍👧‍👦",
            features: [
              "Kids welcome kit",
              "Family activities",
              "Board games",
              "Movie night setup",
              "Extra breakfast",
              "Beach toys",
            ],
            popular: false,
          },
          {
            id: "wellness",
            name: "Wellness Retreat",
            price: 22000,
            icon: "🧘",
            features: [
              "Yoga sessions",
              "Meditation guide",
              "Spa treatments",
              "Healthy meal plan",
              "Wellness consultation",
              "Fitness access",
            ],
            popular: false,
          },
          {
            id: "adventure",
            name: "Adventure Package",
            price: 19000,
            icon: "🏄",
            features: [
              "Water sports",
              "Snorkeling gear",
              "Beach activities",
              "Adventure guide",
              "Equipment rental",
              "Safety gear",
            ],
            popular: false,
          },
        ]);
      }
    };
    fetchPackages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setBookingData((prev) => ({
        ...prev,
        foodPreference: checked
          ? [...prev.foodPreference, value]
          : prev.foodPreference.filter((item) => item !== value),
      }));
    } else {
      setBookingData({
        ...bookingData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    setBookingData({
      ...bookingData,
      idDocument: e.target.files[0],
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare booking data for backend
      const bookingPayload = {
        guestName: bookingData.fullName,
        guestEmail: bookingData.email,
        guestPhone: bookingData.phone,
        guestAddress: bookingData.address,
        roomType: bookingData.roomType,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        numberOfGuests: parseInt(bookingData.numberOfGuests),
        selectedPackage: bookingData.selectedPackage || "none",
        foodPreferences: bookingData.foodPreference,
        drinkPackage: bookingData.drinkPackage,
        specialRequests: bookingData.specialRequests,
      };

      console.log("Submitting booking:", bookingPayload);
      const response = await bookingAPI.createBooking(bookingPayload);

      console.log("Booking response:", response);

      // Extract reservation number from response
      const reservationNum =
        response.data?.data?.reservationNumber ||
        response.data?.reservationNumber ||
        `RES${Date.now()}`;

      setReservationNumber(reservationNum);
      setShowSuccess(true);
      setLoading(false);

      // Reset after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setStep(1);
        // Reset form
        setBookingData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          idDocument: null,
          checkIn: "",
          checkOut: "",
          roomType: "Standard Room",
          numberOfGuests: "2",
          selectedPackage: null,
          foodPreference: [],
          drinkPackage: "none",
          specialRequests: "",
        });
      }, 5000);
    } catch (err) {
      console.error("Error creating booking:", err);
      console.error("Error response:", err.response);

      let errorMessage = "Failed to create booking. Please try again.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const roomPrices = {
    "Standard Room": 15000,
    "Deluxe Ocean View": 25000,
    Suite: 40000,
    "Presidential Suite": 50000,
  };

  const calculateTotal = () => {
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const roomPrice = roomPrices[bookingData.roomType] || 15000;

    let total = roomPrice * nights;

    // Add selected package charges
    if (bookingData.selectedPackage) {
      const selectedPkg = packages.find(
        (p) => p.id === bookingData.selectedPackage,
      );
      if (selectedPkg) total += selectedPkg.price;
    }

    // Add drink package
    if (bookingData.drinkPackage === "basic") total += 5000 * nights;
    if (bookingData.drinkPackage === "premium") total += 10000 * nights;

    return { total, nights, roomPrice };
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6">
            ✓
          </div>
          <h2>Booking Successful!</h2>
          <p>Your reservation has been confirmed.</p>
          <p className="reservation-number">
            Reservation #: {reservationNumber}
          </p>
          <p>A confirmation email has been sent to {bookingData.email}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-16 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">Book Your Stay</h1>
        <p className="text-xl opacity-90">
          Complete your reservation in a few simple steps
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 -mt-12 relative z-10">
          {/* Progress Bar */}
          <div className="flex justify-between items-center mb-12 relative">
            <div
              className={`flex flex-col items-center gap-2 z-10 ${step >= 1 ? "" : ""}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all ${step >= 1 ? "bg-gradient-to-br from-primary-light to-primary text-white shadow-lg" : "bg-gray-200 text-gray-600"}`}
              >
                1
              </div>
              <div className="text-sm font-semibold text-gray-700">
                Guest Info
              </div>
            </div>
            <div
              className={`flex-1 h-1 mx-4 rounded transition-all ${step >= 2 ? "bg-gradient-to-r from-primary-light to-primary" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex flex-col items-center gap-2 z-10 ${step >= 2 ? "" : ""}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all ${step >= 2 ? "bg-gradient-to-br from-primary-light to-primary text-white shadow-lg" : "bg-gray-200 text-gray-600"}`}
              >
                2
              </div>
              <div className="text-sm font-semibold text-gray-700">
                Booking Details
              </div>
            </div>
            <div
              className={`flex-1 h-1 mx-4 rounded transition-all ${step >= 3 ? "bg-gradient-to-r from-primary-light to-primary" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex flex-col items-center gap-2 z-10 ${step >= 3 ? "" : ""}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all ${step >= 3 ? "bg-gradient-to-br from-primary-light to-primary text-white shadow-lg" : "bg-gray-200 text-gray-600"}`}
              >
                3
              </div>
              <div className="text-sm font-semibold text-gray-700">
                Special Requests
              </div>
            </div>
            <div
              className={`flex-1 h-1 mx-4 rounded transition-all ${step >= 4 ? "bg-gradient-to-r from-primary-light to-primary" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex flex-col items-center gap-2 z-10 ${step >= 4 ? "" : ""}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all ${step >= 4 ? "bg-gradient-to-br from-primary-light to-primary text-white shadow-lg" : "bg-gray-200 text-gray-600"}`}
              >
                4
              </div>
              <div className="text-sm font-semibold text-gray-700">
                Confirmation
              </div>
            </div>
          </div>

          {/* Step 1: Guest Information */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-8">
              <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                <FaUser /> Guest Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={bookingData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaEnvelope /> Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaPhone /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleChange}
                    placeholder="+94 XX XXX XXXX"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt /> Address *
                  </label>
                  <textarea
                    name="address"
                    value={bookingData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    rows="3"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  Next Step →
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Booking Details */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-8">
              <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                <FaBed /> Booking Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaCalendarAlt /> Check-in Date *
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaCalendarAlt /> Check-out Date *
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleChange}
                    min={bookingData.checkIn}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaBed /> Room Type *
                  </label>
                  <select
                    name="roomType"
                    value={bookingData.roomType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  >
                    <option value="Standard Room">
                      Standard Room - Rs. 15,000/night
                    </option>
                    <option value="Deluxe Ocean View">
                      Deluxe Ocean View - Rs. 25,000/night
                    </option>
                    <option value="Suite">Suite - Rs. 40,000/night</option>
                    <option value="Presidential Suite">
                      Presidential Suite - Rs. 50,000/night
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaUser /> Number of Guests *
                  </label>
                  <select
                    name="numberOfGuests"
                    value={bookingData.numberOfGuests}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between gap-4 pt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-primary-light to-primary text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  Next Step →
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Special Requests */}
          {step === 3 && (
            <form onSubmit={handleNextStep} className="space-y-8">
              <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                <FaHeart /> Special Requests & Add-ons
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block font-semibold text-primary mb-4 text-lg">
                    Choose Special Package (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() =>
                          setBookingData({
                            ...bookingData,
                            selectedPackage:
                              bookingData.selectedPackage === pkg.id
                                ? null
                                : pkg.id,
                          })
                        }
                        className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 hover:shadow-lg ${
                          bookingData.selectedPackage === pkg.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-gray-200 hover:border-primary-light"
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 -right-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                            Popular
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{pkg.icon}</span>
                            <div>
                              <h3 className="font-bold text-primary text-lg">
                                {pkg.name}
                              </h3>
                              <p className="text-accent font-semibold text-xl">
                                Rs. {pkg.price.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              bookingData.selectedPackage === pkg.id
                                ? "border-primary bg-primary"
                                : "border-gray-300"
                            }`}
                          >
                            {bookingData.selectedPackage === pkg.id && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5 mt-4">
                          {pkg.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <span className="text-green-500">✓</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {bookingData.selectedPackage && (
                    <p className="text-sm text-primary-light mt-3 bg-primary-light/10 p-3 rounded-lg flex items-center gap-2">
                      <span className="text-lg">ℹ️</span>
                      <span>
                        Selected package will be added to your total booking
                        cost
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaUtensils /> Food Preferences
                  </label>
                  <div className="space-y-3">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        value="breakfast"
                        checked={bookingData.foodPreference.includes(
                          "breakfast",
                        )}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary-light border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary-light"
                      />
                      <span className="text-gray-700">
                        Breakfast (Included)
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        value="lunch"
                        checked={bookingData.foodPreference.includes("lunch")}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary-light border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary-light"
                      />
                      <span className="text-gray-700">
                        Lunch (+Rs. 2,500/day)
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        value="dinner"
                        checked={bookingData.foodPreference.includes("dinner")}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary-light border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary-light"
                      />
                      <span className="text-gray-700">
                        Dinner (+Rs. 3,500/day)
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-primary mb-2 flex items-center gap-2">
                    <FaCocktail /> Drink Package
                  </label>
                  <select
                    name="drinkPackage"
                    value={bookingData.drinkPackage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  >
                    <option value="none">No Drinks Package</option>
                    <option value="basic">Basic Package - Rs. 5,000/day</option>
                    <option value="premium">
                      Premium Package - Rs. 10,000/day
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-primary mb-2">
                    Additional Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleChange}
                    placeholder="Any special requirements or requests..."
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-4 pt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-primary-light to-primary text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  Review Booking →
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-primary text-center">
                Review Your Booking
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="review-card">
                  <h3>Guest Information</h3>
                  <p>
                    <strong>Name:</strong> {bookingData.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {bookingData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {bookingData.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {bookingData.address}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                  <h3 className="text-xl font-bold text-primary mb-4">
                    Booking Details
                  </h3>
                  <p className="mb-2">
                    <strong className="text-gray-700">Check-in:</strong>{" "}
                    {bookingData.checkIn}
                  </p>
                  <p className="mb-2">
                    <strong className="text-gray-700">Check-out:</strong>{" "}
                    {bookingData.checkOut}
                  </p>
                  <p className="mb-2">
                    <strong className="text-gray-700">Room Type:</strong>{" "}
                    {bookingData.roomType}
                  </p>
                  <p className="mb-2">
                    <strong className="text-gray-700">Guests:</strong>{" "}
                    {bookingData.numberOfGuests}
                  </p>
                  <p className="mb-2">
                    <strong className="text-gray-700">Nights:</strong>{" "}
                    {calculateTotal().nights}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                  <h3 className="text-xl font-bold text-primary mb-4">
                    Special Requests
                  </h3>
                  <p className="mb-2">
                    <strong className="text-gray-700">Package:</strong>{" "}
                    {bookingData.selectedPackage
                      ? packages.find(
                          (p) => p.id === bookingData.selectedPackage,
                        )?.name
                      : "None"}
                  </p>
                  <p className="mb-2">
                    <strong className="text-gray-700">Food:</strong>{" "}
                    {bookingData.foodPreference.length > 0
                      ? bookingData.foodPreference.join(", ")
                      : "None"}
                  </p>
                  <p className="mb-2">
                    <strong className="text-gray-700">Drinks:</strong>{" "}
                    {bookingData.drinkPackage === "none"
                      ? "None"
                      : bookingData.drinkPackage}
                  </p>
                  {bookingData.specialRequests && (
                    <p className="mb-2">
                      <strong className="text-gray-700">Notes:</strong>{" "}
                      {bookingData.specialRequests}
                    </p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-primary-light/5 p-6 rounded-xl border-2 border-primary-light">
                  <h3 className="text-xl font-bold text-primary mb-4">
                    Price Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="price-row">
                      <span>Room ({calculateTotal().nights} nights)</span>
                      <span>
                        Rs.{" "}
                        {(
                          calculateTotal().roomPrice * calculateTotal().nights
                        ).toLocaleString()}
                      </span>
                    </div>
                    {bookingData.specialType !== "none" && (
                      <div className="flex justify-between text-gray-700">
                        <span>Special Package</span>
                        <span className="font-semibold">
                          Rs.{" "}
                          {bookingData.specialType === "honeymoon"
                            ? "25,000"
                            : "20,000"}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-primary border-t-2 border-primary-light pt-3 mt-3">
                      <span>Total Amount</span>
                      <span className="text-accent">
                        Rs. {calculateTotal().total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-4 pt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-10 py-4 bg-gradient-to-r from-accent to-yellow-400 text-primary rounded-full font-bold text-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookRooms;
