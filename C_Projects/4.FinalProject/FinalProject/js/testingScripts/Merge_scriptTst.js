"use strict";


//  User's webcam:
let vid;
//  Displayed model:
let modelSeen   =   `mesh`;     //mesh or box
//  Values to resize camera:
let webcamRatio =   {
    x:  undefined,
    y:  undefined
};

let face;
let results =   [];

// const options   =   {
//     flipHorizontal: true, // boolean value for if the video should be flipped, defaults to false
// }
//  Current state of program:
const STATE =   {
    START:    `START`,
    MIMICKING:  `MIMICKING`
}
let state   =   STATE.START;

//__Setup:______________________________________//


/** */
function setup()    {
    createCanvas(windowHeight, windowHeight);

    //  Start webcam
    vid     =   createCapture(VIDEO, videoReady);
}

//  -   -   -   -   -   -   -   -   -   //

/** Getting accurate camera resolution: */
function videoReady() {
    vid.hide();
    //  Ratio:  canvas size / video size:
    webcamRatio.x   =   width / vid.elt.videoWidth;
    webcamRatio.y   =   height / vid.elt.videoHeight;

    //  Start face tracking:
    face    =   ml5.facemesh(vid, modelLoaded);
    console.log(face);
}

/** Once the facemesh is loaded:    */
function modelLoaded()  {
    //  Ready to mimic:
    state   =   STATE.MIMICKING;
    //  Verifying if the camera sees a face:
    face.on('face', handleFaceDetection);
    // face.on("predict", data  =>  {
    //     if (data.length > 0) {
    //         results =   data;
    //     }
    // });
    console.log(state);
}

/** Detecting faces:    */
function handleFaceDetection(data)  {
    if (data.length > 0)    {
        results =   data;
    }
    // console.log(results);
}


//__Draw:_______________________________________//


/** Displayed states:   */
function draw() {
    switch (state)  {
        case STATE.START:
            loading();
            break;
        case STATE.MIMICKING:
            running();
            break;
    }
    console.log(results[0]);
}

//  -   -   -   -   -   -   -   -   -   //

/** Loading Screen: */
function loading()  {
    background(255);

    push();
    fill(255);
    textSize(32);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(`Loading ${modelSeen}...`, width/2, height/2);
    pop();
}

/**
Displays the webcam.
If there is a hand it outlines it and highlights the tip of the index finger
*/
/** Displaying the face tracking results:   */
function running()  {
    background(0);
    // Display the webcam with reveresd image so it's a mirror
    // let flippedVid    =   ml5.flipImage(vid);
    // image(flippedVid, 0, 0, width, height);
    // image(vid, 0, 0, width, height);


    for (let i = 0; i < results.length; i ++)   {
        const vertex =   results[i].scaledMesh;
        // console.log(vertex);
    
        //  Draw dots:
        for (let j = 0; j < vertex.length; j += 1)   {
            const [x, y]   =   vertex[j];

            let vertexX   =   x*webcamRatio.x;
            let vertexY   =   y*webcamRatio.y;


            // verticeNB(vertexX, vertexY, j);
            displayDots(vertexX, vertexY, j, vertex);
        }

        displayMesh(vertex);
    }

    console.log(results.length);
}

function displayDots(x, y, nb, vertex)    {
    push();
    if (vertex[nb] === vertex[195])  {
        fill(255, 0, 0);
        ellipse(x, y, 10, 10);
    }
    else if (vertex[nb] === vertex[152] || vertex[nb] === vertex[14]) {
        fill(100, 0, 100);
        ellipse(x, y, 10, 10);
    }
    else if (vertex[nb] === vertex[13] || vertex[nb] === vertex[2] || vertex[nb] === vertex[1] || vertex[nb] === vertex[5] || vertex[nb] === vertex[168]) {
        fill(200, 0, 200);
        ellipse(x, y, 10, 10);
    }
    else    {
        fill(0, 255, 0);
        ellipse(x, y, 3, 3);
    }
    pop();
}
function verticeNB(x, y, nb)    {
    push();
    fill(255, 0+nb/2, 0+nb/2);
    textAlign(CENTER,CENTER);
    textSize(7);
    text(nb, x, y -10);
    pop();
    push();
}

function displayMesh(vertex)    {
    push();
    stroke(0, 255, 0);
    strokeWeight(1);
    basicSeparations(vertex);
    meshContours(vertex);
    nose(vertex);
    filler(vertex);
    // heightLines(vertex);
    // widthLines(vertex);
    // contours(vertex);
    pop();
}

