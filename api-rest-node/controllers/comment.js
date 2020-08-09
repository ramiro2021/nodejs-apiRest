'use strict'
var Topic = require('../models/topic');
var validator = require('validator');


var controller = {

    add: function (req, res) {

        // traer id de topic de la url
        var topicId = req.params.topicId;
        // find por id del topic
        Topic.findById(topicId).exec((err, topic) => {

            if (err || !topic) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al traer el topic!'
                })
            }
            // comprobar objeto usuario y validar datos
            if (req.body.content) {
                try {

                    var validate_content = !validator.isEmpty(req.body.content);


                } catch (err) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'No has comentado nada'
                    })
                }

                if (validate_content) {
                    var comment = {
                        user: req.user.sub,
                        content: req.body.content,

                    }

                    // en la propiedad comments del objeto hacer un push
                    topic.comments.push(comment);
                    // guardar topic completo

                    topic.save((err) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al guardar el topic!'
                            })
                        }
                        // devolver una respuesta

                        return res.status(200).send({
                            satus: 'success',
                            topic
                        })
                    });


                } else {

                    return res.status(200).send({
                        status: 'error',
                        message: 'No se han validado los datos del comentario!'
                    })

                }
            }

        })



    },

    update: function (req, res) {

        // traer id del comment por url
        var commentId = req.params.commentId;
        // traer datos del body
        var params = req.body;
        // validar
        try {

            var validate_content = !validator.isEmpty(params.content);


        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'No has comentado nada'
            })
        }

        if (validate_content) {
            //find and udpate de subdocumento
            Topic.findOneAndUpdate(
                { "comments._id": commentId },
                {
                    "$set": {
                        "comments.$.content": params.content
                    }
                },
                { new: true },
                (err, topicUpdated) => {
                    if (err) {
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error en el comentario'
                        })
                    }



                    return res.status(200).send({
                        status: 'success',
                        topic: topicUpdated
                    })


                }
            )

        }

    },

    delete: function (req, res) {

        // sacar id del topic y del comment por url
        var topicId = req.params.topicId;
        var commentId = req.params.commentId;
        // buscar el topic
        Topic.findById(topicId, (err, topic) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al encontrar el topic!'
                })
            }
            // seleccionar el subdocumento del comentario
            var comment = topic.comments.id(commentId);
            // borrar el comentario
            if (comment) {
                comment.remove();
                // guardar el topic
                topic.save((err) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al encontrar el topic!'
                        })
                    }
                    //devolver respuesta
                    return res.status(200).send({
                        status: 'success',
                        topic
                    })

                })


            } else {
                //devolver respuesta
                return res.status(200).send({
                    message: 'No existe el comentario'
                })
            }

        })

    },

}

module.exports = controller;