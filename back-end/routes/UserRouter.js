const express = require("express");
const router = express.Router();
const User = require("../db/userModel.js");
const verifyToken = require("../middleware/verifyToken");

//router.use(verifyToken);

router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    return res.status(200).json(users);
  } catch (err) {
    console.error("Lỗi máy chủ khi lấy danh sách người dùng:", err);
    return res
      .status(500)
      .json({ error: "Lỗi máy chủ khi lấy danh sách người dùng." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id,
      "_id first_name last_name location description occupation login_name password"
    );
    if (!user) {
      return res
        .status(400)
        .json({ error: "Không tìm thấy người dùng với ID đã cung cấp." });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin user:", err);
    return res
      .status(400)
      .json({ error: "ID không hợp lệ hoặc có lỗi xảy ra." });
  }
});

module.exports = router;
