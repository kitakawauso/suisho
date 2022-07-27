const node = [
  [1, 4], //   0: nose
  [2], //   1: left eye inner
  [3], //   2: left eye
  [7], //   3: left eye outer
  [5], //   4: right eye inner
  [6], //   5: right eye
  [8], //   6: right eye outer
  [], //   7: left ear
  [], //   8: right ear
  [10], //   9: mouth left
  [], //   10: mouth right
  [12, 13, 23], //   11: left shoulder
  [14, 24], //   12: right shoulder
  [15], //   13: left elbow
  [16], //   14: right elbow
  [17, 19, 21], //   15: left wrist
  [18, 20, 22], //   16: right wrist
  [19], //   17: left pinky
  [20], //   18: right pinky
  [], //   19: left index
  [], //   20: right index
  [], //   21: left thumb
  [], //   22: right thumb
  [24, 25], //   23: left hip
  [26], //   24: right hip
  [27], //   25: left knee
  [28], //   26: right knee
  [29, 31], //   27: left ankle
  [30, 32], //   28: right ankle
  [31], //   29: left heel
  [32], //   30: right heel
  [], //   31: left foot index
  [], //   32: right foot index
];

function setup() {
  let canvas = createCanvas(windowWidth / 2, windowHeight / 2, WEBGL);
  canvas.parent("canvas");
  angleMode(DEGREES);
  normalMaterial();
  // debugMode(); // display grid

  camera(300, -100, 330, 100, 50, 0, 0, 1, 0);
}

function windowResized() {
  resizeCanvas(windowWidth / 2, windowHeight / 2);
}

function viewReset() {
  camera(300, 0, 350, 0, 0, 0, 0, 1, 0);
}

function drawPlane() {
  push();
  translate(0, 0, -160);
  noFill(0);
  stroke(200, 200, 0);
  plane(320, 320); // xy plane
  pop();

  push();
  translate(-160, 0, 0);
  rotateY(90);
  noFill(0);
  stroke(0, 200, 200);
  plane(320, 320); // yz plane
  pop();

  push();
  translate(0, 160, 0);
  rotateX(90);
  noFill(0);
  stroke(200, 0, 200);
  plane(320, 320); // yz plane
  pop();
}

function drawStroke(data, color) {
  for (var i = 0; i < node.length; i++) {
    let x1 = data[i].x * 300 - 200;
    let y1 = data[i].y * 300 - 100;
    let z1 = -data[i].z * 200;
    for (var j = 0; j < node[i].length; j++) {
      let d = node[i][j];
      let x2 = data[d].x * 300 - 200;
      let y2 = data[d].y * 300 - 100;
      let z2 = -data[d].z * 200;

      stroke(color[0], color[1], color[2]);
      line(x1, y1, z1, x2, y2, z2);
    }
  }
}

function drawSphere(data, color) {
  for (var i = 0; i < 33; i++) {
    // console.log(data[i]);
    let x = data[i].x * 300 - 200;
    let y = data[i].y * 300 - 100;
    let z = -data[i].z * 200;

    push();
    translate(x, y, z);
    fill(color[0], color[1], color[2]);
    stroke(color[0], color[1], color[2]);
    sphere(1);
    pop();
  }
}

function draw() {
  background(300);
  drawPlane();
  orbitControl();

  for (var i = 0; i < 2; i++) {
    if (input[i]) {
      for (var j = 0; j < clustering[i].length; j++) {
        if (clustering[i][j]) {
          let data = input[i].swipe.keypoints.pose[j][frame];
          let color = colorList[j];
          if (!data) console.log("null");
          else {
            drawSphere(data, color);
            drawStroke(data, color);
          }
        }
      }
    }
  }
}
