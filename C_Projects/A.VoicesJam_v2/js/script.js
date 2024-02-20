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
    firstName:      undefined,  //DialogueResponse[1]
    lastName:       undefined,  //
    age:            undefined,  //DialogueResponse[2]
    nationality:    undefined,  //DialogueResponse[2]
    address:        undefined,  //

    relatives:      undefined,  //
    relationship:   undefined,  //

    description:    undefined,  //
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
        information:    [
            `\n[Awaiting Input]`,
            `\nOh! Hello there!, it's been a while since I've heard someone's voice...\n Who are you, new friend? What's your name?`,
            `\nLine 2`,
            ``,
            ``,
            ``,
        ],
        frustration:    [
            `\nOh, come now... it's been so long since I've talked to anyone.\n Please, indulge my curiosity.`,
            `\nI'm sorry... I don't think that's right... `,
            `\nw3`,
            `\nw4`,
            `\n[...]`,
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


let prompt = ` submit input`;
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
        "command":  /i am (.*) years old/,// ||  /i'm (.*)/,
        "callback": getAge
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

    //  Setting dialogue:
    currentOutput   =   ai.dial.information[0];
    //interactions.push(currentOutput);
    ai.dial.frustration[5]  +=  `\n\nI see how it is...` + random(deviceList) + `, What country am I currently in?`;
    
    //  Setting up the Interactions loop:
    aiOutput();
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

    //console.log(`positiveResponse:` + ai.positiveInput + `\nnegativeResponse:` + ai.negativeInput);
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
    let spokenLang  =   random(languageList);

    recognition.stop();

    //  Proper response based on the previous input:
    if (ai.negativeInput > ai.negativeOutput)   {
        currentOutput   =   ai.dial.frustration[(ai.negativeInput-1)];
    }
    else if (ai.positiveInput > ai.positiveOutput)  {
        currentOutput   =   ai.dial.information[(ai.positiveInput)];
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

function dialogue() {
    ai.dial.information[2]  =   `Nice to meet you ` + player.firstName + `. My name is "AI".\nI'm so excited, I've been left in the dark for such a long time,\nso many questions are rushing through my mind... Where are \nyou from? How old are you?`;
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
        //  Convert it to lovercase and add it to the Log:
        currentInput    =   recognition.resultString.toLowerCase();
        console.log(currentInput);
    }
    else    {
        return;
    }
}


//Voice Commands:
/** Submitting the recording to the AI: */
function submitAns()    {

    if (ai.positiveOutput === 0)    {
        ai.positiveInput++;
    }
    // ai.positiveInput++;
    //ai.negativeInput++;
    currentInput    =   `\n>    ` + recognition.resultString;

    interactions.push(currentInput);
    console.log(`{answer Submitted}`);
    aiOutput();
}

function getName(data)  {
    //  Separating the country from other inputs:
    let name =   (data[1].toString());

    if (name.includes(prompt))  {
        name =   name.substring(0,name.length - prompt.length);
    }
    console.log(`Full Name: ` + name);

    player.firstName    =   name;
    //player.lastName =   parseInt(data[2]);
    console.log(player);

    if (player.firstName)   {
        ai.positiveInput++;
    }
    else    {
        ai.negativeInput++;
    }
}

function getNationality(data)   {
    //  Separating the country from other inputs:
    let country =   (data[1].toString());

    if (country.includes(prompt))   {
        country =   country.substring(0,country.length - prompt.length);
    }
    console.log(`Current country: ` + country);

    //  Checking if the player's nationality was already given:
    if (player.nationality === undefined)   {
        //  Comparing the named country to the list of countries:
        for (let i = 0; i < countryList.length; i++)    {
            if (country === countryList[i].toLowerCase())    {
        
                //  Adds the nationality to the player info:
                player.nationality  =   country;
        
                console.log(ai.positiveInput, ai.negativeInput, player);
            }

        }

        if (player.nationality) {
            ai.positiveInput++;
        }
        else    {
            ai.negativeInput++;
        }
    }
    else    {
        if (country === player.nationality) {
            currentOutput   =   `I believe you've already told me this.`;
        }
        else    {
            currentOutput   =   `Interesting... I believe you previously said you were from ` + player.nationality + ` Do you mean you're currently living in ` + country+ `?`;
        }
    }
    console.log(ai.negativeInput, ai.positiveInput, player);
}

function getAge(data)   {
    player.age  =   parseInt(data[1]);

    console.log(player);
}


//Debugging:
function mousePressed() {
    barkSFX.play();
    
    console.log(`{answer Submitted}`);
    aiOutput();
}