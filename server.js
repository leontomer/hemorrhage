const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 6000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established succesfully");
});

const authAPI = require("./routes/api/authAPI");
const actionsAPI = require("./routes/api/actionsAPI");
app.use("/auth", authAPI);
app.use("/actions", actionsAPI);

app.listen(port, () => {
  console.log("Server is running on port:", port);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
