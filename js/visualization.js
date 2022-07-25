const canvasWidth = 640;
const canvasHeight = 360;

function setup() {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  angleMode(DEGREES);
  normalMaterial();
  debugMode(); // display grid
}

function animation(f) {
  let data = inputData[f];
  let previousX = 0;
  let previousY = 0;
  let previousZ = 0;

  for (var i = 0; i < data.length; i++) {
    // console.log(data[i]);
    let x = data[i].x * 300 - 100;
    let y = data[i].y * 300 - 250;
    let z = data[i].z * 200;

    push();
    translate(x, y, z);
    fill(0);
    sphere(2);
    pop();

    if (previousX && previousY && previousY) {
      stroke(0, 200, 200);
      line(previousX, previousY, previousZ, x, y, z);
    }

    previousX = x;
    previousY = y;
    previousZ = z;
  }
}

// animation();
function debugPlane() {
  push();
  translate(0, -80, -160);
  noFill(0);
  stroke(200, 200, 0);
  plane(320, 160);
  pop();

  push();
  translate(-160, -80, 0);
  rotateY(90);
  noFill(0);
  stroke(0, 200, 200);
  plane(320, 160);
  pop();
}

function draw() {
  background(300);
  debugPlane();
  // キャンバス上をマウスでぐりぐりできる
  orbitControl();

  if (inputData.length) {
    animation(frame);
  }
}
