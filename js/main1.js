/* function create_grid(size)

  Description: initializes a 2-dimensional grid of size "size". All places are initialized to empty strings

  input:        size - size of the array to be initialized

  output:       grid - 2-dimensional array of size "size"

*/
function create_grid(size) {
  var grid_length = size;
  var grid = new Array(grid_length);
  for(var i = 0; i < grid_length; i++){
    grid[i] = new Array(grid_length);
  }
  for(var i = 0; i<grid_length; i++){
    for(var j = 0; j < grid_length; j++){
      grid[i][j]  = ""
    }
  }
  return grid;
}

var sizeOfBoard = 12;

/*
  function checkIfCorrect(selectedWord, grid)

  Description: checks whether a word inserted in grid is correct
  input:       selectedWord - of type wordInGrid, containing the currently selected word on grid.
               grid         - the 2-dimensional grid representing the crossword.
*/
function checkIfCorrect(selectedWord, grid) {
  var isCorrect = true;
  if(selectedWord !== null){
    if(selectedWord.dir === "down"){
      for(var i = 0; i < selectedWord.word.length; i++){
        var id = "#"+(selectedWord.start+i).toString() + "-" + selectedWord.pos.toString();
        if((grid[selectedWord.start + i][selectedWord.pos] !== $(id).html()) && $(id).hasClass("filled") === false){
          isCorrect = false;
        }
      }
    } else {
      for(var i = 0; i < selectedWord.word.length; i++){
        var id = "#"+selectedWord.pos.toString() + "-" + (selectedWord.start+i).toString();
        if(grid[selectedWord.pos][selectedWord.start+i] !== $(id).html() && $(id).hasClass("filled") === false){
          isCorrect = false;
        }
      }
    }
    if(isCorrect === true){
      if(selectedWord.dir === "down"){
        for(var i = 0; i < selectedWord.word.length; i++){
          var id = "#"+(selectedWord.start+i).toString() + "-" + selectedWord.pos.toString();
          $(id).removeClass("un-filled");
          $(id).addClass("filled");
        }
      } else {
        for(var i = 0; i < selectedWord.word.length; i++){
          var id = "#"+selectedWord.pos.toString() + "-" + (selectedWord.start+i).toString();
          $(id).removeClass("un-filled");
          $(id).addClass("filled");
        }
      }
    }
  }
}

/*  function initializeBoard(word)

    Description: puts the first word in grid vertically in the middle of the board

    input:       word - first word to be inserted in grid

    output:      grid - grid containing only the first word

*/
function initializeBoard(word) {
  var grid = create_grid(sizeOfBoard);
  var start = Math.floor((sizeOfBoard - (word.length-1))/2);
  var middleCol = Math.floor((sizeOfBoard/2));
  var wordIndex  = 0;
  for(var i = start; i < (start + word.length-1); i++) {
    grid[i][middleCol] = word.charAt(wordIndex);
    wordIndex++;
  }
  return grid;
}

var selectedWord = null;
var selectedCharId = null;

/*
  function checkWinningCondition(grid, inserted)

  Description: checks to see if the entire crossword has been filled completely

  input:  grid     - 2-dimensional grid representing the solved crossword
          inserted - an array of type wordInGrid, representing the words inserted
                     in the grid.
*/
function checkWinningCondition(grid, inserted) {
  var won = true;
  var id;
  inserted.forEach(function(insert, i){
    for(var i = insert.start; i < insert.end+1; i++){
      if(insert.dir=== "across"){
        id = "#"+insert.pos.toString() + "-"+i.toString();
        if($(id).text() !== grid[insert.pos][i] && ($(id).hasClass("filled")===false)){
          won = false;
        }
      } else {
        id = "#"+ i.toString() + "-"+insert.pos.toString();
        if($(id).text()!== grid[i][insert.pos] && ($(id).hasClass("filled")===false)){
          won =false;
        }
      }
    }
  });
  return won;
}

