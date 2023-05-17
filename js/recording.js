// base setting begin
const inputVideo = document.getElementsByClassName("input-video")[0];
inputVideo.style.display = "none";

const outputCanvas = document.getElementsByClassName("output-canvas")[0];
const canvasCtx = outputCanvas.getContext("2d");

let poseSwipe = [];
let leftHandSwipe = [];
let rightHandSwipe = [];

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

  if (recordState == "recording") {
    poseSwipe.push(results.poseLandmarks);
    leftHandSwipe.push(results.leftHandLandmarks);
    rightHandSwipe.push(results.rightHandLandmarks);
    console.log("poseSwipe = ");
    console.log(poseSwipe);
  }
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

function recording(count) {
  // if recorded -> swipeData.push(swipe)
  // if count >= maxRepeat -> outputData.push(swipeData) -> waiting
  const swipeData = {
    position: [6, 15], // default 自陣右下段
    keypoints: {
      pose: [],
      hand: {
        left: [],
        right: [],
      },
    },
  };

  // console.log(count);
  // console.log(recordState);

  if (recordState == "recorded") {
    // swipeData.position = [row, column];

    swipeData.keypoints.pose.push(poseSwipe);
    swipeData.keypoints.hand.left.push(leftHandSwipe);
    swipeData.keypoints.hand.right.push(rightHandSwipe);

    console.log("swipeData = ");
    console.log(swipeData);

    poseSwipe = [];
    leftHandSwipe = [];
    rightHandSwipe = [];

    if (count >= maxRepeat) {
      outputData.swipe = swipeData;
      console.log("outputData = ");
      console.log(outputData);
    }

    recordState = "waiting";
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

function chanting() {
  // if currentTime = startTime -> recording(count) -> after 2s recorded
  const startTime = "0:07"; // recoding time

  const chant = document.getElementsByClassName("chant")[0];
  const saveBtn = document.getElementById("saveBtn");

  writeToConsole("Please prepare to swipe.", "msg");
  writeToConsole("Recording now", "state");
  chant.loop = true;

  let count = 0;

  chant.addEventListener(
    "timeupdate",
    function () {
      let currentTime = convertTimeToMS(chant.currentTime);

      if (currentTime == startTime && recordState == "waiting") {
        recordState = "recording";
        count++;
        setTimeout(function () {
          recordState = "recorded";

          if (count >= maxRepeat) {
            chant.loop = false;
            saveBtn.disabled = false;
          }
        }, 5000);
        // TODO: change to 3000;
      }

      recording(count);
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
