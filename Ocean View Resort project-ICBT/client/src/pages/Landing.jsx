import { Link } from "react-router-dom";
import {
  FaUmbrellaBeach,
  FaConciergeBell,
  FaUtensils,
  FaCalendarCheck,
  FaStar,
  FaSwimmingPool,
  FaWifi,
  FaCocktail,
} from "react-icons/fa";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center text-white px-8 max-w-3xl">
          <h1 className="text-6xl mb-4 font-bold drop-shadow-lg">
            Welcome to Ocean View Resort
          </h1>
          <p className="text-2xl mb-8 opacity-95 drop-shadow-md">
            Experience luxury and tranquility by the beautiful beaches of Galle
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/book-rooms" className="btn btn-primary">
              Book Now
            </Link>
            <Link to="/check-availability" className="btn btn-secondary">
              Check Availability
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-8 bg-white -mt-12 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/check-availability" className="action-card">
              <FaCalendarCheck className="action-icon" />
              <h3 className="text-xl font-bold text-primary mb-2">
                Check Availability
              </h3>
              <p className="text-gray-600">Find your perfect room</p>
            </Link>
            <Link
              to="/book-rooms"
              className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-2xl text-center no-underline text-primary transition-all duration-300 shadow-md hover:-translate-y-3 hover:shadow-xl"
            >
              <FaUmbrellaBeach className="text-5xl text-primary-light mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">
                Book Rooms
              </h3>
              <p className="text-gray-600">Reserve your stay</p>
            </Link>
            <Link
              to="/order-foods"
              className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-2xl text-center no-underline text-primary transition-all duration-300 shadow-md hover:-translate-y-3 hover:shadow-xl"
            >
              <FaUtensils className="text-5xl text-primary-light mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">
                Order Foods
              </h3>
              <p className="text-gray-600">Delicious cuisine</p>
            </Link>
            <Link
              to="/packages"
              className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-2xl text-center no-underline text-primary transition-all duration-300 shadow-md hover:-translate-y-3 hover:shadow-xl"
            >
              <FaConciergeBell className="text-5xl text-primary-light mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Packages</h3>
              <p className="text-gray-600">Special offers</p>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-4">
                About Ocean View Resort
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Nestled on the pristine beaches of Galle, Ocean View Resort
                offers an unparalleled experience of luxury and comfort. Our
                resort features world-class amenities, stunning ocean views, and
                exceptional service that makes every stay memorable.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're planning a romantic getaway, family vacation, or
                celebrating a special occasion, our dedicated team ensures your
                experience exceeds expectations.
              </p>
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-3 text-lg text-gray-700">
                  <FaStar /> <span>5-Star Luxury Rooms</span>
                </div>
                <div className="feature-item">
                  <FaSwimmingPool /> <span>Infinity Pool & Spa</span>
                </div>
                <div className="feature-item">
                  <FaUtensils /> <span>Fine Dining Restaurant</span>
                </div>
                <div className="feature-item">
                  <FaWifi /> <span>Free High-Speed WiFi</span>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-primary-light to-primary rounded-3xl h-[400px] flex flex-col items-center justify-center text-white shadow-2xl">
                <FaUmbrellaBeach className="text-9xl mb-4 opacity-80" />
                <p className="text-2xl font-semibold">Resort Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types Preview */}
      <section className="py-16 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-5xl text-center text-primary mb-4">
            Our Accommodation
          </h2>
          <p className="text-center text-gray-600 text-xl mb-12">
            Choose from our carefully designed rooms and suites
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="room-card">
              <div className="room-image">
                <div className="image-placeholder">Standard Room</div>
              </div>
              <div className="room-info">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Standard Room
                </h3>
                <p className="text-3xl font-bold text-accent mb-4">
                  Rs. 15,000{" "}
                  <span className="text-lg text-gray-500 font-normal">
                    / night
                  </span>
                </p>
                <p className="text-gray-600 mb-4">
                  Comfortable rooms with garden view, perfect for solo travelers
                  or couples.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Queen Size Bed</li>
                  <li>• Air Conditioning</li>
                  <li>• Free WiFi</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl relative">
              <div className="absolute -top-3 right-5 bg-gradient-to-r from-accent to-yellow-300 text-primary py-2 px-6 rounded-full font-bold flex items-center gap-2 shadow-lg z-10">
                Popular
              </div>
              <div className="h-56 bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                <div className="text-2xl font-semibold text-white">
                  Deluxe Ocean View
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Deluxe Ocean View
                </h3>
                <p className="text-3xl font-bold text-accent mb-4">
                  Rs. 25,000{" "}
                  <span className="text-lg text-gray-500 font-normal">
                    / night
                  </span>
                </p>
                <p className="text-gray-600 mb-4">
                  Spacious rooms with breathtaking ocean views and premium
                  amenities.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• King Size Bed</li>
                  <li>• Private Balcony</li>
                  <li>• Mini Bar</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">
              <div className="h-56 bg-gradient-to-br from-purple-200 to-purple-400 flex items-center justify-center">
                <div className="text-2xl font-semibold text-white">
                  Presidential Suite
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Presidential Suite
                </h3>
                <p className="text-3xl font-bold text-accent mb-4">
                  Rs. 50,000{" "}
                  <span className="text-lg text-gray-500 font-normal">
                    / night
                  </span>
                </p>
                <p className="text-gray-600 mb-4">
                  Ultimate luxury with separate living area and exclusive
                  services.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• 2 Bedrooms</li>
                  <li>• Jacuzzi</li>
                  <li>• Butler Service</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/book-rooms"
              className="inline-block px-8 py-4 bg-accent text-primary rounded-full font-semibold hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Special Packages */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-5xl text-center text-primary mb-4">
            Special Packages
          </h2>
          <p className="text-center text-gray-600 text-xl mb-12">
            Make your celebration extra special
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="package-card">
              <div className="package-icon">💑</div>
              <h3 className="text-2xl font-bold text-primary mb-3">
                Honeymoon Package
              </h3>
              <p className="text-gray-600 mb-4">
                Romantic setup with champagne, flowers, and special amenities
              </p>
              <p className="text-2xl font-bold text-accent mb-4">
                Starting from Rs. 80,000
              </p>
              <Link
                to="/packages"
                className="text-primary-light font-semibold hover:text-primary"
              >
                Learn More →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-primary mb-3">
                Anniversary Celebration
              </h3>
              <p className="text-gray-600 mb-4">
                Celebrate your love with candlelight dinner and spa treatment
              </p>
              <p className="text-2xl font-bold text-accent mb-4">
                Starting from Rs. 60,000
              </p>
              <Link
                to="/packages"
                className="text-primary-light font-semibold hover:text-primary"
              >
                Learn More →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 text-center">
              <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold text-primary mb-3">
                Family Package
              </h3>
              <p className="text-gray-600 mb-4">
                Fun activities and dining options perfect for family vacations
              </p>
              <p className="text-2xl font-bold text-accent mb-4">
                Starting from Rs. 100,000
              </p>
              <Link
                to="/packages"
                className="text-primary-light font-semibold hover:text-primary"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 px-8">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-5xl text-center text-primary mb-12">
            Resort Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="amenity-item">
              <FaSwimmingPool className="amenity-icon" />
              <h4 className="font-semibold text-gray-700">Swimming Pool</h4>
            </div>
            <div className="text-center">
              <FaCocktail className="text-5xl text-primary-light mx-auto mb-3" />
              <h4 className="font-semibold text-gray-700">Beach Bar</h4>
            </div>
            <div className="text-center">
              <FaUtensils className="text-5xl text-primary-light mx-auto mb-3" />
              <h4 className="font-semibold text-gray-700">Restaurant</h4>
            </div>
            <div className="text-center">
              <FaWifi className="text-5xl text-primary-light mx-auto mb-3" />
              <h4 className="font-semibold text-gray-700">Free WiFi</h4>
            </div>
            <div className="text-center">
              <FaConciergeBell className="text-5xl text-primary-light mx-auto mb-3" />
              <h4 className="font-semibold text-gray-700">24/7 Service</h4>
            </div>
            <div className="text-center">
              <FaUmbrellaBeach className="text-5xl text-primary-light mx-auto mb-3" />
              <h4>Private Beach</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-8 bg-gradient-to-r from-primary to-primary-light text-white text-center">
        <div className="max-w-[1400px] mx-auto">
          <h2>Ready to Book Your Dream Vacation?</h2>
          <p>Limited time offers available. Book now and save up to 30%!</p>
          <Link to="/book-rooms" className="btn btn-primary btn-large">
            Book Your Stay Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
