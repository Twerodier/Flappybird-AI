const birdCanvas = document.getElementById('birdCanvas');
birdCanvas.height = 500;
birdCanvas.width = 500;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = 500;
networkCanvas.width = 300

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

const birdCount = 100
const pipes = [];
let nextPipe = null;
let birds;
let bestBird;

const generateBirds = (count) => {
    let arr = []
    for(let i = 0; i < count; i++){
        let bird = new Bird(birdX, birdCanvas.height/2, jumpPower, gravity, moveSpeed, "AI");
        arr.push(bird);
    }
    return arr
}




const getNextPipe = () => {
    for (const pipe of pipes) {
        if (pipe.center.x + pipe.width/2 > birdX) {
            return pipe
        }
    }
}

const updateScore = (bird) => {
    if(nextPipe.center.x + nextPipe.width/2 <= birdX) {
        nextPipe = getNextPipe();
        if(bird.isAlive) {
            bird.score++;
        }
    }
}

const init = () => { 
    isPaused = true;
    pipes.length = 0;
    birds = generateBirds(birdCount);
    bestBird = birds[0]   
    if(localStorage.getItem("bestBrain")){
        bestBird.brain=JSON.parse(localStorage.getItem("bestBrain"))
        for(let i = 0; i < birds.length; i++) {
            birds[i].brain=JSON.parse(
                localStorage.getItem("bestBrain")
            )
            if (i!= 0) {
                NeuralNetwork.mutate(birds[i].brain,0.5)
            }
        }
    }
}

const gameOver = () => {
    pipes.length = 0;
    nextPipe = null;
    isGameOver = true;
    isPaused = true;

    save();
    init();
    isPaused = false;
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

const save = () => {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestBird.brain)
    )
}

const discard = () => {
    localStorage.removeItem("bestBrain");
}


let timeUntilNextPipe = 0
const animate = () => {
    // delattime
    deltaTime = Date.now() - lastUpdate;
    lastUpdate = Date.now();
    bestBird = birds.find(b => b.lifeTime == Math.max(...birds.map(b => b.lifeTime)));
    if (!isPaused) {
        birdCtx.clearRect(0,0,birdCanvas.width,birdCanvas.height); // clear screen
        if (timeUntilNextPipe <= 0) {
            spawnPipes()
            timeUntilNextPipe = delayBetweenPipes
        } 
        else {
            timeUntilNextPipe -= deltaTime
        }
        for(const pipe of pipes) {
            pipe.move(deltaTime);
            pipe.draw(birdCtx, birdCanvas);
            if(pipe.toRemove) {
                setTimeout(() => pipes.shift(), 0);
            }
        }
        
        birdCtx.globalAlpha = 0.2;
        for(const bird of birds) {
            bird.update(deltaTime, birdCanvas, nextPipe);
            bird.draw(birdCtx);
            if(nextPipe !== null) {
                updateScore(bird);            
                if(nextPipe.checkCollision(bird, birdCanvas)){
                    bird.die();
                }
            }
            if(bird.isAlive){
                bird.lifeTime++
            }
        }
        birdCtx.globalAlpha = 1;
        bestBird.draw(birdCtx)
    }   
    if (birds.every(b => !b.isAlive)){
        gameOver()
    }
    Visualizer.drawNetwork(networkCtx, bestBird.brain);
requestAnimationFrame(animate)
}



birdCanvas.addEventListener('click', () => {
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