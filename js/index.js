const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

const paddleWidth = 10;
let paddleHeightLeft = canvas.height * 0.2;
let paddleHeightRight = canvas.height * 0.2;
const paddleShrinkAmount = paddleHeightLeft / 10; 
const ballSize = 10;
const numBoxes = 10;
let boxHeightLeft = paddleHeightLeft / numBoxes;
let boxHeightRight = paddleHeightRight / numBoxes;

let leftPaddle = { x: 10, y: (canvas.height - paddleHeightLeft) / 2, speed: 5 };
let rightPaddle = { x: canvas.width - paddleWidth - 10, y: (canvas.height - paddleHeightRight) / 2, speed: 5 };

let ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 5, vy: 3 };
let score = { left: 0, right: 0 };

let keys = {};

window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function update() {
    if (keys['w'] && leftPaddle.y > 0) leftPaddle.y -= leftPaddle.speed;
    if (keys['s'] && leftPaddle.y < canvas.height - paddleHeightLeft) leftPaddle.y += leftPaddle.speed;
    if (keys['ArrowUp'] && rightPaddle.y > 0) rightPaddle.y -= rightPaddle.speed;
    if (keys['ArrowDown'] && rightPaddle.y < canvas.height - paddleHeightRight) rightPaddle.y += rightPaddle.speed;

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y <= 0 || ball.y >= canvas.height - ballSize) ball.vy *= -1;

    if (ball.x <= leftPaddle.x + paddleWidth && ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + paddleHeightLeft) {
        ball.vx *= -1;
    }
    if (ball.x >= rightPaddle.x - ballSize && ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + paddleHeightRight) {
        ball.vx *= -1;
    }

    if (ball.x <= 0) { score.right++; shrinkPaddle("left"); resetGame(); }
    if (ball.x >= canvas.width) { score.left++; shrinkPaddle("right"); resetGame(); }
}

function shrinkPaddle(player) {
    if (player === "left") {
        const centerY = leftPaddle.y + paddleHeightLeft / 2;
        paddleHeightLeft -= paddleShrinkAmount;
        leftPaddle.y = centerY - paddleHeightLeft / 2;
    } else {
        const centerY = rightPaddle.y + paddleHeightRight / 2;
        paddleHeightRight -= paddleShrinkAmount;
        rightPaddle.y = centerY - paddleHeightRight / 2;
    }

    if (paddleHeightLeft <= 0 || paddleHeightRight <= 0) {
        alert((paddleHeightLeft <= 0 ? "Player 2" : "Player 1") + " wins!");
        document.location.reload();
    }
}

function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = Math.random() < 0.5 ? 5 : -5;
    ball.vy = Math.random() * 6 - 3;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw left paddle as boxes
    const leftBoxesRemaining = Math.ceil(paddleHeightLeft / paddleShrinkAmount);
    boxHeightLeft = paddleHeightLeft / leftBoxesRemaining;
    ctx.fillStyle = "white";
    for (let i = 0; i < leftBoxesRemaining; i++) {
        ctx.fillRect(leftPaddle.x, leftPaddle.y + i * boxHeightLeft, paddleWidth, boxHeightLeft - 1);
    }
    
    // Draw right paddle as boxes
    const rightBoxesRemaining = Math.ceil(paddleHeightRight / paddleShrinkAmount);
    boxHeightRight = paddleHeightRight / rightBoxesRemaining;
    for (let i = 0; i < rightBoxesRemaining; i++) {
        ctx.fillRect(rightPaddle.x, rightPaddle.y + i * boxHeightRight, paddleWidth, boxHeightRight - 1);
    }
    
    // Draw ball
    ctx.fillRect(ball.x, ball.y, ballSize, ballSize);
    
    // Draw score
    ctx.font = "20px Arial";
    ctx.fillText(score.left, canvas.width / 4, 30);
    ctx.fillText(score.right, (canvas.width / 4) * 3, 30);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();