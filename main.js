var settings, play_music, main_background, evt,
//sounds
track, button_sound,
//objects
canvas, ctx, _screen, mousePos = {x: 0, y: 0}, walker,
//images:
back_button_image = "back_button.png",
cyan_button_image = "cyan_button.png",
dark_button_image = "dark_button.png",
	/*menu*/
play_button_image = "play_button.gif",
how_to_play_image = "how_to_play_button.jpg", main_background_image = "main_background.jpg",

	/*game stuff*/
game_background_image = "game_bkgrnd.jpg",
pause_button_image = "pause_button.png",
	/*settings*/
settings_image = "Gear_Icon.png",settings_background_image = "tsunami.jpg",
//Numbers correspond to _screen
main_menu = 1, settings = 2, play_game = 3, how_to_play = 4, 
pause_menu = 5,
//KeyCodes
Key_Space = 32,
Key_1 = 49, Key_2 = 50, Key_3 = 51, Key_4 = 52,
Key_M = 77, Key_K = 75,

//bools
musicOn = true, soundFX = true;

//city nodes
var LA = {key: "LA", population: 100000, next: null, HP: 100, posX: 100, posY: 100, color: '#CC0000'};
var BOSTON = {key: "BOSTON", population: 90000, next: LA, HP: 100, posX: 200, posY: 200, color: '#00CC00'}; //not sure if this is how you can save 'color';

//cityList
var cityList = {head: BOSTON, tail: LA, length: 2};

//inGameCityList
var inGameCityList = {head:null, tail: null, length: 0};

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
	
	//Tracks mouse movements
	canvas.addEventListener("mousemove", mouseLocation);
	track.play();
}
function initiateInGameCityList(){
	var randNum = Math.floor(Math.random()*cityList.length); //random integer from 0-1
	var walker = cityList.head;
	for(var i=0; i<randNum; i++)
	{
		walker = walker.next;
	}
	inGameCityList = {head: walker, tail: walker, length: 1};
}

function clickLocation(evt){
	switch(_screen){
		case main_menu:
			initiateInGameCityList();
			//if on play button
			if( mousePos.x >=canvas.width/2-50 && mousePos.x<=canvas.width/2-50 + play_button.width
				 && mousePos.y >= canvas.height/2 && mousePos.y <= canvas.height/2 + play_button.height){
			init();
			if(soundFX == true) button_sound.play();
			_screen = play_game;
			}	//if on gear icon
			else if(mousePos.x>=canvas.width-50 && mousePos.x<=canvas.width
					 && mousePos.y>=canvas.height-50 && mousePos.y<=canvas.height){
						    _screen = settings;
						    if(soundFX == true) button_sound.play();
				} //if on tutorial
				else if(mousePos.x>=0 && mousePos.x<=231
					&& mousePos.y>=canvas.height-31 && mousePos.y <=canvas.height){
						_screen = how_to_play;
						if(soundFX == true) button_sound.play();
					}
			break;
		case settings:
			//if on back button
			if(mousePos.x >=0 && mousePos.x<=50 &&
			mousePos.y >=0 && mousePos.y<=50){
				if(soundFX == true) button_sound.play();
				_screen = main_menu;
				}
			//if on music button
			if(mousePos.x>=canvas.width/2-126 && mousePos.x<=canvas.width/2-126+cyan_button.width
				&& mousePos.y>= canvas.height/2-35 && mousePos.y<= canvas.height/2-35+cyan_button.height){
					if(musicOn){
						track.load();
						musicOn = false;
					} else{
						musicOn = true;
						track.play();
					}
					if(soundFX == true) button_sound.play();
			}
			break;
		case play_game:
			walker = inGameCityList.head;
			for(var i=0; i<inGameCityList.length; i++)
			{
				if(Math.sqrt((mousePos.x - walker.posX)*(mousePos.x - walker.posX) + (mousePos.y - walker.posY)*(mousePos.y - walker.posY)) < 50){console.log(walker.key);}
			}
			//if on pause
			if(mousePos.x >= canvas.width - 50 && mousePos.x <= canvas.width && mousePos.y >=0 && mousePos.y <= 50){
				_screen = pause_menu;
				if(soundFX == true) button_sound.play();
			}
			break;
		case how_to_play:
			//if on back button
			if(mousePos.x >=0 && mousePos.x<=50 &&
			mousePos.y >=0 && mousePos.y<=50){
				if(soundFX == true) button_sound.play();
				_screen = main_menu;
				}
			
			break;
		case pause_menu:
			//Return to menu
			if(mousePos.x >= 325 && mousePos.x<=325+dark_button.width &&
			mousePos.y >=170+40*1 && mousePos.y<=170+40*1+dark_button.height)
				_screen = play_game;
			//Music
			if(mousePos.x >= 325 && mousePos.x<=325+dark_button.width &&
			mousePos.y >=170+40*2 && mousePos.y<=170+40*2+dark_button.height){
				if(musicOn){ track.load(); }
					else{ track.play();}
				musicOn=!musicOn; 
			}
			//Sound
			if(mousePos.x >= 325 && mousePos.x<=325+dark_button.width &&
			mousePos.y >=170+40*3 && mousePos.y<=170+40*3+dark_button.height)
				soundFX = !soundFX;
			//Quit Game
			if(mousePos.x >= 325 && mousePos.x<=325+dark_button.width &&
			mousePos.y >=170+40*4 && mousePos.y<=170+40*4+dark_button.height){
				track.load(); if(musicOn) track.play(); _screen = main_menu;
			}
			if(soundFX == true) button_sound.play();
			break;
			
		default:
	}
}

