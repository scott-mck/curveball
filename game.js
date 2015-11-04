(function () {
  Game = function (ball, player, comp) {
    this.ball = ball;
    this.player = player;
    this.comp = comp;
  };

  Game.prototype.checkPaddleCollision = function (dir) {
    if (this.ball.dead) return;

    var points = ball.getCollisionPoints();
    var vectorDir = new THREE.Vector3();
    vectorDir.z = 1 * dir;
    for (var i = 0; i < points.length; i++) {
      var raycaster = new THREE.Raycaster(points[i], vectorDir);
      var intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        return true;
      }
    }
    return false;
  };

  Game.prototype.createText = function (text) {
    var geom = new THREE.TextGeometry('Level ' + text, {
      font: 'helvetiker',
      size: 5,
      height: 1
    });
    var mat = new THREE.MeshPhongMaterial({
      color: 0x00004c,
      shininess: 20,
      specular: 0x7e7e7e,
      transparent: true
    });
    return new THREE.Mesh(geom, mat);
  };

  Game.prototype.detectCollisions = function () {
    this.detectCollisionX();
    this.detectCollisionY();
    this.detectCollisionZ();
  };

  Game.prototype.detectCollisionX = function () {
    if (ballMesh.position.x <= leftWallMesh.position.x + radius) {
      this.ball.mesh.position.x = leftWallMesh.position.x + radius;
      this.ball.speedX *= -1;
    } else if (ballMesh.position.x >= rightWallMesh.position.x - radius) {
      this.ball.mesh.position.x = rightWallMesh.position.x - radius;
      this.ball.speedX *= -1;
    }
  };

  Game.prototype.detectCollisionY = function () {
    if (ballMesh.position.y <= floorMesh.position.y + radius) {
      this.ball.mesh.position.y = floorMesh.position.y + radius;
      this.ball.speedY *= -1;
    } else if (ballMesh.position.y >= ceilingMesh.position.y - radius) {
      this.ball.mesh.position.y = ceilingMesh.position.y - radius;
      this.ball.speedY *= -1;
    }
  };

  Game.prototype.detectCollisionZ = function () {
    if (ballMesh.position.z < -distance + radius) {
      if (this.checkPaddleCollision(-1)) {
        this.ball.mesh.position.z = -distance + radius;
        this.ball.speedZ *= -1;
        this.getCompPaddleSpeed();
      } else {
        this.stopPlay();
      }
    } else if (ballMesh.position.z > -radius) {
      if (this.checkPaddleCollision(1)) {
        this.ball.mesh.position.z = -radius;
        this.ball.speedZ *= -1;
        this.getPlayerPaddleSpeed();
      } else {
        this.stopPlay();
      }
    }
  };

  Game.prototype.fadeInText = function (textMesh) {
    var id = requestAnimationFrame(this.fadeInText.bind(this, textMesh));
    textMesh.position.z += 3;
    renderer.render(scene, camera);

    if (textMesh.position.z >= 0) {
      cancelAnimationFrame(id);
      setTimeout(function () {
        this.fadeOutText(textMesh);
      }.bind(this), 600);
    }
  };

  Game.prototype.fadeOutText = function (textMesh) {
    var id = requestAnimationFrame(this.fadeOutText.bind(this, textMesh));
    textMesh.material.opacity -= .02;
    renderer.render(scene, camera);

    if (textMesh.material.opacity <= 0) {
      cancelAnimationFrame(id);
    }
  };

  Game.prototype.getCompPaddleSpeed = function () {
    var oldX = this.comp.mesh.position.x;
    var oldY = this.comp.mesh.position.y;
    setTimeout(function () {
      this.ball.updateSpin(oldX, oldY, this.comp.mesh);
    }.bind(this), 0);
  };

  Game.prototype.getPlayerPaddleSpeed = function () {
    var oldX = this.player.mesh.position.x;
    var oldY = this.player.mesh.position.y;
    setTimeout(function () {
      this.ball.updateSpin(oldX, oldY, this.player.mesh);
    }.bind(this), 0);
  };

  Game.prototype.play = function () {
    if (this.ball.inPlay) this.detectCollisions();

    this.player.updatePos();
    this.comp.move(this.ball);

    this.ball.updatePos();
    this.ball.spin();

    requestAnimationFrame(this.play.bind(this));
    renderer.render(scene, camera);
  };

  Game.prototype.showLevel = function (level) {
    var textMesh = this.createText(level);
    textMesh.geometry.computeBoundingBox();
    var width = textMesh.geometry.boundingBox.max.x - textMesh.geometry.boundingBox.min.x;
    textMesh.position.set(-width / 2, 10, -100);
    scene.add(textMesh);
    this.fadeInText(textMesh);
  };

  Game.prototype.startPlay = function () {
    this.ball.start();
    this.comp.canMove = true;
  };

  Game.prototype.stopPlay = function () {
    this.ball.stop();
    this.comp.canMove = false;
    setTimeout(function () {
      this.ball.reset();
      this.comp.resetPos();
    }.bind(this), 1000);
  };
})();
