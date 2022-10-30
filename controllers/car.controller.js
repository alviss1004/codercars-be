const { sendResponse, AppError } = require("../helpers/utils.js");
const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};

carController.createCar = async (req, res, next) => {
  const info = req.body;
  const options = { new: true };
  try {
    //always remember to control your inputs
    if (!info) throw new AppError(402, "Bad Request", "Create car Error");
    //mongoose query
    const created = await Car.create(info);
    await created.save();
    await sendResponse(
      res,
      200,
      true,
      { car: created },
      null,
      "Create Car Successfully"
    );
  } catch (err) {
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Database!");
  let { page } = req.query;
  page = parseInt(page) || 1;
  let limitPerPage = 10;
  const filter = { _id: false };
  try {
    //mongoose query
    const listOfFound = await Car.find(filter);
    let offset = limitPerPage * (page - 1);
    const listOfCars = listOfFound.slice(offset, offset + limitPerPage);
    sendResponse(
      res,
      200,
      true,
      { cars: listOfCars, page: page, total: 1192 },
      null,
      "Get Car List Successfully!"
    );
  } catch (err) {
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  const targetId = mongoose.Types.ObjectId(req.params);
  const updateInfo = req.body;

  //options allow you to modify query. e.g new true return lastest update of data
  const options = { new: true };
  try {
    //mongoose query
    const updated = await Car.findByIdAndUpdate(targetId, updateInfo, options);

    sendResponse(
      res,
      200,
      true,
      { car: updated },
      null,
      "Update Car Successfully!"
    );
  } catch (err) {
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  const targetId = mongoose.Types.ObjectId(req.params);

  const options = { new: true };
  try {
    //mongoose query
    const updated = await Car.findByIdAndUpdate(
      targetId,
      { isDeleted: true },
      options
    );

    sendResponse(
      res,
      200,
      true,
      { car: updated },
      null,
      "Delete Car Successfully!"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = carController;
