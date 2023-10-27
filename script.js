const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const chiffre1 = document.getElementById('chiffre1');
const bombe1 = document.getElementById('bombe1');
const chiffre2 = document.getElementById('chiffre2');
const bombe2 = document.getElementById('bombe2');
const flag1 = document.getElementById('flag1');
const flag2 = document.getElementById('flag2');
const minuteElement = document.getElementById("min");
const secondeElement = document.getElementById("sec");
const difficulte = document.getElementById("difficulte");

let minutes = 0;
let secondes = 0;
const tailleimg = 100;
const taillecase= 50;
const tabbombe = [[false]];
const tabdecouvert = [[false]];
const tabflag = [[false]];
const difficulté =[{hauteur: 8, largeur: 10, nbombes: 10}, {hauteur: 14, largeur: 18, nbombes: 40}, {hauteur: 20, largeur: 24, nbombes: 100}];

function drawfond() {
	for (let i = 0; i < canvas.height; i+=taillecase) {
		for (let j = 0; j < canvas.width; j+=taillecase) {
			if ((i+j)/taillecase%2==0) {
				ctx.fillStyle = "#AAD751";
			} else {
				ctx.fillStyle = "#A2D149";
			}
			ctx.fillRect(j, i, taillecase, taillecase);

		}
	}
}


function drawchiffre(nb, x, y) {
	//console.log("drawchiffre", nb, x, y);
	if (tabdecouvert[x][y]) {
		return;
	}
	tabdecouvert[x][y] = true;
	if (nb == 0) {
		//console.log("vide");
		if ((x+y)%2==0) {
			ctx.fillStyle = "#E5C29F";
		} else {
			ctx.fillStyle = "#D7B899";
		}
		ctx.fillRect(x*taillecase, y*taillecase, taillecase, taillecase);
		for (let i = x-1; i <= x+1; i++) {
			for (let j = y-1; j <= y+1; j++) {
				if (i >= 0 && i < canvas.width/taillecase && j >= 0 && j < canvas.height/taillecase) {
					if (!tabdecouvert[i][j]) {
						drawchiffre(calcnbbombe(i, j), i, j);
					}
				}
			}
		}		
	}
	else {
		if ((x+y)%2==0) {
			ctx.drawImage(chiffre1,tailleimg*((nb-1)%3),tailleimg*(Math.floor((nb-1)/3)), tailleimg, tailleimg, x*taillecase, y*taillecase, taillecase, taillecase);
		} else {
			ctx.drawImage(chiffre2,tailleimg*((nb-1)%3),tailleimg*(Math.floor((nb-1)/3)), tailleimg, tailleimg, x*taillecase, y*taillecase, taillecase, taillecase);
		}
	}
	//console.log(tailleimg*((nb-1%3)),tailleimg*(Math.floor((nb-1)/3)));
}
function drawflag(x, y) {
	if ((x+y)%2==0) {
		ctx.drawImage(flag1, 0, 0, flag1.width, flag1.height, x*taillecase, y*taillecase, taillecase, taillecase);
	} else {
		ctx.drawImage(flag2, 0, 0, flag2.width, flag2.height, x*taillecase, y*taillecase, taillecase, taillecase);
	}
}
function init() {
	console.log("init");
	canvas.width = difficulté[difficulte.value].largeur*taillecase;
	canvas.height = difficulté[difficulte.value].hauteur*taillecase;
	for (let i = 0; i < canvas.width/taillecase; i++) {
		tabbombe[i] = [];
		tabdecouvert[i] = [];
		tabflag[i] = [];
		for (let j = 0; j < canvas.height/taillecase; j++) {
			tabbombe[i][j] = false;
			tabdecouvert[i][j] = false;
			tabflag[i][j] = false;
		}
	}
	drawfond();
	//randombombe(canvas.width*canvas.height/(taillecase*taillecase)/5);
}
function randombombe(nb,i,j) {
	console.log("randombombe", nb);
	for (let k = 0; k < nb; k++) {
		let x = Math.floor(Math.random()*canvas.width/taillecase);
		let y = Math.floor(Math.random()*canvas.height/taillecase);
		//console.log(x, y, tabbombe[x][y]);
		if (tabbombe[x][y]) {
			k--;
		}
		else{
			tabbombe[x][y] = true;
			printtab();
			console.log(calcnbbombe(i, j));
			if (calcnbbombe(i, j) != 0) {
				tabbombe[x][y] = false;
			}
		}
		
	}
}

