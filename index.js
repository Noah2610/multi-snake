
var express = require("express");
// var socket = require("socket.io");
var chalk = require("chalk");

var port = 4444;
var app = express();
var server = app.listen(port);
app.use(express.static("public"));

console.log(chalk.green("server running on port " + port));
