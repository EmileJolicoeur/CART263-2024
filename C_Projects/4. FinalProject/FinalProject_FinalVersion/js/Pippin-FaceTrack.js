"use strict"

// Our face detector
let facemesh;
// Our webcam feed
let video;
// To store the current results set
let results =   [];

// Just to track what state the program is in
const STATE =   {
    STARTUP:    `STARTUP`,
    DETECTING:  `DETECTING`
};

let state   =   STATE.STARTUP;

const options   =   {
    flipHorizontal: true, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: 5, // How many frames to go without running the bounding box detector. Only relevant if maxFaces > 1. Defaults to 5.
    detectionConfidence: 0.9, // Threshold for discarding a prediction. Defaults to 0.9.
    maxFaces: 10, // The maximum number of faces detected in the input. Should be set to the minimum number for performance. Defaults to 10.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75.
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
}


//__Setup:______________________________________//


function setup()    {
    createCanvas(640, 480, WEBGL);

    // Set up and start the webcam
    video   =   createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    // Start up Facemesh
    facemesh    =   ml5.facemesh(video, modelLoaded);
}


/** */
function modelLoaded()  {
    // Now we know we're ready we can switch states
    state   =   STATE.DETECTING;
    // What to do 
    facemesh.on('face', handleFaceDetection);
}

/** */
function draw() {
    switch (state)  {
        case STATE.STARTUP:
            startup();
            break;
        case STATE.DETECTING:
            detecting();
            break;
    }
}

/**
Tells the user we're getting started with loading Facemesh
*/
function startup()  {
    background(0);

    push();
    fill(255);
    textAlign(CENTER, CENTER);
    // text(`Loading Facemesh...`, width/2, height/2);
    pop();
}

/**
Displays the video feed and the emoji mapped on top of it
*/
function detecting()    {
    background(200, 127, 120);

    console.log(results);

    // Show the webcam
    image(video, -width/2, -height/2);

    if (results.length > 0) {
        let data    =   results[0].scaledMesh[195];
        console.log(data);
        push();
        translate(-width/2, -height/2);
        translate((data[0]), data[1], 100) //, data[2] * 10);
        // rotateX(PI/4);
        // rotateY(PI/3);
        box(100);
        pop();
    }
}

/**
Called by Facemesh when it sees a face, just stores the data in results
so we can see it in detecting()
*/
function handleFaceDetection(data)  {
    if (data.length > 0)    {
        results = data;
    }
}