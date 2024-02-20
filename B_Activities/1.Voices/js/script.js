/**
 * Voice Jam
 * Emile Jolicoeur
 * 
 * You are sending morse code to ____
 */

"use strict";

/** List of languages:  */
const   lang    =   [
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

    // `sv-SE`,
    // `ru-RU`,
    // `fr-FR`,
    // `en-US`,
    // `ja-JP`,
    // `es-ES`,
];

const   commands    =   [
    // {
    //     "command":  /understand (.*)/,
    //     "callback": inputLanguage
    // },
    {
        "command":  /speak (.*)/,
        "callback": outputLanguage
    },
];






let input   =   ``;
let output  =   ``;
let interactionNb   =   0;


let recognition =   new p5.SpeechRec();
let voice   =   new p5.Speech();


/** */
function preload()  {
    //voice.listVoices();
}


/** */
function setup() {
    createCanvas(windowHeight, windowHeight);
    

    recognition.onResult    =   handleResult;
    recognition.start();

}


/** */
function draw() {
    background(0, 0, 0);

}


function handleResult() {
    console.log(recognition.resultString);
}

/** The language it understands:    */
// function inputLanguage(language)    {

// }

/** The language it speaks: */
function outputLanguage(language)   {
    if (language[1] === `english`)    {

        let r   =   random(round(1,2));
        if (r === 1)    {
            output   =   `Google UK English Male`;
        }   else {
            output   =   `Microsoft David - English (United States)`;
        }
    }   else if (language[1] === `russian`)    {
        output   =   `Microsoft Pavel - Russian (Russia)`;
    }

    console.log(output);
}

function mousePressed() {

    // if (interactionNb >= 5) {
        //Selecting a random language:
        let currentLanguage =   random(lang);
        //Voice Settings:
        voice.setRate(1);
        voice.setPitch(1);
        //Setting the language selected:
        voice.setVoice(currentLanguage);
        
    // }   else {
    //     voice.setLang(outputLanguage);
    // }
    interactionNb++;

    voice.speak();


    console.log(interactionNb + `:` + currentLanguage);
}

function dialogueList() {
    const   dialogue    =   [
        `[Awaiting Input]`,
        `Oh Hi! It's been a while since someone has come here... What's your name, friend?`,
        `Nice to meet you, ` + humanName + `I'm... well it's not important.`,
        `What do you do for a living?`,
        `Sounds exhausting... `,
    ];
}
