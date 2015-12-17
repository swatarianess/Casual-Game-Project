/**
 * Created by Marik on 11/12/2015.
 */
function buildLevel() {
    switch (lvl) {
        case 1:
            player.x = 200;
            player.y = 200;

            objects[0] = Object.create(box);
            objects[0].x = 400;
            objects[0].y = 150;

            enemies[0] = Object.create(enemyCircle);
            enemies[0].linkedObject = objects[0];

            theGoal.x = c.width / 5 * 3;
            theGoal.y = c.height - 50;
            break;
        case 2:
            player.x = 200;
            player.y = 200;

            objects[0] = Object.create(box);
            objects[0].x = 400;
            objects[0].y = 150;

            objects[1] = Object.create(box);
            objects[1].x = 500;
            objects[1].y = 150;

            solids[5] = Object.create(platform);
            solids[5].x = 400;
            solids[5].y = 75;

            enemies[0] = Object.create(enemyCircle);
            enemies[0].linkedObject = objects[0];

            enemies[1] = Object.create(enemyPlatform);
            enemies[1].linkedObject = solids[5];

            theGoal.x = c.width / 5 * 3;
            theGoal.y = c.height - 50;
            break;
    }
}