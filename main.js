var settings, play_music, main_background, evt, timer = 300, framecount = 0,
//sounds
track, button_sound,
//objects
canvas, ctx, _screen, mousePos = {x: 0, y: 0}, walker, //test coinFrame=5, coin_image = "coin-sprite-animation-sprite-sheet.png",
//images:
back_button_image = "back_button.png",
cyan_button_image = "cyan_button.png",
dark_button_image = "dark_button.png",
	/*menu*/
gaias_revenge_title_image = "Gaias_Revenge_Title.png";
play_button_image = "play_button.png",
how_to_play_image = "how_to_play_button.png", main_background_image = "main_background.jpg",
settings_image = "Gear_Icon.png",

	/*game stuff*/
game_background_image = "game_bkgrnd_water.jpg",
pause_button_image = "pause_button.png",
landmass_image = "landmass.png";
icecap_image = "icecap.png";
city_image = "city.png",
earth_image = "earthicon.png",
rain_image = "rainicon.png",
wind_image = "windicon.png",
	/*settings*/
settings_background_image = "tsunami.jpg",
//Numbers correspond to _screen
main_menu = 1, settings = 2, play_game = 3, how_to_play = 4, 
pause_menu = 5,
//KeyCodes
Key_Space = 32, Key_Esc = 27,
Key_1 = 49, Key_2 = 50, Key_3 = 51, Key_4 = 52,
Key_M = 77, Key_K = 75,

//bools
musicOn = true, soundFX = true, showGod = false;

main();
//deity nodes
var deity = null;
var TITAN = {key: "Titan", damage: 1500, next: null, posX: 530, posY: 300, color: earth};
var IFRIT = {key: "Leviathan", damage: 1500, next: TITAN, posX: 530, posY: 200, color: rain};
var SHIVA = {key: "Garuda", damage: 1500, next: IFRIT, posX: 530, posY: 100, color: wind};

//deity list
var deityList = {head: SHIVA, tail: TITAN, length: 3};

//city nodes
var LA = {key: "LA", population: 100000, next: null,  posX: 300, posY: 100, color: '#CC0000', resetPopulation: 100000, resistance: null, resistAmount: 150};
var BOSTON = {key: "BOSTON", population: 90000, next: LA, posX: 200, posY: 200, color: '#00CC00', resetPopulation: 90000, resistance: null, resistAmount: 150}; //not sure if this is how you can save 'color';

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
	
	//reset HP & resistance
	for(var z = cityList.head; z!=null; z = z.next){
		z.population = z.resetPopulation
		z.resistance = 0;
	}
	
}

