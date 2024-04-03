/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict"
//  SFX:
let barkSFX =           undefined;

//  Input values:
const recognition   =   new p5.SpeechRec();
let currentInput    =   ``;

//  Output values:
const voice =           new p5.Speech();
let currentOutput   =   ``;

//  Display:
    //  Blinking values:
let blinkIntensity  =   100;
let blink   =           setInterval(inputLine, 500);
    //  Chat Log:
let interactions    =   [];

//  User information gathered from the AI   [Lines: 514-610]:
let user    =   {
    name:               undefined,  //DialogueResponse[1]
    age:                undefined,  //DialogueResponse[2]
    nationality:        undefined,  //DialogueResponse[3]
    relationship:       undefined,  //DialogueResponse[4]
    address:            undefined,  //DialogueResponse[5]
};

//  User voice triggers [SubmitAns]:
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
//  Commands List   [HandleSpeechInput]:
const submitComm    =   [
    {
        "command":  /(.*) submit input/,
        "callback": submitAns
    }
];

//  JSON files  [Preload]:
let countryData =       undefined;
let devicesData =       undefined;
let langData    =       undefined;
let relationsData   =   undefined;
    //  AI's parameters:
let ai  =               undefined;

//  Elements to set up  [Setup]:
let selectedDevice  =   undefined;
let selectedFamily  =   undefined;
let acronym =           undefined;
let selectedName    =   undefined;


//  Question select values:
let askedQuery      =   `[Q]`;
let answeredQuery   =   `[R]`;
let unaskedQuery    =   `[-]`;
let choices =           [1, 2, 3];
let usedQ   =           [`[_]`, `[_]`, `[_]`, `[_]`, `[_]`, `[_]`];
let questionVisual  =   [`[_]`, `[_]`, `[_]`, `[_]`, `[_]`, `[_]`];


//______________________________________________________//


/** Loading presets:    */
function preload()  {
    //  Loading Data:
    countryData =   loadJSON(`assets/data/nationalities_List.json`);
    devicesData =   loadJSON(`assets/data/devices_List.json`);
    langData  =   loadJSON(`assets/data/languages_List.json`);
    relationsData  =   loadJSON(`assets/data/family_List.json`);

    //  Loading AI Data:
    ai  =   loadJSON(`assets/data/ai_data.json`);

    console.log(
        `<_Preload:\t[Completed]\t_>`,
        `\n\t> Data_Loaded`
    )
}
/** Called Once:    */
function setup()    {
    //  Creating the canvas:
    createCanvas(windowHeight, windowHeight);

    //  Selecting the smart home device to 
    selectedDevice  =   random(devicesData.list);
    selectedFamily  =   random(relationsData.relatives);
    acronym =   random(ai.data.names[0].acronyms);
    selectedName    =   ai.data.names[0].meanings[(ai.data.names[0].acronyms.indexOf(acronym))];

    //  Debug:
    console.log(
        `<_Setup:\t[Completed]\t_>`,
        `\n\t> SmartDevice:____{` + selectedDevice + `}`,
        `\n\t> Fam_Member: ____{` + selectedFamily + `}`,
        `\n\t> AI_Name:________[\b` + selectedName + `\b]`,
        `\n\t> AI_Acronym: ____[` + acronym + `]`,
    )

    //  Setting up the Interactions loop:
    aiOutput();

    console.log(
        `<_Program Started\t_>`
    );
}
/** Called Every Frame: */
function draw() {
    background(0, 20, 0);

    //  Text displayed on the screen:
    backlog();
    inputLine();

    //  DebugElement:
    timerCount();
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
    //  Blinking of the input bar:
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

//  Question from AI's previous dialogue:
let previousQuestion    =   `Nan`;
let negIndex            =   `Nan`;
let posIndex            =   `Nan`;
let outputType          =   `Neutral`;

/** AI: */
function aiOutput() {
    recognition.stop();

    //  Random language:
    let selectedLanguage    =   random(langData.list);

    //  Output elements:
    let newQuestion     =   undefined;
    let beforeQuestion  =   undefined;


    //  Start: 
    if (ai.data.posInput === 0 && ai.data.negInput === 0)   {
        currentOutput       =   ai.data.lines[0].start;
        questionVisual[0]   =   unaskedQuery;

        console.log(
            `{\tAI:\t\t["` + acronym + `"]`,
            `\n\t> CurrentLanguage:\t`, selectedLanguage,
            `\n\t> Positive Values:\t[ `, ai.data.posInput, ` | `, ai.data.posOutput, ` ]`,
            `\n\t> Negative Output:\t[ `, ai.data.negInput, ` | `, ai.data.negOutput, ` ]`,
            `\n\t> Mood:\t\t\t\t(___` + outputType + `___)`,
            `\n\t> Before Question:\t`, `"` + currentOutput + `"`,
            questionVisual
        );
    }

    //  Interactions:
    else    {
        //  Values to verify if it's a positive or negative output:
        let positive    =   ai.data.posInput > ai.data.posOutput;
        let negative    =   ai.data.negInput > ai.data.negOutput;

        //  Anger voice lines:
        if (negative)  {
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
                //  Selecting the comment:
                let previousQueryIndex  =   ai.data.lines[0].question.indexOf(newQuestion) + 1;
                console.log(`<><>`, previousQueryIndex);
                beforeQuestion =   cSelect(previousQuestion, ai.data.posInput - 1);
                // beforeQuestion =   cSelect(previousQuestion, ai.data.lines[0].question.indexOf(newQuestion)-1);
                //  Selecting question:
                newQuestion =   qSelect(ai.data.posInput);
                posIndex   =   ai.data.lines[0].comment.indexOf(ai.data.posInput);

                //  Assembling the voice line:
                currentOutput   =   `\n` + beforeQuestion + `\n` + newQuestion;
                //  Setting the previous question:
                previousQuestion    =   newQuestion;
            }
        }




        //  If both are triggered:
        // else if (positive && negative)  {
        // }

        console.log(
            `AI:        {` + acronym + `}`,
            `\nCurrentLanguage: `, selectedLanguage,
            `\nPositive Values: `, `[ `, ai.data.posInput, ` | `, ai.data.posOutput, ` ]    {`, posIndex, `}`,
            `\nNegative Output: `, `[ `, ai.data.negInput, ` | `, ai.data.negOutput, ` ]    {`, negIndex, `}`,
            `\nMood:            `, outputType,
            `\nBefore Question: `, `"`, beforeQuestion, `"`,
            `\n }   End AI`
        );
    }


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
    let question    =   undefined;
    let questionIndex   =   userData - 1;
    let reRolls =   `X`;
    let r   =   undefined;

    console.log(userData);


    if (userData > 1 && userData <= 4)  {
        r   =   `Y`;
        reRolls =   0;

        //  Randomizing the order of questions:     [1, 2, 3]
        questionIndex   =   random(choices);
        question    =   ai.data.lines[0].question[questionIndex];

        while ((questionIndex > 0 && questionIndex < 4) && questionVisual[questionIndex] === `[R]`) {
            questionIndex   =   random(choices);
            reRolls++;
            question    =   ai.data.lines[0].question[questionIndex];

            console.log(
                questionVisual,
                `\nIndex:   `, questionIndex
            );
        }
        questionVisual[questionIndex + 1]    =   askedQuery;

    }
    else    {
        if (userData === 1 || userData > 4) {
            r   =   `N`;
            question    =   ai.data.lines[0].question[questionIndex];
            questionVisual[questionIndex + 1]    =    askedQuery;
        }
        else    {
            question    =   `Err`;
        }
    }

    //  Debug:
    console.log(
        `[Question Selection:____________________________`,
        `\n Random Index:   [` + r + `] ____{`, questionIndex, `}`,
        `\n Index Re-rolls: `, reRolls,
        `\n`, questionVisual,
        `\nQuery:   "`, question, `"`,
    );

    return question;
}
/** Selecting comment:  */
function cSelect(query, queryPos)   {
    console.log(
        `   >   Comment Selection:____________________`,
        `\n     >   `, 
    );
    //  Previous Question + it's position in ai.data.lines[0].comment:
    console.log(query, queryPos);
    let selection   =   ai.data.lines[0].comment[queryPos];
    //  Final value:
    let c   =   linesEdit(selection, `{1}`, `{2}`, `{3}`)
    return c;
}

