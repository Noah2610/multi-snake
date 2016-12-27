
function Player(x=Math.round(cnvDim.x/gridSize/2),y=Math.round(cnvDim.y/gridSize/2)-1, id,ip, color, dir=[0,0]) {
	this.id = id;
	this.ip = ip;

	this.name = "PLAYER";
	// this.headX = Math.round(cnvDim.x / gridSize / 2);
	// this.headY = Math.round(cnvDim.y / gridSize / 2) - 1;
	this.headX = x;
	this.headY = y;
	this.bodyPos = [{x: this.headX,y: this.headY}, {x: this.headX,y: this.headY}];
	// this.bodyPos = [{x:9,y:2}, {x:8,y:2}, {x:7,y:2}, {x:7,y:3}, {x:6,y:3}, {x:6,y:4}];
	this.alive = true;
	this.score = 0;
	this.dir = dir;

	this.color = {
		head: color,
		body: color.concat([192])
	};


	this.move = function () {
		if (checkColl(this.headX,this.headY, this.dir)) {
			// update body
			for (var count = this.bodyPos.length - 1; count > 0; count--) {
				this.bodyPos[count].x = this.bodyPos[count - 1].x;
				this.bodyPos[count].y = this.bodyPos[count - 1].y;
			}
				// update first body piece
				this.bodyPos[0].x = this.headX;
				this.bodyPos[0].y = this.headY;

			// update head	
			this.headX += this.dir[0];
			this.headY += this.dir[1];
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
