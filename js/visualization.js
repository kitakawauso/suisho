const canvasWidth = 640;
const canvasHeight = 360;

function setup() {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  normalMaterial();
}

function animation() {
  for (var i = 0; i < inputData.length; i++) {
    // console.log(inputData[i].x);

    translate(
      inputData[i].x * canvasWidth,
      inputData[i].y * canvasHeight,
      inputData[i].z * 200
    );
    fill(0);
    sphere(5);
  }
}

function draw() {
  background(300);
  // キャンバス上をマウスでぐりぐりできる
  orbitControl();

  animation();
}
