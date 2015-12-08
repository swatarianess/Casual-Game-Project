(function () {
//Canvas
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");

//The game map, Not a proper tested one.
    var map = [];
    //TODO create game map array properly

//The game objects map
    var gameObjects = [];
    //TODO create gameObject map array

//Map code
    var EMPTY = 0;
    var FLOOR = 1;
    var BOX = 2;
    var WALL = 3;
    var ENEMY = 4;
    var PLAYER = 5;
    //TODO Add more stuff to map code

//The size of each "tile"
    var SIZE = 32;

//The number of rows and columns
    var ROWS = map.length;
    var COLUMNS = null;

//The number of columns on the tilesheet
    var tilesheetColumns = null;
    //TODO find out how many columns the tilesheet has

//Sprites
    var hudMessage = null;
    var hudDisplay = null;

//Arrays to store the game objects
    var sprites = [];
    var messages = [];

    var assetsToLoad = [];
    var assetsLoaded = 0;

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
    image.addEventListener("", null, false);
    image.src = "";
    assetsToLoad.push(null);

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

    function checkLoaded() {
        return document.readyState === "complete" || document.readyState === "interactive";
    }

    function loadHandler() {
        if (checkLoaded()) {
            gameState = BUILD_MAP;
            console.log("Game loaded.")
        }
    }

    /**
     *  Builds the map, placing platforms, enemies and the player.
     * @param levelMap An array containing data of the level
     */
    function buildMap(levelMap)
    {
        for (var row = 0; row < ROWS; row++) {
            for (var column = 0; column < COLUMNS; column++) {
                var currentTile = levelMap[row][column];

                if (currentTile !== EMPTY) {
                    //Find the tile's x and y position on the tile sheet
                    var tilesheetX = Math.floor((currentTile - 1) % tilesheetColumns) * SIZE;
                    var tilesheetY = Math.floor((currentTile - 1) / tilesheetColumns) * SIZE;

                    switch (currentTile) {
                        case FLOOR:
                            //TODO Create floor objects
                            break;
                        case BOX:
                            //TODO Create Box objects
                            break;
                        case WALL:
                            //TODO Create Border objects
                            break;
                        case ENEMY:
                            //TODO Create Enemy sprites
                            break;
                        case PLAYER:
                            //TODO Already defined in the main program, no need to preceed it with var
                            break;
                        default:
                            break;
                    }

                }
            }
        }
    }

    /**
     * Creating Objects.
     */
    function createObjects() {

        hudDisplay = Object.create(spriteObject);
        hudDisplay.sourceX = 0;
        hudDisplay.sourceY = 129;
        hudDisplay.sourceWidth = 316;
        hudDisplay.sourceHeight = 290;
        hudDisplay.width = 316;
        hudDisplay.height = 290;
        hudDisplay.x = canvas.width / 2 - hudDisplay.width / 2;
        hudDisplay.y = canvas.height / 2 - hudDisplay.height / 2;
        hudDisplay.visible = true;
        sprites.push(hudDisplay);
        console.log("Loaded: " + sprites.length + " spirits");


        hudMessage = Object.create(messageObject);
        hudMessage.x = 0;
        hudMessage.y = 64;
        hudMessage.font = "bold 30px Helvetica";
        hudMessage.fillStyle = "black";
        hudMessage.text = "";
        messages.push(hudMessage);
        console.log("Loaded: " + messages.length + " messages");

    }

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
            hudMessage.text = "Left Key."
        }

        //Right
        if (moveRight && !moveLeft) {
            hudMessage.text = "Right Key.";
        }
        //TODO Add all the collision code here.
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Display the sprites
        if (sprites.length !== 0) {
            for (var i = 0; i < sprites.length; i++) {
                var sprite = sprites[i];
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
        if (hudMessage !== null) {
            ctx.font = hudMessage.font;
            ctx.fill = hudMessage.fill;
            ctx.fillText(hudMessage.text, hudMessage.x, hudMessage.y);
        }
        //Display the game messages
        /*
         if (messages.length !== 0) {
         for (var j = 0; j < messages.length; j++) {
         var m = messages[i];
         if (m.visible) {
         ctx.font = m.font;
         ctx.fillStyle = m.fillStyle;
         ctx.textBaseline = m.textBaseline;
         ctx.fillText(m.text, m.x, m.y);
         }
         }
         }
         */
    }

}());