/*
  function addOnClickHandler(grid, inserted, keyBoardChars, isImageGrid)
  Description: adds on click handler for crossword words in grid, and  for keyBoard
                characters on screen
  input:       grid         - 2-dimensional grid containing the grid
               inserted     - an array of type wordInGrid, representing words inserted in
                              grid
               keyBoardChar - an array of strings containing letters needed to be
                              inserted in grid.
               isImageGrid  - bool indicating whether the grid will have pictures
                              or not
*/
function addOnClickHandler(grid, inserted, keyBoardChars, isImageGrid) {
  $(".un-filled").on("click", function selectWord(event){
    var id = event.target.id;
    var id1 = id.split("-");
    var row = parseInt(id1[0]);
    var col = parseInt(id1[1]);
    if(selectedCharId !== id && selectedCharId !== null) {
      $("#"+selectedCharId).removeClass("focused");
    }
    if($("#"+id).hasClass("filled")===false){
      $("#"+id).addClass("focused");
    }
    selectedCharId = id;
    var targetWord;

    inserted.forEach(function(value, index) {
      if(value.dir === "across") {
        if(value.pos === row && (col >= value.start && col <= value.end)){
          targetWord = value;
        }
      } else {
        if((value.pos === col) && (row >= value.start && row <= value.end)){
          targetWord = value;
        }
      }
    });
    if(selectedWord !== null){
      for(var i = 0; i < selectedWord.word.length; i++){
        if(selectedWord.dir === "across"){
          var id = "#"+selectedWord.pos.toString() + "-" + (selectedWord.start + i).toString();
          $(id).removeClass("selected");
        } else {
          var id = "#"+ (selectedWord.start + i).toString() + "-" + selectedWord.pos.toString();
          $(id).removeClass("selected");
        }
      }
    }
    selectedWord = targetWord;

    for(var i = 0; i < targetWord.word.length; i++){
      if(targetWord.dir === "across") {
        var id = "#"+targetWord.pos.toString() + "-" + (targetWord.start + i).toString();
        if($(id).hasClass("filled") === false){
          $(id).addClass("selected");
        }
      } else {
        var id = "#"+ (targetWord.start + i).toString() + "-" + targetWord.pos.toString();
        if($(id).hasClass("filled") === false){
          $(id).addClass("selected");
        }
      }
    }
  });
  var targetWord;
  $("#keyBoard > *").on("click", function(event) {
    if(selectedCharId !== null) {
      var char = $(this).html();
      var rowString = selectedCharId.split("-")[0]
      var colString = selectedCharId.split("-")[1]
      var row = parseInt(rowString);
      var col = parseInt(colString);
      if($("#"+selectedCharId).hasClass("filled") === false){
        $("#"+selectedCharId).html(char);
      }
      $("#"+selectedCharId).removeClass("focused");
      checkIfCorrect(selectedWord, grid);
      if(selectedWord.dir === "across") {
        if(selectedWord.end !== col) {
          col = col+1;
          if($("#"+rowString+"-"+ col.toString()).hasClass("filled")){
            col = col + 1;
          }
          if (selectedWord.end + 1 !== col) {
            if($("#"+rowString+"-"+ col.toString()).hasClass("filled") === false){
              $("#"+rowString+"-"+ col.toString()).addClass("focused");
            }
            selectedCharId = rowString+"-"+(col).toString();
          }
        } else {
          selectedCharId = null;
        }
      } else {
        if(selectedWord.end !== row) {
          row = row+1;
          if($("#"+row.toString()+"-"+colString).hasClass("filled")){
            row = row + 1;
          }
          if(selectedWord.end + 1 !== row){
            if($("#"+row.toString()+"-"+colString).hasClass("filled") === false){
              $("#"+row.toString()+"-"+colString).addClass("focused");
            }
            selectedCharId = row.toString() + "-"+(col).toString();
          } else {
            selectedCharId = null;
          }
        } else{
          // checkIfCorrect(selectedWord, grid);
          selectedCharId = null;
        }
    }
    var won = checkWinningCondition(grid, inserted);
  }

    if(won === true){
      alert("Congratulations, You Won!");
    }
  })
}

/*
  function printKeyBoard(keyBoardChars)
  Description:  prints the keyBoard array on screen by adding divs

  input:        keyBoardChars - an array of strings containing letters
*/
function printKeyBoard(keyBoardChars) {
  $("#keyBoard").outerWidth($(window).outerWidth())
  keyBoardChars.forEach(function(char, index) {
    $("#keyBoard").append("<div >"+char+"</div>");
  })
}
/*
  function printGrid(grid)
  Description:  converts the 2-dimensional grid into an array of divs, and inserts
                empty boxes, transparent boxes and images where necessary
  input:        grid - A 2-dimensional array representing the crossword
*/
function printGrid(grid){
  grid.forEach(function(item, index) {
    $("#root").append("<div class='row' id="+index.toString()+"></div>")

    item.forEach(function(char, i) {
      var id = "#"+index.toString();
      var id1 = "id="+index.toString()+"-"+i.toString();
      if(char === ""){
        $(id).append("<div class='no-char' "+id1+"></div>");
      } else if(char.length > 1){
        $(id).append("<div class='crossword-box' "+id1+"><img class='hints' alt='"+char+"' src = 'images/"+char+".jpg'></div>");
      }
      else {
        $(id).append("<div class='crossword-box char un-filled' "+id1+"></div>");
      }
    })
  })
}
/*
  function printFirstLetter(inserted, grid)
  Description: prints first letter of each word in the crossword to the screen.
               If crossword is a hints crossword also appends divs containing
               hints.
  input:       inserted - an array of type wordInGrid, containing all the words
                          in grid
               grid     - A 2-dimensional array representing the crossword
*/
function printFirstLetter(inserted, grid, isImageGrid, hints) {
  inserted.forEach(function (value, index){
    if(isImageGrid === false) {
      var hint;
      hints.forEach(function(val, i){
        if(val.word === (value.word).toLowerCase()){
          hint = val.hint;
        }
      })
      if(value.dir === "across") {
        $("#across").append("<div>"+(index+1).toString()+". "+ hint);
        $("#across1").append("<div>"+(index+1).toString()+". "+ hint);
      } else {
        $("#down").append("<div>"+(index+1).toString()+". "+ hint);
        $("#down1").append("<div>"+(index+1).toString()+". "+ hint);
      }
    }
    if(value.dir === "across") {
      var id = "#"+value.pos.toString() + "-" + value.start.toString();
      if(isImageGrid === true) {
        $(id).html(grid[value.pos][value.start])
      } else {
        $(id).html("<div class = 'num'>"+(index+1).toString()+"</div><div class='hinted'>" + grid[value.pos][value.start] + "</div>");
      }
      $(id).removeClass("un-filled");
      $(id).addClass("filled");
    } else {
      var id = "#"+value.start.toString() + "-" + value.pos.toString();
      if(isImageGrid === true) {
        $(id).html(grid[value.start][value.pos]);
      } else {
        $(id).html("<div class = 'num'>"+(index+1).toString()+"</div><div class='hinted'>"+grid[value.start][value.pos]+"</div>");
      }
      $(id).removeClass("un-filled");
      $(id).addClass("filled");
    }
  })
}

