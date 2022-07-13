const inputVideo = document.getElementsByClassName("input-video")[0];
const outputCanvas = document.getElementsByClassName("output-canvas")[0];
const canvasCtx = outputCanvas.getContext("2d");
const chant = document.getElementsByClassName("chant")[0];

inputVideo.style.display = "none";

const action = ["0:08", "0:28", "0:48", "1:08"]; // recoding time
let target;

const max_field = 4;
const max_test = 2;

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  canvasCtx.drawImage(
    // TODO: 最初から動画は表示したい
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
  console.log(results.poseLandmarks);
  canvasCtx.restore();
}

const holistic = new Holistic({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  },
});
holistic.setOptions({
  upperBodyOnly: false,
  smoothLandmarks: true,
  minDetectionConfidence: 0.95, // need to set
  minTrackingConfidence: 0.95, // need to set
});

function recording(card, sum) {
  // XXX: めのときに挙動がおかしい
  console.log(card + " " + sum);

  setTimeout(function () {
    holistic.onResults(onResults);
  }, 3000); // == 3s
}

const convertStoMS = function (time_position) {
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
};

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

      if (time == action[card]) {
        recording(card, sum);
        card++;
      }

      if (card == max_field) {
        card = 0;
        sum++;
      }

      if (sum == max_test) {
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
