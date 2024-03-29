// console log begin
const consoleLog = document.getElementById("consoleLog");
const stateLog = document.getElementById("stateLog");
function writeToConsole(msg, type) {
  if (type == "msg") {
    consoleLog.innerHTML += msg + "<br>";
  } else if (type == "state") {
    stateLog.innerHTML = msg;
  }
}
// console log begin

// card position set begin
let recordState = "waiting";

let column = 15;
let tr;
let row = 6;

function cardOnClick(td) {
  if (recordState == "recording") {
    writeToConsole("Can't change card during recording1sec.", "msg");
  } else {
    let currentChecked = document.getElementsByClassName("swipeCard");
    currentChecked[0].classList.remove("swipeCard");

    column = td.cellIndex;
    tr = td.parentNode;
    row = tr.sectionRowIndex;

    td.classList.add("swipeCard");
    writeToConsole("card position is " + row + " " + column + ".", "msg");
    writeToConsole("Please set repeat counter.", "state");
  }
}
// card position set end

// counter begin
const counterText = document.getElementById("counterText");
let maxRepeat = 1;

function downRepeat() {
  if (counterText.value > 1) {
    counterText.value--;
  }
  maxRepeat = counterText.value;
  // writeToConsole("repeat counter is " + maxRepeat + ".", "msg");
  writeToConsole("Let's start recording.", "state");
}

function upRepeat() {
  counterText.value++;
  maxRepeat = counterText.value;
  // writeToConsole("repeat counter is " + maxRepeat + ".", "msg");
  writeToConsole("Let's start recording.", "state");
}
// counter end
