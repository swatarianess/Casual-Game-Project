//MB
var c = document.getElementById("PlayChar");
var ctx = c.getContext("2d");
var lvl = 1;

//Array vars
var solids = [];
var objects = [];
var enemies = [];

//Arrays to store the game objects
var assetsToLoad = [];
var assetsLoaded = 0;


//Image vars
var playerSheet = new Image();
var thingSheet = new Image();

//Sprite sheet related vars
var scale = 2;
var animFrame;

//Configure fields for Image
playerSheet.src = "/resources/avatar.png";
playerSheet.spriteWidth = 50;
playerSheet.spriteHeight = 70;

thingSheet.src = "/resources/spritesheet.png";
thingSheet.spriteWidth = 70;
thingSheet.spriteHeight = 70;

var player;
var theTarget;

var LOADING = 0;
var BUILD_MAP = 1;
var PLAYING = 2;
var OVER = 3;
var gameState = LOADING;


/**
 * Sets the players move properties to true when the relevant buttons are pressed.
 * @param event
 */
function keyDownHandler(event) {
    switch (event.keyCode) {
        case keycode.UP:
        case keycode.W:
        case keycode.SPACE:
            player.jump = true;
            break;
        case keycode.LEFT:
        case keycode.A:
            player.moveLeft = true;
            break;
        case keycode.RIGHT:
        case keycode.D:
            player.moveRight = true;
            break;
        case keycode.R:
            window.cancelAnimationFrame(animFrame);
            startLevel();
            break;
    }
}

/**
 * Sets the players move properties to false when the relevant buttons are released.
 * @param event
 */
function keyUpHandler(event) {
    switch (event.keyCode) {
        case keycode.UP:
        case keycode.W:
        case keycode.SPACE:
            player.jump = false;
            break;
        case keycode.LEFT:
        case keycode.A:
            player.moveLeft = false;
            break;
        case keycode.RIGHT:
        case keycode.D:
            player.moveRight = false;
            break;
    }
}

/**
 *  Updates the game state. The bread and butter? Infinite loop.
 */
function update() {
    //The animation loop
    utils.requestAnimationFrame(update, c);

    switch (gameState) {
        case LOADING:
            console.log("Starting up game...");
            //TODO Add title screen here.
            loadHandler();
            break;

        case BUILD_MAP:
            //buildMap(mapObjects);
            //buildMap(gameObjects);
            createObjects();
            gameState = PLAYING;
            break;

        case PLAYING:
            playGame();
            break;

        case OVER:
            //TODO Add what happens when you lose.
            break;
    }
    render();
}

function loadHandler() {
    console.time("Resources loaded");
    assetsLoaded++;
    if (assetsLoaded === assetsToLoad.length) {
        image.removeEventListener("load", loadHandler, false);
        console.timeEnd("Resources loaded");
        gameState = BUILD_MAP;
        console.log("Game loaded: " + assetsLoaded + " assets.")
    }

}

/**
 * The main game's "engine". Handles all the player input and physics.
 */
function playGame() {
    //Up
    if (moveUp && !moveDown) {
        hudMessage.text = "UP key.";
        setTimeout(function(){
            hudMessage.text = "";
        },1500);
    }

    //Down
    if (moveDown && !moveUp) {
        hudMessage.text = "Down Key.";
        setTimeout(function(){
            hudMessage.text = "";
        },1500);
    }

    //Left
    if (moveLeft && !moveRight) {
        hudMessage.text = "Left Key.";
        setTimeout(function(){
            hudMessage.text = "";
        },1500);
    }

    //Right
    if (moveRight && !moveLeft) {
        hudMessage.text = "Right Key.";
        setTimeout(function(){
            hudMessage.text = "";
        },1500);
    }
    //TODO Add the collision code here.
    //TODO Add destroyBox() when target and boxObject collide
}

// Caller to start the game
window.onload = function() {

    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);

    startLevel();
};

/**
 * Moves all objects and draws them.
 */
function drawFrame() { //AKA UPDATE
    animFrame = window.requestAnimationFrame(drawFrame);
    ctx.clearRect(0, 0, c.width, c.height);
    player.move();

    //noinspection JSDuplicatedDeclaration
    for (var i = 0; i < solids.length; i++) {
        solids[i].draw();
        if (checkCollision(player, solids[i], true) === "bottom"){
            player.isOnGround = true;
        }
    }

    //noinspection JSDuplicatedDeclaration
    for (var i = 0; i < objects.length; i++) {
        objects[i].move();
        checkCollision(objects[i], player, true);
        for (var j = 0; j < solids.length; j++) {
            checkCollision(objects[i], solids[j], true);
        }
        if (checkCollision(player, objects[i], true) === "bottom") {
            player.isOnGround = true;
        }
        if (checkCollision(theTarget, objects[i]) && objects[i].y >= c.height - 5) {
            console.log("You win.");
            objects.splice(i, 1);
        } else {
            objects[i].draw();
        }
    }

    //noinspection JSDuplicatedDeclaration
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].move();
        enemies[i].draw();

        if (checkCollision(enemies[i], player)) {
            window.cancelAnimationFrame(animFrame);
            console.log("Game over.");
            startLevel();
        }
    }
    drawGoalFrame();
    theTarget.draw();
    player.draw();
    //Render
}

function createObjects(){

}

/**
 * Starts the level. Can be called to reset the level as well.
 */
function startLevel() {
    objects[0] = new Box(70 / scale, 70 / scale, "#0000ff");
    enemies[0] = new Box(70 / scale, 70 / scale, "#ff00ff");
    enemies[0].linkedObject = objects[0];

    defineMoveMethods(player, objects[0], enemies[0]);

    //Floor left
    solids[0] = new Box(c.width / 5 * 3, 50, "#00ff00");
    solids[0].y = c.height - solids[0].height;
    solids[0].src = thingSheet;
    solids[0].sourceWidth = thingSheet.spriteWidth * 3;

    //Floor Right
    solids[1] = Object.create(solids[0]);
    solids[1].width = solids[1].width / 3 + (c.width / 5 - thingSheet.spriteWidth);
    solids[1].x = solids[0].width + thingSheet.spriteWidth;

    //Border objects
    solids[2] = new Box(c.width, 50, "#00ff00");
    solids[3] = new Box(50, c.height - 50, "#00ff00");
    solids[4] = new Box(50, c.height - 50, "#00ff00");
    solids[4].x = c.width - solids[3].width;

    player.jump = false;
    player.moveLeft = false;
    player.moveRight = false;
    player.isOnGround = undefined;
    player.ax = 0;
    player.ay = 0;
    player.vx = 0;
    player.vy = 0;

    objects[0].friction = 0.94;
    objects[0].src = thingSheet;
    objects[0].sourceY = 4 * 70;

    enemies[0].radius = 100;
    enemies[0].frame = 0;
    enemies[0].src = thingSheet;
    enemies[0].sourceX = 70;
    enemies[0].sourceY = 4 * 70;

    theTarget.src = goalCanvas;
    theTarget.sourceHeight = goalCanvas.height;
    theTarget.sourceWidth = goalCanvas.width;

    buildLevel();
    drawFrame();
}
