// middleware/verifyToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

function verifyToken(req, res, next) {
  // Lấy header Authorization
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(401).json({ error: "Chưa cung cấp token" });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Lưu userId vào req để các route sau có thể dùng
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Xác thực JWT thất bại:", err);
    return res
      .status(401)
      .json({ error: "Token không hợp lệ hoặc đã hết hạn" });
  }
}

module.exports = verifyToken;
