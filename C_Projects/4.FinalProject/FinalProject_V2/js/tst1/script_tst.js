/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";


const STATE =   {
    BIOS:  `BIOS`,
    MIMICK: `MIMICK`
};
let state   =   STATE.BIOS;

const SUBSTATE  =   {
    ASK:    `ASK`,
    WIN:    `WIN`,
    LOSE:   `LOSE`,
    CONF:   `CONF`,
    TERM:   `TERM`
};
let substate    =   SUBSTATE.ASK;


let faceAI  =   undefined;

/*  */
function preload() {

}


/*  */
function setup() {
    createCanvas(windowHeight, windowHeight);
    faceAI  =   new Face_AI();
    faceAI.setup();
}


/*  */
function draw() {
    switch (substate)   {
        case SUBSTATE.ASK:
            asking();
            break;
        case SUBSTATE.WIN:
            winning();
            break;
        case SUBSTATE.LOSE:
            losing();
            break;
        case SUBSTATE.CONF:
            confused();
            break;
        case SUBSTATE.TERM:
            terminating();
            break;
    }


    // faceAI.draw();
}


function biosScreen()   {
    background(100);
}

function gameScreen()   {
    faceAI.running();

}

function asking()   {
    push();
    fill(255);
    textSize(26);
    textAlign(CENTER, CENTER);
    text(`Asking...`, width/2, height/2);
    pop();
}
function winning()   {
    push();
    fill(0, 255, 0);
    textSize(26);
    textAlign(CENTER, CENTER);
    text(`Win!`, width/2, height/2);
    pop();
}
function losing()   {
    push();
    fill(255, 0, 0);
    textSize(26);
    textAlign(CENTER, CENTER);
    text(`Lost!`, width/2, height/2);
    pop();
}
function confused()   {
    push();
    fill(0, 0, 255);
    textSize(26);
    textAlign(CENTER, CENTER);
    text(`...Win?`, width/2, height/2);
    pop();
}
function terminating()   {
    background(255);
}

function keyPressed()   {
    if (event.keyCode === 49)   {
        substate    =   SUBSTATE.ASK;
    }
    if (event.keyCode === 50)   {
        substate    =   SUBSTATE.WIN;
    }
    if (event.keyCode === 51)   {
        substate    =   SUBSTATE.LOSE;
    }
    if (event.keyCode === 52)   {
        substate    =   SUBSTATE.CONF;
    }
    if (event.keyCode === 53)   {
        substate    =   SUBSTATE.TERM;
    }
}

