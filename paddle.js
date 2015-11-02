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

  Paddle.prototype.updatePos = function () {
    this.paddleMesh.position.x = this.posX;
    this.paddleMesh.position.y = this.posY;
  };
})();
