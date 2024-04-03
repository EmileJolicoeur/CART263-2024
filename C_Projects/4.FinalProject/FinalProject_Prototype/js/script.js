/**
Spilled Information
by  Emile Jolicoeur

Inspiration & Help:
    Pippin Barr


*/

"use strict";


//  Sfx:
let barkSFX =   undefined;

//  Input values:
const recognition   =   new p5.SpeechRec();
let currentInput    =   ``;

//  Output values:
const voice =   new p5.Speech();
let currentOutput   =   ``;

//  Display:
    //Chat log:
let interactions    =   [];

//  User's gathered info:
let user    =   {
    firstName:          undefined,
    lastName:           undefined,
    age:                undefined,

    nationality:        undefined,
    currentAddress:     undefined,
    
    relationshipStatus: undefined,

    about:              undefined
}

//  User's voice commands:
const commands  =   [
    //  Input command:
    {
        "command":  /(.*) submit input/,
        "callback": submitAns
    },
    //  User info gathering (trigger):
        //  Name:
    {
        "command":  /my name is (.*)/,
        "callback": getName
    },
        //  Age:
    {
        "command":  /i am (.*) years old/,
        "callback": getAge
    },
        //  Nationality
    {
        "command":  /i am from (.*)/,
        "callback": getNationality
    },
        //  Relationship:
    {
        "command":  /(.*) i am/,
        "callback": getSocialStatus
    },
    {
        "command":  /(.*) i am not/,
        "callback": getSocialStatus
    },
        //  Address:
    {
        "command":  /i currently live at (.*)/,
        "callback": getResidency
    }
]

//  JSON files:
    //  Countries:
let countryData;
    //  AI's spoken language:
let langData;
    //  AI's parameters:
let ai;


//  -   -   -   -   -   -   -   -   -   -   //


/** Called before Start:    */
function preload() {
    //  Loading sfx:
    barkSFX =   loadSound(`assets/sounds/bark.wav`);
    //  Loading data:
    countryData =   loadJSON(`assets/data/countries_list.json`);
    langData    =   loadJSON(`assets/data/languages_list.json`);
    
    //  Loading AI data:
    ai  =   loadJSON(`assets/data/ai_data.json`);

    console.log(`[Files Loaded]`);
}

/** Called Once On Start:   */
function setup() {
    //  Creating the canvas:
    createCanvas(windowHeight, windowHeight);
    //  Starting the AI:
    aiOutput();

    console.log(`[Setup Complete]`);
}

/** Called Every Frame: */
function draw() {
    background(0, 20, 0);

    backlog();
    inputLine();
}


//________________[Display ]________________//


/** Show chat history:  */
function backlog()  {
    push();
    fill(0, 200, 0);
    textSize(26);
    textAlign(LEFT, BOTTOM);
    textWrap(WORD);
    text(interactions, 10, windowHeight - 50,  windowHeight);
    pop();
}

/** Showing the inputLine:  */
function inputLine()    {
    push();
    fill(0, 130, 0);
    textSize(32);
    textWrap(WORD);
    textAlign(LEFT, BOTTOM);
    text(`  > ` + currentInput + `_`, 7, windowHeight - 10, windowWidth - 14);
    pop();
}


//______________[Interactions]______________//


//  -   -   -   -   [AI]    -   -   -   -   //

/** Output: */
function aiOutput() {
    //  Stop listening to user:
    recognition.stop();

    //  Output elements:
    let q;
    // let comment;

    //  Before interactions:
    if (ai.data.posInput === 0 && ai.data.negInput === 0)   {
        currentOutput   =   ai.data.lines[0].start;

        console.log(`AI:\n\t> ` + currentOutput);
    }
    //  Start of interactions:
    else    {
        //  Angering the AI (refusing to answer his questions):
        if (ai.data.negInput > ai.data.negOutput)   {
            //  Selecting response based on lvl of anger:
            if (ai.data.negInput < ai.data.lines[0].anger.length)   {
                currentOutput   =   `\n` + ai.data.lines[0].anger[ai.data.negInput];
            }
            //  Once AI is angry:
            else    {
                goodEnd();
            }
        }
        //  Answering the AI's questions:
        else if (ai.data.posInput > ai.data.posOutput)  {
            //  Once all of user's info is gathered:
            if (ai.data.posInput === ai.data.lines[0].comment.length)  {
                badEnd();
            }
            //  Selecting Question:
            else    {
                currentOutput   =   `\n` + ai.data.lines[0].comment[ai.data.posInput] + `\n` + ai.data.lines[0].question[ai.data.posInput];
            }
        }
    }

    //  Selecting language:
    let selectedLang    =   random(langData.list);

    //  voice settings:
    voice.setVoice(selectedLang);
    voice.onEnd =   userInput;
    voice.speak(currentOutput);

    //  Applying new input values:
    ai.data.posOutput   =   ai.data.posInput;
    ai.data.negOutput   =   ai.data.negInput;

    //  Adding the AI's question to the chat history:
    interactions.push(currentOutput);
}


