"use strict"

//__Variables:  ________________________________________//

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
let interactions;
let c;

/*  JSON:   */
    //  {Setup} Data files:
let data    =   {
    dev:    undefined,
    lang:   undefined,
    rel:    undefined
};

//  Triggers:
let start   =   false;
let tracking    =   false;

//  Answers:
let a   =   0;


//__Preload:____________________________________________//

/** Loading presets:    */
function preload()  {

}


//__Setup:  ____________________________________________//

/** Called Once:    */
function setup()    {
    createCanvas(windowHeight, windowHeight);

    //  Selecting ai's randomized elements:

    //  Creating Hud:
    hud =   new Hud();

    //  Adding AI's face:
    faceAI  =   new Face_AI();
    faceAI.setup();

    //  Voice interactions:



    console.log(state, substate);
}


//__Draw:   ____________________________________________//

/** Called Every Frame: */
function draw() {
    if (start && tracking)  {
        state   =   STATE.GAME;
    }
    
    //  Different states:
    switch (state)  {
        case STATE.BIOS:
            hud.biosScreen();
            break;
        case STATE.GAME:
            background(0);
            hud.draw();
            faceAI.running();
            break;
        case STATE.TERM:
            terminating();
            break;
    }

    //  Debug:  State
    if (keyIsPressed)   {
        console.log(state, substate);
    }
}

/** */
function terminating()  {
    window.location.href    =   `closed.html`;
}

/** Interactive keys:   */
function keyPressed()   {
    if (event.keyCode === 32)   {
        start   =   true;
        console.log(start);
    }

    //  Debug:
    debuggingKeys();
}


//__Debugging:  ________________________________________//

/** Interactions:   */
function debuggingKeys()    {
    stateKeys();
    responseKeys();
}


/** Testing game states:    */
function stateKeys()    {
    if (event.keyCode === 49)   {
        substate    =   SUBSTATE.ASK;
    }
    if (event.keyCode === 50)   {
        substate    =   SUBSTATE.WIN;
    }
    if (event.keyCode === 51)   {
        substate    =   SUBSTATE.LOSE;
    }
    if (event.keyCode === 52)   {
        substate    =   SUBSTATE.CONF;
    }
    if (event.keyCode === 53)   {
        state   =   STATE.TERM;
    }
}

/** Testing Ask state:  */
function responseKeys() {
    //  Repeat AI query:    [backspace]
    if (event.keyCode === 8)    {
        /*  See js:777-781  */
    }
    //  Positive response:  [ "+" Key]
    else if (event.keyCode === 187) {
        /*  |   |   */
    }
    //  Negative response:  [ "-" Key]
    else if (event.keyCode === 189) {
        /*  |   |   */
    }
    //  Confused response:  [ "0" Key]
    else if (event.keyCode === 48)  {
        /*  |   |   */
    }
}