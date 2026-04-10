const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getAdminPosts,
  getPostBySlug,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const { protect, adminOnly } = require("../middleware/auth");
const { uploadCloud } = require("../config/cloudinary");

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của bài viết
 *         title:
 *           type: string
 *           description: Tiêu đề bài viết
 *         content:
 *           type: string
 *           description: Nội dung
 *         excerpt:
 *           type: string
 *           description: Tóm tắt nội dung
 *         author:
 *           type: string
 *           description: Object ID của User
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           default: draft
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         slug:
 *           type: string
 * 
 * tags:
 *   name: Posts
 *   description: Quản lý bài viết tin tức
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Lấy danh sách bài viết (Public)
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Thành công
 */
// Public routes (Cha mẹ xem không cần đăng nhập)
router.get("/", getPosts);

// Admin protected routes (Phải đứng trước /:slug để không bị nhầm admin là tham số truyền vào)
/**
 * @swagger
 * /api/posts/admin/all:
 *   get:
 *     summary: Lấy toàn bộ bài viết quản trị (Admin)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/admin/all", protect, adminOnly, getAdminPosts);

// Public route (Tham số cụ thể đặt ở dưới cùng)
/**
 * @swagger
 * /api/posts/{slug}:
 *   get:
 *     summary: Lấy chi tiết một bài viết theo slug
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Đường dẫn slug (VD bài-viết-1)
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/:slug", getPostBySlug);

// Các tương tác ghi dữ liệu của Admin
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Tạo bài viết mới (Admin)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Chào mừng năm học mới
 *               content:
 *                 type: string
 *                 example: Nội dung bài viết...
 *               excerpt:
 *                 type: string
 *                 example: Tóm tắt ngắn gọn...
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 default: draft
 *                 description: Trạng thái bài viết
 *               tags:
 *                 type: string
 *                 example: "thông báo,sự kiện"
 *                 description: Các tag ngăn cách bằng dấu phẩy
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 */
router.post("/", protect, adminOnly, uploadCloud.array("images", 10), createPost);
/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Cập nhật bài viết (Admin)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID của bài viết
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 description: Trạng thái bài viết
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id", protect, adminOnly, uploadCloud.array("images", 10), updatePost);
/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Xóa bài viết (Admin)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete("/:id", protect, adminOnly, deletePost);

module.exports = router;