function basicSeparations(v)   {
    //Middle split:
    line(v[13][0]*webcamRatio.x,    v[13][1]*webcamRatio.y,     v[11][0]*webcamRatio.x,     v[11][1]*webcamRatio.y);
    line(v[11][0]*webcamRatio.x,    v[11][1]*webcamRatio.y,     v[0][0]*webcamRatio.x,      v[0][1]*webcamRatio.y);
    line(v[0][0]*webcamRatio.x,     v[0][1]*webcamRatio.y,      v[2][0]*webcamRatio.x,      v[2][1]*webcamRatio.y);
    line(v[2][0]*webcamRatio.x,     v[2][1]*webcamRatio.y,      v[94][0]*webcamRatio.x,     v[94][1]*webcamRatio.y);
    line(v[94][0]*webcamRatio.x,    v[94][1]*webcamRatio.y,     v[19][0]*webcamRatio.x,     v[19][1]*webcamRatio.y);
    line(v[19][0]*webcamRatio.x,    v[19][1]*webcamRatio.y,     v[1][0]*webcamRatio.x,      v[1][1]*webcamRatio.y);
    line(v[1][0]*webcamRatio.x,     v[1][1]*webcamRatio.y,      v[5][0]*webcamRatio.x,     v[5][1]*webcamRatio.y);
}

function filler(v)  {
    //  Nose:
    line(v[250][0]*webcamRatio.x,   v[250][1]*webcamRatio.y,    v[370][0]*webcamRatio.x,    v[370][1]*webcamRatio.y);
    line(v[370][0]*webcamRatio.x,   v[370][1]*webcamRatio.y,    v[2][0]*webcamRatio.x,      v[2][1]*webcamRatio.y);
    line(v[2][0]*webcamRatio.x,     v[2][1]*webcamRatio.y,      v[141][0]*webcamRatio.x,    v[141][1]*webcamRatio.y);
    line(v[141][0]*webcamRatio.x,   v[141][1]*webcamRatio.y,    v[20][0]*webcamRatio.x,     v[20][1]*webcamRatio.y);
    line(v[458][0]*webcamRatio.x,   v[458][1]*webcamRatio.y,    v[354][0]*webcamRatio.x,    v[354][1]*webcamRatio.y);
    line(v[354][0]*webcamRatio.x,   v[354][1]*webcamRatio.y,    v[19][0]*webcamRatio.x,     v[19][1]*webcamRatio.y);
    line(v[19][0]*webcamRatio.x,    v[19][1]*webcamRatio.y,     v[125][0]*webcamRatio.x,    v[125][1]*webcamRatio.y);
    line(v[125][0]*webcamRatio.x,   v[125][1]*webcamRatio.y,    v[238][0]*webcamRatio.x,    v[238][1]*webcamRatio.y);

    //  Nostril_Midridge:
    line(v[438][0]*webcamRatio.x,   v[438][1]*webcamRatio.y,    v[457][0]*webcamRatio.x,    v[457][1]*webcamRatio.y);
    line(v[457][0]*webcamRatio.x,   v[457][1]*webcamRatio.y,    v[274][0]*webcamRatio.x,    v[274][1]*webcamRatio.y);
    line(v[274][0]*webcamRatio.x,   v[274][1]*webcamRatio.y,    v[1][0]*webcamRatio.x,      v[1][1]*webcamRatio.y);
    line(v[1][0]*webcamRatio.x,     v[1][1]*webcamRatio.y,      v[44][0]*webcamRatio.x,     v[44][1]*webcamRatio.y);
    line(v[44][0]*webcamRatio.x,    v[44][1]*webcamRatio.y,     v[237][0]*webcamRatio.x,    v[237][1]*webcamRatio.y);
    line(v[237][0]*webcamRatio.x,   v[237][1]*webcamRatio.y,    v[218][0]*webcamRatio.x,    v[218][1]*webcamRatio.y);
    
    line(v[275][0]*webcamRatio.x,   v[275][1]*webcamRatio.y,    v[4][0]*webcamRatio.x,      v[4][1]*webcamRatio.y);
    line(v[4][0]*webcamRatio.x,     v[4][1]*webcamRatio.y,      v[45][0]*webcamRatio.x,     v[45][1]*webcamRatio.y);
    
    line(v[354][0]*webcamRatio.x,   v[354][1]*webcamRatio.y,    v[274][0]*webcamRatio.x,    v[274][1]*webcamRatio.y);
    line(v[274][0]*webcamRatio.x,   v[274][1]*webcamRatio.y,    v[275][0]*webcamRatio.x,    v[275][1]*webcamRatio.y);
    line(v[275][0]*webcamRatio.x,   v[275][1]*webcamRatio.y,    v[363][0]*webcamRatio.x,    v[363][1]*webcamRatio.y);
    //  Nostril_R:
    line(v[290][0]*webcamRatio.x,   v[290][1]*webcamRatio.y,    v[328][0]*webcamRatio.x,    v[328][1]*webcamRatio.y);
    line(v[328][0]*webcamRatio.x,   v[328][1]*webcamRatio.y,    v[326][0]*webcamRatio.x,    v[326][1]*webcamRatio.y);
    line(v[305][0]*webcamRatio.x,   v[305][1]*webcamRatio.y,    v[460][0]*webcamRatio.x,    v[460][1]*webcamRatio.y);
    line(v[460][0]*webcamRatio.x,   v[460][1]*webcamRatio.y,    v[327][0]*webcamRatio.x,    v[327][1]*webcamRatio.y);
    line(v[289][0]*webcamRatio.x,   v[289][1]*webcamRatio.y,    v[294][0]*webcamRatio.x,    v[294][1]*webcamRatio.y);
    line(v[294][0]*webcamRatio.x,   v[294][1]*webcamRatio.y,    v[358][0]*webcamRatio.x,    v[358][1]*webcamRatio.y);
    line(v[392][0]*webcamRatio.x,   v[392][1]*webcamRatio.y,    v[439][0]*webcamRatio.x,    v[439][1]*webcamRatio.y);
    line(v[439][0]*webcamRatio.x,   v[439][1]*webcamRatio.y,    v[279][0]*webcamRatio.x,    v[279][1]*webcamRatio.y);
    line(v[309][0]*webcamRatio.x,   v[309][1]*webcamRatio.y,    v[438][0]*webcamRatio.x,    v[438][1]*webcamRatio.y);
    line(v[438][0]*webcamRatio.x,   v[438][1]*webcamRatio.y,    v[360][0]*webcamRatio.x,    v[360][1]*webcamRatio.y);

    
    line(v[354][0]*webcamRatio.x,   v[354][1]*webcamRatio.y,    v[274][0]*webcamRatio.x,    v[274][1]*webcamRatio.y);
    line(v[274][0]*webcamRatio.x,   v[274][1]*webcamRatio.y,    v[275][0]*webcamRatio.x,    v[275][1]*webcamRatio.y);
    line(v[275][0]*webcamRatio.x,   v[275][1]*webcamRatio.y,    v[363][0]*webcamRatio.x,    v[363][1]*webcamRatio.y);

    line(v[457][0]*webcamRatio.x,   v[457][1]*webcamRatio.y,    v[363][0]*webcamRatio.x,    v[363][1]*webcamRatio.y);
    // line(v[363][0]*webcamRatio.x,   v[363][1]*webcamRatio.y,    v[275][0]*webcamRatio.x,    v[275][1]*webcamRatio.y);


    // line(v[354][0]*webcamRatio.x,   v[354][1]*webcamRatio.y,    v[438][0]*webcamRatio.x,    v[438][1]*webcamRatio.y);
    // line(v[438][0]*webcamRatio.x,   v[438][1]*webcamRatio.y,    v[439][0]*webcamRatio.x,    v[439][1]*webcamRatio.y);
    // line(v[439][0]*webcamRatio.x,   v[439][1]*webcamRatio.y,    v[294][0]*webcamRatio.x,    v[294][1]*webcamRatio.y);
    // line(v[294][0]*webcamRatio.x,   v[294][1]*webcamRatio.y,    v[460][0]*webcamRatio.x,    v[460][1]*webcamRatio.y);
    // line(v[460][0]*webcamRatio.x,   v[460][1]*webcamRatio.y,    v[326][0]*webcamRatio.x,    v[326][1]*webcamRatio.y);
    // line(v[326][0]*webcamRatio.x,   v[326][1]*webcamRatio.y,    v[370][0]*webcamRatio.x,    v[370][1]*webcamRatio.y);
}

