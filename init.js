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

  var light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 8, 5);
  scene.add(light);

  ////////////// BALL
  radius = 3;
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
  var wallWidth = 60;
  var wallHeight = 40;
  var wallDepth = 1;
  var distance = 70;

  var backGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);
  var sideGeometry = new THREE.BoxGeometry(distance, wallHeight, wallDepth);
  var floorGeometry = new THREE.BoxGeometry(distance, wallWidth, wallDepth);
  var wallMaterial = new THREE.MeshPhongMaterial({
    color: 0xa8a8a8,
    shading: THREE.SmoothShading,
    shininess: 40,
  });

  backWallMesh = new THREE.Mesh(backGeometry.clone(), wallMaterial.clone());
  backWallMesh.position.z = -distance;
  scene.add(backWallMesh);

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

  ////////////// PADDLE
  paddleWidth = 12;
  paddleHeight = 8;
  var geom = new THREE.BoxGeometry(paddleWidth, paddleHeight, .1);
  var mat = new THREE.MeshBasicMaterial({
    color: 0x0000cc,
    transparent: true,
    opacity: .4
  });
  paddleMesh = new THREE.Mesh(geom, mat);
  paddleMesh.position.z = radius;
  scene.add(paddleMesh);
};
