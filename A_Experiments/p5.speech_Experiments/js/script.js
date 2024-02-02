/**
SoundExperiments
Emile Jolicoeur


https://youtube.com/playlist?list=PLlhzHWGvpvd3L-amtZXzZEkgWKdUWRzuB&si=jQGx6vfd45VwaCyA
*/

"use strict";


/** Video 2: */
// // let voice   =   new p5.Speech();
// let recognizer  =   new p5.SpeechRec();

// // function preload() {
// //     voice.listVoices();
// // }


// function setup() {

//     recognizer.onResult =   handleResult;
//     //Starts recording for voice:
//     recognizer.start();
// }


// function draw() {

// }

// function handleResult() {
//     console.log(recognizer.resultString);
// }

// // function mousePressed() {
// //     voice.speak(`Hello`);
// // }


/** Notes:  setLang(\InsertLanguageHere\)*/

/** Video 3:    Output  */

// const speechSynthesizer =   new p5.Speech();

// let sentence    =   `Test 2... Hello`;
// let subtitles   =   false;


// function preload()  {

// }

// function setup()    {
//     createCanvas(500, 500);

//     //SpeechSettings
//     speechSynthesizer.setPitch(0.2);
//     speechSynthesizer.setRate(0.85);
//     speechSynthesizer.setVoice(`Microsoft Pavel - Russian (Russia)`);

//     // speechSynthesizer.setPitch(0.2);
//     // speechSynthesizer.setRate(0.5);
//     // speechSynthesizer.setVoice(`Google UK English Male`);

//     //Voices:   Zuzanna / Alice / Google US Male

//     speechSynthesizer.onStart   =   startOfSpeech;
//     speechSynthesizer.onEnd =   endOfSpeech;

//     // //Alt way to write it (no need to specify functions later):
//     // speechSynthesizer.onStart   =   () =>   {
//     //     subtitles   =   true;
//     // };
//     // speechSynthesizer.onEnd =   () =>   {
//     //     subtitles   =   false;
//     // };

//     console.log(speechSynthesizer.listVoices());
// }

// function draw() {
//     background(0, 0, 0);

//     if (subtitles)  {
//         fill(0, 255, 0);
//         textSize(32);
//         text(sentence, 100, 100);
//     }
// }

// function mousePressed() {
//     //Speech
//     speechSynthesizer.speak(sentence);
//     console.log(sentence);
// }

// function startOfSpeech()    {
//     subtitles   =   true;
// }

// function endOfSpeech()  {
//     subtitles   =   false;
// }


/** Video 4:    Inputs  */

const speechRecognizer  =   new p5.SpeechRec()  //Can specify what language to detect/use by default in () through BCP 47;
let currentSpeech   =   `Awaiting Input`;
//Background Display:
let lights  =   false;
//Default Background color:
let backgroundColor =   `white`;


function setup()    {
    createCanvas(500, 500);


    speechRecognizer.onResult   =   handleSpeechInput;
    //Speech Recognition Settings:
    speechRecognizer.continuous =   true;
    speechRecognizer.interimResults =   true;
    //Starting the Speech Recognition:
    speechRecognizer.start();
}

function draw() {
    background(0, 0, 0);

    //Displaying the Background based on if the `lights` are on/off:
    if (lights) {
        background(backgroundColor);
    }

    //Displaying what the speech recognition detects:
    fill(0, 255, 0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(currentSpeech, width/2, height/2);
}

function handleSpeechInput()    {
    //Debugging:
    console.log(speechRecognizer.resultString);

    //Splitting the sentence into individual words:
    let words   =   speechRecognizer.resultString.split(` `);
    //Displaying the right color based on mentioned word (if word is not a color, turns to white by default):
    backgroundColor =   words.pop();

    //Assigning an input depending on specific word/sentence:
    if (speechRecognizer.resultString.toLowerCase === `Fuck`)   {
        currentSpeech   =   `Language!`;
    }   else if (speechRecognizer.resultString.toLowerCase === `Turn on the lights`)    {
        lights  =   true;
    }
    //Applying the Recognized speech into a variable:
    currentSpeech   =   speechRecognizer.resultString;
}