const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
/* Ball attributes */
const ballRadius = canvas.height * 0.025
let ballX = canvas.width / 2    //ball initial x
let ballY = canvas.height - 40  //ball initial y
let dx = canvas.width * 0.0035  //ball x speed
let dy = -canvas.width * 0.0035  //ball y speed
/* Paddle attributes */
const paddleHeight = canvas.height * 0.04
const paddleWidth = canvas.width * 0.15
let paddleX = (canvas.width - paddleWidth) / 2  //center paddle horizontally
let rightMovement = false
let leftMovement = false
/* Brick attributes */
const brickColumns = 5
const brickRows = 3
const brickWidth = canvas.width * 0.15
const brickHeight = canvas.height * 0.06
const brickPadding = canvas.width * 0.02
const brickMarginTop = canvas.height * 0.06
const brickMarginLeft = canvas.width * 0.09
const bricks = []

for (let c = 0; c < brickColumns; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRows; r++) {
        bricks[c][r] = { x: 0,
                        y: 0,
                        status: 1 };
    }
}

let score = 0
let tries = 5

document.addEventListener('keydown', keyDownHandler)
document.addEventListener('keyup', keyUpHandler)
refreshCanvas()

function refreshCanvas() {
    draw()
    requestAnimationFrame(refreshCanvas)
}

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') {
        rightMovement = true
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') {
        leftMovement = true
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') {
        rightMovement = false
    } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') {
        leftMovement = false
    }
}

function paddleMovement() {
    if (rightMovement) {
        paddleX += canvas.width * 0.01
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth
        }
    } else if (leftMovement) {
        paddleX -= canvas.width * 0.01
        if (paddleX < 0) {
            paddleX = 0
        }
    }
}

function ballCollision() {
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx
    }
    if (ballY + dy < ballRadius) {
        dy = -dy
    } else if (ballY + dy > canvas.height - ballRadius) {
        if (ballX > paddleX &&
            ballX < paddleX + paddleWidth) {
            dy = -dy
        } else {
            tries--;
            if (!tries) {
                alert('You lost');
                document.location.reload();
            } else {
                ballX = canvas.width / 2
                ballY = canvas.height - 30
                dx = canvas.width * 0.0035
                dy = canvas.width * 0.0035
                paddleX = (canvas.width - paddleWidth) / 2
            }
        }
    }
    for (let c = 0; c < brickColumns; c++) {
        for (let r = 0; r < brickRows; r++) {
            const b = bricks[c][r]
            if (b.status === 1) {
                if (ballX > b.x &&
                    ballX < b.x + brickWidth &&
                    ballY > b.y &&
                    ballY < b.y + brickHeight) {
                    dy = -dy
                    b.status = 0
                    score++
                    if (score === brickRows * brickColumns) {
                        alert('You won!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath()
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI)
    ctx.fillStyle = '#65a5c5'
    ctx.fill()
    ctx.closePath()
}

function drawPaddle() {
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = '#71b024'
    ctx.fill()
    ctx.closePath()
}

function drawBricks() {
    for (let c = 0; c < brickColumns; c++) {
        for (let r = 0; r < brickRows; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickMarginLeft;
                const brickY = r * (brickHeight + brickPadding) + brickMarginTop;
                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                ctx.fillStyle = '#b02924'
                ctx.fill()
                ctx.closePath()
            }
        }
    }
}

function drawScore() {
    ctx.font = '16px Helvetica'
    ctx.fillStyle = '#dae112'
    ctx.fillText(`Score: ${score}`, 8, 20)
}

function drawLives() {
    ctx.font = '16px Helvetica'
    ctx.fillStyle = '#dae112'
    ctx.fillText(`Tries: ${tries}`, canvas.width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall()
    drawPaddle()
    drawBricks()
    paddleMovement()
    ballCollision()
    drawScore()
    drawLives()
    ballX += dx
    ballY += dy
}