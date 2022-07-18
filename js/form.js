let nameInput = document.getElementById("nameForm");
let ageInput = document.getElementById("ageForm");
let gradeInput = document.getElementById("gradeForm");
let tallInput = document.getElementById("tallForm");
let genderInput = document.getElementsByName("genderForm");
let handInput = document.getElementsByName("handForm");
let styleInput = document.getElementById("styleForm");
let bodyInput = document.getElementById("bodyForm");

function radioChecked(formInput) {
  let ans;
  for (let i = 0; i < formInput.length; i++) {
    if (formInput.item(i).checked) {
      ans = formInput.item(i);
    }
  }
  return ans;
}

function settingOnClick() {
  outputData.player.name = nameInput.value;
  outputData.player.age = ageInput.value;
  outputData.player.grade = gradeInput.value;
  outputData.player.tall = tallInput.value;
  outputData.player.gender = radioChecked(genderInput).value;
  outputData.player.hand = radioChecked(handInput).value;
  outputData.player.style = styleInput.value;
  outputData.player.body = bodyInput.value;
  console.log(outputData.player);

  camera.start();
  writeToConsole("Please set card position.", "state");
}