function clickLocation(evt){
	switch(_screen){
		case main_menu:
			//if on play button
			if( mousePos.x >=canvas.width/2-50 && mousePos.x<=canvas.width/2-50 + play_button.width
				 && mousePos.y >= canvas.height/2 && mousePos.y <= canvas.height/2 + play_button.height){
			init();
			initiateInGameCityList();
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
			if(mousePos.x>=canvas.width/2-cyan_button.width/2 && mousePos.x<=canvas.width/2+cyan_button.width/2
				&& mousePos.y>= canvas.height/2-cyan_button.height/2 && mousePos.y<= canvas.height/2+cyan_button.height/2){
					if(musicOn){
						track.load();
						musicOn = false;
					} else{
						musicOn = true;
						track.play();
					}
					if(soundFX == true) button_sound.play();
			}
			//if on sound button
			if(mousePos.x>=canvas.width/2-cyan_button.width/2 && mousePos.x<=canvas.width/2+cyan_button.width/2
				&& mousePos.y >=10+canvas.height/2-cyan_button.height/2+cyan_button.height && mousePos.y <10+canvas.height/2-cyan_button.height/2+cyan_button.height*2){
				soundFX = !soundFX;
				if(soundFX == true) button_sound.play();
			}
			break;
		case play_game:
			walker = inGameCityList.head;
			//check if on cities.
			for(var i=0; i<inGameCityList.length; i++)
			{	//if on a city
				if(walker.population<=0) continue;
				 if(deity != null && Math.sqrt((mousePos.x - walker.posX)*(mousePos.x - walker.posX) + (mousePos.y - walker.posY)*(mousePos.y - walker.posY)) < 50){
					//resistance code.
					if(walker.resistance == deity){
						walker.population -= deity.damage-walker.resistAmount>=0?
									deity.damage-walker.resistAmount:0;
						walker.resistAmount +=150;
						}else{
							walker.resistAmount = 150; 
							walker.population -=deity.damage;}
					walker.resistance = deity;
					if(walker.population<=0){
						console.log("Destroyed");
						//remove from node list;
					}
				} else deity = null;
					
			}
			//check if on deity
			for(var z = deityList.head; z!=null; z = z.next){
				if(mousePos.x>=z.posX && mousePos.x<=z.posX+180 && mousePos.y>=z.posY && mousePos.y<=z.posY+80){
					deity = z;
					continue;
				}
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
			if(_screen == play_game){
				console.log("Action 1:Titan");
				deity = SHIVA;}
			break;
		case Key_2:
			if(_screen == play_game){
				console.log("Action 2: Ifrit");
				deity = IFRIT;
			} 
			break;
		case Key_3:
			if(_screen == play_game){
				console.log("Action 3: Shiva");
				deity = TITAN;
			} 
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
		case Key_Esc:
			if(_screen == pause_menu) _screen = play_game;
				else if(_screen == play_game) _screen = pause_menu;
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
		//timer.
		framecount +=1;
		if(framecount%20==0) timer +=1;
		if(timer%60 < 10)
			ctx.strokeText("Time Elapsed " + Math.floor(timer/60)+":0"+ timer%60, 1,60);
		else
			ctx.strokeText("Time Elapsed " + Math.floor(timer/60)+":"+ timer%60, 1,60);
	}
}

function draw(){
	if(_screen == main_menu) menu();
	if(_screen == play_game){ theGame(); /*test codetoMakecoinRotate();*/}
	if(_screen == settings) settingsPage();
	if(_screen == how_to_play) how_to_play_page();
	if(_screen == pause_menu) pauseMenu();
}

function game_loop(){
	draw();
	update();
}

function init(){
	deity = null;
	timer = 0;
}
//clooop[]https://github.com/lazytaroice/Gaia
//placeholder for the start of the game.
function theGame(){
	showGod = false;
	canvas.width = canvas.width;
	ctx.drawImage(game_background, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(landmass, 20, 50);
	ctx.drawImage(pause_button, canvas.width-50, 0, 50, 50);
	showIcecap();
	//Draw gods on right side
	displayGods();
	
	//hovering for deities
	deityHover();
	
	//draw remaining cities
	drawCities();
	
	/*hovering over functioning city */
	cityHover();

		
}

function menu(){
	ctx.drawImage(main_background,0,0, canvas.width,canvas.height);
	ctx.drawImage(play_button, canvas.width/2-50, canvas.height/2);
	ctx.drawImage(settings_button, canvas.width-50, canvas.height-50, 50, 50);
	ctx.drawImage(how_to_play_button, 0, canvas.height-31, 235, 31);
	ctx.drawImage(gaias_revenge_title, canvas.width/2-gaias_revenge_title.width/2,10);
}

function settingsPage(){
	ctx.drawImage(settings_background, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(back_button,0, 0, 50, 50); //top left corner
	//music button
	ctx.drawImage(cyan_button, canvas.width/2-cyan_button.width/2, canvas.height/2-cyan_button.height/2);
	ctx.strokeText("Music: " + isOn(musicOn), canvas.width/2-cyan_button.width/4+35, canvas.height/2-cyan_button.height/4+15);
	//soundFX
	ctx.drawImage(cyan_button, canvas.width/2-cyan_button.width/2, 10+canvas.height/2-cyan_button.height/2+cyan_button.height);
	ctx.strokeText("Sound: " + isOn(soundFX), canvas.width/2-cyan_button.width/4+35, 10+canvas.height/2-cyan_button.height/4+15+cyan_button.height);
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
	ctx.strokeText("Music: "+ isOn(musicOn), 325+dark_button.width/4, 170+25+40*2);
	
	ctx.drawImage(dark_button, 325,170+40*3);
	ctx.strokeText("Sound Effects: "+ isOn(soundFX), 325+dark_button.width/4, 170+25+40*3);
	
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
	//load the title iage
	gaias_revenge_title = new Image();
	gaias_revenge_title.src = gaias_revenge_title_image;
	//load the landmass
	landmass = new Image();
	landmass.src = landmass_image;
	//load city
	city = new Image();
	city.src = city_image;
	//load God Art
	wind = new Image();
	wind.src = wind_image;
	rain = new Image();
	rain.src = rain_image;
	earth = new Image();
	earth.src = earth_image;
	//load icecap
	icecap = new Image();
	icecap.src = icecap_image;
/*	//load the test coin
	coin = new Image();
	coin.src = coin_image;
*/
}

function showIcecap(){
	ctx.drawImage(icecap,0,0,100,50);
}
function displayGods(){
	walker = deityList.head;
	//Displays Gods on the right side.
	for(var i = 0; i<deityList.length; i++)
	{
		ctx.fillStyle = walker.color;
		// ctx.lineWidth = "5";
		ctx.drawImage(walker.color, walker.posX, walker.posY, 250, 80);
		//ctx.fillRect(walker.posX, walker.posY, 180, 80);
		//ctx.strokeText(walker.key+ " (" + (i+1) + ")", walker.posX+75, walker.posY+40)
		walker = walker.next;
		
		//Display Red border on chosen God.
		if(deity != null)
		{
			ctx.strokeText("Deity Selected: " + deity.key, 1,10);
			ctx.strokeStyle = "red";
			ctx.lineWidth = "5";
			switch(deity.key)
			{
				case SHIVA.key:
					ctx.moveTo(SHIVA.posX+50, SHIVA.posY);
				    ctx.lineTo(SHIVA.posX+250, SHIVA.posY);
				    ctx.lineTo(SHIVA.posX+250, SHIVA.posY+80);
				    ctx.lineTo(SHIVA.posX+55, SHIVA.posY+80);
				    ctx.lineTo(SHIVA.posX, SHIVA.posY);
				    ctx.lineTo(SHIVA.posX+50, SHIVA.posY);
					break;
				case TITAN.key:
					ctx.moveTo(TITAN.posX+50, TITAN.posY);
				    ctx.lineTo(TITAN.posX+250, TITAN.posY);
				    ctx.lineTo(TITAN.posX+250, TITAN.posY+80);
				    ctx.lineTo(TITAN.posX+55, TITAN.posY+80);
				    ctx.lineTo(TITAN.posX, TITAN.posY);
				    ctx.lineTo(TITAN.posX+50, TITAN.posY);
					break;
				case IFRIT.key:
					ctx.moveTo(IFRIT.posX+50, IFRIT.posY);
				    ctx.lineTo(IFRIT.posX+250, IFRIT.posY);
				    ctx.lineTo(IFRIT.posX+250, IFRIT.posY+80);
				    ctx.lineTo(IFRIT.posX+55, IFRIT.posY+80);
				    ctx.lineTo(IFRIT.posX, IFRIT.posY);
				    ctx.lineTo(IFRIT.posX+50, IFRIT.posY);
					break;

			}
			ctx.stroke();
			ctx.lineWidth = "1";
			ctx.strokeStyle = "black";
		}
	}
}
//edit
function drawCities(){
	ctx.strokeStyle = "black";
	ctx.lineWidth = "1";
	walker = inGameCityList.head;
	for(var i = 0; i<inGameCityList.length; i++)
	{
		if(walker.population<=0){walker = walker.next; continue;}
		ctx.drawImage(city,walker.posX-50, walker.posY-50, 100, 100);
		walker = walker.next;
	}
}
function deityHover(){
	for(var i = deityList.head; i != null ; i = i.next)
	{
		if(mousePos.x >= i.posX && mousePos.x <= i.posX+180 && mousePos.y >= i.posY && mousePos.y <= i.posY+80)
		{
			showGod = true;
			//fill box with stats.
			ctx.fillStyle="white"; //might want to replace with a nice image
			ctx.fillRect(0, canvas.height-100, canvas.width, canvas.height);
			ctx.strokeText(i.key,10, canvas.height-80);
			ctx.strokeText("Damage: "+i.damage,10, canvas.height-60);
		}
	}
}

function cityHover(){
	for(var i=inGameCityList.head; i!=null; i=i.next){
		/*hovering over functioning city*/
		if(i.population > 0 && Math.sqrt((mousePos.x - i.posX)*(mousePos.x - i.posX) + (mousePos.y - i.posY)*(mousePos.y - i.posY)) < 50){
		//fill box with stats.
		ctx.fillStyle="white"; //might want to replace with a nice image
		ctx.fillRect(0, canvas.height-100, canvas.width, canvas.height);
		//ctx.strokeText("City Health: "+walker.HP,10, canvas.height-60);
		ctx.strokeText("City Name: "+i.key,10, canvas.height-80);
		ctx.strokeText("Population: "+i.population,10, canvas.height-60);
		if(i.resistance.key) 
			if(i.resistance.damage>i.resistAmount)
				ctx.strokeText("Building Resistance to: "+ i.resistance.key, 10, canvas.height-20);
				else ctx.strokeText("Fully Resistant to: "+ i.resistance.key, 10, canvas.height-20);
		}
	}
}
function isOn(bool){
	if(bool) return "on"; else return "off"	;
}
function loadAudio(){
	track = document.getElementById("gameAudio");
	button_sound = document.getElementById("button_sound");
}

/* test
function codetoMakecoinRotate(){
	ctx.drawImage(coin,44*coinFrame,0,44,40, mousePos.x-22,mousePos.y-20,44,40);
	coinFrame+=1;
		if(coinFrame>9) coinFrame=0;
} */

function upgrade(deity){
	deity.damage *=1.5;
}
function game_health(){
	//simple increase of city health over time.
	if(_screen == play_game){
		if(LA.population>0)LA.population +=10;
		if(BOSTON.population>0)BOSTON.population+=10;
	}
}

setInterval(game_loop, 50);
setInterval(game_health, 500);

