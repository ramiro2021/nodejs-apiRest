"use strict";

var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/api_rest_node", { useNewUrlParser: true })
  .then(() => {
    console.log(
      "La conexion a la base de datos de mongo se realizo exitosamente"
    );
  })
  .catch((error) => {
    console.log(error);
  });
