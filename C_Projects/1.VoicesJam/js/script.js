/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict"
//  SFX:
let barkSFX =   undefined;

//  Input values:
const recognition   =   new p5.SpeechRec();
let currentInput    =   ``;

//  Output values:
const voice =   new p5.Speech();
let currentOutput   =   ``;

//  Display:
    //  Blinking values:
let blinkIntensity  =   100;
let blink   =   setInterval(inputLine, 500);
    //  Chat Log:
let interactions    =   [];


//  User information gathered from the AI:
let user    =   {
    name:           undefined,  //DialogueResponse[1]
    age:            undefined,  //DialogueResponse[2]
    nationality:    undefined,  //DialogueResponse[3]
    address:        undefined,  //DialogueResponse[5]

    relationship:   undefined,  //DialogueResponse[4]
};

//  User voice triggers:
const commands  =   [
    //  Commands from which the ai gathers information:
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
        "command":  /i'm (.*) years old/,
        "callback": getAge
    },
    {
        "command":  /my name is (.*)/,
        "callback": getName
    },
    {
        "command":  /i am (.*)/,
        "callback": getName
    },
    {
        "command":  /(.*) i am/,
        "callback": getSocialStatus
    },
    {
        "command":  /(.*) i am not/,
        "callback": getSocialStatus
    },
    {
        "command":  /i currently live at (.*)/,
        "callback": getResidency
    },
    {
        "command":  /your current location is (.*)/,
        "callback": getResidency
    },
];
//  Commands List:
const submitComm    =   [
    {
        "command":  /(.*) submit input/,
        "callback": submitAns
    }
];

//  JSON files:
let countryData =   undefined;
let devicesData =   undefined;
let langData    =   undefined;
let relationsData   =   undefined;
    //  AI's parameters:
let ai  =   undefined;

//  Smart home device selected:
let selectedDevice  =   undefined;
//  AI name selection:
let selectedName    =   undefined;
let selectedFamily  =   undefined;
//  Question from AI's previous dialogue:
let previousQuestion    =   `Nan`;


//______________________________________________________//


/** Loading presets:    */
function preload()  {
    //  Loading Data:
    countryData =   loadJSON(`assets/data/countries_list.json`);
    devicesData =   loadJSON(`assets/data/devices_list.json`);
    langData  =   loadJSON(`assets/data/languages_list.json`);
    relationsData  =   loadJSON(`assets/data/family_list.json`);

    //  Loading AI Data:
    ai  =   loadJSON(`assets/data/ai_data.json`);

    console.log(`{Data_Loaded}`);
}
/** Called Once:    */
function setup()    {
    //  Creating the canvas:
    createCanvas(windowHeight, windowHeight);

    //  Selecting the smart home device to 
    selectedDevice  =   random(devicesData.list);
    selectedName    =   random(ai.data.name);
    selectedFamily  =   random(relationsData.relatives);

    //  Setting up the Interactions loop:
    aiOutput();

    console.log(
        `Setup: Completed`,
        `\n  > SmartDevice:     ` + selectedDevice,
        `\n  > AI_Name:         ` + selectedName,
        `\n  > Fam.Member:      ` + selectedFamily
    );
}
/** Called Every Frame: */
function draw() {
    background(0, 20, 0);

    //  Text displayed on the screen:
    backlog();
    inputLine();
}

/** Displaying Text:    */
    /** Displaying the backlog: */
function backlog()  {
    push();
    fill(0, 200, 0);
    textSize(26);
    textAlign(LEFT, BOTTOM);
    textWrap(WORD);
    text(interactions, 10, windowHeight - 50,  windowHeight);
    pop();
}
    /** Displaying the input line:  */
function inputLine()    {
    blinkIntensity  =   blinkIntensity* -1;

    //  Displaying the input line:
    push();
    fill(0, blinkIntensity, 0);
    textSize(32);
    textWrap(WORD);
    textAlign(LEFT, BOTTOM);
    text(`  > ` + currentInput + `_`, 7, windowHeight - 10, windowWidth - 14);
    pop();
}


//  -   -   -   -   -   -   -   -   -   -   -   -   -   //


