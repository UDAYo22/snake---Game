const board = document.querySelector('.board');
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

// info selection
const highScoreElement = document.querySelector("#high-score");
const currentScoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");


let score = 0;
let time = `00-00`;
let highScore = localStorage.getItem("highScore") || 0

highScoreElement.innerText = highScore;

const blockheight = 80;
const blockwidth = 80;

const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);

let intervalId = null;
let timerIntervalId = null;
let gameRunning = false;

let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };

const blocks = [];
let snake = [{
    x: 5, y: 5
}];

let direction = 'left';

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = `${row}-${col}`;
        blocks[`${col}-${row}`] = block;
    }
}

function render() {

    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food")

    if (direction === "left") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    } else if (direction === "right") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    } else if (direction === "up") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (direction === "down") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    }
 
    // wall collision logic
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        clearInterval(intervalId);
        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";
        return;
    }

    // food consuming logic
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
        blocks[`${food.x}-${food.y}`].classList.add("food");
        // snake length inc..
        snake.unshift(head);

        score += 10;
        currentScoreElement.innerText = score;
        
        // scoring logic
        if(score  > highScore) {
            highScore = score
            localStorage.setItem("highScore" , highScore.toString());
        }
    } 

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    snake.unshift(head);
    snake.pop();


    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}

// Don't auto-start the game

startButton.addEventListener("click", () => {
    gameRunning = true;
    modal.style.display = "none"
    
    if (intervalId) clearInterval(intervalId);
    if (timerIntervalId) clearInterval(timerIntervalId);
    
    intervalId = setInterval(() => { render() }, 800)
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);  
       if(sec == 59) {
        min +=1
        sec = 0
       }else {
        sec += 1
       }

       time = `${String(min).padStart(2, '0')}-${String(sec).padStart(2, '0')}`
       timeElement.innerText = time;
    }, 1000)
})

restartButton.addEventListener("click", restartGame)


function restartGame() {
    //reset game state
    clearInterval(intervalId);
    clearInterval(timerIntervalId);
    gameRunning = false;
    
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })
    score = 0
    time = `00-00`;
    
    currentScoreElement.innerText = score
    timeElement.innerHTML = time
    highScoreElement.innerText = highScore

    direction = "left";
    snake = [{ x: 5, y: 5 }];
    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    
    // Show start modal again
    modal.style.display = "flex";
    gameOverModal.style.display = "none";
    startGameModal.style.display = "flex";
}


document.addEventListener("keydown", (event) => {

    if (event.key == "ArrowUp") {
        direction = "up";
    } else if (event.key == "ArrowDown") {
        direction = "down";
    } else if (event.key == "ArrowLeft") {
        direction = "left";
    } else if (event.key == "ArrowRight") {
        direction = "right";
    }

});


