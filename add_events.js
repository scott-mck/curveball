addEvents = function () {
  $(window).load(function () {
    window.container = $('#canvas');
    window.resizeId = null;
    window.canvasSize = .9
    resizeWindow();

    $(window).resize(function () {
      clearTimeout(resizeId);
      resizeId = setTimeout(resizeWindow, 100);
    });

    function resizeWindow () {
      var width = container.width();
      var height = container.height();
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();
      var scale;

      if (windowWidth > windowHeight) {
        scale = windowWidth / width;
        if (height * scale > windowHeight) scale = windowHeight / height;
      } else {
        scale = windowHeight / height;
        if (width * scale > windowWidth) scale = windowWidth / width;
      }

      $('#canvas').css('width', width * scale * canvasSize + 'px');
      $('#canvas').css('height', height * scale * canvasSize + 'px');

      camera.aspect = (width * scale) / (height * scale);
      camera.updateProjectionMatrix();
      renderer.setSize(width * scale * canvasSize, height * scale * canvasSize);
      renderer.render(scene, camera);
    }

    $(document).on('mousemove', function (event) {
      player.getMousePos(event);
    });

    $('#canvas').on('mousedown', function () {
      if (ball.inPlay || ball.dead) return;

      if (game.checkPaddleCollision(1)) {
        var oldX = playerMesh.position.x;
        var oldY = playerMesh.position.y;
        $('#canvas').one('mouseup', function () {
          if (game.checkPaddleCollision(1)) {
            ball.updateSpin(oldX, oldY, playerMesh);
            game.startPlay();
          }
        });
      }
    });

  });
};
