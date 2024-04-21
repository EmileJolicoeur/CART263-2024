//  -   -   -   -   -   -   -   -   -   -   -   -   -   //
//______________________________________________________//

/**
"Spilled Information"
by Emile Jolicoeur


Special Thanks to:
- Pippin Barr
*/

"use strict"


//__Variables:  ________________________________________//

//  Input values:
const recognition   =   new p5.SpeechRec();
let currentInput    =   ``;

//  Output values:
const voice =           new p5.Speech();
let currentOutput   =   ``;

/*  [Draw]  Display:    */
//  Blinking values:
let blinkIntensity  =   100;
let blink   =           setInterval(inputLine, 500);
//  Chat Log:
let interactions    =   [];

//  [Data_Collection]   User information gathered from the AI:
let user    =   {
    name:               undefined,  //DialogueResponse[1]
    age:                undefined,  //DialogueResponse[2]
    nationality:        undefined,  //DialogueResponse[3]
    relationship:       undefined,  //DialogueResponse[4]
    address:            undefined,  //DialogueResponse[5]
};

//  [submitAns] User voice triggers:
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
//  [User]  Commands List:
const submitComm    =   [
    {
        "command":  /(.*) submit input/,
        "callback": submitAns
    }
];

/*  JSON:   */
//  [Setup] Data files:
let data    =   {
    devices:    undefined,
    language:   undefined,
    relations:  undefined,
};
//  [Data Collection]   Country List:
let countryData     =   undefined;
//  [AI]    AI's parameters:
let ai              =   undefined;

//  [Setup] Selected elements from data:
let selectedDevice  =   undefined;
let selectedFamily  =   undefined;
let acronym         =   undefined;
let selectedName    =   undefined;

/** Question variables from AI's previous dialogue: */
let previousQuestion    =   `Nan`;
//  Debugging:
let negIndex            =   `Nan`;
let posIndex            =   `Nan`;
let outputType          =   `Neutral`;




/*  Debugging:  */
//  SFX:
let barkSFX             =   undefined;

//  Question select values:
let unaskedQuery        =   `[-]`;
let askedQuery          =   `[Q]`;
let answeredQuery       =   `[R]`;
let choices             =   [1, 2, 3];
let questionVisual      =   [`[_]`, `[_]`, `[_]`, `[_]`, `[_]`, `[_]`];

//  -   -   -   -   -   -   -   -   -   -   -   -   -   //

/*  Face Tracking:  */
//  [Draw]  States:
const STATE =   {
    START:  `START`,
    MIMICKING:  `MIMICKING`
};

//  Face obj:
let aiFace;


//__Preload:____________________________________________//

/** Loading presets:    */
function preload()  {
    //  Loading Data:
    countryData     =   loadJSON(`assets/data/nationalities_List.json`);
    data.devices    =   loadJSON(`assets/data/devices_List.json`);
    data.language   =   loadJSON(`assets/data/languages_List.json`);
    data.relations  =   loadJSON(`assets/data/family_List.json`);

    //  Loading AI Data:
    ai              =   loadJSON(`assets/data/ai_data.json`);

    console.log(
        `<_Preload:\t[Completed]\t_>`,
        `\n\t> Data_Loaded`
    )
}


//__Setup:  ____________________________________________//

/** Called Once:    */
function setup()    {
    //  Creating the canvas:
    createCanvas(windowHeight, windowHeight);

    //  Selecting the smart home device to 
    selectedDevice  =   random(data.devices.list);
    selectedFamily  =   random(data.relations.relatives);
    acronym         =   random(ai.data.names[0].acronyms);
    selectedName    =   ai.data.names[0].meanings[(ai.data.names[0].acronyms.indexOf(acronym))];

    //  Debug:
    console.log(
        `<_Setup:\t[Completed]\t_>`,
        `\n\t> SmartDevice:\t`  +   `{` + selectedDevice + `}`,
        `\n\t> Fam_Member:\t`   +   `{` + selectedFamily + `}`,
        `\n\t> AI_Name:\t\t`    +   `[\b` + selectedName + `\b]`,
        `\n\t> AI_Acronym: \t`  +   `[` + acronym + `]`,
    )

    aiFace          =   new FacialReconstruction();
    aiFace.setup();


    console.log(
        `<_Program Started\t_>`
    );
}


