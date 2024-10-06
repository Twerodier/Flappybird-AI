class Bird {
    constructor(x, y, jumpPower, gravity, moveSpeed, controlType, pipes) {
        this.size = 50;
        this.velocity = { y: 0 };

        this.position = { x, y };
        this.jumpPower = jumpPower;
        this.gravity = gravity;
        this.moveSpeed = moveSpeed;
        this.pipes = pipes;
        
        this.controls = new Controls(controlType);
        this.sensor = new Sensor(this)
        this.brain = new NeuralNetwork([this.sensor.count, 6, 1])
        this.useBrain = true;
        
        this.isAlive = true;
        this.color = 'black'
        this.score = 0;
        this.lifeTime = 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    update(deltaTime, canvas, nextPipe) {
        this.velocity.y += this.gravity; // apply gravity

        if(this.controls.jump) {
            this.jump();
            this.controls.jump = false;
        }

        // dont let the bird go too far above the screen
        if (this.position.y < -this.size / 2) {
            this.position.y = -this.size / 2;
        }

        // if on ground
        if (this.position.y + this.size / 2 > canvas.height) {
            this.position.y = canvas.height - this.size / 2;
            this.velocity.y = Math.min(0, this.velocity.y);
            if (this.isAlive) {
                this.die();
            }
        }
        this.move(deltaTime); // move bird
        if(this.sensor){
            this.sensor.update(nextPipe);

            const offsets = this.sensor.readings.map(s => s ?? 0);
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            if(outputs[0] == 1) {
                this.controls.jump = true;
            }
        }
    }
    move(deltaTime) {
        this.position.y += this.velocity.y * deltaTime;
        if (!this.isAlive) {
            this.position.x -= this.moveSpeed * deltaTime;
        }
    }
    jump() {
        if (this.isAlive) {
            this.velocity.y = -this.jumpPower;
        }
    }
    die() {
        this.isAlive = false;
        this.velocity.x = 0;
    }
}
