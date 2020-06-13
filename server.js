const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const app = require("./app");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Successfully"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("views/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "views", "build", "index.html"));
  });
}
app.listen(process.env.PORT || 5500, () => {
  console.log("Server is running on port", process.env.PORT);
});
