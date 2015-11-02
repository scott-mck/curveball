(function () {
  if (typeof Ball === 'undefined') {
    window.Ball = {};
  }

  Ball = function (ballMesh) {
    this.ballMesh = ballMesh;
    this.speedX = 0;
    this.speedY = 0;
    this.speedZ = 0;
    this.spinX = 0;
    this.spinY = 0;
    this.inPlay = false;
    this.dead = false;
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

  Ball.prototype.reset = function () {
    this.spinX = 0;
    this.spinY = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.speedZ = 0;
    this.inPlay = false;
    this.dead = false;
    this.ballMesh.position.set(0, 0, -radius);
    ballMesh.material.color.setHex(0x006600);
    ballMesh.light.color.setHex(0x006600);
  };

  Ball.prototype.resetSpin = function () {
    this.spinX = 0;
    this.spinY = 0;
  };

  Ball.prototype.spin = function () {
    this.speedX += this.spinX;
    this.speedY += this.spinY;

    this.spinX *= .99;
    this.spinY *= .99;
  };

  Ball.prototype.start = function () {
    this.speedZ = -.8;
    this.inPlay = true;
    this.dead = false;
  };

  Ball.prototype.stop = function () {
    this.speedX = 0;
    this.speedY = 0;
    this.speedZ = 0;
    this.spinX = 0;
    this.spinY = 0;
    ballMesh.material.color.setHex(0x990000);
    ballMesh.light.color.setHex(0x990000);
    this.inPlay = false;
    this.dead = true;
  };

  Ball.prototype.updatePos = function () {
    this.ballMesh.position.x += this.speedX;
    this.ballMesh.position.y += this.speedY;
    this.ballMesh.position.z += this.speedZ;
  };

  Ball.prototype.updateSpin = function (oldX, oldY, paddleMesh) {
    this.spinX = Math.abs(paddleMesh.position.x - oldX) / 100;
    if (paddleMesh.position.x > oldX) this.spinX *= -1;

    this.spinY = Math.abs(paddleMesh.position.y - oldY) / 100;
    if (paddleMesh.position.y > oldY) this.spinY *= -1;
  };
})();
