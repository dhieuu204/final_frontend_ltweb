const express = require("express");
const router = express.Router();
const User = require("../db/userModel.js");

// GET /user/list - Danh sách người dùng cho sidebar
router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send({ error: "Lỗi máy chủ khi lấy danh sách người dùng." });
  }
});

// GET /user/:id - Thông tin chi tiết của một người dùng
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "_id first_name last_name location description occupation");
    if (!user) {
      return res.status(400).send({ error: "Không tìm thấy người dùng với ID đã cung cấp." });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send({ error: "ID không hợp lệ hoặc có lỗi xảy ra." });
  }
});

module.exports = router;