//__Draw:   ____________________________________________//

/** Called Every Frame: */
function draw() {
    // switch (this.state) {
    //     case STATE.START:
    //         this.loading();
    //         break;
    //     case STATE.MIMICKING:
    //         this.running();
    //         break;
    // }

    background(0);

    aiFace.draw();

    //  Text displayed on the screen:
    backlog();
    inputLine();

    //  DebugElement:
    timerCount();
}

//  -   -   -   -   -   -   -   -   -   -   -   -   -   //

function loading()  {

}

function bios() {
    
}

function running()  {

}

//  -   -   -   -   -   -   -   -   -   -   -   -   -   //

/** Displaying Text:    */
    /** Displaying the backlog: */
function backlog()  {
    //  Selecting font for text:
    textFont(`JetBrains Mono`);

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
    //  Blinking of the input bar:
    blinkIntensity  =   blinkIntensity* -1;

    //  Displaying the input line:
    push();
    fill(0, blinkIntensity, 0);
    textSize(32);
    textWrap(WORD);
    textAlign(LEFT, BOTTOM);
    text(`\t> ` + currentInput + `_`, 7, windowHeight - 10, windowWidth - 14);
    pop();
}


//__AI: ________________________________________________//

/** AI: */
function aiOutput() {
    recognition.stop();

    //  Random language:
    let selectedLanguage    =   random(data.language.list);

    //  Output elements:
    let newQuestion         =   undefined;
    let beforeQuestion      =   undefined;
    let previousQ_Index     =   undefined;
    let newQ_Index          =   undefined;
    // let angerIndex          =   undefined;


    //  Start:
    if (ai.data.posInput === 0 && ai.data.negInput === 0)   {
        // let previousQ_Index =   undefined;

        previousQuestion    =   ai.data.lines[0].start;
        currentOutput       =   ai.data.lines[0].start;
        questionVisual[0]   =   unaskedQuery;
    }

    //  Interactions:
    else    {
        //  Values to verify if it's a positive or negative output:
        let positive    =   ai.data.posInput > ai.data.posOutput;
        let negative    =   ai.data.negInput > ai.data.negOutput;

        //  Anger voice lines:
        if (negative)   {
            //  Logging type of output:
            outputType  =   `Negative`;
            //  Triggering the AI's anger lines if the user refuses to answer:
            if (ai.data.negInput < ai.data.lines[0].anger.length)   {
                //  Selecting the angry comment:
                beforeQuestion  =   ai.data.lines[0].anger[(ai.data.negInput - 1)];
                negIndex   =   ai.data.lines[0].anger.indexOf(ai.data.negInput - 1);

                //  Assembling the voice line:
                currentOutput   =   `\n` + beforeQuestion + `\n` + previousQuestion;
            }
            //  Pissed off the AI:
            else    {
                goodEnd();
            }
        }

        //  Curious voice lines:
        else if (positive)  {
            //  Logging type of output:
            outputType  =   `Positive`;
            //  Satisfied the AI:
            if (ai.data.posInput === ai.data.lines[0].comment.length)   {
                badEnd();
            }

            //  AI gathering info:
            else    {
                //  Selecting question:
                newQuestion =   qSelect(ai.data.posInput);
                
                //  Selecting the comment:
                previousQ_Index =   ai.data.lines[0].question.indexOf(previousQuestion) + 1;
                console.log(`C_Index =\t` + previousQ_Index);
                beforeQuestion =   cSelect(previousQ_Index);

                // console.log(posIndex);

                //  Assembling the voice line:
                currentOutput   =   `\n` + beforeQuestion + `\n` + newQuestion;
                //  Setting the previous question:
                previousQuestion    =   newQuestion;
            }
        }
    }

    newQ_Index  =   ai.data.lines[0].question.indexOf(newQuestion);

    console.log(
        `AI:        {` + acronym + `}`,
        `\nCurrentLanguage: `, selectedLanguage,
        `\n\t\t\t\t\t| Inp | Out |\t|Index|`,
        `\nPositive Values:`, `\t[ `, ai.data.posInput, ` | `, ai.data.posOutput, ` ]\t{`, posIndex, `}`,
        `\nNegative Output:`, `\t[ `, ai.data.negInput, ` | `, ai.data.negOutput, ` ]\t{`, negIndex, `}`,
        `\nMood:\t\t\t\t`   ,  outputType,
        `\nComment:\t\t`    ,   previousQ_Index,
        `\n"`               +   beforeQuestion  +   `"`,
        `\nQuestion:\t\t`   ,  newQ_Index,
        `\n"`               +   newQuestion     +   `"`
    );


    //  Voice settings:
    voice.setVoice(selectedLanguage);
    voice.onEnd =   userInput;
    voice.speak(currentOutput);

    //  Transfers the inputs to the next loop's output:
    ai.data.posOutput   =   ai.data.posInput;
    ai.data.negOutput   =   ai.data.negInput;

    //  Displaying interactions:
    interactions.push(currentOutput);
}