function keyboardAction(evt){
	keyvalue = evt.keyCode;
	switch(keyvalue){
		case Key_Space:
			//toggle menu on game. Main menu Otherwise.
			if(_screen == pause_menu) _screen = play_game;
				else if(_screen == play_game) _screen = pause_menu;
					else{ _screen = main_menu; console.log("Action: Main Menu");}
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

function mouseLocation(evt){
	mousePos = getMousePos(canvas,evt);
}
function getMousePos(canvas, evt){
	var rect = canvas.getBoundingClientRect();
	//returns mouse position relative to the canvas topleft.
	return{ x:evt.clientX-rect.left, y: evt.clientY-rect.top};
}
	
function update(){
	//if the game is going.
	//console.log(mousePos.x + ","+ mousePos.y)     //test mouse coordinates
	if(_screen == play_game)
	{	
		
	}
}

function draw(){
	if(_screen == main_menu) menu();
	if(_screen == play_game){ theGame();}
	if(_screen == settings) settingsPage();
	if(_screen == how_to_play) how_to_play_page();
	if(_screen == pause_menu) pauseMenu();
}

function game_loop(){
	update();
	draw();
}

function init(){
	test = 0;
}
//clooop[]https://github.com/lazytaroice/Gaia
//placeholder for the start of the game.
function theGame(){	
	canvas.width = canvas.width;
	ctx.drawImage(game_background, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(pause_button, canvas.width-50, 0, 50, 50);

	var walker = inGameCityList.head;
	for(var i = 0; i<inGameCityList.length; i++)
	{
		ctx.beginPath();
		ctx.fillStyle = walker.color;
		ctx.arc(walker.posX, walker.posY, 50, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
		walker = walker.next;
	}
	walker = inGameCityList.head;
	for(var i=0; i<inGameCityList.length; i++){
		/*hovering over city*/
		if(Math.sqrt((mousePos.x - walker.posX)*(mousePos.x - walker.posX) + (mousePos.y - walker.posY)*(mousePos.y - walker.posY)) < 50){
		//fill box with stats.
		ctx.fillStyle="white"; //might want to replace with a nice image
		ctx.fillRect(0, canvas.height-100, canvas.width, canvas.height);
		ctx.strokeText("City Health: "+walker.HP,0, canvas.height-60);
		ctx.strokeText("City Name: "+walker.key,0, canvas.height-80);
		ctx.strokeText("Population: "+walker.population,0, canvas.height-40);
		} else{
			ctx.fillStyle="black"; 
			ctx.fillRect(0, canvas.height-100, canvas.width, canvas.height); }//black box should be decorated.
		
		}
		testDraw();
}

function menu(){
	ctx.drawImage(main_background,0,0, canvas.width,canvas.height);
	ctx.drawImage(play_button, canvas.width/2-50, canvas.height/2);
	ctx.drawImage(settings_button, canvas.width-50, canvas.height-50, 50, 50);
	ctx.drawImage(how_to_play_button, 0, canvas.height-31, 235, 31);
}

function settingsPage(){
	ctx.drawImage(settings_background, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(back_button,0, 0, 50, 50); //top left corner
	ctx.drawImage(cyan_button, canvas.width/2-126, canvas.height/2-35);
	console.log(cyan_button.height);
	if(musicOn) ctx.strokeText("Music: On ", canvas.width/2-15, canvas.height/2);
		else ctx.strokeText("Music: Off ", canvas.width/2-15, canvas.height/2);
}

function how_to_play_page(){
	canvas.width = canvas.width;
	ctx.fillStyle = "white";
	ctx.rect(0,0,canvas.width,canvas.height);
	ctx.fill();
	ctx.strokeText("Tutorial", canvas.width/2, canvas.height/2 - 15);
	ctx.drawImage(back_button,0, 0, 50, 50); //top left corner
}

function pauseMenu(){	
	var grd=ctx.createLinearGradient(300,200,500,475);
	grd.addColorStop(0,"black");
	grd.addColorStop("0.5","white");
	grd.addColorStop(1,"black");
	ctx.fillStyle=grd;
	ctx.fillRect(310,200,180,20+40*4); 
	//draw the options 10px by 25px off the border.
	ctx.drawImage(dark_button, 325,170+40*1);
	ctx.strokeText("Return to game", 325+dark_button.width/4, 170+25+40*1);
	
	ctx.drawImage(dark_button, 325,170+40*2);
	ctx.strokeText("Music: "+ musicOn, 325+dark_button.width/4, 170+25+40*2);
	
	ctx.drawImage(dark_button, 325,170+40*3);
	ctx.strokeText("Sound Effects: "+ soundFX, 325+dark_button.width/4, 170+25+40*3);
	
	ctx.drawImage(dark_button, 325,170+40*4);
	ctx.strokeText("Quit Game", 325+dark_button.width/4, 170+25+40*4);
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
	
	//load the back button
	back_button = new Image();
	back_button.src = back_button_image;
	//load the cyan button
	cyan_button = new Image();
	cyan_button.src = cyan_button_image;
	dark_button = new Image();
	dark_button.src = dark_button_image;
	//load the pause button
	pause_button = new Image();
	pause_button.src = pause_button_image;
}

function loadAudio(){
	track = document.getElementById("gameAudio");
	button_sound = document.getElementById("button_sound");
}


main();
setInterval(game_loop, 30);