//  -   -   -   -  [User]   -   -   -   -   //


/** Starting the speech recognition:    */
function userInput()    {
    //  Settings for speech recognition:
    recognition.continuous  =   true;
    recognition.interimResults  =   true;
    recognition.onResult    =   handleSpeechInput;

    recognition.start();

    console.log(`User:\n\t> ` + currentInput);
}

/** Listening for commands: */
function handleSpeechInput()    {
    //  Gets the user's vocal input in string variable:
    let lowercase   =   recognition.resultString.toLowerCase();

    //  looking through the variable for triggers from commands[]:
    for (let command of commands)   {
        command.command
        //  Go to function linked to heard command:
        if (lowercase === command.command)  {
            command.callback();
            // break;
        }

        //  Logs the variable if it matches with any command:
        let match   =   lowercase.match(command.command);
        if (match && match.length > 1)  {
            console.log(match);

            command.callback(match);
        }
    }
    //  When the program gets any audio input:
    if (recognition.resultValue)    {
        currentInput    =   recognition.resultString.toLowerCase();
        console.log(currentInput);
    }
    else    {
        return;
    }
}

/** Command to switch from the user to the AI (One Way):    */
function submitAns(data)    {
    console.log(`Received Input`);
    let reply   =   data[1];
    
    //  Triggering the interactions sequence for AI:
    if (ai.data.posOutput === 0)    {
        ai.data.posInput++;
    }
    //  If you do not answer any new question (current or future):
    if (ai.data.posInput === ai.data.posOutput) {
        ai.data.negInput++;
    }

    //  Adding the user's answer to input line:
    currentInput    =   `\n\t> ` + reply;
    interactions.push(currentInput);

    console.log(`User:\n\t> ` + reply);
}


//________________[Commands]________________//


/** User's name:    */
function getName()  {

}
/** User's age: */
function getAge()   {

}
/** User's nationality: */
function getNationality()   {

}
/** User's social status:   */
function getSocialStatus()  {

}
/** User's current address: */
function getResidency() {

}


//_______________[Endings ]_________________//


/** Bad Ending: */
function badEnd()   {
    console.log(`You Lose!`);
}

/** Good ending:    */
function goodEnd()  {
    console.log(`You Win!`);
}


//__________________________________________//
//  -   -   -    [Debugging]    -   -   -   //

//_______________[Debugging]________________//


/** */
/** Debugging:  */
function keyPressed()   {
    //  Null response:      [Spacebar]
    if (event.keyCode === 32)   {
        console.log(`input received: _`);
    }
    //  Positive response:  [+ Key]
    else if (event.keyCode === 187) {
        let reply   =   undefined;
        
        if (ai.data.lines[0].start)    {
        }
        else if (ai.data.lines[0].question[0]) {
            user.name           =   "Peter Jacobs";
            reply               =   user.name;
        }
        else if (ai.data.lines[0].question[1]) {
            user.age            =   `35`;
            reply               =   user.age;
        }
        else if (ai.data.lines[0].question[2]) {
            user.nationality    =   `Canada`;
            reply               =   user.nationality;
        }
        else if (ai.data.lines[0].question[3]) {
            user.relationship   =   `"N"`;
            reply               =   user.relationship;
        }
        else if (ai.data.lines[0].question[4]) {
            user.address        =   `2364 NY-5, Utica, USA`;
            reply               =   user.address;
        }
        
        currentInput    =   `\n\t>\t` + reply;
        ai.data.posInput++;
        console.log(
            `**User:________________(Debug)**\n\t> ` + reply
        );
    }
    //  Negative response:  [-Key]
    else if (event.keyCode === 189) {
        ai.data.negInput++;
        console.log(`input received: -`);
    }

    aiOutput();
}