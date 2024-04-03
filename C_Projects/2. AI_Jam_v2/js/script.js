"use strict"


//  Different screen states:
const STATE =   {
    STARTUP:    `STARTUP`,
    MAPPING:    `MAPPING`,
    ATMOSPHERE: `ATMOSPHERE`
};
let state   =   STATE.STARTUP;


/** Called Before Start:    */
function preload()  {
    earthImg    =   loadImage(`assets/images/EarthMap.jpg`);
    earth2Img   =   loadImage(`assets/images/EarthMap_BnW.jpg`);
    marsImg     =   loadImage(`assets/images/MarsMap.jpg`);
    clownImg    =   loadImage(`assets/images/Clown.jpg`);

    bgImg

    console.log(
        `Preload ____[Completed]`,
        `\n\t> [Images Loaded]`
    );
}

/** Called Once On Start:   */
function setup()    {
    createCanvas(windowHeight, windowHeight);

}