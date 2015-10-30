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

  Ball.prototype.getCollisionPoints = function () {
    var points = [ballMesh.position.clone()];
    var ballPos = ballMesh.position.clone();
    var angle = 0;
    for (var i = 0; i < 8; i++) {
      var x = Math.cos(angle);
      var y = Math.sin(angle);

      var dir = new THREE.Vector3(x, y, 0);
      dir.multiplyScalar(radius);
      points.push(dir.add(ballPos));

      angle += Math.PI / 4;
    }
    return points;
  };
})();
