const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@mamnon.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    // Kiểm tra đã có admin chưa
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log(`👤 Admin đã tồn tại: ${existingAdmin.email}`);
      return;
    }

    // Tạo tài khoản admin mới
    await User.create({
      name: "Quản Trị Viên",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log("🌱 Tạo tài khoản admin thành công!");
    console.log(`   📧 Email   : ${adminEmail}`);
    console.log(`   🔑 Password: ${adminPassword}`);
  } catch (err) {
    console.error("❌ Lỗi khi tạo admin:", err.message);
  }
};

module.exports = seedAdmin;
