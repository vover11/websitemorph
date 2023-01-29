function setup() {
  background(244,193,70);
  canvas = createCanvas(min(windowWidth, windowHeight*1.5), min(windowWidth/1.5, windowHeight));
  canvas.parent('sketch-holder');

}

function windowResized() {
  resizeCanvas(min(windowWidth, windowHeight * 1.5), min(windowWidth / 1.5, windowHeight));
}



function draw() {
	// ellipse(mouseX, mouseY, 20, 20);
	background(244,193,70);
	var x = width/2
	var y = height/2
	var rw = 40
	var rh = 100 + mouseY/5
	var rhStop = 120
	var moveY = mouseY/7
	
	var bPink = color(226,118,175);
	var bOrange = color(255,85,0);
	var bGreen = color(36,84,39);
	var bBlue = color(47,6,252);
	// var rectHeightMove = mouseY/5
	
	rectMode(CENTER);
	noStroke();
	
	fill(bPink);
	rect(x, y, rw, rh, 20);
	fill(255);
	triangle(x-rw/2, y-rh/2-30, x+rw/2, y-rh/2-30, x, y-rh/2);
	
	fill(bOrange);
	rect(x-rw, y-50+mouseY/10, rw, rhStop, 20);
	fill(bGreen);
	arc(x-rw, y-50-rhStop/2-rw/2+mouseY/10, rw, rw, 0, PI);
	
	fill(bGreen);
	rect(x+rw, y+50-moveY, rw, rhStop, 20);
	fill(0);
	triangle(x+rw-rw/2, y-rhStop/2+20-moveY, x+rw+rw/2, y-rhStop/2+20-moveY, x+rw, y+30-rhStop/2+20-moveY);
	
	fill(bBlue);
	rect(x-rw*2, y+50-moveY, rw, rhStop+moveY, 20);
	fill(bOrange);
	circle(x-rw*2, y+50-moveY*1.5,rw);
	
	fill(0);
	rect(x+rw*2, y-30+mouseY/7, rw, rhStop, 20);
	fill(bBlue);
	arc(x+rw*2, y-30-rhStop/2-rw/2+mouseY/7, rw, rw, 0, PI);
	
}
