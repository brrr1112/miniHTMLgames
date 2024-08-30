const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player settings
const player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 30,
    speedY: 0,
    gravity: 0.5,
    lift: -10,
    moveSpeed: 4
};

// Obstacles (Enemies)
const obstacles = [];
const obstacleWidth = 60;
const obstacleHeight = 200;
const obstacleSpeed = 2;
const obstacleFrequency = 0.02; // Chance of a new obstacle appearing

// Background
const backgroundSpeed = 1;
let backgroundOffset = 0;

let isGameOver = false;

// Draw the player
function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw obstacles
function drawObstacles() {
    ctx.fillStyle = 'green';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });
}

// Draw the scrolling background
function drawBackground() {
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#A9A9A9'; // Ground color
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50); // Ground

    // Scrolling background effect
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(backgroundOffset, 0, canvas.width, canvas.height);
    ctx.fillRect(backgroundOffset - canvas.width, 0, canvas.width, canvas.height);
}

// Update obstacles
function updateObstacles() {
    if (Math.random() < obstacleFrequency) {
        const obstacleY = Math.random() * (canvas.height - obstacleHeight - 50);
        obstacles.push({ x: canvas.width, y: obstacleY });
    }
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacleWidth > 0);
}

// Check for collisions
function detectCollisions() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacleWidth &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacleHeight &&
            player.y + player.height > obstacle.y
        ) {
            isGameOver = true;
        }
    });
}

// Update player position
function updatePlayer() {
    player.speedY += player.gravity;
    player.y += player.speedY;

    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height - 50) player.y = canvas.height - player.height - 50;
}

// Handle input (jetpack and movement)
function handleInput(event) {
    if (event.code === 'Space') {
        player.speedY = player.lift;
    }
    if (event.code === 'ArrowUp') {
        player.y -= player.moveSpeed;
    }
    if (event.code === 'ArrowDown') {
        player.y += player.moveSpeed;
    }
}

// Main game loop
function gameLoop() {
    if (isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawPlayer();
    drawObstacles();
    updatePlayer();
    updateObstacles();
    detectCollisions();

    // Update background offset for scrolling effect
    backgroundOffset += backgroundSpeed;
    if (backgroundOffset >= canvas.width) {
        backgroundOffset = 0;
    }

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Handle user input
document.addEventListener('keydown', handleInput);
