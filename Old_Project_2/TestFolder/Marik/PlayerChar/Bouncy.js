/**
 * Created by MB on 06/12/2015.
 */
window.onload = function () {
    var c = document.getElementById("ctx"),
        ctx = c.getContext("2d"),
    //Create 3 boxs. 2 with colour #ff00ff and 1 default colour. Also 1 array.
        X1 = new Box(30, 30, "#00ff00"),
        I1 = new Box(30, 30, "#00ff00"),
        numBoxes = 3,
        bounce = -1,
        human = new Box(40, 50, "#0000ff"),
        enemies = [];
    objectsToDraw = [];

    //Giving value to the human variables
    human.x = 50;
    human.y = 50;
    human.vx = Math.random() * 6 - 5;
    human.vy = Math.random() * 3 - 4;

    //Giving values to the x1 variables (These are the enemies)
    X1.x = 50;
    X1.y = 200;
    X1.vx = Math.random() * 6 - 5;
    X1.vy = Math.random() * 3 - 4;


    //Giving values to the I1 variables (These too are the enemies)
    I1.x = 50;
    I1.y = 450;
    I1.vx = Math.random() * 6 - 5;
    I1.vy = Math.random() * 3 - 4;

    enemies.push(X1, I1);
    objectsToDraw.push(X1, I1, human);

    function move(box) {
        if (box.ax || box.ay) {
            box.vx += box.ax;
            box.vy += box.ay;
        }
        box.x += box.vx;
        box.y += box.vy;
        checkWalls(box);
    }

    function checkWalls(box) {
        if (box.x + box.height > c.width) {
            box.x = c.width - box.height;
            box.vx *= bounce;
        } else if (box.x < 0) {
            box.x = 0;
            box.vx *= bounce;
        }
        if (box.y + box.height > c.height) {
            box.y = c.height - box.height;
            box.vy *= bounce;
        } else if (box.y < 0) {
            box.y = 0;
            box.vy *= bounce;
        }
    }

    (function drawFrame() {
        window.requestAnimationFrame(drawFrame, c);
        ctx.clearRect(0, 0, c.width, c.height);


        move(human);
        for (var i = 0; i < enemies.length; i++) {
            move(enemies[i]);
            var side = checkCollision(human, enemies[i], true);
            if (side === "top" || side === "bottom") {
                human.vy *= bounce;
                enemies[i].vy *= bounce;
            } else if (side === "right" || side === "left") {
                human.vx *= bounce;
                enemies[i].vx *= bounce;
            }
        }
//        for (var boxA, i = 0, len = numBoxes - 2; i < len; i++){
//            boxA = objectsToDraw[i];
//            var boxB = objectsToDraw[i + 1],
//                side = checkCollision(boxA, boxB, true);
//            if (side === "top" || side === "bottom") {
//                enemies
//            }
//            if (checkCollision(boxA, boxB)) {
//                var vx = boxA.centerX() - boxB.centerX(),
//                    vy = boxA.centerY() - boxB.centerY(),

//                    combinedHalfWidths = boxA.halfWidth() + boxB.halfWidth(),
//                    combinedHalfHeights = boxA.halfHeight() + boxB.halfHeight(),

//                    overlapX = combinedHalfWidths - Math.abs(vx),
//                    overlapY = combinedHalfHeights - Math.abs(vy);

//                if (overlapX >= overlapY) {
//                    boxA.vy *= bounce;
//                    boxB.vy *= bounce;
//                } else {
//                    boxA.vx *= bounce;
//                    bocB.vx *= bounce;
//                }
//            }
//        }
        for (var i = 0; i < objectsToDraw.length; i++) {
            objectsToDraw[i].draw(ctx);
        }
    }());
};
//running();