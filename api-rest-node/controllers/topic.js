'use strict'
var validator = require("validator");
var Topic = require("../models/topic");
const { populate } = require("../models/topic");

var controller = {
    test: function (req, res) {
        return res.status(200).send({
            message: 'TEST TOPIC'
        })
    },

    save: function (req, res) {

        // Traer parametros por post
        var params = req.body;

        // Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Error! Faltan datos por enviar'
            })
        }

        if (validate_title && validate_content && validate_lang) {
            // crear objeto a guardar
            var topic = new Topic();
            // Asignar valores
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub;
            // Guardar topic
            topic.save((err, topicStore) => {
                // Devolver respuesta
                if (err || !topicStore) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'no se ah podido guardar el topic'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    topic: topicStore
                })
            });

        } else {
            return res.status(200).send({
                message: 'Los datos no son validos'
            })
        }

    },

    getTopics: function (req, res) {

        // cargar la libreria de paginacion en la clase

        // traer la pagina actual
        // page = parametro por ruta
        if (!req.params.page || req.params.page === 0 || req.params.page === '0' || req.params.page === null || req.params.page === undefined) {
            var page = 1;
        } else {
            var page = parseInt(req.params.page);
        }


        // indicar las opciones de paginacion
        var options = {
            // 1 de mas viejo a mas nuevo
            // -1 de mas nuevo a mas viejo
            sort: { date: -1 },
            populate: 'user',
            limit: 5,
            page: page
        }

        // Find paginado (paginate)
        // condicion, option, callback
        Topic.paginate({}, options, (err, topics) => {

            if (err || !topics) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al hacer la consulta'
                });
            }

            return res.status(200).send({
                status: 'success',
                topics: topics.docs,
                totalDocs: topics.totalDocs,
                totalPages: topics.totalPages
            });
        })
        // Devolver resultado (topics, total de topic, total de paginas)


    }


};

module.exports = controller;