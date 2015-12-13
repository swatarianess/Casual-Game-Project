/**
 * Created by Marik on 11/12/2015.
 */
//MB
function PlayChar() {
    this.STANDING = 0;
    this.WALKING = 1;
    this.JUMPING = 2;
    this.LIFTING = 3;
    this.HOLDING = 4;
    this.THROWING = 5;

    this.state = this.STANDING;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.speedLimit = 3;
    this.friction = 0.98;
    this.bounce = -0.7;
    this.gravity = 0.3;
    this.height = 30;
    this.width = 15;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;

    this.isOnGround = undefined;
    this.jumpForce = -10;

    this.centerX = function() {
        return this.x + (this.width / 2);
    };
    this.centerY = function() {
        return this.y + (this.height / 2);
    };
    this.halfWidth = function() {
        return this.width / 2;
    };
    this.halfHeight = function() {
        return this.height / 2;
    }
}

PlayChar.prototype.draw = function(context) {
    if (moveUp && !moveDown) {
        this.ay = -0.2;
        this.friction = 1;
    }
    if (moveDown && !moveUp) {
        this.ay = 0.2;
        this.friction = 1;
    }
    if (moveLeft && !moveRight) {
        this.ax = -0.2;
        this.friction = 1;
    }
    if (moveRight && !moveLeft) {
        this.ax = 0.2;
        this.friction = 1;
    }

    if (!moveUp && !moveDown) {
        this.ay = 0;
    }
    if (!moveLeft && !moveRight) {
        this.ax = 0;
    }
    if (!moveUp && !moveDown && !moveLeft && !moveRight) {
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

    if (this.x < 0) {
        this.x = 0;
        this.vx *= this.bounce;
    } else if (this.x + this.width > c.width) {
        this.x = c.width - this.width;
        this.vx *= this.bounce;
    }
    if (this.y < 0) {
        this.y = 0;
        this.vy *= this.bounce;
    } else if (this.y + this.height > c.height) {
        this.y = c.height - this.height;
        this.vy *= this.bounce;
    }

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);

    context.lineWidth = 1;
    context.fillStyle = utils.parseColor("#990099");
    context.beginPath();
    context.rect(0, 0, this.width, this.height);
    context.closePath();
    context.fill();
    context.restore();
};
