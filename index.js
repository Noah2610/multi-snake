
import express from "express";
import socket from "socket.io";
import chalk from "chalk";
import datetime from "node-datetime";

var port = 4444;
var app = express();
var server = app.listen(port);
app.use(express.static("public"));

console.log(chalk.green("server running on port " + port));

var io = socket(server);

var userData = [];

io.sockets.on("connection", newConnection);

function newConnection(socket) {

	const ip = socket.handshake.address.substr(7);
	const id = socket.id;

	// log connection
	console.log(chalk.green(chalk.underline(curDate("H:M:S")) + " - connected: " + chalk.bold(id + " - " + ip)));

	let randColor = [
		Math.floor((Math.random() * 255) + 1),
		Math.floor((Math.random() * 255) + 1),
		Math.floor((Math.random() * 255) + 1)
	];
	userData.push({id: id, ip: ip, color: randColor});
	// socket.broadcast.emit("userData", userData);
	io.sockets.emit("userData", userData);


	// countdown
	socket.on("countdown", (data) => {
		let countdown = data;
		let countdownInterval = setInterval(function(){
			countdown--;
			io.sockets.emit("countdown", countdown);
			if (countdown <= 0) {
				clearInterval(countdownInterval);
			}
		}, 1000);
	});


	// player direction
	socket.on("dir", (data) => {
		socket.broadcast.emit("dir", data);
	});


	// food spawn
	socket.on("food", (data) => {
		socket.broadcast.emit("food", data);
	});

	// // food eat
	// socket.on("foodEat", (data) => {
	// 	socket.broadcast.emit("foodEat", data);
	// });


	// when user disconnects
	socket.on("disconnect", () => {
		// log disconnect
		console.log(chalk.red(chalk.underline(curDate("H:M:S")) + " - disconnected: " + chalk.bold(socket.id + " - " + ip)));
		userData.forEach((user,index) => {
			if (user.id == id) {
				userData.splice(index,1);
			}
		});
	})


}


function curDate(frmt) {  // get date and/or time with format
	return datetime.create().format(frmt);
}
