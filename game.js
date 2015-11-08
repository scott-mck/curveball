(function () {
  Game = function (ball, player, comp) {
    this.ball = ball;
    this.player = player;
    this.comp = comp;

    this.level = 0;
    this.wins = 0;
    this.losses = 0;
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

  Game.prototype.createText = function (text, color) {
    var geom = new THREE.TextGeometry(text, {
      font: 'optimer',
      size: 4,
      height: 1
    });
    var mat = new THREE.MeshPhongMaterial({
      color: color,
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
        this.playerWin();
      }
    } else if (ballMesh.position.z > -radius) {
      if (this.checkPaddleCollision(1)) {
        this.ball.mesh.position.z = -radius;
        this.ball.speedZ *= -1;
        this.getPlayerPaddleSpeed();
      } else {
        this.playerLose();
      }
    }
  };

  Game.prototype.fadeInText = function (levelText, callback) {
    var id = requestAnimationFrame(function () {
      this.fadeInText(levelText, callback);
    }.bind(this));
    levelText.material.opacity += .02;
    renderer.render(scene, camera);

    if (levelText.material.opacity >= 1) {
      cancelAnimationFrame(id);
      callback && callback();
      setTimeout(function () {
        this.moveTextToHeader(levelText);
      }.bind(this), 600);
    }
  };

  Game.prototype.moveTextToHeader = function (levelText, callback) {
    var id = requestAnimationFrame(function () {
      this.moveTextToHeader(levelText, callback);
    }.bind(this));
    levelText.position.y += .5;
    levelText.position.z += .3;
    levelText.scale.set(
      levelText.scale.x * .97,
      levelText.scale.y * .97,
      levelText.scale.z * .97
    );
    levelText.geometry.boundingBox.min.x *= .97;
    levelText.geometry.boundingBox.max.x *= .97;
    var width = levelText.geometry.boundingBox.max.x - levelText.geometry.boundingBox.min.x;
    levelText.position.setX(-width / 2);
    renderer.render(scene, camera);

    if (levelText.position.y >= 14) {
      cancelAnimationFrame(id);
      callback && callback();
    }
  };

  Game.prototype.gameOver = function () {
    scene.remove(this.levelText);
    var levelText = this.createText('Game Over', 0x990000);
    levelText.geometry.computeBoundingBox();
    var width = levelText.geometry.boundingBox.max.x - levelText.geometry.boundingBox.min.x;
    levelText.position.set(-width / 2, 10, 0);
    scene.add(levelText);
    this.ball.stop();
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

  Game.prototype.playNextLevel = function () {
    this.showNextLevel();
    this.ball.increaseSpeed();
    this.comp.increaseMaxSpeed();
  };

  Game.prototype.playerLose = function () {
    this.losses += 1;
    this.stopPlay();
    setTimeout(function () {
      this.removeHeart(hearts.pop());
    }.bind(this), 1000);
  };

  Game.prototype.playerWin = function () {
    this.wins += 1;
    this.stopPlay();
  };

  Game.prototype.removeHeart = function (heart) {
    if (!heart) return;

    var id = requestAnimationFrame(this.removeHeart.bind(this, heart));
    heart.rotation.y += .3;
    heart.position.y -= .1;
    heart.scale.set(
      heart.scale.x * .96,
      heart.scale.y * .96,
      heart.scale.z * .96
    );

    if (heart.scale.x <= .1) {
      cancelAnimationFrame(id);
      scene.remove(heart);
    }
    renderer.render(scene, camera);
  };

  Game.prototype.reset = function () {
    this.ball.reset();
    this.comp.resetPos();
    if (this.wins >= 3) {
      this.wins = 0;
      this.playNextLevel();
    }

    if (this.losses >= lives) {
      this.gameOver();
    }
  };

  Game.prototype.rotateHearts = function () {
    var id = requestAnimationFrame(this.rotateHearts.bind(this));
    for (var i = 0; i < hearts.length; i++) {
      hearts[i].rotation.y += .1;
    }
    renderer.render(scene, camera);

    if (hearts[0].rotation.y >= (Math.PI * 2) + Math.PI / 2) {
      cancelAnimationFrame(id);
      for (var i = 0; i < hearts.length; i++) {
        hearts[i].rotation.y = Math.PI / 2;
      }
    }
  };

  Game.prototype.showNextLevel = function () {
    this.level += 1;

    scene.remove(this.levelText);
    this.levelText = this.createText('Level ' + this.level, 0x00004c);
    this.levelText.material.opacity = 0;
    this.levelText.geometry.computeBoundingBox();
    var width = this.levelText.geometry.boundingBox.max.x - this.levelText.geometry.boundingBox.min.x;
    this.levelText.position.set(-width / 2, 10, 0);
    scene.add(this.levelText);
    var completionCallback = function () {
      setTimeout(function () {
        this.rotateHearts();
      }.bind(this), 600);
    };
    this.fadeInText(this.levelText, completionCallback.bind(this));
  };

  Game.prototype.startPlay = function () {
    this.ball.start();
    this.comp.canMove = true;
  };

  Game.prototype.stopPlay = function () {
    this.ball.stop();
    this.comp.canMove = false;
    setTimeout(function () {
      this.reset();
    }.bind(this), 1000);
  };
})();
