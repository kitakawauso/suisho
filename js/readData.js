const clusteringBox0 = document.getElementById("clusteringBox0");
const clusteringBox1 = document.getElementById("clusteringBox1");
const graphPartsBox0 = document.getElementById("graphPartsBox0");
const graphPartsBox1 = document.getElementById("graphPartsBox1");
const allCheckBox0 = document.getElementById("allCheckBox0");
const allCheckBox1 = document.getElementById("allCheckBox1");

let playerNum = 0;
let playerColors = [];

let input = [[], []];
let clustering = [[], []];
let part = [14, 14];
let coordinate = "x";

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

    if (!playerNum) makeClusteringBox(clusteringBox0, playerNum);
    else if (playerNum) makeClusteringBox(clusteringBox1, playerNum);

    var length0 = clustering[0].length;
    var length1 = clustering[1].length;
    playerColors = createColorList(length0, length1);
    console.log(playerColors);

    pushChartData(input, clustering, part, coordinate);
  };
}

function makeClusteringBox(clusteringBox, n) {
  while (clusteringBox.firstChild) {
    clusteringBox.removeChild(clusteringBox.firstChild);
  }

  clustering[n] = [];

  for (var i = 0; i < input[n].swipe.keypoints.pose.length; i++) {
    clustering[n].push(1);

    var element = document.createElement("input");
    element.type = "checkbox";
    element.id = "cluster" + n;
    element.value = i;
    element.checked = true;
    element.addEventListener("change", clusterChange);

    var label = document.createElement("label");
    label.appendChild(element);
    label.appendChild(document.createTextNode(i));

    clusteringBox.appendChild(label);
  }

  if (!n) {
    graphPartsBox0.hidden = false;
    allCheckBox0.hidden = false;
  } else if (n) {
    graphPartsBox1.hidden = false;
    allCheckBox1.hidden = false;
  }
}

function clusterChange() {
  var n = 0;
  var tmp = this.id;
  if (tmp == "cluster0") n = 0;
  else if (tmp == "cluster1") n = 1;

  var v = this.value;

  if (this.checked) {
    clustering[n][v] = 1;
  } else {
    clustering[n][v] = 0;
  }
  // console.log(clustering);
  checkChecked(n);
  pushChartData(input, clustering, part, coordinate);
}

let slider = document.getElementById("slider");
slider.addEventListener("input", slideFrame);

let frame = 0;
function slideFrame() {
  frame = slider.value;
  let sliderInput = document.getElementById("sliderInput");
  sliderInput.innerHTML = slider.value;
}

function checkChecked(n) {
  var tf = true;
  for (var i = 0; i < clustering[n].length; i++) {
    if (!clustering[n][i]) tf = false;
  }

  var check;
  if (!n) check = allCheckBox0.children[0];
  else if (n) check = allCheckBox1.children[0];

  check.checked = tf;
}

function allCheck(allCheckBox, n) {
  var tf = allCheckBox.checked;
  var v;
  if (tf) v = 1;
  else if (!tf) v = 0;

  for (var i = 0; i < clustering[n].length; i++) {
    clustering[n][i] = v;
    if (!n) clusteringBox0.children[i].children[0].checked = tf;
    else if (n) clusteringBox1.children[i].children[0].checked = tf;
  }
  console.log(clustering);
  pushChartData(input, clustering, part, coordinate);
}

function partsChange(select) {
  var tmp = select.className;
  if (tmp == "player0") p = 0;
  else if (tmp == "player1") p = 1;

  part[p] = select.value;
  pushChartData(input, clustering, part, coordinate);
}

function coordinateChecked(value) {
  coordinate = value;
  pushChartData(input, clustering, part, coordinate);
}
