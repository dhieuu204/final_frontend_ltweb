const express = require("express");
const router = express.Router();
const Photo = require("../db/photoModel.js");
const User = require("../db/userModel.js");


router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send({ error: "ID người dùng không hợp lệ." });

    const photos = await Photo.find({ user_id: req.params.id });

    const result = await Promise.all(photos.map(async (photo) => {
      const photoObj = {
        _id: photo._id,
        user_id: photo.user_id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        comments: []
      };

      for (const comment of photo.comments) {
        const commenter = await User.findById(comment.user_id, "_id first_name last_name");
        if (commenter) {
          photoObj.comments.push({
            _id: comment._id,
            comment: comment.comment,
            date_time: comment.date_time,
            user: commenter
          });
        }
      }

      return photoObj;
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(400).send({ error: "Lỗi trong quá trình truy vấn ảnh hoặc ID không hợp lệ." });
  }
});

module.exports = router;

