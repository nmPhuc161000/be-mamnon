// index.js
require("dotenv").config(); // Load biến môi trường từ .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const seedAdmin = require("./config/seeder");
const cloudinary = require("cloudinary").v2; // v2 là version mới, ổn định
const morgan = require("morgan"); // Logging (nên thêm vào package nếu chưa có)

const app = express();

// --------------------------
// 1. Config Cloudinary
// --------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Luôn dùng https URL (best practice)
});

// Test config (chỉ in ra console khi dev, xóa sau)
console.log(
  "Cloudinary configured:",
  cloudinary.config().cloud_name ? "OK" : "Error",
);

// --------------------------
// 2. Middleware
// --------------------------
app.use(cors()); // Cho phép frontend gọi API
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Log request (dev mode)

// Security headers (nên thêm helmet sau khi install)
if (process.env.NODE_ENV === "production") {
  // app.use(helmet()); // Uncomment khi install helmet
}

// --------------------------
// 3. Kết nối MongoDB
// --------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
    await seedAdmin(); // Tạo tài khoản admin nếu chưa có
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Thoát app nếu DB lỗi
  }
};

connectDB();

// Xử lý event disconnect/reconnect (tốt cho production)
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Trying to reconnect...");
  connectDB();
});

// --------------------------
// 4. Routes
// --------------------------
app.get("/", (req, res) => {
  res.json({ message: "API Trường Mẫu Giáo - Backend đang chạy!" });
});

// Mount route posts (từ file routes/posts.js)
app.use("/api/posts", require("./routes/posts")); // Đảm bảo đường dẫn đúng

// Mount route auth
app.use("/api/auth", require("./routes/auth"));

// Cấu hình UI Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------------------
// 5. Khởi động server
// --------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/api-docs`);
});

// Export app nếu cần test hoặc dùng với Vercel/etc.
module.exports = app;
