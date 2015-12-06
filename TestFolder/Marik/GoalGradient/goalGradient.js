/**
 * Created by MB on 06/12/2015.
 */
//MB
var goal =
{
    transparency: 0.5,
    topColour: 0,
    diff: 0.3,
    numberOfFrames: 59,
    currentFrame: 0,
    forward: true,

    updateAnimation: function () {
        if (this.forward) {
            this.transparency = this.transparency - (this.diff / this.numberOfFrames);
            this.topColour = this.topColour + (this.diff / this.numberOfFrames);
            this.currentFrame++;
        } else {
            this.transparency += this.diff / this.numberOfFrames;
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

var goalCanvas = document.getElementById("GoalGradient");
var goalContext = goalCanvas.getContext("2d");

function drawGoalFrame() {
    goalContext.save();
    var goalGrad = goalContext.createLinearGradient(0, 0, 0, goalCanvas.height);
    goalGrad.addColorStop(goal.topColour, "transparent");
    goalGrad.addColorStop(1, utils.colorToRGB("#F84A57", goal.transparency));
    goalContext.fillStyle = goalGrad;
    goalContext.clearRect(0, 0, goalCanvas.width, goalCanvas.height);
    goalContext.fillRect(0, 0, goalCanvas.width, goalCanvas.height);
    goalContext.restore();

    goal.updateAnimation();
}