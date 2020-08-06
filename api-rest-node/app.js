"use strict";

// Requires
var express = require("express");
var bodyParser = require("body-parser");

// Ejecutar express
var app = express();
// Cargar archivos de rutas
var user_routes = require("./routes/user");
var topic_routes = require("./routes/topic");
// Middlewares - funcionalidades q se ejecutan antes de llegar a las acciones de los controladores
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// CORS

// Reescribir rutas
app.use("/api", user_routes);
app.use("/api", topic_routes);
// Ruta de prueba
app.get("/prueba", (req, res) => {
  return res.status(200).send({
    message: "Funciona correctamente",
  });
});

// Exportar modulo
module.exports = app;
