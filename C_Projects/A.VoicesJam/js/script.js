/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict"

const languageList  =   [
  `Microsoft David - English (United States)`,
  `Microsoft David - English (United States)`,
  `Microsoft Richard - English (Canada)`,
  `Microsoft Linda - English (Canada)`,
  `Microsoft Mark - English (United States)`,
  `Microsoft Zira - English (United States)`,
  `Microsoft Caroline - French (Canada)`,
  `Microsoft Claude - French (Canada)`,
  `Microsoft Nathalie - French (Canada)`,
  `Microsoft Irina - Russian (Russia)`,
  `Microsoft Pavel - Russian (Russia)`,
  `Google Deutsch`,
  `Google US English`,
  `Google UK English Female`,
  `Google UK English Male`,
  `Google español`,
  `Google español de Estados Unidos`,
  `Google français`,
  `Google हिन्दी`,
  `Google Bahasa Indonesia`,
  `Google italiano`,
  `Google 日本語`,
  `Google 한국의`,
  `Google Nederlands`,
  `Google polski`,
  `Google português do Brasil`,
  `Google русский`,
  `Google 普通话（中国大陆）`,
  `Google 粤語（香港）`,
  `Google 國語（臺灣）`,
];

let currentInput  = ``;
let currentOutput = `[awaiting input]`;


let voice = new p5.Speech();
let recognition = new p5.SpeechRec();
let isSpeaking  = true;
let voiceLoop  = 0;


/** Commands:   */
const commands  =   [
  {
    "command":  "testing command",
    "callback": submitAns
  },

  // //Punctuation
  // {
  //   "command":  "period"  ||  "dot",
  //   "callback": punct_dot()
  // },
  // {
  //   "command":  "question mark",
  //   "callback": punct_QMark()
  // },
  // {
  //   "command":  "comma",
  //   "callback": punct_Comma()
  // },
];

/** */
function preload()  {
  //voice.listVoices();
}

/** */
function setup()    {
  //  Creating the physical area:
  createCanvas(windowHeight, windowHeight);

  //  Starting the speech interaction programs:
  talkingStick();
}

/** */
function draw() {
  background(0, 0, 0);

  let interactions    =   currentOutput + currentInput;    

  //  Displaying text:
  push();
  fill(0, 200, 0);
  textSize(32);
  textAlign(LEFT, BOTTOM);
  text(interactions, 10, windowHeight - 10);
  pop();
}


/** Determines who gets to speak: */
function talkingStick() {
  console.log(`T-Stick`);
  if (isSpeaking) {
    
    //recognition.stop();
    //  AI is speaking:
    voiceSettings();

    aiTurn();
  }
  else if (!isSpeaking)  {
    //  Setting the voice Recognition:
    recognition.continuous  =   true;
    recognition.interimResults  =   false;
    recognition.onResult    =   handleSpeechInput;
    recognition.start();
    playerTurn();
  }

}


/** Switching between the two subjects: */
function passingTheStick()  {
  console.log(`passT-Stick`);
  if (!isSpeaking)  {
    isSpeaking  = true;
  } else  {
    isSpeaking  = false;
  }
  talkingStick();
}


/** Turn of the Player: */
function playerTurn() {
  console.log(`pTurn`);
  recognition.onStart = console.log(`Listening:`);
  recognition.onEnd = voice.stop(), passingTheStick();
}


/** AI Output:  */
//  Voice settings:
function voiceSettings()  {
  voice.onStart = console.log(`Talking`);
  //  Randomizing voice values:
  voice.setRate(0.55);
  voice.setPitch(0.5);
  voice.setVoice(random(languageList));
  voice.setLang(random(languageList));    //See wtf that is
}

//  Turn of the AI:
function aiTurn() {
  console.log(`aiTurn`);
  //  Setting voice:
  voice.speak(currentOutput);
  voice.onEnd = passingTheStick();

  //console.log(isSpeaking, currentOutput);
}


/** Setting up the voice commands:  */
function handleSpeechInput()  {
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



/** Commands: */
//  Ending voice commands:
function submitAns()  {
  recognition.stop();
}