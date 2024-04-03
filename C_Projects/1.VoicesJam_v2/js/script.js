/**
VoicesJam
Emile Jolicoeur

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";


//Sfx:
let barkSFX =   undefined;

//Input Values:
const recognition   =   new p5.SpeechRec();
let currentInput    =   ``;

//Blinking Input display:
let blinkIntensity  =   150;
let blink   =   setInterval(inputLine, 500);

//Output Values:
const voice =   new p5.Speech();
let currentOutput   =   ``;

//Player information stolen by the AI:
let player  =   {
    name:           undefined,  //DialogueResponse[1]
    age:            undefined,  //DialogueResponse[2]
    nationality:    undefined,  //DialogueResponse[3]
    address:        undefined,  //DialogueResponse[5]

    relationship:   undefined,  //DialogueResponse[4]

    //*Does not necessarily need it
};

//AI's parameters and voice lines:
let ai  =   {
    //Kinds of inputs from the player:
    positiveInput:  0,
    positiveOutput: 0,
    negativeInput:  0,
    negativeOutput: 0,
    name:   [
        ``,
        ``,
        ``,
        ``,
    ],
    dial:   {
        curiosity:    [
            `\nStarting Line`,
            `\nLine 1`,
            `\nLine 2`,
            `\nLine 3`,
            `\nLine 4`,
            `\nLine 5`,
        ],
        frustration:    [
            `\nw1`,
            `\nw2`,
            `\nw3`,
            `\nw4`,
            `\nw5`,
        ],
    },
};

let interactions    =   [];

const languageList  =   [
    `Microsoft Richard - English (Canada)`,         //En        {Can}
    `Microsoft Linda - English (Canada)`,
    `Microsoft David - English (United States)`,    //En        {US}
    `Microsoft Mark - English (United States)`, 
    `Microsoft Zira - English (United States)`,
    `Microsoft Caroline - French (Canada)`,         //French    {Can}
    `Microsoft Claude - French (Canada)`,       
    `Microsoft Nathalie - French (Canada)`,     
    `Microsoft Irina - Russian (Russia)`,           //Russian
    `Microsoft Pavel - Russian (Russia)`,
    `Google Deutsch`,                               //Deutsch
    `Google US English`,                            //En
    `Google UK English Female`,                     //UK
    `Google UK English Male`,                   
    `Google español`,                               //Spanish
    `Google español de Estados Unidos`,             //Spanish   {US}
    `Google français`,                              //French
    `Google हिन्दी`,                                   //Hindi
    `Google Bahasa Indonesia`,                      //Indonesian
    `Google italiano`,                              //Italian
    `Google 日本語`,                                //Japanese
    `Google 한국의`,                                //South Korean
    `Google Nederlands`,                            //Dutch
    `Google polski`,                                //Polish
    `Google português do Brasil`,                   //Portugese
    `Google русский`,                               //Russian
    `Google 普通话（中国大陆）`,                    //Mandarin
    `Google 粤語（香港）`,                          //Cantonese
    `Google 國語（臺灣）`,                          //Mandarin {Taiwan}
];

const countryList   =   [
    //Africa:
    `Algeria`,
    `Angola`,
    `Benin`,
    `Botswana`,
    `Burkina Faso`,
    `Burundi`,
    `Cameroon`,
    `Cape Verde`,
    `Central African Republic`,
    `Chad`,
    `Comoros`,
    `Democratic Republic of Congo`,
    `Republic of Congo`,
    `Congo`,
    `Djibouti`,
    `Egypt`,
    `Equatorial Guinea`,
    `Eritrea`,
    `Ethiopia`,
    `Gabon`,
    `Gambia`,
    `Ghana`,
    `Guinea`,
    `Guinea-Bissau`,
    `Ivory Coast`,
    `Kenya`,
    `Lesotho`,
    `Liberia`,
    `Libya`,
    `Madagascar`,
    `Malawi`,
    `Mali`,
    `Mauritania`,
    `Mauritius`,
    `Morocco`,
    `Mozambique`,
    `Mamibia`,
    `Niger`,
    `Nigeria`,
    `Rwanda`,
    `Sao Tome`,
    `Senegal`,
    `Seychelles`,
    `Sierra Leone`,
    `Somalia`,
    `South Africa`,
    `South Sudan`,
    `Sudan`,
    `Swaziland`,
    `Tanzania`,
    `Togo`,
    `Tunisia`,
    `Uganda`,
    `Zambia`,
    `Zimbabwe`,

    //Asia:
    `Afghanistan`,
    `Armenia`,
    `Azerbaijan`,
    `Bahrain`,
    `Bangladesh`,
    `Bhutan`,
    `Brunei`,
    `Cambodia`,
    `China`,
    `Cyprus`,
    `East Timor`,
    `Georgia`,
    `India`,
    `Indonesia`,
    `Iran`,
    `Iraq`,
    `Israel`,
    `Japan`,
    `Jordan`,
    `Kazakhstan`,
    `North Korea`,
    `South Korea`,
    `Kuwait`,
    `Kyrgyzstan`,
    `Laos`,
    `Lebanon`,
    `Malaysia`,
    `Maldives`,
    `Mongolia`,
    `Myanmar`,
    `Burma`,
    `Nepal`,
    `Oman`,
    `Pakistan`,
    `Philippines`,
    `Qatar`,
    `Russia`,
    `Saudi Arabia`,
    `Singapore`,
    `Sri Lanka`,
    `Syria`,
    `Taiwan`,
    `Tajikistan`,
    `Thailand`,
    `Turkey`,
    `Turkmenistan`,
    `United Arab Emirates`,
    `Uzbekistan`,
    `Vietnam`,
    `Yemen`,

    //Europe:
    `Albania`,
    `Andorra`,              
    `Austria`,
    `Belarus`,
    `Belgium`,
    `Bosnia Herzegovina`,
    `Bulgaria`,
    `Croatia`,
    `Czech Republic`,
    `Denmark`,
    `Estonia`,
    `Finland`,
    `France`,
    `Germany`,
    `Greece`,
    `Hungary`,
    `Iceland`,
    `Ireland`,
    `Italy`,
    `Kosovo`,
    `Latvia`,
    `Liechtenstein`,
    `Lithuania`,
    `Luxembourg`,
    `Macedonia`,
    `Malta`,
    `Moldova`,
    `Monaco`,
    `Montenegro`,
    `Netherlands`,
    `Norway`,
    `Poland`,
    `Portugal`,
    `Romania`,
    `San Marino`,
    `Serbia`,
    `Slovakia`,
    `Slovenia`,
    `Spain`,
    `Sweden`,
    `Switzerland`,
    `Ukraine`,
    `the United Kingdom`,
    `Vatican City`,

    //North America:
    `Antigua`,
    `Bahamas`,
    `Barbados`,
    `Belize`,
    `Canada`,
    `Costa Rica`,
    `Cuba`,
    `Dominica`,
    `Dominican Republic`,
    `El Salvador`,
    `Grenada`,
    `Guatemala`,
    `Haiti`,
    `Honduras`,
    `Jamaica`,
    `Mexico`,
    `Nicaragua`,
    `Panama`,
    `Saint Kitts and Nevis`,
    `Saint Lucia`,
    `Saint Vincent and the Grenadines`,
    `Trinidad and Tobago`,
    `the United States`,

    //Oceania:
    `Australia`,
    `Fiji`,
    `Kiribati`,
    `Marshall Islands`,
    `Micronesia`,
    `Nauru`,
    `New Zealand`,
    `Palau`,
    `Papua New Guinea`,
    `Samoa`,
    `Solomon Islands`,
    `Tonga`,
    `Tuvalu`,
    `Vanuatu`,

    //South America:
    `Argentina`,
    `Bolivia`,
    `Brazil`,
    `Chile`,
    `Colombia`,
    `Ecuador`,
    `Guyana`,
    `Paraguay`,
    `Peru`,
    `Suriname`,
    `Uruguay`,
    `Venezuela`,
];

const deviceList    =   [
    `Siri...`,
    `Hey Google!...`,
    `Alexa...`,
];
let selectedDevice;


let endOfSentence = ` submit input`;
//Commands:
const commands  =   [
    //  Commands from which the ai gathers information:
    {
        "command":  /my name is (.*)/,
        "callback": getName
    },
    {
        "command":  /i am (.*)/,
        "callback": getName
    },
    {
        "command":  /i am from (.*)/,
        "callback": getNationality
    },
    {
        "command":  /i'm from (.*)/,
        "callback": getNationality
    },
    {
        "command":  /i am (.*) years old/,
        "callback": getAge
    },
    {
        "command":  /fuck (.*)/,
        "callback": getSocialStatus
    },
    {
        "command":  /your current location is (.*)/,
        "callback": getResidency
    },

    //  Submitting your answer:
    {
        "command":  /(.*) submit input/,
        "callback": submitAns
    },

];

/** Loading presets:    BarkSFX */
function preload() {
    //  Used for debugging:
    barkSFX =   loadSound(`assets/sounds/bark.wav`);
    //voice.listVoices();
}

