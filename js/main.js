const birdCanvas = document.getElementById('birdCanvas');
birdCanvas.height = 512;
birdCanvas.width = 512;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = 512;
networkCanvas.width = 512

const birdCtx = birdCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const birdX = 100;
const gravity = 0.01;
const moveSpeed = .15;
const jumpPower = .4
const delayBetweenPipes = 2000;

let deltaTime = 0;
let lastUpdate = Date.now();
let isPaused, isGameOver;


let bird;
let pipeSpawnInterval;
const pipes = [];
let nextPipe = null;

const getNextPipe = () => {
    for (const pipe of pipes) {
        if (pipe.center.x + pipe.width/2 > birdX) {
            return pipe
        }
    }
}

const updateScore = () => {
    if(nextPipe.center.x + nextPipe.width/2 <= birdX) {
        nextPipe = getNextPipe();
        if(bird.isAlive) {
            bird.score++;
        }
    }
}

const init = () => {    
    bird = new Bird(birdX, birdCanvas.height/2, jumpPower, gravity, moveSpeed, "Player");
    isPaused = true;
    clearInterval(pipeSpawnInterval);
    pipes.length = 0;
    pipeSpawnInterval = setInterval(spawnPipes, delayBetweenPipes);
}

const gameOver = () => {
    clearInterval(pipeSpawnInterval);
    pipes.length = 0;
    nextPipe = null;
    isGameOver = true;
    isPaused = true;
}

const spawnPipes = () => {
    let margin = 50
    
    let width = 70;
    let gap = 120;
    let x = birdCanvas.width + width;
    
    let maxHeight = margin + gap/2;
    let minHeight = birdCanvas.height - margin - gap/2;
    let y = Math.random() * (minHeight - maxHeight) + maxHeight;

    let newPipe = new Pipe(x, y, gap, width, moveSpeed)
    pipes.push(newPipe);
    if(nextPipe === null) nextPipe = pipes[0];
}

const animate = () => {
    // delattime
    deltaTime = Date.now() - lastUpdate;
    lastUpdate = Date.now();

    if (!isPaused) {
        birdCtx.clearRect(0,0,birdCanvas.width,birdCanvas.height); // clear screen

        for(const pipe of pipes) {
            pipe.move(deltaTime);
            pipe.draw(birdCtx, birdCanvas);
            if(pipe.toRemove) {
                setTimeout(() => pipes.shift(), 0);
            }
        }
        if(nextPipe !== null) {
            updateScore();
            if(nextPipe.checkCollision(bird, birdCanvas)){
                bird.die();
            }
        }
        bird.update(deltaTime, birdCanvas, nextPipe);
        bird.draw(birdCtx);
    }
    Visualizer.drawNetwork(networkCtx, bird.brain);



    if(!isGameOver && !bird.isAlive) gameOver();
requestAnimationFrame(animate)
}



addEventListener('click', (e) => {
    if(isPaused) {
        isPaused = false;
    }
    if(isGameOver) {
        isGameOver = false;
        init();
        isPaused = false;
    }
})


init();
animate();