const formDiv = document.getElementById("form");
const recordDiv = document.getElementById("record");

const outputData = {
  player: {
    name: "unknown",
    age: 0,
    grade: 0,
    tall: 0,
    gender: 0,
    hand: 0,
    style: 0,
    body: 0,
  },
  swipe: {
    position: 0,
    point: [],
  },
};

// form input begin
let nameInput = document.getElementById("nameForm");
let ageInput = document.getElementById("ageForm");
let gradeInput = document.getElementById("gradeForm");
let tallInput = document.getElementById("tallForm");
let genderInput;
function genderChecked(value) {
  genderInput = value;
}
let handInput;
function handChecked(value) {
  handInput = value;
}
let styleInput = document.getElementById("styleForm");
let bodyInput = document.getElementById("bodyForm");

function settingOnClick() {
  outputData.player.name = nameInput.value;
  outputData.player.age = ageInput.value;
  outputData.player.grade = gradeInput.value;
  outputData.player.tall = tallInput.value;
  outputData.player.gender = genderInput.value;
  outputData.player.hand = handInput.value;
  outputData.player.style = styleInput.value;
  outputData.player.body = bodyInput.value;
  console.log(outputData.player);

  formDiv.style.display = "none";
  recordDiv.style.display = "block";
}
// form input end

// record page begin
const inputVideo = document.getElementsByClassName("input-video")[0];
const outputCanvas = document.getElementsByClassName("output-canvas")[0];
const canvasCtx = outputCanvas.getContext("2d");
const chant = document.getElementsByClassName("chant")[0];

inputVideo.style.display = "none";

let frameList = [];
let actionList = [];
let recordFlag = false;

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    outputCanvas.width,
    outputCanvas.height
  );
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "#00FF00",
    lineWidth: 4,
  });
  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: "#FF0000",
    lineWidth: 2,
  });
  // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
  //                {color: '#C0C0C070', lineWidth: 1});
  drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
    color: "#CC0000",
    lineWidth: 5,
  });
  drawLandmarks(canvasCtx, results.leftHandLandmarks, {
    color: "#00FF00",
    lineWidth: 2,
  });
  drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
    color: "#00CC00",
    lineWidth: 5,
  });
  drawLandmarks(canvasCtx, results.rightHandLandmarks, {
    color: "#FF0000",
    lineWidth: 2,
  });
  canvasCtx.restore();
  frameList = results.poseLandmarks;
}

const holistic = new Holistic({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  },
});
holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  refineFaceLandmarks: true,
  minDetectionConfidence: 0.95,
  minTrackingConfidence: 0.95,
});

holistic.onResults(onResults);

function recording() {
  setTimeout(function () {
    recordFlag = false;
  }, 3000);
  console.log(frameList);
  actionList.push(frameList);
  console.log(actionList);
}

function draw() {
  if (recordFlag) {
    recording();
  }
}

function convertStoMS(time_position) {
  time_position = Math.floor(time_position);
  var res = null;

  if (60 <= time_position) {
    res = Math.floor(time_position / 60);
    res +=
      ":" +
      Math.floor(time_position % 60)
        .toString()
        .padStart(2, "0");
  } else {
    res =
      "0:" +
      Math.floor(time_position % 60)
        .toString()
        .padStart(2, "0");
  }

  return res;
}

const startTime = ["0:08", "0:28", "0:48", "1:08"]; // recoding time
const maxCard = 4;
const maxRepeat = 2;

function chanting() {
  console.log("started");
  chant.loop = true;

  let card = 0;
  let sum = 0;

  chant.addEventListener(
    "timeupdate",
    function () {
      let time = convertStoMS(chant.currentTime);
      // console.log(time);

      if (time == startTime[card]) {
        recordFlag = true;
        card++;
      }

      if (card == maxCard) {
        card = 0;
        sum++;
      }

      if (sum == maxRepeat) {
        chant.loop = false;
      }
    },
    false
  );
}

const camera = new Camera(inputVideo, {
  onFrame: async () => {
    await holistic.send({ image: inputVideo });
  },
  width: 1280,
  height: 720,
});
camera.start();
// record page end
