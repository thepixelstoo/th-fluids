(function () {
  var container = document.querySelector('body')
  var count = 0
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: false
  })
  var opacity = 0.5
  var scene = new THREE.Scene()
  var camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000)
  camera.position.x = 300
  camera.position.z = 10
  camera.position.y = 10
  //camera.position.x = 100
  camera.layers.enable(1)

  var light = new THREE.AmbientLight(0xffffbb)


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

  var orbit = new THREE.OrbitControls(camera, renderer.domElement)
  orbit.enableZoom = true
  //orbit.autoRotate = true

  var bounce = false

  var material = new THREE.MeshPhongMaterial({
    color: 'rgb(30, 150, 220)',
    shininess: 50,
    reflectivity: 1
  })

  var geometry = new THREE.BoxGeometry(20, 20, 50)
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
  var maxIterations = 250
  var magnificationFactor = 100
  var panX = 2.0
  var panY = 1.5
  var width = 100
  var height = 200
  var depth = 250
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
            sphere.position.setX(x * -20)
            sphere.position.setY(y * 20)
            sphere.position.setZ(z * 50)

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
