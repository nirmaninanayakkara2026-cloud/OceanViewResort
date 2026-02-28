import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-16 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl opacity-90">
          We're here to help and answer any questions you might have
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 my-12">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Get In Touch</h2>
            <p className="contact-intro">
              Have a question or need assistance? Our friendly team is always
              ready to help you plan your perfect getaway.
            </p>

            <div className="contact-cards">
              <div className="info-card">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3>Visit Us</h3>
                <p>
                  Beach Road, Galle
                  <br />
                  Sri Lanka
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <h3>Call Us</h3>
                <p>
                  +94 91 234 5678
                  <br />
                  +94 77 123 4567
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <h3>Email Us</h3>
                <p>
                  info@oceanviewresort.lk
                  <br />
                  reservations@oceanviewresort.lk
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaClock />
                </div>
                <h3>Working Hours</h3>
                <p>
                  24/7 Reception
                  <br />
                  Always here for you
                </p>
              </div>
            </div>

            <div className="map-section">
              <div className="map-placeholder">
                <FaMapMarkerAlt className="map-icon" />
                <p>Ocean View Resort, Galle</p>
                <p className="map-note">
                  Interactive map would be integrated here
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold text-primary mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-primary mb-2">
                    Email Address *
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
                  <label className="block font-semibold text-primary mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94 XX XXX XXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-primary mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-primary mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows="6"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-primary-light to-primary text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <FaPaperPlane /> Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>What time is check-in and check-out?</h3>
              <p>
                Check-in is at 2:00 PM and check-out is at 12:00 PM. Early
                check-in and late check-out may be available upon request.
              </p>
            </div>
            <div className="faq-item">
              <h3>Do you offer airport transfers?</h3>
              <p>
                Yes, we provide airport transfer services from Colombo Airport.
                Please contact us to arrange your transfer.
              </p>
            </div>
            <div className="faq-item">
              <h3>Is parking available?</h3>
              <p>Yes, we offer complimentary parking for all our guests.</p>
            </div>
            <div className="faq-item">
              <h3>Do you have WiFi?</h3>
              <p>
                Yes, high-speed WiFi is available throughout the resort free of
                charge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
