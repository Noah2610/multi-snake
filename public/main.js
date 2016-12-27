
const port = 4444;
const cnvDim = {x: 1000, y: 800};
const gridSize = 25;
const gameSpd = 10;
const foodSize = 10;
const foodSpawnInterval = 3000;
const foodSpawnRate = 2;
const playerStartPos = [
	{x: 2, y: 2, dir: [1,0]},  // top left
	{x: Math.round(cnvDim.x / gridSize) - 2, y: 2, dir: [0,1]},  // top right
	{x: 2, y: Math.round(cnvDim.y / gridSize) - 2, dir: [0,-1]},  // bottom left
	{x: Math.round(cnvDim.x / gridSize) - 2, y: Math.round(cnvDim.y / gridSize) - 2, dir: [-1,0]}  // bottom right
];
var socket;
var connected = false;
var pIndex;
var players = [];
var gameStarted = false;
var deadPlayers = [];
var foods = [];
var windowDim = {width: 0, height: 0};
var countdown = 3;
var displayCountdown = true;


function setup() {
	windowDim.width = windowWidth; windowDim.height = windowHeight;
	createCanvas(cnvDim.x,cnvDim.y);
	background(128,128,128);
	frameRate(gameSpd);


	socket = io.connect("http://192.168.0.30:" + port);
	socket.on("userData", addUserData);  // new connection information
	socket.on("countdown", (data) => {  // countown information
		countdown = data;
		if (countdown <= 0) {
			displayCountdown = false;
			gameStarted = true;
			setInterval(spawnFood, foodSpawnInterval);
		}
	});
	socket.on("dir", (data) => {  // player direction change
		players[data.index].headX = data.x;
		players[data.index].headY = data.y;
		players[data.index].dir = data.dir;
	});
	socket.on("food", (data) => {  // food spawn
		foods.push(new Food(data.x, data.y));
	});
	socket.on("foodEat", (data) => {  // food eat
		// foods.splice(data,1);
		foods = data;
	});
}


function addUserData(data) {
	for (let count = players.length; count < data.length; count++) {
		players.push(new Player(playerStartPos[count].x,playerStartPos[count].y, data[count].id, data[count].ip, data[count].color, playerStartPos[count].dir));
	}
	if (!connected) {
		if (data.length == 1) {
			// setInterval(startGame, 1000);
			socket.emit("countdown", countdown);
		}

		connected = true;
		pIndex = players.length - 1;
	}
}


function startGame() {
	if (countdown <= 0) {
		socket.emit("gameStart", true);
	} else {
		socket.emit("countdown", countdown);
	}
}


// when player dies
function lose(player) {
	deadPlayers.push(player);
	var index = deadPlayers.length - 1;
	setTimeout(function(){deadPlayers.splice(index);}, 3000);
}


// controls
function keyPressed() {
	if (gameStarted) {
		if (players[pIndex].alive) {
			if (keyCode === UP_ARROW) {  // up
				players[pIndex].dir = [0,-1];
			} else if (keyCode === DOWN_ARROW) {  // down
				players[pIndex].dir = [0,1];
			} else if (keyCode === LEFT_ARROW) {  // left
				players[pIndex].dir = [-1,0];
			} else if (keyCode === RIGHT_ARROW) {  // right
				players[pIndex].dir = [1,0];
			}
			let data = {
				index: pIndex,
				dir: players[pIndex].dir,
				x: players[pIndex].headX,
				y: players[pIndex].headY
			};
			socket.emit("dir", data);
		}
	}
}


// check collision for given coordinates + dir
function checkColl(x,y, dir = [0,0]) {
	// check wall collision
	if (x + dir[0] >= cnvDim.x / gridSize || x + dir[0] < 0 || y + dir[1] >= cnvDim.y / gridSize || y + dir[1] < 0) {
		return false
	}

	// check snake collision
	for (let snakeCount = 0; snakeCount < players.length; snakeCount++) {
		// check head collision
		if (x + dir[0] == players[snakeCount].headX && y + dir[1] == players[snakeCount].headY) {
			return false;
		}
		// check body collision
		for (let count = 0; count < players[snakeCount].bodyPos.length; count++) {
			if (x + dir[0] == players[snakeCount].bodyPos[count].x && y + dir[1] == players[snakeCount].bodyPos[count].y) {
				return false;
			}
		}
	}

	return true;
}


function draw() {

		background(128,128,128);

	if (displayCountdown) {
		// display start countdown
		stroke(255,255,255);
		strokeWeight(8);
		textSize(64);
		textStyle(BOLD);
		textAlign(CENTER, CENTER);
		fill(255,0,0);
		text(countdown, Math.round(cnvDim.x / 2), Math.round(cnvDim.y / 2));		
	}


		// display snakes
		players.forEach((player,index) => {
			if (player.alive) {
				if (gameStarted) player.move(player.dir);
			}
				player.show();
		});

	if (gameStarted) {

		// display and check collision with foods
		for (let count = foods.length - 1; count >= 0; count--) {
				foods[count].show();
			if (foods[count].check()) {
				// socket.emit("foodEat", foods);
				foods.splice(count,1);
			}
		}


		// display score
		textSize(24);
		textAlign(LEFT, TOP);
		fill(0,0,0,128);
		stroke(255,255,255,128);
		strokeWeight(2);
		textStyle(NORMAL);
		text("Score: " + players[pIndex].score, 16,16);


		// display dead players
		for (let count = 0; count < deadPlayers.length; count++) {
			textSize(42);
			textAlign(CENTER, TOP);
			fill(deadPlayers[count].color.head,128);
			stroke(0,0,0,128);
			strokeWeight(4);
			textStyle(BOLD);
			text(deadPlayers[count].name + " has died!\nTheir score: " + deadPlayers[count].score, cnvDim.x / 2,50);
		}

	}


	// send data to socket
	// let data = {
	// 	player: players[0],
	// 	id: id
	// };


	// socket.emit("snake", data);

}
