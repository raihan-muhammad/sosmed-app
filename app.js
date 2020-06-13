const express = require("express");
const cors = require("cors");

const app = express();

const globalErrorHandler = require("./controllers/errorController");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/users", userRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("views/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "build", "index.html"));
  });
}

app.use(globalErrorHandler);

module.exports = app;
