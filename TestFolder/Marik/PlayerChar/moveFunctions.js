/**
 * Created by MB on 06/12/2015.
 */
player.move = function () {

    if (this.moveUp && !this.moveDown) {
        this.ay = -0.2;
        this.friction = 1;
    }
    if (this.moveDown && !this.moveUp) {
        this.ay = 0.2;
        this.friction = 1;
    }
    if (this.moveLeft && !this.moveRight) {
        this.ax = -0.2;
        this.friction = 1;
    }
    if (this.moveRight && !this.moveLeft) {
        this.ax = 0.2;
        this.friction = 1;
    }

    if (!this.moveUp && !this.moveDown) {
        this.ay = 0;
    }
    if (!this.moveLeft && !this.moveRight) {
        this.ax = 0;
    }
    if (!this.moveUp && !this.moveDown && !this.moveLeft && !this.moveRight) {
        this.friction = 0.98;
    }

    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.friction;
    this.vy *= this.friction;

    if (this.vx > this.speedLimit) {
        this.vx = this.speedLimit;
    } else if (this.vx < -this.speedLimit) {
        this.vx = -this.speedLimit;
    }
    if (this.vy > this.speedLimit) {
        this.vy = this.speedLimit;
    } else if (this.vy < -this.speedLimit) {
        this.vy = -this.speedLimit;
    }

    this.x += this.vx;
    this.y += this.vy;
};

objects[0].move = function () {
    this.vx *= this.friction;
    this.vy *= this.friction;

    if (this.vx > this.speedLimit) {
        this.vx = this.speedLimit;
    } else if (this.vx < -this.speedLimit) {
        this.vx = -this.speedLimit;
    }
    if (this.vy > this.speedLimit) {
        this.vy = this.speedLimit;
    } else if (this.vy < -this.speedLimit) {
        this.vy = -this.speedLimit;
    }

    this.x += this.vx;
    this.y += this.vy;
};

enemies[0].move = function () {
    this.x = objects[0].x + this.radius * Math.cos((Math.PI / 64) * this.frame);
    this.y = objects[0].y + this.radius * Math.sin((Math.PI / 64) * this.frame);
    this.frame++;
};