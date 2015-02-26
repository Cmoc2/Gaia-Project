var settings, play_music, play_button, main_background, evt, 
//sounds
track, button_sound,
//objects
canvas, ctx, _screen,
//images:
	/*menu*/
play_button_image = "play_button.gif",
how_to_play_image = "how_to_play_button.jpg", main_background_image = "main_background.jpg",

	/*game stuff*/
game_background_image = "game_bkgrnd.jpg",
	/*settings*/
settings_image = "Gear_Icon.png",settings_background_image = "tsunami.jpg",

//test
rectstart = 10,
//Numbers correspond to _screen
main_menu = 1, settings = 2, play_game = 3, how_to_play = 4, 
pause_menu = 5, no_state = null;
//KeyCodes
Key_Space = 32,
Key_1 = 49, Key_2 = 50, Key_3 = 51, Key_4 = 52,
Key_M = 77, Key_K = 75,

//bools
musicOn = true; pausedGame = false;

function main(){
	//Set up the canvas.
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	//Set up game Audio
	loadAudio();
	loadImages();
	//starting at the menu screen.
	_screen = main_menu; 
	menu();
	                  /*eventListeners*/
	//Checks location of click.
	canvas.addEventListener("click",clickLocation);
	
	//Checks pressed key.
	document.addEventListener("keydown", keyboardAction);
	
	alert("Sound will begin to play");
	track.play();
}

//
function clickLocation(evt){
	var mousePos = getMousePos(canvas,evt);
	switch(_screen){
		case main_menu:
			//if on play button
			if( mousePos.x >=260 && mousePos.x<=382 && mousePos.y >= 195 && mousePos.y <= 271){
			init();
			button_sound.play();
			_screen = play_game;
			}	//if on gear icon
			else if(mousePos.x>=canvas.width-50 && mousePos.x<=canvas.width
					 && mousePos.y>=canvas.height-50 && mousePos.y<=canvas.height){
						    _screen = settings;
						    button_sound.play();
				} //if on tutorial
				else if(mousePos.x>=0 && mousePos.x<=231
					&& mousePos.y>=canvas.height-31 && mousePos.y <=canvas.height){
						_screen = how_to_play;
						button_sound.play();
					}
			break;
		case settings:
			break;
		case play_game:
				//if inside the box
			if(mousePos.x>=rectstart && mousePos.x<=rectstart + 90
				&& mousePos.y>=rectstart&&mousePos.y<=rectstart+25)
				;//doSomething
			else {toggleGame();}
			break;
		case how_to_play:
			break;
		case no_state:
			toggleGame();
			break;
		default:
	}
}

function keyboardAction(evt){
	keyvalue = evt.keyCode;
	switch(keyvalue){
		case Key_Space:
			//prevents game from starting when Space
			//is pressed outside of the game page. 
			if(_screen != no_state && _screen != play_game){
				_screen = main_menu;
			} else toggleGame();
			//prevents game from starting when Space
			//is pressed outside of the game page. 
			console.log("Action: Spacebar");
			
			break;
		case Key_1:
			console.log("Action 1:menu");
			_screen = main_menu;
			break;
		case Key_2:
			console.log("Action 2: setting");
			_screen = settings;
			break;
		case Key_3:
			console.log("Action 3: game");
			_screen = play_game;
			break;
		case Key_4:
			console.log("Action 4");
			break;
		case Key_M:
			if(musicOn){ track.pause(); musicOn = !musicOn;}
				else{ track.play(); musicOn = !musicOn;}
			break;
		case Key_K:
			break;
		default:
	}
}

function getMousePos(canvas, evt){
	var rect = canvas.getBoundingClientRect();
	//returns mouse position relative to the canvas topleft.
	return{ x:evt.clientX-rect.left, y: evt.clientY-rect.top};
}
	
function update(){
	//if the game is going.
	if(_screen == play_game)
		//if out of screen, go to startPoint
		if(rectstart+25==canvas.height) rectstart = 10;
			else rectstart+=1; //else keep going down

}

function draw(){ //I think this can be cleaned up a bit.
	if(_screen == main_menu) menu();
	if(_screen == play_game) theGame();
	if(_screen == settings) settingsPage();
	if(_screen == how_to_play) how_to_play_page();
}



function game_loop(){
	update();
	draw();
}

function init(){
	rectstart = 10;
}
//placeholder for the start of the game.
function theGame(){
	canvas.width = canvas.width;
	ctx.drawImage(game_background, 0, 0, canvas.width, canvas.height);
	ctx.rect(rectstart,rectstart,90,25);
	ctx.stroke();
	ctx.strokeText("Game goes here",rectstart,rectstart+15);
}

function toggleGame(){
	//if paused, go back to game
	if(_screen == no_state && pausedGame == true){
				_screen = play_game;
				pausedGame = !pausedGame;
				console.log("Unpaused Game.");
	} else if(_screen == play_game){ //bring up pause menu
				console.log("Pause");
				_screen = no_state; //switch to pause meny when there is one.
				pausedGame = true;
			}
}

function menu(){//hi cmoc2 blahblah bloop
	ctx.drawImage(main_background,0,0, canvas.width,canvas.height);
	ctx.drawImage(play_button, canvas.width/2-50, canvas.height/2);
	ctx.drawImage(settings_button, canvas.width-50, canvas.height-50, 50, 50);
	ctx.drawImage(how_to_play_button, 0, canvas.height-31, 235, 31);
	//added something
	//tothis
	// yeah.
}

function settingsPage(){
	ctx.drawImage(settings_background, 0, 0, canvas.width, canvas.height);
	ctx.strokeText("Setting stuff goes here", canvas.width/2, canvas.height/2 - 15);
}

function how_to_play_page(){
	canvas.width = canvas.width;
	ctx.fillStyle = "white";
	ctx.rect(0,0,canvas.width,canvas.height);
	ctx.fill();
	ctx.strokeText("Tutorial", canvas.width/2, canvas.height/2 - 15);
}

function loadImages(){
	//load the background image of the menu tab.
	main_background = new Image();
	main_background.src = main_background_image;
	
	//load the play button image
	play_button = new Image();
	play_button.src = play_button_image;
	
	//load the how to play button
	how_to_play_button = new Image();
	how_to_play_button.src = how_to_play_image;
	
	//load the settings image
	settings_button = new Image();
	settings_button.src = settings_image;
	
	//load the background image of settings tab
	settings_background = new Image();
	settings_background.src = settings_background_image;
	
	//load the background image of the game tab
	game_background = new Image();
	game_background.src = game_background_image;
}

function loadAudio(){
	track = document.getElementById("gameAudio");
	button_sound = document.getElementById("button_sound");
}

main();
setInterval(game_loop, 30);


