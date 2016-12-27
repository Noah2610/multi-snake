
function Player() {
	this.name = "PLAYER";
	this.headX = 10;
	this.headY = 2;
	// this.bodyPos = [/*{x:0,y:0}*/];
	this.bodyPos = [{x:9,y:2}, {x:8,y:2}, {x:7,y:2}, {x:7,y:3}, {x:6,y:3}, {x:6,y:4}];
	this.alive = true;

	this.randColor = [
		Math.floor((Math.random() * 255) + 1),
		Math.floor((Math.random() * 255) + 1),
		Math.floor((Math.random() * 255) + 1)
	];

	this.color = {
		head: this.randColor,
		body: this.randColor.concat([128])
	};


	this.check = function (x,y, dir) {
		// check wall collision
		if (x + dir[0] >= cnvDim.x / gridSize || x + dir[0] < 0 || y + dir[1] >= cnvDim.y / gridSize || y + dir[1] < 0) {
			return false
		}

		// check snake collision
		for (var pCount = 0; pCount < players.length; pCount++) {
			for (var count = 0; count < players[pCount].bodyPos.length; count++) {
				if (x + dir[0] == players[pCount].bodyPos[count].x && y + dir[1] == players[pCount].bodyPos[count].y) {
					return false;
				}
			}
		}

		return true;
	}


	this.move = function (dir) {
		if (this.check(this.headX,this.headY, dir)) {
			// update body
			for (var count = this.bodyPos.length - 1; count > 0; count--) {
				this.bodyPos[count].x = this.bodyPos[count - 1].x;
				this.bodyPos[count].y = this.bodyPos[count - 1].y;
			}
				// update first body piece
				this.bodyPos[0].x = this.headX;
				this.bodyPos[0].y = this.headY;

			// update head	
			this.headX += dir[0];
			this.headY += dir[1];
		}

		else {
			// lose
			this.alive = false;
			lose(this);
		}
	}


	this.show = function () {
		noStroke();
		// draw head
		fill(this.color.head);
		rect(this.headX * gridSize, this.headY * gridSize, gridSize,gridSize);

		// draw body
		fill(this.color.body);
		for (var count = 0; count < this.bodyPos.length; count++) {
			rect(this.bodyPos[count].x * gridSize, this.bodyPos[count].y * gridSize, gridSize,gridSize);
		}

	}
}
