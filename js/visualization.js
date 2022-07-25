const canvasWidth = 640;
const canvasHeight = 360;

function setup() {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  normalMaterial();
  debugMode();
}

function animation() {
  for (var i = 0; i < inputData.length; i++) {
    console.log(inputData[i]);

    push();

    translate(
      inputData[i].x * 200 - 100,
      inputData[i].y * 200 - 200,
      inputData[i].z * 100
    );

    fill(0);
    sphere(2);
    pop();
  }
}

// animation();

function draw() {
  background(300);
  // キャンバス上をマウスでぐりぐりできる
  orbitControl();

  var flag = true;
  if (flag && inputData) {
    animation();
    flag = false;
  }
}
