const fs = require("fs");
const csv = require("csvtojson");
const mongoose = require("mongoose");
const Car = require("./models/Car");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

require("dotenv/config");

const createCars = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Database!");

  let newData = await csv().fromFile("data.csv");
  newData = newData.map(async (e) => {
    const carInfo = {
      make: e.Make,
      model: e.Model,
      release_date: e.Year,
      transmission_type: e.Transmission_Type,
      size: e.Vehicle_Size,
      style: e.Vehicle_Style,
      price: e.MSRP,
      isDeleted: false,
    };
    const created = await Car.create(carInfo);
    await created.save();
  });
};

createCars();
