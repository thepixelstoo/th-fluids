(function () {
  var container = document.querySelector('body')
  var count = 0
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: false
  })
  var opacity = 0.9
  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.y = 20
  camera.position.z = -1
  camera.layers.enable(1)

  var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)

  var orbit = new THREE.OrbitControls(camera, renderer.domElement)
  orbit.enableZoom = true
  //orbit.autoRotate = true

  var bounce = false

  var fib = [0, 1]
  var lateral = 0.0

  var realComp = 0.0
  var currX = 0.0
  var currY = 0.0

  var material = new THREE.MeshPhongMaterial({
    color: '#00e1d9'
  })

  var geometry = new THREE.SphereGeometry(1, 5, 10)
  //var circle = new THREE.Mesh(geometry, material)

  material.transparent = true
  material.opacity = opacity

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
  }

  function plot() {
    var sphere = new THREE.Mesh(geometry, material)
    var tempReal = realComp * realComp - lateral * lateral + currX
    var tempImag = 2 * realComp * lateral + currY
    console.log(realComp, lateral)
    realComp = tempReal
    lateral = tempImag

    if (realComp * lateral < 5) {
      console.log('got here ', currX, currY)
      //circle.position.z = realComp * lateral
      sphere.position.x = currX
      sphere.position.z = currY
      scene.add(sphere)
    }

    //console.log(currX, currY)
    if (currX > window.innerWidth) {
      currX = 0.0
      bounce = true
    } else {
      currX += 1
    }

    if (bounce) {
      currY += 1
      bounce = false
    }

    if (currY > window.innerHeight) {
      currY = 0.0
      bounce = false
    }
  }


  function render() {
    plot()

    //orbit.update()
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