function drawbombe() {
	console.log("drawbombe");
	for (let i = 0; i < canvas.height; i+=taillecase) {
		for (let j = 0; j < canvas.width; j+=taillecase) {
			if (tabbombe[j/taillecase][i/taillecase]) {
				if ((i+j)/taillecase%2==0) {
					ctx.drawImage(bombe1, 0, 0, bombe1.width, bombe1.height, j, i, taillecase, taillecase);
				} else {
					ctx.drawImage(bombe2, 0, 0, bombe2.width, bombe2.height, j, i, taillecase, taillecase);
				}
			}
		}
	}
}
function printtab() {
	for (let i = 0; i < canvas.width/taillecase; i++) {
		for (let j = 0; j < canvas.height/taillecase; j++) {
			if (tabbombe[i][j]) {
				console.log("bombe",i,j);
			}
		}
	}
}
init();
//printtab();

function calcnbbombe(x, y) {
	let nb = 0;
	for (let i = x-1; i <= x+1; i++) {
		for (let j = y-1; j <= y+1; j++) {
			if (i >= 0 && i < canvas.width/taillecase && j >= 0 && j < canvas.height/taillecase) {
				if (tabbombe[i][j]) {
					nb++;
				}
			}
		}
	}
	return nb;
}
function gagner() {
	for (let i = 0; i < canvas.width/taillecase; i++) {
		for (let j = 0; j < canvas.height/taillecase; j++) {
			if (!tabdecouvert[i][j] && !tabbombe[i][j]) {
				return false;
			}
		}
	}
	return true;
}
//function qui détection d'un click de souris

let nbclick = 0;
canvas.addEventListener('contextmenu', function(e) {
	if (e.button ===2){
		e.preventDefault();
		let x = Math.floor(e.offsetX/taillecase);
		let y = Math.floor(e.offsetY/taillecase);
		console.log("droite", x, y);
		if (tabdecouvert[x][y]) {
			return;
		}
		if (tabflag[x][y]) {
			if ((x+y)%2==0) {
				ctx.fillStyle = "#AAD751";
			} else {
				ctx.fillStyle = "#A2D149";
			}
			ctx.fillRect(x*taillecase,y*taillecase, taillecase, taillecase);
			tabflag[x][y] = false;
		}
		else {
			drawflag(x, y);
			tabflag[x][y] = true;
		}
	}
});
canvas.addEventListener('click', function(e) {
	
	if (e.button ===0){
		let x = Math.floor(e.offsetX/taillecase);
		let y = Math.floor(e.offsetY/taillecase);
		if (tabflag[x][y]) {
			return;
		}
		nbclick++;
		
		if (nbclick == 1) {
			randombombe(difficulté[difficulte.value].nbombes, x, y);
			setInterval(function() {
					// Augmentez le compteur de secondes
				if (!gagner()) {
					secondes++;
				}
				// Mettez à jour les minutes et les secondes affichées
				minuteElement.textContent = String(minutes).padStart(2, '0');
				secondeElement.textContent = String(secondes).padStart(2, '0');
			
				// Si les secondes atteignent 60, augmentez le compteur de minutes et réinitialisez les secondes à zéro
				if (secondes === 60) {
					minutes++;
					secondes = 0;
				}
			
				// Vous pouvez ajouter ici une condition pour arrêter le timer lorsque nécessaire
			
			}, 1000);
		}
		
		if (tabbombe[x][y]) {
				console.log("bombe", x, y);
				drawbombe();
				alert("perdu");
		} else {
			drawchiffre(calcnbbombe(x, y), x, y);
		}
		if (gagner()) {
			alert("gagné");
			drawbombe();
		}
	}
});
difficulte.addEventListener('change', function(e) {
	init();
});




