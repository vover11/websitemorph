//https://openprocessing.org/user/254781
// A sketch for psudo ink drawing  
// implements perlin noise and recursion

let particles = []; //array of particles



//Symmetrical Amoeba
//Instagram - @fuzzylogic.io
//Tumblr - @fuzzylogic-io
//Twitter - @fuzzylogicio
//Facebook - @fuzzylogic.io

let r = 70; 
let taille = 0.6; 
let t = 0;
let color = ["#FFFFFF"];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  background(200, 120, 30, 20);
  imageMode(CENTER);
}



function draw() {
	let col = random(color);
	background(0);
	dessin();
}

function dessin() {
	beginShape();
	t += 0.02;
	h = height / 1;
	w = width / 1;
	translate(width / 2.5, height / 2.5);
	noFill();
	let col3 = random(color);
	stroke(255);
	strokeWeight(0.5);
	for (i = 0; i < TAU * r; i += TAU / 24) {
		k = map(i / TAU, 0, r, 1, 30 / h);
		n2 = noise(cos(i * 3), sin(i * 3) * k + t) * taille;
		curveVertex(-120 + w / 2 - cos(i) * w * n2 * k, 80 - sin(i) * w * n2 * k);
	}
	endShape();
}