function orientationchangeGrid(isImageGrid){
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  var width;
  if(windowWidth > windowHeight){
    var keyBoardWidth = Math.floor(windowHeight*0.09);
    $("#keyBoard > *").css("width", keyBoardWidth.toString()+"px");
    $("#keyBoard > *").css("height", keyBoardWidth.toString()+"px");
    $("#keyBoard > *").css("padding-top", ((keyBoardWidth*0.25)-1).toString()+"px");
    $("#keyBoard > *").css("font-size", ((keyBoardWidth*0.5)-2).toString()+"px");
  } else {
    var keyBoardWidth = Math.floor(windowWidth*0.1);
    $("#keyBoard > *").css("width", keyBoardWidth.toString()+"px");
    $("#keyBoard > *").css("height", keyBoardWidth.toString()+"px");
    $("#keyBoard > *").css("padding-top", ((keyBoardWidth*0.25)-1).toString()+"px");
    $("#keyBoard > *").css("font-size", ((keyBoardWidth*0.5)-2).toString()+"px");
  }
  $("#keyBoard").outerWidth(windowWidth);
  $(".content").outerHeight((windowHeight - $("h1").outerHeight(true) - $("#keyBoard").outerHeight(true)));
  $(".hints-button").css("display", "none");
  $("#hints").css("display", "none");
  if(windowWidth < windowHeight){
    if(isImageGrid === false){
      $(".hints-button").css("display", "inline-block");
      $("#hints").css("display", "none");
    }
    width = $(".content").outerHeight(true) - $(".content > p").outerHeight(true);
    if(width > windowWidth) {
      width = windowWidth;
    }
  } else {

    if(isImageGrid === false){
      $(".hints-button").css("display", "none");
      $("#hints").css("display", "inline-block");
    }
    width = $(".content").outerHeight(true);
  }
  if(width>800){
    width *= 0.8;
  }

  $("#root").outerWidth(width);
  $("#root").outerHeight(width);
  var boxWidth = Math.floor(width/(sizeOfBoard));
  var boxHeight = Math.floor(width/(sizeOfBoard));
  var stringHeight = boxHeight.toString() + 'px';
  $(".row").css("height", stringHeight);
  $("[class *= 'char']").outerWidth(boxWidth);
  $("[class *= 'char']").outerHeight(boxWidth);
  $(".crossword-box").outerWidth(boxWidth);
  $(".crossword-box").outerHeight(boxWidth);
  $(".hints").outerWidth(boxWidth);
  $(".hints").outerHeight(boxWidth);

  var padding = (boxWidth * 0.6) - 2;
  $(".char").css("font-size", (boxWidth-(padding)-2).toString()+"px");
  $(".char").css("padding-top", padding/2);
  $(".char").has(".num").css("padding-top", "0");
  $(".hinted").css("line-height", (boxWidth-2).toString()+"px");
  $(".num").css("font-size", (padding/2).toString()+"px");
  $(".num").css("height", (padding/2).toString()+"px");
  var buttonWidth = $(".hints-button").outerHeight();
  if(isImageGrid === false){
    $("#root").addClass("root-inline");
    $("#hints").addClass("hints-inline");
  }
}

/*
  function printToScreen(grid)
  Description: converts the 2-dimensional grid into a grid of divs to be printed on screen.
               Checks whether a grid location contains an empty string, an image or a char and
               creates div accordingly

  input:       grid - a 2-dimensional array with chars in places where a word is present and name of image file
                      where image should be inserted, and an empty string where div should be empty
*/

function printToScreen(grid, inserted, keyBoardChars, isImageGrid, hints) {

  printGrid(grid);

  if(isImageGrid === false) {
    $("#hints").append("<p>Hints</p>")
    $("#hints").append("<div id = 'across'>Across</div>")
    $("#hints").append("<div id = 'down'>Down</div>")
  }

  printFirstLetter(inserted, grid, isImageGrid, hints);

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  var width, keyBoardWidth;

  //Decides what width and height crossword box should have
  if(windowWidth > windowHeight){
    keyBoardWidth = Math.floor(windowHeight*0.09);
  } else {
    keyBoardWidth = Math.floor(windowWidth*0.1);
  }

  $("#keyBoard > *").css("width", keyBoardWidth.toString()+"px");
  $("#keyBoard > *").css("height", keyBoardWidth.toString()+"px");
  $("#keyBoard > *").css("padding-top", ((keyBoardWidth*0.25)-1).toString()+"px");
  $("#keyBoard > *").css("font-size", ((keyBoardWidth*0.5)-2).toString()+"px");

  $("#keyBoard").outerWidth(windowWidth);
  $(".content").outerHeight((windowHeight - $("h1").outerHeight(true) - $("#keyBoard").outerHeight(true)));
  $(".hints-button").css("display", "none");
  $("#hints").css("display", "none");
  if(windowWidth < windowHeight){
    if(isImageGrid === false){
      $(".hints-button").css("display", "inline-block");
      $("#hints").css("display", "none");
    }
    width = $(".content").outerHeight(true) - $(".content > p").outerHeight(true);
    if(width > windowWidth) {
      width = windowWidth;
    }
  } else {

    if(isImageGrid === false){
      $(".hints-button").css("display", "none");
      $("#hints").css("display", "inline-block");
    }
    width = $(".content").outerHeight(true);
  }
  if(width>800){
    width *= 0.8;
  }

  $("#root").outerWidth(width);
  $("#root").outerHeight(width);
  var boxWidth = Math.floor(width/(sizeOfBoard));
  var boxHeight = Math.floor(width/(sizeOfBoard));
  var stringHeight = boxHeight.toString() + 'px';
  $(".row").css("height", stringHeight);
  $("[class *= 'char']").outerWidth(boxWidth);
  $("[class *= 'char']").outerHeight(boxWidth);
  $(".crossword-box").outerWidth(boxWidth);
  $(".crossword-box").outerHeight(boxWidth);
  $(".hints").outerWidth(boxWidth);
  $(".hints").outerHeight(boxWidth);
  var padding = (boxWidth * 0.6) - 2;

  $(".char").css("font-size", (boxWidth-(padding)-2).toString()+"px");
  // $(".char").css("padding-top", "0");
  $(".char").css("padding-top", padding/2);
  $(".char").has(".num").css("padding-top", "0");
  $(".hinted").css("line-height", (boxWidth-2).toString()+"px");
  $(".num").css("font-size", (padding/2).toString()+"px");
  $(".num").css("height", (padding/2).toString()+"px");

  // $(".num").css("margin-top", "-"+ (padding/3).toString()+"px");
  var buttonWidth = $(".hints-button").outerHeight();
  if(isImageGrid === false){
    $("#root").addClass("root-inline");
    $("#hints").addClass("hints-inline");
  }
}

