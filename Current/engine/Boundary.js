//MB
function Block (height, width) {
    if (height === undefined) {height = 60;}
    if (width === undefined) {width = 60;}
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.height = height;
    this.width = width;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.src = "";
    this.color = utils.parseColor("#00ec00");

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

Block.prototype.draw = function(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);

    context.lineWidth = 1;
    context.fillStyle = this.color;
    context.beginPath();
    context.rect(0, 0, this.width, this.height);
    context.closePath();
    context.fill();

    context.restore();
};