function linesEdit(string, name, label, family) {
    console.log(string);
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
        console.log(currentInput);
    }
    else    {
        return;
    }
}

/** Submitting Vocal Input: */
function submitAns(data)    {
    console.log(`Input received`);
    let reply   =   data[1];
    console.log(`User Input: ` + reply);

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
        `User:`,
        `\nPositive: `, ai.data.posInput, ai.data.posOutput,
        `\nNegative: `, ai.data.negInput, ai.data.negOutput,
        // `\nQ_Remaining: ` + ai.data.lines[0].question,
        `\nInfo gathered: `, questionVisual, user
    );

    //  Starting the output program:
    aiOutput();
}


//  -   -   -   -   -   -   -   -   -   -   -   -   -   //


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
        for (let i = 0; i < countryData.list.length; i++)   {
            if (data[1] === countryData.list[i].toLowerCase())  {
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
function getResidency(data)  {
    console.log(data[1]);

    if (!user.address)  {
        user.address    =   data[1];
        //  Adding to the positive count:
        questionVisual[5] =   answeredQuery;
        ai.data.posInput++;
    }
}


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
    //  Null response:      [Spacebar]
    if (event.keyCode === 32)   {
        console.log(`input received: _`);
    }
    //  Positive response:  [+ Key]
    else if (event.keyCode === 187) {
        let reply   =   undefined;
        
        if (previousQuestion === ai.data.lines[0].start)    {
            questionVisual[0]   =   answeredQuery;
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
            user.address        =   `2364 NY-5, Utica, USA`;
            reply               =   user.address;
            questionVisual[5]   =   answeredQuery;
        }
        
        currentInput    =   `\n>    ` + reply;
        ai.data.posInput++;
        console.log(
            `**User:________________(Debug)**\n`,
            `Answering: "`, previousQuestion, `"\n`,
            questionVisual, `\n`,
            user
        );
    }
    //  Negative response:  [-Key]
    else if (event.keyCode === 189) {
        ai.data.negInput++;
        console.log(`input received: -`);
    }

    aiOutput();
}


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