(function () {
  var container = document.querySelector('body')
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
  })
  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 300)
  camera.position.z = 130
  var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
  var orbit = new THREE.OrbitControls(camera, renderer.domElement)
  orbit.enableZoom = true
  var bounce = false

  var p2 = 0.405; // pressure
  var p1 = 0.0001; // pressure
  var v2 = 0.1010; // speed
  var v1 = 0.101; // speed
  var h1 = 0.400// height
  var h2 = 0.101; // height
  var g = 11.8 // m/sec
  var group = []
  var p = 0.0
  var pos = 1.001

  function zoom() {
    //circle.scale.x += 0.01
  }

  window.onclick = function (ev) {
    zoom()
  }

  function init() {
    renderer.autoClearColor = false
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    container.appendChild(renderer.domElement)

    scene.background = new THREE.Color('#222')
    scene.add(camera)
    scene.add(light)

    for (var i = 0; i < 20; i++) {
      var material = new THREE.MeshBasicMaterial({ color: '#00e1d9' })
      var geometry = new THREE.SphereGeometry( 5, 32, 32 )
      //geometry.vertices.shift()
      var circle = new THREE.Mesh(geometry, material)

      material.transparent = true
      material.opacity = 0.01

      p1 += 0.771
      p2 += 0.001

      pos += 1
      v1 += Math.sin(v1) * Math.random()
      v2 += Math.sin(v2) * Math.random()

      group.push({
        p1: p1,
        p2: p2,
        p: p,
        pos: pos,
        v1: v1,
        v2: v2,
        material: material,
        circle: circle
      })

      scene.add(circle)
    }
  }

  var count = 0
  var switched = false

  function bernP2 (idx) {
    group[idx].p2 = group[idx].p1 + (0.5 * group[idx].p * Math.pow(group[idx].v1, 2)) + (group[idx].p * g * h1) - (0.5 * group[idx].p * Math.pow(group[idx].v2, 2)) - (group[idx].p * g * h2)

    console.log('---------> ', (0.5 * 1 * 1) - (group[idx].p * g * h2))
    count++
    if (count % 100 === 0) {
      bounce = !bounce
    }

    if (bounce) {
      console.log('bounced')
      //renderer.clear()
      group[idx].p1 -= 0.2011
      group[idx].p2 += 0.3008
      group[idx].p  -= 1.901
      group[idx].material.opacity -= 0.01
      group[idx].material.color.setHex('#e1006f')
      group[idx].circle.rotation.z -= 1
      group[idx].circle.position.x += group[idx].p2
    } else {
      group[idx].p1 += 0.2011
      group[idx].p2 -= 0.3008
      group[idx].p += 1.901
      group[idx].material.opacity += 0.1
      group[idx].material.color.setHex('#00e1d9')
      group[idx].circle.rotation.z += 1
      group[idx].circle.position.y -= group[idx].p1
      group[idx].circle.rotation.x -= group[idx].p2
    }

    if (group[idx].p <= 0.0 || group[idx].p > window.innerWidth) {
      group[idx].p = Math.sin(45) * group[idx].p
    }
  }

  function render() {
    renderer.render(scene, camera)

    for (var i = 0; i < 2; i++) {
      bernP2(i)
    }

    setTimeout(function () {
      window.requestAnimationFrame(render)
    }, 10)
  }

  init()
  render()

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
  }
})()