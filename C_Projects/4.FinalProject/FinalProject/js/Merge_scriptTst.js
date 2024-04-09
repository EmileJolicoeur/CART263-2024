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

//  Triggers:
let camera  =   false;

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
    let flippedVid    =   ml5.flipImage(vid);

    if (camera) {
        image(flippedVid, 0, 0, width, height);
        image(vid, 0, 0, width, height);
    }


    for (let i = 0; i < results.length; i ++)   {
        const vertex =   results[i].scaledMesh;
        // console.log(vertex);
    
        displayMesh(vertex);

        //  Draw dots:
        for (let j = 0; j < vertex.length; j += 1)   {
            const [x, y]   =   vertex[j];

            let vertexX   =   x*webcamRatio.x;
            let vertexY   =   y*webcamRatio.y;


            // verticeNB(vertexX, vertexY, j);
            // displayDots(vertexX, vertexY, j, vertex);
        }
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

    foreheadMesh(vertex);
    lowerEyelidMesh(vertex);
    noseMesh(vertex);
    upperJawMesh(vertex);
    jawMesh(vertex);

    pop();
}

/** Chin:   */
function jawMesh(v) {
    stroke(255, 100, 0);
    //  Y0:
    line(v[152][0]*webcamRatio.x,   v[152][1]*webcamRatio.y,    v[175][0]*webcamRatio.x,    v[175][1]*webcamRatio.y);
    line(v[175][0]*webcamRatio.x,   v[175][1]*webcamRatio.y,    v[200][0]*webcamRatio.x,    v[200][1]*webcamRatio.y);
    line(v[200][0]*webcamRatio.x,   v[200][1]*webcamRatio.y,    v[17][0]*webcamRatio.x,     v[17][1]*webcamRatio.y);
    line(v[17][0]*webcamRatio.x,    v[17][1]*webcamRatio.y,     v[16][0]*webcamRatio.x,     v[16][1]*webcamRatio.y);
    line(v[16][0]*webcamRatio.x,    v[16][1]*webcamRatio.y,     v[14][0]*webcamRatio.x,     v[14][1]*webcamRatio.y);
    //  Y1:
    line(v[377][0]*webcamRatio.x,   v[377][1]*webcamRatio.y,    v[396][0]*webcamRatio.x,    v[396][1]*webcamRatio.y);
    line(v[396][0]*webcamRatio.x,   v[396][1]*webcamRatio.y,    v[421][0]*webcamRatio.x,    v[421][1]*webcamRatio.y);
    line(v[421][0]*webcamRatio.x,   v[421][1]*webcamRatio.y,    v[314][0]*webcamRatio.x,    v[314][1]*webcamRatio.y);
    line(v[314][0]*webcamRatio.x,   v[314][1]*webcamRatio.y,    v[315][0]*webcamRatio.x,    v[315][1]*webcamRatio.y);
    line(v[315][0]*webcamRatio.x,   v[315][1]*webcamRatio.y,    v[317][0]*webcamRatio.x,    v[317][1]*webcamRatio.y);
    //  Y2:
    line(v[378][0]*webcamRatio.x,   v[378][1]*webcamRatio.y,    v[395][0]*webcamRatio.x,    v[395][1]*webcamRatio.y);
    line(v[395][0]*webcamRatio.x,   v[395][1]*webcamRatio.y,    v[424][0]*webcamRatio.x,    v[424][1]*webcamRatio.y);
    line(v[424][0]*webcamRatio.x,   v[424][1]*webcamRatio.y,    v[321][0]*webcamRatio.x,    v[321][1]*webcamRatio.y);
    line(v[321][0]*webcamRatio.x,   v[321][1]*webcamRatio.y,    v[320][0]*webcamRatio.x,    v[320][1]*webcamRatio.y);
    line(v[320][0]*webcamRatio.x,   v[320][1]*webcamRatio.y,    v[318][0]*webcamRatio.x,    v[318][1]*webcamRatio.y);
    //  Y3:
    line(v[308][0]*webcamRatio.x,   v[308][1]*webcamRatio.y,    v[306][0]*webcamRatio.x,    v[306][1]*webcamRatio.y);
    line(v[306][0]*webcamRatio.x,   v[306][1]*webcamRatio.y,    v[291][0]*webcamRatio.x,    v[291][1]*webcamRatio.y);
    line(v[291][0]*webcamRatio.x,   v[291][1]*webcamRatio.y,    v[432][0]*webcamRatio.x,    v[432][1]*webcamRatio.y);
    line(v[432][0]*webcamRatio.x,   v[432][1]*webcamRatio.y,    v[364][0]*webcamRatio.x,    v[364][1]*webcamRatio.y);
    line(v[364][0]*webcamRatio.x,   v[364][1]*webcamRatio.y,    v[365][0]*webcamRatio.x,    v[365][1]*webcamRatio.y);
    //  Y-1:
    line(v[148][0]*webcamRatio.x,   v[148][1]*webcamRatio.y,    v[171][0]*webcamRatio.x,    v[171][1]*webcamRatio.y);
    line(v[171][0]*webcamRatio.x,   v[171][1]*webcamRatio.y,    v[201][0]*webcamRatio.x,    v[201][1]*webcamRatio.y);
    line(v[201][0]*webcamRatio.x,   v[201][1]*webcamRatio.y,    v[84][0]*webcamRatio.x,     v[84][1]*webcamRatio.y);
    line(v[84][0]*webcamRatio.x,    v[84][1]*webcamRatio.y,     v[85][0]*webcamRatio.x,     v[85][1]*webcamRatio.y);
    line(v[85][0]*webcamRatio.x,    v[85][1]*webcamRatio.y,     v[87][0]*webcamRatio.x,     v[87][1]*webcamRatio.y);
    //  Y-2:
    line(v[149][0]*webcamRatio.x,   v[149][1]*webcamRatio.y,    v[170][0]*webcamRatio.x,    v[170][1]*webcamRatio.y);
    line(v[170][0]*webcamRatio.x,   v[170][1]*webcamRatio.y,    v[204][0]*webcamRatio.x,    v[204][1]*webcamRatio.y);
    line(v[204][0]*webcamRatio.x,   v[204][1]*webcamRatio.y,    v[91][0]*webcamRatio.x,     v[91][1]*webcamRatio.y);
    line(v[91][0]*webcamRatio.x,    v[91][1]*webcamRatio.y,     v[90][0]*webcamRatio.x,     v[90][1]*webcamRatio.y);
    line(v[90][0]*webcamRatio.x,    v[90][1]*webcamRatio.y,     v[88][0]*webcamRatio.x,     v[88][1]*webcamRatio.y);
    //  Y-3:
    line(v[78][0]*webcamRatio.x,    v[78][1]*webcamRatio.y,     v[76][0]*webcamRatio.x,     v[76][1]*webcamRatio.y);
    line(v[76][0]*webcamRatio.x,    v[76][1]*webcamRatio.y,     v[61][0]*webcamRatio.x,     v[61][1]*webcamRatio.y);
    line(v[61][0]*webcamRatio.x,    v[61][1]*webcamRatio.y,     v[212][0]*webcamRatio.x,    v[212][1]*webcamRatio.y);
    line(v[212][0]*webcamRatio.x,   v[212][1]*webcamRatio.y,    v[135][0]*webcamRatio.x,    v[135][1]*webcamRatio.y);
    line(v[135][0]*webcamRatio.x,   v[135][1]*webcamRatio.y,    v[136][0]*webcamRatio.x,    v[136][1]*webcamRatio.y);
    
    //  X1:
    line(v[364][0]*webcamRatio.x,   v[364][1]*webcamRatio.y,    v[395][0]*webcamRatio.x,    v[395][1]*webcamRatio.y);
    line(v[395][0]*webcamRatio.x,   v[395][1]*webcamRatio.y,    v[396][0]*webcamRatio.x,    v[396][1]*webcamRatio.y);
    line(v[396][0]*webcamRatio.x,   v[396][1]*webcamRatio.y,    v[175][0]*webcamRatio.x,    v[175][1]*webcamRatio.y);
    line(v[175][0]*webcamRatio.x,   v[175][1]*webcamRatio.y,    v[171][0]*webcamRatio.x,    v[171][1]*webcamRatio.y);
    line(v[171][0]*webcamRatio.x,   v[171][1]*webcamRatio.y,    v[170][0]*webcamRatio.x,    v[170][1]*webcamRatio.y);
    line(v[170][0]*webcamRatio.x,   v[170][1]*webcamRatio.y,    v[135][0]*webcamRatio.x,    v[135][1]*webcamRatio.y);
    //  X2:
    line(v[432][0]*webcamRatio.x,   v[432][1]*webcamRatio.y,    v[424][0]*webcamRatio.x,    v[424][1]*webcamRatio.y);
    line(v[424][0]*webcamRatio.x,   v[424][1]*webcamRatio.y,    v[421][0]*webcamRatio.x,    v[421][1]*webcamRatio.y);
    line(v[421][0]*webcamRatio.x,   v[421][1]*webcamRatio.y,    v[200][0]*webcamRatio.x,    v[200][1]*webcamRatio.y);
    line(v[200][0]*webcamRatio.x,   v[200][1]*webcamRatio.y,    v[201][0]*webcamRatio.x,    v[201][1]*webcamRatio.y);
    line(v[201][0]*webcamRatio.x,   v[201][1]*webcamRatio.y,    v[204][0]*webcamRatio.x,    v[204][1]*webcamRatio.y);
    line(v[204][0]*webcamRatio.x,   v[204][1]*webcamRatio.y,    v[212][0]*webcamRatio.x,    v[212][1]*webcamRatio.y);
    //  X3:
    line(v[291][0]*webcamRatio.x,   v[291][1]*webcamRatio.y,    v[321][0]*webcamRatio.x,    v[321][1]*webcamRatio.y);
    line(v[321][0]*webcamRatio.x,   v[321][1]*webcamRatio.y,    v[314][0]*webcamRatio.x,    v[314][1]*webcamRatio.y);
    line(v[314][0]*webcamRatio.x,   v[314][1]*webcamRatio.y,    v[17][0]*webcamRatio.x,     v[17][1]*webcamRatio.y);
    line(v[17][0]*webcamRatio.x,    v[17][1]*webcamRatio.y,     v[84][0]*webcamRatio.x,     v[84][1]*webcamRatio.y);
    line(v[84][0]*webcamRatio.x,    v[84][1]*webcamRatio.y,     v[91][0]*webcamRatio.x,     v[91][1]*webcamRatio.y);
    line(v[91][0]*webcamRatio.x,    v[91][1]*webcamRatio.y,     v[61][0]*webcamRatio.x,     v[61][1]*webcamRatio.y);
    //  X4:
    line(v[306][0]*webcamRatio.x,   v[306][1]*webcamRatio.y,    v[320][0]*webcamRatio.x,    v[320][1]*webcamRatio.y);
    line(v[320][0]*webcamRatio.x,   v[320][1]*webcamRatio.y,    v[315][0]*webcamRatio.x,    v[315][1]*webcamRatio.y);
    line(v[315][0]*webcamRatio.x,   v[315][1]*webcamRatio.y,    v[16][0]*webcamRatio.x,     v[16][1]*webcamRatio.y);
    line(v[16][0]*webcamRatio.x,    v[16][1]*webcamRatio.y,     v[85][0]*webcamRatio.x,     v[85][1]*webcamRatio.y);
    line(v[85][0]*webcamRatio.x,    v[85][1]*webcamRatio.y,     v[90][0]*webcamRatio.x,     v[90][1]*webcamRatio.y);
    line(v[90][0]*webcamRatio.x,    v[90][1]*webcamRatio.y,     v[76][0]*webcamRatio.x,     v[76][1]*webcamRatio.y);
    //  X5:
    line(v[308][0]*webcamRatio.x,   v[308][1]*webcamRatio.y,    v[318][0]*webcamRatio.x,    v[318][1]*webcamRatio.y);
    line(v[318][0]*webcamRatio.x,   v[318][1]*webcamRatio.y,    v[317][0]*webcamRatio.x,    v[317][1]*webcamRatio.y);
    line(v[317][0]*webcamRatio.x,   v[317][1]*webcamRatio.y,    v[14][0]*webcamRatio.x,     v[14][1]*webcamRatio.y);
    line(v[14][0]*webcamRatio.x,    v[14][1]*webcamRatio.y,     v[87][0]*webcamRatio.x,     v[87][1]*webcamRatio.y);
    line(v[87][0]*webcamRatio.x,    v[87][1]*webcamRatio.y,     v[88][0]*webcamRatio.x,     v[88][1]*webcamRatio.y);
    line(v[88][0]*webcamRatio.x,    v[88][1]*webcamRatio.y,     v[78][0]*webcamRatio.x,     v[78][1]*webcamRatio.y);
}
/** Cheeks: */
function upperJawMesh(v)    {
    stroke(100, 100, 255);
    //  Y0:
    line(v[13][0]*webcamRatio.x,    v[13][1]*webcamRatio.y,     v[11][0]*webcamRatio.x,     v[11][1]*webcamRatio.y);
    line(v[11][0]*webcamRatio.x,    v[11][1]*webcamRatio.y,     v[0][0]*webcamRatio.x,      v[0][1]*webcamRatio.y);
    line(v[0][0]*webcamRatio.x,     v[0][1]*webcamRatio.y,      v[2][0]*webcamRatio.x,      v[2][1]*webcamRatio.y);
    //  Y1:
    line(v[312][0]*webcamRatio.x,   v[312][1]*webcamRatio.y,    v[302][0]*webcamRatio.x,    v[302][1]*webcamRatio.y);
    line(v[302][0]*webcamRatio.x,   v[302][1]*webcamRatio.y,    v[267][0]*webcamRatio.x,    v[267][1]*webcamRatio.y);
    line(v[267][0]*webcamRatio.x,   v[267][1]*webcamRatio.y,    v[326][0]*webcamRatio.x,    v[326][1]*webcamRatio.y);
    //  Y2:
    line(v[310][0]*webcamRatio.x,   v[310][1]*webcamRatio.y,    v[304][0]*webcamRatio.x,    v[304][1]*webcamRatio.y);
    line(v[304][0]*webcamRatio.x,   v[304][1]*webcamRatio.y,    v[270][0]*webcamRatio.x,    v[270][1]*webcamRatio.y);
    line(v[270][0]*webcamRatio.x,   v[270][1]*webcamRatio.y,    v[327][0]*webcamRatio.x,    v[327][1]*webcamRatio.y);
    line(v[327][0]*webcamRatio.x,   v[327][1]*webcamRatio.y,    v[358][0]*webcamRatio.x,    v[358][1]*webcamRatio.y);
    //  +Y3:
    line(v[291][0]*webcamRatio.x,   v[291][1]*webcamRatio.y,    v[426][0]*webcamRatio.x,    v[426][1]*webcamRatio.y);
    line(v[426][0]*webcamRatio.x,   v[426][1]*webcamRatio.y,    v[266][0]*webcamRatio.x,    v[266][1]*webcamRatio.y);

    line(v[432][0]*webcamRatio.x,   v[432][1]*webcamRatio.y,    v[427][0]*webcamRatio.x,    v[427][1]*webcamRatio.y);
    line(v[427][0]*webcamRatio.x,   v[427][1]*webcamRatio.y,    v[280][0]*webcamRatio.x,    v[280][1]*webcamRatio.y);

    line(v[364][0]*webcamRatio.x,   v[364][1]*webcamRatio.y,    v[435][0]*webcamRatio.x,    v[435][1]*webcamRatio.y);
    line(v[435][0]*webcamRatio.x,   v[435][1]*webcamRatio.y,    v[366][0]*webcamRatio.x,    v[366][1]*webcamRatio.y);
    //  Y-1:
    line(v[82][0]*webcamRatio.x,    v[82][1]*webcamRatio.y,     v[72][0]*webcamRatio.x,     v[72][1]*webcamRatio.y);
    line(v[72][0]*webcamRatio.x,    v[72][1]*webcamRatio.y,     v[37][0]*webcamRatio.x,     v[37][1]*webcamRatio.y);
    line(v[37][0]*webcamRatio.x,    v[37][1]*webcamRatio.y,     v[97][0]*webcamRatio.x,     v[97][1]*webcamRatio.y);
    //  Y-2:
    line(v[80][0]*webcamRatio.x,    v[80][1]*webcamRatio.y,     v[74][0]*webcamRatio.x,     v[74][1]*webcamRatio.y);
    line(v[74][0]*webcamRatio.x,    v[74][1]*webcamRatio.y,     v[40][0]*webcamRatio.x,     v[40][1]*webcamRatio.y);
    line(v[40][0]*webcamRatio.x,    v[40][1]*webcamRatio.y,     v[98][0]*webcamRatio.x,     v[98][1]*webcamRatio.y);
    line(v[98][0]*webcamRatio.x,    v[98][1]*webcamRatio.y,     v[129][0]*webcamRatio.x,    v[129][1]*webcamRatio.y);
    //  +Y-3:
    line(v[61][0]*webcamRatio.x,    v[61][1]*webcamRatio.y,     v[206][0]*webcamRatio.x,    v[206][1]*webcamRatio.y);
    line(v[206][0]*webcamRatio.x,   v[206][1]*webcamRatio.y,    v[36][0]*webcamRatio.x,     v[36][1]*webcamRatio.y);

    line(v[212][0]*webcamRatio.x,   v[212][1]*webcamRatio.y,    v[207][0]*webcamRatio.x,    v[207][1]*webcamRatio.y);
    line(v[207][0]*webcamRatio.x,   v[207][1]*webcamRatio.y,    v[50][0]*webcamRatio.x,     v[50][1]*webcamRatio.y);

    line(v[135][0]*webcamRatio.x,   v[135][1]*webcamRatio.y,    v[215][0]*webcamRatio.x,    v[215][1]*webcamRatio.y);
    line(v[215][0]*webcamRatio.x,   v[215][1]*webcamRatio.y,    v[137][0]*webcamRatio.x,    v[137][1]*webcamRatio.y);

    //  X5:
    line(v[78][0]*webcamRatio.x,    v[78][1]*webcamRatio.y,     v[80][0]*webcamRatio.x,     v[80][1]*webcamRatio.y);
    line(v[80][0]*webcamRatio.x,    v[80][1]*webcamRatio.y,     v[82][0]*webcamRatio.x,     v[82][1]*webcamRatio.y);
    line(v[82][0]*webcamRatio.x,    v[82][1]*webcamRatio.y,     v[13][0]*webcamRatio.x,     v[13][1]*webcamRatio.y);
    line(v[13][0]*webcamRatio.x,    v[13][1]*webcamRatio.y,     v[312][0]*webcamRatio.x,    v[312][1]*webcamRatio.y);
    line(v[312][0]*webcamRatio.x,   v[312][1]*webcamRatio.y,    v[310][0]*webcamRatio.x,    v[310][1]*webcamRatio.y);
    line(v[310][0]*webcamRatio.x,   v[310][1]*webcamRatio.y,    v[308][0]*webcamRatio.x,    v[308][1]*webcamRatio.y);
    //  X6:
    line(v[76][0]*webcamRatio.x,    v[76][1]*webcamRatio.y,     v[74][0]*webcamRatio.x,     v[74][1]*webcamRatio.y);
    line(v[74][0]*webcamRatio.x,    v[74][1]*webcamRatio.y,     v[72][0]*webcamRatio.x,     v[72][1]*webcamRatio.y);
    line(v[72][0]*webcamRatio.x,    v[72][1]*webcamRatio.y,     v[11][0]*webcamRatio.x,     v[11][1]*webcamRatio.y);
    line(v[11][0]*webcamRatio.x,    v[11][1]*webcamRatio.y,     v[302][0]*webcamRatio.x,    v[302][1]*webcamRatio.y);
    line(v[302][0]*webcamRatio.x,   v[302][1]*webcamRatio.y,    v[304][0]*webcamRatio.x,    v[304][1]*webcamRatio.y);
    line(v[304][0]*webcamRatio.x,   v[304][1]*webcamRatio.y,    v[306][0]*webcamRatio.x,    v[306][1]*webcamRatio.y);
    //  X7:
    line(v[61][0]*webcamRatio.x,    v[61][1]*webcamRatio.y,     v[40][0]*webcamRatio.x,     v[40][1]*webcamRatio.y);
    line(v[40][0]*webcamRatio.x,    v[40][1]*webcamRatio.y,     v[37][0]*webcamRatio.x,     v[37][1]*webcamRatio.y);
    line(v[37][0]*webcamRatio.x,    v[37][1]*webcamRatio.y,     v[0][0]*webcamRatio.x,      v[0][1]*webcamRatio.y);
    line(v[0][0]*webcamRatio.x,     v[0][1]*webcamRatio.y,      v[267][0]*webcamRatio.x,    v[267][1]*webcamRatio.y);
    line(v[267][0]*webcamRatio.x,   v[267][1]*webcamRatio.y,    v[270][0]*webcamRatio.x,    v[270][1]*webcamRatio.y);
    line(v[270][0]*webcamRatio.x,   v[270][1]*webcamRatio.y,    v[291][0]*webcamRatio.x,    v[291][1]*webcamRatio.y);
    //  X8:
    line(v[58][0]*webcamRatio.x,    v[58][1]*webcamRatio.y,     v[215][0]*webcamRatio.x,    v[215][1]*webcamRatio.y);
    line(v[215][0]*webcamRatio.x,   v[215][1]*webcamRatio.y,    v[207][0]*webcamRatio.x,    v[207][1]*webcamRatio.y);
    line(v[207][0]*webcamRatio.x,   v[207][1]*webcamRatio.y,    v[206][0]*webcamRatio.x,    v[206][1]*webcamRatio.y);
    line(v[206][0]*webcamRatio.x,   v[206][1]*webcamRatio.y,    v[98][0]*webcamRatio.x,     v[98][1]*webcamRatio.y);
    line(v[98][0]*webcamRatio.x,    v[98][1]*webcamRatio.y,     v[97][0]*webcamRatio.x,     v[97][1]*webcamRatio.y);
    line(v[97][0]*webcamRatio.x,    v[97][1]*webcamRatio.y,     v[2][0]*webcamRatio.x,      v[2][1]*webcamRatio.y);
    line(v[2][0]*webcamRatio.x,     v[2][1]*webcamRatio.y,      v[326][0]*webcamRatio.x,    v[326][1]*webcamRatio.y);
    line(v[326][0]*webcamRatio.x,   v[326][1]*webcamRatio.y,    v[327][0]*webcamRatio.x,    v[327][1]*webcamRatio.y);
    line(v[327][0]*webcamRatio.x,   v[327][1]*webcamRatio.y,    v[426][0]*webcamRatio.x,    v[426][1]*webcamRatio.y);
    line(v[426][0]*webcamRatio.x,   v[426][1]*webcamRatio.y,    v[427][0]*webcamRatio.x,    v[427][1]*webcamRatio.y);
    line(v[427][0]*webcamRatio.x,   v[427][1]*webcamRatio.y,    v[435][0]*webcamRatio.x,    v[435][1]*webcamRatio.y);
    line(v[435][0]*webcamRatio.x,   v[435][1]*webcamRatio.y,    v[288][0]*webcamRatio.x,    v[288][1]*webcamRatio.y);
    //  X9:
    line(v[93][0]*webcamRatio.x,    v[93][1]*webcamRatio.y,     v[137][0]*webcamRatio.x,    v[137][1]*webcamRatio.y);
    line(v[137][0]*webcamRatio.x,   v[137][1]*webcamRatio.y,    v[50][0]*webcamRatio.x,     v[50][1]*webcamRatio.y);
    line(v[50][0]*webcamRatio.x,    v[50][1]*webcamRatio.y,     v[36][0]*webcamRatio.x,     v[36][1]*webcamRatio.y);
    line(v[36][0]*webcamRatio.x,    v[36][1]*webcamRatio.y,     v[129][0]*webcamRatio.x,    v[129][1]*webcamRatio.y);
    
    line(v[358][0]*webcamRatio.x,   v[358][1]*webcamRatio.y,    v[266][0]*webcamRatio.x,    v[266][1]*webcamRatio.y);
    line(v[266][0]*webcamRatio.x,   v[266][1]*webcamRatio.y,    v[280][0]*webcamRatio.x,    v[280][1]*webcamRatio.y);
    line(v[280][0]*webcamRatio.x,   v[280][1]*webcamRatio.y,    v[366][0]*webcamRatio.x,    v[366][1]*webcamRatio.y);
    line(v[366][0]*webcamRatio.x,   v[366][1]*webcamRatio.y,    v[323][0]*webcamRatio.x,    v[323][1]*webcamRatio.y);
}
/** Nose:   */
function noseMesh(v)    {
    stroke(255, 255, 0);
    //  Y0:
    line(v[2][0]*webcamRatio.x,     v[2][1]*webcamRatio.y,      v[94][0]*webcamRatio.x,     v[94][1]*webcamRatio.y);
    line(v[94][0]*webcamRatio.x,    v[94][1]*webcamRatio.y,     v[19][0]*webcamRatio.x,     v[19][1]*webcamRatio.y);
    line(v[19][0]*webcamRatio.x,    v[19][1]*webcamRatio.y,     v[1][0]*webcamRatio.x,      v[1][1]*webcamRatio.y);
    line(v[1][0]*webcamRatio.x,     v[1][1]*webcamRatio.y,      v[4][0]*webcamRatio.x,      v[4][1]*webcamRatio.y);
    line(v[4][0]*webcamRatio.x,     v[4][1]*webcamRatio.y,      v[195][0]*webcamRatio.x,    v[195][1]*webcamRatio.y);
    //  Y1:
    line(v[326][0]*webcamRatio.x,   v[326][1]*webcamRatio.y,    v[370][0]*webcamRatio.x,    v[370][1]*webcamRatio.y);
    line(v[370][0]*webcamRatio.x,   v[370][1]*webcamRatio.y,    v[354][0]*webcamRatio.x,    v[354][1]*webcamRatio.y);
    line(v[354][0]*webcamRatio.x,   v[354][1]*webcamRatio.y,    v[274][0]*webcamRatio.x,    v[274][1]*webcamRatio.y);
    line(v[274][0]*webcamRatio.x,   v[274][1]*webcamRatio.y,    v[275][0]*webcamRatio.x,    v[275][1]*webcamRatio.y);

    line(v[275][0]*webcamRatio.x,   v[275][1]*webcamRatio.y,    v[248][0]*webcamRatio.x,    v[248][1]*webcamRatio.y);
    //  Y2:
    line(v[326][0]*webcamRatio.x,   v[326][1]*webcamRatio.y,    v[290][0]*webcamRatio.x,    v[290][1]*webcamRatio.y);
    // line(v[290][0]*webcamRatio.x,   v[290][1]*webcamRatio.y,    v[309][0]*webcamRatio.x,    v[309][1]*webcamRatio.y);
    line(v[309][0]*webcamRatio.x,   v[309][1]*webcamRatio.y,    v[344][0]*webcamRatio.x,    v[344][1]*webcamRatio.y);
    line(v[344][0]*webcamRatio.x,   v[344][1]*webcamRatio.y,    v[420][0]*webcamRatio.x,    v[420][1]*webcamRatio.y);
    //  Y-1:
    line(v[97][0]*webcamRatio.x,    v[97][1]*webcamRatio.y,     v[141][0]*webcamRatio.x,    v[141][1]*webcamRatio.y);
    line(v[141][0]*webcamRatio.x,   v[141][1]*webcamRatio.y,    v[125][0]*webcamRatio.x,    v[125][1]*webcamRatio.y);
    line(v[125][0]*webcamRatio.x,   v[125][1]*webcamRatio.y,    v[44][0]*webcamRatio.x,     v[44][1]*webcamRatio.y);
    line(v[44][0]*webcamRatio.x,    v[44][1]*webcamRatio.y,     v[45][0]*webcamRatio.x,     v[45][1]*webcamRatio.y);

    line(v[45][0]*webcamRatio.x,    v[45][1]*webcamRatio.y,     v[3][0]*webcamRatio.x,      v[3][1]*webcamRatio.y);

    //  Y-2:
    line(v[97][0]*webcamRatio.x,    v[97][1]*webcamRatio.y,     v[60][0]*webcamRatio.x,     v[60][1]*webcamRatio.y);
    // line(v[60][0]*webcamRatio.x,    v[60][1]*webcamRatio.y,     v[79][0]*webcamRatio.x,     v[79][1]*webcamRatio.y);
    line(v[79][0]*webcamRatio.x,    v[79][1]*webcamRatio.y,     v[115][0]*webcamRatio.x,    v[115][1]*webcamRatio.y);
    line(v[115][0]*webcamRatio.x,   v[115][1]*webcamRatio.y,    v[198][0]*webcamRatio.x,    v[198][1]*webcamRatio.y);
    //  Y-3:

    //  X8:
    line(v[98][0]*webcamRatio.x,    v[98][1]*webcamRatio.y,     v[75][0]*webcamRatio.x,     v[75][1]*webcamRatio.y);

    line(v[75][0]*webcamRatio.x,    v[75][1]*webcamRatio.y,     v[60][0]*webcamRatio.x,     v[60][1]*webcamRatio.y);
    line(v[60][0]*webcamRatio.x,    v[60][1]*webcamRatio.y,     v[20][0]*webcamRatio.x,     v[20][1]*webcamRatio.y);
    line(v[20][0]*webcamRatio.x,    v[20][1]*webcamRatio.y,     v[238][0]*webcamRatio.x,    v[238][1]*webcamRatio.y);
    line(v[238][0]*webcamRatio.x,   v[238][1]*webcamRatio.y,    v[79][0]*webcamRatio.x,     v[79][1]*webcamRatio.y);
    line(v[79][0]*webcamRatio.x,    v[79][1]*webcamRatio.y,     v[166][0]*webcamRatio.x,    v[166][1]*webcamRatio.y);
    line(v[166][0]*webcamRatio.x,   v[166][1]*webcamRatio.y,    v[75][0]*webcamRatio.x,     v[75][1]*webcamRatio.y);

    line(v[238][0]*webcamRatio.x,   v[238][1]*webcamRatio.y,    v[125][0]*webcamRatio.x,    v[125][1]*webcamRatio.y);
    line(v[125][0]*webcamRatio.x,   v[125][1]*webcamRatio.y,    v[19][0]*webcamRatio.x,     v[19][1]*webcamRatio.y);
    line(v[19][0]*webcamRatio.x,    v[19][1]*webcamRatio.y,     v[354][0]*webcamRatio.x,    v[354][1]*webcamRatio.y);
    line(v[354][0]*webcamRatio.x,   v[354][1]*webcamRatio.y,    v[458][0]*webcamRatio.x,    v[458][1]*webcamRatio.y);

    line(v[458][0]*webcamRatio.x,   v[458][1]*webcamRatio.y,    v[250][0]*webcamRatio.x,    v[250][1]*webcamRatio.y);
    line(v[250][0]*webcamRatio.x,   v[250][1]*webcamRatio.y,    v[290][0]*webcamRatio.x,    v[290][1]*webcamRatio.y);
    line(v[290][0]*webcamRatio.x,   v[290][1]*webcamRatio.y,    v[305][0]*webcamRatio.x,    v[305][1]*webcamRatio.y);
    line(v[305][0]*webcamRatio.x,   v[305][1]*webcamRatio.y,    v[392][0]*webcamRatio.x,    v[392][1]*webcamRatio.y);
    line(v[392][0]*webcamRatio.x,   v[392][1]*webcamRatio.y,    v[309][0]*webcamRatio.x,    v[309][1]*webcamRatio.y);
    line(v[309][0]*webcamRatio.x,   v[309][1]*webcamRatio.y,    v[458][0]*webcamRatio.x,    v[458][1]*webcamRatio.y);

    line(v[305][0]*webcamRatio.x,   v[305][1]*webcamRatio.y,    v[327][0]*webcamRatio.x,    v[327][1]*webcamRatio.y);

    //  X9:
    line(v[129][0]*webcamRatio.x,   v[129][1]*webcamRatio.y,    v[102][0]*webcamRatio.x,    v[102][1]*webcamRatio.y);
    line(v[102][0]*webcamRatio.x,   v[102][1]*webcamRatio.y,    v[48][0]*webcamRatio.x,     v[48][1]*webcamRatio.y);
    line(v[48][0]*webcamRatio.x,    v[48][1]*webcamRatio.y,     v[166][0]*webcamRatio.x,    v[166][1]*webcamRatio.y);
    // line(v[166][0]*webcamRatio.x,   v[166][1]*webcamRatio.y,    v[20][0]*webcamRatio.x,    v[20][1]*webcamRatio.y);
    line(v[20][0]*webcamRatio.x,    v[20][1]*webcamRatio.y,     v[141][0]*webcamRatio.x,    v[141][1]*webcamRatio.y);
    line(v[141][0]*webcamRatio.x,   v[141][1]*webcamRatio.y,    v[94][0]*webcamRatio.x,     v[94][1]*webcamRatio.y);
    line(v[94][0]*webcamRatio.x,    v[94][1]*webcamRatio.y,     v[370][0]*webcamRatio.x,    v[370][1]*webcamRatio.y);
    line(v[370][0]*webcamRatio.x,   v[370][1]*webcamRatio.y,    v[250][0]*webcamRatio.x,    v[250][1]*webcamRatio.y);
    // line(v[250][0]*webcamRatio.x,   v[250][1]*webcamRatio.y,    v[392][0]*webcamRatio.x,    v[392][1]*webcamRatio.y);
    line(v[392][0]*webcamRatio.x,   v[392][1]*webcamRatio.y,    v[278][0]*webcamRatio.x,    v[278][1]*webcamRatio.y);
    line(v[278][0]*webcamRatio.x,   v[278][1]*webcamRatio.y,    v[331][0]*webcamRatio.x,    v[331][1]*webcamRatio.y);
    line(v[331][0]*webcamRatio.x,   v[331][1]*webcamRatio.y,    v[358][0]*webcamRatio.x,    v[358][1]*webcamRatio.y);
    
    //  X10:
    line(v[79][0]*webcamRatio.x,    v[79][1]*webcamRatio.y,     v[44][0]*webcamRatio.x,     v[44][1]*webcamRatio.y);
    line(v[44][0]*webcamRatio.x,    v[44][1]*webcamRatio.y,     v[1][0]*webcamRatio.x,      v[1][1]*webcamRatio.y);
    line(v[1][0]*webcamRatio.x,     v[1][1]*webcamRatio.y,      v[274][0]*webcamRatio.x,    v[274][1]*webcamRatio.y);
    line(v[274][0]*webcamRatio.x,   v[274][1]*webcamRatio.y,    v[309][0]*webcamRatio.x,    v[309][1]*webcamRatio.y);

    //  X11:
    line(v[98][0]*webcamRatio.x,    v[98][1]*webcamRatio.y,     v[48][0]*webcamRatio.x,     v[48][1]*webcamRatio.y);
    line(v[48][0]*webcamRatio.x,    v[48][1]*webcamRatio.y,     v[115][0]*webcamRatio.x,    v[115][1]*webcamRatio.y);
    line(v[115][0]*webcamRatio.x,   v[115][1]*webcamRatio.y,    v[45][0]*webcamRatio.x,     v[45][1]*webcamRatio.y);
    line(v[45][0]*webcamRatio.x,    v[45][1]*webcamRatio.y,     v[4][0]*webcamRatio.x,      v[4][1]*webcamRatio.y);
    line(v[4][0]*webcamRatio.x,     v[4][1]*webcamRatio.y,      v[275][0]*webcamRatio.x,    v[275][1]*webcamRatio.y);
    line(v[275][0]*webcamRatio.x,   v[275][1]*webcamRatio.y,    v[344][0]*webcamRatio.x,    v[344][1]*webcamRatio.y);
    line(v[344][0]*webcamRatio.x,   v[344][1]*webcamRatio.y,    v[278][0]*webcamRatio.x,    v[278][1]*webcamRatio.y);
    line(v[278][0]*webcamRatio.x,   v[278][1]*webcamRatio.y,    v[327][0]*webcamRatio.x,    v[327][1]*webcamRatio.y);
    //  X12:
    line(v[102][0]*webcamRatio.x,   v[102][1]*webcamRatio.y,    v[198][0]*webcamRatio.x,    v[198][1]*webcamRatio.y);
    line(v[198][0]*webcamRatio.x,   v[198][1]*webcamRatio.y,    v[3][0]*webcamRatio.x,      v[3][1]*webcamRatio.y);
    line(v[3][0]*webcamRatio.x,     v[3][1]*webcamRatio.y,      v[195][0]*webcamRatio.x,    v[195][1]*webcamRatio.y);
    line(v[195][0]*webcamRatio.x,   v[195][1]*webcamRatio.y,    v[248][0]*webcamRatio.x,    v[248][1]*webcamRatio.y);
    line(v[248][0]*webcamRatio.x,   v[248][1]*webcamRatio.y,    v[420][0]*webcamRatio.x,    v[420][1]*webcamRatio.y);
    line(v[420][0]*webcamRatio.x,   v[420][1]*webcamRatio.y,    v[331][0]*webcamRatio.x,    v[331][1]*webcamRatio.y);
}
/** Cheekbones: */
function lowerEyelidMesh(v) {
    stroke(255, 0, 0);
    //  Y0:
    line(v[195][0]*webcamRatio.x,   v[195][1]*webcamRatio.y,    v[6][0]*webcamRatio.x,      v[6][1]*webcamRatio.y);
    //  Y1:
    line(v[248][0]*webcamRatio.x,   v[248][1]*webcamRatio.y,    v[351][0]*webcamRatio.x,    v[351][1]*webcamRatio.y);
    //  Y2:
    line(v[420][0]*webcamRatio.x,   v[420][1]*webcamRatio.y,    v[343][0]*webcamRatio.x,    v[343][1]*webcamRatio.y);
    //  Y3:
    line(v[358][0]*webcamRatio.x,   v[358][1]*webcamRatio.y,    v[355][0]*webcamRatio.x,    v[355][1]*webcamRatio.y);
    line(v[355][0]*webcamRatio.x,   v[355][1]*webcamRatio.y,    v[256][0]*webcamRatio.x,    v[256][1]*webcamRatio.y);
    line(v[256][0]*webcamRatio.x,   v[256][1]*webcamRatio.y,    v[381][0]*webcamRatio.x,    v[381][1]*webcamRatio.y);
    //  Y4:
    line(v[266][0]*webcamRatio.x,   v[266][1]*webcamRatio.y,    v[348][0]*webcamRatio.x,    v[348][1]*webcamRatio.y);
    line(v[348][0]*webcamRatio.x,   v[348][1]*webcamRatio.y,    v[253][0]*webcamRatio.x,    v[253][1]*webcamRatio.y);
    line(v[253][0]*webcamRatio.x,   v[253][1]*webcamRatio.y,    v[374][0]*webcamRatio.x,    v[374][1]*webcamRatio.y);
    //  Y5:
    line(v[390][0]*webcamRatio.x,   v[390][1]*webcamRatio.y,    v[339][0]*webcamRatio.x,    v[339][1]*webcamRatio.y);
    line(v[339][0]*webcamRatio.x,   v[339][1]*webcamRatio.y,    v[346][0]*webcamRatio.x,    v[346][1]*webcamRatio.y);
    line(v[346][0]*webcamRatio.x,   v[346][1]*webcamRatio.y,    v[280][0]*webcamRatio.x,    v[280][1]*webcamRatio.y);
    
    line(v[346][0]*webcamRatio.x,   v[346][1]*webcamRatio.y,    v[265][0]*webcamRatio.x,    v[265][1]*webcamRatio.y);
    //  Y6:
    line(v[366][0]*webcamRatio.x,   v[366][1]*webcamRatio.y,    v[447][0]*webcamRatio.x,    v[447][1]*webcamRatio.y);
    line(v[447][0]*webcamRatio.x,   v[447][1]*webcamRatio.y,    v[264][0]*webcamRatio.x,    v[264][1]*webcamRatio.y);


    //  Y-1:
    line(v[3][0]*webcamRatio.x,     v[3][1]*webcamRatio.y,      v[122][0]*webcamRatio.x,    v[122][1]*webcamRatio.y);
    //  Y-2:
    line(v[198][0]*webcamRatio.x,   v[198][1]*webcamRatio.y,    v[114][0]*webcamRatio.x,    v[114][1]*webcamRatio.y);
    //  Y-3:
    line(v[129][0]*webcamRatio.x,   v[129][1]*webcamRatio.y,    v[126][0]*webcamRatio.x,    v[126][1]*webcamRatio.y);
    line(v[126][0]*webcamRatio.x,   v[126][1]*webcamRatio.y,    v[26][0]*webcamRatio.x,     v[26][1]*webcamRatio.y);
    line(v[26][0]*webcamRatio.x,    v[26][1]*webcamRatio.y,     v[154][0]*webcamRatio.x,    v[154][1]*webcamRatio.y);
    //  Y-4:
    line(v[36][0]*webcamRatio.x,    v[36][1]*webcamRatio.y,     v[119][0]*webcamRatio.x,    v[119][1]*webcamRatio.y);
    line(v[119][0]*webcamRatio.x,   v[119][1]*webcamRatio.y,    v[23][0]*webcamRatio.x,     v[23][1]*webcamRatio.y);
    line(v[23][0]*webcamRatio.x,    v[23][1]*webcamRatio.y,     v[145][0]*webcamRatio.x,    v[145][1]*webcamRatio.y);
    //  Y-5:
    line(v[50][0]*webcamRatio.x,    v[50][1]*webcamRatio.y,     v[117][0]*webcamRatio.x,    v[117][1]*webcamRatio.y);
    line(v[117][0]*webcamRatio.x,   v[117][1]*webcamRatio.y,    v[110][0]*webcamRatio.x,    v[110][1]*webcamRatio.y);
    line(v[110][0]*webcamRatio.x,   v[110][1]*webcamRatio.y,    v[163][0]*webcamRatio.x,    v[163][1]*webcamRatio.y);
    
    line(v[117][0]*webcamRatio.x,   v[117][1]*webcamRatio.y,    v[35][0]*webcamRatio.x,     v[35][1]*webcamRatio.y);
    //  Y-6:
    line(v[137][0]*webcamRatio.x,   v[137][1]*webcamRatio.y,    v[227][0]*webcamRatio.x,    v[227][1]*webcamRatio.y);
    line(v[227][0]*webcamRatio.x,   v[227][1]*webcamRatio.y,    v[34][0]*webcamRatio.x,     v[34][1]*webcamRatio.y);


    //  X11:
    line(v[234][0]*webcamRatio.x,   v[234][1]*webcamRatio.y,    v[227][0]*webcamRatio.x,    v[227][1]*webcamRatio.y);
    line(v[227][0]*webcamRatio.x,   v[227][1]*webcamRatio.y,    v[117][0]*webcamRatio.x,    v[117][1]*webcamRatio.y);
    line(v[117][0]*webcamRatio.x,   v[117][1]*webcamRatio.y,    v[119][0]*webcamRatio.x,    v[119][1]*webcamRatio.y);
    line(v[119][0]*webcamRatio.x,   v[119][1]*webcamRatio.y,    v[126][0]*webcamRatio.x,    v[126][1]*webcamRatio.y);
    line(v[126][0]*webcamRatio.x,   v[126][1]*webcamRatio.y,    v[198][0]*webcamRatio.x,    v[198][1]*webcamRatio.y);

    line(v[420][0]*webcamRatio.x,   v[420][1]*webcamRatio.y,    v[355][0]*webcamRatio.x,    v[355][1]*webcamRatio.y);
    line(v[355][0]*webcamRatio.x,   v[355][1]*webcamRatio.y,    v[348][0]*webcamRatio.x,    v[348][1]*webcamRatio.y);
    line(v[348][0]*webcamRatio.x,   v[348][1]*webcamRatio.y,    v[346][0]*webcamRatio.x,    v[346][1]*webcamRatio.y);
    line(v[346][0]*webcamRatio.x,   v[346][1]*webcamRatio.y,    v[447][0]*webcamRatio.x,    v[447][1]*webcamRatio.y);
    line(v[447][0]*webcamRatio.x,   v[447][1]*webcamRatio.y,    v[454][0]*webcamRatio.x,    v[454][1]*webcamRatio.y);

    //  X12:
    line(v[26][0]*webcamRatio.x,    v[26][1]*webcamRatio.y,     v[114][0]*webcamRatio.x,    v[114][1]*webcamRatio.y);
    line(v[114][0]*webcamRatio.x,   v[114][1]*webcamRatio.y,    v[122][0]*webcamRatio.x,    v[122][1]*webcamRatio.y);

    line(v[351][0]*webcamRatio.x,   v[351][1]*webcamRatio.y,    v[343][0]*webcamRatio.x,    v[343][1]*webcamRatio.y);
    line(v[343][0]*webcamRatio.x,   v[343][1]*webcamRatio.y,    v[256][0]*webcamRatio.x,    v[256][1]*webcamRatio.y);

    //  X13:
    line(v[130][0]*webcamRatio.x,   v[130][1]*webcamRatio.y,    v[110][0]*webcamRatio.x,    v[110][1]*webcamRatio.y);
    line(v[110][0]*webcamRatio.x,   v[110][1]*webcamRatio.y,    v[23][0]*webcamRatio.x,     v[23][1]*webcamRatio.y);
    line(v[23][0]*webcamRatio.x,    v[23][1]*webcamRatio.y,     v[26][0]*webcamRatio.x,     v[26][1]*webcamRatio.y);
    line(v[26][0]*webcamRatio.x,    v[26][1]*webcamRatio.y,     v[244][0]*webcamRatio.x,    v[244][1]*webcamRatio.y);

    line(v[464][0]*webcamRatio.x,   v[464][1]*webcamRatio.y,    v[256][0]*webcamRatio.x,    v[256][1]*webcamRatio.y);
    line(v[256][0]*webcamRatio.x,   v[256][1]*webcamRatio.y,    v[253][0]*webcamRatio.x,    v[253][1]*webcamRatio.y);
    line(v[253][0]*webcamRatio.x,   v[253][1]*webcamRatio.y,    v[339][0]*webcamRatio.x,    v[339][1]*webcamRatio.y);
    line(v[339][0]*webcamRatio.x,   v[339][1]*webcamRatio.y,    v[359][0]*webcamRatio.x,    v[359][1]*webcamRatio.y);

    //  X14:
    line(v[127][0]*webcamRatio.x,   v[127][1]*webcamRatio.y,    v[34][0]*webcamRatio.x,     v[34][1]*webcamRatio.y);
    line(v[34][0]*webcamRatio.x,    v[34][1]*webcamRatio.y,     v[35][0]*webcamRatio.x,     v[35][1]*webcamRatio.y);
    line(v[35][0]*webcamRatio.x,    v[35][1]*webcamRatio.y,     v[130][0]*webcamRatio.x,    v[130][1]*webcamRatio.y);
    line(v[130][0]*webcamRatio.x,   v[130][1]*webcamRatio.y,    v[33][0]*webcamRatio.x,     v[33][1]*webcamRatio.y);
        //  Left Eye:
    line(v[33][0]*webcamRatio.x,    v[33][1]*webcamRatio.y,     v[163][0]*webcamRatio.x,    v[163][1]*webcamRatio.y);
    line(v[163][0]*webcamRatio.x,   v[163][1]*webcamRatio.y,    v[145][0]*webcamRatio.x,    v[145][1]*webcamRatio.y);
    line(v[145][0]*webcamRatio.x,   v[145][1]*webcamRatio.y,    v[154][0]*webcamRatio.x,    v[154][1]*webcamRatio.y);
    line(v[154][0]*webcamRatio.x,   v[154][1]*webcamRatio.y,    v[133][0]*webcamRatio.x,    v[133][1]*webcamRatio.y);

    line(v[133][0]*webcamRatio.x,   v[133][1]*webcamRatio.y,    v[244][0]*webcamRatio.x,    v[244][1]*webcamRatio.y);
    line(v[244][0]*webcamRatio.x,   v[244][1]*webcamRatio.y,    v[122][0]*webcamRatio.x,    v[122][1]*webcamRatio.y);
    line(v[122][0]*webcamRatio.x,   v[122][1]*webcamRatio.y,    v[6][0]*webcamRatio.x,      v[6][1]*webcamRatio.y);
    line(v[6][0]*webcamRatio.x,     v[6][1]*webcamRatio.y,      v[351][0]*webcamRatio.x,    v[351][1]*webcamRatio.y);
    line(v[351][0]*webcamRatio.x,   v[351][1]*webcamRatio.y,    v[464][0]*webcamRatio.x,    v[464][1]*webcamRatio.y);
    line(v[464][0]*webcamRatio.x,   v[464][1]*webcamRatio.y,    v[362][0]*webcamRatio.x,    v[362][1]*webcamRatio.y);
        //  Right Eye:
    line(v[362][0]*webcamRatio.x,   v[362][1]*webcamRatio.y,    v[381][0]*webcamRatio.x,    v[381][1]*webcamRatio.y);
    line(v[381][0]*webcamRatio.x,   v[381][1]*webcamRatio.y,    v[374][0]*webcamRatio.x,    v[374][1]*webcamRatio.y);
    line(v[374][0]*webcamRatio.x,   v[374][1]*webcamRatio.y,    v[390][0]*webcamRatio.x,    v[390][1]*webcamRatio.y);
    line(v[390][0]*webcamRatio.x,   v[390][1]*webcamRatio.y,    v[263][0]*webcamRatio.x,    v[263][1]*webcamRatio.y);
    
    line(v[263][0]*webcamRatio.x,   v[263][1]*webcamRatio.y,    v[359][0]*webcamRatio.x,    v[359][1]*webcamRatio.y);
    line(v[359][0]*webcamRatio.x,   v[359][1]*webcamRatio.y,    v[265][0]*webcamRatio.x,    v[265][1]*webcamRatio.y);
    line(v[265][0]*webcamRatio.x,   v[265][1]*webcamRatio.y,    v[264][0]*webcamRatio.x,    v[264][1]*webcamRatio.y);
    line(v[264][0]*webcamRatio.x,   v[264][1]*webcamRatio.y,    v[356][0]*webcamRatio.x,    v[356][1]*webcamRatio.y);
}
/** Forehead:   */
function foreheadMesh(v)    {
    stroke(100, 0, 255);
    //  Y0:
    // line(v[197][0]*webcamRatio.x,    v[197][1]*webcamRatio.y,     v[6][0]*webcamRatio.x,      v[6][1]*webcamRatio.y);
    line(v[6][0]*webcamRatio.x,     v[6][1]*webcamRatio.y,      v[8][0]*webcamRatio.x,      v[8][1]*webcamRatio.y);
    line(v[8][0]*webcamRatio.x,     v[8][1]*webcamRatio.y,      v[151][0]*webcamRatio.x,    v[151][1]*webcamRatio.y);
    line(v[151][0]*webcamRatio.x,   v[151][1]*webcamRatio.y,    v[10][0]*webcamRatio.x,     v[10][1]*webcamRatio.y);
    //  Y1:
    line(v[351][0]*webcamRatio.x,   v[351][1]*webcamRatio.y,    v[285][0]*webcamRatio.x,    v[285][1]*webcamRatio.y);
    line(v[285][0]*webcamRatio.x,   v[285][1]*webcamRatio.y,    v[337][0]*webcamRatio.x,    v[337][1]*webcamRatio.y);
    line(v[337][0]*webcamRatio.x,   v[337][1]*webcamRatio.y,    v[338][0]*webcamRatio.x,    v[338][1]*webcamRatio.y);
    //  Y2:
    line(v[386][0]*webcamRatio.x,   v[386][1]*webcamRatio.y,    v[257][0]*webcamRatio.x,    v[257][1]*webcamRatio.y);
    line(v[257][0]*webcamRatio.x,   v[257][1]*webcamRatio.y,    v[282][0]*webcamRatio.x,    v[282][1]*webcamRatio.y);
    line(v[282][0]*webcamRatio.x,   v[282][1]*webcamRatio.y,    v[333][0]*webcamRatio.x,    v[333][1]*webcamRatio.y);
    line(v[333][0]*webcamRatio.x,   v[333][1]*webcamRatio.y,    v[332][0]*webcamRatio.x,    v[332][1]*webcamRatio.y);
    //  Y3:
    line(v[388][0]*webcamRatio.x,   v[388][1]*webcamRatio.y,    v[260][0]*webcamRatio.x,    v[260][1]*webcamRatio.y);
    line(v[260][0]*webcamRatio.x,   v[260][1]*webcamRatio.y,    v[276][0]*webcamRatio.x,    v[276][1]*webcamRatio.y);
    line(v[276][0]*webcamRatio.x,   v[276][1]*webcamRatio.y,    v[301][0]*webcamRatio.x,    v[301][1]*webcamRatio.y);
    line(v[301][0]*webcamRatio.x,   v[301][1]*webcamRatio.y,    v[251][0]*webcamRatio.x,    v[251][1]*webcamRatio.y);
    //  Y-1:
    line(v[122][0]*webcamRatio.x,   v[122][1]*webcamRatio.y,    v[55][0]*webcamRatio.x,     v[55][1]*webcamRatio.y);
    line(v[55][0]*webcamRatio.x,    v[55][1]*webcamRatio.y,     v[108][0]*webcamRatio.x,    v[108][1]*webcamRatio.y);
    line(v[108][0]*webcamRatio.x,   v[108][1]*webcamRatio.y,    v[109][0]*webcamRatio.x,    v[109][1]*webcamRatio.y);
    //  Y-2:
    line(v[159][0]*webcamRatio.x,   v[159][1]*webcamRatio.y,    v[27][0]*webcamRatio.x,     v[27][1]*webcamRatio.y);
    line(v[27][0]*webcamRatio.x,    v[27][1]*webcamRatio.y,     v[52][0]*webcamRatio.x,     v[52][1]*webcamRatio.y);
    line(v[52][0]*webcamRatio.x,    v[52][1]*webcamRatio.y,     v[104][0]*webcamRatio.x,    v[104][1]*webcamRatio.y);
    line(v[104][0]*webcamRatio.x,   v[104][1]*webcamRatio.y,    v[103][0]*webcamRatio.x,    v[103][1]*webcamRatio.y);
    //  Y-3:
    line(v[161][0]*webcamRatio.x,   v[161][1]*webcamRatio.y,    v[30][0]*webcamRatio.x,     v[30][1]*webcamRatio.y);
    line(v[30][0]*webcamRatio.x,    v[30][1]*webcamRatio.y,     v[46][0]*webcamRatio.x,     v[46][1]*webcamRatio.y);
    line(v[46][0]*webcamRatio.x,    v[46][1]*webcamRatio.y,     v[71][0]*webcamRatio.x,     v[71][1]*webcamRatio.y);
    line(v[71][0]*webcamRatio.x,    v[71][1]*webcamRatio.y,     v[21][0]*webcamRatio.x,     v[21][1]*webcamRatio.y);
    
    //  X_:
    line(v[130][0]*webcamRatio.x,   v[130][1]*webcamRatio.y,    v[30][0]*webcamRatio.x,     v[30][1]*webcamRatio.y);
    line(v[30][0]*webcamRatio.x,    v[30][1]*webcamRatio.y,     v[27][0]*webcamRatio.x,     v[27][1]*webcamRatio.y);
    line(v[27][0]*webcamRatio.x,    v[27][1]*webcamRatio.y,     v[56][0]*webcamRatio.x,     v[56][1]*webcamRatio.y);
    line(v[56][0]*webcamRatio.x,    v[56][1]*webcamRatio.y,     v[244][0]*webcamRatio.x,    v[244][1]*webcamRatio.y);

    line(v[464][0]*webcamRatio.x,   v[464][1]*webcamRatio.y,    v[286][0]*webcamRatio.x,    v[286][1]*webcamRatio.y);
    line(v[286][0]*webcamRatio.x,   v[286][1]*webcamRatio.y,    v[257][0]*webcamRatio.x,    v[257][1]*webcamRatio.y);
    line(v[257][0]*webcamRatio.x,   v[257][1]*webcamRatio.y,    v[260][0]*webcamRatio.x,    v[260][1]*webcamRatio.y);
    line(v[260][0]*webcamRatio.x,   v[260][1]*webcamRatio.y,    v[359][0]*webcamRatio.x,    v[359][1]*webcamRatio.y);
    //  X_+1:
    line(v[33][0]*webcamRatio.x,    v[33][1]*webcamRatio.y,     v[161][0]*webcamRatio.x,    v[161][1]*webcamRatio.y);
    line(v[161][0]*webcamRatio.x,   v[161][1]*webcamRatio.y,    v[159][0]*webcamRatio.x,    v[159][1]*webcamRatio.y);
    line(v[159][0]*webcamRatio.x,   v[159][1]*webcamRatio.y,    v[157][0]*webcamRatio.x,    v[157][1]*webcamRatio.y);
    line(v[157][0]*webcamRatio.x,   v[157][1]*webcamRatio.y,    v[133][0]*webcamRatio.x,    v[133][1]*webcamRatio.y);
    
    line(v[362][0]*webcamRatio.x,   v[362][1]*webcamRatio.y,    v[384][0]*webcamRatio.x,    v[384][1]*webcamRatio.y);
    line(v[384][0]*webcamRatio.x,   v[384][1]*webcamRatio.y,    v[386][0]*webcamRatio.x,    v[386][1]*webcamRatio.y);
    line(v[386][0]*webcamRatio.x,   v[386][1]*webcamRatio.y,    v[388][0]*webcamRatio.x,    v[388][1]*webcamRatio.y);
    line(v[388][0]*webcamRatio.x,   v[388][1]*webcamRatio.y,    v[263][0]*webcamRatio.x,    v[263][1]*webcamRatio.y);
    //  X_+2:
    line(v[157][0]*webcamRatio.x,   v[157][1]*webcamRatio.y,    v[56][0]*webcamRatio.x,     v[56][1]*webcamRatio.y);
    line(v[56][0]*webcamRatio.x,    v[56][1]*webcamRatio.y,     v[55][0]*webcamRatio.x,     v[55][1]*webcamRatio.y);
    line(v[55][0]*webcamRatio.x,    v[55][1]*webcamRatio.y,     v[8][0]*webcamRatio.x,      v[8][1]*webcamRatio.y);
    line(v[8][0]*webcamRatio.x,     v[8][1]*webcamRatio.y,      v[285][0]*webcamRatio.x,    v[285][1]*webcamRatio.y);
    line(v[285][0]*webcamRatio.x,   v[285][1]*webcamRatio.y,    v[286][0]*webcamRatio.x,    v[286][1]*webcamRatio.y);
    line(v[286][0]*webcamRatio.x,   v[286][1]*webcamRatio.y,    v[384][0]*webcamRatio.x,    v[384][1]*webcamRatio.y);
    //  X_+3:
    line(v[35][0]*webcamRatio.x,    v[35][1]*webcamRatio.y,     v[46][0]*webcamRatio.x,     v[46][1]*webcamRatio.y);
    line(v[46][0]*webcamRatio.x,    v[46][1]*webcamRatio.y,     v[52][0]*webcamRatio.x,     v[52][1]*webcamRatio.y);
    line(v[52][0]*webcamRatio.x,    v[52][1]*webcamRatio.y,     v[55][0]*webcamRatio.x,     v[55][1]*webcamRatio.y);

    line(v[285][0]*webcamRatio.x,   v[285][1]*webcamRatio.y,    v[282][0]*webcamRatio.x,    v[282][1]*webcamRatio.y);
    line(v[282][0]*webcamRatio.x,   v[282][1]*webcamRatio.y,    v[276][0]*webcamRatio.x,    v[276][1]*webcamRatio.y);
    line(v[276][0]*webcamRatio.x,   v[276][1]*webcamRatio.y,    v[265][0]*webcamRatio.x,    v[265][1]*webcamRatio.y);
    //  X_+4:
    line(v[34][0]*webcamRatio.x,    v[34][1]*webcamRatio.y,     v[71][0]*webcamRatio.x,     v[71][1]*webcamRatio.y);
    line(v[71][0]*webcamRatio.x,    v[71][1]*webcamRatio.y,     v[104][0]*webcamRatio.x,    v[104][1]*webcamRatio.y);
    line(v[104][0]*webcamRatio.x,   v[104][1]*webcamRatio.y,    v[108][0]*webcamRatio.x,    v[108][1]*webcamRatio.y);
    line(v[108][0]*webcamRatio.x,   v[108][1]*webcamRatio.y,    v[151][0]*webcamRatio.x,    v[151][1]*webcamRatio.y);
    line(v[151][0]*webcamRatio.x,   v[151][1]*webcamRatio.y,    v[337][0]*webcamRatio.x,    v[337][1]*webcamRatio.y);
    line(v[337][0]*webcamRatio.x,   v[337][1]*webcamRatio.y,    v[333][0]*webcamRatio.x,    v[333][1]*webcamRatio.y);
    line(v[333][0]*webcamRatio.x,   v[333][1]*webcamRatio.y,    v[301][0]*webcamRatio.x,    v[301][1]*webcamRatio.y);
    line(v[301][0]*webcamRatio.x,   v[301][1]*webcamRatio.y,    v[264][0]*webcamRatio.x,    v[264][1]*webcamRatio.y);
}


function keyPressed()   {
    if (event.keyCode === 32)   {
        camera  =   !camera;
        console.log(camera);
    }
}