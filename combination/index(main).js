//Canvas
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

//The game map, Not a proper tested one.
var mapObjects = [];
//TODO create game map array properly

//The game objects map
var gameObjects = [];
//TODO create gameObject map array

//Sprites that need to be accessed by name
var player = null;
var enemy = null;
var platform = null;
var box = null;
var hudMessage = null;
var hudDisplay = null;

//The size of each "tile"
var SIZE = 70;
var SCALE = 2;

//The number of rows and columns
var ROWS = null;
var COLUMNS = null;

//Arrays to store the game objects
var assetsToLoad = [];
var assetsLoaded = 0;

var solids = [];
var objects = [];
var enemies = [];

var sprites = [];
var messages = [];
assetsToLoad.push(sprites,messages,solids,objects,enemies);

//Game sates
var LOADING = 0;
var BUILD_MAP = 1;
var PLAYING = 2;
var OVER = 3;
var gameState = LOADING;

//Directions
var moveUp = false;
var moveDown = false;
var moveRight = false;
var moveLeft = false;

//Tilesheet stuff for later
var playerSheet = new Image();
playerSheet.src = "/resources/avatar.png";
playerSheet.spriteWidth = 50;
playerSheet.spriteHeight = 70;
//assetsToLoad.push(playerSheet);

var spritesheet = new Image();
//image.addEventListener("load", loadHandler, false);
spritesheet.src = "/resources/spritesheet.png";
spritesheet.spriteWidth = 70;
spritesheet.spriteHeight = 70;
assetsToLoad.push(spritesheet);



//Vars for debugging purposes
//Execution time for startup

//Add keyboard listeners
window.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
        case keycode.UP:
        case keycode.W:
        case keycode.SPACE:
            moveUp = true;
            break;

        case keycode.DOWN:
        case keycode.S:
            moveDown = true;
            break;

        case keycode.LEFT:
        case keycode.A:
            moveLeft = true;
            break;

        case keycode.RIGHT:
        case keycode.D:
            moveRight = true;
            break;
        case keycode.R:
            window.cancelAnimationFrame(animFrame);
            //Whatever to recreate the Level
            break;
    }
}, false);

window.addEventListener("keyup", function (event) {
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
            moveRight = false;
            break;
    }
}, false);

update();

/**
 *  Updates the game state. The bread and butter? Infinite loop.
 */
function update() {
    //The animation loop
    utils.requestAnimationFrame(update, canvas);

    switch (gameState) {
        case LOADING:
            console.log("Starting up game...");
            //TODO Add title screen here.
            loadHandler();
            break;

        case BUILD_MAP:
            //buildMap(mapObjects);
            //buildMap(gameObjects);
            createObjects(); //AKA Startlevel()
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
    assetsLoaded++;
    console.time("Resources loaded");
    if (assetsLoaded === assetsToLoad.length) {
        image.removeEventListener("load", loadHandler, false);
        console.timeEnd("Resources loaded");
        gameState = BUILD_MAP;
        console.log("Game loaded: " + assetsLoaded + " assets.")
    }

}


/**
 *  Builds the map, placing platforms, enemies and the player.
 * @param Level The level for which objects will be positioned to.
 */
function buildMap(Level) {
    switch (lvl) {
        case 1:
            player.x = 200;
            player.y = 200;

            objects[0].x = 400;
            objects[0].y = 150;

            enemies[0].x = enemies[0].linkedObject.x + enemies[0].radius;
            enemies[0].y = enemies[0].linkedObject.y;

            theTarget.x = c.width / 5 * 3;
            theTarget.y = c.height - 50;

            //TODO add platform positions
            break;
    }
}

/**
 * Creates Objects. Mostly messages.
 */
function createObjects() {

    //Creating Box object
    box = Object.create(boxObject(SIZE/SCALE,SIZE/SCALE,"#0000ff"));
    box.friction = 0.94;
    box.src = spritesheet;
    box.sourceY = 4 * SIZE;
    sprites.push(box);

    //Creating first enemy
    enemy = new Object.create(boxObject(SIZE/SCALE, SIZE/SCALE,"#ff00ff"));
    enemy.linkedObject = box;

    //Creating Border
    solids[0] = Object.create(box(c.width/5*3,50,"#00ff00"));
    solids[0].y = c.height - solids[0].height;
    solids[0 ].src = spritesheet;
    solids[0 ].sourceWidth = spritesheet.spriteWidth*3;

    //Create the display for the HUD
    hudDisplay = Object.create(spriteObject);
    hudDisplay.sourceX = 0;
    hudDisplay.sourceY = 10;
    hudDisplay.sourceWidth = 316;
    hudDisplay.sourceHeight = 290;
    hudDisplay.width = 200;
    hudDisplay.height = 200;
    hudDisplay.x = canvas.width / 2 - hudDisplay.width / 2;
    hudDisplay.y = canvas.height / 2 - hudDisplay.height / 2;
    hudDisplay.visible = false;
    sprites.push(hudDisplay);
    console.log("Created: " + sprites.length + " sprites");


    //Create Hud Message
    hudMessage = Object.create(messageObject(canvas.width/2,30));
    hudMessage.font = "bold 30px Helvetica";
    hudMessage.fillStyle = "black";
    hudMessage.textAlign = "center";
    messages.push(hudMessage);
    console.log("Created: " + messages.length + " messages");

}

/**
 * The main game's "engine". Handles all the player input and physics.
 */
function playGame() {

    //Checks collision between PLAYER -> GROUND
    //noinspection JSDuplicatedDeclaration
    for (var i = 0; i < solids.length; i++) {
        solids[i].draw();
        if (checkCollision(player, solids[i], true) === "bottom"){
            player.isOnGround = true;
        }
    }

    //Checks collision between BOX -> PLAYER, GROUND, TARGET
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

    //Checks collision between ENEMY -> PLAYER
    //noinspection JSDuplicatedDeclaration
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].move();
        enemies[i].draw();

        if (checkCollision(enemies[i], player)) {
            window.cancelAnimationFrame(animFrame);
            console.log("Game over.");
            //startLevel();
            //TODO Restart Game
        }
    }
    //Draw Target frame
    //Draw target
    //Draw Player

}

/**
 * Refresh the screen and redraws the sprites.
 */
function render() {
    //Redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Display the sprites
    if (sprites.length !== 0) {
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[ i ];
            if (sprite.visible) {
                ctx.drawImage
                (
                    image,
                    sprite.sourceX, sprite.sourceY,
                    sprite.sourceWidth, sprite.sourceHeight,
                    Math.floor(sprite.x), Math.floor(sprite.y),
                    sprite.width, sprite.height
                );
            }
        }
    }

    //Display the game messages
    if (messages.length !== 0) {
        for (var j = 0; j < messages.length; j++) {
            var message = messages[ j ];
            if (message.visible) {
                ctx.font = message.font;
                ctx.fillStyle = message.fillStyle;
                ctx.textAlign = message.textAlign;
                ctx.textBaseline = message.textBaseline;
                ctx.fillText(message.text, message.x, message.y);
            }
        }
    }

}

function startLevel(){
    defineMoveMethods(player, objects[0], enemies[0]);

    solids[0] = new Box(c.width / 5 * 3, 50, "#00ff00");
    solids[0].y = c.height - solids[0].height;
    solids[0].src = thingSheet;
    solids[0].sourceWidth = thingSheet.spriteWidth * 3;
    solids[1] = Object.create(solids[0]);
    solids[1].width = solids[1].width / 3 + (c.width / 5 - thingSheet.spriteWidth);
    solids[1].x = solids[0].width + thingSheet.spriteWidth;
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