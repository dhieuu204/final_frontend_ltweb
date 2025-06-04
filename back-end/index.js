// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require("./db/dbConnect");

const AuthRouter = require("./routes/AuthRouter");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");

const app = express();

dbConnect();

app.use(express.json());

app.use(
  cors({
    origin: "https://d78t48-3000.csb.app",
  })
);

app.use("/api/admin", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/photosOfUser", PhotoRouter);
app.use("/api/commentsOfUser", CommentRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello from photo-sharing app API (JWT)" });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
