const board = document.getElementById("game-board");
const context = board.getContext("2d");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restart-button");
const scoreForm = document.getElementById("score-form");
const initialsInput = document.getElementById("initials-input");
const submitStatusElement = document.getElementById("submit-status");
const leaderboardListElement = document.getElementById("leaderboard-list");

const gridSize = 20;
const tileSize = board.width / gridSize;
const tickMs = 130;

let snake;
let direction;
let pendingDirection;
let fruit;
let score;
let gameStarted;
let isPaused;
let timerId;
let leaderboard = [];
let pendingHighScore = null;
let isSubmittingScore = false;

function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    pendingDirection = direction;
    fruit = spawnFruit();
    score = 0;
    gameStarted = false;
    isPaused = false;
    pendingHighScore = null;
    scoreElement.textContent = "0";
    statusElement.textContent = "Press any movement key to begin.";
    submitStatusElement.textContent = "";
    scoreForm.hidden = true;
    initialsInput.value = "";
    updateBestScore();
    window.clearInterval(timerId);
    timerId = window.setInterval(stepGame, tickMs);
    draw();
}

function spawnFruit() {
    let nextFruit;

    do {
        nextFruit = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    } while (snake && snake.some((segment) => segment.x === nextFruit.x && segment.y === nextFruit.y));

    return nextFruit;
}

function stepGame() {
    if (!gameStarted || isPaused) {
        draw();
        return;
    }

    direction = pendingDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    const hitWall = head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
    const hitSelf = snake.some((segment) => segment.x === head.x && segment.y === head.y);

    if (hitWall || hitSelf) {
        gameStarted = false;
        isPaused = false;
        pendingHighScore = score > 0 ? score : null;
        if (pendingHighScore !== null) {
            scoreForm.hidden = false;
            initialsInput.focus();
            statusElement.textContent = `Game over. Final score: ${score}. Enter initials to save it.`;
        } else {
            statusElement.textContent = "Game over. Press Restart to play again.";
        }
        draw();
        return;
    }

    snake.unshift(head);

    if (head.x === fruit.x && head.y === fruit.y) {
        score += 1;
        scoreElement.textContent = String(score);
        updateBestScore();
        fruit = spawnFruit();
        statusElement.textContent = "Nice. Keep going.";
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    context.clearRect(0, 0, board.width, board.height);

    for (let column = 0; column < gridSize; column += 1) {
        for (let row = 0; row < gridSize; row += 1) {
            context.fillStyle = (column + row) % 2 === 0 ? "#edf5e4" : "#e3eed7";
            context.fillRect(column * tileSize, row * tileSize, tileSize, tileSize);
        }
    }

    context.fillStyle = "#c84c33";
    context.beginPath();
    context.arc(
        fruit.x * tileSize + tileSize / 2,
        fruit.y * tileSize + tileSize / 2,
        tileSize * 0.32,
        0,
        Math.PI * 2
    );
    context.fill();

    snake.forEach((segment, index) => {
        context.fillStyle = index === 0 ? "#214d2a" : "#2f6b3b";
        context.fillRect(
            segment.x * tileSize + 2,
            segment.y * tileSize + 2,
            tileSize - 4,
            tileSize - 4
        );
    });
}

function setDirection(nextDirection) {
    const isReverse = nextDirection.x === -direction.x && nextDirection.y === -direction.y;
    if (isReverse) {
        return;
    }

    pendingDirection = nextDirection;
    if (!gameStarted) {
        gameStarted = true;
        statusElement.textContent = "Game in progress.";
    }
}

function updateBestScore() {
    const leaderboardBest = leaderboard.length > 0 ? leaderboard[0].score : 0;
    bestScoreElement.textContent = String(Math.max(score || 0, leaderboardBest));
}

function renderLeaderboard() {
    if (leaderboard.length === 0) {
        leaderboardListElement.innerHTML = '<li class="leaderboard-empty">No scores yet.</li>';
        updateBestScore();
        return;
    }

    leaderboardListElement.innerHTML = leaderboard
        .map((entry, index) => `
            <li>
                <span class="leaderboard-rank">${index + 1}.</span>
                <span class="leaderboard-name">${entry.initials}</span>
                <span class="leaderboard-score">${entry.score}</span>
            </li>
        `)
        .join("");

    updateBestScore();
}

async function loadLeaderboard() {
    try {
        const response = await fetch("/api/highscores");
        if (!response.ok) {
            throw new Error("Failed to load scores.");
        }
        leaderboard = await response.json();
        renderLeaderboard();
    } catch (error) {
        leaderboard = [];
        leaderboardListElement.innerHTML = '<li class="leaderboard-empty">Leaderboard unavailable.</li>';
        submitStatusElement.textContent = error.message;
        updateBestScore();
    }
}

async function submitHighScore(event) {
    event.preventDefault();

    if (pendingHighScore === null || isSubmittingScore) {
        return;
    }

    const initials = initialsInput.value.trim();
    if (!/^[a-z]{2,3}$/i.test(initials)) {
        submitStatusElement.textContent = "Use 2 or 3 letters for initials.";
        return;
    }

    isSubmittingScore = true;
    submitStatusElement.textContent = "Saving score...";

    try {
        const response = await fetch("/api/highscores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                initials,
                score: pendingHighScore
            })
        });

        const payload = await response.json();
        if (!response.ok) {
            throw new Error(payload.error || "Unable to save score.");
        }

        leaderboard = payload;
        pendingHighScore = null;
        scoreForm.hidden = true;
        renderLeaderboard();
        submitStatusElement.textContent = "";
        statusElement.textContent = `Score saved for ${initials.toUpperCase()}. Press Restart to play again.`;
    } catch (error) {
        submitStatusElement.textContent = error.message;
    } finally {
        isSubmittingScore = false;
    }
}

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const movementKeys = {
        arrowup: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
        d: { x: 1, y: 0 }
    };

    if (key === " ") {
        if (gameStarted) {
            isPaused = !isPaused;
            statusElement.textContent = isPaused ? "Paused." : "Game in progress.";
            draw();
        }
        return;
    }

    if (movementKeys[key]) {
        event.preventDefault();
        setDirection(movementKeys[key]);
    }
});

restartButton.addEventListener("click", resetGame);
scoreForm.addEventListener("submit", submitHighScore);

resetGame();
loadLeaderboard();