/*
  function wordInGrid(word, dir, start, end, pos)

  Description: constructor for object wordInGrid, initializes values according to parameters
  input:       word   - string signifying the word
               dir    - across or down
               start  - start position of word in grid
               end    - end position of word in grid
               pos    - if dir is across, pos signifies row of word. And if dir is down
                        pos signifies column of word
*/

function wordInGrid(word, dir, start, end, pos) {  //data structure defining a word Inserted in grid telling the start, end and direction (across or down)
  this.word = word;
  this.dir = dir;
  this.start = start;
  this.end = end;
  this.pos = pos; // index in row or column
}
wordInGrid.prototype = {
  word: "",
  dir: "",
  start: -1,
  end: -1,
  pos: -1
}

/*
  function checkisValidEntry(intersection, wordsInserted, intersectingWord)

  Description: checks if the intersection is valid or not by checking if it crosses another word or
               if it goes outside the board

  input:       intersection     - of type wordInGrid signifying a potential place a word can be inserted in
               wordsInserted    - an array of type wordInGrid containing words already in grid
               intersectingWord - a word of type wordInGrid signifying the word "intersection" is intersecting with
  output       bool             - true if intersection is valid,
                                  false if intersection is invalid.
*/

function checkisValidEntry(intersection, wordsInserted, intersectingWord) {
  for(var i = 0; i < wordsInserted.length; i++){
    if((intersection.start < 0) || (intersection.end > (sizeOfBoard-1)) || (intersection.pos < 0) || (intersection.pos > (sizeOfBoard - 1))) {
      return false;
    }

    if((intersection.dir === wordsInserted[i].dir) &&
      ((intersection.pos === wordsInserted[i].pos) ||
      (((intersection.pos - 1) === wordsInserted[i].pos) && !(
        (wordsInserted[i].start === intersectingWord.pos &&
        intersection.end === wordsInserted[i].start) ||
        (wordsInserted[i].end === intersectingWord.pos &&
         intersection.start === wordsInserted[i].end))) ||
      (((intersection.pos + 1) === wordsInserted[i].pos) && !(
        (wordsInserted[i].start === intersectingWord.pos &&
        intersection.end === wordsInserted[i].start) ||
        (wordsInserted[i].end === intersectingWord.pos &&
         intersection.start === wordsInserted[i].end)))) &&
      ((intersection.start >= (wordsInserted[i].start-1) &&
        intersection.start <= wordsInserted[i].end+1) || (
        wordsInserted[i].start >= intersection.start-1 &&
        wordsInserted[i].start <= intersection.end+1))) {

          return false;
          break;
    }
    else if(wordsInserted[i].word !== intersectingWord.word &&
            intersection.dir !== wordsInserted[i].dir &&
           (intersection.end+1 >= wordsInserted[i].pos &&
            intersection.start-1 <= wordsInserted[i].pos)&&(
            intersection.pos <= wordsInserted[i].end+1 &&
            intersection.pos >= wordsInserted[i].start-1)) {
                if(!(intersection.word.charAt(wordsInserted[i].pos - intersection.start) === wordsInserted[i].word.charAt(intersection.pos - wordsInserted[i].start))){
                  return false;
                  break;
                }
    }
  }
  return true;
}

/*   function wordIntersections(word, wordsInserted)

    Description: finds and returns all valid intersection of "word" with words inserted in grid

    input:       word          - string to be checked for intersections in board
                 wordsInserted - array of words, of type wordInGrid, present in board

    output:      intersections - an array of type wordInGrid containing all possible intersection positions of "word"

*/
function wordIntersections(word, wordsInserted) {
  var intersections = new Array();
  var dir, toInsertValstart, toInsertValend;
  try {
    wordsInserted.forEach(function(valInGrid, index) {
      for(var i = 0; i < word.length; i++){
        for(var j = 0; j < valInGrid.word.length; j++){
          if(word.charAt(i) === valInGrid.word.charAt(j)){
            if(valInGrid.dir === "down") {
              dir = "across";
            } else if(valInGrid.dir === "across"){
              dir = "down";
            } else {
              throw error("inBoardValCoords not defined");
            }
            var intersection = new wordInGrid(word, dir, valInGrid.pos - i, (valInGrid.pos - i) + (word.length-1), j+valInGrid.start);
            var isValid = checkisValidEntry(intersection, wordsInserted, valInGrid);
            if(isValid === true){
              intersections.push(intersection);
            }

          }
        }
      }
    })
    return intersections;
  } catch(error) {
    console.log(error);
  }
}

