/**
Bubble Popper
Emile Jolicoeur

finger tracking sim of popping bubbles
*/

"use strict";
//  User's webcam:
let video   =   undefined;
//  Handpose model:
let handpose    =   undefined;

//  current predictions:
let predictions =   [];
//  Bubble
let bubble  =   undefined;


/** On start:   */
function setup() {
    createCanvas(windowHeight, windowHeight);

    //  Setting up webcam access:
    video   =   createCapture(VIDEO);
    video.hide();

    //  Loading the handpose model:
    handpose    =   ml5.handpose(video, {
        flipHorizontal: true
    }, function()   {
        console.log(`hand ready`);
    });

    //  Listening for predictions:
    handpose.on(`predict`, function(results)   {
        console.log(results);
        predictions =   results;
    });

    bubble  =   {
        x:  random(width),
        y:  height,
        size:   100,
        vx: 0,
        vy: -2,
    };
}


/** */
function draw() {
    background(125, 125, 125);

    // finger();
    //  Finger properties:
    if (predictions.length > 0)    {
        let hand    =   predictions[0];
        let index   =   hand.annotations.indexFinger;
        let tip =   index[3];
        let base    =   index[0];
        let tipX    =   tip[0];
        let tipY    =   tip[1];
        let baseX    =   base[0];
        let baseY    =   base[1];
    
        //  Length of finger:
        push();
        noFill();
        stroke(0, 200, 0);
        strokeWeight(3);
        line(baseX, baseY, tipX, tipY);
        pop();

        //  Head of finger:
        push();
        noStroke();
        fill(0, 200, 0);
        ellipse(baseX, baseY, 20);
        pop();
    
        //  Popping Bubble:
        let d   =   dist(tipX, tipY, bubble.x, bubble.y);

        if (d < bubble.size/2   ||  bubble.y < 0)  {
            bubbleReset();
        }
    };


    if (bubble.y <0)    {
        bubbleReset();
    }

    //  Bubble movement:
    bubble.x    +=   bubble.vx;
    bubble.y    +=   bubble.vy;
    
    //  Display Bubble:
    push();
    fill(0, 20, 105);
    noStroke();
    ellipse(bubble.x, bubble.y, bubble.size);
    pop();

    console.log(bubble);
}

function bubbleReset()  {
    bubble.x    =   random(width);
    bubble.y    =   height;
}
