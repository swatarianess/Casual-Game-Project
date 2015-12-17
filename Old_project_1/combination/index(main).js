//Canvas
var canvas = document.getElementById("canvas");
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
var theTarget = null;

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

//Frame var
var gameFrame;

//Tilesheet stuff for later
var playerSheet = new Image();
playerSheet.src = "../combination/resources/avatar.png";
playerSheet.spriteWidth = 50;
playerSheet.spriteHeight = 70;
assetsToLoad.push(playerSheet);

var spritesheet = new Image();
//image.addEventListener("load", loadHandler, false);
spritesheet.src = "../combination/resources/spritesheet.png";
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
            window.cancelAnimationFrame(gameFrame);
            //Whatever to recreate the Level
            gameState = BUILD_MAP;
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
    requestAnimationFrame(update, canvas);


    switch (gameState) {
        case LOADING:
            console.log("Starting up game...");
            loadHandler();
            break;

        case BUILD_MAP:
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
    /*assetsLoaded++;
    console.time("Resources loaded");
    if (assetsLoaded === assetsToLoad.length) {
        image.removeEventListener("load", loadHandler, false);
        console.timeEnd("Resources loaded");
        gameState = BUILD_MAP;
        console.log("Game loaded: " + assetsLoaded + " assets.")
    }*/
    gameState = BUILD_MAP;
}

/**
 * Creates Objects. Mostly messages.
 */
function createObjects() {

    //-----------------------------CREATING OBJECTS-------------------------------------\\
    box = new BoxObject(SIZE/SCALE,SIZE/SCALE,"#0000ff");
    objects[0] = box; //Add box to objects array

    player = new BoxObject(playerSheet.spriteWidth / SCALE,playerSheet.spriteHeight / SCALE, "#ff0000");

    //Create target
    theTarget = new BoxObject(spritesheet.spriteWidth, 50);

    //Creating borders + Floor
    solids[0] = new BoxObject(canvas.width/5*3,50,"#00ff00");
    solids[1] = new BoxObject(canvas.width/5*3,50,"#00ff00");
    solids[2] = new BoxObject(canvas.width, 50, "#00ff00");
    solids[3] = new BoxObject(50, canvas.height - 50, "#00ff00");
    solids[4] = new BoxObject(50, canvas.height - 50, "#00ff00");

    //Creating enemy
    enemy = new BoxObject(SIZE/SCALE, SIZE/SCALE,"#ff00ff");
    enemies[0] = enemy;
    //----------------------------------------------------------------------------------||

    defineMoveMethods(player,objects[0],enemies[0]);

    //Setting player object values
    player.jumpForce = -9;
    player.src = playerSheet;
    player.sourceHeight = 70;
    player.sourceWidth = 50;
    player.WALKING = 0;
    player.STANDING = 1;
    player.JUMPING = 2;
    player.state = player.STANDING;
    player.RIGHT = 0;
    player.LEFT = 1;
    player.facing = player.RIGHT;
    player.currentFrame = 0;
    player.numberOfFrames = 3;

    //Setting Box object values
    box.friction = 0.94;
    box.src = spritesheet;
    box.sourceY = 4 * SIZE;

    //Setting enemy values
    enemy.linkedObject = box;

    //Setting Border values
    solids[0].y = canvas.height - solids[0].height;
    solids[0].src = spritesheet;
    solids[0].sourceWidth = spritesheet.spriteWidth*3;

    solids[1].width = solids[1].width/3+(canvas.width/5 - spritesheet.spriteWidth);
    solids[1].x = solids[0 ].width + spritesheet.spriteWidth;

    solids[4].x = canvas.width - solids[3].width;

    //Add all the objects to the array which we draw everything in. May not use.
    //sprites.push(box,enemy,solids[0],solids[1],solids[2],solids[3],solids[4]);

    //---------------------------CREATING-OTHER-OBJECTS---------------------------------||

    //Create the Target
    theTarget.src = targetCanvas;
    theTarget.sourceHeight = targetCanvas.height;
    theTarget.sourceWidth = targetCanvas.width;

    //Create the display for the HUD
    hudDisplay = Object.create(BoxObject);
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
    /*hudMessage = Object.create(MessageObject);
    hudMessage.font = "bold 30px Helvetica";
    hudMessage.fillStyle = "black";
    hudMessage.textAlign = "center";
    messages.push(hudMessage);
    console.log("Created: " + messages.length + " messages");*/

    buildLevel(1); //Sets the Position of the sprites

}

/**
 * The main game's "engine". Handles all the player input and physics.
 */
function playGame() {
    //gameFrame = window.requestAnimationFrame(update);
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
        if (checkCollision(theTarget, objects[i]) && objects[i].y >= canvas.height - 5) {
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
            window.cancelAnimationFrame(gameFrame);
            console.log("Game over.");
            gameState = OVER; // Recreates the objects and goes through the loop "flow". Waterfall?
            //startLevel();
        }
    }

    //Draw Target frame
    //Draw target
    //Draw Player
    //TODO Check if render drawing after is better than "double" drawing
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
    if(gameState == PLAYING) {
        drawTargetFrame();
        theTarget.draw();
        player.draw();
    }

}
