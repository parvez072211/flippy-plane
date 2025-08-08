const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let plane = {
  x: 80,
  y: 300,
  width: 40,
  height: 30,
  velocity: 0,
  gravity: 0.5,
  lift: -10,
};

let obstacles = [];
let frame = 0;
let score = 0;
let speed = 2;
let gameOver = false;

// কাটার সাইজ নির্ধারণ
const cutTopHeight = 50;
const cutBottomHeight = 100;

function drawPlane() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(plane.x, plane.y);
  ctx.lineTo(plane.x - 10, plane.y + 15);
  ctx.lineTo(plane.x - 10, plane.y - 15);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(plane.x, plane.y - 10, 30, 20);
}

function drawObstacle(ob) {
  ctx.fillStyle = "green";
  // উপরের ছোট কাটার অংশ
  ctx.fillRect(ob.x, 0, ob.width, cutTopHeight);
  // নিচের বড় কাটার অংশ
  ctx.fillRect(ob.x, canvas.height - cutBottomHeight, ob.width, cutBottomHeight);
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // প্লেন আপডেট
  plane.velocity += plane.gravity;
  plane.y += plane.velocity;

  if (frame % 90 === 0) {
    obstacles.push({
      x: canvas.width,
      width: 40,
      passed: false,
    });
  }

  obstacles.forEach((ob) => {
    ob.x -= speed;
    drawObstacle(ob);

    // প্লেনের সাথে কাটার ধাক্কা চেক
    if (
      plane.x + plane.width > ob.x &&
      plane.x < ob.x + ob.width &&
      (plane.y - plane.height / 2 < cutTopHeight || plane.y + plane.height / 2 > canvas.height - cutBottomHeight)
    ) {
      gameOver = true;
      alert("গেম শেষ! তোমার স্কোর: " + score);
    }

    // স্কোর আপডেট
    if (!ob.passed && ob.x + ob.width < plane.x) {
      score++;
      ob.passed = true;
      document.getElementById("scoreBoard").innerText = "স্কোর: " + score;
    }
  });

  // প্লেন যদি স্ক্রিনের বাইরে যায়
  if (plane.y + plane.height / 2 > canvas.height || plane.y - plane.height / 2 < 0) {
    gameOver = true;
    alert("গেম শেষ! তোমার স্কোর: " + score);
  }

  drawPlane();

  frame++;
  if (frame % 300 === 0) speed += 0.3;

  requestAnimationFrame(update);
}

function fly() {
  plane.velocity = plane.lift;
}

document.addEventListener("keydown", fly);
document.addEventListener("touchstart", fly);

update();