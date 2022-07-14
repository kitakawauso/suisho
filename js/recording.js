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
  swipe: [],
};

// [ ]: changed data construction
const swipeData = {
  position: [6, 15],
  keypoints: [],
};

// form input begin
let nameInput = document.getElementById("nameForm");
let ageInput = document.getElementById("ageForm");
let gradeInput = document.getElementById("gradeForm");
let tallInput = document.getElementById("tallForm");
let genderInput = document.getElementsByName("genderForm");
let handInput = document.getElementsByName("handForm");
let styleInput = document.getElementById("styleForm");
let bodyInput = document.getElementById("bodyForm");

function radioChecked(form) {
  let ans;
  for (let i = 0; i < form.length; i++) {
    if (form.item(i).checked) {
      ans = form.item(i);
    }
  }
  return ans;
}

function settingOnClick() {
  outputData.player.name = nameInput.value;
  outputData.player.age = ageInput.value;
  outputData.player.grade = gradeInput.value;
  outputData.player.tall = tallInput.value;
  outputData.player.gender = radioChecked(genderInput).value;
  outputData.player.hand = radioChecked(handInput).value;
  outputData.player.style = styleInput.value;
  outputData.player.body = bodyInput.value;
  console.log(outputData.player);

  formDiv.style.display = "none";
  recordDiv.style.display = "block";
  camera.start();
}
// form input end

// card position set begin
let column;
let tr;
let row;

function cardOnClick(td) {
  if (recordFlag) {
    console.log("Can't change card during recording.");
  } else {
    let currentChecked = document.getElementsByClassName("swipeCard");
    currentChecked[0].classList.remove("swipeCard");

    column = td.cellIndex;
    tr = td.parentNode;
    row = tr.sectionRowIndex;

    td.classList.add("swipeCard");
  }
}
// card position set end

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
  }, 2000);
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

const counterText = document.getElementById("counterText");
let maxRepeat = 1;
function downRepeat() {
  if (counterText.value > 1) {
    counterText.value--;
  }
  maxRepeat = counterText.value;
  console.log(maxRepeat);
}

function upRepeat() {
  counterText.value++;
  maxRepeat = counterText.value;
  console.log(maxRepeat);
}

// [ ]: change startTime
const startTime = "0:08"; // recoding time

function chanting() {
  console.log("started");
  chant.loop = true;

  let count = 0;

  chant.addEventListener(
    "timeupdate",
    function () {
      let time = convertStoMS(chant.currentTime);

      if (time == startTime && !recordFlag) {
        recordFlag = true;
        count++;
      }

      if (count >= maxRepeat) {
        chant.loop = false;

        if (actionList.length) {
          // TODO: this position
          swipeData.position = [row, column];
          swipeData.keypoints.push(actionList);
          actionList = [];
        }
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

// record page end
