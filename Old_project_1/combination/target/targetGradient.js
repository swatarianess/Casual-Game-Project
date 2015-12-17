//MB v7
var target =
{
    transp: 1,
    topColour: 0,
    diff: 0.3,
    numberOfFrames: 59,
    currentFrame: 0,
    forward: true,

    updateAnimation: function() {
        if (this.forward) {
            this.transp = this.transp - (this.diff / this.numberOfFrames);
            this.topColour = this.topColour + (this.diff / this.numberOfFrames);
            if (this.topColour > this.diff) {
                this.topColour = this.diff;
            }
            this.currentFrame++;
        } else {
            this.transp += this.diff / this.numberOfFrames;
            this.topColour -= this.diff / this.numberOfFrames;
            if (this.topColour < 0) {
                this.topColour = 0;
            }
            this.currentFrame--;
        }
        if (this.currentFrame === 0) {
            this.forward = true;
        } else if (this.currentFrame === this.numberOfFrames) {
            this.forward = false;
        }
    }
};

var targetCanvas = document.createElement("canvas");
var targetContext = targetCanvas.getContext("2d");

function drawTargetFrame() {
    targetContext.save();
	var targetGrad = targetContext.createLinearGradient(0, 0, 0, targetCanvas.height);
    targetGrad.addColorStop(target.topColour, utils.colorToRGB("#F84A57", 0));
    targetGrad.addColorStop(1, utils.colorToRGB("#F84A57", target.transp));
    targetContext.fillStyle = targetGrad;
    targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    targetContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
    targetContext.restore();
	
	target.updateAnimation();
}