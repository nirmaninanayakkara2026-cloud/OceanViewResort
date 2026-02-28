# Ocean View Resort - Backend API

Spring Boot REST API for Ocean View Resort management system with MongoDB Atlas integration.

## 🚀 Technology Stack

- **Java 21**
- **Spring Boot 3.2.2**
- **MongoDB Atlas**
- **Spring Security + JWT**
- **Maven**
- **Lombok**

## 📋 Prerequisites

- Java 21 or higher
- Maven 3.8+
- MongoDB Atlas account
- IDE (IntelliJ IDEA recommended)

## ⚙️ MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" and choose "Connect your application"
4. Copy the connection string
5. Update `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster-url>/oceanview_resort?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<cluster-url>` with your MongoDB Atlas credentials.

## 🛠️ Installation & Setup

1. **Clone the repository**

```bash
cd server
```

2. **Configure MongoDB Connection**
   - Open `src/main/resources/application.properties`
   - Update MongoDB URI with your credentials

3. **Install dependencies**

```bash
mvn clean install
```

4. **Run the application**

```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Rooms

- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/{id}` - Get room by ID
- `GET /api/rooms/type/{type}` - Get room by type
- `POST /api/rooms` - Create new room (Admin)
- `PUT /api/rooms/{id}` - Update room (Admin)
- `DELETE /api/rooms/{id}` - Delete room (Admin)

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/reservation/{number}` - Get by reservation number
- `GET /api/bookings/email/{email}` - Get bookings by email
- `POST /api/bookings/check-availability` - Check room availability
- `PATCH /api/bookings/{id}/status` - Update booking status
- `DELETE /api/bookings/{id}` - Cancel booking

### Packages

- `GET /api/packages` - Get all packages
- `GET /api/packages/{id}` - Get package by ID
- `GET /api/packages/package/{packageId}` - Get by package ID
- `GET /api/packages/popular` - Get popular packages
- `POST /api/packages` - Create package (Admin)
- `PUT /api/packages/{id}` - Update package (Admin)
- `DELETE /api/packages/{id}` - Delete package (Admin)

### Food & Orders

- `GET /api/food/items` - Get all food items
- `GET /api/food/items/category/{category}` - Get by category
- `GET /api/food/items/search?keyword={keyword}` - Search food items
- `POST /api/food/orders` - Create food order
- `GET /api/food/orders` - Get all orders
- `GET /api/food/orders/{id}` - Get order by ID
- `PATCH /api/food/orders/{id}/status` - Update order status

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin)
- `GET /api/contact/{id}` - Get contact by ID
- `GET /api/contact/status/{status}` - Get by status
- `PATCH /api/contact/{id}/status` - Update status

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Collections

- **users** - User accounts
- **rooms** - Room types and availability
- **bookings** - Guest reservations
- **packages** - Special packages (honeymoon, anniversary, etc.)
- **food_items** - Menu items
- **food_orders** - Food orders
- **contacts** - Contact form submissions

## 🌱 Initial Data

The application automatically seeds the database with:

- 4 room types (Standard, Deluxe, Suite, Presidential)
- 6 packages (Honeymoon, Anniversary, Birthday, Family, Wellness, Adventure)
- 18 food items (Breakfast, Lunch, Dinner, Desserts, Beverages)

## 🔧 Configuration

Key configuration properties in `application.properties`:

```properties
# Server Port
server.port=8080

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000

# CORS Origins
cors.allowed.origins=http://localhost:5173,http://localhost:3000
```

## 📦 Building for Production

```bash
mvn clean package
java -jar target/resort-backend-1.0.0.jar
```

## 🧪 Testing

Run tests:

```bash
mvn test
```

## 📝 Project Structure

```
src/main/java/com/oceanview/resort/
├── config/           # Configuration classes
├── controller/       # REST controllers
├── dto/             # Data transfer objects
├── model/           # Entity models
├── repository/      # MongoDB repositories
├── security/        # Security & JWT
├── service/         # Business logic
└── util/            # Utility classes
```

## 🤝 Integration with Frontend

Frontend should be running on `http://localhost:5173`

Update frontend API base URL to:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

## 📧 Support

For issues or questions, please create an issue in the repository.

## 📄 License

This project is for educational purposes.
