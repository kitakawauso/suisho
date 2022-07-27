let input = 0;
let clustering = [];

function readFile() {
  var file = document.querySelector("#getFile");

  file.onchange = function () {
    var fileList = file.files;
    var reader = new FileReader();

    reader.readAsText(fileList[0]);

    reader.onload = function () {
      input = reader.result.replace(/[\n\r]/g, "");
      input = eval("(" + input + ")");
      console.log(input);

      clustering = [];
      makeClusteringBox();
    };
  };
}

let slider = document.getElementById("slider");
slider.addEventListener("input", slideFrame);

let frame = 0;
function slideFrame() {
  frame = slider.value;
  let sliderInput = document.getElementById("sliderInput");
  sliderInput.innerHTML = slider.value;
}

let clusteringBox = document.getElementById("clusteringBox");
function makeClusteringBox() {
  while (clusteringBox.firstChild) {
    clusteringBox.removeChild(clusteringBox.firstChild);
  }

  for (var i = 0; i < input.swipe.keypoints.pose.length; i++) {
    clustering.push(1);

    var element = document.createElement("input");
    element.type = "checkbox";
    element.id = "cluster" + i;
    element.value = i;
    element.checked = true;
    element.addEventListener("change", clusterChange);

    var label = document.createElement("label");
    label.htmlFor = "cluster" + i;
    label.appendChild(document.createTextNode(i));

    clusteringBox.appendChild(element);
    clusteringBox.appendChild(label);
  }
}

function clusterChange() {
  var v = this.value;
  if (this.checked) {
    clustering[v] = 1;
  } else {
    clustering[v] = 0;
  }
  // console.log(clustering);
}