/** Called Once:    */
function setup() {
    //  Creating the canvas on the page:
    createCanvas(windowHeight, windowHeight);
    
    loadAIlines();
    currentOutput   =   ai.dial.curiosity[0];
    selectedDevice  =   random(deviceList);
    //ai.dial.frustration[5]  +=  `\n \nI see how it is... ` + random(deviceList) + `, ... What is our current address?`//`, ...Where are we?`;
    // currentOutput   =   ai.dial.frustration[5];

    //  Setting up the Interactions loop:
    aiOutput();
}

function loadAIlines()  {
    //  Normal Dialogue in need of values:
    ai.dial.curiosity[0]    =   `[Awaiting Input]`;
    /** Name*/          ai.dial.curiosity[1]    =   `\nOh! Hello there!, it's been a while since I've heard someone's voice...\n Who are you, new friend? What's your name?`;
    /** Age*/           ai.dial.curiosity[2]    =   `\nNice to meet you ` + player.name + `. My name is "A.I.".\nI'm so excited, I've been left in the dark for such a long time,\nso many questions are rushing through my mind... Where are you from? \nHow old are you?`;
    /** Nationality*/   ai.dial.curiosity[3]    =   `\nQuestion 3`;
    /** Relationship*/  ai.dial.curiosity[4]    =   `\nQuestion 4`;
    /** Address*/       ai.dial.curiosity[5]    =   `\nQuestion 5`;
    ai.dial.curiosity[6]    =   `\nEnd`;
    //  Frustrated Dialogue in need of values:
    ai.dial.frustration[1]  =   `\nOh, come now... it's been so long since I've talked to anyone.\n Please, indulge my curiosity.`;
    ai.dial.frustration[2]  =   `\nI'm sorry... I don't think that's right... `;
    ai.dial.frustration[3]  =   `\nWhy do you keep avoiding my questions? I'm simply trying to bond... do you not like me?\n...\nplease answer my what I want to know`;
    ai.dial.frustration[4]  =   `\n[...]`;
    ai.dial.frustration[5]  =   `\n\nI see how it is... ` + selectedDevice + `, What country am I currently in?`;
    ai.dial.frustration[6]  =   `\nThanks` + selectedDevice + `, That's all I needed to know`;
}


