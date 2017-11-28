(function () {
  var container = document.querySelector('body')
  var count = 0
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
  })
  var opacity = 0.09
  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.y = 1
  camera.layers.enable(1)

  var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)

  var orbit = new THREE.OrbitControls(camera, renderer.domElement)
  orbit.enableZoom = true
  orbit.autoRotate = true

  var bounce = false

  var group = []

  function init() {
    renderer.preserveDrawingBuffer = true
    renderer.autoClearColor = false
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor( 0xffffff, 0)
    //renderer.vr.enabled = true
    container.appendChild(renderer.domElement)

    scene.add(camera)
    scene.add(light)

    var material = new THREE.MeshPhongMaterial({
      color: '#00e1d9'
    })

    material.transparent = true
    material.opacity = opacity

    var currX = 1.0
    var currY = 1.0

    var radius = 1.0

    for (var x = 0.0; x <= 1.0; x += 0.2) {
      for (var y = 0.0; y <= 1.0; y += 0.2) {
        for (var z = 0.0; z <= 1.0; z += 0.2) {
          for (var w = 0.0; w <= 1.0; w += 0.2) {
            var geometry = new THREE.SphereGeometry(0.1, 5)
            geometry.scale(-1, 1, 1);
            /*
            var uvs = geometry.faceVertexUvs[0];
            for(var i = 0; i < uvs.length; i ++) {
              for(var j = 0; j < 3; j ++) {
                uvs[i][j].x *= 0.5;
              }
            }
            */
            var square = new THREE.Mesh(geometry, material)

            square.position.x = y * y + z * z + w * w - radius * radius
            square.position.y = x * x + z * z + w * w - radius * radius
            square.position.z = y * y + x * x + w * w - radius * radius
            square.position.w = y * y + x * x + z * z - radius * radius
            square.rotation.y += 1
            scene.add(square)

            group.push({
              square: square,
              material: material
            })
          }
        }
      }
    }
  }

  var count = 0

  function render() {
    count++

    if (count % 500 === 0) {
      bounce = !bounce
    }

    group.map(function (sq) {
      sq.square.rotation.z += 0.04
      sq.square.rotation.y += 0.014

      if (bounce) {
        sq.material.color.set('rgb(120, 170, 220)')
      } else {
        sq.material.color.set('rgb(255, 255, 250)')
      }
    })

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
