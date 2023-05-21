let xLabel = [];
for (var i = 0; i < 40; i++) {
  // max is slider's max
  // TODO: max = 60;
  xLabel.push(i);
}

function pushLineChartData(inputData, clusteringList, partList, coordinate) {
  var dataset = [];

  for (var i = 0; i < 2; i++) {
    var part = partList[i];
    for (var j = 0; j < clusteringList[i].length; j++) {
      var chartData = {
        label: [],
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        pointBorderWidth: 0.5,
      };

      if (clusteringList[i][j]) {
        var playerI = i + 1;
        var playerJ = j + 1;
        var label = "" + playerI + "-" + playerJ;
        chartData.label = label;

        let tmp = inputData[i].swipe.keypoints.pose[j];

        if (!tmp) console.log("null");
        else {
          var buf = [];

          for (var l = 0; l < tmp.length; l++) {
            var d = 0;
            if (!tmp[l]) d = null;
            else {
              if (coordinate == "x") d = tmp[l][part].x;
              else if (coordinate == "y") d = 1 - tmp[l][part].y;
              else if (coordinate == "z") d = tmp[l][part].z;
            }
            buf.push(d);
          }
          chartData.data = buf;
        }

        let color =
          "rgba(" +
          playerColors[i][j][0] +
          "," +
          playerColors[i][j][1] +
          "," +
          playerColors[i][j][2] +
          ",1)";
        chartData.backgroundColor = color;
        chartData.borderColor = color;

        dataset.push(chartData);
      }
    }
  }

  drawLineChart(dataset);
}

var chart = null;

function drawLineChart(dataset) {
  const ctx = document.getElementById("LineChartCanvas").getContext("2d");

  if (!chart) {
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: xLabel,
        datasets: dataset,
      },
      options: {
        animation: {
          duration: 0, // no animation
        },
        scales: {
          y: {
            // suggestedMin: 0,
            suggestedMax: 1,
            ticks: {
              stepSize: 0.1,
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 5,
            },
          },

          zoom: {
            pan: {
              enabled: true,
              mode: "y",
            },
            limits: {
              y: { min: 0, max: 1 },
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "y",
            },
          },
        },
      },
    });
  } else {
    chart.data.datasets = dataset;
    chart.update();
  }
}
// データの作成
var data = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "手以外が動いている時間",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      type: "bar",
    },
    {
      label: "手が動いている時間",
      data: [5, 9, 3, 5, 2, 3],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      type: "bar",
    },
    {
      label: "Dataset 3",
      data: [20, 30, 5, 10, 8, 15],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      type: "line",
      fill: false,
      tension: 0.1,
    },
  ],
};

// オプションの作成
var options = {
  indexAxis: "y",
  scales: {
    x: {
      beginAtZero: true,
      stacked: true,
    },
    y: {
      beginAtZero: true,
      stacked: true,
    },
  },
};

// チャートの作成
var ctx = document.getElementById("BoxChartCanvas").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: data,
  options: options,
});

function pushBoxChartData(inputData) {
  console.log(inputData);
  console.log(inputData[0].swipe.keypoints.pose);

  if (inputData[0].length != 0) {
    let player1Data = inputData[0].swipe.keypoints.pose;
    let player1RightWristX = [];
    let player1NoseY = [];

    for (var i = 0; i < player1Data.length; i++) {
      let rightWristBuf = [];
      let noseBuf = [];
      for (var j = 0; j < player1Data[i].length; j++) {
        if (player1Data[i][j] != null) {
          rightWristBuf.push(player1Data[i][j][16].x);
          noseBuf.push(player1Data[i][j][0].y);
        }
      }

      player1RightWristX.push(rightWristBuf);
      player1NoseY.push(noseBuf);
    }

    const player1 = {
      rightWristX: player1RightWristX,
      noseY: player1NoseY,
    };
    console.log(player1);
  }

  if (inputData[1].length != 0) {
    let player2Data = inputData[1].swipe.keypoints.pose;
    let player2RightWristX = [];
    let player2NoseY = [];

    for (var i = 0; i < player2Data.length; i++) {
      let rightWristBuf = [];
      let noseBuf = [];
      for (var j = 0; j < player2Data[i].length; j++) {
        if (player2Data[i][j] != null) {
          rightWristBuf.push(player2Data[i][j][16].x);
          noseBuf.push(player2Data[i][j][0].y);
        }
      }

      player2RightWristX.push(rightWristBuf);
      player2NoseY.push(noseBuf);
    }

    const player2 = {
      rightWristX: player2RightWristX,
      noseY: player2NoseY,
    };
    console.log(player2);
  }
}