/*
  function insertIngrid(grid, intersections, Inserted, wordToInsert)

  Description: inserts "intersection" in grid

  input:       grid         - the grid in which word is to be inserted
               intersection - the word to be inserted in grid
               Inserted     - an array of type wordInGrid containing words present in the grid.
                              "intersection" is pushed into this array
               wordToInsert - an array of strings containing words left to insert
*/
function insertIngrid(grid, intersection, Inserted, wordToInsert) {
  if(intersection !== null){
    var word = intersection.word;
    var wordIndex = 0;
    var start = intersection.start;
    if(intersection.start >= 0 && intersection.end < sizeOfBoard) {
      if(intersection.dir === "across"){
        for(var i = start; i < start+ word.length; i++){
          grid[intersection.pos][i] = word.charAt(wordIndex);
          wordIndex++;
        }
      } else {
        for(var i = start; i < start + word.length; i++){
          grid[i][intersection.pos] = word.charAt(wordIndex);
          wordIndex++;
        }
      }
      removeString(wordToInsert, word);
      Inserted.push(intersection);
    }
  } else {
    throw error("Null exception");
  }
}

/*
  function removeString(array, string)
  Description: function removes a string from a string of arrays

  input:       array  - an array of strings, from which a string needs to be deleted
               string - the string that needs to be deleted from the array
*/
function removeString(array, string) {
  for(var i = 0; i < array.length; i++){
    if(array[i] === string) {
      array.splice(i, 1);
    }
  }
}

/*
  function findBestIntersection(intersections, Inserted, wordToInsert)
  Description: forward checks an intersection to determine which intersection reduces
               the number of intersections for the next state the least.

  input:       intersections - an array of arrays of type wordInGrid containing possible intersections
               Inserted      - an array of type wordInGrid containing words inserted in grid.
               wordToInsert  - an array of strings containing words that remain to be inserted in the grid

  output:      bestVal       - of type wordInGrid signifying the best value to be inserted out of all the intersections.
*/
function findBestIntersection(intersections, Inserted, wordToInsert) {
  var possibleIntersections = new Array();
  var maxIntersections = 0;
  var zeroes = 0;
  var minZeroes = 99999;
  var bestVal = intersections[0][0];
  intersections.forEach(function(intersection, i) {
    intersection.forEach(function(val, j) {
      Inserted.push(val);

      wordToInsert.forEach(function(word, index) {
        var intersection = wordIntersections(word, Inserted);
        if(intersection !== null) {
          possibleIntersections.push(intersection);
        }
      })
      possibleIntersections.forEach(function(intersection, val) {
        if(intersection.length === 0) {
          zeroes++;
        }
      })
      if(zeroes <minZeroes) {
        minZeroes = zeroes;
        bestVal = val
      }
      Inserted.pop();
    })
  })
  if(bestVal !== null) {
    return bestVal;
  } else {
    return null;
  }
}

/*
  function findMin(possibleIntersectionsArr)
  Description: Helper function to firstofSize. Given an array of possible intersections returns the one with the
               least number of zero intersections of a word in the next state

  input:       possibleIntersectionsArr - an array of type {intersections: possibleIntersections, nextStateZeroes: zeroes, intersect: val}
                                          where "intersections" is an array of intersections that result from inserting "intersect" in the grid,
                                          and nextStateZeroes are the number of arrays having zero intersections for a given word.
  output:      minI                     - the value that has the least value for "nextStateZeroes"
*/
function findMin(possibleIntersectionsArr) {
  var min = possibleIntersectionsArr[0].nextStateZeroes;
  var minIndex = 0;
  var minI = possibleIntersectionsArr[0].intersect;
  for(var i = 0; i < possibleIntersectionsArr.length; i++ ){
    if(possibleIntersectionsArr[i].nextStateZeroes < min){
      min = possibleIntersectionsArr[i].nextStateZeroes;
      minI = possibleIntersectionsArr[i].intersect;
      minIndex = i;
    }
  }
  possibleIntersectionsArr.splice(minIndex, 1);
  return minI;
}

/*
  function firstofSize()
  Description: returns best intersections of size "size", if possibleIntersectionsArr.length
               is grater than size, or of size possibleIntersectionsArr.length if length of array is less than size
               by calculating min zeroes

  input:       possibleIntersectionsArr - an array containing intersections, number of next state zeroes,
                                          and the word that resulted in those intersections
              size                      - the size of array to be returned

  output:     sortedArr                 - array of type wordInGrid containing min "size" values.
*/

function firstofSize(possibleIntersectionsArr, size) {
  if (possibleIntersectionsArr.length > size) {
    var sortedArr = new Array(size);
    for(var i = 0; i < size; i++){
      sortedArr[i] = findMin(possibleIntersectionsArr);
    }
  } else {
    var sortedArr = [];
    var length = possibleIntersectionsArr.length;
    for(var i = 0; i < length; i++ ) {
      var minVal = findMin(possibleIntersectionsArr);
      if(minVal !== null) {
        sortedArr.push(minVal);
      }
    }
  }
  return sortedArr;
}

