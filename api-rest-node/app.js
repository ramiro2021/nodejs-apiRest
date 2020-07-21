"use strict";

// Requires
var express = require("express");
var bodyParser = require("body-parser");

// Ejecutar express
var app = express();
// Cargar archivos de rutas

// Middlewares - funcionalidades q se ejecutan antes de llegar a las acciones de los controladores
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// CORS

// Reescribir rutas

// Ruta de prueba
app.get("/prueba", (req, res) => {
  return res.status(200).send({
    message: "Funciona correctamente",
  });
});

// Exportar modulo
module.exports = app;
