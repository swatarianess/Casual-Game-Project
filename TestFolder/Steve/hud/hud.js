(function () {
//Canvas
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");

//The game map, Not a proper tested one.
    var mapObjects = [];
    //TODO create game map array properly

//The game objects map
    var gameObjects = [];
    //TODO create gameObject map array

//Coords
    var platformBottom = [
        [ 5, 501 ], [ 40, 501 ],
        [ 75, 501 ], [ 110, 501 ],
        [ 145, 501 ], [ 180, 501 ],
        [ 215, 501 ], [ 250, 501 ],
        [ 285, 501 ], [ 320, 501 ],
        [ 355, 501 ], [ 390, 501 ],
        [ 425, 501 ]];

    var platformMiddle_Row1 = [
        [ 355, 421 ], [ 390, 421 ],
        [ 425, 421 ], [ 460, 421 ],
        [ 495, 421 ], [ 530, 421 ],
        [ 565, 421 ], [ 600, 421 ],
        [ 635, 421 ]];

    var platformLeft_Row2 = [
        [ 5, 306 ], [ 40, 306 ],
        [ 75, 306 ], [ 110, 306 ],
        [ 145, 306 ],[ 180, 306 ],
        [ 215, 306 ],[ 250, 306 ],
        [ 285, 306 ],[ 320, 306 ]];

    var platformRight_Row2 = [
        [ 670, 306 ], [ 705, 306 ],
        [ 740, 306 ], [ 775, 306 ],
        [ 810, 306 ], [ 845, 306 ],
        [ 880, 306 ], [ 915, 306 ],
        [ 950, 306 ], [ 985, 306 ]];

    var platformMiddle_Row3 = [
        [ 320, 191 ], [ 355, 191 ],
        [ 390, 191 ], [ 425, 191 ],
        [ 460, 191 ], [ 495, 191 ],
        [ 530, 191 ], [ 565, 191 ],
        [ 600, 191 ], [ 635, 191 ],
        [ 655, 191 ], [ 670, 191 ]];

    var platformLeft_Row3 = [
        [ 5, 191 ], [ 40, 191 ],
        [ 75, 191 ], [ 110, 191 ],
        [ 145, 191 ]];

    var platformRight_Row3 = [
        [ 845, 191 ], [ 880, 191 ],
        [ 915, 191 ], [ 950, 191 ],
        [ 985, 191 ]];

//Map code
    var EMPTY = 0;
    var FLOOR = 1;
    var BOX = 2;
    var WALL = 3;
    var ENEMY = 4;
    var PLAYER = 5;
    //TODO Add more stuff to map code

//Sprites that need to be accessed by name
    var player = null;
    var enemy = null;
    var platform = null;
    var box = null;
    var wall = null;
    var hudMessage = null;
    var hudDisplay = null;

//The size of each "tile"
    var SIZE = 32;

//The number of rows and columns
    var ROWS = mapObjects.length;
    var COLUMNS = null;

//The number of columns on the tilesheet
    var tilesheetColumns = null;
    //TODO find out how many columns the tilesheet has

//Arrays to store the game objects
    var assetsToLoad = [];
    var assetsLoaded = 0;

    var sprites = [];
    var messages = [];
    assetsToLoad.push(sprites,messages);

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
    var image = new Image();
    image.addEventListener("load", loadHandler, false);
    image.src = "../includes/completeSheet.jpg";
    assetsToLoad.push(image);

//Vars for debugging purposes
    //Execution time for startup

//Add keyboard listeners
    window.addEventListener("keydown", function (event) {
        switch (event.keyCode) {
            case keycode.UP:
                moveUp = true;
                break;

            case keycode.DOWN:
                moveDown = true;
                break;

            case keycode.LEFT:
                moveLeft = true;
                break;

            case keycode.RIGHT:
                moveRight = true;
                break;
        }
    }, false);

    window.addEventListener("keyup", function (event) {
        switch (event.keyCode) {
            case keycode.UP:
                moveUp = false;
                break;

            case keycode.DOWN:
                moveDown = false;
                break;

            case keycode.LEFT:
                moveLeft = false;
                break;

            case keycode.RIGHT:
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
        requestAnimationFrame(update, canvas);

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
     *  Builds the map, placing platforms, enemies and the player.
     * @param levelMap An array containing data of the level
     */
    function buildMap(levelMap) {
        for (var row = 0; row < ROWS; row++) {
            for (var column = 0; column < COLUMNS; column++) {
                var currentTile = levelMap[ row ][ column ];

                if (currentTile !== EMPTY) {
                    //Find the tile's x and y position on the tile sheet
                    var tilesheetX = Math.floor((currentTile - 1) % tilesheetColumns) * SIZE;
                    var tilesheetY = Math.floor((currentTile - 1) / tilesheetColumns) * SIZE;

                    switch (currentTile) {
                        case FLOOR:
                            //TODO Create floor objects
                            platform = Object.create(spriteObject);
                            platform.sourceX = tilesheetX;
                            platform.sourceY = tilesheetY;
                            platform.x = column * SIZE;
                            platform.y = row * SIZE;
                            break;

                        case BOX:
                            //TODO Create Box objects
                            box = Object.create(spriteObject);
                            box.sourceX = tilesheetX;
                            box.sourceY = tilesheetY;
                            box.x = column * SIZE;
                            box.y = row * SIZE;
                            break;

                        case WALL:
                            //TODO Create Border objects
                            wall = Object.create(spriteObject);
                            wall.sourceX = tilesheetX;
                            wall.sourceY = tilesheetY;
                            wall.x = column * SIZE;
                            wall.y = row * SIZE;
                            break;

                        case ENEMY:
                            //TODO Create Enemy sprites
                            enemy = Object.create(spriteObject);
                            enemy.sourceX = tilesheetX;
                            enemy.sourceY = tilesheetY;
                            enemy.x = column * SIZE;
                            enemy.y = row * SIZE;
                            break;

                        case PLAYER:
                            //TODO Already defined in the main program, no need to preceed it with var
                            player = Object.create(spriteObject);
                            player.sourceX = tilesheetX;
                            player.sourceY = tilesheetY;
                            player.x = column * SIZE;
                            player.y = row * SIZE;
                            break;

                        default:
                            var sprite = Object.create(spriteObject);
                            sprite.sourceX = tilesheetX;
                            sprite.sourceY = tilesheetY;
                            sprite.x = column * SIZE;
                            sprite.y = row * SIZE;
                            sprites.push(sprite);
                            break;
                    }

                }
            }
        }
    }

    /**
     * Creates Objects. Mostly messages.
     */
    function createObjects() {

        hudDisplay = Object.create(spriteObject);
        hudDisplay.sourceX = 0;
        hudDisplay.sourceY = 10;
        hudDisplay.sourceWidth = 316;
        hudDisplay.sourceHeight = 290;
        hudDisplay.width = 200;
        hudDisplay.height = 200;
        hudDisplay.x = canvas.width / 2 - hudDisplay.width / 2;
        hudDisplay.y = canvas.height / 2 - hudDisplay.height / 2;
        hudDisplay.visible = true;
        sprites.push(hudDisplay);
        console.log("Created: " + sprites.length + " sprites");


        hudMessage = Object.create(messageObject);
        hudMessage.x = canvas.width / 2;
        hudMessage.y = 30;
        hudMessage.font = "bold 30px Helvetica";
        hudMessage.fillStyle = "black";
        hudMessage.textAlign = "center";
        hudMessage.text = "";
        messages.push(hudMessage);
        console.log("Created: " + messages.length + " messages");

    }

    /**
     * The main game's "engine". Handles all the player input and physics.
     */
    function playGame() {
        //Up
        if (moveUp && !moveDown) {
            hudMessage.text = "UP key.";
        }

        //Down
        if (moveDown && !moveUp) {
            hudMessage.text = "Down Key.";
        }

        //Left
        if (moveLeft && !moveRight) {
            hudMessage.text = "Left Key.";
        }

        //Right
        if (moveRight && !moveLeft) {
            hudMessage.text = "Right Key.";

        }
        //TODO Add the collision code here.
        //TODO Add destroyBox() when target and boxObject collide
    }

    /**
     *  This should be called when it reaes the target. As a means of making the box vanish.
     *
     * @param box The boxObject that will be "destroyed".
     */
    function destroyBox(box) {
        //Change the hedgehog's state and update the object
        box.state = box.FINISH;
        box.update();

        //TODO Add a flag to check whether or not it has reached the target?

        //Remove the hedgehog after 500ms
        setTimeout(killBox, 500);

        function killBox() {
            box.visible = false;
        }
    }


    /**
     * Refresh the screen and redraws the sprites.
     */
    function render() {
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

}());