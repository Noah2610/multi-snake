
var cnvDim = {x: 800, y: 600};
var gridSize = 25;
var players = [];
var playersDir = [[1,0]];
var gameSpd = 10;
var deadPlayers = [];
var windowDim = {width: 0, height: 0};


function setup() {
	windowDim.width = windowWidth; windowDim.height = windowHeight;
	createCanvas(cnvDim.x,cnvDim.y);
	background(128,128,128);
	frameRate(gameSpd);

	players[0] = new Player();
}


function lose(player) {
	deadPlayers.push(player);
	var index = deadPlayers.length - 1;
	setTimeout(function(){deadPlayers.splice(index);}, 3000);
}


function keyPressed() {
	if (players[0].alive) {
		if (keyCode === UP_ARROW) {  // up
			playersDir[0] = [0,-1];
		} else if (keyCode === DOWN_ARROW) {  // down
			playersDir[0] = [0,1];
		} else if (keyCode === LEFT_ARROW) {  // left
			playersDir[0] = [-1,0];
		} else if (keyCode === RIGHT_ARROW) {  // right
			playersDir[0] = [1,0];
		}
	}
}


function draw() {
	background(128,128,128);

	// display snakes
	if (players[0].alive) {
		players[0].move(playersDir[0]);
	}
	players[0].show();


	// display dead players
	for (var count = 0; count < deadPlayers.length; count++) {
		textSize(48);
		textAlign(CENTER, TOP);
		fill(deadPlayers[count].randColor);
		// stroke(deadPlayers[count].randColor);
		// strokeWeight(8);
		textStyle(BOLD);
		text(deadPlayers[count].name + " has died!", cnvDim.x / 2,50);
	}
}