function meshContours(v)   {
    //  Nostril_R:
    line(v[250][0]*webcamRatio.x,   v[250][1]*webcamRatio.y,    v[290][0]*webcamRatio.x,    v[290][1]*webcamRatio.y);
    line(v[290][0]*webcamRatio.x,   v[290][1]*webcamRatio.y,    v[305][0]*webcamRatio.x,    v[305][1]*webcamRatio.y);
    line(v[305][0]*webcamRatio.x,   v[305][1]*webcamRatio.y,    v[289][0]*webcamRatio.x,    v[289][1]*webcamRatio.y);
    line(v[289][0]*webcamRatio.x,   v[289][1]*webcamRatio.y,    v[392][0]*webcamRatio.x,    v[392][1]*webcamRatio.y);
    line(v[392][0]*webcamRatio.x,   v[392][1]*webcamRatio.y,    v[309][0]*webcamRatio.x,    v[309][1]*webcamRatio.y);
    line(v[309][0]*webcamRatio.x,   v[309][1]*webcamRatio.y,    v[458][0]*webcamRatio.x,    v[458][1]*webcamRatio.y);
    line(v[458][0]*webcamRatio.x,   v[458][1]*webcamRatio.y,    v[250][0]*webcamRatio.x,    v[250][1]*webcamRatio.y);
    //  Nostril_L:
    line(v[20][0]*webcamRatio.x,    v[20][1]*webcamRatio.y,     v[60][0]*webcamRatio.x,     v[60][1]*webcamRatio.y);
    line(v[60][0]*webcamRatio.x,    v[60][1]*webcamRatio.y,     v[75][0]*webcamRatio.x,     v[75][1]*webcamRatio.y);
    line(v[75][0]*webcamRatio.x,    v[75][1]*webcamRatio.y,     v[59][0]*webcamRatio.x,     v[59][1]*webcamRatio.y);
    line(v[59][0]*webcamRatio.x,    v[59][1]*webcamRatio.y,     v[166][0]*webcamRatio.x,    v[166][1]*webcamRatio.y);
    line(v[166][0]*webcamRatio.x,   v[166][1]*webcamRatio.y,    v[79][0]*webcamRatio.x,     v[79][1]*webcamRatio.y);
    line(v[79][0]*webcamRatio.x,    v[79][1]*webcamRatio.y,     v[238][0]*webcamRatio.x,    v[238][1]*webcamRatio.y);
    line(v[238][0]*webcamRatio.x,   v[238][1]*webcamRatio.y,    v[20][0]*webcamRatio.x,     v[20][1]*webcamRatio.y);
    //  Mouth:
    line(v[14][0]*webcamRatio.x,    v[14][1]*webcamRatio.y,     v[402][0]*webcamRatio.x,    v[402][1]*webcamRatio.y);
    line(v[402][0]*webcamRatio.x,   v[402][1]*webcamRatio.y,    v[324][0]*webcamRatio.x,    v[324][1]*webcamRatio.y);
    line(v[324][0]*webcamRatio.x,   v[324][1]*webcamRatio.y,    v[308][0]*webcamRatio.x,    v[308][1]*webcamRatio.y);
    line(v[308][0]*webcamRatio.x,   v[308][1]*webcamRatio.y,    v[415][0]*webcamRatio.x,    v[415][1]*webcamRatio.y);
    line(v[415][0]*webcamRatio.x,   v[415][1]*webcamRatio.y,    v[311][0]*webcamRatio.x,    v[311][1]*webcamRatio.y);
    line(v[311][0]*webcamRatio.x,   v[311][1]*webcamRatio.y,    v[13][0]*webcamRatio.x,     v[13][1]*webcamRatio.y);
    line(v[13][0]*webcamRatio.x,    v[13][1]*webcamRatio.y,     v[81][0]*webcamRatio.x,     v[81][1]*webcamRatio.y);
    line(v[81][0]*webcamRatio.x,    v[81][1]*webcamRatio.y,     v[191][0]*webcamRatio.x,    v[191][1]*webcamRatio.y);
    line(v[191][0]*webcamRatio.x,   v[191][1]*webcamRatio.y,    v[78][0]*webcamRatio.x,     v[78][1]*webcamRatio.y);
    line(v[78][0]*webcamRatio.x,    v[78][1]*webcamRatio.y,     v[95][0]*webcamRatio.x,     v[95][1]*webcamRatio.y);
    line(v[95][0]*webcamRatio.x,    v[95][1]*webcamRatio.y,     v[178][0]*webcamRatio.x,    v[178][1]*webcamRatio.y);
    line(v[178][0]*webcamRatio.x,   v[178][1]*webcamRatio.y,    v[14][0]*webcamRatio.x,     v[14][1]*webcamRatio.y);
    //  Eye_R:
}
function nose(v)    {
    //  Nostril_R:
    line(v[370][0]*webcamRatio.x,   v[370][1]*webcamRatio.y,    v[354][0]*webcamRatio.x,    v[354][1]*webcamRatio.y);
    line(v[354][0]*webcamRatio.x,   v[354][1]*webcamRatio.y,    v[438][0]*webcamRatio.x,    v[438][1]*webcamRatio.y);
    line(v[438][0]*webcamRatio.x,   v[438][1]*webcamRatio.y,    v[439][0]*webcamRatio.x,    v[439][1]*webcamRatio.y);
    line(v[439][0]*webcamRatio.x,   v[439][1]*webcamRatio.y,    v[294][0]*webcamRatio.x,    v[294][1]*webcamRatio.y);
    line(v[294][0]*webcamRatio.x,   v[294][1]*webcamRatio.y,    v[460][0]*webcamRatio.x,    v[460][1]*webcamRatio.y);
    line(v[460][0]*webcamRatio.x,   v[460][1]*webcamRatio.y,    v[328][0]*webcamRatio.x,    v[328][1]*webcamRatio.y);
    line(v[328][0]*webcamRatio.x,   v[328][1]*webcamRatio.y,    v[370][0]*webcamRatio.x,    v[370][1]*webcamRatio.y);
    //  Nostril_L:
    line(v[141][0]*webcamRatio.x,   v[141][1]*webcamRatio.y,    v[125][0]*webcamRatio.x,    v[125][1]*webcamRatio.y);
    line(v[125][0]*webcamRatio.x,   v[125][1]*webcamRatio.y,    v[218][0]*webcamRatio.x,    v[218][1]*webcamRatio.y);
    line(v[218][0]*webcamRatio.x,   v[218][1]*webcamRatio.y,    v[219][0]*webcamRatio.x,    v[219][1]*webcamRatio.y);
    line(v[219][0]*webcamRatio.x,   v[219][1]*webcamRatio.y,    v[64][0]*webcamRatio.x,     v[64][1]*webcamRatio.y);
    line(v[64][0]*webcamRatio.x,    v[64][1]*webcamRatio.y,     v[240][0]*webcamRatio.x,    v[240][1]*webcamRatio.y);
    line(v[240][0]*webcamRatio.x,   v[240][1]*webcamRatio.y,    v[99][0]*webcamRatio.x,     v[99][1]*webcamRatio.y);
    line(v[99][0]*webcamRatio.x,    v[99][1]*webcamRatio.y,     v[141][0]*webcamRatio.x,    v[141][1]*webcamRatio.y);
    //  Nose Bottom:    //Nostril_R:
    line(v[2][0]*webcamRatio.x,     v[2][1]*webcamRatio.y,      v[326][0]*webcamRatio.x,    v[326][1]*webcamRatio.y);
    line(v[326][0]*webcamRatio.x,   v[326][1]*webcamRatio.y,    v[327][0]*webcamRatio.x,    v[327][1]*webcamRatio.y);
    line(v[327][0]*webcamRatio.x,   v[327][1]*webcamRatio.y,    v[358][0]*webcamRatio.x,    v[358][1]*webcamRatio.y);
    // line(v[358][0]*webcamRatio.x,   v[358][1]*webcamRatio.y,    v[294][0]*webcamRatio.x,    v[294][1]*webcamRatio.y);
    // line(v[294][0]*webcamRatio.x,   v[294][1]*webcamRatio.y,    v[460][0]*webcamRatio.x,    v[460][1]*webcamRatio.y);
    // line(v[460][0]*webcamRatio.x,   v[460][1]*webcamRatio.y,    v[326][0]*webcamRatio.x,    v[326][1]*webcamRatio.y);
    // line(v[326][0]*webcamRatio.x,   v[326][1]*webcamRatio.y,    v[370][0]*webcamRatio.x,    v[370][1]*webcamRatio.y);
}

