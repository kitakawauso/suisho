let input = 0;

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

      // inputData = input.swipe[0].keypoints.pose;

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
  for (var i = 0; i < input.swipe.length; i++) {
    var element = document.createElement("input");
    element.type = "checkbox";
    element.id = "cluster" + i;
    element.value = i;
    element.addEventListener("change", clusterChange);

    var label = document.createElement("label");
    label.htmlFor = "cluster" + i;
    label.appendChild(document.createTextNode(i));

    var br = document.createElement("br");

    clusteringBox.appendChild(element);
    clusteringBox.appendChild(label);
    clusteringBox.appendChild(br);
  }
}

function clusterChange() {
  // TODO: cluster changing
}
