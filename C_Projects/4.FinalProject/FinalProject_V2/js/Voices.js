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

    constructor()   {

    }
    

    //__Preload:____________________________________________//

    /** Loading presets:    */
    loadingAI() {
        //  Loading Data:
        this.countryData    =   loadJSON(`assets/data/nationalities_List.json`);
        this.d.dev       =   loadJSON(`assets/data/devices_List.json`);
        this.d.lang      =   loadJSON(`assets/data/languages_List.json`);
        this.d.rel       =   loadJSON(`assets/data/family_List.json`);

        this.ai =   loadJSON(`assets/data/ai_data.json`);
    }


    //__Setup:  ____________________________________________//

    /** Called Once:    */
    setupAI()   {
        this.selectedDevice =   random(this.d.dev.list);
        this.selectedFamily =   random(this.d.rel.relatives);
        this.acronym    =   random(ai.data.names[0].acronyms);
        this.selectedName   =   ai.data.names[0].meanings[(ai.data.names[0].acronyms.indexOf(acronym))];
    }
}