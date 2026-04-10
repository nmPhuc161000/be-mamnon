const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, role }
      next();
    } catch (err) {
      res
        .status(401)
        .json({ message: "Không được phép truy cập - token không hợp lệ" });
    }
  } else {
    res.status(401).json({ message: "Không có token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Chỉ admin mới có quyền" });
  }
};

module.exports = { protect, adminOnly };
