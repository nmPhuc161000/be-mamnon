const Post = require("../models/Post");

// Tạo bài mới (admin only)
const createPost = async (req, res) => {
  try {
    // Xử lý mảng hình ảnh từ Cloudinary upload
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(file.path); // path chứa url ảnh trả về từ Cloudinary
      });
    }

    const post = new Post({
      ...req.body,
      images: images,
      author: req.user.id, // từ JWT
    });
    
    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Lấy danh sách public (phụ huynh xem)
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Fix Bảo mật: Ép chặt luôn luôn chỉ lấy published khi tra cứu ở Frontend (Public)
    const query = { status: "published", isPublic: true };

    const safeLimit = Math.min(parseInt(limit), 50); // chặn giới hạn limit ảo

    const posts = await Post.find(query)
      .sort({ publishedAt: -1 })
      .limit(safeLimit)
      .skip((page - 1) * safeLimit)
      .populate("author", "name") // nếu User có field name
      .select("-content -__v"); // không cần trả về content dài dòng ở listing page

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      total,
      pages: Math.ceil(total / safeLimit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Lấy tất cả danh sách bài (kể cả draft, cho admin duyệt)
const getAdminPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) query.status = status; // Lọc draft hay published tùy ý admin

    const safeLimit = Math.min(parseInt(limit), 50);

    const posts = await Post.find(query)
      .sort({ updatedAt: -1 })
      .limit(safeLimit)
      .skip((page - 1) * safeLimit)
      .populate("author", "name")
      .select("-__v");

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      total,
      pages: Math.ceil(total / safeLimit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Lấy chi tiết 1 bài (public)
const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      isPublic: true,
      status: "published",
    })
      .populate("author", "name")
      .populate("children", "name") // nếu Child có name
      .populate("classId", "name");

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    // Fix Hiệu suất: Tăng views bằng updateOne để tránh gọi vòng pre-save làm sai lệch updatedAt
    await Post.updateOne({ _id: post._id }, { $inc: { views: 1 } });
    post.views += 1;

    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Cập nhật bài (admin only)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Không tìm thấy" });

    // Fix Bug Phân quyền: Cả author và quản trị viên Admin mới đều sửa được
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền chỉnh sửa" });
    }

    // Kẹp file ảnh mới vào, nếu có thêm ảnh
    let images = [...post.images];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(file.path);
      });
    }

    Object.assign(post, {
      ...req.body,
      images: images
    });

    await post.save();

    res.json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Xóa bài (admin only)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy" });

    await post.deleteOne();
    res.json({ success: true, message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getAdminPosts,
  getPostBySlug,
  updatePost,
  deletePost,
};
