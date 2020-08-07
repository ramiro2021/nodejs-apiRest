"use strict";

var express = require("express");
var TopicController = require('../controllers/topic');

var router = express.Router();
var md_auth = require("../middlewares/authenticated");
// ruta de prueba
router.get('/test', TopicController.test);
// guardar topic en base de datos
router.post('/topic', md_auth.authenticated, TopicController.save);
// traer topicos paginados
router.get('/topics/:page?', TopicController.getTopics);
// traer topicos de un usuario
router.get('/user-topics/:user', TopicController.getTopicsByUser);
// traer un solo topic
router.get('/topic/:id', TopicController.getTopic);

module.exports = router;