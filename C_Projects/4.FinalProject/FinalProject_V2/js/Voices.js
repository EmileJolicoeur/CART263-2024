/** Script holding:
 * 
 * Voice rec
 * Voice commands
 * 
 * AI voice
 * Question selection
 * 
*/

class   Voices  {

    //__Variables:  ________________________________________//

    constructor(d, r, l, c, a)  {
        this.user   =   {
            name:   undefined,
            age:    undefined,
            nationality:    undefined,
            relationship_status:    undefined,
            current_address:    undefined
        };

        //  Data:
        this.d  =   {
            dev:    d,  //  Device
            rel:    r,  //  Relations
            lang:   l,  //  Language
            ctry:   c   //  Countries
        };
        // this. countryData   =   c;

        this.ai =   a;

        this.sel_dev;
        this.sel_rel;
        this.acronymAI;
        this.nameAI;

        this.prevQ      =   `Nan`;
        this.neg_Index  =   `Nan`;
        this.pos_Index  =   `Nan`;
        this.outType    =   `Neutral`;


        /*  Debugging:  */
            //  Question selection values:
        this.confused       =   0;
        this.unaskedQuery   =   `[-]`;
        this.askedQuery     =   `[Q]`;
        this.answeredQuery  =   `[R]`;
        this.choices        =   [1, 2, 3];
        this.questionVisAid =   [`[_]`, `[_]`, `[_]`, `[_]`, `[_]`, `[_]`];
    }
    

    //__Preload:____________________________________________//

    /** Loading presets:    */
    loadingAI() {
        //  Loading data:
        this.d.dev  =   loadJSON(`assets/data/devices_List.json`);
        this.d.rel  =   loadJSON(`assets/data/family_List.json`);
        this.d.lang =   loadJSON(`assets/data/languages_List.json`);
        this.d.ctry =   loadJSON(`assets/data/nationalities_List.json`);
        //  Loading AI data:
        this.ai =   loadJSON(`assets/data/ai_data.json`);
    }


    //__Setup:  ____________________________________________//

    /** Called Once:    */
    setupAI()   {
        this.sel_dev    =   random(this.d.dev.list);
        this.sel_rel    =   random(this.d.rel.relatives);
        this.acronymAI  =   random(this.ai.data.names[0].acronyms);
        this.nameAI =   this.ai.data.names[0].meanings[(this.ai.data.names[0].acronyms.indexOf(this.acronymAI))];
    }


    //__AI: ________________________________________________//
    
