

let particles = []; //array of particles
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
	h = height / 0.5;
	w = width / 0.5;
	translate(width / 10, height / 10);
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

