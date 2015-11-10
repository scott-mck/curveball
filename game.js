(function () {
  Game = function (ball, player, comp) {
    this.ball = ball;
    this.player = player;
    this.comp = comp;
    this.playAgainButton;

    this.level = 0;
    this.wins = 0;
    this.losses = 0;
  };

  Game.prototype.checkButtonPress = function (event) {
    var canvasBox = renderer.domElement.getBoundingClientRect();
    var canvasMouseX = event.clientX - canvasBox.left;
    var canvasMouseY = event.clientY - canvasBox.top;

    var mouse = new THREE.Vector2();
    mouse.x = (canvasMouseX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(canvasMouseY / renderer.domElement.clientHeight) * 2 + 1;

    var ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);
    var hits = ray.intersectObjects([this.playAgainButton.buttonPress], true);

    var that = this;
    if (hits.length > 0) {
      that.playAgainButton.press(function () {
        setTimeout(function () {
          that.removePlayAgainButton(that.playAgain.bind(that));
        }, 300);
      });
    }
  }

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

  Game.prototype.createPlayAgainButton = function () {
    var width = 8;
    var height = 8;
    var slope = .2;

    var inside = this.createPlayAgainButtonInside(width, height, slope);
    var outside = this.createPlayAgainButtonOutside(width, height, slope);
    var base = this.createPlayAgainButtonBase(width, height, slope);

    var playAgainButton = new THREE.Object3D();
    var buttonPress = new THREE.Object3D();

    buttonPress.add(inside);
    buttonPress.add(outside);
    playAgainButton.add(buttonPress);
    playAgainButton.add(base);

    playAgainButton.buttonPress = buttonPress;
    playAgainButton.press = function (callback) {
      var id = requestAnimationFrame(function () {
        playAgainButton.press(callback);
      });
      buttonPress.position.z += .3;
      if (buttonPress.position.z >= height / 2) {
        cancelAnimationFrame(id);
        playAgainButton.release(callback);
      }
    };

    playAgainButton.release = function (callback) {
      var id = requestAnimationFrame(function () {
        playAgainButton.release(callback);
      });
      buttonPress.position.z -= .15;
      if (buttonPress.position.z <= 0) {
        cancelAnimationFrame(id);
        callback && callback();
      }
    };
    return playAgainButton;
  };

  Game.prototype.createPlayAgainButtonBase = function (width, height, slope) {
    var buttonGeom = this.createPlayAgainButtonGeometry(width * 1.2, height * .1, slope);
    var baseMat = new THREE.MeshPhongMaterial({
      color: 0xa8a8a8,
      shininess: 100,
      specular: 0xffffff
    });
    base = new THREE.Mesh(buttonGeom.clone(), baseMat);
    scene.add(base);

    return base;
  };

  Game.prototype.createPlayAgainButtonGeometry = function (width, height, slope) {
    var path = new THREE.Path();
    path.moveTo(0, height);
    path.quadraticCurveTo(width, height, width, (1 - slope) * height);
    path.lineTo(width, 0);
    var list = [];
    var points = path.getPoints(10);
    for (var i = 0; i < points.length; i++) {
      list.push(new THREE.Vector3(points[i].x, 0, -points[i].y));
    }
    return new THREE.LatheGeometry(list, 40);
  };

  Game.prototype.createPlayAgainButtonInside = function (width, height, slope) {
    var buttonGeom = this.createPlayAgainButtonGeometry(width, height, slope);
    var insideMat = new THREE.MeshPhongMaterial({
      color: 0xcc0000,
      shininess: 0
    });
    var inside = new THREE.Mesh(buttonGeom.clone(), insideMat);

    var text = this.createPlayAgainButtonText(width, height, slope);
    text.rotation.x -= Math.PI;
    text.scale.set(1, height / 2, 1);

    var bound = new THREE.Box3();
    bound.setFromObject(text);
    var textWidth = bound.max.x - bound.min.x;
    var textHeight = bound.max.y - bound.min.y;

    inside.add(text)
    text.position.set(-textWidth / 2, textHeight / 3, -width);
    scene.add(inside);
    return inside;
  };

  Game.prototype.createPlayAgainButtonOutside = function (width, height, slope) {
    var buttonGeom = this.createPlayAgainButtonGeometry(width * 1.1, height * 1.1, slope);
    var outsideMat = new THREE.MeshPhongMaterial({
      color: 0x3f3f3f,
      shininess: 100,
      transparent: true,
      opacity: .3
    });
    var outside = new THREE.Mesh(buttonGeom.clone(), outsideMat);
    outside.renderOrder = 1;
    scene.add(outside);

    return outside;
  };

  Game.prototype.createPlayAgainButtonText = function (width, height, slope) {
    var text = this.createText('Play Again?', {
      color: 0xffffff,
      size: width / 5,
      height: .1,
      material: 'MeshPhongMaterial'
    });

    var modifier = new THREE.BendModifier();
    var dir = new THREE.Vector3(0, 0, -1);
    var axis = new THREE.Vector3(0, 1, 0);
    var angle = Math.acos((height - slope) / height) / 2;

    modifier.set(dir, axis, angle);
    modifier.modify(text.geometry);

    modifier.set(dir, new THREE.Vector3(1, 0, 0), angle);
    modifier.modify(text.geometry);

    return text;
  };

  Game.prototype.createText = function (text, options) {
    if (!options) options = {};
    var params = {
      color: options.color || 0xffffff,
      size: options.size || 4,
      height: options.height || 1,
      specular: options.specular || 0x7e7e7e,
      transparent: options.transparent || true,
      material: options.material || 'MeshPhongMaterial'
    };

    var geom = new THREE.TextGeometry(text, {
      font: 'optimer',
      size: params.size,
      height: params.height
    });
    var mat = new THREE[params.material]({
      color: params.color,
      shininess: 20,
      specular: params.specular,
      transparent: params.transparent
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

    if (levelText.material.opacity >= 1) {
      cancelAnimationFrame(id);
      callback && callback();
      setTimeout(function () {
        this.moveTextToHeader(levelText);
      }.bind(this), 600);
    }
  };

  Game.prototype.gameOver = function () {
    this.showCursor();
    scene.remove(this.levelText);
    this.ball.stop();

    this.levelText = this.createText('Game Over', { color: 0x990000 });
    this.levelText.geometry.computeBoundingBox();
    var width = this.levelText.geometry.boundingBox.max.x - this.levelText.geometry.boundingBox.min.x;
    this.levelText.position.set(-width / 2, 10, 0);
    scene.add(this.levelText);

    this.showplayAgainButton();
    $(document).click(this.checkButtonPress.bind(this));
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

  Game.prototype.hideCursor = function () {
    scene.add(this.player.mesh);
    $('#canvas').css('cursor', 'none');
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

    if (levelText.position.y >= 14) {
      cancelAnimationFrame(id);
      callback && callback();
    }
  };

  Game.prototype.play = function () {
    requestAnimationFrame(this.play.bind(this));

    if (this.ball.inPlay) this.detectCollisions();

    this.player.updatePos();
    this.comp.move(this.ball);

    this.ball.updatePos();
    this.ball.spin();

    renderer.render(scene, camera);
  };

  Game.prototype.playAgain = function () {
    $(document).off('click');
    addAllHearts();
    this.level = 0;
    this.wins = 0;
    this.losses = 0;
    this.reset();
    this.hideCursor();
    this.showNextLevel();
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
  };

  Game.prototype.removePlayAgainButton = function (callback) {
    var id = requestAnimationFrame(function () {
      this.removePlayAgainButton(callback);
    }.bind(this));
    this.playAgainButton.position.y -= .5;
    renderer.rende

    if (this.playAgainButton.position.y <= -40) {
      cancelAnimationFrame(id);
      scene.remove(this.playAgainButton);
      callback && callback();
    }
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
    if (hearts.length === 0) return;

    var id = requestAnimationFrame(this.rotateHearts.bind(this));
    for (var i = 0; i < hearts.length; i++) {
      hearts[i].rotation.y += .1;
    }

    if (hearts[0].rotation.y >= (Math.PI * 2) + Math.PI / 2) {
      cancelAnimationFrame(id);
      for (var i = 0; i < hearts.length; i++) {
        hearts[i].rotation.y = Math.PI / 2;
      }
    }
  };

  Game.prototype.showCursor = function () {
    scene.remove(this.player.mesh);
    $('#canvas').css('cursor', 'default');
  };

  Game.prototype.showplayAgainButton = function () {
    if (!this.playAgainButton) {
      this.playAgainButton = this.createPlayAgainButton();
      this.playAgainButton.rotation.x += Math.PI / 2;
      this.playAgainButton.position.y = -40;
      this.playAgainButton.position.z = -12;
    }
    scene.add(this.playAgainButton);

    function animateplayAgainButton () {
      var id = requestAnimationFrame(animateplayAgainButton.bind(this));
      this.playAgainButton.position.y += .5;
      if (this.playAgainButton.position.y >= -wallHeight / 2 + wallDepth / 2) {
        cancelAnimationFrame(id);
      }
    }
    animateplayAgainButton.call(this);
  };

  Game.prototype.showNextLevel = function () {
    this.level += 1;

    scene.remove(this.levelText);
    this.levelText = this.createText('Level ' + this.level, { color: 0x00004c });
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
