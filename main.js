const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

// global values set so static method can update class objects
let fieldWidth = 3;
let fieldHeight = 3;
let fieldPercentage = 20;

let startingXLocation;
let startingYLocation;

//Field constructor creates two-dimensional array representing the “field” itself
// A field consists of a grid containing “holes” (O) and one “hat” (^).
// We use a neutral background character (░) to indicate the rest of the field itself.
//The player’s initial location and their path is represented by *.

class Field {
  constructor() {
    this._field = [];

    // stores result of the game
    this._result;

    // coordinates of the player. Starts at 0,0
    this.xLocation;
    this.yLocation;
  }

  get field() {
    return this._field;
  }

  // print the field
  print() {
    let thisRow;
    for (let row in this._field) {
      thisRow = this._field[row].join("");
      console.log(thisRow);
    }
  }

  // generate randomised field
  static generateField(height, width, percentage) {
    fieldWidth = Number(width);
    fieldHeight = Number(height);
    fieldPercentage = Number(percentage) / 100;

    // check inputs are valid
    if (Number.isNaN(fieldWidth) || fieldWidth < 1) {
      console.log("width must be a positive number. I have set it to 5");

      fieldWidth = 5;
    }
    if (Number.isNaN(fieldHeight) || fieldHeight < 1) {
      console.log("height must be a positive number. I have set it to 5");
      fieldHeight = 5;
    }
    if (
      Number.isNaN(fieldPercentage) ||
      fieldPercentage < 0 ||
      fieldPercentage > 100
    ) {
      console.log(
        "percentage must be a positive number between 0 and 100. I have set it to 30"
      );
      fieldPercentage = 0.3;
    }

    // instantiate an empty array for population
    const newField = [];
    const totalSize = fieldWidth * fieldHeight;

    // calculate number of holes in the game (ignores starting location of the player and the hat)
    let numberOfHoles = Math.floor((totalSize - 2) * fieldPercentage);

    // fields take up all remaining space left
    let numberOfFields = totalSize - 2 - numberOfHoles;

    // create empty field
    for (let i = 0; i < fieldHeight; i++) {
      const row = [];
      for (let j = 0; j < fieldWidth; j++) {
        row.push("X");
      }
      newField.push(row);
    }

    // using fieldWith and fieldHeight create an array of all available coordinates on the field
    let availableLocations = [];
    for (let i = 0; i < fieldWidth; i++) {
      for (let j = 0; j < fieldHeight; j++) {
        availableLocations.push([i, j]);
      }
    }

    // placehodlers for x and y coordinates
    let xCoordinate;
    let yCoordinate;
    // generate random coordinates
    function randomCoordinate() {
      const index = Math.floor(Math.random() * availableLocations.length);
      let placeholder = availableLocations.splice(index, 1);
      xCoordinate = placeholder[0][0];
      yCoordinate = placeholder[0][1];
    }

    // insert player in random location
    randomCoordinate();
    newField[yCoordinate][xCoordinate] = pathCharacter;
    startingXLocation = xCoordinate;
    startingYLocation = yCoordinate;

    // insert hat in random location
    randomCoordinate();
    newField[yCoordinate][xCoordinate] = hat;

    // add in holes in random locations
    while (numberOfHoles > 0) {
      randomCoordinate();
      newField[yCoordinate][xCoordinate] = hole;
      numberOfHoles--;
    }

    // add in fields in remaining locations
    while (numberOfFields > 0) {
      randomCoordinate();
      newField[yCoordinate][xCoordinate] = fieldCharacter;
      numberOfFields--;
    }
    return newField;
  }

  // starts the game
  startGame() {
    // think this needs taking out due to it overriding new game settings
    // this._field = Field.generateField(fieldHeight,fieldWidth,fieldPercentage);
    this.xLocation = startingXLocation;
    this.yLocation = startingYLocation;
    this.getDirection();
  }

  // get direction from user
  getDirection() {
    this.print();
    let direction = prompt(
      "What direction would you like to move? Up, down, left or right:   "
    );
    direction = direction.toUpperCase();
    // If input is not valid, ask for prompt again.
    if (
      direction === "UP" ||
      direction === "DOWN" ||
      direction === "LEFT" ||
      direction === "RIGHT"
    ) {
      this.changeUserLocation(direction);
    } else {
      console.log("Sorry, that was not a valid direction.");
      console.log("Please type 'up' 'down 'left' or 'right' to move direction");
      this.getDirection();
    }
  }

  // takes a direction then changes the user location
  changeUserLocation(direction) {
    switch (direction) {
      case "LEFT":
        this.xLocation--;
        break;
      case "RIGHT":
        this.xLocation++;
        break;
      // y coord is inversed in an array so if y goes up then player is moving down
      case "UP":
        this.yLocation--;
        break;
      case "DOWN":
        this.yLocation++;
        break;
      default:
        throw Error("invalid direction");
        break;
    }
    this.checkLocation();
  }

  // checks to see where the user has landed
  checkLocation() {
    // check if the player moved out of bounds. Then check if they got the hat or fell down a hole. If not, leave trail and move forward
    if (
      this.xLocation < 0 ||
      this.xLocation > fieldWidth - 1 ||
      this.yLocation < 0 ||
      this.yLocation > fieldHeight - 1
    ) {
      this._result = "You lost. You went out of bounds";
    } else if (this._field[this.yLocation][this.xLocation] === hat) {
      this._result = "You won! You found the hat";
    } else if (this._field[this.yLocation][this.xLocation] === hole) {
      this._result = "You lost! You fell down a hole";
    } else {
      this._field[this.yLocation][this.xLocation] = pathCharacter;
      this.getDirection();
    }
    this.callResult();
  }

  // ends the game and tells player the result
  callResult() {
    console.log(this._result);
    console.log("Thanks for playing.");
    console.log("...");
    console.log("Let's play again!");
    // get values to start a new game
    let newGameWidth = prompt("How many COLUMNS should the next game have?");
    let newGameHeight = prompt("How many ROWS should the next game have?");
    let newGameHolePercentage = prompt(
      "What percentage of the board should be holes?"
    );
    this._field = Field.generateField(
      newGameHeight,
      newGameWidth,
      newGameHolePercentage
    );
    this.startGame();
  }
}

const fieldInstance = new Field();
fieldInstance._field = Field.generateField(
  fieldHeight,
  fieldWidth,
  fieldPercentage
);
console.log("");
console.log("");
console.log("Welcome to the find a hat game!");
console.log("The Goal of the game:");
console.log(
  "Move around the field to find a hat but don't move off the board or land down a hole!"
);
console.log("");
console.log("Your character and their path is marked by '*");
console.log("The hat is '^' and hole are marked 'O'");
console.log("");
fieldInstance.startGame();