/*
  function findBestIntersections
  Description: takes an array of intersections and performs forward checking to determine
               intersections that reduce the next state intersections the least, and returns
               an array of size "size" containing best intersections
  input:       intersections - an array of arrays of type wordInGrid. Each sub array
                               corresponds to a word that needs to be inserted.
               Inserted      - an array of type wordInGrid containing words inserted in board
               wordToInsert  - an array of strings containing words to be inserted in grid
               size          - size of intersections array to return
  output:      firstOfSize   - an array of type wordInGrid containing best intersections of
                               size "size"

*/
function findBestIntersections(intersections, Inserted, wordToInsert, size) {
  var possibleIntersections = new Array();
  var possibleIntersectionsArr = new Array();
  var zeroes = 0;
  intersections.forEach(function(intersection, i) {
    intersection.forEach(function(val, j) {
      zeroes = 0;
      Inserted.push(val);

      wordToInsert.forEach(function(word, index) {
        var intersect = wordIntersections(word, Inserted);
        if(intersect !== null) {
          possibleIntersections.push(intersect);
        }
      })
      possibleIntersections.forEach(function(intersect) {
        if(intersect.length === 0) {
          zeroes++;
        }
      })
      possibleIntersectionsArr.push({intersections: possibleIntersections, nextStateZeroes: zeroes, intersect: val});
      Inserted.pop();
    })
  })
  var firstOfSize = firstofSize(possibleIntersectionsArr, size);
  return firstOfSize;
}

/* function initializeBoards(Inserted, wordToInsert, word, size)

   Description: Initializes n boards after evaluating possible intersections with the longest word

   input:       inserted      - an array of type wordInGrid (custom object) containing longest word in grid
                wordToInsert  - an array of type string containing words to be inserted in grid
                word          - a string representing longestWord in grid
                size          - number of boards to be initialized

   output:      boardArray   - an array containing a grid, words inserted and words to be inserted.
*/
function initializeBoards(Inserted, wordToInsert, longestWord, n) {
  var start = Math.floor((sizeOfBoard - (longestWord.length-1))/2);
  var middleCol = Math.floor((sizeOfBoard/2));
  Inserted.push(new wordInGrid(longestWord, "down", start, start+ (longestWord.length-1), middleCol));
  var intersections = new Array();
  wordToInsert.forEach(function(word,index) {
    var intersection = wordIntersections(word, Inserted);
    if(intersection !== null) {
      intersections.push(intersection);
    }
  })
  var bestIntersections = findBestIntersections(intersections, Inserted, wordToInsert, n);
  var boardArray = new Array();
  var insert, wInsert, grid;
  for(var i = 0; i < bestIntersections.length; i++) {
    grid = initializeBoard(longestWord);
    insert = Inserted.slice();
    wInsert = wordToInsert.slice();
    removeString(wInsert, bestIntersections[i].word);
    insertIngrid(grid, bestIntersections[i], insert, wInsert);
    boardArray.push({grid: grid, inserted: insert, wordToInsert: wInsert});
  }

  return boardArray;
}
/*
  function insertWords(grid, Inserted, wordToInsert)
  Description: given an array of words to insert and an array of words inserted, inserts words
               into grid after finding best intersection
  input:       grid     - the grid in which characters need to be inserted
               Inserted - an array of type wordInGrid containing all words inserted on grid
               wordToInsert - an array of type string containing words to be inserted
*/
function insertWords(grid, Inserted, wordToInsert) {
  try {
    if(wordToInsert.length === 0) {
      return;
    } else {
      var intersections = new Array();
      wordToInsert.forEach(function(word, index){
        var intersection = wordIntersections(word, Inserted);
        if(intersection !== null) {
          intersections.push(intersection);
        } else {

        }

      })
      var bestIntersection = findBestIntersection(intersections, Inserted, wordToInsert);

      if(bestIntersection !== undefined) {
        insertIngrid(grid, bestIntersection, Inserted, wordToInsert);
        insertWords(grid, Inserted, wordToInsert);
      }
    }
  } catch(error) {
      console.log(error);
  }


}

var gridRows = 0;
var gridCols = 0;

/* Description: Given an array of words returns the word with longest length
  input: words - array of words
  output: max  - longest string
*/
function longestWord(words) {
  var max = words[0];
  var maxIndex = 0;
  words.forEach(function(val, index) {
    if(val.length > max.length) {
      max = val;
      maxIndex = index;
    }
  })
  words.splice(maxIndex, 1);
  return max;
}
/*
  function findBestGrid(gridArr)
  Description: given an object containing a grid, and words to be be inserted in
               the grid, returns the grid with least number of words left to insert.
  input:       gridArr - an array of objects containing a 2-dimensional grid, words inserted,
                         and words to be inserted
  output:      bbestGrid - object with the least size of wordToInsert
*/
function findBestGrid(gridArr) {
  var bestGrid = gridArr[0]
  for(var i = 0; i < gridArr.length; i++){
    if(gridArr[i].wordToInsert.length === 0){
      return gridArr[i]
    }
    else if(gridArr[i].wordToInsert.length < bestGrid.wordToInsert.length) {
      bestGrid = gridArr[i];
    }
  }
  return bestGrid;
};

/*
  function shiftLeft(grid, words)
  Description: shifts the grid to the left and removes empty boxes to the left of the crossword.
  input:       grid  - an object containing 2-dimensional array representing the crossword,
                      inserted words, and words left to insert
               words - word left to be inserted in grid
  output:      an object containing 2-dimensional array representing the shifted crossword,
               inserted words, and words left to insert
*/
function shiftLeft(grid, words) {
  var min = 999999;
  var board;
  for(var i = 0; i < grid.inserted.length; i++) {
    if(grid.inserted[i].dir === "down") {
      if(grid.inserted[i].pos < min){
        min = grid.inserted[i].pos
      }
    } else {
      if(grid.inserted[i].start < min){
        min = grid.inserted[i].start;
      }
    }
  }
  var newGrid = create_grid(sizeOfBoard);
  var wordToInsert = words.slice();
  var Inserted = [];
  for(var i = 0; i < grid.inserted.length; i++){
    if(grid.inserted[i].dir === "down"){
      grid.inserted[i].pos -= min;
    } else {
      grid.inserted[i].start -= min;
      grid.inserted[i].end -= min;
    }
    insertIngrid(newGrid, grid.inserted[i], Inserted, wordToInsert)
  }
  return {grid: newGrid, inserted: Inserted, wordToInsert: wordToInsert};
}

