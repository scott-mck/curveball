init = function () {
  canvasWidth = $('#canvas').width();
  canvasHeight = $('#canvas').height();
  var container = document.getElementById('canvas');
  document.body.appendChild(container);
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(canvasWidth, canvasHeight);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, canvasWidth / canvasHeight, 1, 1000);
  camera.position.z = 30;

  ////////////// LIGHT
  var ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  var light = new THREE.PointLight(0xffffff, 1, 200);
  light.position.set(10, 8, 30);
  scene.add(light);

  ////////////// BALL
  var geom = new THREE.SphereGeometry(radius, 20, 20);
  var mat = new THREE.MeshPhongMaterial({
    color: 0x006600,
    specular: 0xffffff,
    shininess: 6,
    shading: THREE.SmoothShading
  });
  ballMesh = new THREE.Mesh(geom, mat);
  ballMesh.position.z = -radius;

  var light = new THREE.PointLight(0x006600, 1, 40);
  light.position.copy(ballMesh.position);
  ballMesh.add(light);
  ballMesh.light = light;
  scene.add(ballMesh);

  ////////////// WALLS
  var backGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);
  var sideGeometry = new THREE.BoxGeometry(distance, wallHeight, wallDepth);
  var floorGeometry = new THREE.BoxGeometry(distance, wallWidth, wallDepth);
  var wallMaterial = new THREE.MeshPhongMaterial({
    color: 0xa8a8a8,
    specular: 0x444444,
    shading: THREE.SmoothShading,
    shininess: 90
  });

  leftWallMesh = new THREE.Mesh(sideGeometry.clone(), wallMaterial.clone());
  leftWallMesh.rotation.y = Math.PI / 2;
  leftWallMesh.position.x -= (wallWidth / 2) - (wallDepth / 2);
  leftWallMesh.position.z = -distance / 2;
  scene.add(leftWallMesh);

  rightWallMesh = new THREE.Mesh(sideGeometry.clone(), wallMaterial.clone());
  rightWallMesh.rotation.y = Math.PI / 2;
  rightWallMesh.position.x += (wallWidth / 2) - (wallDepth / 2);
  rightWallMesh.position.z = -distance / 2;
  scene.add(rightWallMesh);

  floorMesh = new THREE.Mesh(floorGeometry.clone(), wallMaterial.clone());
  floorMesh.rotation.x = Math.PI / 2;
  floorMesh.rotation.z = Math.PI / 2;
  floorMesh.position.y -= wallHeight / 2;
  floorMesh.position.z = -distance / 2;
  scene.add(floorMesh);

  ceilingMesh = new THREE.Mesh(floorGeometry.clone(), wallMaterial.clone());
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.rotation.z = Math.PI / 2;
  ceilingMesh.position.y += wallHeight / 2;
  ceilingMesh.position.z = -distance / 2;
  scene.add(ceilingMesh);

  ////////////// PADDLES
  var geom = new THREE.BoxGeometry(paddleWidth, paddleHeight, .1);
  var mat = new THREE.MeshBasicMaterial({
    color: 0x0000cc,
    transparent: true,
    opacity: .4
  });

  playerMesh = new THREE.Mesh(geom.clone(), mat.clone());
  playerMesh.position.z = radius;
  scene.add(playerMesh);

  compMesh = new THREE.Mesh(geom.clone(), mat.clone());
  compMesh.position.z = -distance;
  scene.add(compMesh);

  ////////////// CREATE BALL AND PADDLES
  ball = new Ball(ballMesh);
  player = new Paddle(playerMesh);
  comp = new Paddle(compMesh);

  ////////////// CREATE HEART
  var heartMat = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    specular: 0x696969,
    shininess: 40
  });

  // heartShape = new THREE.Shape();
  // var size = 8;
  // var x = 0; var y = 0; // point 1
  // var x2 = 0; var y2 = -size / 2; // point 3
  // heartShape.moveTo(x, y);
  // heartShape.bezierCurveTo(x + size / 2, y + size / 2, x + (size / 1.3), y2 / 2, x2, y2);
  // heartShape.bezierCurveTo(x - (size / 1.3), y2 / 2, x - size / 2, y + size / 2, x, y);

  // heartGeom = new THREE.ExtrudeGeometry(heartShape, {
  //   amount: .1,
  //   // curveSegments: 50,
  //   // bevelEnabled: true,
  //   // bevelSegments: 20,
  //   // steps: 2,
  //   // bevelSize: .5,
  //   // bevelThickness: .4,
  // extrudePath: extrude
  // });


  hearts = [];
  for (var i = 0; i < lives; i++) {
    var heartMesh = new THREE.Mesh(new THREE.HeartGeometry({ points_per_layer: 41 }), heartMat.clone());
    heartMesh.rotation.y = Math.PI / 2;
    heartMesh.position.x = 12 + i * 3.5;
    heartMesh.position.y += 17;
    heartMesh.scale.set(1.3, 1.3, 1.3);
    scene.add(heartMesh);
    hearts.push(heartMesh);
  }
};
