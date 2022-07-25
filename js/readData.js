let inputData = [];

function readFile() {
  var file = document.querySelector("#getFile");

  file.onchange = function () {
    var fileList = file.files;
    var reader = new FileReader();

    reader.readAsText(fileList[0]);

    reader.onload = function () {
      var input = reader.result.replace(/[\n\r]/g, "");
      input = eval("(" + input + ")");
      console.log(input);

      inputData = input.swipe[0].keypoints.pose;
      console.log(inputData);
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
