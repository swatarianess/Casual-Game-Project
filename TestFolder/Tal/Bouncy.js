	var c = document.getElementById("ctx");
	var ctx = document.getElementById("ctx").getContext("2d"); 
	ctx.font = "32px Ariel"; //Font used 
	
	 window.onload = function () {
          X1 = new Ball1(),
          I1 = new Ball1(),
		  human = new Ball();
	  human.mass = 1.5;
      human.x = 60;
      human.y = c.height / 2;
      human.vx = -1;
	  
      X1.mass = 1;
      X1.x = 50;
      X1.y = c.height / 2;
      X1.vx = -1;
      
      I1.mass = 1;
      I1.x = 300;
      I1.y = c.height / 2;
      I1.vx = -1;
	  
      (function drawFrame () {
        window.requestAnimationFrame(drawFrame, c);
        
        X1.x += X1.vx;
        I1.x += I1.vx;
		human.x += human.vx;
        
          X1.y += X1.vx;
          I1.y += I1.vx;
		  human.y += human.vx;
      }());
    };

	//character 
		var players = {
		human: new Ball()
		};
		
		var enemyList = {
		X1: new Ball1(),
		I1: new Ball1()
		};
		
		var bottom = c.height; 
		var right = c.width; 
		
		enemyList.X1.x = c.width / 3;
		enemyList.I1.x = 2 * c.width / 3;
		players.human.x = 3 * c.width / 3;
		enemyList.X1.y = c.height / 3;
		enemyList.I1.y = 2 * c.height / 3;
		players.human.y = 3 * c.height / 3; 
		
		function updateEntity(something){ 
		something.x += something.vx; 
		something.y += something.vy; 
			if(something.x - something.radius < 0){ 
			//console.log('message1'); 
			something.x = something.radius;
			something.vx = - something.vx; 
			
			} else if (something.x + something.radius > right) {
			//	console.log('message2');
				something.x = right - something.radius;
				something.vx = - something.vx
			}
			if(something.y - something.radius < 0){ 
			//console.log('message3'); 
			something.y = something.radius;
			something.vy = - something.vy; 
			} else if (something.y + something.radius > bottom) {
				//console.log('message4');
				something.y = bottom - something.radius;
				something.vy = - something.vy;
			}
		something.draw(ctx);
		} 
		function running(){ 
		window.requestAnimationFrame(running, ctx); 
		ctx.clearRect(0,0,right,bottom); 

			for(var i in enemyList){	
//			X1,I1 
			updateEntity(enemyList[i]); 
			}
			for(var z in players){
				updateEntity(players[z]);
			}
		 
		} 
		
		for(var i in enemyList) {
			enemyList[i].vx = Math.random() * 6 - 5;
			enemyList[i].vy = Math.random() * 6 - 5;
		}
			
		for(var z in players) {
			players[z].vx = Math.random() * 6 - 5;
			players[z].vy = Math.random() * 6 - 5;
		}
		
		window.utils.intersects = function (players, enemyList) {
		return !(players.x + players.width < enemyList.x ||
           enemyList.x + enemyList.width < players.x ||
           players.y + players.height < enemyList.y ||
           enemyList.y + enemyList.height < players.y);
};
		running();