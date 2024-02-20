/**
Experiments on Machine Learning with the ml5.js library

*/

"use strict";


//  Vid2_Object Detector:   //
let objects =   [];
/** */
function preload() {

}


/** */
function setup() {

}


/** */
function draw() {

}

//Debugging:
function gotResults(err, results)   {
    //Displays errors if they occur:
    if (err)    {
        console.log(err);
    }
    //Displaying results:
    console.log(results);
    //Assigning results to the object:
    objects =   results;
}


/** Vid3_Handpose:  */

let predictions =   [];
const video =   document.getElementById(`video`);

const options   =   {
    flipHorizontal: true,   //camera is usually not mirrored
    maxContinuousChecks:    Infinity,   //in case you want to have a gap between each frames of detection
    detectionConfidence:    0.8,        //if prediction is shit (below nb), discard and try again
    scoreThreshold: 0.75,   //
    iouThreshold:   0.3,
}

const handpose  =   ml5.handpose(video, options, callback);  //video =   webcam / options(see below) / callback = in case of loading screen
/** */
function preload() {

}


/** */
function setup() {

}


/** */
function draw() {

}