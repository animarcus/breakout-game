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
var paddleColor = "green";
var relativeX = 0;

var rightPressed = false;
var leftPressed = false;
var mouseDown = false;

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

var autoplayerstate = false;

var extras = {
  generateBricks : function() {
    bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(var r=0; r<brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0 , status: 1 };
      }
    }
  },
  autoplayer : function() {
    if (autoplayerstate === true) {
      autoplayerstate = false;
    } else {
      autoplayerstate = true;
    }
    console.log(autoplayerstate);
  }
}



var handlers = {
  keyDownHandler : function (e) {
    if(e.key == 'Right' || e.key == 'ArrowRight') {
      rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
      leftPressed = true;
    }
  },
  keyUpHandler : function(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
      rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
      leftPressed = false;
    }
  },
  mouseDownHandler : function(e) {
    mouseDown = true;
    let elementClicked = e.target;
    if (elementClicked.id === "rightBtn") {
      rightPressed = true;
    } else if (elementClicked.id === "leftBtn") {
      leftPressed = true;
    }
  },
  mouseUpHandler : function(e) {
    mouseDown = false;
    let elementClicked = e.target;
    if (elementClicked.id === "rightBtn") {
      rightPressed = false;
    } else if (elementClicked.id === "leftBtn") {
      leftPressed = false;
    }
  },
  findMouseCoords : function(e) {
    if (mouseDown) {
      relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
      }
    }
  },
  touchStart : function(e) {
    mouseDown = true;
    let elementClicked = e.target;
    if (elementClicked.id === "rightBtn") {
      rightPressed = true;
    } else if (elementClicked.id === "leftBtn") {
      leftPressed = true;
    }
  },
  touchEnd : function(e) {
    mouseDown = false;
    let elementClicked = e.target;
    if (elementClicked.id === "rightBtn") {
      rightPressed = false;
    } else if (elementClicked.id === "leftBtn") {
      leftPressed = false;
    }
  }
};


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
  document.addEventListener("touchstart", handlers.touchStart, false);
  document.addEventListener("touchend", handlers.touchEnd, false);
}

document.addEventListener("keydown", handlers.keyDownHandler, false);
document.addEventListener("keyup", handlers.keyUpHandler, false);
document.addEventListener("mousedown", handlers.mouseDownHandler, false);
document.addEventListener("mouseup", handlers.mouseUpHandler, false);
document.getElementById("myCanvas").onmousemove = handlers.findMouseCoords;





var view = {
  draw : function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    view.drawBall();
    view.drawPaddle();
    view.drawBricks();
    view.drawScore();
    view.drawLives();
    view.collisionDetection();

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
      if (y > canvas.height-paddleHeight-ballRadius) {
        console.log(x);
        paddleX = x - paddleWidth/2;
      } else {
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
    // paddleX = canvas.width/2 - paddleX;
    requestAnimationFrame(view.draw);
  },
  drawBricks : function() {
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
  },
  drawBall : function() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
  },
  drawPaddle : function() {
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
  },
  drawScore : function() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
  },
  drawLives : function() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives,canvas.width-65, 20);
  },
  collisionDetection : function() {
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
};





extras.generateBricks();
view.draw();
