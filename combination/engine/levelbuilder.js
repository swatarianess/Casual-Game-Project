/**
 * Created by Marik on 11/12/2015.
 */
/*var c = null; //Canvas
var enemies = []; //Enemy Array
var objects = []; //Objects Array
var lvl = 0; //Level variable*/

/**
 * Builds the level.
 */
function buildLevel() {
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
            break;
    }
}