/** Selecting Question: */
function qSelect(userData)  {
    let question    =   undefined;      //Question selected
    let questionIndex   =   undefined;  //Array of ai.data.lines[0].question
    let reRolls =   `X`;                //Amount of times question was randomized
    let r   =   false;                  //If question is random

    // console.log(userData);

    if (userData > 1 && userData <= 4)  {
        r   =   true;
        reRolls =   0;

        //  Randomizing the order of questions:     [1, 2, 3]
        questionIndex   =   random(choices);

        while ((questionIndex > 0 && questionIndex < 4) && questionVisual[questionIndex + 1] === answeredQuery) {
            questionIndex   =   random(choices);
            reRolls++;

            // console.log(
            //     questionVisual,
            //     `\nIndex:   `, questionIndex
            // );
        }
        question    =   ai.data.lines[0].question[questionIndex];

        questionVisual[questionIndex + 1]    =   askedQuery;
    }

    else    {
        questionIndex   =   userData - 1;
        if (userData === 1 || userData > 4) {
            question    =   ai.data.lines[0].question[questionIndex];
            questionVisual[questionIndex + 1]    =    askedQuery;
        }

        else    {
            question    =   `Err`;
        }
    }

    return question;
}

/** Selecting comment:  */
function cSelect(index) {

    let selection   =   ai.data.lines[0].comment[index];
    //  Final value:
    let c   =   linesEdit(selection, `{1}`, `{2}`, `{3}`)
    return c;
}

/** Adding Data in dialogue strings:    */
function linesEdit(string, name, label, family) {
    // console.log(string);
    //  Creates an array out of all the words in the comment:
    if (string) {
        let word    =   string.split(` `);

        console.log(
            `Dialogue Personalization____:`,
            `\n Placeholders: `+ name, label, family,
            `\n Values: `, user.name, acronym, selectedFamily,
            word
        );

        //  For every word in the "word" array:
        for (let i = 0; i < word.length; i++)   {
            //  Switching the placeholder1 for the user's name:
            if (word[i] === name + `,`) {
                word[i] =   user.name + `,`;
            }
            //  Switching the placeholder2 for the AI's name:
            if (word[i] === label + `.`)    {
                word[i] =   `"` + acronym + `".`;
            }
            if (word[i] === family) {
                word[i] =   selectedFamily;
            }
        }
        //  Assembling the "word" array into 1 string:
        let result  =   word.join(` `);
        // console.log(result);

        return result;
    }
}


//__User:   ____________________________________________//

