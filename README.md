# 🏫 API Trường Mầm Non

Backend API cho hệ thống quản lý trường mầm non — quản lý bài viết, xác thực người dùng và upload hình ảnh.

## 📋 Tính năng

- ✅ **Xác thực (Auth)** — Đăng ký, đăng nhập với JWT Token
- ✅ **Quản lý bài viết** — CRUD bài viết blog (Admin)
- ✅ **Upload ảnh** — Tích hợp Cloudinary
- ✅ **Phân quyền** — User / Admin role
- ✅ **Swagger UI** — Tài liệu API tự động
- ✅ **Auto Seeder** — Tự tạo tài khoản admin khi khởi động

## 🛠 Công nghệ sử dụng

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| Node.js | — | Runtime |
| Express | v5 | Web framework |
| Mongoose | v9 | MongoDB ODM |
| JWT | — | Xác thực bằng token |
| Cloudinary | — | Lưu trữ ảnh cloud |
| Swagger | OpenAPI 3.0 | Tài liệu API |
| Bcrypt.js | — | Mã hóa mật khẩu |

## 📁 Cấu trúc thư mục

```
mam-non/
├── src/
│   ├── config/
│   │   ├── cloudinary.js      # Cấu hình Cloudinary upload
│   │   ├── seeder.js          # Tự tạo tài khoản admin
│   │   └── swagger.js         # Cấu hình Swagger/OpenAPI
│   ├── controllers/
│   │   ├── authController.js  # Xử lý đăng ký, đăng nhập
│   │   └── postController.js  # Xử lý CRUD bài viết
│   ├── middleware/
│   │   ├── auth.js            # Middleware xác thực JWT & phân quyền admin
│   │   └── admin.js           # Middleware kiểm tra quyền admin
│   ├── models/
│   │   ├── User.js            # Model người dùng
│   │   └── Post.js            # Model bài viết
│   ├── routes/
│   │   ├── auth.js            # Routes xác thực
│   │   └── posts.js           # Routes bài viết
│   └── index.js               # Entry point — khởi động server
├── .env                       # Biến môi trường (KHÔNG commit lên git)
├── package.json
└── README.md
```

## 🚀 Cài đặt & Chạy

### 1. Clone project

```bash
git clone <repo-url>
cd mam-non
```

### 2. Cài dependencies

```bash
npm install
```

### 3. Tạo file `.env`

Tạo file `.env` ở thư mục gốc với nội dung:

```env
# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_super_secret_key_here_very_long_and_random

# Port
PORT=5000

# Tài khoản Admin mặc định
ADMIN_EMAIL=admin@mamnon.com
ADMIN_PASSWORD=Admin@123
```

### 4. Khởi động server

```bash
# Development (có auto-reload)
npm run dev

# Production
npm start
```

Khi chạy thành công, terminal sẽ hiển thị:

```
✅ MongoDB connected successfully!
🌱 Tạo tài khoản admin thành công!
   📧 Email   : admin@mamnon.com
   🔑 Password: Admin@123
✅ Server is running on port 5000
🌍 Environment: development
📄 Swagger UI: http://localhost:5000/api-docs
```

## 📄 Swagger UI

Sau khi chạy server, truy cập **Swagger UI** tại:

👉 **http://localhost:5000/api-docs**

Giao diện Swagger cho phép bạn xem tài liệu và **test trực tiếp** tất cả API.

## 🔑 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/api/auth/register` | Đăng ký tài khoản mới | ❌ Public |
| `POST` | `/api/auth/login` | Đăng nhập, nhận JWT token | ❌ Public |
| `GET` | `/api/auth/me` | Lấy thông tin tài khoản hiện tại | 🔒 Bearer Token |

### Posts — `/api/posts`

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/api/posts` | Lấy danh sách bài viết (published) | ❌ Public |
| `GET` | `/api/posts/:slug` | Lấy chi tiết bài viết theo slug | ❌ Public |
| `GET` | `/api/posts/admin/all` | Lấy tất cả bài viết (admin) | 🔒 Admin |
| `POST` | `/api/posts` | Tạo bài viết mới | 🔒 Admin |
| `PUT` | `/api/posts/:id` | Cập nhật bài viết | 🔒 Admin |
| `DELETE` | `/api/posts/:id` | Xóa bài viết | 🔒 Admin |

## 🔐 Xác thực API

Các API được bảo vệ yêu cầu gửi JWT token trong header:

```
Authorization: Bearer <your_jwt_token>
```

**Cách lấy token:**

1. Gọi API đăng nhập `POST /api/auth/login`
2. Copy `token` từ response
3. Trên Swagger UI: nhấn nút **Authorize** 🔒 → paste token → **Authorize**

## 👤 Tài khoản Admin mặc định

| Field | Giá trị |
|-------|---------|
| Email | `admin@mamnon.com` |
| Password | `Admin@123` |
| Role | `admin` |

> ⚠️ **Lưu ý:** Hãy đổi mật khẩu admin trong file `.env` trước khi deploy lên production!

## 📝 Scripts

| Lệnh | Mô tả |
|-------|-------|
| `npm start` | Chạy server (production) |
| `npm run dev` | Chạy server với nodemon (development) |
