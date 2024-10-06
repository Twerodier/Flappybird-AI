



class Sensor{
    constructor(bird){
        this.bird = bird;
        this.pipes = pipes
        this.count = 2;
        this.readings = new Array(2);
    }

    update(nextPipe) {
        this.readings = [];

        if(nextPipe !== null) {
            //x distance next pipe
            let xDistance = (nextPipe.center.x - nextPipe.width/2) - (this.bird.position.x - this.bird.size/2);

            xDistance = xDistance / 512;

            // y distance to center next pipe
            let yDistance = nextPipe.center.y - this.bird.position.y;
            yDistance = yDistance / 256

            this.readings[0] = xDistance;
            this.readings[1] = yDistance;
        }
        

    }
}