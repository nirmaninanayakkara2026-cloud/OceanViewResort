import { useState } from "react";
import { FaHeart, FaGift, FaUsers, FaCheck, FaStar } from "react-icons/fa";

const BuyPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    specialRequests: "",
  });

  const packages = [
    {
      id: 1,
      name: "Honeymoon Paradise",
      icon: "💑",
      price: 80000,
      duration: "3 Days / 2 Nights",
      category: "romance",
      description: "Perfect romantic getaway for newlyweds",
      features: [
        "Deluxe Ocean View Room",
        "Romantic room decoration with flowers & candles",
        "Complimentary champagne",
        "Couple spa treatment",
        "Private candlelight dinner on the beach",
        "Breakfast in bed",
        "Late checkout (4 PM)",
        "Honeymoon cake",
        "Professional photoshoot (2 hours)",
      ],
      popular: true,
    },
    {
      id: 2,
      name: "Anniversary Celebration",
      icon: "🎉",
      price: 60000,
      duration: "2 Days / 1 Night",
      category: "romance",
      description: "Celebrate your special milestone",
      features: [
        "Deluxe Room with ocean view",
        "Anniversary cake & flowers",
        "Romantic room decoration",
        "Complimentary wine",
        "Couple spa massage",
        "Special anniversary dinner",
        "Breakfast included",
        "Personalized greeting card",
      ],
      popular: false,
    },
    {
      id: 3,
      name: "Family Fun Package",
      icon: "👨‍👩‍👧‍👦",
      price: 100000,
      duration: "4 Days / 3 Nights",
      category: "family",
      description: "Unforgettable family vacation experience",
      features: [
        "2 Interconnected Deluxe Rooms",
        "All meals included (breakfast, lunch, dinner)",
        "Kids activities program",
        "Beach sports equipment",
        "Family cycling tour",
        "Boat ride",
        "Welcome fruit basket",
        "Free WiFi",
        "Complimentary extra bed for children",
      ],
      popular: true,
    },
    {
      id: 4,
      name: "Weekend Escape",
      icon: "🏖️",
      price: 45000,
      duration: "2 Days / 1 Night",
      category: "relaxation",
      description: "Quick weekend relaxation",
      features: [
        "Standard or Deluxe Room",
        "Breakfast included",
        "Welcome drink",
        "Access to swimming pool",
        "Beach access",
        "Free WiFi",
        "Complimentary parking",
        "10% discount on spa services",
      ],
      popular: false,
    },
    {
      id: 5,
      name: "Wellness Retreat",
      icon: "🧘",
      price: 95000,
      duration: "5 Days / 4 Nights",
      category: "wellness",
      description: "Rejuvenate your mind, body and soul",
      features: [
        "Deluxe Ocean View Room",
        "Daily yoga sessions",
        "Full body massage treatments",
        "Healthy meal plan (all meals)",
        "Meditation sessions",
        "Spa access",
        "Wellness consultation",
        "Herbal tea selection",
        "Wellness goodie bag",
      ],
      popular: false,
    },
    {
      id: 6,
      name: "Adventure Package",
      icon: "🏄",
      price: 75000,
      duration: "3 Days / 2 Nights",
      category: "adventure",
      description: "For thrill-seekers and adventure lovers",
      features: [
        "Standard Room",
        "Surfing lessons",
        "Snorkeling equipment & tour",
        "Kayaking experience",
        "Beach volleyball",
        "Breakfast & lunch included",
        "Adventure guide",
        "GoPro camera rental",
        "Energy drink pack",
      ],
      popular: false,
    },
  ];

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowBookingForm(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Package "${selectedPackage.name}" booked successfully! Confirmation sent to ${formData.email}`,
    );
    setShowBookingForm(false);
    setSelectedPackage(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      specialRequests: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-16 px-8 text-center">
        <h1>
          <FaGift /> Special Packages
        </h1>
        <p>Exclusive deals for an unforgettable experience</p>
      </div>

      <div className="max-w-[1400px] mx-auto px-8">
        {/* Filter Buttons */}
        <div className="flex gap-4 mb-12 flex-wrap justify-center -mt-8 relative z-10">
          <button className="filter-btn active">All Packages</button>
          <button className="filter-btn">Romance</button>
          <button className="filter-btn">Family</button>
          <button className="filter-btn">Wellness</button>
          <button className="filter-btn">Adventure</button>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl p-10 shadow-lg hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 flex flex-col relative ${pkg.popular ? "border-4 border-accent" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 right-5 bg-gradient-to-r from-accent to-yellow-300 text-primary py-2 px-6 rounded-full font-bold flex items-center gap-2 shadow-lg">
                  <FaStar /> Most Popular
                </div>
              )}

              <div className="package-icon-large">{pkg.icon}</div>

              <h2>{pkg.name}</h2>
              <p className="package-description">{pkg.description}</p>

              <div className="package-price">
                <span className="price-amount">
                  Rs. {pkg.price.toLocaleString()}
                </span>
                <span className="price-duration">{pkg.duration}</span>
              </div>

              <div className="package-features">
                <h3>Package Includes:</h3>
                <ul>
                  {pkg.features.map((feature, index) => (
                    <li key={index}>
                      <FaCheck className="check-icon" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="book-package-btn"
                onClick={() => handlePackageSelect(pkg)}
              >
                Book This Package
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowBookingForm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-light text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Book {selectedPackage.name}
                </h2>
                <p className="text-white/90">
                  Rs. {selectedPackage.price.toLocaleString()} -{" "}
                  {selectedPackage.duration}
                </p>
              </div>
              <button
                className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-colors"
                onClick={() => setShowBookingForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block font-semibold text-primary mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-primary mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+94 XX XXX XXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-primary mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-primary mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    min={formData.checkIn}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-primary mb-2">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any special requirements..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-primary-light to-primary text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyPackages;
