
// if (gameStarted) {
// 	setInterval(spawnFood, foodSpawnInterval);
// }


function spawnFood() {
	if (Math.floor(Math.random() * foodSpawnRate) == 0) {
		let checkTmp = false;
		var foodX; var foodY;
		while (checkTmp == false) {
			foodX = Math.floor(Math.random() * ((cnvDim.x / gridSize) + 1));
			foodY = Math.floor(Math.random() * ((cnvDim.y / gridSize) + 1));
			checkTmp = checkColl(foodX,foodY);
			
			foods.forEach((food) => {
				if (foodX == food.x && foodY == food.y) {
					checkTmp = false;
				}
			});
		}
		socket.emit("food", {x: foodX, y: foodY});
		foods.push(new Food(foodX,foodY));
	}
}


function Food(x,y) {
	this.x = x;
	this.y = y;


	this.check = function () {
			let returnVal = false;
		players.forEach((player) => {
			if (this.x == player.headX && this.y == player.headY) {
				player.score++;
				player.bodyPos.push({x: player.bodyPos[player.bodyPos.length - 1].x, y: player.bodyPos[player.bodyPos.length - 1].y});
				returnVal = true;
			}
		});
			return returnVal;
	}


	this.show = function () {
		stroke(255,0,0,64);
		strokeWeight(4);
		fill(128,0,0);
		ellipse(this.x * gridSize + Math.round(gridSize / 2),this.y * gridSize + Math.round(gridSize / 2), foodSize);
	}
}
