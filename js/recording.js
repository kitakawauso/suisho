// json for output setting begin
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

const swipeData = {
  position: [6, 15], // default 自陣右下段
  keypoints: [],
};

let oneSwipe = [];
let oneFrame = [];

// data structure
// outputData -> swipe -> oneSwipe -> oneFrame

// form input begin
let nameInput = document.getElementById("nameForm");
let ageInput = document.getElementById("ageForm");
let gradeInput = document.getElementById("gradeForm");
let tallInput = document.getElementById("tallForm");
let genderInput = document.getElementsByName("genderForm");
let handInput = document.getElementsByName("handForm");
let styleInput = document.getElementById("styleForm");
let bodyInput = document.getElementById("bodyForm");

function radioChecked(formInput) {
  let ans;
  for (let i = 0; i < formInput.length; i++) {
    if (formInput.item(i).checked) {
      ans = formInput.item(i);
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

  camera.start();
  writeToConsole("Please set card position.", "state");
}
// form input end

// console begin
const consoleLog = document.getElementById("consoleLog");
const stateLog = document.getElementById("stateLog");
function writeToConsole(msg, type) {
  if (type == "msg") {
    consoleLog.innerHTML += msg + "<br>";
  } else if (type == "state") {
    stateLog.innerHTML = msg;
  }
}

// console end

// card position set begin
let column = 15;
let tr;
let row = 6;

function cardOnClick(td) {
  if (recordFlag) {
    console.log("Can't change card during recording2sec.");
  } else {
    let currentChecked = document.getElementsByClassName("swipeCard");
    currentChecked[0].classList.remove("swipeCard");

    column = td.cellIndex;
    tr = td.parentNode;
    row = tr.sectionRowIndex;

    td.classList.add("swipeCard");
    writeToConsole("card position is " + row + " " + column + ".", "msg");
    writeToConsole("Please set repeat counter.", "state");
  }
}
// card position set end

// counter begin
const counterText = document.getElementById("counterText");
let maxRepeat = 1;

function downRepeat() {
  if (counterText.value > 1) {
    counterText.value--;
  }
  maxRepeat = counterText.value;
  // writeToConsole("repeat counter is " + maxRepeat + ".", "msg");
  writeToConsole("Let's start recording.", "state");
}

function upRepeat() {
  counterText.value++;
  maxRepeat = counterText.value;
  // writeToConsole("repeat counter is " + maxRepeat + ".", "msg");
  writeToConsole("Let's start recording.", "state");
}
// counter end

// record page begin
// base setting begin
const inputVideo = document.getElementsByClassName("input-video")[0];
const outputCanvas = document.getElementsByClassName("output-canvas")[0];
const canvasCtx = outputCanvas.getContext("2d");
const chant = document.getElementsByClassName("chant")[0];

inputVideo.style.display = "none";
// base setting end

// json for output setting end

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
  oneFrame = results.poseLandmarks;
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

function recording2sec() {
  setTimeout(function () {
    recordFlag = false;
  }, 1000);
  oneSwipe.push(oneFrame);
  console.log(oneSwipe);
}

let recordFlag = false;

function draw() {
  // Instant execution
  if (recordFlag) {
    recording2sec();
  } else if (oneSwipe.length) {
    swipeData.position = [row, column];
    // console.log(oneSwipe);
    swipeData.keypoints = oneSwipe;
    // console.log(swipeData);
    outputData.swipe.push(swipeData);
    console.log(outputData);
    writeToConsole(outputData, "msg");

    oneSwipe = [];
  }
}

function convertTimeToMS(currentTime) {
  currentTime = Math.floor(currentTime);
  var res = null;

  if (60 <= currentTime) {
    res = Math.floor(currentTime / 60);
    res +=
      ":" +
      Math.floor(currentTime % 60)
        .toString()
        .padStart(2, "0");
  } else {
    res =
      "0:" +
      Math.floor(currentTime % 60)
        .toString()
        .padStart(2, "0");
  }

  return res;
}

const startTime = "0:08"; // recoding time

function chanting() {
  writeToConsole("Please prepare to swipe.", "msg");
  writeToConsole("Recording now", "state");
  chant.loop = true;

  let count = 0;

  chant.addEventListener(
    "timeupdate",
    function () {
      let time = convertTimeToMS(chant.currentTime);

      if (time == startTime && !recordFlag) {
        recordFlag = true;
        count++;
      }

      if (count >= maxRepeat) {
        chant.loop = false;
        count = 0;
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
