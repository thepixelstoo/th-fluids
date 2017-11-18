(function () {
  var container = document.querySelector('body')
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
  })
  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 100)
  camera.position.z = 50
  var lights = [];
  lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

  lights[ 0 ].position.set( 0, 200, 0 );
  lights[ 1 ].position.set( 100, 200, 100 );
  lights[ 2 ].position.set( - 100, - 200, - 100 );

  scene.add( lights[ 0 ] );
  scene.add( lights[ 1 ] );
  scene.add( lights[ 2 ] );
  var light = new THREE.HemisphereLight('rgb(4, 113, 200)', 'rgb(55, 155, 255)', 1)

  var orbit = new THREE.OrbitControls(camera, renderer.domElement)
  orbit.enableZoom = false
  var bounce = false

  var p2 = 0.9405; // pressure
  var p1 = 0.3001; // pressure
  var v2 = 0.3010; // speed
  var v1 = 0.501; // speed
  var h1 = 0.4012// height
  var h2 = 0.101; // height
  var g = 211.8 // m/sec
  var group = []
  var p = 0.0
  var pos = 1.001
  var idx = 0

  function zoom() {

    if (group.circle.scale.x >= 2.1) {
      group.circle.scale.x = 0.5
      group.circle.scale.y = 0.5
      group.circle.scale.z = 0.5
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
    container.appendChild(renderer.domElement)

    scene.add(camera)
    scene.add(light)

    var currX = 15
    var currY = 0
    var currZ = -Math.sin(90)

    var material = new THREE.MeshPhongMaterial({
      color: 'rgb(135, 10, 70)',
      reflectivity: 1.0,
      shininess: 0.4
    })
    var geometry = new THREE.SphereGeometry(20, 112, 12)

    var circle = new THREE.Mesh(geometry, material)

    material.transparent = true
    material.opacity = 0.009

    currX += 2.01
    currY += 2.01

    circle.rotation.z = currZ
    circle.rotation.x = currX

    p1 += 0.771
    p2 += 0.301

    pos += 0.101
    v1 = Math.sin(v1) * Math.random()
    v2 = Math.sin(v2) * Math.random()

    circle.position.x = -2
    circle.position.y = 0

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

    if (count % 1000 === 0) {
      group.material.color.set('rgb(255, 255, 255)')
    }

    if (bounce) {
      //renderer.clear()
      group.p1 -= 0.2011
      group.p2 -= 0.0501
      group.p  -= 0.901

      group.material.color.set('rgb(110, 10, 210)')

    } else {
      group.p1 += 1.2011
      group.p2 += 1.0501
      group.p += 1.901

      group.material.color.set('rgb(5, 110, 210)')
    }

   // group.circle.position.z += Math.sin(group.p1)
    //group.circle.rotation.x += Math.sin(group.p2) * 0.1
    //group.circle.rotation.y += Math.sin(group.p2) * 0.1
    group.circle.position.x -= Math.cos(group.p2) * 3.1
    group.circle.position.y += Math.sin(group.p2) * 3.5
    //group.circle.position.z += Math.sin(group.p) * 1.1
  }

  function render() {
    count++
    if (count % 200 === 0) {
      bounce = !bounce
    }

    setTimeout(function () {
      bernP2()
    }, 500)

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
