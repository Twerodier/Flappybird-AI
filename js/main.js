const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// max heigh formula: max heigh =  initial velocity^2 / (2 * gravity)
// initial velocity^2 = 

// phone aspect ratio 16:9, 17:9, 18:9
canvas.height = 500;
canvas.width = window.innerWidth;

const gravity = 0.02;
const moveSpeed = .2;
const jumpPower = .8

let deltaTime = 0;
let lastUpdate = Date.now();


class Bird {
    size = 30;
    position = {};
    velocity = {y:0};
    isAlive = true;
    constructor(x, y) {
        this.position = {x, y};
    }
    
    draw(){
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        this.velocity.y += gravity; // apply gravity

        // dont let the bird go too far above the screen
        if (this.position.y < -this.size) {
            this.position.y = -this.size;
        }
        
        // if on ground
        if (this.position.y + this.size > canvas.height) {
            this.position.y = canvas.height - this.size
            this.velocity.y = Math.min (0, this.velocity.y)
            if (this.isAlive) {
                this.die();
            }
        }
        this.move(); // move bird
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
    }
}


class Pipe {
    gap;
    center = {x: canvas.width + 100};
    width = 100;

    constructor(y, gap = 200) {
        this.center.y = y;
        this.gap = gap;
    }

    draw() {
        ctx.fillRect(this.center.x, 0, this.width, this.center.y - this.gap/2)
        ctx.fillRect(this.center.x, this.center.y + this.gap/2, this.width, canvas.height - (this.center.y + this.gap/2))
    }

    move() {
        this.center.x -= moveSpeed * deltaTime;
    }
    checkCollision(bird) {
        if(bird.position.x)
    }
}

const pipe = new Pipe(200);
const bird = new Bird(100, canvas.height/2);
const animate = () => {
    //delattime
    deltaTime = Date.now() - lastUpdate;
    lastUpdate = Date.now();

    ctx.clearRect(0,0,canvas.width,canvas.height); // clear screen

    bird.update();
    bird.draw();
    pipe.draw();
    pipe.move();

    requestAnimationFrame(animate)
}
animate();

addEventListener("keydown", (e) => {
    if (e.keyCode === 32) {
        bird.jump();
    }
})

addEventListener('click', (e) => {
    bird.jump();
})