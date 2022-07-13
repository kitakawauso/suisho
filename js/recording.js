// video script

const inputVideo = document.getElementsByClassName("input-video")[0];
const outputCanvas = document.getElementsByClassName("output-canvas")[0];
const canvasCtx = outputCanvas.getContext("2d");

inputVideo.style.display = "none";

let landmarks;

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

  landmarks = results.poseLandmarks;
  canvasCtx.restore();
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

const camera = new Camera(inputVideo, {
  onFrame: async () => {
    await holistic.send({ image: inputVideo });
  },
  width: 1280,
  height: 720,
});
camera.start();

// video end
//
// graph script
// TODO: reference見て見た目整える

var icon1 = {
  width: 500,
  height: 600,
  path: "M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z",
};

var layout = {
  modebardisplay: false,
  font: {
    size: 10,
  },
  scene: {
    aspectmode: "manual",
    aspectratio: {
      x: 1,
      y: 1,
      z: 1,
    },
    camera: {
      up: {
        x: 0,
        y: 0,
        z: 1,
      },
      center: {
        x: 0,
        y: 0,
        z: 0,
      },
      eye: {
        x: 1,
        y: 1,
        z: 1,
      },
    },
  },
};

var markerSize = 3;
let rotate = 0;

var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  z: [10, 8, 6, 4],
  mode: "markers",
  type: "scatter3d",
  marker: {
    size: markerSize,
  },
};

var trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  z: [10, 8, 6, 4],
  mode: "markers",
  type: "scatter3d",
  marker: {
    size: markerSize,
  },
};

var config = {
  modeBarButtonsToAdd: [
    {
      name: "rotate",
      icon: icon1,
      click: function (gd) {
        setInterval(() => {
          const newData = gd._fullLayout.scene._scene.getCamera();

          const currentX = newData.eye.x;
          const currentY = newData.eye.y;
          const currentZ = newData.eye.z;

          const newX =
            currentX * Math.cos(1 * (Math.PI / 180)) -
            currentY * Math.sin(1 * (Math.PI / 180));
          const newY =
            currentX * Math.sin(1 * (Math.PI / 180)) +
            currentY * Math.cos(1 * (Math.PI / 180));

          // console.log(currentX + " : " + currentY + " : " + currentZ)
          // console.log(newX + " : " + newY)

          const update = {
            x: newX,
            y: newY,
            z: currentZ,
          };

          Plotly.relayout(gd, "scene.camera.eye", update);
        }, 10);
      },
    },
  ],
};

var data = [trace1, trace2];

Plotly.newPlot("myDiv", data, layout, config);
