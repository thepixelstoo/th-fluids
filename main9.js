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

  var x = 0
  var y = 0
  var magnificationFactor = 200
  var panX = 2
  var panY = 1.5
  var maxIterations = 10

  function plot () {
    //console.log('>> ', realComp * lateral)

    //console.log(currX, currY)

  }

  function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  var width = window.innerWidth
  var height = window.innerHeight

  function draw() {
    x++

    if (x > width) {
      x = 0
      y++
    }

    if (y < height) {
      var realComponentOfResult = x / magnificationFactor - panX
      var imaginaryComponentOfResult = y / magnificationFactor - panY

      for(var i = 0; i < maxIterations; i++) {
        var tempRealComponent = realComponentOfResult * realComponentOfResult - imaginaryComponentOfResult * imaginaryComponentOfResult + x
        var tempImaginaryComponent = 2.0 * realComponentOfResult * imaginaryComponentOfResult + y

        realComponentOfResult = tempRealComponent
        imaginaryComponentOfResult = tempImaginaryComponent

        if (realComponentOfResult * imaginaryComponentOfResult > 5) {
          var currPercentage = (i / maxIterations * 100) || 0

          if (currPercentage == 0) {
            ctx.fillStyle = '#111'
          } else {

            ctx.fillStyle = 'rgb(200, ' + currPercentage + ', ' + (currPercentage * 2) + ')'
          }
        }
        ctx.fillRect(x, y, 1, 1)
      }
    }

    window.requestAnimationFrame(draw)
  }

  window.onresize = function () {
    //reset();
  };

  draw()
})()