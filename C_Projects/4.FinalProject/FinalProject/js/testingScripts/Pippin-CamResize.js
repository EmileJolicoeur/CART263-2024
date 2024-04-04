/**

Handpose Framework with webcam scaling
Pippin Barr

A skeleton framework for using ml5.js's Handpose feature. Includes a
loading screen followed by a live webcam feed with a circle drawn at
the tip of the user's index finger.

Adjusts for the potential difference in size between the webcam
resolution and your canvas resolution!

*/

"use strict";

// Current state of program
let state   =   `loading`;  // loading, running
// User's webcam
let video;
// The name of our model
let modelName   =   `Handpose`;
// Handpose object (using the name of the model for clarity)
let handpose;
// The current set of predictions made by Handpose once it's running
let predictions =   [];

let webcamRatio =   {
    x:  undefined,
    y:  undefined
};

/**
Starts the webcam and the Handpose
*/
function setup()    {
    createCanvas(1280, 720);

    // NEW!
    // Start webcam
    video   =   createCapture(VIDEO, videoReady);
}

/**
NEW! Using an event handler here so that we can get the correct resolution
of the webcam.

Called when webcam is ready, starts ml5
*/
function videoReady() {
    video.hide();

    // NEW!
    // Calculate the ratio of the canvas to the
    // the webcam
    webcamRatio.x   =   width / video.elt.videoWidth;
    webcamRatio.y   =   height / video.elt.videoHeight;

    // Start the Handpose model and switch to our running state when it loads
    handpose    =   ml5.handpose(video, {
        flipHorizontal: true
    }, function()   {
        // Switch to the running state
        state   =   `running`;
    });

    // Listen for prediction events from Handpose and store the results in our
    // predictions array when they occur
    handpose.on(`predict`, function (results)   {
        predictions =   results;
    });
}

/**
Handles the two states of the program: loading, running
*/
function draw() {
    if (state === `loading`)    {
        console.log(`loading`);
        loading();
    } else if (state === `running`) {
        console.log(`Running`);
        running();
    }
}

/**
Displays a simple loading screen with the loading model's name
*/
function loading()  {
    background(255);

    push();
    textSize(32);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(`Loading ${modelName}...`, width/2, height/2);
    pop();
}

/**
Displays the webcam.
If there is a hand it outlines it and highlights the tip of the index finger
*/
function running()  {
    // Display the webcam with reveresd image so it's a mirror
    let flippedVideo    =   ml5.flipImage(video);
    image(flippedVideo, 0, 0, width, height);

    // // Check if there currently predictions to display
    if (predictions.length > 0) {
        // Technically there will only be ONE because it only detects ONE hand
        // Get the hand predicted
        let hand    =   predictions[0];
        // Highlight it on the canvas
        highlightHand(hand);
    }
}

/**
Provided with a detected hand it highlights the tip of the index finger
*/
function highlightHand(hand)    {  
    // Display a circle at the tip of the index finger
    let index   =   hand.annotations.indexFinger[3];
    // NEW!
    // Whenever we want to use X/Y from Handpose we need to convert it from
    // pixels referring to the webcam space into the canvas space, so we
    // multiply by the ratio we calculated for this
    let indexX  =   index[0] * webcamRatio.x;
    let indexY  =   index[1] * webcamRatio.y;
    push();
    fill(255, 255, 0);
    noStroke();
    ellipse(indexX, indexY, 20);
    pop();
}


function keyPressed()   {
    if (event.keyCode === 32)   {
        state   =   `running`;
    }
}