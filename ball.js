(function () {
  if (typeof Ball === 'undefined') {
    window.Ball = {};
  }

  Ball = function (ballMesh) {
    this.ballMesh = ballMesh;
    this.speedX = -.5;
    this.speedY = .2;
    this.speedZ = -.5;
  }
})();
