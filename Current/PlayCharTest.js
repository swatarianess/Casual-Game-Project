//MB
var lvl = 1,
    c = document.getElementById("PlayChar"),
    ctx = c.getContext("2d"),
    solids = [],
    objects = [],
    enemies = [],
    playerSheet = new Image(),
    thingSheet = new Image(),
    titleBackground = new Image(),
    SCALE = 0.5,
    TITLE = 0,
    BUILD_MAP = 1,
    PLAYING = 2,
    OVER = 3,
    WON = 4,
    DONE = 5,
    gameState = TITLE,
    LVL_AMOUNT = 2,
    INSTR = 1,
    CREDITS = 2,
    titleState = TITLE;

//Player Stylesheet
playerSheet.src = "resources/Sheet.png";
playerSheet.spriteWidth = 50;
playerSheet.spriteHeight = 70;

//Game stylesheet, contains: Platforms + enemies
thingSheet.src = "resources/Stuff Sheet.png";
thingSheet.spriteWidth = 70;
thingSheet.spriteHeight = 70;
titleBackground.src = "resources/TitleScreenBackgroundTemp.png";

//Create Objects
var player = new Box(playerSheet.spriteWidth * SCALE, playerSheet.spriteHeight * SCALE),
    theGoal = new Box(thingSheet.spriteWidth, 50),
    box = new Box(70 * SCALE, 70 * SCALE),
    enemyCircle = new Box(70 * SCALE, 70 * SCALE),
    enemyPlatform = new Box(70 * SCALE, 70 * SCALE),
    platform = new Box(70 * 3 * SCALE, 70 * SCALE);

defineMoveMethods(player, box, enemyCircle, enemyPlatform);

//Setting player field's values
player.jumpForce = -9;
player.src = playerSheet;
player.sourceHeight = 70;
player.sourceWidth = 50;
player.WALKING = 0;
player.STANDING = 1;
player.JUMPING = 2;
player.RIGHT = 0;
player.LEFT = 1;
player.currentFrame = 0;
player.numberOfFrames = 3;

//Setting theGoal field's values
theGoal.src = goalCanvas;
theGoal.sourceHeight = goalCanvas.height;
theGoal.sourceWidth = goalCanvas.width;

//Setting box field's values

box.friction = 0.94;
box.src = thingSheet;
box.sourceY = 4 * 70;

//Setting enemyCircle field's values
enemyCircle.radius = 100;
enemyCircle.frame = 0;
enemyCircle.src = thingSheet;
enemyCircle.sourceX = 70;
enemyCircle.sourceY = 4 * 70;

//Setting enemyPlatform field's values
enemyPlatform.RIGHT = 0;
enemyPlatform.DOWN = 1;
enemyPlatform.LEFT = 2;
enemyPlatform.RIGHT = 3;
enemyPlatform.direction = enemyPlatform.RIGHT;
enemyPlatform.speed = 2.5;
enemyPlatform.src = thingSheet;
enemyPlatform.sourceX = 70;
enemyPlatform.sourceY = 4 * 70;

//Setting platform field's values
platform.src = thingSheet;
platform.sourceWidth = thingSheet.spriteWidth * 3;

//Creating border objects
solids[0] = new Box(c.width / 5 * 3, 50, "#00ff00");
solids[0].src = thingSheet;
solids[0].sourceWidth = thingSheet.spriteWidth * 3;
solids[0].y = c.height - solids[0].height;
solids[1] = Object.create(solids[0]);
solids[1].width = solids[1].width / 3 + (c.width / 5 - thingSheet.spriteWidth);
solids[1].x = solids[0].width + thingSheet.spriteWidth;
solids[2] = new Box(c.width, 50, "#00ff00");
solids[3] = new Box(50, c.height - 50, "#00ff00");
solids[4] = new Box(50, c.height - 50, "#00ff00");
solids[4].x = c.width - solids[3].width;

