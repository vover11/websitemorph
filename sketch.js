let button;

function setup() {
  background(244,193,70);
  canvas = createCanvas(min(windowWidth, windowHeight*1.5), min(windowWidth/1.5, windowHeight), WEBGL);
  canvas.parent('sketch-holder');
  button = createButton("Draw Shape");
  button.mousePressed(drawShape);
  button.id("myButton");
  select("#container").child(button);

}

function windowResized() {
  resizeCanvas(min(windowWidth, windowHeight * 1.5), min(windowWidth / 1.5, windowHeight));
}




function draw() {



}

function drawShape() {
  let r = random(1);
  if (r < 0.33) {
    drawCube();
  } else if (r < 0.66) {
    drawSphere();
  } else {
    drawCone();
  }
}

function drawCube() {
  push();
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  box(50);
  pop();
}

function drawSphere() {
  push();
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  sphere(50);
  pop();
}

function drawCone() {
  push();
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  cone(50, 100);
  pop();
}