/*
  function insertImages(grid, inserted, words)
  Description: inserts images' name in the grid at te start of each word
  input:       grid     - a crossword 2-dimensional grid
               inserted - of type wordInGrid containing words inserted in grid
*/
function insertImages(grid, inserted) {
  inserted.forEach(function(word, index){
    if(word.start !== 0){
      if(word.dir === "across") {
        grid[word.pos][word.start-1] = word.word;
      } else {
        grid[word.start - 1][word.pos] = word.word;
      }
    }
  });
}

/*
  function resizeGrid(grid, inserted)
  Description: adds two extra row and column to the grid for cases when a word starts or ends at grid
               boundary
  input:       grid     - grid representing crossword
               inserted - words inserted in grid
  output:      newGrid  - resized grid with two more columns and rows
*/
function resizeGrid(grid, inserted) {
  var size = sizeOfBoard +1;
  var newGrid = create_grid(size);
  for(var i = 0; i < size-1; i++){
    for(var j = 0; j < size-1; j++){
      newGrid[i+1][j+1] = grid[i][j];
    }
  }
  inserted.forEach(function(value, index) {
    value.pos += 1;
    value.start += 1;
    value.end += 1;
    inserted[index] = {word: value.word, dir: value.dir, start: value.start, end: value.end, pos: value.pos}
  });
  sizeOfBoard +=1;
  return {grid: newGrid, inserted: inserted};
}

/*
  function checkWords(words)
  Description: makes sure no word is bigger than "sizeOfBoard"
  input: words - an array of strings containing words to be inserted
*/
function checkWords(words) {
  var newWords = words.filter(function(word) {
    if(word.length-1 > sizeOfBoard-1){
      return false;
    } else {
      return true;
    }
  })
  return newWords;
}

/*
  function charInserted(keyBoardArr, char)
  Description: helper function for keyBoardChars. Checks if a char has already been inserted
               in array

  input:       keyBoardArr - an array of chars, containing letters to be in keyBoard
                             on screen
               char        - the char that needs to be checked if it is present in
                             keyBoardArr
*/
function charInserted(keyBoardArr, char) {
  for(var i = 0; i < keyBoardArr.length; i++){
    if(keyBoardArr[i] === char) {
      return true;
      break;
    }
  }
  return false;
}
/*
  function keyBoardChars(words)
  Description: returns an array of non-repeating letters found in the words in the crossword.
  input:       words - an array of strings
*/
function keyBoardChars(words) {
  var keyBoardArr = []
  words.forEach(function (word, index){
    for(var i = 0; i < word.length; i++){
      if(charInserted(keyBoardArr, word.charAt(i)) === false) {
        keyBoardArr.push(word.charAt(i))
      }
    }
  })
  return keyBoardArr;
}

/*
  function shrinkGrid(grid)

  Description:  takes a 2-dimensional grid and finds the start and end columns and
                rows and shrink the grid to have no extra columns and rows.
  input:        grid - 2-dimensional grid with all the value inserted
*/

function shrinkGrid(grid, isImageGrid) {
  var startRow, endRow, startCol, endCol;
  startRow = 999999;
  startCol = 999999;
  endRow = 0;
  endCol = 0;
  grid.inserted.forEach(function(insert, i){
    if(insert.dir === "across"){
      if(insert.start < startCol){
        startCol = insert.start;
      }
      if(insert.end > endCol){
        endCol = insert.end;
      }
      if(insert.pos < startRow) {
        startPos = insert.pos;
      }
      if(insert.pos > endRow){
        endRow = insert.pos;
      }
    } else {
      if(insert.pos < startCol) {
        startCol = insert.pos;
      }
      if(insert.pos > endCol) {
        endCol = insert.pos;
      }
      if(insert.start < startRow) {
        startRow = insert.start;
      }
      if(insert.end > endRow){
        endRow = insert.end;
      }
    }
  })
  var cols = (endCol - startCol) + 1;
  var rows = (endRow - startRow) + 1;
  var shrinkedGrid = new Array(rows);
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols + 1; j++){
      shrinkedGrid[i] = new Array(j);
    }
  }
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      shrinkedGrid[i][j] = grid.grid[i+startRow][j+startCol]
    }
  }
  grid.inserted.forEach(function(insert, index){
    if(insert.dir === "across"){
      insert.pos -= startRow;
      insert.start -= startCol;
      insert.end -= startCol;
    } else {
      insert.pos -= startCol;
      insert.start -= startRow;
      insert.end -= startRow;
    }
  })
  rows = shrinkedGrid.length;
  cols = shrinkedGrid[0].length;
  if(rows > cols){
    sizeOfBoard = rows;
    for(var i = 0; i < rows; i++){
      for(var j = 0; j<(rows-cols);j++){
        shrinkedGrid[i].push("");
      }
    }
  } else if(cols > rows) {
    sizeOfBoard = cols;
    for(var j = 0; j<(cols-rows);j++){
      var arr = [];
      for(var k = 0; k<(cols); k++){
        arr.push("");
      }
      shrinkedGrid.push(arr);
    }
  } else {
    sizeOfBoard = rows
  }
  return shrinkedGrid;
}

