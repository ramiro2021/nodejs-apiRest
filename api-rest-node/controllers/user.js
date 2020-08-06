"use strict";

var validator = require("validator");
var User = require("../models/user");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
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

  // register de nuevo usuario
  save: function (req, res) {
    // Traer parametros de la peticion
    var params = req.body;
    //  Validar los datos
    try {
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
    } catch (error) {
      return res.status(500).send({
        message: "Faltan datos para registrar",

      });
    }

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
  // logeo de usuario existente
  login: function (req, res) {
    // Traer parametros de la peticion
    var params = req.body;
    // Validar datos
    try {
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_password = !validator.isEmpty(params.password);
    } catch (error) {
      return res.status(200).send({
        message: "Faltan datos por enviar",

      });
    }


    if (!validate_email || !validate_password) {
      return res.status(200).send({
        message: "Los datos son incorrectos, verificalos nuevamente",
        user,
      });
    }

    // Buscar usuarios q coincidan con el email
    User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
      if (err) {
        return res.status(500).send({
          message: "Error al intentar identificarse ",
        });
      }
      if (!user) {
        return res.status(404).send({
          message:
            "El usuario no existe, debe registrarse antes de intentar logear ",
        });
      }
      //Si lo encuentra
      //Comprobar la contraseñá (coincidencia de email y password / bcrypt)
      bcrypt.compare(params.password, user.password, (err, check) => {
        // si es correcto
        if (check) {
          // Generar token de jwt y devolverlo
          if (params.gettoken) {
            //  Devolver los datos
            return res.status(200).send({
              token: jwt.createToken(user),
            });
          } else {
            // Limpiar password
            user.password = undefined;
            //  Devolver los datos
            return res.status(200).send({
              status: "success",
              user,
            });
          }
        } else {
          return res.status(404).send({
            message: "El usuario o contraseña no son correctas ",
          });
        }
      });
    });
  },

  update: function (req, res) {
    // traer datos del usuario
    var params = req.body;
    // Validar datos
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    } catch (err) {
      return res.status(200).send({
        message: "faltan datos por enviar",
        params
      });
    }



    // Eliminar propiedades innecesarias
    delete params.password;

    // traer id (sub => services/jwt => payload => sub/id)
    var userId = req.user.sub;

    // Comprobar si el email es unico
    if (req.user.email != params.email) {
      User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
        if (err) {
          return res.status(500).send({
            message: "Error al intentar identificarse ",
          });
        }
        if (user && user.email == params.email) {
          return res.status(200).send({
            message:
              "El email no puede ser modificado ",
          });
        }
      });
    } else {

      // Buscar y actualizar documento de la base de datos
      //(condicion, datos a actualizar , opciones, callback)
      User.findOneAndUpdate({ _id: userId }, params, { new: true }, (err, userUpdated) => {

        if (err) {
          return res.status(500).send({
            status: 'error',
            message: 'error al actualizar el usuario'

          });
        }
        if (!userUpdated) {
          return res.status(500).send({
            status: 'error',
            message: 'No se a actualizado el usuario'

          });
        }

        // Devolver una respuesta
        return res.status(200).send({
          status: 'success',
          user: userUpdated

        });
      })
    }
  },
};

module.exports = controller;
