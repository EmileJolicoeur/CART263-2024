/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict"

let voice   =   new p5.Speech();
let recognition =   new p5.SpeechRec();
let voiceOn =   true;

let voiceLoop   =   0;


let currentOutput   =   `Hello`;

const commands  =   [
    {
        "command":  "send message",
        "callback": switchToAI
    },
];


/** */
function setup()    {
    //  Setting up the page's canvas:
    createCanvas(windowHeight, windowHeight);

    //Setting the voice Recognition:
    recognition.continuous  =   true;
    recognition.interimResults  =   true;
    recognition.onResult    =   recSpeechInput;

    talkingStick();
}


/** On every frame...:  */
function draw() {
    //BG settings:
    background(0, 20, 0);
    
    // talkingStick();
}


/** Determines Who's turn it is to speak:   [AI or Player]*/
function talkingStick() {
    if (voiceOn = true)    {
        aiOutput();
    }
    else if (voiceOn = false)    {
        playerInput();
    }
}

function aiOutput() {
    if (!voiceLoop > 0)  {
        voice.speak(currentOutput);
        voice.onEnd =   stickValues();
        voiceLoop++;
    } else {
        voice.stop();
        
        console.log(`Talking...\n` + voiceOn, voice);
    }

    
}

function stickValues()  {
    //Switching between on & off:
    if (voiceOn)    {
        voiceOn =   false;
        talkingStick();
    }
    else    {
        voiceOn =   true;
        talkingStick();
    }
}

function playerInput()  {    
    recognition.start();
    
    recognition.onEnd   =   stickValues();

    console.log(`Listening...`);
}

/** "send message:  "*/
function switchToAI()   {
    recognition.stop();
}

function recSpeechInput() {
      //  Setting up the commands:
  for (let command of commands)   {
    if (recognition.resultString.toLowerCase() === command.command) {
      command.callback();
      break;
    }
  }

  //  Setting up "currentInput":
    if (recognition.resultValue)   {
    currentInput    =   `\n> ` + recognition.resultString.toLowerCase();
    console.log(currentInput);
  } else  {
    return;
  }
}




    
