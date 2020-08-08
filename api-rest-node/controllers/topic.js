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


    },

    getTopicsByUser: function (req, res) {

        // conseguir el id del usuario
        // parametro por url
        var userId = req.params.user;
        // hacer un find con una condicion de usuario
        Topic.find({
            user: userId
        })
            .sort([['date', 'descending']])
            .exec((err, topics) => {
                if (err) {
                    // devolver respuesta
                    return res.status(500).send({
                        message: 'Error en la peticion de get my topics'
                    })
                }
                if (!topics) {
                    // devolver respuesta
                    return res.status(404).send({
                        message: 'No se encuentran topicos para mostrar'
                    })
                }

                // devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    topics
                })
            })

    },

    getTopic: function (req, res) {

        // sacar el id del topic de la url
        var topicId = req.params.id;
        // find por id del topic
        Topic.findById(topicId)
            .populate('user')
            .exec((err, topic) => {
                if (err) {
                    // devovler una respuesta

                    return res.status(500).send({
                        status: 'error',
                        message: 'No se han encontrado topics para mostrar'
                    })
                }
                // devovler una respuesta
                return res.status(200).send({
                    status: 'success',
                    topic
                })
            })

    },

    update: function (req, res) {
        // traer id de la url
        var topicId = req.params.id;
        console.log(topicId);
        // traer datos desde post
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

        // crear json con los datos modificables
        if (validate_title && validate_content && validate_lang) {
            var update = {
                title: params.title,
                content: params.content,
                code: params.code,
                lang: params.lang
            }

            // find and update del topic por id y por id del usuario
            Topic.findOneAndUpdate({ _id: topicId, user: req.user.sub }, update, { new: true }, (err, topicUpdate) => {
                if (err) {
                    // devovler una respuesta
                    return res.status(500).send({
                        status: 'error',
                        message: 'No se ah podido actualizar'
                    })
                }
                // devovler una respuesta
                return res.status(200).send({
                    status: 'success',
                    topic: topicUpdate
                })
            });

        } else {
            // devovler una respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validacion de los datos no es correcta'
            })
        }


    },

    delete: function (req, res) {
        // traer el id de la url
        var topicId = req.params.id;
        // find and delete por topic di y por user id
        Topic.findByIdAndDelete({ _id: topicId, user: req.user.sub }, (err, topicRemove) => {

            if (err) {
                // devovler una respuesta
                return res.status(500).send({
                    status: 'error',
                    message: 'Topico no se ah podido eliminar',

                })
            }
            // devovler una respuesta
            return res.status(200).send({
                status: 'success',
                message: 'Topico eliminado',
                topic: topicRemove
            })
        });


    }




};

module.exports = controller;