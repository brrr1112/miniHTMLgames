const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let player = { x: 50, y: 50, width: 20, height: 20, speed: 40 }; // Updated to match cell size
let score = 0;
let level = 1;
const mazeRows = 15;
const mazeCols = 20;
const cellSize = 40;

let exit = { x: (mazeCols - 1) * cellSize, y: (mazeRows - 1) * cellSize, width: cellSize, height: cellSize };
let maze;

// Directions for maze generation
const directions = [
    { x: 0, y: -1 },  // Up
    { x: 1, y: 0 },   // Right
    { x: 0, y: 1 },   // Down
    { x: -1, y: 0 }   // Left
];

function createMaze(rows, cols) {
    let grid = [];
    let stack = [];
    let currentCell;
    
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            grid[row][col] = { visited: false, top: true, right: true, bottom: true, left: true };
        }
    }

    currentCell = { row: 0, col: 0 };
    grid[currentCell.row][currentCell.col].visited = true;
    stack.push(currentCell);

    while (stack.length > 0) {
        const { row, col } = currentCell;
        let neighbors = [];

        directions.forEach((dir, index) => {
            const newRow = row + dir.y;
            const newCol = col + dir.x;

            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !grid[newRow][newCol].visited) {
                neighbors.push({ index, row: newRow, col: newCol });
            }
        });

        if (neighbors.length > 0) {
            const { index, row: nextRow, col: nextCol } = neighbors[Math.floor(Math.random() * neighbors.length)];
            stack.push(currentCell);

            switch (index) {
                case 0:
                    grid[row][col].top = false;
                    grid[nextRow][nextCol].bottom = false;
                    break;
                case 1:
                    grid[row][col].right = false;
                    grid[nextRow][nextCol].left = false;
                    break;
                case 2:
                    grid[row][col].bottom = false;
                    grid[nextRow][nextCol].top = false;
                    break;
                case 3:
                    grid[row][col].left = false;
                    grid[nextRow][nextCol].right = false;
                    break;
            }

            currentCell = { row: nextRow, col: nextCol };
            grid[nextRow][nextCol].visited = true;
        } else {
            currentCell = stack.pop();
        }
    }

    return grid;
}

function drawMaze(maze) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const x = col * cellSize;
            const y = row * cellSize;

            if (maze[row][col].top) ctx.strokeRect(x, y, cellSize, 2);
            if (maze[row][col].right) ctx.strokeRect(x + cellSize - 2, y, 2, cellSize);
            if (maze[row][col].bottom) ctx.strokeRect(x, y + cellSize - 2, cellSize, 2);
            if (maze[row][col].left) ctx.strokeRect(x, y, 2, cellSize);
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawExit() {
    ctx.fillStyle = 'green';
    ctx.fillRect(exit.x, exit.y, exit.width, exit.height);
}

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMaze(maze);
    drawPlayer();
    drawExit();

    if (checkCollision(player, exit)) {
        score += 10;
        level++;
        if (level <= 3) {  // Example: 3 levels
            maze = createMaze(mazeRows, mazeCols);
            player.x = 50;
            player.y = 50;
        } else {
            showRestartScreen();
        }
    }

    requestAnimationFrame(update);
}

function movePlayer(e) {
    const col = Math.floor(player.x / cellSize);
    const row = Math.floor(player.y / cellSize);
    const cell = maze[row][col];

    switch (e.key) {
        case 'ArrowUp':
            if (!cell.top) player.y -= player.speed;
            break;
        case 'ArrowDown':
            if (!cell.bottom) player.y += player.speed;
            break;
        case 'ArrowLeft':
            if (!cell.left) player.x -= player.speed;
            break;
        case 'ArrowRight':
            if (!cell.right) player.x += player.speed;
            break;
    }
}

function showRestartScreen() {
    document.getElementById('finalScore').innerText = score;
    document.getElementById('restartScreen').classList.remove('hidden');
    cancelAnimationFrame(update);
}

function restartGame() {
    level = 1;
    score = 0;
    player.x = 50;
    player.y = 50;
    maze = createMaze(mazeRows, mazeCols);
    document.getElementById('restartScreen').classList.add('hidden');
    update();
}

document.addEventListener('keydown', movePlayer);

// Initialize the game with the first maze
maze = createMaze(mazeRows, mazeCols);
update();
