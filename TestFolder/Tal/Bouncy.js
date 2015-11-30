ctx.font = "32px Ariel"; //Font used

window.onload = function () {
    var c = document.getElementById("ctx"),
        ctx = c.getContext("2d"),
    //Create 3 balls. 2 with colour #ff00ff and 1 default colour. Also 1 array.
        X1 = new Ball(null,"#ff00ff"),
        I1 = new Ball(null,"#ff00ff"),
        numBalls = 3,
        bounce = -1.0,
        human = new Ball(),
        objectsToDraw = [];

    //Giving value to the human variables
    human.mass = 1.5;
    human.x = 50;
    human.y = 50;
    human.vx = Math.random() * 6 - 4;

    //Giving values to the x1 variables (These are the enemies)
    X1.mass = 1;
    X1.x = 100;
    X1.y = 100;
    X1.vx = Math.random() * 6 - 5;

    //Giving values to the I1 variables (These too are the enemies)
    I1.mass = 1;
    I1.x = 100;
    I1.y = 150;
    I1.vx = Math.random() * 6 - 5;

    objectsToDraw.push(X1,I1,human);


    function checkCollision (ball0, ball1) {
        var dx = ball1.x - ball0.x,
            dy = ball1.y - ball0.y,
            dist = Math.sqrt(dx * dx + dy * dy);
        //collision handling code here
        if (dist < ball0.radius + ball1.radius) {
            //calculate angle, sine, and cosine
            var angle = Math.atan2(dy, dx),
                sin = Math.sin(angle),
                cos = Math.cos(angle),
            //rotate ball0's position
                pos0 = {x: 0, y: 0}, //point
            //rotate ball1's position
                pos1 = rotate(dx, dy, sin, cos, true),
            //rotate ball0's velocity
                vel0 = rotate(ball0.vx, ball0.vy, sin, cos, true),
            //rotate ball1's velocity
                vel1 = rotate(ball1.vx, ball1.vy, sin, cos, true),
            //collision reaction
                vxTotal = vel0.x - vel1.x;
            vel0.x = ((ball0.mass - ball1.mass) * vel0.x + 2 * ball1.mass * vel1.x) /
                (ball0.mass + ball1.mass);
            vel1.x = vxTotal + vel0.x;
            //update position - to avoid objects becoming stuck together
            var absV = Math.abs(vel0.x) + Math.abs(vel1.x),
                overlap = (ball0.radius + ball1.radius) - Math.abs(pos0.x - pos1.x);
            pos0.x += vel0.x / absV * overlap;
            pos1.x += vel1.x / absV * overlap;
            //rotate positions back
            var pos0F = rotate(pos0.x, pos0.y, sin, cos, false),
                pos1F = rotate(pos1.x, pos1.y, sin, cos, false);
            //adjust positions to actual screen positions
            ball1.x = ball0.x + pos1F.x;
            ball1.y = ball0.y + pos1F.y;
            ball0.x = ball0.x + pos0F.x;
            ball0.y = ball0.y + pos0F.y;
            //rotate velocities back
            var vel0F = rotate(vel0.x, vel0.y, sin, cos, false),
                vel1F = rotate(vel1.x, vel1.y, sin, cos, false);
            ball0.vx = vel0F.x;
            ball0.vy = vel0F.y;
            ball1.vx = vel1F.x;
            ball1.vy = vel1F.y;
        }
    }
    function rotate (x, y, sin, cos, reverse) {
        return {
            x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
            y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
        };
    }
    function move (ball){
        ball.x += ball.vx;
        ball.y += ball.vy;
        checkWalls(ball);
    }
    function checkWalls(ball){
        if (ball.x + ball.radius > c.width) {
            ball.x = c.width - ball.radius;
            ball.vx *= bounce;
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx *= bounce;
        }
        if (ball.y + ball.radius > c.height) {
            ball.y = c.height - ball.radius;
            ball.vy *= bounce;
        } else if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy *= bounce;
        }
    }
    function draw (ball) {
        ball.draw(ctx);
    }


    (function drawFrame () {
        window.requestAnimationFrame(drawFrame, c);
        ctx.clearRect(0,0,c.width, c.height);

        objectsToDraw.forEach(move);

        for(var ballA, i = 0, len = numBalls - 1; i < len; i++){
            ballA = objectsToDraw[i];
            for(var ballB, j = i + 1; j < numBalls; j++ ){
                ballB = objectsToDraw[j];
                checkCollision(ballA,ballB);
            }
        }
        objectsToDraw.forEach(draw);
    }());
};
//running();