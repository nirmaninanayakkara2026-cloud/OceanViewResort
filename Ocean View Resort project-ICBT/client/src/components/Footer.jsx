import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0a3d5f] to-primary text-white py-12 mt-16">
      <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-2xl mb-4 text-accent">Ocean View Resort</h3>
          <p className="leading-relaxed opacity-90 mb-4">
            Experience luxury and comfort at Galle's finest beachside resort.
            Your perfect getaway awaits.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              aria-label="Facebook"
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white text-xl transition-all duration-300 hover:bg-accent hover:text-primary hover:-translate-y-1"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white text-xl transition-all duration-300 hover:bg-accent hover:text-primary hover:-translate-y-1"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white text-xl transition-all duration-300 hover:bg-accent hover:text-primary hover:-translate-y-1"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xl mb-4 text-accent">Quick Links</h4>
          <ul className="list-none p-0">
            <li className="mb-3">
              <a
                href="/check-availability"
                className="text-white no-underline opacity-90 transition-all duration-300 hover:opacity-100 hover:text-accent hover:pl-1"
              >
                Check Availability
              </a>
            </li>
            <li className="mb-3">
              <a
                href="/book-rooms"
                className="text-white no-underline opacity-90 transition-all duration-300 hover:opacity-100 hover:text-accent hover:pl-1"
              >
                Book Rooms
              </a>
            </li>
            <li className="mb-3">
              <a
                href="/order-foods"
                className="text-white no-underline opacity-90 transition-all duration-300 hover:opacity-100 hover:text-accent hover:pl-1"
              >
                Order Foods
              </a>
            </li>
            <li className="mb-3">
              <a
                href="/packages"
                className="text-white no-underline opacity-90 transition-all duration-300 hover:opacity-100 hover:text-accent hover:pl-1"
              >
                Packages
              </a>
            </li>
            <li className="mb-3">
              <a
                href="/gallery"
                className="text-white no-underline opacity-90 transition-all duration-300 hover:opacity-100 hover:text-accent hover:pl-1"
              >
                Gallery
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl mb-4 text-accent">Contact Us</h4>
          <ul className="list-none p-0">
            <li className="flex items-start gap-3 mb-3 opacity-90">
              <FaMapMarkerAlt className="mt-1 text-accent flex-shrink-0" />
              <span>Beach Road, Galle, Sri Lanka</span>
            </li>
            <li className="flex items-start gap-3 mb-3 opacity-90">
              <FaPhone className="mt-1 text-accent flex-shrink-0" />
              <span>+94 91 234 5678</span>
            </li>
            <li className="flex items-start gap-3 mb-3 opacity-90">
              <FaEnvelope className="mt-1 text-accent flex-shrink-0" />
              <span>info@oceanviewresort.lk</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl mb-4 text-accent">Newsletter</h4>
          <p className="mb-4">Subscribe to get special offers and updates</p>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="p-3 border-0 rounded bg-white/10 text-white border border-white/20 placeholder:text-white/60 focus:outline-none focus:border-accent focus:bg-white/15"
            />
            <button
              type="submit"
              className="p-3 bg-accent text-primary border-0 rounded font-semibold cursor-pointer transition-all duration-300 hover:bg-yellow-300 hover:-translate-y-0.5"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 px-8 flex flex-wrap justify-between items-center gap-4 max-w-[1400px] mx-auto">
        <p className="m-0 opacity-80">
          &copy; 2026 Ocean View Resort. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-white no-underline opacity-80 transition-opacity duration-300 hover:opacity-100 hover:text-accent"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-white no-underline opacity-80 transition-opacity duration-300 hover:opacity-100 hover:text-accent"
          >
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
