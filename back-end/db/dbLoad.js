// db/dbLoad.js

const mongoose = require("mongoose");
require("dotenv").config();

const models = require("../modelData/models.js");

const User = require("../db/userModel.js");
const Photo = require("../db/photoModel.js");
const SchemaInfo = require("../db/schemaInfo.js");

const versionString = "1.0";

// Thay bằng URL MongoDB của bạn
const DB_URL =
  "mongodb+srv://lc13n:kiendang2004@photo.sxinx04.mongodb.net/photo?retryWrites=true&w=majority&appName=photo";

async function dbLoad() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.log("Unable to connect to MongoDB Atlas!", error);
    return;
  }

  // Xóa hết các collection cũ
  await User.deleteMany({});
  await Photo.deleteMany({});
  await SchemaInfo.deleteMany({});

  // 1) Tạo users từ dữ liệu mẫu
  const userModels = models.userListModel();
  const mapFakeId2RealId = {};

  for (const user of userModels) {
    // Khai báo biến cục bộ
    let userObj = new User({
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
      login_name: user.login_name,
      password: user.password, // pre-save hook sẽ tự hash
    });

    try {
      await userObj.save();
      mapFakeId2RealId[user._id] = userObj._id.toString();
      user.objectID = userObj._id.toString();
      console.log(
        "Adding user:",
        user.first_name + " " + user.last_name,
        "with ID",
        user.objectID
      );
    } catch (error) {
      console.error("Error creating user", error);
    }
  }

  // 2) Tạo photos + comments
  const photoModels = [];
  const userIDs = Object.keys(mapFakeId2RealId);
  userIDs.forEach(function (id) {
    photoModels.push(...models.photoOfUserModel(id));
  });

  for (const photo of photoModels) {
    // Tạo photo mới với file_name + date_time + user_id (đã map)
    let photoObj = await Photo.create({
      file_name: photo.file_name,
      date_time: photo.date_time,
      user_id: mapFakeId2RealId[photo.user_id],
    });
    photo.objectID = photoObj._id.toString();

    // Đẩy từng comment (nếu có) vào photoObj.comments
    if (photo.comments) {
      for (const comment of photo.comments) {
        photoObj.comments.push({
          comment: comment.comment,
          date_time: comment.date_time,
          user_id: comment.user.objectID,
        });
        console.log(
          "Adding comment (len=%d) by user %s to photo %s",
          comment.comment.length,
          comment.user.objectID,
          photo.file_name
        );
      }
    }

    try {
      await photoObj.save();
      console.log(
        "Adding photo:",
        photo.file_name,
        "of user ID",
        photoObj.user_id
      );
    } catch (error) {
      console.error("Error creating photo", error);
    }
  }

  // 3) Tạo SchemaInfo
  try {
    const schemaInfo = await SchemaInfo.create({
      version: versionString,
    });
    console.log("SchemaInfo object created with version", schemaInfo.version);
  } catch (error) {
    console.error("Error creating schemaInfo", error);
  }

  await mongoose.disconnect();
}

dbLoad();
