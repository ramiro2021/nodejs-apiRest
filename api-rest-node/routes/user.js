"use strict";

var express = require("express");
var UserController = require("../controllers/user");

var router = express.Router();

var md_auth = require("../middlewares/authenticated");

// md multiparty
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });
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
//md de auth            md de multiparty (archivos)                                  
router.post("/upload-avatar", [md_auth.authenticated, md_upload], UserController.uploadAvatar);

router.get("/avatar/:fileName", UserController.avatar);

router.get("/users", UserController.getUsers);

router.get("/user/:userId", UserController.getUser);
module.exports = router;
