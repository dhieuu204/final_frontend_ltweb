const express = require("express");
const commentRouter = express.Router();
const Photo = require("../db/photoModel.js");
const User = require("../db/userModel.js"); // ✅ Bổ sung require

// GET: Lấy tất cả comment của 1 user
commentRouter.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const photos = await Photo.find({ "comments.user_id": userId });

    const result = [];
    for (const photo of photos) {
      for (const c of photo.comments || []) {
        if (c.user_id.toString() === userId) {
          result.push({
            photo_id: photo._id,
            file_name: photo.file_name,
            comment: c.comment,
            date_time: c.date_time,
          });
        }
      }
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: "Lỗi khi lấy comment user." });
  }
});

// POST: Thêm comment vào ảnh
commentRouter.post("/:photo_id", async (req, res) => {
  const { photo_id } = req.params;
  const { comment } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Chưa đăng nhập" });
  }

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "Bình luận không được để trống" });
  }

  try {
    const photo = await Photo.findById(photo_id);
    if (!photo) {
      return res.status(404).json({ error: "Không tìm thấy ảnh" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy user" });
    }

    const newComment = {
      comment,
      date_time: new Date(),
      user_id: user._id,
    };

    photo.comments.push(newComment);
    await photo.save();

    return res.status(200).json({
      message: "Thêm bình luận thành công",
      comment: newComment,
    });
  } catch (err) {
    console.error("Lỗi thêm bình luận:", err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

module.exports = commentRouter;
