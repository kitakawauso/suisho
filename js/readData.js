let playerNum = 0;
let input = [[], []];
let clustering = [[], []];

function readFile(file) {
  var fileList = file.files;
  var reader = new FileReader();

  reader.readAsText(fileList[0]);

  reader.onload = function () {
    var tmp = file.className;
    if (tmp == "player0") playerNum = 0;
    else if (tmp == "player1") playerNum = 1;

    var buf;
    buf = reader.result.replace(/[\n\r]/g, "");
    input[playerNum] = eval("(" + buf + ")");
    console.log(input);

    var nextNext = file.nextElementSibling.nextElementSibling;
    makeClusteringBox(nextNext);
  };
}

function makeClusteringBox(nextNext) {
  var clusteringBox = nextNext;
  while (clusteringBox.firstChild) {
    clusteringBox.removeChild(clusteringBox.firstChild);
  }

  clustering[playerNum] = [];

  for (var i = 0; i < input[playerNum].swipe.keypoints.pose.length; i++) {
    clustering[playerNum].push(1);

    var element = document.createElement("input");
    element.type = "checkbox";
    element.id = "cluster" + i;
    element.value = i;
    element.checked = true;
    element.addEventListener("change", clusterChange);

    var label = document.createElement("label");
    label.appendChild(element);
    label.appendChild(document.createTextNode(i));

    clusteringBox.appendChild(label);
  }
}

function clusterChange() {
  var p = 0;
  var tmp = this.parentElement.parentElement.className;
  if (tmp == "player0") p = 0;
  else if (tmp == "player1") p = 1;

  var v = this.value;

  if (this.checked) {
    clustering[p][v] = 1;
  } else {
    clustering[p][v] = 0;
  }
  // console.log(clustering);
}

let slider = document.getElementById("slider");
slider.addEventListener("input", slideFrame);

let frame = 0;
function slideFrame() {
  frame = slider.value;
  let sliderInput = document.getElementById("sliderInput");
  sliderInput.innerHTML = slider.value;
}
