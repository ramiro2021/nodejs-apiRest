"use strict";

var express = require("express");
var UserController = require("../controllers/user");

var router = express.Router();

//rutas de prueba
router.get("/probando", UserController.probando);
router.post("/testeando", UserController.testeando);

// rutas del blog
// registro de usuario
router.post("/register", UserController.save);
// logeo de usuario
router.post("/login", UserController.login);
module.exports = router;
