/**
 * Created by Marik on 14/12/2015.
 */
function titleScreen() {
    var background = new Box(c.width, c.height),
        mouse = utils.captureMouse(c),
        buttonPlay = new Box(66, 70, "green"),
        buttonInstr = new Box(66, 70, "red"),
        buttonCred = new Box(66, 70, "blue"),
        buttonBack = new Box(66, 70, "cyan");

    c.addEventListener("click", clickHandler, false);

    background.src = titleBackground;
    background.sourceHeight = background.src.height;
    background.sourceWidth = background.src.width;
    background.draw();

    buttonPlay.x = 181;
    buttonPlay.y = 160;

    buttonInstr.x = 181;
    buttonInstr.y = 265;

    buttonCred.x = 181;
    buttonCred.y = 335;

    buttonBack.x = c.width - buttonBack.width;
    buttonBack.y = c.height - buttonBack.height;

    switch (titleState) {
        case TITLE:
            buttonPlay.draw();
            buttonInstr.draw();
            buttonCred.draw();
            break;
        case INSTR:
            buttonBack.draw();
            break;
        case CREDITS:
            buttonBack.draw();
            break;
    }

    function clickHandler() {
        if (utils.containsPoint(buttonPlay, mouse.x, mouse.y)) {
            c.removeEventListener("click", clickHandler, false);
            gameState = BUILD_MAP;
        } else if (utils.containsPoint(buttonInstr, mouse.x, mouse.y)) {
            titleState = INSTR;
        } else if (utils.containsPoint(buttonCred, mouse.x, mouse.y)) {
            titleState = CREDITS;
        } else if (utils.containsPoint(buttonBack, mouse.x, mouse.y)) {
            titleState = TITLE;
        }
    }
}