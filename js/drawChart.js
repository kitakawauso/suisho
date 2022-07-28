var ctx = document.getElementById("chartCanvas").getContext("2d");

var xLabel = [];
for (var i = 0; i < 40; i++) {
  // max is slider's max
  // TODO: max = 60;
  xLabel.push(i);
}

function pushChartData(inputData, clusteringList, partList) {
  var dataset = [];

  for (var i = 0; i < 2; i++) {
    var part = partList[i];
    for (var j = 0; j < clusteringList[i].length; j++) {
      var playerI = i + 1;
      var playerJ = j + 1;
      var label = "" + playerI + "-" + playerJ;
      var chartData = {
        label: label,
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        pointBorderWidth: 0.5,
      };

      if (clusteringList[i][j]) {
        let tmp = inputData[i].swipe.keypoints.pose[j];

        if (!tmp) console.log("null");
        else {
          var buf = [];

          for (var l = 0; l < tmp.length; l++) {
            var d = 0;
            if (!tmp[l]) d = null;
            else d = tmp[l][part].x;
            buf.push(d);
          }
          chartData.data = buf;
        }
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

  drawChart(dataset);
}

var chart = null;

function drawChart(dataset) {
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
              boxWidth: 50,
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