/** Speech Recognition: */
function userInput()    {
    //  Setting the voice Recognition
    recognition.continuous  =   true;
    recognition.interimResults  =   true;
    recognition.onResult    =   handleSpeechInput;
    
    recognition.start();

    console.log(`User:  "` + currentInput + `"`);
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
            console.log(match);

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
    // console.log(`Input received`);
    let reply   =   data[1];
    // console.log(`User Input: ` + reply);

    //  Analyzing sentence for other data:
    callingCommands(commands, data[1]);

    //  First answer (Making contact):
    if (ai.data.posOutput === 0)    {
        
        questionVisual[0] =   answeredQuery;
        ai.data.posInput++;
    }

    // //  After 1st interaction:
    // if (ai.data.posInput === ai.data.posOutput) {
    //     ai.data.negInput++;;
    // }

    //  Text to display on the input line:
    currentInput    =   `\n>    ` + reply;
    interactions.push(currentInput);

    //  Debugging:  Log current progress:
    console.log(
        `User:\t\t{` + user.name + `}`,
        `\n\t\t\t\t\t| Inp | Out |`,
        `\nPositive Values:`, `\t[ `, ai.data.posInput, ` | `, ai.data.posOutput, ` ]`,
        `\nNegative Output:`, `\t[ `, ai.data.negInput, ` | `, ai.data.negOutput, ` ]`,
        `\nInfo gathered: ` ,   questionVisual, user
    );

    // console.log(
    //     `AI:\t\t{` + acronym + `}`,
    //     `\nCurrentLanguage: `, selectedLanguage,
    //     `\n\t\t\t\t\t| Inp | Out |\t|Index|`,
    //     `\nPositive Values:`, `\t[ `, ai.data.posInput, ` | `, ai.data.posOutput, ` ]\t{`, posIndex, `}`,
    //     `\nNegative Output:`, `\t[ `, ai.data.negInput, ` | `, ai.data.negOutput, ` ]\t{`, negIndex, `}`,
    //     `\nMood:\t\t\t\t`, outputType,
    //     `\nComment:\t\t`, previousQ_Index,
    //     `\n"` + beforeQuestion + `"`,
    //     `\nQuestion:\t\t`, newQ_Index,
    //     `\n"` + newQuestion + `"`
    // );

    //  Starting the output program:
    aiOutput();
}


//__Data Collection:____________________________________//

/** Collecting User's personal Data:    */
    /** Name:   */
function getName(data)  {
    console.log(data[1]);
    console.log(data);
    //  Adding the user's name:
    let name    =   grammar_Capital(data[1]).join(` `);

    //  Checking if the user Name was previously given:
    if (!user.name) {
        //  Adding the user's name:
        user.name   =   name;
        //  Adding to the positive count:
        questionVisual[1] =   answeredQuery;
        ai.data.posInput++;
    }
}
/** Age:    */
function getAge(data)   {
    console.log(data[1]);
    //  Adding the user's age:
    let age =   data[1];

    //  Checking if the user's Age was previously given:
    if (!user.age)  {
        // user.age  =   parseInt(data[1]);
        user.age    =   age;
        //  Adding to the positive count:
        questionVisual[2] =   answeredQuery;
        ai.data.posInput++;
    }
}
    /** Nationality:    */  
function getNationality(data)   {
    console.log(data[1]);
    //  Checking if the user's Nationality was already given:
    if (!user.nationality)  {
        //  Adding the user's nationality if it appears in the list of countries:
        for (let i = 0; i < countryData.countries.length; i++)   {
            if (data[1] === countryData.countries[i].toLowerCase())  {
                let country =   grammar_Capital(data[1]).join(` `);

                //  Adds the nationality to the user info:
                user.nationality    =   country;
            }
        }
        //  Adding to the positive count:
        questionVisual[3] =   answeredQuery;
        ai.data.posInput++;
    }
}
    /** Relationship:   */
function getSocialStatus(data)  {
    console.log(data[1]);
    //  Adding the user's relationship status:
    if (!user.relationship) {
        if (data[1] === `yes`)  {
            user.relationship   =   `"Y"`;
        }
        if (data[1] === `no`)   {
            user.relationship   =   `"N"`;
        }
        //  Adding to the positive count:
        questionVisual[4] =   answeredQuery;
        ai.data.posInput++;
    }
}
    /** Current Address:    */
function getResidency(data) {
    console.log(data[1]);

    if (!user.address)  {
        user.address    =   data[1];
        //  Adding to the positive count:
        questionVisual[5] =   answeredQuery;
        ai.data.posInput++;
    }
}

//  -   -   -   -   -   -   -   -   -   -   -   -   -   //

/** Making Proper Nouns:    */
function grammar_Capital(toCap) {
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
    // console.log(beenCap);

    return beenCap;
}


