var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;

var ballRadius = 10;
var ballColor = "#0095DD";

var xPos = [-2,2];
// var dx = -2;
var dy = -2;
var dx = xPos[Math.floor(Math.random() * xPos.length)];

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleColor = "green"

var rightPressed = false;
var leftPressed = false;

var paddleSpeed = 6;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var hitBricks = 0;

var lives = 3;

var autoplayerstate = true;


var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status: 1 };
    }
}

function keyDownHandler(e) {
  if(e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = true;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = false;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function touchHandler(e) {
  var touchX = e.clientX;
  if (touchX > window.innerWidth/2) {
    rightPressed = true;
  } else {
    leftPressed = true;
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x  &&
            x < b.x + brickWidth  &&
            y > b.y  &&
            y < b.y + brickHeight ) {
          dy = -dy;
          b.status = 0;
          hitBricks ++;
          score += Math.floor(Math.random() * 3 + 1);
          if (ballColor === "#0095DD") {
            ballColor = "yellow";
          } else if (ballColor === "yellow") {
            ballColor = "lime";
          } else if (ballColor === "lime") {
            ballColor = "purple";
          } else if (ballColor === "purple") {
            ballColor = "#0095DD";
          }
        }
      }
    }
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousedown", mouseMoveHandler, false);
document.addEventListener("touchstart", touchHandler, false);


function autoplayer() {
  if (autoplayerstate === true) {
    autoplayerstate = false;
  } else {
    autoplayerstate = true;
  }
  console.log(autoplayerstate);
}

function drawBricks() {
  for (var c=0; c < brickColumnCount; c++) {
    for (var r=0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX,canvas.height-paddleHeight, paddleWidth, paddleHeight);
  // console.log(autoplayerstate)
  if (autoplayerstate === true) {
    if (paddleColor === "green") {
      paddleColor = "yellow";
    } else if (paddleColor === "yellow") {
      paddleColor = "lime";
    } else if (paddleColor === "lime") {
      paddleColor = "purple";
    } else if (paddleColor === "purple") {
      paddleColor = "green";
    }
  } else {
    paddleColor = "green";
  }
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives,canvas.width-65, 20);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawBricks();
  drawScore();
  drawLives();
  collisionDetection();


  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;

  }
  if (y + dy < ballRadius) {
    dy = -dy;

  }
  if (x > paddleX && x < paddleX + paddleWidth) {
    if (y + dy > canvas.height - paddleHeight - ballRadius/2) {
      dx += 0.05;
      dy += 0.05;
      paddleSpeed += 0.05;
      dy = -dy;
    }
  } else if (y + dy > canvas.height + ballRadius) {
    lives --;
    if (!lives) {
      document.location.reload();
    } else {
      x = canvas.width/2;
      y = canvas.height - 30;
      dx = 2;
      dy = -2;
      paddleX = (canvas.width-paddleWidth)/2;
    }
  }

  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }

  if (hitBricks == brickRowCount*brickColumnCount) {
    alert(["You win with", score, "points"].join(" "));
    document.location.reload();
  }

  x += dx;
  y += dy;

  if (autoplayerstate) {
    paddleX = x - paddleWidth/2;
  }

  requestAnimationFrame(draw);
}






draw();
