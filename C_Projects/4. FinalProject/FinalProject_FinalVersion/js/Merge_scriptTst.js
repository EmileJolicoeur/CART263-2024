"use strict"


//  FaceMesh:
let face;
let modelName   =   `Mesh`; //`Mesh` or `Box`;
//  Webcam AddOn:
let vid;
let webcamRatio =   {
    x:  undefined,
    y:  undefined
};

let trackingResults =   [];

//  Game States:
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


//__________________________________________//


function setup()    {
    createCanvas(windowHeight, windowHeight, WebGL);

    //  Creating video:
    vid =   createCapture(VIDEO, videoReady);
}

//  -   -   -   -   -   -   -   -   -   //

/** Getting video size values:  */
function videoReady()   {
    video.hide();

    //  Calculating camera size ratio:
    webcamRatio.x   =   width/vid.elt.videoWidth;
    webcamRatio.y   =   width/vid.elt.videoHeight;

    //  Starting face tracking:
    face    =   ml5.facemesh(video, {
        flipHorizontal: true
    }, modelLoaded);
}

/** Model loaded:   */
function modelLoaded()  {
    // Now we know we're ready we can switch states
    state   =   STATE.DETECTING;
    // What to do 
    facemesh.on('face', handleFaceDetection);
}

/** Face detection: */
function handleFaceDetection(data)  {
    if (data.length > 0)    {
        results = data;
    }
}


//__Draw:___________________________________//


function draw() {
    switch (state)  {
        //  If on Startup:
        case STATE.STARTUP:
            console.log(`[Startup_Engaged]`);
            startup();
        break;
        //  If on Detecting:
        case STATE.MIMICKING:
            console.log(`[Simulacra_Completed]`);
            mimicking();
        break;
    }
}

//  -   -   -   -   -   -   -   -   -   //

/** While loading:  */
function startup()  {
    background(255);

    push();
    textSize(32);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(`Loading ${modelName}...`, width/2, height/2);
    pop();
}

/** Displaying: */
function mimicking()    {
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