//__Endings:    ________________________________//

/** Endings:    */
function badEnd()   {
    console.log(`You lose!`);
}

function goodEnd()  {
    console.log(`You Win!`);
}


//__Debugging:  ________________________________________//

/** Interactions:   */
function keyPressed()   {
    //  Null response:      [Spacebar]
    if (event.keyCode === 32)   {
        console.log(`input received: _`);
        
        aiOutput();
    }
    //  Positive response:  [ "+" Key]
    else if (event.keyCode === 187) {
        let reply   =   undefined;
        
        if (previousQuestion === ai.data.lines[0].start)    {
            questionVisual[0]   =   answeredQuery;
            reply               =   "Hi";
        }
        else if (previousQuestion === ai.data.lines[0].question[0]) {
            user.name           =   "Peter Jacobs";
            reply               =   user.name;
            questionVisual[1]   =   answeredQuery;
        }
        else if (previousQuestion === ai.data.lines[0].question[1]) {
            user.age            =   `35`;
            reply               =   user.age;
            questionVisual[2]   =   answeredQuery;
        }
        else if (previousQuestion === ai.data.lines[0].question[2]) {
            user.nationality    =   `Canada`;
            reply               =   user.nationality;
            questionVisual[3]   =   answeredQuery;
        }
        else if (previousQuestion === ai.data.lines[0].question[3]) {
            user.relationship   =   `"N"`;
            reply               =   user.relationship;
            questionVisual[4]   =   answeredQuery;
        }
        else if (previousQuestion === ai.data.lines[0].question[4]) {
            user.address        =   `23640 NY-5, Utica, USA`;
            reply               =   user.address;
            questionVisual[5]   =   answeredQuery;
        }
        
        currentInput    =   `\n>\tA:\t` + reply;
        interactions.push(currentInput);

        ai.data.posInput++;
        console.log(
            `**User:________________(Debug)**\n`,
            `Answering: "`, previousQuestion, `"\n`,
            questionVisual, `\n`,
            user
        );
        
        aiOutput();
    }
    //  Negative response:  [ "-" Key]
    else if (event.keyCode === 189) {
        ai.data.negInput++;

        currentInput    =   `\n>\tA:\t` + `Negative`;
        interactions.push(currentInput);
        console.log(interactions);

        
        aiOutput();
    }
}

//  -   -   -   -   -   -   -   -   -   -   -   -   -   //

//  Timer Values:
let timer   =   {
    active:         false,
    startMillis:    undefined,
    start:          undefined,
    duration:       undefined,
    endMillis:      undefined,
    end:            undefined,
    counting:       undefined,
};

/** Debugging:  Timer:  */
function mouseClicked() {
    //  Stopping timer:
    if (timer.active)   {
        //  Converting timer results into a clock format:
        timer.endMillis     =   millis();
        timer.end           =   clock(timer.endMillis);
        timer.duration      =   clock(timer.endMillis - timer.startMillis);

        
        console.log(`*Stopping Timer\n*`, timer);

        //  Switch off:
        resetTime();
    }
    //  Starting timer:
    else    {
        //  Switch on:
        timer.active        =   true;
        //  Converting start value into clock format:
        timer.startMillis   =   millis();
        timer.start         =   clock(timer.startMillis);

        console.log(`*StartingTimer:*\n`, timer)
    }
}
/** Starts the timer:   */
function timerCount()   {
    if (timer.active)   {
        timer.counting  =   clock(millis());
    }
}
/** Displaying the timer results in digital clock format:   */
function clock(state)   {
    let mil =   state;
    let sec =   floor(mil/1000);
    let min =   floor(sec/60);

    let result  =   floor((min%60)/10) + (min%60)%10 + `:` + floor((sec%60)/10) + (sec%60)%10 + `:` + floor((mil%1000)/100) + floor((mil%100)/10);

    return result;
}
/** Resets the timer to it's original values:   */
function resetTime()    {
    timer.active        =   false;
    timer.startMillis   =   undefined;
    timer.start         =   undefined;
    timer.duration      =   undefined;
    timer.counting      =   undefined;
    timer.end           =   undefined;
}