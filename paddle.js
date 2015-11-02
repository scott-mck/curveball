(function () {
  if (typeof Paddle === 'undefined') {
    window.Paddle = {};
  }

  Paddle = function (paddleMesh) {
    this.paddleMesh = paddleMesh;
    this.posX = 0;
    this.posY = 0;
    this.speedX = 0;
    this.speedY = 0;

    this.maxSpeed = .3;
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

  Paddle.prototype.move = function (ballMesh) {
    var diffX = ballMesh.position.x - this.paddleMesh.position.x;
    var diffY = ballMesh.position.y - this.paddleMesh.position.y;
    var speedX = diffX;
    var speedY = diffY;

    if (Math.abs(diffX) > this.maxSpeed) speedX = this.maxSpeed;
    if (Math.abs(diffY) > this.maxSpeed) speedY = this.maxSpeed;

    if (diffX < 0) speedX *= -1;
    if (diffY < 0) speedY *= -1;

    this.posX += speedX;
    this.posY += speedY;
    this.updatePos();
  };

  Paddle.prototype.updatePos = function () {
    this.paddleMesh.position.x = this.posX;
    this.paddleMesh.position.y = this.posY;
  };
})();
