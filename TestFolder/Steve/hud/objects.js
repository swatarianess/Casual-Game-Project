/**
 * Created by Steve on 08/12/2015.
 */

//--- The message object

var messageObject =
{
    x: 0,
    y: 0,
    visible: true,
    text: "Message",
    font: "normal bold 20px Helvetica",
    fillStyle: "red",
    textBaseline: "top"
};

//Missed out a few things in here.
var spriteObject =
{
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 64,
    sourceHeight: 64,
    width: 64,
    height: 64,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    visible: true,

    //Getters
    centerX: function()
    {
        return this.x + (this.width / 2);
    },
    centerY: function()
    {
        return this.y + (this.height / 2);
    },
    halfWidth: function()
    {
        return this.width / 2;
    },
    halfHeight: function()
    {
        return this.height / 2;
    },
};