/**
 * Created by Marik on 11/12/2015.
 */
/**
 * Builds the level.
 */
function buildLevel(lvl) {
    switch (lvl) {
        case 1:
            player.x = 200;
            player.y = 200;

            objects[0].x = 400;
            objects[0].y = 150;

            enemies[0].x = enemies[0].linkedObject.x + enemies[0].radius;
            enemies[0].y = enemies[0].linkedObject.y;

            theTarget.x = canvas.width / 5 * 3;
            theTarget.y = canvas.height - 50;
            break;
    }
}