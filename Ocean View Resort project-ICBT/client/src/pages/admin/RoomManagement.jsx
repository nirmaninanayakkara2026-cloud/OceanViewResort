import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { roomAPI } from "../../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBed,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    description: "",
    pricePerNight: "",
    capacity: "",
    amenities: "",
    imageUrl: "🏠",
    totalRooms: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.getAllRooms();
      setRooms(response.data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      alert("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomData = {
      type: formData.type,
      name: formData.name,
      description: formData.description,
      pricePerNight: parseFloat(formData.pricePerNight),
      capacity: parseInt(formData.capacity),
      amenities: formData.amenities.split(",").map((a) => a.trim()),
      imageUrl: formData.imageUrl,
      totalRooms: parseInt(formData.totalRooms),
      availableRooms: parseInt(formData.totalRooms), // Initially all available
      active: true,
    };

    try {
      if (editingRoom) {
        await roomAPI.updateRoom(editingRoom.id, roomData);
        alert("Room updated successfully!");
      } else {
        await roomAPI.createRoom(roomData);
        alert("Room added successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      alert(error.response?.data?.message || "Failed to save room");
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      type: room.type,
      name: room.name,
      description: room.description,
      pricePerNight: room.pricePerNight?.toString() || "",
      capacity: room.capacity?.toString() || "",
      amenities: room.amenities?.join(", ") || "",
      imageUrl: room.imageUrl || "🏠",
      totalRooms: room.totalRooms?.toString() || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (roomId) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      await roomAPI.deleteRoom(roomId);
      alert("Room deleted successfully!");
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      alert(error.response?.data?.message || "Failed to delete room");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      name: "",
      description: "",
      price: "",
      capacity: "",
      amenities: "",
      icon: "🏠",
      totalRooms: "",
    });
    setEditingRoom(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading rooms...</p>
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
              Room Management
            </h1>
            <p className="text-gray-600">Manage hotel rooms and room types</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-light to-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <FaPlus /> Add New Room
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{room.imageUrl || "🏠"}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {room.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{room.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold">
                      Rs. {room.pricePerNight?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold">
                      {room.capacity || 0} guests
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rooms:</span>
                    <span className="font-semibold">
                      {room.availableRooms || 0}/{room.totalRooms || 0}{" "}
                      available
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">
                    Amenities:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities?.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{room.amenities?.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {room.active ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <FaCheck /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-sm font-semibold">
                      <FaTimes /> Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <FaBed className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No rooms added yet</p>
            <p className="text-gray-500 text-sm">
              Click "Add New Room" to get started
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingRoom ? "Edit Room" : "Add New Room"}
              </h2>
              <button
                onClick={handleModalClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Type
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    placeholder="e.g., Standard Room"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Standard Room"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Room description"
                  required
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={formData.pricePerNight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricePerNight: e.target.value,
                      })
                    }
                    placeholder="15000"
                    required
                    min="0"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Capacity (guests)
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    placeholder="2"
                    required
                    min="1"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Rooms
                  </label>
                  <input
                    type="number"
                    value={formData.totalRooms}
                    onChange={(e) =>
                      setFormData({ ...formData, totalRooms: e.target.value })
                    }
                    placeholder="10"
                    required
                    min="1"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="🏠"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amenities (comma-separated)
                </label>
                <textarea
                  value={formData.amenities}
                  onChange={(e) =>
                    setFormData({ ...formData, amenities: e.target.value })
                  }
                  placeholder="WiFi, TV, Air Conditioning, Mini Fridge"
                  required
                  rows="2"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-light to-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {editingRoom ? "Update Room" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default RoomManagement;
