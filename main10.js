(function () {
  var container = document.querySelector('body')
  var count = 0
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: false
  })
  var opacity = 0.3
  var scene = new THREE.Scene()
  var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000)
  camera.position.x = 400
  camera.position.z = 100
  camera.position.y = 100
  //camera.position.x = 100
  camera.layers.enable(1)

  var light = new THREE.AmbientLight(0xffffbb)

  var orbit = new THREE.OrbitControls(camera, renderer.domElement)
  orbit.enableZoom = true
  //orbit.autoRotate = true

  var bounce = false

  var material = new THREE.MeshBasicMaterial({
    color: 'rgb(30, 150, 220)'
  })

  var geometry = new THREE.BoxGeometry(14, 14, 14)
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

  var x = 0
  var y = 0
  var z = 0
  var maxIterations = 150
  var magnificationFactor = 100
  var panX = 2.0
  var panY = 1.5
  var width = 200
  var height = 300
  var depth = 150
  var counter = 0

  function calc() {
    var realComponentOfResult = x / magnificationFactor - panX
    var imaginaryComponentOfResult = y / magnificationFactor - panY

    for(var i = 0; i < maxIterations; i++) {
      counter++
      var sphere = new THREE.Mesh(geometry, material)
      var tempRealComponent = realComponentOfResult * realComponentOfResult - imaginaryComponentOfResult * imaginaryComponentOfResult + x
      var tempImaginaryComponent = 2.0 * realComponentOfResult * imaginaryComponentOfResult + y

      realComponentOfResult = tempRealComponent
      imaginaryComponentOfResult = tempImaginaryComponent

      if (realComponentOfResult * imaginaryComponentOfResult > 5) {
        var currPercentage = (i / maxIterations * 100) || 0
        //console.log('>>>>> ', currPercentage * 2, x, y)
        if (currPercentage == 0) {
          //sphere.material.color.set('rgb(1, 1, 1)')
        } else {
          if (counter % 2 === 0) {
            //sphere.material.color.set('rgb(' + (currPercentage) + ', ' + (currPercentage * 10) + ', ' + (currPercentage * 15) + ')')
            sphere.position.setX(x * 10)
            sphere.position.setY(y * 10)
            sphere.position.setZ(z * 20)

            scene.add(sphere)
            sphere = null
            /*
            sphere = new THREE.Mesh(geometry, material)
            sphere.position.z = z * -2

            scene.add(sphere)
            */
            z++
          }
        }
      }
    }

    z = 0
  }

  function plot() {
    x++

    if (x > width) {
      x = 0
      y++
    }

    if (y < height) {
      calc()
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