/**
 * Sets the players move properties to true when the relevant buttons are pressed. Also resets the level when R is pressed.
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
            gameState = OVER;
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

window.onload = function() {
    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);

    update();
};

function update() {
    window.requestAnimationFrame(update);

    switch (gameState) {
        case TITLE:
            lvl = 1;
            titleScreen();
            break;
        case BUILD_MAP:
            startLevel();
            break;
        case PLAYING:
            drawFrame();
            break;
        case OVER:
            gameOver();
            break;
        case WON:
            lvl++;
            wonLevel(lvl > LVL_AMOUNT);
            break;
        case DONE:
            gameWon();
            break;
    }
}

/**
 * Moves all objects and draws them.
 */
function drawFrame() {
    ctx.clearRect(0, 0, c.width, c.height);
    player.move();
    //noinspection JSDuplicatedDeclaration
    for (var i = 0; i < solids.length; i++) {
        solids[i].draw();
        if (checkCollision(player, solids[i], true) === "bottom"){
            player.isOnGround = true;
            player.state = player.STANDING;
        }
    }
    //noinspection JSDuplicatedDeclaration
    for (var i = 0; i < objects.length; i++) {
        objects[i].move();
        checkCollision(objects[i], player, true);
        //noinspection JSDuplicatedDeclaration
        for (var j = 0; j < solids.length; j++) {
            checkCollision(objects[i], solids[j], true);
        }
        //noinspection JSDuplicatedDeclaration
        for (var j = 0; j < objects.length; j++) {
            if (j !== i) {
                checkCollision(objects[i], objects[j], true);
            }
        }
        if (checkCollision(player, objects[i], true) === "bottom") {
            player.isOnGround = true;
            player.state = player.STANDING;
        }
        if (checkCollision(theGoal, objects[i]) && objects[i].y >= theGoal.y + theGoal.height - 5) {
            console.log("You win.");
            objects.splice(i, 1);
            if (objects.length === 0) {
                gameState = WON;
            }
        } else {
            objects[i].draw();
        }

    }
    //noinspection JSDuplicatedDeclaration
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].move();
        enemies[i].draw();

        if (checkCollision(enemies[i], player)) {
            console.log("Game over.");
            gameState = OVER;
        }
    }
    drawGoalFrame();
    theGoal.draw();
    player.draw();
}

/**
 * Starts the level. Can be called to reset the level as well.
 */
function startLevel() {
    player.state = player.JUMPING;
    player.facing = player.RIGHT;
    player.jump = false;
    player.moveLeft = false;
    player.moveRight = false;
    player.isOnGround = undefined;
    player.ax = 0;
    player.ay = 0;
    player.vx = 0;
    player.vy = 0;

    buildLevel();
    gameState = PLAYING;
}

function gameOver() {
    solids.splice(5, solids.length);
    enemies = [];
    objects = [];
    gameState = BUILD_MAP;
}

function wonLevel(endgame) {
    solids.splice(5, solids.length);
    enemies = [];
    objects = [];
    if (endgame) {
        gameState = DONE;
    } else {
        gameState = BUILD_MAP;
    }
}

function gameWon() {
    solids.splice(5, solids.length);
    enemies = [];
    objects = [];
    alert("Congraturation! You beat the game!");
    gameState = TITLE;
}

function assignEquation(arry,lvl,diff,ans){
    //Array full of "incorrect" boxes
    var badBoxes = [];

    //Iterate through the array
    for(var i =0;i<arry.length;i++){
        //Check if the box is correct?
        if(arry[i].correct){
            //Assign Equation
            arry[i].equation = genEq(diff,lvl,ans);
        } else {
            //Adds Equation and adds element to badBoxes[].
            arry[i].equation = genEq(diff,lvl,ans);
            badBoxes.push(arry[i]);
        }
    }
    //Returns array of the badBoxes[]
   // if(ret){return badBoxes;}
}
