/**
 * Created by MB on 06/12/2015.
 */
function checkCollision(objectA, objectB, side) {
    if (side === true) {
        //Needed to calculate the distance between objects.
        var vx = objectA.centerX() - objectB.centerX(),
            vy = objectA.centerY() - objectB.centerY(),

        //Figure out the combined half-widths and half-heights.
            combinedHalfWidths = objectA.halfWidth() + objectB.halfWidth(),
            combinedHalfHeights = objectA.halfHeight() + objectB.halfHeight(),

            collisionSide = "";

        //Check for a collision on the X-axis.
        if (Math.abs(vx) < combinedHalfWidths) {
            //Check for a collision on the Y-axis.
            if (Math.abs(vy) < combinedHalfHeights) {
                //Collision. Finding out the extent of the overlaps on both axes.
                var overlapX = combinedHalfWidths - Math.abs(vx),
                    overlapY = combinedHalfHeights - Math.abs(vy);

                //Collision has occurred on axis with smallest overlap.
                if (overlapX >= overlapY) {
                    objectA.vy = objectB.vy;
                    //Collision on top or bottom?
                    if (vy > 0) {
                        //Collision on top of A. Move A.
                        objectA.y += overlapY;

                        collisionSide = "top";
                    } else {
                        //Collision on bottom of A. Move A.
                        objectA.y -= overlapY;

                        collisionSide = "bottom";
                    }
                } else {
                    objectA.vx = objectB.vx;
                    //Collision on right or left?
                    if (vx > 0) {
                        //Collision on left of A. Move A.
                        objectA.x += overlapX;

                        collisionSide = "left";
                    } else {
                        //Collision on right of A. Move A.
                        objectA.x -= overlapX;

                        collisionSide = "right";
                    }
                }
                return collisionSide;
            }
        }
        return collisionSide;
    } else {
        return !(objectA.x + objectA.width < objectB.x ||
        objectB.x + objectB.width < objectA.x ||
        objectA.y + objectA.height < objectB.y ||
        objectB.y + objectB.height < objectA.y);
    }
}