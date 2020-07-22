"use strict";

var validator = require("validator");
var User = require("../models/user");
var bcrypt = require("bcrypt-nodejs");

var controller = {
  probando: function (req, res) {
    return res.status(200).send({
      message: "soy el metodo probando",
    });
  },

  testeando: function (req, res) {
    return res.status(200).send({
      message: "soy el metodo testeando",
    });
  },

  save: function (req, res) {
    // Traer parametros de la peticion
    var params = req.body;
    //  Validar los datos
    var validate_name = !validator.isEmpty(params.name);
    var validate_surname = !validator.isEmpty(params.surname);
    var validate_email =
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);
    // console.log(
    //   validate_name,
    //   validate_surname,
    //   validate_email,
    //   validate_password
    // );
    if (
      validate_name &&
      validate_surname &&
      validate_email &&
      validate_password
    ) {
      //  Crear objeto de usuario
      var user = new User();

      //  Asignar valores al usuario
      user.name = params.name;
      user.surname = params.surname;
      user.email = params.email.toLowerCase();
      user.role = "ROLE_USER";
      user.image = null;
      //  Comprobar si el usuario existe
      User.findOne({ email: user.email }, (err, issetUser) => {
        if (err) {
          return res.status(500).send({
            message: "Error al comprobar duplicidad de usuario",
            user,
          });
        }

        if (!issetUser) {
          //  si no existe
          //  cifrar la contraseña y guardar usuario
          bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;

            user.save((err, userStored) => {
              if (err) {
                return res.status(500).send({
                  message: "Error al guardar el usuario",
                  user,
                });
              }
              if (!userStored) {
                return res.status(400).send({
                  message: "El usuario no se ah guardado",
                  user,
                });
              }

              return res.status(200).send({
                status: "success",
                user: userStored,
              });
            });
          });
        } else {
          return res.status(200).send({
            message:
              "El usuario ya esta registrado con ese email intente iniciar sesion",
            user,
          });
        }
      });
    } else {
      return res.status(200).send({
        message:
          "La validacion de los datos del usuario es incorrecta, intentalo denuevo",
        user,
      });
    }
  },
};

module.exports = controller;
