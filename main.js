(function () {
  var canvas = document.querySelector('canvas')
  // var gravInput = document.querySelector('#gravity')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  var ctx = canvas.getContext('2d')
  var status = document.querySelector('#status')

  var p2 = 0.105; // pressure
  var p1 = 0.0001; // pressure
  var v2 = 0.1010; // speed
  var v1 = 0.101; // speed
  var h1; // height
  var h2; // height
  var g = 1.8 // m/sec
  var opacity = 5.98
  var bounce = false
  var group = []
  var p = 0.0
  var pos = 1.001
  var count = 0
  var circleSize = canvas.height / 2
  var currColor = 'rgba(20, 200, 210, 0.005)'

  function zoom() {
    //reset()
    circleSize += 5
  }

  window.onclick = function (ev) {
    zoom()
  }

  function init() {
    for (var i = 0; i < 20; i++) {
      p1 += 12.771
      p2 += 10.001

      pos += 1
      v1 += Math.sin(v1) * Math.random()
      v2 += Math.sin(v2) * Math.random()

      group.push({
        p1: p1,
        p2: p2,
        p: p,
        pos: pos,
        v1: v1,
        v2: v2
      })
    }
  }

  function bernP2 (idx) {
    group[idx].p2 = group[idx].p1 + (0.5 * group[idx].p * Math.pow(group[idx].v1, 2)) + (group[idx].p * g * h1) - (0.5 * group[idx].p * Math.pow(group[idx].v2, 2)) - (group[idx].p * g * h2)

    if (bounce) {
      group[idx].p1 -= 0.5011
      group[idx].p2 += 0.6008
      group[idx].p  -= 0.901
      opacity += 0.101
    } else {
      group[idx].p1 += 0.5011
      group[idx].p2 -= 0.6008
      group[idx].p += 0.901
      opacity -= 0.001
    }

    if (opacity >= 0.599) {
      opacity = 0.599
    } else if (opacity < 0.001) {
      opacity = 0.001
    }

    if (group[idx].p <= 0.0 || (group[idx].p + 250) > canvas.width) {
      bounce = !bounce

      group[idx].p = Math.sin(45) * group[idx].p

      if (bounce) {
        currColor = 'rgba(230, 20, 60, 0.008)'
      } else {
        currColor = 'rgba(20, 200, 210, 0.011)'
      }
    }

    ctx.beginPath();

    ctx.strokeStyle = currColor;
    status.textContent = Math.floor(group[idx].p * 3)

    ctx.arc(group[idx].p1, Math.cos(group[idx].p2) * 0.405 + canvas.height / 2, circleSize, 0, 2 * Math.PI);
    ctx.lineWidth = 2

    ctx.stroke();
    ctx.closePath();
  }

  h1 = 0.4012 // m
  h2 = 0.0155 // m

  function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function draw() {
    group.map(function (_, i) {
      bernP2(i)
    })

    window.requestAnimationFrame(draw)
  }

  window.onresize = function () {
    reset();
  };

  init()
  draw()
})()
