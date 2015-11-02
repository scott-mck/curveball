(function () {
  Paddle = function (paddleMesh) {
    this.paddleMesh = paddleMesh;
    this.posX = 0;
    this.posY = 0;
    this.speedX = 0;
    this.speedY = 0;

    this.canMove = false;
    this.maxSpeed = .25;
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
    var canvasBox = renderer.domElement.getBoundingClientRect();
    var canvasMouseX = event.clientX - canvasBox.left;
    var canvasMouseY = event.clientY - canvasBox.top;

    this.posX = (canvasMouseX / renderer.domElement.clientWidth) * 2 - 1;
    this.posY = -(canvasMouseY / renderer.domElement.clientHeight) * 2 + 1;

    this.posX *= 34;
    this.posY *= 21;
  };

  Paddle.prototype.move = function (ball) {
    if (!this.canMove) return;

    var diffX = ball.ballMesh.position.x - this.paddleMesh.position.x;
    var diffY = ball.ballMesh.position.y - this.paddleMesh.position.y;
    var speedX = diffX;
    var speedY = diffY;

    if (Math.abs(diffX) > this.maxSpeed) speedX = this.maxSpeed;
    if (Math.abs(diffY) > this.maxSpeed) speedY = this.maxSpeed;

    if (diffX < 0) speedX *= -1;
    if (diffY < 0) speedY *= -1;

    this.posX += speedX;
    this.posY += speedY;

    this.boundPos();
    this.updatePos();
  };

  Paddle.prototype.resetPos = function () {
    this.posX = 0;
    this.posY = 0;
    this.paddleMesh.position.x = 0;
    this.paddleMesh.position.y = 0;
  };

  Paddle.prototype.updatePos = function () {
    this.paddleMesh.position.x = this.posX;
    this.paddleMesh.position.y = this.posY;
  };
})();
