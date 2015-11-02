addEvents = function () {
  $('#canvas').css('cursor', 'none');

  $(document).on('mousemove', function (event) {
    player.getMousePos(event);
  });

  $('#canvas').on('mousedown', function () {
    if (ball.inPlay || ball.dead) return;

    if (checkPaddleCollision(-1)) {
      var oldX = playerMesh.position.x;
      var oldY = playerMesh.position.y;
      $('#canvas').one('mouseup', function () {
        if (checkPaddleCollision(-1)) {
          ball.updateSpin(oldX, oldY, playerMesh);
          ball.start();
        }
      });
    }
  });
};

$(document).ready(addEvents);
