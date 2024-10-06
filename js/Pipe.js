
//gap = 120;
//width = 70;

class Pipe {
    color = 'black';
    constructor(x, y, gap, width, moveSpeed) {
        this.center = {x, y};
        this.gap = gap;
        this.width = width;
        this.toRemove = false;
        this.moveSpeed = moveSpeed;
    }

    draw(ctx, canvas) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.center.x - this.width / 2, 0, this.width, this.center.y - this.gap / 2);
        ctx.fillRect(this.center.x - this.width / 2, this.center.y + this.gap / 2, this.width, canvas.height - (this.center.y + this.gap / 2));
    }

    move(deltaTime) {
        this.center.x -= this.moveSpeed * deltaTime;
        if (this.center.x + this.width / 2 < 0) 
        {
            this.toRemove = true;
        }
    }
    checkCollision(bird, canvas) {
        // https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
        const intersects = (y, height) => {
            let distance = { x: 0, y: 0 };
            distance.x = Math.abs(bird.position.x - this.center.x);
            distance.y = Math.abs(bird.position.y - y);

            if (distance.x > (this.width / 2 + bird.size / 2)) { return false; }
            if (distance.y > (height / 2 + bird.size / 2)) { return false; }

            if (distance.x <= (this.width / 2)) { return true; }
            if (distance.y <= (height / 2)) { return true; }

            let cornerDistance_sq = (distance.x - this.width / 2) ** 2 + (distance.y - height / 2) ** 2;
            return (cornerDistance_sq <= ((bird.size / 2) ** 2));
        };

        let topCollision = intersects(0, (this.center.y - this.gap / 2) * 2);
        let botCollision = intersects(canvas.height, (canvas.height - this.center.y - this.gap / 2) * 2);
        return (topCollision || botCollision);
    }
}
