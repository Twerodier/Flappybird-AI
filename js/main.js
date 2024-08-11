const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.height = 512;
canvas.width = window.innerWidth;

const gravity = 0.01;
const moveSpeed = .1;
const jumpPower = .4
const delayBetweenPipes = 2000;

let deltaTime = 0;
let lastUpdate = Date.now();
let isPaused, isGameOver;


let bird;
let pipeSpawnInterval;
const pipes = [];

class Bird {
    size = 50;
    position = {};
    velocity = {y:0};
    color =  'black';
    isAlive = true;
    score = 0;
    constructor(x, y) {
        this.position = {x, y};
    }
    
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size/2, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        this.velocity.y += gravity; // apply gravity

        // dont let the bird go too far above the screen
        if (this.position.y < -this.size/2) {
            this.position.y = -this.size/2;
        }
        
        // if on ground
        if (this.position.y + this.size/2 > canvas.height) {
            this.position.y = canvas.height - this.size/2
            this.velocity.y = Math.min (0, this.velocity.y)
            if (this.isAlive) {
                this.die();
            }
        }
        this.move(); // move bird
        this.draw(); // draw bird
    }
    move() {
        this.position.y += this.velocity.y * deltaTime;
        if(!this.isAlive) {
            this.position.x -=moveSpeed * deltaTime;
        }
    }
    jump() {
        if (this.isAlive) {
            this.velocity.y = -jumpPower; 
        }
    }
    die() {
        this.isAlive  = false;
        this.velocity.x = 0;
        gameOver();
    }
}


class Pipe {
    gap;
    center = {};
    width;
    color = 'black';
    constructor(x, y, gap = 120, width = 70) {
        this.center.x = x;
        this.center.y = y;
        this.gap = gap;
        this.width = width;
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.center.x - this.width/2, 0, this.width, this.center.y - this.gap/2)
        ctx.fillRect(this.center.x - this.width/2, this.center.y + this.gap/2, this.width, canvas.height - (this.center.y + this.gap/2))
    }

    move() {
        this.center.x -= moveSpeed * deltaTime;
        if(this.center.x + this.width/2 < 0) {
            setTimeout(() => pipes.shift(), 0)
        }
    }
    checkCollision(bird) {
        // https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
        const intersects = (y, height) => {
            let distance = {x:0,y:0};
            distance.x = Math.abs(bird.position.x - this.center.x);
            distance.y = Math.abs(bird.position.y - y);
    
            if(distance.x > (this.width/2 + bird.size/2)) {return false;}
            if(distance.y > (height/2 + bird.size/2)) {return false;}
    
            if (distance.x <= (this.width/2)) {return true;}
            if (distance.y <= (height/2)) {return true;}
    
            let cornerDistance_sq = (distance.x - this.width/2)**2 + (distance.y - height/2)**2;
            return (cornerDistance_sq <= ((bird.size/2)**2))
        } 

        let topCollision = intersects(0,(this.center.y - this.gap/2) * 2);
        let botCollision = intersects(canvas.height,(canvas.height - this.center.y - this.gap/2) * 2);

        return (topCollision || botCollision)
    }
}

const init = () => {    
    bird = new Bird(100, canvas.height/2);
    pipes.length = 0;
    isPaused = true;
    clearInterval(pipeSpawnInterval);
    pipeSpawnInterval = setInterval(spawnPipes, delayBetweenPipes);
}

const gameOver = () => {
    clearInterval(pipeSpawnInterval);
    isGameOver = true;
    isPaused = true;
}

const spawnPipes = () => {
    let margin = 50
    
    let width = 70;
    let gap = 120;
    let x = canvas.width + width;
    
    let maxHeight = margin + gap/2;
    let minHeight = canvas.height - margin - gap/2;
    let y = Math.random() * (minHeight - maxHeight) + maxHeight;

    let newPipe = new Pipe(x, y, gap, width)
    pipes.push(newPipe);
}

const animate = () => {
    //delattime
    deltaTime = Date.now() - lastUpdate;
    lastUpdate = Date.now();
    if (!isPaused) {
    ctx.clearRect(0,0,canvas.width,canvas.height); // clear screen

    for(const pipe of pipes) {
        pipe.move();
        pipe.draw();
        if(pipe.checkCollision(bird)){
            bird.die();
        }
    }
    bird.update();
    }
requestAnimationFrame(animate)
}

// player input
addEventListener("keydown", (e) => {
    if (e.keyCode === 32) {
        bird.jump();
        if(isPaused) {
            isPaused = false;
        }
        if(isGameOver) {
            isGameOver = false;
            init();
            isPaused = false;
        }
    }
})

addEventListener('click', (e) => {
    bird.jump();
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