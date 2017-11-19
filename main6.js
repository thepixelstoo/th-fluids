(function () {
  var container = document.querySelector('body')
  var count = 0
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
  })
  var opacity = 0.09
  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.y = 70
  camera.layers.enable(1)

  var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)

  var orbit = new THREE.OrbitControls(camera, renderer.domElement)
  orbit.enableZoom = true
  orbit.autoRotate = true

  var bounce = false

  var G = 6.674 * Math.pow(10, 11) // ~universal gravitational constant

  var group = []

  function zoom() {
    for (var x = 0; x < group.length; x++) {
      if (group[x].circle.scale.x >= 1.5) {
        group[x].circle.scale.x = 1.0
        group[x].circle.scale.y = 1.0
        group[x].circle.scale.z = 1.0
      }

      group[x].circle.scale.x += 0.005
      group[x].circle.scale.y += 0.005
      group[x].circle.scale.z += 0.005
    }
  }

  window.onclick = window.onmouseover = function (ev) {
    zoom()
  }

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

    var material = new THREE.MeshLambertMaterial({
      color: '#00e1d9',
      reflectivity: 1.0,
      refractionRatio: 1.0,
      wireframe: true
    })

    material.transparent = true
    material.opacity = opacity

    var currX = 1.0
    var currY = 1.0

    for (var x = 0; x < 10; x++) {
      var currSize = 5 * (currX)
      var geometry = new THREE.SphereGeometry(currSize, 50, 22)
      //material.color.set('rgb(20, 101, ' + Math.floor(currSize) + ')')
      geometry.scale(-1, 1, 1);
      /*
      var uvs = geometry.faceVertexUvs[0];

      for(var i = 0; i < uvs.length; i ++) {
        for(var j = 0; j < 3; j ++) {
          uvs[i][j].x *= 0.5;
        }
      }
      */
      currX += 1.01
      currY += 1.001
      var circle = new THREE.Mesh(geometry, material)
      circle.mass = 211.1974 * currSize * Math.pow(10, 34)
      circle.position.x = currX * 2.3
      circle.position.y = currY * 1.9
      circle.position.z = currY * 1.9
      circle.radius = currSize + (currX / 3) * Math.pow(10, 11)

      group.push({
        material: material,
        circle: circle
      })

      scene.add(circle)
      console.log('added circle ', circle)
    }
  }

  function UGE(idx) {
    var i = idx - 1

    if (i < 0) {
      i = group.length - 1
    }
    //for (var i = 0; i < group.length; i++) {
      group[idx].force = (G * group[idx].circle.mass * group[i].circle.mass) / Math.pow((group[idx].circle.radius * 2) * (group[i].circle.radius * 2), 2)

      if (bounce) {
        group[idx].material.color.set('rgb(1, 1, 1)')

        //group[idx].circle.position.x -= Math.cos(group[idx].force) * 1.871
        group[idx].circle.scale.x -= Math.cos(group[idx].force) * 0.003
      } else {

        group[idx].material.color.set('rgb(10, 170, 230)')

        group[idx].circle.scale.x += Math.cos(group[idx].force) * 0.003
      }


      group[idx].circle.position.z += Math.sin(group[idx].force) * 0.001
      group[idx].circle.position.x += Math.sin(group[idx].force) * 0.271
      group[idx].circle.position.y += Math.sin(group[idx].force) * 0.171

      group[idx].circle.rotation.x += Math.sin(group[idx].force) * 0.01
      group[idx].circle.rotation.z += Math.sin(group[idx].force) * 0.01
      group[idx].circle.rotation.y += Math.sin(group[i].force) * 0.101
   // }
  }

  function render() {
    count++
    if (Math.floor(Math.random() * 10) % 12 === 0) {
      bounce = !bounce
    }

    for (var i = 0; i < group.length; i++) {
      UGE(i)
    }

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
