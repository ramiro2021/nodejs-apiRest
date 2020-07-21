"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Modelo de Comentarios
var CommentSchema = Schema({
  content: String,
  date: { type: Date, dafault: Date.now },
  user: { type: Schema.ObjectId, ref: "User" },
});

var Comment = mongoose.model("Comment", CommentSchema);

// Modelo de topic
var TopicSchema = Schema({
  title: String,
  content: String,
  code: String,
  lang: String,
  date: { type: Date, dafault: Date.now },
  user: { type: Schema.ObjectId, ref: "User" },
  comments: [CommentSchema],
});