    /** AI: */
    outputOfAI()    {
        recognition.stop();

        //  Language selection:
        this.sel_lang =   random(this.d.lang.list);

        //  Dialogue components:
        this.comment    =   undefined;
        this.newQ       =   undefined;
        //  Debug variables:
        this.newQ_Index     =   undefined;
        this.prevQ_Index    =   undefined;

        substate    =   SUBSTATE.ASK;

        //  Endings:
        if (this.confused >= this.ai.data.lines[0].confused.length) {
            console.log(this.confused);
            console.log(`Confused Ending:`);
            substate    =   SUBSTATE.CONF;
        }
        else if (this.ai.data.posInput > this.ai.data.lines[0].comment.length)  {
            console.log(this.ai.data.posInput);
            console.log(`Compliance Ending:`);
            substate    =   SUBSTATE.LOSE;
        }
        else if (this.ai.data.negInput > this.ai.data.lines[0].anger.length)    {
            console.log(this.ai.data.negInput);
            console.log(`Vigilant Ending:`);
            substate    =   SUBSTATE.WIN;
        }

        //  Dialogue selection:
        else    {
            //  Comparing with previous values:
            this.positive   =   this.ai.data.posInput > this.ai.data.posOutput;
            this.negative   =   this.ai.data.negInput > this.ai.data.negOutput;

            //  Starting interaction:
            if (this.ai.data.posInput === 0 && this.ai.data.negInput === 0)   {

                this.prevQ  =   this.ai.data.lines[0].start;
                currentOutput  =   this.ai.data.lines[0].start;
                this.questionVisAid[0]  =   this.unaskedQuery;
            }

            //  Confusion dialogue:
            else if (this.positive && this.negative)  {
                this.outType    =   `???`;

                this.confused++;
                this.comment    =   this.ai.data.lines[0].confused[(this.confused - 1)];

                currentOutput  =   `\n`+this.comment+`\n`+this.prevQ+`.`;
            }

            //  Anger dialogue:
            else if (this.negative) {
                this.outType    =   `Negative`;

                this.comment    =   this.ai.data.lines[0].anger[(this.ai.data.negInput-1)];
                this.neg_Index  =   this.ai.data.lines[0].anger.indexOf(this.ai.data.negInput-1);

                currentOutput   =   `\n`+this.comment+`\n`+this.prevQ+`.`;
            }

            //  Query dialogue:
            else if (this.positive) {
                this.outType    =   `Positive`;

                //  Selecting question:
                this.newQ   =   this.qSelect(this.ai.data.posInput);
                console.log(this.newQ);

                this.prevQ_Index    =   this.ai.data.lines[0].question.indexOf(this.prevQ) +1;

                this.comment    =   this.cSelect(this.prevQ_Index);

                currentOutput  =   `\n`+this.comment+`\n`+this.newQ+`.`;

                this.prevQ  =   this.newQ;
            }

            //  Debug:
            // this.pos_Index  =   this.ai.data.lines[0].comment.indexOf(this.prevQ) +1;

            this.newQ_Index =   this.ai.data.lines[0].question.indexOf(this.newQ);

            console.log(
                `AI:\t{${this.acronymAI}}\n`,
                `Lang:\t${this.sel_lang}\n`,
                `\t\t\t\t\t| Inp | Out |\t|Index|\n`,
                `Positive Values:`, `\t[ `, this.ai.data.posInput, ` | `, this.ai.data.posOutput, ` ]\t{`, this.pos_Index, `}\n`,
                `Negative Values:`, `\t[ `, this.ai.data.negInput, ` | `, this.ai.data.negOutput, ` ]\t{`, this.neg_Index, `}\n`,
                `Mood:\t${this.outType}\n`,
                this.questionVisAid , `\n`,
                `C: (${this.prevQ_Index})\t"${this.comment}"\n`,
                `Q: (${this.newQ_Index})\t"${this.newQ}"`
            );

            //  Voice settings:
            voiceAI.onEnd   =   userInput;
            voiceAI.speak(currentOutput);

            //  Data transfer:
            this.ai.data.posOutput  =   this.ai.data.posInput;
            this.ai.data.negOutput  =   this.ai.data.negInput;

            //  Displaying dialogue:
            interactions.push(currentOutput);
        }
    }
    /** Selecting Question: */
    qSelect(userData)   {
        this.q          =   undefined;  //  Question selected
        this.q_Index    =   undefined;  //  array of selected question

        //  Debug variables:
        this.randomized =   false;      //  If question is random
        this.reroll_nb  =   `X`;        //  Amount of times it's been randomized

        //  if the amount of questions answered is within [3-5]:
        if (userData > 1 && userData <= 4)   {
            console.log(`Random Q:`);
            this.randomized =   true;
            this.reroll_nb  =   0;

            //  Randomizing question order:
            this.q_Index    =   random(this.choices);
            // console.log(`Index:`, this.q_Index);

            //  Changing question if it was previously answered:
            while ((this.q_Index > 0 && this.q_Index < 4) && this.questionVisAid[(this.q_Index + 1)] === this.answeredQuery)    {
                this.q_Index    =   random(this.choices);
                this.reroll_nb++;
            }

            this.q  =   this.ai.data.lines[0].question[this.q_Index];
            this.questionVisAid[this.q_Index + 1] =   this.askedQuery;
        }

        else    {
            this.q_Index    =   userData - 1;
            if (userData === 1 || userData > 4) {
                this.q  =   this.ai.data.lines[0].question[this.q_Index];
                this.questionVisAid[this.q_Index+1] =   this.askedQuery;
            }

            else    {
                this.q  =   `Err`;
            }
        }
        
        return this.q;
    }
    /** Selecting Comment:  */
    cSelect(index)   {
        this.select =   this.ai.data.lines[0].comment[index];

        this.cmnt   =   this.editedLines(this.select, `{1}`, `{2}`, `{3}`);
        return this.cmnt;
    }
    /** Editing the AI Dialogue:    */
    editedLines(string, name, label, family)    {
        if (string) {
            this.word   =   string.split(` `);

            for (let i = 0; i < this.word.length; i++)  {
                if (this.word[i] === name+`,`)  {
                    this.word[i]    =   `"${this.user.name}",`;
                }
                if (this.word[i] === label+`.`) {
                    this.word[i]    =   `"${this.acronymAI}".`;
                }
                if (this.word[i] === family)    {
                    this.word[i]    =   `"${this.sel_rel}`;
                }
            }
            this.result =   this.word.join(` `);

            return this.result;
        }
    }


