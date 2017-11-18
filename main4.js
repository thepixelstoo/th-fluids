(function () {
  var container = document.querySelector('body')
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
  })
  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 100)
  camera.position.z = 50
  camera.layers.enable(1)

  var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)

  var orbit = new THREE.OrbitControls(camera, renderer.domElement)
  orbit.enableZoom = false
  var bounce = false

  var p2 = 0.9405; // pressure
  var p1 = 0.3001; // pressure
  var v2 = 0.3010; // speed
  var v1 = 0.501; // speed
  var h1 = 0.4012// height
  var h2 = 0.101; // height
  var g = 11.8 // m/sec
  var group = []
  var p = 0.0
  var pos = 1.001
  var idx = 0

  function zoom() {

    if (group.circle.scale.x >= 1.5) {
      group.circle.scale.x = 1.5
      group.circle.scale.y = 1.5
      group.circle.scale.z = 1.5
    }

    group.circle.scale.x += 0.05
    group.circle.scale.y += 0.05
    group.circle.scale.z += 0.05
  }

  window.onclick = function (ev) {
    zoom()
  }

  function init() {
    renderer.preserveDrawingBuffer = true
    renderer.autoClearColor = false
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor( 0xffffff, 0)
    renderer.vr.enabled = true
    container.appendChild(renderer.domElement)

    scene.add(camera)
    scene.add(light)

    var currX = 15
    var currY = 0
    var currZ = 0

    var material = new THREE.MeshLambertMaterial({
      color: '#00e1d9',
      wireframe: true
    })
    var geometry = new THREE.SphereGeometry(10, 20, 32)

    geometry.scale( - 1, 1, 1 );

    var uvs = geometry.faceVertexUvs[0];

    for(var i = 0; i < uvs.length; i ++) {
      for(var j = 0; j < 3; j ++) {
        uvs[i][j].x *= 0.5;
      }
    }


    var circle = new THREE.Mesh(geometry, material)

    material.transparent = true
    material.opacity = 0.009

    p1 += 0.771
    p2 += 0.301

    pos += 0.101
    v1 = Math.sin(v1) * Math.random()
    v2 = Math.sin(v2) * Math.random()

    circle.position.x = p
    circle.rotation.y = v1

    group = {
      p1: p1,
      p2: p2,
      p: p,
      pos: pos,
      v1: v1,
      v2: v2,
      material: material,
      circle: circle
    }

    scene.add(circle)
  }

  var count = 0

  function bernP2 () {
    group.p2 = group.p1 + (0.5 * group.p * Math.pow(group.v1, 2)) + (group.p * g * h1) - (0.5 * group.p * Math.pow(group.v2, 2)) - (group.p * g * h2)

    if (bounce) {
      group.p1 -= 0.2011
      group.p2 -= 0.0501
      group.p  -= 0.901

      group.material.color.set('rgb(20, 180, 190)')

    } else {
      group.p1 += 10.2011
      group.p2 += 0.0501
      group.p += 0.901

      group.material.color.set('rgb(230, 10, 150)')
    }

    group.circle.rotation.y += 1
    group.circle.scale.z += 1
    group.circle.rotation.x = Math.sin(p2)

  }

  function render() {
    count++
    if (count % 200 === 0) {
      bounce = !bounce
      group.material.color.set('rgb(255, 255, 255)')

    }

    bernP2()

    orbit.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(render)
  }

  init()
  render()

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
  }
})()
