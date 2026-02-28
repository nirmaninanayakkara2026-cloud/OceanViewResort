import { useState, useEffect } from "react";
import {
  FaUtensils,
  FaSearch,
  FaShoppingCart,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { foodAPI } from "../services/api";

const OrderFoods = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomNumber, setRoomNumber] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getAllFoodItems();
      setMenuItems(response.data || []);
    } catch (error) {
      console.error("Error fetching food items:", error);
      alert("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Items", icon: "🍽️" },
    { id: "breakfast", name: "Breakfast", icon: "🍳" },
    { id: "lunch", name: "Lunch", icon: "🍛" },
    { id: "dinner", name: "Dinner", icon: "🍖" },
    { id: "dessert", name: "Desserts", icon: "🍰" },
    { id: "beverage", name: "Beverages", icon: "🥤" },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find((cartItem) => cartItem.id === itemId);
    if (existingItem.quantity === 1) {
      setCart(cart.filter((cartItem) => cartItem.id !== itemId));
    } else {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem,
        ),
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!roomNumber.trim()) {
      alert("Please enter your room number!");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login to place an order");
        window.location.href = "/login";
        return;
      }

      const orderData = {
        userId: user.id,
        guestName: user.fullName,
        roomNumber: roomNumber.trim(),
        items: cart.map((item) => ({
          foodItemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: getTotalPrice(),
        deliveryInstructions: deliveryInstructions.trim() || "",
        status: "PENDING",
      };

      await foodAPI.createFoodOrder(orderData);
      alert(
        "Order placed successfully! Your food will be delivered to your room.",
      );
      setCart([]);
      setShowCart(false);
      setShowCheckoutForm(false);
      setRoomNumber("");
      setDeliveryInstructions("");
    } catch (error) {
      console.error("Error placing order:", error);
      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white py-16 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">
          <FaUtensils className="inline mb-2" /> Order Foods & Beverages
        </h1>
        <p className="text-xl opacity-90">
          Delicious cuisine delivered to your room
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-8">
        {/* Search and Filter */}
        <div className="flex gap-4 -mt-8 relative z-10 flex-wrap">
          <div className="flex-1 flex items-center gap-4 bg-white py-4 px-6 rounded-full shadow-lg min-w-[300px]">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
          </div>

          <button
            className="relative flex items-center gap-3 py-4 px-8 bg-white border-2 border-primary-light rounded-full text-primary-light font-semibold hover:bg-primary-light hover:text-white transition-all duration-300"
            onClick={() => setShowCart(!showCart)}
          >
            <FaShoppingCart />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {getTotalItems()}
              </span>
            )}
            View Cart
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-primary-light to-primary text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-primary/10 hover:text-primary"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="text-2xl">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-primary/5 to-accent/10 text-8xl flex items-center justify-center py-8">
                {item.image}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">
                    Rs. {item.price}
                  </span>
                  <button
                    className="flex items-center gap-2 px-5 py-2 bg-primary-light text-white rounded-full font-semibold hover:bg-primary hover:-translate-y-1 transition-all duration-300"
                    onClick={() => addToCart(item)}
                  >
                    <FaPlus /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center col-span-full">
            <p className="text-gray-600 text-lg">
              No items found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex justify-end"
          onClick={() => setShowCart(false)}
        >
          <div
            className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Order</h2>
              <button
                className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-3xl transition-colors"
                onClick={() => setShowCart(false)}
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <FaShoppingCart className="text-8xl mb-6 opacity-30" />
                  <p className="text-xl">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl mb-4"
                  >
                    <div className="bg-gradient-to-br from-primary/5 to-accent/10 text-4xl w-16 h-16 flex items-center justify-center rounded-lg">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary">{item.name}</h4>
                      <p className="text-accent font-semibold">
                        Rs. {item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white rounded-full px-3 py-2 shadow-md">
                      <button
                        className="text-red-500 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaMinus />
                      </button>
                      <span className="font-bold text-primary w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="text-green-500 hover:bg-green-50 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                        onClick={() => addToCart(item)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
                {!showCheckoutForm ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-700">
                        Total:
                      </span>
                      <span className="text-3xl font-bold text-accent">
                        Rs. {getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <button
                      className="w-full px-8 py-4 bg-gradient-to-r from-primary-light to-primary text-white rounded-full font-bold text-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                      onClick={() => setShowCheckoutForm(true)}
                    >
                      Proceed to Checkout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Room Number *
                        </label>
                        <input
                          type="text"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          placeholder="Enter your room number"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Delivery Instructions (Optional)
                        </label>
                        <textarea
                          value={deliveryInstructions}
                          onChange={(e) =>
                            setDeliveryInstructions(e.target.value)
                          }
                          placeholder="Any special instructions for delivery..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                          rows="3"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-700">
                        Total:
                      </span>
                      <span className="text-3xl font-bold text-accent">
                        Rs. {getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-400 transition-all duration-300"
                        onClick={() => setShowCheckoutForm(false)}
                      >
                        Back
                      </button>
                      <button
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-light to-primary text-white rounded-full font-bold hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                        onClick={handleCheckout}
                      >
                        Place Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFoods;
