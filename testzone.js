let fieldWidth = -1;
let fieldHeight = -1;
let fieldPercentage = -100;

if (true) {
    console.log("width must be a positive number. I have set it to 5")

    fieldWidth = 5;
    console.log("height" + fieldHeight + " width " + fieldWidth + " percentage " + fieldPercentage);
}
if (typeof fieldHeight !== "number" || fieldHeight < 0) {
    console.log("height must be a positive number. I have set it to 5")
    fieldHeight = 5;
    console.log("height" + fieldHeight + " width " + fieldWidth + " percentage " + fieldPercentage);
}
if (typeof fieldPercentage !== "number" || fieldPercentage < 0 || fieldPercentage > 100) {
    console.log("percentage must be a number between 0 and 100. I have set it to 30")
    fieldPercentage = 30;
    console.log("height" + fieldHeight + " width " + fieldWidth + " percentage " + fieldPercentage);
}


console.log("height" + fieldHeight + " width " + fieldWidth + " percentage " + fieldPercentage);






