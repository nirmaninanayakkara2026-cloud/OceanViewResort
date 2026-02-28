import { FaCamera } from "react-icons/fa";

const Gallery = () => {
  const galleryImages = [
    { id: 1, category: "rooms", title: "Deluxe Ocean View", emoji: "🏨" },
    { id: 2, category: "rooms", title: "Presidential Suite", emoji: "👑" },
    { id: 3, category: "rooms", title: "Standard Room", emoji: "🛏️" },
    { id: 4, category: "beach", title: "Private Beach", emoji: "🏖️" },
    { id: 5, category: "beach", title: "Beach Sunset", emoji: "🌅" },
    { id: 6, category: "beach", title: "Beach Activities", emoji: "🏄" },
    { id: 7, category: "dining", title: "Restaurant", emoji: "🍽️" },
    { id: 8, category: "dining", title: "Beach Bar", emoji: "🍹" },
    { id: 9, category: "dining", title: "Fine Dining", emoji: "🥘" },
    { id: 10, category: "facilities", title: "Swimming Pool", emoji: "🏊" },
    { id: 11, category: "facilities", title: "Spa & Wellness", emoji: "💆" },
    { id: 12, category: "facilities", title: "Fitness Center", emoji: "💪" },
    { id: 13, category: "events", title: "Wedding Setup", emoji: "💒" },
    { id: 14, category: "events", title: "Conference Hall", emoji: "🎤" },
    { id: 15, category: "events", title: "Beach Party", emoji: "🎉" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-16 px-8 text-center">
        <h1>
          <FaCamera /> Photo Gallery
        </h1>
        <p>Explore the beauty of Ocean View Resort</p>
      </div>

      <div className="max-w-[1400px] mx-auto px-8">
        <div className="my-12 text-center">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Experience Paradise
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Take a visual journey through our stunning resort. From luxurious
            rooms to pristine beaches, discover what makes Ocean View Resort the
            perfect destination for your next getaway.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {galleryImages.map((image) => (
            <div key={image.id} className="gallery-item">
              <div className="gallery-image">
                <span className="gallery-emoji">{image.emoji}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {image.title}
                </h3>
                <p className="text-white/90 uppercase text-sm tracking-wider">
                  {image.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary to-primary-light text-white p-16 rounded-3xl text-center shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Experience It Yourself?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your stay today and create your own memories
          </p>
          <a
            href="/book-rooms"
            className="inline-block px-10 py-5 bg-accent text-primary rounded-full font-bold text-lg hover:bg-yellow-300 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
