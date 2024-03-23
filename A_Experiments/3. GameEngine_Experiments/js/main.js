"use strict";

/** 2. Phaser 3 Setup:  */
//  Configuration Options:  (More options available > check Engine page)
let config  =   {
    //  How it will be displayed:   (Canvas or WebGL)
    type:   Phaser.AUTO, // Checks which option is available/best
    //  Specifying the canvas height:
    width:  800,
    height: 600,
    //  Specifying what kind of physics engine you want to use: ()
    physics:    {
        default:    `arcade`,
    },
    //  how many scenes you have in your game:
    scene:  [Boot, Play],
};
//  Creating a new Phaser.Game obj:
let game    =   new Phaser.Game(config);


