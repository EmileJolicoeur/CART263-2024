"use strict"

//__Variables:  ________________________________________//

const recognition   =   new p5.SpeechRec();
let currentInput    =   ``;

const voiceAI       =   new p5.Speech();
let currentOutput   =   ``;


/*  Setup elements: */
    //  States:
const STATE =   {
    //  Instructions:
    BIOS:   `BIOS`,
    //  Game:
    GAME:   `GAME`,
    //  Terminating the program:
    TERM:   `TERM`
};
let state   =   STATE.BIOS;
    //  Triggers:
let start   =   false;
let tracking    =   false;

    //  Game states:
const SUBSTATE  =   {
    ASK:    `ASK`,
    WIN:    `WIN`,
    LOSE:   `LOSE`,
    CONF:   `CONF`
};
let substate    =   SUBSTATE.ASK;

//  Obj placeholders:
let hud;
let faceAI;
let dialogueAI;

//  Dialogue array:
let interactions    =   [];
//  Face Color:
let color;

/*  JSON:   */
    //  {Setup} Data files:
let d;  //  Devices database
let r;  //  Relations database
let l;  //  Language database
let c;  //  Country database
let a;  //  AI database

const commands  =   [
    //  Commands from which the ai gathers information:
        //  Getting Name:
    {
        "command":  /my name is (.*)/,
        "callback": getName
    },
        //  Getting Nationality:
    {
        "command":  /i am from (.*)/,
        "callback": getNationality
    },
    {
        "command":  /i'm from (.*)/,
        "callback": getNationality
    },
    {
        "command":  /i was born in (.*)/,
        "callback": getNationality
    },
        //  Getting Age:
    {
        "command":  /i am (.*) years old/,
        "callback": getAge
    },
    {
        "command":  /i'm (.*) years old/,
        "callback": getAge
    },
        //  Getting Relationship Status:
    {
        //  Yes:
        "command":  /(.*) i am/,
        "callback": getSocialStatus
    },
    {
        //  No:
        "command":  /(.*) i am not/,
        "callback": getSocialStatus
    },
        //  Getting Current Address:
    {
        "command":  /i currently live at (.*)/,
        "callback": getResidency
    },
    {
        "command":  /your current location is (.*)/,
        "callback": getResidency
    },
];

const submitComm    =   [
    {
        "command":  /terminate program (.*)/,
        "callback": terminate
    },
    {
        "command":  /(.*) submit input/,
        "callback": submitAns
    }
];

//__Preload:____________________________________________//

/** Loading presets:    */
function preload()  {
    //  Loading data:
    d   =   loadJSON(`assets/data/devices_List.json`);
    r   =   loadJSON(`assets/data/family_List.json`);
    l   =   loadJSON(`assets/data/languages_List.json`);
    c   =   loadJSON(`assets/data/nationalities_List.json`);
    //  Loading AI data:
    a   =   loadJSON(`assets/data/ai_data.json`);

}


//__Setup:  ____________________________________________//

/** Called Once:    */
function setup()    {
    createCanvas(windowHeight, windowHeight);
    //  Selecting font for text:
    textFont(`JetBrains Mono`);

    //  Selecting ai's randomized elements:

    //  Creating AI:
    dialogueAI    =   new Voices(d, r, l, c, a);
    dialogueAI.setupAI();

    //  Creating Hud:
    hud =   new Hud();

    color   =   hud.colorAI;

    //  Adding AI's face:
    faceAI  =   new Face_AI(color);
    faceAI.setup();

    //  Voice interactions:


    //  Debug:
    console.log(state, substate);
}


//__Draw:   ____________________________________________//

/** Called Every Frame: */
function draw() {
    if (start && tracking)  {
        state   =   STATE.GAME;
    }

    
    color   =   hud.colorAI;
    // console.log(color);
    
    //  Different states:
    switch (state)  {
        case STATE.BIOS:
            hud.biosScreen();
            break;
        case STATE.GAME:
            hud.draw();
            break;
        case STATE.TERM:
            shutdown();
            break;
    }

    //  Debug:  State
    if (keyIsPressed)   {
        // console.log(state, substate);
    }
}

/** Closing the program:    */
function shutdown() {
    window.location.href    =   `closed.html`;
}

/** Interactive keys:   */
function keyPressed()   {
    if (event.keyCode === 32)   {
        if (!start) {
            dialogueAI.outputOfAI();
        }
        start   =   true;
        console.log(start);
    }

    //  Debug:
    debuggingKeys();
}


//__User:   ____________________________________________//

/** Speech Recognition settings:    */  
function userInput()    {
    console.log(`listening`);
    //  Recognition settings:
    recognition.continuous      =   true;
    recognition.interimResults  =   true;
    recognition.onResult        =   handleSpeechInput;

    recognition.start();
}

/** Applying answer submission commands:    */
function handleSpeechInput()    {
    callingCommands(submitComm, recognition.resultString.toLowerCase());
}

/** Processing Detected Commands:   */
function callingCommands(input, sentence)   {
    let lowerCase  =   sentence;
    //  Assigning the following program for all from the list of commands:
    for (let command of input)  {
        command.command
        //  If a command is spoken from the list:
        if (lowerCase === command.command) {
            command.callback();
            // break;
        }

        //  If the user input matches with any command:
        match  =   lowerCase.match(command.command);
        if (match && match.length > 1)    {
            console.log(match);
            command.callback(match);
        }
    }

    //  If the mic gets an input:
    if (recognition.resultValue)    {
        //  Converting to lowercase + adding to backlog:
        currentInput    =   recognition.resultString.toLowerCase();
        // console.log(currentInput);
    }
}


//__Commands:   ________________________________________//

/** Program Termination:    */
function terminate(data)    {
    shutdown(data);
}

    //  -   -   -   -   -   -   -   -   -   -   -   -   //
/** Shutting down program:  */
function shutdown(data) {
    console.log(`terminating...`);

    window.location.href    =   `closed.html`;
}

/** Redirecting commands:   */
function submitAns(data)    {
    dialogueAI.submitAns(data);
}

    //  -   -   -   -   -   -   -   -   -   -   -   -   //

/** Name data:  */
function getName(data)  {
    dialogueAI.getName(data);
}

/** Age data:   */
function getAge(data)   {
    dialogueAI.getAge(data);
}

/** Nationality data:   */
function getNationality(data)   {
    dialogueAI.getNationality(data);
}

/** Social status data: */
function getSocialStatus(data)  {
    dialogueAI.getSocialStatus(data);
}

/** Current location data:  */
function getResidency(data) {
    dialogueAI.getResidency(data);
}


//__Debugging:  ________________________________________//

/** Interactions:   */
function debuggingKeys()    {
    hud.stateKeys();
    dialogueAI.responseKeys();
}




