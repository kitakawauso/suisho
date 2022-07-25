// base setting begin
const inputVideo = document.getElementsByClassName("input-video")[0];
const outputCanvas = document.getElementsByClassName("output-canvas")[0];
const canvasCtx = outputCanvas.getContext("2d");
const chant = document.getElementsByClassName("chant")[0];
const saveBtn = document.getElementsByName("saveBtn")[0];
const visBtn = document.getElementsByName("visBtn")[0];

inputVideo.style.display = "none";
// base setting end

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
  poseFrame = results.poseLandmarks;
  leftHandFrame = results.leftHandLandmarks;
  rightHandFrame = results.rightHandLandmarks;
  // console.log(results.poseLandmarks);
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
  poseSwipe.push(poseFrame);
  leftHandSwipe.push(leftHandFrame);
  rightHandSwipe.push(rightHandFrame);
  console.log(poseSwipe);
  console.log(leftHandSwipe);
  console.log(rightHandSwipe); // TODO: kokomade
}

function draw() {
  // Instant execution
  if (recordFlag) {
    recording2sec();
  } else if (
    poseSwipe.length &&
    leftHandSwipe.length &&
    rightHandSwipe.length
  ) {
    swipeData.position = [row, column];
    // console.log(poseSwipe);
    swipeData.keypoints.pose = poseSwipe;
    swipeData.keypoints.hand.left = leftHandSwipe;
    swipeData.keypoints.hand.right = rightHandSwipe;

    outputData.swipe.push(swipeData);
    console.log(outputData);

    poseSwipe = [];
    leftHandSwipe = [];
    rightHandSwipe = [];
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
        saveBtn.disabled = false;
        visBtn.disabled = false;
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

function saveOnClick() {
  // saveボタンクリックでjsonファイルを保存
  console.log(outputData);
  let json_data = JSON.stringify(outputData);
  let blob = new Blob([json_data], {
    type: "text/plan",
  });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = outputData.player.name + ".json";
  link.click();
}
