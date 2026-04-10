const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề là bắt buộc"],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, "Nội dung là bắt buộc"],
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    images: [
      {
        type: String, // URL từ Cloudinary
      },
    ],
    videos: [
      {
        type: String,
      },
    ],
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
      },
    ],
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    tags: [
      {
        type: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true, // tự động thêm createdAt, updatedAt
  },
);

// Tự động tạo slug trước khi save (Mongoose v9: sync hook không cần next)
postSchema.pre("save", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      "-" +
      Date.now().toString(36);
  }
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Post", postSchema);