/** AI: */
function aiOutput() {
    recognition.stop();
    //  Random language:
    // let selectedLanguage    =   random(langData.list);

    //  Selecting comment:
    let currentComment  =   cSelect(previousQuestion, ai.data.posInput-1);
    // console.log(`Current Q: `, newQuestion, `Previous Q:`, previousQuestion, `\nInt: `, currentComment);

    let positive    =   ai.data.posInput > ai.data.posOutput;
    let negative    =   ai.data.negInput > ai.data.negOutput;

    //  Starting text: 
    if (ai.data.posInput === 0 && ai.data.negInput === 0)   {
        currentOutput   =   ai.data.lines[0].start;
    }
    //  Anger voice lines:
    else if (negative)  {
        //  Answering wrong:
        if (ai.data.negInput < ai.data.lines[0].anger.length)   {
            //  Assembling the voice line:
            currentOutput   =   `\n` + ai.data.lines[0].anger[(ai.data.negInput - 1)] + `\n` + previousQuestion;
        }
        //  Pissed off the AI:
        else    {
            goodEnd();
        }
    }
    //  Curious voice lines:
    else if (positive)  {
        //  Satisfied the AI:
        if (ai.data.posInput === ai.data.lines[0].comment.length)   {
            badEnd();
        }
        //  AI gathering info:
        else    {
            //  Selecting question:
            let newQuestion =   qSelect(ai.data.posInput);
            //  Assembling the voice line:
            currentOutput   =   `\n` + currentComment + `\n` + newQuestion;
            //  Setting the previous question:
            previousQuestion    =   newQuestion;
        }
    }
    else if (positive && negative)  {

    }

    //  Voice settings:
    voice.setVoice();
    voice.onEnd =   userInput;
    voice.speak(currentOutput);

    //  Transfers the inputs to the next loop's output:
    ai.data.posOutput   =   ai.data.posInput;
    ai.data.negOutput   =   ai.data.negInput;

    //  Displaying interactions:
    interactions.push(currentOutput);

    //  Displays in log the audio output:
    // console.log(selectedLanguage);
}
/** Selecting Question: */
let choices =   [1, 2, 3];
let usedQ   =   [`[_]`, `[_]`, `[_]`, `[_]`, `[_]`, `[_]`];

function qSelect(userData)  {
    let q   =   undefined;
    let sequence    =   userData - 1;

    if (userData > 1 && userData <= 4)  {
        //  Randomizing the order of questions:
        sequence    =   random(choices);
        q   =   ai.data.lines[0].question[sequence];

        while ((sequence > 0 && sequence < 4) && usedQ[sequence] === `[X]`) {
            sequence    =   random(choices);
            q   =   ai.data.lines[0].question[sequence];
        }
        usedQ[sequence] =   `[X]`;
    }
    else    {
        if (userData === 1) {
            q   =   ai.data.lines[0].question[sequence];
            usedQ[sequence]    =    `[X]`;
        }
        else if (userData > 4)  {
            q   =   ai.data.lines[0].question[sequence];
            usedQ[sequence]    =   `[X]`;
        }
        else    {
            q   =   `Error`;
        }
    }
    console.log(usedQ, q, `[` + sequence + `]`);

    return q;
}
/** Selecting comment:  */
function cSelect(query, queryPos)   {
    //  Previous Question + it's position in ai.data.lines[0].comment:
    console.log(query, queryPos);
    let selection   =   ai.data.lines[0].comment[queryPos];
    //  Final value:
    let c   =   linesEdit(selection, `{1},`, `{2}.`, `{3}`)
    return c;
}

function linesEdit(string, name, label, family) {
    console.log(string);
    //  Creates an array out of all the words in the comment:
    if (string) {
        let word    =   string.split(` `);

        console.log(
            `\nPlaceholders: `+ name, label, family,
            `\nValues: `, user.name, selectedName, selectedFamily,
            word
        );

        //  For every word in the "word" array:
        for (let i = 0; i < word.length; i++)   {
            //  Switching the placeholder1 for the user's name:
            if (word[i] === name)   {
                word[i] =   user.name + `,`;
            }
            //  Switching the placeholder2 for the AI's name:
            if (word[i] === label)  {
                word[i] =   `"` + selectedName + `".`;
            }
            if (word[i] === family) {
                word[i] =   selectedFamily;
            }
        }
        //  Assembling the "word" array into 1 string:
        let result  =   word.join(` `);
        console.log(result);

        return result;
    }
}


//  -   -   -   -   -   -   -   -   -   -   -   -   -   //


/** Speech Recognition: */
function userInput()    {
    //  Setting the voice Recognition
    recognition.continuous  =   true;
    recognition.interimResults  =   true;
    recognition.onResult    =   handleSpeechInput;

    recognition.start();

    console.log(`User:`, currentInput);
}

/** Processing the User's speech:   */
function handleSpeechInput()    {

    callingCommands(submitComm, recognition.resultString.toLowerCase());
}

