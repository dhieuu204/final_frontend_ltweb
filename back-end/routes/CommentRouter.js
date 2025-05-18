const express = require("express");
const commentRouter = express.Router();
const Photo = require("../db/photoModel.js");


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

module.exports = commentRouter;