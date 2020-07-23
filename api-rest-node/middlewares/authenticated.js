"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
const { request } = require("express");
var secret = "clave-secreta-para-generar-el-token-2021";

exports.authenticated = function (req, res, next) {
  console.log("EL MIDDLEWARE DE AUTHENTICACION SE ESTA EJECUTANDO!! ");

  //comprobar si llega autorizacion
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: "La peticion no tiene la cabecera de autorizacion",
    });
  }

  //limpiar el token y quitar comillas
  var token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    // decodificar token
    var payload = jwt.decode(token, secret);
    //  comprobar si el token ah expirado
    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        message: "El token ah expirado",
      });
    }
  } catch (ex) {
    return res.status(404).send({
      message: "El token no es valido",
    });
  }

  //   adjuntar usuario identificado el request
  req.user = payload;

  //   pasar a la accion
  next();
};
