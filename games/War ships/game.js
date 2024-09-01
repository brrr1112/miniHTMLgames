const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game settings
const shipWidth = 50;
const shipHeight = 50;
let shipX = canvas.width / 2 - shipWidth / 2;
let shipY = canvas.height - shipHeight - 10;
const shipSpeed = 5;
const lateralSpeed = 3; // Slower left and right movement speed

let bullets = [];
let enemies = [];
let enemySpeed = 2;
let enemySpawnRate = 60;
let frames = 0;
let isGameOver = false;

let lives = 3;  // Initialize with 3 lives
let score = 0;  // Initialize score

// Control settings
const controls = {
    up: ['ArrowUp', 'W'],
    down: ['ArrowDown', 'S'],
    left: ['ArrowLeft', 'A'],
    right: ['ArrowRight', 'D'],
    shoot: [' ']
};

let keys = {};

// Keypress events
document.addEventListener('keydown', function (e) {
    keys[e.key] = true;
});

document.addEventListener('keyup', function (e) {
    keys[e.key] = false;
});

// Touch events
canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchControls.x = touch.clientX;
    touchControls.y = touch.clientY;
});

canvas.addEventListener('touchend', function (e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    if (touchControls.x && touchControls.y) {
        const dx = touch.clientX - touchControls.x;
        const dy = touch.clientY - touchControls.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 0) {
                keys['ArrowRight'] = true;
                setTimeout(() => keys['ArrowRight'] = false, 200);
            } else {
                keys['ArrowLeft'] = true;
                setTimeout(() => keys['ArrowLeft'] = false, 200);
            }
        } else {
            // Vertical swipe
            if (dy > 0) {
                keys['ArrowDown'] = true;
                setTimeout(() => keys['ArrowDown'] = false, 200);
            } else {
                keys['ArrowUp'] = true;
                setTimeout(() => keys['ArrowUp'] = false, 200);
            }
        }
    }
});

// Game loop
function gameLoop() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawShip();
        moveShip();
        handleBullets();
        handleEnemies();
        checkCollisions();
        displayHUD();  // Display lives and score
    } else {
        showGameOver();
    }
    requestAnimationFrame(gameLoop);
}

function drawBackground() {
    ctx.fillStyle = 'black';  // Set background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawShip() {
    ctx.fillStyle = 'white';
    ctx.fillRect(shipX, shipY, shipWidth, shipHeight);
}

function moveShip() {
    // Handle ship movement with correct speed and key mappings
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        shipX -= lateralSpeed;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        shipX += lateralSpeed;
    }
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        shipY -= shipSpeed;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        shipY += shipSpeed;
    }
    if (keys[' '] || keys['Space']) {
        shootBullet();
    }
}

function shootBullet() {
    bullets.push({
        x: shipX + shipWidth / 2 - 2.5,
        y: shipY,
        width: 5,
        height: 10
    });
}

function handleBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 10;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
        drawBullet(bullet);
    });
}

function drawBullet(bullet) {
    ctx.fillStyle = 'red';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

function handleEnemies() {
    if (frames % enemySpawnRate === 0) {
        enemies.push({
            x: Math.random() * (canvas.width - shipWidth),
            y: 0,
            width: shipWidth,
            height: shipHeight
        });
    }

    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
        drawEnemy(enemy);
    });

    frames++;
}

function drawEnemy(enemy) {
    ctx.fillStyle = 'green';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function checkCollisions() {
    enemies.forEach((enemy, enemyIndex) => {
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;  // Increase score by 10 points for each enemy destroyed
            }
        });

        if (
            shipX < enemy.x + enemy.width &&
            shipX + shipWidth > enemy.x &&
            shipY < enemy.y + enemy.height &&
            shipY + shipHeight > enemy.y
        ) {
            // Lose a life if an enemy collides with the ship
            lives--;
            enemies.splice(enemyIndex, 1);
            if (lives <= 0) {
                isGameOver = true;  // Game over if no lives are left
            }
        }
    });
}

function displayHUD() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Lives: ' + lives, 10, 30);
    ctx.fillText('Score: ' + score, 10, 60);
}

function showGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = '36px Arial';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2);

    ctx.font = '24px Arial';
    ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 50);

    // Restart Game on Click
    canvas.addEventListener('click', restartGame, { once: true });
}

function restartGame() {
    // Reset game variables
    shipX = canvas.width / 2 - shipWidth / 2;
    shipY = canvas.height - shipHeight - 10;
    bullets = [];
    enemies = [];
    frames = 0;
    enemySpeed = 2; // Reset the enemy speed
    lives = 3;  // Reset lives
    score = 0;  // Reset score
    isGameOver = false;
    gameLoop();  // Restart the game loop
}

gameLoop();
