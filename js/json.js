const outputData = {
  player: {
    name: "unknown",
    age: 0,
    grade: 0,
    tall: 0,
    career: 0,
    gender: 0,
    hand: 0,
    style: 0,
    body: 0,
  },
  swipe: [],
};

// data structure
// outputData -> swipe(swipeData) -> keypoints -> pose          -> poseSwipe
//                                             -> hand -> left  -> leftHandSwipe
//                                             -> hand -> right -> rightHandSwipe

function createColorList(max1, max2) {
  var colorList = [[], []];

  for (var p = 0; p < 2; p++) {
    var first = [];
    var last = [];
    var num;
    if (p == 0) {
      first = [82, 24, 0]; // dark red
      last = [255, 141, 92]; // light blue
      num = max1;
    } else if (p == 1) {
      first = [0, 29, 82]; // dark blue
      last = [92, 149, 255]; // light blue
      num = max2;
    }

    var step = [[], [], []];
    step[0] = (last[0] - first[0]) / num;
    step[1] = (last[1] - first[1]) / num;
    step[2] = (last[2] - first[2]) / num;

    for (var i = 0; i < num; i++) {
      var tmp = [[], [], []];
      for (var j = 0; j < 3; j++) {
        tmp[j] = first[j] + step[j] * i; // ここうまくいってない、同じ数値になる
      }
      colorList[p].push(tmp);
    }
  }

  return colorList;
}
