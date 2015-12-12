//MB
/**
 * Will define the move methods for the player, boxes, and enemies.
 * @param player Object representing the player character
 * @param box Object representing the first box.
 * @param enemySpin Object representing the first spinning enemy.
 * @param enemyCircle Object representing the first enemy that circles a platform.
 */
function defineMoveMethods(player, box, enemySpin, enemyCircle) {
    if(enemyCircle === undefined) {
        //Do something.
    }

    player.move = function() {
        if (this.jump && this.isOnGround) {
            this.vy += this.jumpForce;
            this.friction = 1;
            this.isOnGround = false;
            this.state = this.JUMPING;
        }
        if (this.moveLeft && !this.moveRight && this.isOnGround) {
            this.ax = -0.2;
            this.friction = 1;
            this.state = this.WALKING;
        }
        if (this.moveRight && !this.moveLeft && this.isOnGround) {
            this.ax = 0.2;
            this.friction = 1;
            this.state = this.WALKING;
        }

        if (!this.moveLeft && !this.moveRight) {
            this.ax = 0;
            this.friction = 0.8;
            this.gravity = 0.3;
            this.state = this.STANDING;
        }

        this.vx += this.ax;
        this.vy += this.ay;

        if (this.vx < 0) {
            this.facing = this.LEFT;
        } else if (this.vx > 0) {
            this.facing = this.RIGHT;
        }

        if (this.isOnGround) {
            this.vx *= this.friction;
        }

        this.vy += this.gravity;

        if (this.vx > this.speedLimit) {
            this.vx = this.speedLimit;
        } else if (this.vx < -this.speedLimit) {
            this.vx = -this.speedLimit;
        }
        if (this.vy > this.speedLimit * 2) {
            this.vy = this.speedLimit * 2;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > c.width - this.width) {
            this.x = c.width - this.width;
        }
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y > c.height - this.height) {
            this.y = c.height - this.height;
            this.isOnGround = true;
        }

        this.sourceY = this.state * this.src.spriteHeight;
        if (this.state === this.WALKING && this.currentFrame < this.numberOfFrames) {
            this.sourceX = this.facing * this.src.spriteWidth * 3 + (Math.floor(this.currentFrame) * this.src.spriteWidth);
            this.currentFrame += 0.2;
        } else {
            this.sourceX = this.facing * this.src.spriteWidth * 3;
            this.currentFrame = 0;
        }
    };

    box.move = function() {
        this.vx *= this.friction;

        this.vy += this.gravity;

        if (this.vx > this.speedLimit) {
            this.vx = this.speedLimit;
        } else if (this.vx < -this.speedLimit) {
            this.vx = -this.speedLimit;
        }
        if (this.vy > this.speedLimit * 2) {
            this.vy = this.speedLimit * 2;
        }

        this.x += this.vx;
        this.y += this.vy;
    };

    enemySpin.move = function() {
	    this.x = this.linkedObject.x + this.radius * Math.cos((Math.PI / 64) * this.frame);
	    this.y = this.linkedObject.y + this.radius * Math.sin((Math.PI / 64) * this.frame);
	    this.frame++;
    }
}