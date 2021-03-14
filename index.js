document.addEventListener("DOMContentLoaded", () => {
  var bird = document.querySelector(".bird");
  var gameDisplay = document.querySelector(".game-container");
  var ground = document.querySelector(".ground-moving");

  var birdLeft = 220;
  var birdBottom = 250;
  var gravity = 4;
  var isGameOver = false;
  var gap = 480;
  var score = 0;

  var sounds = {
    die: "sfx_hit.mp3",
    jump: "sfx_wing.mp3",
    score: "sfx_point.mp3",
  };

  function startGame() {
    birdBottom -= gravity;
    bird.style.bottom = birdBottom + "px";
    bird.style.left = birdLeft + "px";
  }
  var gameTimerId = setInterval(startGame, 20);

  document.onkeydown = function (e) {
    if (e.keyCode == 32) {
      jump();
    }
  };

  function jump() {
    if (birdBottom < 500 && !isGameOver) {
      playSound(sounds.jump);
      birdBottom += 55;
    }
    bird.style.bottom = birdBottom + "px";
  }

  function generateObstacle() {
    var obstacleLeft = 500;
    var randomHeight = Math.random() * 80;
    var obstacleBottom = randomHeight;
    var obstacle = document.createElement("div");
    var topObstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    topObstacle.classList.add("topObstacle");

    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(topObstacle);
    obstacle.style.left = obstacleLeft + "px";
    topObstacle.style.left = obstacleLeft + "px";
    obstacle.style.bottom = obstacleBottom + "px";
    topObstacle.style.bottom = obstacleBottom + gap + "px";

    function moveObstacle() {
      if (!isGameOver) {
        obstacleLeft -= 2;
        obstacle.style.left = obstacleLeft + "px";
        topObstacle.style.left = obstacleLeft + "px";
      }

      if (obstacleLeft == -60) {
        clearInterval(timerId);
        gameDisplay.removeChild(obstacle);
        gameDisplay.removeChild(topObstacle);
      }
      if (
        (obstacleLeft > 200 &&
          obstacleLeft < 280 &&
          birdLeft == 220 &&
          (birdBottom < obstacleBottom + 150 ||
            birdBottom > obstacleBottom + gap - 200)) ||
        (birdBottom <= 0 && !isGameOver)
      ) {
        gameOver();
        clearInterval(timerId);
        isGameOver = true;
        console.log("GAME OVER");
        playSound(sounds.die);
      } else if (
        birdLeft > obstacleLeft &&
        birdLeft < obstacleLeft + 60 &&
        birdBottom > obstacleBottom &&
        !isGameOver
      ) {
        playSound(sounds.score);
        score += 1;
        document.getElementById("score").innerHTML = score;
        console.log(score);
        obstacleLeft = 500;
        if (score == 10) {
          gap -= 10;
        } else if (score == 20) {
          gap -= 20;
        }
      }
    }
    if (!isGameOver) {
      timerId = setInterval(moveObstacle, 10);
    } else {
      clearTimeout(set);
      clearInterval(timerId);
    }
  }
  if (!isGameOver) {
    set = setTimeout(generateObstacle, 3000);
  } else {
    clearTimeout(set);
  }

  function gameOver() {
    clearInterval(gameTimerId);
    isGameOver = true;
    ground.classList.add("ground");
    ground.classList.remove("ground-moving");
  }
});

function playSound(path) {
  var audio = new Audio(path);
  audio.play();
}
