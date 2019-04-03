//co-ordinates object
function coordinates(){

};
function coordinates(row, col){
  this.row = row;
  this.col = col;
};
coordinates.prototype = {
  row: -1,
  col: -1
}
function checkisValidEntry(intersection, inserted) {
  for(var i = 0; i < inserted.length; i++) {
    var value = inserted[i];
    if(value.dir === intersection.dir){
      // console.log("SOMETHINGS OFF")
      if(intersection.dir === "down"){
        // console.log("Really off");
        if(intersection.start.col === value.start.col) {
          // console.log("intersection", intersection);
          // console.log("value", value);
          // console.log(intersection.word, intersection.start, intersection.end);
          // console.log(value.word, value.start, value.end);
          if(intersection.start.row <= value.start.row && intersection.end.row <= value.end.row){

            // console.log("here");
            // console.log("intersection", intersection);
            // console.log("value", value);
            return false;
          } else {
            return true;
          }
        }
      } else if(intersection.dir === "across"){
        // console.log("Really off");
        if(intersection.start.row === value.start.row) {
          // console.log(intersection.word, intersection.start, intersection.end);
          // console.log(value.word, value.start, value.end);
          if(intersection.start.col <= value.start.col && intersection.end.col <= value.end.col){
            // console.log("here");
            console.log(value.word, intersection.word);
            // console.log("intersection", intersection);
            // console.log("value", value);
            return false;
          } else {
            return true;
          }
        }
      }
    }
  }
  return true;
}
function checkIntersection(word, inserted){
  var intersections = new Array();
  var dir, toInsertValstart, toInsertValend;
  try {
    inserted.forEach((val, index) => {
      for(var i = 0; i < word.length; i++){
        for(var j = 0; j < val.word.length; j++){
          if(word.charAt(i) === val.word.charAt(j)){
            if(val.dir === "down") {
              var inBoardValCoords = new coordinates(j, val.start.col);
              dir = "across";
              toInsertValstart = new coordinates(j, val.start.col - i);
              toInsertValend = new coordinates(j, val.start.col - i + (word.length-1));
            } else if(val.dir === "across"){
              var inBoardValCoords = new coordinates(val.start.row, j);
              dir = "down";
              toInsertValstart = new coordinates(val.start.row - i, j);
              toInsertValend = new coordinates(val.start.row - i + (word.length-1), j);
            } else {
              throw error("inBoardValCoords not defined");
            }
            var intersection = {inBoardVal: val, toInsertVal: word.charAt(i), inBoardValIndex: j, toInsertValIndex: i, coords: inBoardValCoords};
            var isValid = checkisValidEntry({dir: dir, start: toInsertValstart, end: toInsertValend, word: word}, inserted)
            if(isValid === true){
              intersections.push(intersection);
            }

          }
        }
      }
    })
    return intersections;
  } catch(error) {
    alert(error);
  }

}
function checkEmpty(arr) {
  return arr.every((char)=>{
    return char === "."
  })
}
function addTogrid(grid, word, inserted, words_to_insert){ //inserts a word in the grid after analysing a good position
  // console.log(grid.every(checkEmpty));
  if(grid.every(checkEmpty) === true){
    for(var i = 0; i< word.length; i++){
      grid[i][0] = word.charAt(i);
    }
    var index = words_to_insert.indexOf(word);
    words_to_insert.splice(index, 1);
    inserted.push({word: word, start: new coordinates(0,0), end: new coordinates(word.length,0), dir: "down"});
  } else {
    var intersections = checkIntersection(word, inserted);
    console.log(word, intersections);
    if(intersections.length != 0) {
      //take the first intersections
      var varInBoard = intersections[0].inBoardVal;

      if(varInBoard.dir === "down"){
        if(varInBoard.start.col - intersections[0].toInsertValIndex < 0){
          //TODO: define shift
          // shiftWord(varInBoard, grid, toInsertValIndex - varInBoard.start.col);

        } else {
          var startIndex = intersections[0].coords.col - intersections[0].toInsertValIndex;
          for(var i = startIndex; i < (word.length + startIndex); i++) {
            grid[intersections[0].coords.row][i] = word.charAt(i);

          }
          inserted.push({
            word: word,
            start: new coordinates(intersections[0].coords.row, startIndex),
            end: new coordinates(intersections[0].coords.row, startIndex+word.length),
            dir: "across"});
        }
      } else if(varInBoard.dir === "across") { //TODO: insert vertically
        if(varInBoard.start.row - intersections[0].toInsertValIndex < 0){
          //shift the board
        } else {
          var startIndex = intersections[0].coords.row - intersections[0].toInsertValIndex;
          for(var i = startIndex; i < (word.length + startIndex); i++){
            grid[i][intersections[0].coords.col] = word.charAt(i);
          }
        }
      }
    } else {
      //TODO: need to backtrack
    }
    // console.log(intersections);
    // intersections.forEach((val, index)=>{
    //     if(inserted[0].dir === "dir") { //TODO: replace this values with value which was checked for intersections
    //       var inBoardValStart = inserted.find((value)=>{
    //         return val.inBoardVal.val.word === inserted[0].word;
    //       }).start.x
    //       console.log("inBoardValStart", inBoardValStart);
    //       var start = inBoardValStart + val.i1;
    //       if(inBoardValStart === 0 && val.i2 === 0){
    //         for(var i = 0; i < word.length; i++) {
    //           grid[start][i] = word.charAt(i);
    //         }
    //       }
    //     } else {
    //
    //     }
    // })

  }
}

function printToScreen(grid) {
  grid.forEach((item, index) => {
    $("#root").append("<div id="+index.toString()+"></div>")


    item.forEach((char, i) => {
      // console.log("index: ", index);
      var id = "#"+index.toString();
      if(char !== "."){
        $(id).append("<div class='crossword-box'>"+char+"</div>");
      } else {
        $(id).append("<div class='no-char'>"+char+"</div>")
      }


    })
  })
}

//-------Main loop---------
$("document").ready(()=>{
  var grid_length = 10;
  var grid = new Array(grid_length);
  for(var i = 0; i < grid_length; i++){
    grid[i] = new Array(grid_length);
  }
  for(var i = 0; i<grid_length; i++){
    for(var j = 0; j < grid_length; j++){
      grid[i][j]  = "."
    }
  }
  // for(i=0; i<)
  var words = ["strawberry","banana", "apple", "orange"];
  // words.sort();
  // words.reverse();
  console.log(words);
  var words_to_insert = ["strawberry","banana", "apple", "orange"];
  var inserted = new Array();
  words.forEach((val) => {
    console.log("words" , val);
    addTogrid(grid, val, inserted, words_to_insert);
  })
  // addTogrid(grid, words[0]);
  // console.log(grid);
  // console.log(grid[0])
  printToScreen(grid);
})
