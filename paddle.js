(function () {
  Paddle = function (mesh) {
    this.mesh = mesh;
    this.posX = 0;
    this.posY = 0;
    this.speedX = 0;
    this.speedY = 0;

    this.canMove = true;
    this.compMaxSpeed = .3;
  };

  Paddle.prototype.boundPos = function () {
    if (this.posX < leftWallMesh.position.x) {
      this.posX = leftWallMesh.position.x;
    } else if (this.posX > rightWallMesh.position.x) {
      this.posX = rightWallMesh.position.x;
    }

    if (this.posY < floorMesh.position.y) {
      this.posY = floorMesh.position.y;
    } else if (this.posY > ceilingMesh.position.y) {
      this.posY = ceilingMesh.position.y;
    }
  };

  Paddle.prototype.getMousePos = function (event) {
    if (!this.canMove) return;
    
    var canvasBox = renderer.domElement.getBoundingClientRect();
    var canvasMouseX = event.clientX - canvasBox.left;
    var canvasMouseY = event.clientY - canvasBox.top;

    this.posX = (canvasMouseX / renderer.domElement.clientWidth) * 2 - 1;
    this.posY = -(canvasMouseY / renderer.domElement.clientHeight) * 2 + 1;

    this.posX *= 34;
    this.posY *= 21;
  };

  Paddle.prototype.increaseMaxSpeed = function () {
    this.compMaxSpeed += .1;
  };


  Paddle.prototype.move = function (ball) {
    if (!this.canMove) return;

    var diffX = ball.mesh.position.x - this.mesh.position.x;
    var diffY = ball.mesh.position.y - this.mesh.position.y;
    var speedX = diffX;
    var speedY = diffY;

    if (Math.abs(diffX) > this.compMaxSpeed) {
      speedX = this.compMaxSpeed;
      if (diffX < 0) speedX *= -1;
    }

    if (Math.abs(diffY) > this.compMaxSpeed) {
      speedY = this.compMaxSpeed;
      if (diffY < 0) speedY *= -1;
    }

    this.posX += speedX;
    this.posY += speedY;

    this.boundPos();
    this.updatePos();
  };

  Paddle.prototype.resetPos = function () {
    this.posX = 0;
    this.posY = 0;
    this.mesh.position.x = 0;
    this.mesh.position.y = 0;
  };

  Paddle.prototype.updatePos = function () {
    this.mesh.position.x = this.posX;
    this.mesh.position.y = this.posY;
  };
})();
