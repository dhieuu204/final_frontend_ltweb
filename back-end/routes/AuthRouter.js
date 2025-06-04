const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../db/userModel");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { login_name, password } = req.body;

  if (!login_name || !password) {
    return res
      .status(400)
      .json({ error: "login_name và password là bắt buộc." });
  }

  try {
    // Tìm user theo login_name
    const user = await User.findOne({ login_name: login_name.trim() });
    if (!user) {
      return res.status(400).json({ error: "login_name không đúng." });
    }

    // So sánh plaintext
    if (password.trim() !== user.password) {
      return res.status(400).json({ error: "password không đúng." });
    }

    // Tạo token JWT (giống như trước)
    const payload = { userId: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        login_name: user.login_name,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Lỗi server khi đăng nhập." });
  }
});

// POST /api/admin/logout
router.post("/logout", (req, res) => {
  return res.json({
    message: "Đăng xuất thành công. Hãy xóa token ở client.",
  });
});

// POST /api/admin/signup
router.post("/signup", async (req, res) => {
  const {
    login_name,
    password,
    first_name,
    last_name,
    location = "",
    description = "",
    occupation = "",
  } = req.body;

  if (
    !login_name ||
    typeof login_name !== "string" ||
    !password ||
    typeof password !== "string" ||
    !first_name ||
    typeof first_name !== "string" ||
    !last_name ||
    typeof last_name !== "string"
  ) {
    return res.status(400).json({
      error: "login_name, password, first_name, last_name là bắt buộc.",
    });
  }

  try {
    // Kiểm tra login_name đã tồn tại chưa
    const existing = await User.findOne({ login_name: login_name.trim() });
    if (existing) {
      return res.status(400).json({ error: "login_name đã tồn tại." });
    }

    // Tạo user mới, lưu password plaintext
    const newUser = new User({
      login_name: login_name.trim(),
      password: password.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      location: location.trim(),
      description: description.trim(),
      occupation: occupation.trim(),
    });

    await newUser.save();

    return res.status(200).json({
      _id: newUser._id,
      login_name: newUser.login_name,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
    });
  } catch (err) {
    console.error("Error registering new user:", err);
    return res.status(500).json({ error: "Lỗi server khi đăng ký user." });
  }
});

module.exports = router;