function addEventListeners(isImageGrid){
  // Description: changes size of grid boxes when screen is rotated.
  $(window).on("orientationchange", function(){
    orientationchangeGrid(isImageGrid);
  })

  // Description: changes size of grid boxes when screen is resized
  window.addEventListener('resize', function(event){
    orientationchangeGrid(isImageGrid);
  })

  // Description: detects when backspace is pressed and shifts focused word accordingly
  window.addEventListener("keydown", function(event){
    if(event.keyCode === 8){
      if(selectedWord !== null){
        var row = parseInt(selectedCharId.split("-")[0]);
        var col = parseInt(selectedCharId.split("-")[1]);
        if(selectedWord.dir === "across"){
          if(col-1 >= selectedWord.start && $("#"+row.toString()+"-"+(col-1).toString()).hasClass("filled") === false){
            $("#"+selectedCharId).removeClass("focused");
            selectedCharId = row.toString() + "-" + (col-1).toString();
            if($("#"+selectedCharId).hasClass("filled")===false){
              $("#"+selectedCharId).addClass("focused");
            }
          }
          else if (col - 2 >= selectedWord.start && $("#"+row.toString()+"-"+(col-1).toString()).hasClass("filled") === true){
            $("#"+selectedCharId).removeClass("focused");
            selectedCharId = row.toString() + "-" + (col-2).toString();
            if($("#"+selectedCharId).hasClass("filled")===false){
              $("#"+selectedCharId).addClass("focused");
            }
          }
        } else {
          if(row-1 >= selectedWord.start && $("#" + (row-1).toString()+"-"+col.toString()).hasClass("filled") === false) {
            $("#"+selectedCharId).removeClass("focused");
            selectedCharId = (row-1).toString() + "-" + col.toString();
            if($("#"+selectedCharId).hasClass("filled")===false){
              $("#"+selectedCharId).addClass("focused");
            }
          }
          else if(row - 2 >= selectedWord.start && $("#" + (row-1).toString()+"-"+col.toString()).hasClass("filled") === true){
            $("#"+selectedCharId).removeClass("focused");
            selectedCharId = (row-2).toString() + "-" + col.toString();
            if($("#"+selectedCharId).hasClass("filled")===false){
              $("#"+selectedCharId).addClass("focused");
            }
          }
        }
      }
    }
  })
}
/*
  function clearScreen()
  Description: clears contents on screen so when orientation changes everything is printed again
*/
function clearScreen(){
  $("#root").html("");
  $("#hints").html("");
  $("#across > div").html("");
  $("#down > div").html("");
  $("#keyBoard").html("");
}

/*
  Executes when window is ready.
  1) First initializes an array of grids of size 100
  2) for each grid, inserts all words
  3) finds grid which contains the max values of words to be inserted
  4) shifts grid to the left removing empty boxes.
  5) if any more words can be inserted in the grid, they are inserted in the board
  6) inserts images before the starting of each word in grid
  7) prints grid to screen.
  8) adds on click handlers for the grid.
*/
$(document).ready(function(){
  var words = ["potato","cauliflower", "eggplant", "beetroot", "asparagus", "broccoli", "cabbage",
                "carrot", "celery", "onion", "lettuce"];
  var hints = [{word: "potato", hint: "potato"}, {word: "cauliflower", hint: "cauliflower"}, {word: "eggplant", hint: "eggplant"},
                {word: "beetroot", hint: "beetroot"}, {word: "asparagus", hint: "asparagus"},
                {word: "broccoli", hint: "broccoli"}, {word: "cabbage", hint: "cabbage"},
                {word: "carrot", hint: "carrot"}, {word: "celery", hint: "celery"},
                {word: "onion", hint: "onion"}, {word: "lettuce", hint: "lettuce"}]; //if grid with hints

  var isImageGrid = true;
  words = checkWords(words);
  words.forEach(function(value, i) {
    words[i] = value.toUpperCase();
  })
  var wordToInsert = words.slice();

  var keyBoardArr = keyBoardChars(words);
  keyBoardArr.sort();
  printKeyBoard(keyBoardArr);
  var Inserted = new Array();
  var longestword = longestWord(wordToInsert);
  var n = 100; // number of boards to be made initially

  try {
    var InitialboardGridArr = initializeBoards(Inserted, wordToInsert, longestword, n);

    for(var i = 0; i < InitialboardGridArr.length; i++) {
      var board = InitialboardGridArr[i].grid;
      var inserted = InitialboardGridArr[i].inserted;
      var wordToInsert = InitialboardGridArr[i].wordToInsert;
      insertWords(InitialboardGridArr[i].grid, InitialboardGridArr[i].inserted,
                  InitialboardGridArr[i].wordToInsert);
    }

    var bestGrid = findBestGrid(InitialboardGridArr);

    bestGrid.grid = shrinkGrid(bestGrid, isImageGrid);
    if(isImageGrid === true){
      var shifted = resizeGrid(bestGrid.grid, bestGrid.inserted);

      bestGrid.grid = shifted.grid;
      bestGrid.inserted = shifted.inserted;
      insertImages(bestGrid.grid, bestGrid.inserted);
    }

    printToScreen(bestGrid.grid, bestGrid.inserted, keyBoardArr, isImageGrid, hints);
    addOnClickHandler(bestGrid.grid, bestGrid.inserted, keyBoardArr, isImageGrid);

    addEventListeners(isImageGrid);

  } catch(error) {
    throw error;
  }

})
