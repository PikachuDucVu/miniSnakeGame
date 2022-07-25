const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");
const drawApple = canvas.getContext("2d");
let textGameOver = canvas.getContext("2d");
let point = canvas.getContext("2d");

const snake = [
  [5, 3],
  [4, 3],
  [3, 3],
  [2, 3],
];
let apple = [getRandomInt(0, 60), getRandomInt(0, 40)];

function drawSnake() {
  ctx.fillStyle = "white";
  for (let node of snake) {
    ctx.fillRect(node[0] * 10 + 1, node[1] * 10 + 1, 8, 8);
  }
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function food() {
  drawApple.fillStyle = "red";
  drawApple.fillRect(apple[0] * 10, apple[1] * 10, 10, 10);
  if (
    (snake[0][0] === parseInt(apple[0]) ||
      snake[0][1] === parseInt(apple[0])) &&
    (snake[0][0] === parseInt(apple[1]) || snake[0][1] === parseInt(apple[1]))
  ) {
    score++;
    snake.push(apple);
    apple = [getRandomInt(0, 60), getRandomInt(0, 40)];
  }
}

const STEP = 0.2;
let accumulate = 0;
let running = true;
let direction = "right";
let directionChange = false;

let score = 0;

function checkGameOver(snake) {
  const [headX, headY] = snake[0];

  for (let i = 1; i < snake.length; i++) {
    const [nodeX, nodeY] = snake[i];

    if (direction === "right") {
      if (headX + 1 === nodeX && headY === nodeY) {
        running = false;
      }
    } else if (direction === "left") {
      if (headX - 1 === nodeX && headY === nodeY) {
        running = false;
      }
    } else if (direction === "up") {
      if (headX === nodeX && headY - 1 === nodeY) {
        running = false;
      }
    } else if (direction === "down") {
      if (headX === nodeX && headY + 1 === nodeY) {
        running = false;
      }
    }
  }
}

function control(e) {
  if (directionChange) {
    return;
  }
  switch (e.keyCode) {
    case 39: // right
      if (direction !== "left" && direction !== "right") {
        direction = "right";
        directionChange = true;
      }
      break;
    case 38: // up
      if (direction !== "down" && direction !== "up") {
        direction = "up";
        directionChange = true;
      }
      break;
    case 37: // left
      if (direction !== "right" && direction !== "left") {
        direction = "left";
        directionChange = true;
      }
      break;
    case 40: // down
      if (direction !== "up" && direction !== "down") {
        direction = "down";
        directionChange = true;
      }
    default:
      break;
  }
  checkGameOver(snake);
}

function respawnSnake() {
  if (snake[0][0] === 61) {
    snake[0][0] = 0;
  }
  if (snake[0][0] === -1) {
    snake[0][0] = 61;
  }
  // Horizontal

  if (snake[0][1] === 0) {
    snake[0][1] = 40;
  }
  if (snake[0][1] === 41) {
    snake[0][1] = 1;
  }
}

function processGameState(delta) {
  snake.pop();

  if (direction === "right") {
    snake.unshift([snake[0][0] + 1, snake[0][1]]);
  } else if (direction === "left") {
    snake.unshift([snake[0][0] - 1, snake[0][1]]);
  } else if (direction === "up") {
    snake.unshift([snake[0][0], snake[0][1] - 1]);
  } else if (direction === "down") {
    snake.unshift([snake[0][0], snake[0][1] + 1]);
  }
  respawnSnake();
  if (directionChange) {
    directionChange = false;
  }
}

document.addEventListener("keydown", function (e) {
  control(e);
});

function update(delta) {
  accumulate += delta;
  if (!running) {
    textGameOver.fillStyle = "green";
    textGameOver.font = "60px times new roman";
    textGameOver.fillText("YOU LOSE", 150, 200);
    point.fillStyle = "lightblue";
    point.font = "40px times new roman";
    point.fillText("Score: " + score, 230, 300);
    point.fillText("Press Space to try again", 120, 350);

    window.addEventListener("keydown", function (e) {
      if (e.key === " ") {
        document.location.reload();
      }
    });
    return;
  }
  while (accumulate >= STEP) {
    accumulate -= STEP;
    processGameState(STEP);
  }

  ctx.clearRect(0, 0, 600, 400);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 600, 400);

  drawSnake();
  food();
}

let lastUpdate = Date.now();

(function loop() {
  const delta = (Date.now() - lastUpdate) / 1000;
  lastUpdate = Date.now();
  update(delta);
  requestAnimationFrame(loop);
})();
