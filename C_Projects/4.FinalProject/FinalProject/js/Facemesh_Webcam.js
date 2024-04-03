"use strict"


//  facemesh variables:
let face;
let predictions =   [];
//  Video variables:
let video;
const options   =   {
    flipHorizontal: true,
};

//  Different states of face mapping:
const STATE =   {
    STARTUP:    `STARTUP`,
    GATHERING:  `GATHERING`,
    MIMICKING:  `MIMICKING`
};
let state   =   STATE.STARTUP;

/** Called Once On Start:   */
function setup()    {
    createCanvas(windowHeight, windowHeight, WEBGL);
    video   =   createCapture(VIDEO);
    video.position(0, 0);

    face    =   ml5.facemesh(video, modelReady);

    //  Predictions result array filled every time face in view:
    face.on("predict", results  =>  {
        if (results.length > 0) {
            predictions =   results;
        }
    });

    //  Hiding video:
    video.hide();
}

/** Called On Every Frame:  */
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


//  -   -   -   -   -   -   -   -   -   -   //


/** State changes:  */
function modelReady()   {
    state   =   STATE.MIMICKING;
    console.log("Model ready!");
}

/** If the mesh isn't loaded before start of draw():    */
function startup()  {
    // background(0);

    push();
    fill(255);
    textAlign(CENTER, CENTER);
    text(`Loading face...`, width/2, height/2);
    pop();
}

/** Face tracking has Started:  */
function mimicking()    {
    // console.log(`{Mimicking}`);
    // background(5, 30, 5);

    // Show the webcam
    let screenX =   -width/2;
    let screenY =   -height/2;
    image(video, screenX, screenY, width, height);


    // console.log(video, width/2 , height/2, video.width, video.height);

    // We can call both functions to draw all keypoints
    // displayMesh(screenX, screenY);
    displayModel();

    if (mouseIsPressed) {
        console.log(predictions);
    }
}


//  -   -   -   -   -   -   -   -   -   -   //


/** Vertices and edges mesh:    */
function displayMesh(x, y)  {

    meshVertices(x, y);
    meshEdges(x, y);

}

/** Display vertices:   */
function meshVertices(posX, posY)   {
    //  For every vertices seen on meshReference... :
    for (let i = 0; i < predictions.length; i += 1) {
        const vertex =   predictions[i].scaledMesh;
        // console.log(vertex);
    
            //  Draw dots:
            for (let j = 0; j < vertex.length; j += 1)   {
                const [x, y]   =   vertex[j];

                // let centerVertexX   =   x;
                // let centerVertexY   =   y;

                push();
                translate(4*posX/3, 5.25*posY/5);
                if (vertex[j] === vertex[195])  {
                    fill(255, 0, 0);
                    ellipse(x, y, 10, 10);
                    console.log(x, y, video.x, video.y);
                }
                else    {
                    fill(0, 255, 0);
                    ellipse(x, y, 3, 3);
                }
                pop();





                // push();
                // fill(255, 0, 0);
                // textAlign(CENTER,CENTER);
                // textSize(5);
                // text(i+1, x, y);
                // pop();
            }
        }
}
/** Displaying the mesh's edges:    */
function meshEdges()    {

}


//  -   -   -   -   -   -   -   -   -   -   //


/** Displaying 3d model:    */
function displayModel() {
    if (predictions.length > 0) {
        let data    =   predictions[0].scaledMesh[195];
        if (mouseIsPressed) {
            console.log(data);
        }
        let objectX =   data[0];
        let objectY =   data[1];
        let objectZ =   data[2];




        let objW    =   100;
        let objH    =   100;
        let objD    =   100;

        // objectX =   constrain(objW, 0, width);
        // objectY =   constrain(objH, 0, height);

        
        let color   =   colorChange(objectX, objectY, objectZ, objW, objH, objD);

        push();
        translate(-width/2, -height/2);
        translate(data[0], data[1], 100);
        rotateX(PI*(data[0])/45);
        rotateY(PI*(data[1])/45);
        // scale(objectZ, objectZ, objectZ);
        fill(color, color, 255);
        box(objW, objH, objD);
        pop();

        console.log(
            `Cube:\n`,
            floor(objectX),
            floor(objectY),
            floor(objectZ),
            objW, objH, objD
        );
    }
}

/** Changing color near edges of screen:    */
function colorChange(x, y, z, w, h, d)  {
    let lEdgeScreen =   0;
    let rEdgeScreen =   width/2;
    let tEdgeScreen =   0;
    let bEdgeScreen =   height/2;

    let color   =   255

    if (x + w/2 > rEdgeScreen || x + w/2 < lEdgeScreen || y + h/2 < tEdgeScreen || y + h/2 < tEdgeScreen > bEdgeScreen) {
        color--;
    }
    else if (color != 255)  {
        color++;
    }
    console.log(color);
    return color;
}


//  -   -   -   -   -   -   -   -   -   -   //


/** Debugging tool: Mouse:  */
function mouseDebugging()   {
    if (mouseIsPressed) {
        if (mouseButton === RIGHT)  {
            console.log(
                `MotionTracking:\n`
                `\t> Cube:`,
                `\n\t\tx:\t`, objectX,
                `\n\t\ty:\t`, objectY,
                `\n\t\tz:\t`, objectZ,
                `\n------------\n`,
                `\t> Mesh_Vertices:`,
                `\n\t\t`, predictions
            );
        }
    }
}

function keyPressed()   {
    if (event.keyCode === 49)   {

    }
}