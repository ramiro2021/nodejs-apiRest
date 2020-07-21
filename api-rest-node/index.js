"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3999;
mongoose.Promise = global.Promise;

// conexion a base de datos
mongoose
  .connect("mongodb://localhost:27017/api_rest_node", { useNewUrlParser: true })
  .then(() => {
    console.log(
      "La conexion a la base de datos de mongo se realizo exitosamente"
    );

    // Crear el servidor
    app.listen(port, () => {
      console.log(
        "El servidor esta corriendo correctamente en http://localhost:3999/"
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
