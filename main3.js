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
  var h1 = 12.400// height
  var h2 = 0.101; // height
  var g = 9.8 // m/sec
  var group = []
  var p = 0.0
  var pos = 1.001
  var idx = 0

  function zoom() {
    for (var i = 0; i < group.length; i++) {
      group[i].circle.scale.x += 0.1
      group[i].material.opacity -= 0.01

    }
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

    scene.add(camera)
    scene.add(light)

    for (var i = 0; i < 10; i++) {
      var material = new THREE.MeshLambertMaterial({
        color: '#00e1d9'
      })
      var geometry = new THREE.SphereGeometry(40, 120, 40)

      // geometry.vertices.shift()
      var circle = new THREE.Mesh(geometry, material)

      material.transparent = true
      material.opacity = 0.01

      p1 += 0.771
      p2 += 0.001

      pos += 0.101
      v1 += Math.sin(v1) * Math.random()
      v2 += Math.sin(v2) * Math.random()

      circle.position.x += p1
      circle.position.z += p2
      circle.position.y += p

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

  function bernP2 (idx) {
    group[idx].p2 = group[idx].p1 + (0.5 * group[idx].p * Math.pow(group[idx].v1, 2)) + (group[idx].p * g * h1) - (0.5 * group[idx].p * Math.pow(group[idx].v2, 2)) - (group[idx].p * g * h2)

    if (bounce) {
      group[idx].material.opacity -= 0.01
      group[idx].p1 -= 0.2011
      group[idx].p2 -= 0.3008
      group[idx].p  -= 0.901
      group[idx].circle.rotation.z += Math.cos(group[idx].p2) * group[idx].p2
      group[idx].circle.rotation.y += Math.cos(group[idx].p2) * group[idx].pos
      group[idx].circle.position.y += Math.cos(group[idx].p2) * group[idx].p1
      group[idx].circle.position.z += Math.cos(group[idx].p2) * group[idx].p
      group[idx].material.color.set('#e1006f')

    } else {
      group[idx].material.opacity += 0.01
      group[idx].p1 += 0.2011
      group[idx].p2 += 0.3008
      group[idx].p += 0.901
      group[idx].circle.rotation.z += Math.sin(group[idx].p2) * group[idx].p2
      group[idx].circle.rotation.y += Math.sin(group[idx].p2) * group[idx].pos
      group[idx].circle.position.y += Math.sin(group[idx].p2) * group[idx].p1
      group[idx].circle.position.z += Math.sin(group[idx].p2) * group[idx].p
      group[idx].material.color.set('#00f1d9')
    }

    if (group[idx].p <= 0.0 || group[idx].p > window.innerWidth) {
      group[idx].p = Math.sin(145) * group[idx].p
    }
  }

  function render() {
    count++
    if (count % 500 === 0) {
      bounce = !bounce
    }

    bernP2(idx)

    idx++

    if (idx >= group.length) {
      idx = 0
    }

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
