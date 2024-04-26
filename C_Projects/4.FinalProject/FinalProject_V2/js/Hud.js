/** Script holding:
 * 
 * Texts
 * Input slot
 * Commands
*/

class   Hud {

    //__Variables:  ________________________________________//

    constructor()   {
        this.w  =   255;
        this.r  =   [255, 0, 0];
        this.g  =   [0, 255, 0];
        this.b  =   [0, 0, 255];

        // this.width  =   w;
        // this.height =   h;

        this.txtHeight  =   26;

        this.aiColor    =   this.g;


    }


    //__Setup:  ____________________________________________//

    /** Called Once:    */
    setup() {

    }


    //__Draw:   ____________________________________________//

    /** Called Every Frame: */
    draw()  {

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
    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //

    biosScreen()    {
        background(100);

    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //
    
    backlog()   {

    }

    inputLine() {

    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //

    loseScr()   {
        this.aiColor    =   this.r;
    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //

    winScr()    {
        this.aiColor    =   this.w;
    }

    //  -   -   -   -   -   -   -   -   -   -   -   -   -   //

    confWinScr()    {
        this.aiColor    =   this.b;
    }


    //__Color Switch:   ____________________________________//

    // colorState()
}