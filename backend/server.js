const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Weather = require("./openWeather.model");

const app = express();
const weatherRoutes = express.Router();
const port = 4000;

app.use(cors());
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.json());

//connecting to mongoDB

mongoose.connect(
  "mongodb+srv://tomek:l20s10r76@cluster0.tov4t.mongodb.net/gotoma?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const connection = mongoose.connection;

connection.once("open", function () {
  console.log(
    `MongoDB database connection established successfully on: ${connection.host}`
  );
});

weatherRoutes.route("/").get(function (req, res) {
  Weather.find(function (err, weather) {
    if (err) {
      console.log(err);
    } else {
      res.send(weather);
    }
  });
});

weatherRoutes.route("/add").post(function (req, res) {
  const newWeather = new Weather(req.body);
  console.log("request body w server /add: ", newWeather);

  newWeather
    .save()
    .then((item) => {
      res.status(200).json({ new: "added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding failed");
    });
});

app.use("/weather", weatherRoutes);

app.listen(port, function () {
  console.log("Server is listening on 4000");
});
