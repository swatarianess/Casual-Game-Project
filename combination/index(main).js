//Canvas
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

//The game map, Not a proper tested one.
var mapObjects = [];
//TODO create game map array properly

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

//The number of rows and columns in the sprite-sheet(s)
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
var TITLE_SCREEN = 2;
var PLAYING = 3;
var OVER = 4;
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
 *  Main Game loop.
 */
function update() {
    //The animation loop
    utils.requestAnimationFrame(update, canvas);

    switch (gameState) {
        case LOADING:
            console.log("Starting up game...");
            loadHandler();
            break;

        case BUILD_MAP:
            //buildMap(mapObjects);
            //buildMap(gameObjects);
            createObjects(); //AKA Startlevel()
            gameState = PLAYING;
            break;

        case TITLE_SCREEN:
            break;

        case PLAYING:
            playGame();
            break;

        case OVER:
            //TODO Add message saying game over
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
 * Creates Objects. Mostly messages.
 */
function createObjects() {

    //-----------------------------CREATING OBJECTS-------------------------------------\\
    box = Object.create(boxObject(SIZE/SCALE,SIZE/SCALE,"#0000ff"));

    //Creating borders + Floor
    solids[0] = Object.create(box(c.width/5*3,50,"#00ff00"));
    solids[1] = Object.create(box(c.width/5*3,50,"#00ff00"));
    solids[2] = Object.create(box(c.width, 50, "#00ff00"));
    solids[3] = Object.create(box(50, c.height - 50, "#00ff00"));
    solids[4] = Object.create(box(50, c.height - 50, "#00ff00"));

    //Creating enemy
    enemy = new Object.create(boxObject(SIZE/SCALE, SIZE/SCALE,"#ff00ff"));

    //----------------------------------------------------------------------------------||

    defineMoveMethods(player,objects[0],enemies[0]);

    //Setting Box object fields
    box.friction = 0.94;
    box.src = spritesheet;
    box.sourceY = 4 * SIZE;

    //Setting enemy fields
    enemy.linkedObject = box;

    //Setting Border fields
    solids[0].y = c.height - solids[0].height;
    solids[0].src = spritesheet;
    solids[0].sourceWidth = spritesheet.spriteWidth*3;

    solids[1].width = solids[1].width/3+(c.width/5 - spritesheet.spriteWidth);
    solids[1].x = solids[0 ].width + spritesheet.spriteWidth;

    solids[4].x = c.width - solids[3].width;

    //Add all the objects to the array which we draw everything in. May not use.
    //sprites.push(box,enemy,solids[0],solids[1],solids[2],solids[3],solids[4]);

    //---------------------------CREATING-OTHER-OBJECTS---------------------------------||

    //Create the Target
    theTarget.src= targetCanvas;
    theTarget.sourceHeight = targetCanvas.height;
    theTarget.sourceWidth = targetCanvas.width;

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

    buildLevel(); //Sets the Position of the sprites

}

/**
 * The main game's "engine". Handles all the player input and physics.
 */
function playGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.move();

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
            gameState = BUILD_MAP; // Recreates the objects and goes through the loop "flow". Waterfall?
            //startLevel();
        }
    }

    //Draw Target frame
    //Draw target
    //Draw Player
    //TODO Make render draw out all the sprites OR Update?
}

/**
 * Draws the objects onto the screen.
 */
function render() {
    //Redrawing!
    //animFrame = window.requestAnimationFrame(render) //No need to loop within loop

    if (sprites.length !== 0) {
        //noinspection JSDuplicatedDeclaration
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
        //noinspection JSDuplicatedDeclaration
        for (var i = 0; i < messages.length; i++) {
            var message = messages[ i ];
            if (message.visible) {
                ctx.font = message.font;
                ctx.fillStyle = message.fillStyle;
                ctx.textAlign = message.textAlign;
                ctx.textBaseline = message.textBaseline;
                ctx.fillText(message.text, message.x, message.y);
            }
        }
    }
    drawTargetFrame();
    theTarget.draw();
    player.draw();

}
