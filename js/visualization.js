function setup() {
  createCanvas(600, 600, WEBGL);
  normalMaterial();
}

function animation() {
  // console.log(inputData);
  for (var i = 0; i < inputData.length; i++) {
    // console.log(inputData[i].x);

    translate(inputData[i].x * 100, inputData[i].y * 100, inputData[i].z * 100);
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