function heightLines(v)    {
    //  Center:
    line(v[152][0]*webcamRatio.x,   v[152][1]*webcamRatio.y,    v[199][0]*webcamRatio.x,    v[199][1]*webcamRatio.y);
    line(v[199][0]*webcamRatio.x,   v[199][1]*webcamRatio.y,    v[18][0]*webcamRatio.x,     v[18][1]*webcamRatio.y);
    line(v[18][0]*webcamRatio.x,    v[18][1]*webcamRatio.y,     v[16][0]*webcamRatio.x,     v[16][1]*webcamRatio.y);
    line(v[16][0]*webcamRatio.x,    v[16][1]*webcamRatio.y,     v[14][0]*webcamRatio.x,     v[14][1]*webcamRatio.y);
    
    line(v[13][0]*webcamRatio.x,    v[13][1]*webcamRatio.y,     v[11][0]*webcamRatio.x,     v[11][1]*webcamRatio.y);
    line(v[11][0]*webcamRatio.x,    v[11][1]*webcamRatio.y,     v[164][0]*webcamRatio.x,    v[164][1]*webcamRatio.y);
    line(v[164][0]*webcamRatio.x,   v[164][1]*webcamRatio.y,    v[2][0]*webcamRatio.x,      v[2][1]*webcamRatio.y);
    line(v[2][0]*webcamRatio.x,     v[2][1]*webcamRatio.y,      v[19][0]*webcamRatio.x,     v[19][1]*webcamRatio.y);
    
    //  Right1:
    line(v[400][0]*webcamRatio.x,   v[400][1]*webcamRatio.y,    v[262][0]*webcamRatio.x,    v[262][1]*webcamRatio.y);
    line(v[262][0]*webcamRatio.x,   v[262][1]*webcamRatio.y,    v[406][0]*webcamRatio.x,    v[406][1]*webcamRatio.y);
    line(v[406][0]*webcamRatio.x,   v[406][1]*webcamRatio.y,    v[404][0]*webcamRatio.x,    v[404][1]*webcamRatio.y);
    line(v[404][0]*webcamRatio.x,   v[404][1]*webcamRatio.y,    v[402][0]*webcamRatio.x,    v[402][1]*webcamRatio.y);

    line(v[311][0]*webcamRatio.x,   v[311][1]*webcamRatio.y,    v[303][0]*webcamRatio.x,    v[303][1]*webcamRatio.y);
    line(v[303][0]*webcamRatio.x,   v[303][1]*webcamRatio.y,    v[391][0]*webcamRatio.x,    v[391][1]*webcamRatio.y);

    //  Right2:
    line(v[379][0]*webcamRatio.x,   v[379][1]*webcamRatio.y,    v[430][0]*webcamRatio.x,    v[430][1]*webcamRatio.y);
    line(v[430][0]*webcamRatio.x,   v[430][1]*webcamRatio.y,    v[273][0]*webcamRatio.x,    v[273][1]*webcamRatio.y);
    line(v[273][0]*webcamRatio.x,   v[273][1]*webcamRatio.y,    v[307][0]*webcamRatio.x,    v[307][1]*webcamRatio.y);
    line(v[307][0]*webcamRatio.x,   v[307][1]*webcamRatio.y,    v[324][0]*webcamRatio.x,    v[324][1]*webcamRatio.y);
    
    //  Right3:
    line(v[308][0]*webcamRatio.x,   v[308][1]*webcamRatio.y,    v[306][0]*webcamRatio.x,    v[306][1]*webcamRatio.y);
    line(v[306][0]*webcamRatio.x,   v[306][1]*webcamRatio.y,    v[287][0]*webcamRatio.x,    v[287][1]*webcamRatio.y);
    line(v[287][0]*webcamRatio.x,   v[287][1]*webcamRatio.y,    v[434][0]*webcamRatio.x,    v[434][1]*webcamRatio.y);
    line(v[434][0]*webcamRatio.x,   v[434][1]*webcamRatio.y,    v[365][0]*webcamRatio.x,    v[365][1]*webcamRatio.y);
    
    line(v[415][0]*webcamRatio.x,   v[415][1]*webcamRatio.y,    v[408][0]*webcamRatio.x,    v[408][1]*webcamRatio.y);
    line(v[408][0]*webcamRatio.x,   v[408][1]*webcamRatio.y,    v[410][0]*webcamRatio.x,    v[410][1]*webcamRatio.y);
    line(v[410][0]*webcamRatio.x,   v[410][1]*webcamRatio.y,    v[427][0]*webcamRatio.x,    v[427][1]*webcamRatio.y);
}
function widthLines(v) {
    //  Mouth loop #1:
    line(vertex[16][0]*webcamRatio.x, vertex[16][1]*webcamRatio.y, vertex[404][0]*webcamRatio.x, vertex[404][1]*webcamRatio.y);
    line(vertex[404][0]*webcamRatio.x, vertex[404][1]*webcamRatio.y, vertex[307][0]*webcamRatio.x, vertex[307][1]*webcamRatio.y);
    line(vertex[307][0]*webcamRatio.x, vertex[307][1]*webcamRatio.y, vertex[306][0]*webcamRatio.x, vertex[306][1]*webcamRatio.y);
    line(vertex[306][0]*webcamRatio.x, vertex[306][1]*webcamRatio.y, vertex[408][0]*webcamRatio.x, vertex[408][1]*webcamRatio.y);
    line(vertex[408][0]*webcamRatio.x, vertex[408][1]*webcamRatio.y, vertex[303][0]*webcamRatio.x, vertex[303][1]*webcamRatio.y);
    line(vertex[303][0]*webcamRatio.x, vertex[303][1]*webcamRatio.y, vertex[11][0]*webcamRatio.x, vertex[11][1]*webcamRatio.y);
    line(vertex[11][0]*webcamRatio.x, vertex[11][1]*webcamRatio.y, vertex[73][0]*webcamRatio.x, vertex[73][1]*webcamRatio.y);
    line(vertex[73][0]*webcamRatio.x, vertex[73][1]*webcamRatio.y, vertex[184][0]*webcamRatio.x, vertex[184][1]*webcamRatio.y);
    line(vertex[184][0]*webcamRatio.x, vertex[184][1]*webcamRatio.y, vertex[76][0]*webcamRatio.x, vertex[76][1]*webcamRatio.y);
    line(vertex[76][0]*webcamRatio.x, vertex[76][1]*webcamRatio.y, vertex[77][0]*webcamRatio.x, vertex[77][1]*webcamRatio.y);
    line(vertex[77][0]*webcamRatio.x, vertex[77][1]*webcamRatio.y, vertex[180][0]*webcamRatio.x, vertex[180][1]*webcamRatio.y);
    line(vertex[180][0]*webcamRatio.x, vertex[180][1]*webcamRatio.y, vertex[16][0]*webcamRatio.x, vertex[16][1]*webcamRatio.y);
    //  Mouth loop #2:
    line(vertex[17][0]*webcamRatio.x, vertex[17][1]*webcamRatio.y, vertex[405][0]*webcamRatio.x, vertex[405][1]*webcamRatio.y);
    line(vertex[405][0]*webcamRatio.x, vertex[405][1]*webcamRatio.y, vertex[375][0]*webcamRatio.x, vertex[375][1]*webcamRatio.y);
    line(vertex[375][0]*webcamRatio.x, vertex[375][1]*webcamRatio.y, vertex[291][0]*webcamRatio.x, vertex[291][1]*webcamRatio.y);
    line(vertex[291][0]*webcamRatio.x, vertex[291][1]*webcamRatio.y, vertex[409][0]*webcamRatio.x, vertex[409][1]*webcamRatio.y);
    line(vertex[409][0]*webcamRatio.x, vertex[409][1]*webcamRatio.y, vertex[269][0]*webcamRatio.x, vertex[269][1]*webcamRatio.y);
    line(vertex[269][0]*webcamRatio.x, vertex[269][1]*webcamRatio.y, vertex[267][0]*webcamRatio.x, vertex[267][1]*webcamRatio.y);
    line(vertex[267][0]*webcamRatio.x, vertex[267][1]*webcamRatio.y, vertex[0][0]*webcamRatio.x, vertex[0][1]*webcamRatio.y);
    line(vertex[0][0]*webcamRatio.x, vertex[0][1]*webcamRatio.y, vertex[37][0]*webcamRatio.x, vertex[37][1]*webcamRatio.y);
    line(vertex[37][0]*webcamRatio.x, vertex[37][1]*webcamRatio.y, vertex[39][0]*webcamRatio.x, vertex[39][1]*webcamRatio.y);
    line(vertex[39][0]*webcamRatio.x, vertex[39][1]*webcamRatio.y, vertex[185][0]*webcamRatio.x, vertex[185][1]*webcamRatio.y);
    line(vertex[185][0]*webcamRatio.x, vertex[185][1]*webcamRatio.y, vertex[61][0]*webcamRatio.x, vertex[61][1]*webcamRatio.y);
    line(vertex[61][0]*webcamRatio.x, vertex[61][1]*webcamRatio.y, vertex[146][0]*webcamRatio.x, vertex[146][1]*webcamRatio.y);
    line(vertex[146][0]*webcamRatio.x, vertex[146][1]*webcamRatio.y, vertex[181][0]*webcamRatio.x, vertex[181][1]*webcamRatio.y);
    line(vertex[181][0]*webcamRatio.x, vertex[181][1]*webcamRatio.y, vertex[17][0]*webcamRatio.x, vertex[17][1]*webcamRatio.y);
    //  Mouth loop #3:
    line(vertex[287][0]*webcamRatio.x, vertex[287][1]*webcamRatio.y, vertex[410][0]*webcamRatio.x, vertex[410][1]*webcamRatio.y);
    line(vertex[410][0]*webcamRatio.x, vertex[410][1]*webcamRatio.y, vertex[391][0]*webcamRatio.x, vertex[391][1]*webcamRatio.y);
    line(vertex[391][0]*webcamRatio.x, vertex[391][1]*webcamRatio.y, vertex[164][0]*webcamRatio.x, vertex[164][1]*webcamRatio.y);
    line(vertex[164][0]*webcamRatio.x, vertex[164][1]*webcamRatio.y, vertex[165][0]*webcamRatio.x, vertex[165][1]*webcamRatio.y);
    line(vertex[165][0]*webcamRatio.x, vertex[165][1]*webcamRatio.y, vertex[186][0]*webcamRatio.x, vertex[186][1]*webcamRatio.y);
    line(vertex[186][0]*webcamRatio.x, vertex[186][1]*webcamRatio.y, vertex[57][0]*webcamRatio.x, vertex[57][1]*webcamRatio.y);
    //  Mouth loop #4:
    line(vertex[434][0]*webcamRatio.x, vertex[434][1]*webcamRatio.y, vertex[427][0]*webcamRatio.x, vertex[427][1]*webcamRatio.y);
}
function contours(v)   {
    //  Face:
        //  Ring #1:
    line(vertex[199][0]*webcamRatio.x, vertex[199][1]*webcamRatio.y, vertex[262][0]*webcamRatio.x, vertex[262][1]*webcamRatio.y);
    line(vertex[262][0]*webcamRatio.x, vertex[262][1]*webcamRatio.y, vertex[430][0]*webcamRatio.x, vertex[430][1]*webcamRatio.y);
    line(vertex[430][0]*webcamRatio.x, vertex[430][1]*webcamRatio.y, vertex[434][0]*webcamRatio.x, vertex[434][1]*webcamRatio.y);
    line(vertex[434][0]*webcamRatio.x, vertex[434][1]*webcamRatio.y, vertex[433][0]*webcamRatio.x, vertex[433][1]*webcamRatio.y);
    line(vertex[433][0]*webcamRatio.x, vertex[433][1]*webcamRatio.y, vertex[352][0]*webcamRatio.x, vertex[352][1]*webcamRatio.y);
    line(vertex[352][0]*webcamRatio.x, vertex[352][1]*webcamRatio.y, vertex[372][0]*webcamRatio.x, vertex[372][1]*webcamRatio.y);
    line(vertex[372][0]*webcamRatio.x, vertex[372][1]*webcamRatio.y, vertex[300][0]*webcamRatio.x, vertex[300][1]*webcamRatio.y);
    line(vertex[300][0]*webcamRatio.x, vertex[300][1]*webcamRatio.y, vertex[334][0]*webcamRatio.x, vertex[334][1]*webcamRatio.y);
    line(vertex[334][0]*webcamRatio.x, vertex[334][1]*webcamRatio.y, vertex[336][0]*webcamRatio.x, vertex[336][1]*webcamRatio.y);
    line(vertex[336][0]*webcamRatio.x, vertex[336][1]*webcamRatio.y, vertex[9][0]*webcamRatio.x, vertex[9][1]*webcamRatio.y);
    line(vertex[9][0]*webcamRatio.x, vertex[9][1]*webcamRatio.y, vertex[107][0]*webcamRatio.x, vertex[107][1]*webcamRatio.y);
    line(vertex[107][0]*webcamRatio.x, vertex[107][1]*webcamRatio.y, vertex[105][0]*webcamRatio.x, vertex[105][1]*webcamRatio.y);
    line(vertex[105][0]*webcamRatio.x, vertex[105][1]*webcamRatio.y, vertex[70][0]*webcamRatio.x, vertex[70][1]*webcamRatio.y);
    line(vertex[70][0]*webcamRatio.x, vertex[70][1]*webcamRatio.y, vertex[143][0]*webcamRatio.x, vertex[143][1]*webcamRatio.y);
    line(vertex[143][0]*webcamRatio.x, vertex[143][1]*webcamRatio.y, vertex[213][0]*webcamRatio.x, vertex[213][1]*webcamRatio.y);
    line(vertex[213][0]*webcamRatio.x, vertex[213][1]*webcamRatio.y, vertex[214][0]*webcamRatio.x, vertex[214][1]*webcamRatio.y);
    line(vertex[214][0]*webcamRatio.x, vertex[214][1]*webcamRatio.y, vertex[210][0]*webcamRatio.x, vertex[210][1]*webcamRatio.y);
    line(vertex[210][0]*webcamRatio.x, vertex[210][1]*webcamRatio.y, vertex[32][0]*webcamRatio.x, vertex[32][1]*webcamRatio.y);
    line(vertex[32][0]*webcamRatio.x, vertex[32][1]*webcamRatio.y, vertex[199][0]*webcamRatio.x, vertex[199][1]*webcamRatio.y);
        //  Ring #2:
    line(vertex[18][0]*webcamRatio.x, vertex[18][1]*webcamRatio.y, vertex[406][0]*webcamRatio.x, vertex[406][1]*webcamRatio.y);
    line(vertex[406][0]*webcamRatio.x, vertex[406][1]*webcamRatio.y, vertex[273][0]*webcamRatio.x, vertex[273][1]*webcamRatio.y);
    line(vertex[273][0]*webcamRatio.x, vertex[273][1]*webcamRatio.y, vertex[287][0]*webcamRatio.x, vertex[287][1]*webcamRatio.y);

    line(vertex[57][0]*webcamRatio.x, vertex[57][1]*webcamRatio.y, vertex[43][0]*webcamRatio.x, vertex[43][1]*webcamRatio.y);
    line(vertex[43][0]*webcamRatio.x, vertex[43][1]*webcamRatio.y, vertex[182][0]*webcamRatio.x, vertex[182][1]*webcamRatio.y);
    line(vertex[182][0]*webcamRatio.x, vertex[182][1]*webcamRatio.y, vertex[18][0]*webcamRatio.x, vertex[18][1]*webcamRatio.y);
    //  Mouth Contour:
    //  Right:
    line(vertex[14][0]*webcamRatio.x, vertex[14][1]*webcamRatio.y, vertex[402][0]*webcamRatio.x, vertex[402][1]*webcamRatio.y);
    line(vertex[402][0]*webcamRatio.x, vertex[402][1]*webcamRatio.y, vertex[324][0]*webcamRatio.x, vertex[324][1]*webcamRatio.y);
    line(vertex[324][0]*webcamRatio.x, vertex[324][1]*webcamRatio.y, vertex[308][0]*webcamRatio.x, vertex[308][1]*webcamRatio.y);
    line(vertex[308][0]*webcamRatio.x, vertex[308][1]*webcamRatio.y, vertex[415][0]*webcamRatio.x, vertex[415][1]*webcamRatio.y);
    line(vertex[415][0]*webcamRatio.x, vertex[415][1]*webcamRatio.y, vertex[311][0]*webcamRatio.x, vertex[311][1]*webcamRatio.y);
    line(vertex[311][0]*webcamRatio.x, vertex[311][1]*webcamRatio.y, vertex[13][0]*webcamRatio.x, vertex[13][1]*webcamRatio.y);
    //  Left:
    line(vertex[14][0]*webcamRatio.x, vertex[14][1]*webcamRatio.y, vertex[178][0]*webcamRatio.x, vertex[178][1]*webcamRatio.y);
    line(vertex[178][0]*webcamRatio.x, vertex[178][1]*webcamRatio.y, vertex[95][0]*webcamRatio.x, vertex[95][1]*webcamRatio.y);
    line(vertex[95][0]*webcamRatio.x, vertex[95][1]*webcamRatio.y, vertex[78][0]*webcamRatio.x, vertex[78][1]*webcamRatio.y);
    line(vertex[78][0]*webcamRatio.x, vertex[78][1]*webcamRatio.y, vertex[191][0]*webcamRatio.x, vertex[191][1]*webcamRatio.y);
    line(vertex[191][0]*webcamRatio.x, vertex[191][1]*webcamRatio.y, vertex[81][0]*webcamRatio.x, vertex[81][1]*webcamRatio.y);
    line(vertex[81][0]*webcamRatio.x, vertex[81][1]*webcamRatio.y, vertex[13][0]*webcamRatio.x, vertex[13][1]*webcamRatio.y);

    //Right Eye:

    //Left Eye:
}