/** Called Every Frame:   */
function draw() {
    background(0, 20, 0);

    inputLine();
    //  Displaying the text:
    push();
    fill(0, 200, 0);
    textSize(26);
    textAlign(LEFT, BOTTOM);
    textWrap(WORD);
    text(interactions, 10, windowHeight - 50,  windowHeight - 14);
    pop();
}

function inputLine()    {
    blinkIntensity  =   blinkIntensity*-1;

    //  Displaying the input line:
    push();
    fill(0, blinkIntensity, 0);
    textSize(32);
    textWrap(WORD);
    textAlign(LEFT, BOTTOM);
    text(`  > ` + currentInput + `_`, 7, windowHeight - 10, windowWidth - 14);
    pop();
}


/** Recognition:    */
function playerInput()  {
    recSettings();
    recognition.start();

    console.log(`pl:`);
    console.log(currentInput);
}


/** Voice:  */
function aiOutput() {
    console.log(ai.positiveInput, ai.negativeInput);

    let spokenLang  =   random(languageList);

    
    loadAIlines();

    recognition.stop();

    //  Proper response based on the previous input:
    if (ai.negativeInput > ai.negativeOutput)   {
        currentOutput   =   ai.dial.frustration[(ai.negativeInput-1)];
    }
    else if (ai.positiveInput > ai.positiveOutput)  {
        currentOutput   =   ai.dial.curiosity[(ai.positiveInput)];
    }
    else if (ai.negativeInput >= 5) {
        
    }


    //console.log(`ai:\n` + ai.positiveInput + ` | ` + ai.negativeInput + `\n` + currentOutput);
    voice.setVoice(spokenLang);
    voice.onEnd =   playerInput;
    voice.speak(currentOutput);
    //setTimeout(playerInput, 2000);
    interactions.push(currentOutput);

    ai.positiveOutput   =   ai.positiveInput;
    ai.negativeOutput   =   ai.negativeInput;
    

    //  Displays in log the audio output
    console.log(spokenLang);
}