/** */
function callingCommands(input, sentence)   {
    let lowercase   =   sentence;
    //  Assigning the following program for all from the list of commands:
    for (let command of input)  {
        command.command
        //  If a command is spoken from the list of commands:
        if (lowercase === command.command)  {
            command.callback();
            // break;
        }

        //  If the user input matches with any command:
        let match   =   lowercase.match(command.command);
        if (match && match.length > 1)  {
            // console.log(match);

            command.callback(match);
        }
    }

    //  If the mic gets an input:
    if (recognition.resultValue)    {
        //  Convert it to lowercase and add it to the Log:
        currentInput    =   recognition.resultString.toLowerCase();
        // console.log(currentInput);
    }
    else    {
        return;
    }
}

/** Submitting Vocal Input: */
function submitAns(data)    {
    let reply   =   data[1];
    console.log(`User Input: ` + reply);

    //  Analyzing sentence for other data:
    callingCommands(commands, data[1]);

    //  First answer (Making contact):
    if (ai.data.posOutput === 0)    {
        ai.data.posInput++;
        usedQ[0] =   `[X]`;
    }

    //  After 1st interaction:
    if (ai.data.posInput === ai.data.posOutput) {
        ai.data.negInput++;;
    }

    //  Text to display on the input line:
    currentInput    =   `\n>    ` + reply;
    interactions.push(currentInput);

    //  Debugging:  Log current progress:
    console.log(
        `Positive: `, ai.data.posInput, ai.data.posOutput,
        `\nNegative: `, ai.data.negInput, ai.data.negOutput,
        // `\nQ_Remaining: ` + ai.data.lines[0].question,
        `\nInfo gathered: `, user
    );

    //  Starting the output program:
    aiOutput();
}


//  -   -   -   -   -   -   -   -   -   -   -   -   -   //


/** Collecting User's personal Data:    */
    /** Name:   */
function getName(data)  {


    let name    =   grammar_Capital(data[1]).join(` `);


    //  Checking if the user Name was previously given:
    if (user.name === undefined)    {
        //  Adding the user's name:
        user.name   =   name;
        //  Adding to the positive count:
        ai.data.posInput++;
        
    }
}
    /** Nationality:    */  
function getNationality(data)   {
    console.log(data[1]);

    //  Separating the country from other inputs:
    let country =   data[1];

    //  Checking if the user's Nationality was already given:
    if (user.nationality === undefined) {
        for (let i = 0; i < countryData.list.length; i++)   {
            if (data[1] === countryData.list[i].toLowerCase())  {
                let country =   grammar_Capital(data[1]).join(` `);
                //  Adds the nationality to the user info:
                user.nationality    =   country;
            }
        }
        //  Adding to the positive count:
        ai.data.posInput++;
        
    }
}
    /** Age:    */
function getAge(data)   {
    console.log(data[1]);

    //  Adding the user's age:
    let age =   data[1];
    //  Checking if the user's Age was previously given:
    if (user.age === undefined) {
        // user.age  =   parseInt(data[1]);
        user.age    =   age;
        //  Adding to the positive count:
        ai.data.posInput++;
        
    }
}
    /** Relationship:   */
function getSocialStatus(data)  {
    console.log(data[1]);

    if (!user.relationship) {
        if (data[1] === `yes`)  {
            user.relationship   =   `"Y"`;
        }
        if (data[1] === `no`)   {
            user.relationship   =   `"N"`;
        }
        ai.data.posInput++;
        
    }
}
    /** Current Address:    */
function getResidency(data) {
    console.log(data[1]);

    if (!user.address)  {
        user.address    =   data[1];
        ai.data.posInput++;
        
    }
}



function grammar_Capital(toCap, )  {
    let beenCap =   [];
    //  Splitting first/last names:
    let words   =   toCap.split(` `);
    for (let i = 0; i < words.length; i++)  {
        let letters =   words[i].split(``);
        let capitalLetter   =   letters[0];

        letters[0]  =   capitalLetter.toUpperCase();
        let capitalWords    =   letters.join(``);

        beenCap.push(capitalWords);
    }
    console.log(beenCap);

    return beenCap;
}
//  -   -   -   -   -   -   -   -   -   -   -   -   -   //


/** Endings:    */
function badEnd()   {
    console.log(`You lose!`);
}
function goodEnd()  {
    console.log(`You Win!`);
}


//  -   -   -   -   -   -   -   -   -   -   -   -   -   //


/** Debugging:  */
function keyPressed()   {
    //  null response:  [spacebar]
    if (event.keyCode === 32)   {
        console.log(`input received: _`);
    }
    //  positive response:  [+ key]
    else if (event.keyCode === 187)  {
        ai.data.posInput++;
        console.log(`input received: +`);
    }
    //  negative response:  [- key]
    else if (event.keyCode === 189)  {
        ai.data.negInput++;
        console.log(`input received: -`);
    }

    aiOutput();
}