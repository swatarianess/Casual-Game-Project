var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var clearCanvasBtn = document.getElementById('clearCanvasBtn');

var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var mouseX = 0;
var mouseY = 0;
var btnInstructions = new Button(181, 355, 265, 316);
var btnPlay = new Button(219, 285, 160,	230);

var imgSprite = new Image();
imgSprite.src ='titleScreen.png';
imgSprite.addEventListener('load',init,false);


function init(){
    drawMenu();
    document.addEventListener('click',mouseClicked,false);
    //document.addEventListener('keydown',checkKeyDown,false);
    //document.addEventListener('keyup',checkKeyUp,false);
}

function playGame(){
	drawBg();
}
function drawMenu() {
    ctxBg.drawImage(imgSprite,0,700,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
}
 function instructions(){
	drawInstruction();
}

function drawInstruction(){
	ctxBg.drawImage(imgSprite,0, 1300,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
}
function drawBg() {
    ctxBg.drawImage(imgSprite,0,0,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
}

//event functions
function mouseClicked(e){
     mouseX = e.pageX - canvasBg.offsetLeft;
     mouseY = e.pageY - canvasBg.offsetTop;
     if (btnPlay.checkClicked()) playGame();

     if (btnInstructions.checkClicked()) instructions();
}

function checkKeyDown(e) {
	var keyID = e.KeyCode || e.which;
	if(keyID === 38 || keyID === 87) { // up arrow & w key 
		this.isUpKey = true;
		e.preventDefault();

	}
	else if(keyID === 40 || keyID === 83) { // down arrow & s key
		this.isDownKey = true;
		e.preventDefault();

	}
}


function checkKeyUp(e) {
	var keyID = (e.keyCode) ? e.keyCode : e.which;
	if(keyID === 38 || keyID === 87) { // up arrow & w key
		this.isUpKey = false;
		e.preventDefault();

	}
	if(keyID === 40 || keyID === 83) { // down arrow & s key
		this.isDownKey = false;
		e.preventDefault();

	}
}
//button objects
function Button(xL, xR, yT, yB){
	this.xleft = xL;
	this.xRight = xR;
	this.yTop = yT;
	this.yBottom = yB;
	//this.isUpKey = false;
	//this.isDownKey = false;
}

Button.prototype.checkClicked = function(){
	if (this.xleft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom ) return true;
};

/*Button.prototype.checkKeys = function() {
	if(this.isUpKey) {
		this.drawY -= this.speed;
	}
	if(this.isDownKey) {
		this.drawY -= this.speed;
	}
}*/