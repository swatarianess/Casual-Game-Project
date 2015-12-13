function boxObject (width, height, color) {
    if (width === undefined) { width = 50; }
    if (height === undefined) { height = 50; }
    if (color === undefined) { color = Math.random() * 0xffffff; }
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.speedLimit = 3;
    this.friction = 0.8;
    this.gravity = 0.3;
    this.width = width;
    this.height = height;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.color = utils.parseColor(color);
    this.lineWidth = 0;
    this.src = "";
    this.sourceX = 0;
    this.sourceY = 0;
    this.sourceWidth = 70;
    this.sourceHeight = 70;
    this.visible = true;

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

boxObject().prototype.draw = function () {
    if (this.visible) {
        if (this.src === "") {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.scaleX, this.scaleY);
            ctx.lineWidth = this.lineWidth;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.rect(0, 0, this.width, this.height);
            ctx.closePath();
            ctx.fill();
            if (this.lineWidth > 0) {
                ctx.stroke();
            }
            ctx.restore();
        } else {
            ctx.drawImage(this.src,
                this.sourceX, this.sourceY,
                this.sourceWidth, this.sourceHeight,
                Math.floor(this.x), Math.floor(this.y),
                this.width, this.height);
        }
    }
};