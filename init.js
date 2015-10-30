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
  camera.position.z = 28;

  ////////////// LIGHT
  var ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  scene.add(light);

  var spotLight = new THREE.SpotLight(0xffffff, .3);
  spotLight.position.set(0, 0, 40);
  scene.add(spotLight);

  ////////////// BALL
  radius = 3;
  var geom = new THREE.SphereGeometry(radius, 20, 20);
  var mat = new THREE.MeshPhongMaterial({
    color: 0x006600,
    shading: THREE.SmoothShading
  });
  ballMesh = new THREE.Mesh(geom, mat);
  scene.add(ballMesh);

  ////////////// WALLS
  var wallWidth = 60;
  var wallHeight = 40;
  var distance = 70;

  var backGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, 1);
  var sideGeometry = new THREE.BoxGeometry(distance, wallHeight, 1);
  var floorGeometry = new THREE.BoxGeometry(distance, wallWidth, 1);
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
  leftWallMesh.position.x -= wallWidth / 2;
  leftWallMesh.position.z = -distance / 2;
  scene.add(leftWallMesh);

  rightWallMesh = new THREE.Mesh(sideGeometry.clone(), wallMaterial.clone());
  rightWallMesh.rotation.y = Math.PI / 2;
  rightWallMesh.position.x += wallWidth / 2;
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
};
