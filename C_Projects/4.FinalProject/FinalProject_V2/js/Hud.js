/** Script holding:
 * 
 * Texts
 * Input slot
 * Commands
*/

class   Hud {

    //__Variables:  ________________________________________//

    constructor()   {
        //  Colors:
        this.w  =   255;
        this.r  =   [255, 0, 0];
        this.g  =   [0, 255, 0];
        this.b  =   [0, 0, 255];

        // this.substate   =   substates;

        // this.width  =   w;
        // this.height =   h;

        this.txtHeight  =   26;

        this.colorAI    =   this.g;

        /*  [Draw]  Display:    */
            //  Blinking values:
        this.blinkIntensity =   100;
        this.blink  =   setInterval(this.inputLine, 500);
    }


    //__Setup:  ____________________________________________//

    /** Called Once:    */
    setup() {

    }


    //__Draw:   ____________________________________________//

    /** Called Every Frame: */
    draw()  {
        // console.log(substate);
        background(0);

        switch (substate)   {
            case SUBSTATE.ASK:
                this.backlog();
                this.inputLine();
                break;
            case SUBSTATE.LOST:
                this.loseScr();
                break;
            case SUBSTATE.WIN:
                this.winScr();
                break;
            case SUBSTATE.CONF: 
                this.confWinScr();
                break;
        }

        
        faceAI.running();
    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //

    biosScreen()    {
        background(100);
        this.instructions  =   
        `Please give small and concise answers, followed by the words "Submit Input".\n ex:\n\t"My name is __".\n\t"I am __ years old".\n\t"Yes I am".\nEtc.\n\nIn Case of Emergency, Utter "Terminate Program __."`;

        push();
        fill(0, 200, 0);
        textSize(26);
        // textAlign(LEFT, BOTTOM);
        textWrap(WORD);
        text(this.instructions, 20, 20,  windowHeight);
        pop();
    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //
    
    backlog()   {
    
        push();
        fill(0, 200, 0);
        textSize(26);
        textAlign(LEFT, BOTTOM);
        textWrap(WORD);
        text(interactions, 10, windowHeight - 50,  windowHeight);
        pop();
    }

    inputLine() {

        push();
        fill(0, 255, 0);
        rect(0, height, width, height/20);
        pop();

        //  Blinking of the input bar:
        this.blinkIntensity  =   this.blinkIntensity* -1;
    
        //  Displaying the input line:
        push();
        fill(0, this.blinkIntensity, 0);
        // fill(0, 255, 0);
        textSize(32);
        textWrap(WORD);
        textAlign(LEFT, BOTTOM);
        text(`\t>\t` + currentInput + `_`, 7, windowHeight - 10, windowHeight - 14);
        pop();
    }



    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //

    loseScr()   {

        this.colorAI    =   this.r;
    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //

    winScr()    {

        this.colorAI    =   this.w;
    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //

    confWinScr()    {

        this.colorAI    =   this.b;
    }


    //__Color Switch:   ____________________________________//

    /** */
    colorSwitch()   {

    }


    //__Debugging:  ________________________________________//

    /** Testing game states:    */
    stateKeys()    {
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
}