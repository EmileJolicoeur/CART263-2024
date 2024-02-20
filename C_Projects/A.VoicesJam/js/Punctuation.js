/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

/** List of languages:  */


/** List of family relations:   */
const familyList    =   [
    `brother`,
    `sister`,
    `father`,
    `mother`,
    `son`,
    `daughter`,
    `uncle`,
    `aunt`,
    `nephew`,
    `niece`,
];

/** List of AI Names:   */
const fakeNameList  =   [
    `ENIGMA`,           //E.N.Identity.G.M.A.?
    `Simon`,            //Simulated.Identity.Merge & O.N.
    `Arin`,             //Artificial.
    ``,
];


let currentInput    =   ``;
let currentOutput   =   `Awaiting input`;

let voice =   new p5.Speech();
let recognition   =   new p5.SpeechRec();
    //Tracking AI's speach state?
let isSpeaking  =   false;

/** Commands:   */
const commands  =   [
    {
        "command":  "send message",
        "callback": aiTurn
    },
    {
        "command":  "comma",
        "callback": punct_Comma
    },
    {
        "command":  "period",
        "callback": punct_Period
    },
    {
        "command":  "question mark",
        "callback": punct_QMark
    },
];

let player  =   {
    //Personal Info:
    name:   ``,
    nationality:    ``,
    currentAddress: ``,
    description:    ``,

    //Social life:
    relatives:  undefined,
    relationship:   undefined,
};

let simulacra   =   {
    anger:  0,
    language:   undefined,
    step:   0,
};


/** Listing Voices: */
function preload() {
    // voice.listVoices();
}


/** Setting up the input:   */
function setup() {
    //Creating a scene:
    createCanvas(windowHeight, windowHeight);

        //Starting with voice:
        voice.speak(currentOutput);

}


/** */
function draw() {
    //Setting the background color:
    background(0, 20, 0);



        voice.onEnd =   playerTurn;
        isSpeaking  =   true;
    
    //Text output:
    let interactions    =   currentOutput + currentInput;    

    //Displaying text:
    push();
    fill(0, 200, 0);
    textSize(32);
    textAlign(LEFT, BOTTOM);
    text(interactions, 10, windowHeight - 10);
    pop();


    speechDetect();
}

function speechDetect() {
    if (!isSpeaking)    {
        //Setting the voice Recognition:
        recognition.continuous  =   true;
        recognition.interimResults  =   true;
        recognition.onResult    =   handleSpeechInput;
    
        //Starting the voice Recognition:
        recognition.start();
    }

    if (!isSpeaking)    {
        voice.speak()
        isSpeaking  =   true;
    }   else {
        recognition.stop();
    }
}

function playerTurn()   {
    console.log(`Output Completed\nAwaiting Input`);

    recognition.start();
}

function aiTurn()   {
    console.log(`Speaking`);
}



/** */
function handleSpeechInput()    {
    if (recognition.resultValue)   {
        currentInput    =   `\n> ` + recognition.resultString.toLowerCase();
    } else  {
        return;
    }

    //Setting up the commands:
    for (let command of commands)   {
        if (recognition.resultString.toLowerCase() === command.command) {
            command.callback();
            break;
        }
    }

    //Debugging:

    let words   =   recognition.resultString.split(` `);

    console.log(recognition.resultString);
    //Setting the recognition input to Lowercase:
    let lowerCaseResult =   recognition.resultString.toLowerCase();
    //steps();
}


/** Adding punctuation: */
function punct_Comma()  {
    //let comma   =   recognition.resultString.split(` `);
    console.log(`,`, comma);
}
function punct_Period() {
    console.log(`.`);
}
function punct_QMark()  {
    console.log(`?`);
}


/** Debugging:  */
function mousePressed() {
    console.log(simulacra, + player);
}