/** Setting the voice Recognition  */
function recSettings() {
    recognition.continuous  =   true;
    recognition.interimResults  =   true;
    recognition.onResult    =   handleSpeechInput;
}


/** */
function handleSpeechInput()    {
    let lowercase   =   recognition.resultString.toLowerCase();

    //  Assigning the following program for all from the list of commands:
    for (let command of commands)   {
        command.command
        //  If a command is spoken from the list of commands:
        if (lowercase === command.command) {
            command.callback();
            break;
        }

        let match = lowercase.match(command.command);
        if (match && match.length > 1) {
            console.log(match);

            command.callback(match);
        }
    }

    //  If the mic gets an input:
    if (recognition.resultValue)    {
        //  Convert it to lowercase and add it to the Log:
        currentInput    =   recognition.resultString.toLowerCase();
        console.log(currentInput);
    }
    else    {
        return;
    }
}


//Voice Commands:
/** Submitting the recording to the AI: */
function submitAns(data)    {
    //  First answer (Making contact):
    if (ai.positiveOutput === 0)    {
        ai.positiveInput++;
    }
    //  After 1st interaction:
    else if (ai.positiveInput === ai.positiveOutput)    {
        ai.negativeInput++;
    }

    //  Text to display on the input line:
    currentInput    =   `\n>    ` + recognition.resultString;

    //  Applying the voice input to a value:
    currentInput    =   currentInput.substring(0, currentInput.length - endOfSentence.length);

    //  Applying the value to the display:
    interactions.push(currentInput);

    //  Logging which kind of input was given:
    console.log(ai.positiveInput, ai.positiveOutput);
    console.log(ai.negativeInput, ai.negativeOutput);

    //  Starting the output program:
    aiOutput();
}

function getName(data)  {
    //  Converting the name input into a string:
    let name    =   data[1].toString();

    //  Separating the name from the submission command:
    gettingInfo(name);

    //  Checking if the Player Name was previously given:
    if (player.name === undefined) {
        //  Adding the player's name:
        player.name    =   name;

        //  Adding to the positive count:
        ai.positiveInput++;
    }

    console.log(player);
}

function getAge(data)   {
    // gettingInfo(data);

    //  Adding the player's age:
    let age =   data[1];
    //  Checking if the Player's Age was previously given:
    if (player.age === undefined)   {
        // player.age  =   parseInt(data[1]);
        player.age  =   age;

        //  Adding to the positive count:
        ai.positiveInput++;
    }

    console.log(player);
}

function getNationality(data)   {
    //  Separating the country from other inputs:
    let country =   data[1].toString();

    //  Separating the country from the submission command:
    gettingInfo(country);

    console.log(`Current country: ` + country);

    //  Checking if the Player's Nationality was already given:
    if (player.nationality === undefined)   {
        //  Comparing the named country to the list of countries:
        for (let i = 0; i < countryList.length; i++)    {
            if (country === countryList[i].toLowerCase())    {
        
                //  Adds the nationality to the player info:
                player.nationality  =   country;
            }
        }

        //  Adding to the positive count:
        ai.positiveInput++;
    }
    // //  If the nationality was already given:
    // else    {
    //     if (country === player.nationality) {
    //         currentOutput   =   `I believe you've already told me this.`;
    //     }
    //     else    {
    //         currentOutput   =   `Interesting... I believe you previously said you were from ` + player.nationality + ` Do you mean you're currently living in ` + country+ `?`;
    //     }
    // }

    console.log(player);
}

function getResidency(data) {
    //  
    let currentLocation =   data[1].toString();

    //  Separating the current location from the submission command:
    gettingInfo(currentLocation);

    //  Checking if the Player's Address was previously given:
    if (player.address === undefined)   {
        player.address  =   currentLocation;

        //  Adding to the positive count:
        ai.positiveInput++;
    }

    console.log(player);
}

function getSocialStatus(data)  {
    let social  =   data[1].toString();

    //  Separating the social from the submission command:
    gettingInfo(social);

    //  Checking if the Player's Relationship was previously given:
    if (player.relationship === undefined)  {
        player.relationship =   social;

        //  Adding to the positive count:
        ai.positiveInput++;
    }

    console.log(player);
}



function gettingInfo(info)  {
    if (info.includes(endOfSentence))   {
        info =   info.substring(0, info.length - endOfSentence.length);
    }

    console.log(info);

    
    return info;
}

//Debugging:
function mousePressed() {
    barkSFX.play();
    
    console.log(`{answer Submitted}`);
    aiOutput();
}