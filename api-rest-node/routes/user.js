"use strict";

var express = require("express");
var UserController = require("../controllers/user");

var router = express.Router();

var md_auth = require("../middlewares/authenticated");
//rutas de prueba
router.get("/probando", UserController.probando);
router.post("/testeando", UserController.testeando);

// rutas del blog
// registro de usuario
router.post("/register", UserController.save);
// logeo de usuario
router.post("/login", UserController.login);
// actualizacion de datos de un usuario
// se ejecuta el middleware de autenticacion
router.put("/update", md_auth.authenticated, UserController.update);

module.exports = router;