    //__Commands:   ________________________________________//
    
    /** Voice commands: */
        /** Submitting Answer:  */
    submitAns(data) {
        this.reply  =   data[1];

        callingCommands(commands, data[1]);

        if (this.ai.data.posOutput === 0)   {
            this.questionVisAid[0]  =   this.answeredQuery;
            this.ai.data.posInput++;
        }

        if (this.ai.data.posInput === this.ai.data.posOutput)   {
            this.ai.data.negInput++;
        }

        currentInput    =   `\t>\t ${this.reply}`;
        interactions.push(currentInput);

        //  Debug:
        console.log(
            `User:\t{${this.user.name}}\n`,
            this.questionVisAid, `\n`,
            `A:\t"${this.reply}"\n`,
            this.user
        );

        //  Starting Next Query:
        this.outputOfAI();
    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //

    /** Data Collection:    */
        /** Name:   */
    getName(data)   {
        //  Applying Data:
        this.name   =   this.grammar_Capital(data[1]).join(` `);

        //  Checking if data was already collected:
        if (!this.user.name)    {
            //  Applying new data:
            this.user.name  =   this.name;

            //  Removing question from ai's options:
            this.questionVisAid[1]  =   this.answeredQuery;
            this.ai.data.posInput++;

            //  Confusion ending possibility:
            if (this.prevQ != this.ai.data.lines[0].question[0])    {
                this.ai.data.negInput++;
            }
        }
    }

    /** Age:    */
    getAge(data)    {
        //  Applying new data:
        this.age    =   data[1];

        //  Checking if data was already collected:
        if (!this.user.age) {
            //  Applying new data:
            this.user.age  =   this.age;

            //  Removing question from ai's options:
            this.questionVisAid[2]  =   this.answeredQuery;
            this.ai.data.posInput++;

            //  Confusion ending possibility:
            if (this.prevQ != this.ai.data.lines[0].question[1])    {
                this.ai.data.negInput++;
            }
        }
    }

    /** Nationality:    */
    getNationality(data)    {
        //  Checking if data was already collected:
        if (!this.user.nationality) {
            //  Comparing data with country database:
            for (let i = 0; i < this.d.ctry.length; i++)    {
                //  applying new data:
                if (data[i] === this.d.ctry.countries[i].toLowerCase()) {
                    this.user.nationality   =   this.grammar_Capital(data[1]).join(` `);
                }
            }
            
            //  Removing question from ai's options:
            this.questionVisAid[3]  =   this.answeredQuery;
            this.ai.data.posInput++;

            //  Confusion ending possibility:
            if (this.prevQ != this.ai.data.lines[0].question[2])    {
                this.ai.data.negInput++;
            }
        }
    }

    /** Relationship status:    */
    getSocialStatus(data)   {
        //  Checking if data was already collected:
        if (!this.user.relationship) {
            //  Yes/No answer:
            if (data[1] === `yes`)  {
                this.user.relationship   =   `"Y"`;
            }
            if (data[1] === `no`)   {
                this.user.relationship   =   `"N"`;
            }
            
            //  Removing question from ai's options:
            this.questionVisAid[4] =   this.answeredQuery;
            this.ai.data.posInput++;
    
            //  Confusion ending possibility:
            if (this.prevQ != this.ai.data.lines[0].question[3])   {
                this.ai.data.negInput++;
            }
        }
    }

    /** Current address:    */
    getResidency(data)  {
        //  Checking if data was already collected:
        if (!this.user.address) {
            this.user.address   =   data[1];

            //  Removing question from ai's options:
            this.questionVisAid[5] =   this.answeredQuery;
            this.ai.data.posInput++;
    
            //  Confusion ending possibility:
            if (this.prevQ != this.ai.data.lines[0].question[4])   {
                this.ai.data.negInput++;
            }
        }
    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //

    grammar_Capital(toCap)  {
        this.beenCap    =   [];
        //  Splitting Words:
        this.words  =   toCap.split(` `);
        for (let i = 0; i < this.words.length; i++) {
            this. letter    =   this.words[i].split(``);
            this.capitalLetter  =   this.letter[0];

            this.letter[0]  =   this.capitalLetter.toUpperCase();
            this.capitalWords   =   this.letter.join(``);

            this.beenCap.push(this.capitalWords);
        }

        return this.beenCap;
    }


    //__Debugging:  ________________________________________//

    /** Testing Ask state:  */
    responseKeys()  {
        //  Repeat AI query:    [backspace]
        if (event.keyCode === 8)    {
            console.log(`key: <-`)
            dialogueAI.outputOfAI();
        }
        //  Positive response:  [ "+" Key]
        else if (event.keyCode === 187) {
            voiceAI.stop();
            console.log(`key: +`);

            this.response();

        this.ai.data.posInput++;

            this.outputOfAI();
        }
        //  Negative response:  [ "-" Key]
        else if (event.keyCode === 189) {
            voiceAI.stop();
            console.log(`key: -`);
            
            this.ai.data.negInput++;

            currentInput    =   `\n>\tA:\t[Denied]`;
            interactions.push(currentInput);

            this.outputOfAI();
        }
        //  Confused response:  [ "0" Key]
        else if (event.keyCode === 48)  {
            voiceAI.stop();
            console.log(`key: 0`);

            this.response();
            this.ai.data.posInput++;
            this.ai.data.negInput++;

            this.outputOfAI();
        }
    }

    /** Interactions:   */
    response()  {
        //  Debug answers:
        this.reply;

        if (this.prevQ === this.ai.data.lines[0].start) {
            this.questionVisAid[0]  =   this.answeredQuery;
            this.reply              =   "Hi";
        }
        else if (this.prevQ === this.ai.data.lines[0].question[0])  {
            this.user.name          =   "John Doe";
            this.reply              =   this.user.name;
            this.questionVisAid[1]  =   this.answeredQuery;
        }
        else if (this.prevQ === this.ai.data.lines[0].question[1])  {
            this.user.age           =   `35`;
            this.reply              =   this.user.age;
            this.questionVisAid[2]  =   this.answeredQuery;
        }
        else if (this.prevQ === this.ai.data.lines[0].question[2])  {
            this.user.nationality   =   `Canada`;
            this.reply              =   this.user.nationality;
            this.questionVisAid[3]  =   this.answeredQuery;
        }
        else if (this.prevQ === this.ai.data.lines[0].question[3])  {
            this.user.relationship  =   `"N"`;
            this.reply              =   this.user.relationship;
            this.questionVisAid[4]  =   this.answeredQuery;
        }
        else if (this.prevQ === this.ai.data.lines[0].question[4])  {
            this.user.address       =   `23640 NY-5, Utica, USA`;
            this.reply              =   this.user.address;
            this.questionVisAid[5]  =   this.answeredQuery;
        }

        currentInput    =   `\n>\tA:\t` + this.reply;
        interactions.push(currentInput);

        console.log(
            `**User:\t(Debug)**\n`,
            `Answering:\t"`, this.prevQ, `"\n`,
            this.questionVisAid, `\n`,
            this.user
        );
    }
}