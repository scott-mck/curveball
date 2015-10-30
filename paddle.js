(function () {
  if (typeof Paddle === 'undefined') {
    window.Paddle = {};
  }

  Paddle = function (paddleMesh) {
    this.paddleMesh = paddleMesh;
    this.posX = 0;
    this.posY = 0;

    $(document).on('mousemove', function (event) {
      var canvasBox = renderer.domElement.getBoundingClientRect();
      var canvasMouseX = event.clientX - canvasBox.left;
      var canvasMouseY = event.clientY - canvasBox.top;

      this.posX = (canvasMouseX / renderer.domElement.clientWidth) * 2 - 1;
      this.posY = -(canvasMouseY / renderer.domElement.clientHeight) * 2 + 1;

      this.posX *= 7;
      this.posY *= 4.2;
    }.bind(this));
  };
})();
