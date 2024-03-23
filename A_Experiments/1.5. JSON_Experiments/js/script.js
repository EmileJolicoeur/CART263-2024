/**
JSON Tutorial
Emile Jolicoeur

Learning how to use JSONs & APIs
*/

"use strict";



// /** JSON files: */
// let tarotData   =   undefined;
// let fortune =   `err`;

// let description =   `Nan`;
// let shadow_1    =   `Nan`;

// //  Loading the JSON file:  [!mousePressed() && !tarotLoaded()] //
// function preload() {
//     //  Loading a JSON file from your computer:
//     tarotData   =   loadJSON(`assets/data/tarot_interpretations.json`);
//     //  Loading a JSON file from the internet:
//     // tarotData   =   loadJSON(`https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json`);
// }

// function setup() {
//     createCanvas(windowHeight, windowHeight);
    
//     if (tarotData != undefined)   {
//         let card    =   random(tarotData.tarot_interpretations);
//         fortune =   random(card.fortune_telling);
//     }
// }

// function draw() {
//     background(123);
//     //  Making draw() compatible for both load options:
//     if (tarotData != undefined)   {
//         //  Gets the description from the object within tarotInterpretation.json:
//         description =   tarotData.description;
//         //  Finding proper info:
//         shadow_1    =   tarotData.tarot_interpretations[0].meanings.shadow[0];
//     }

//     //  Display description::
//     push();
//     textSize(32);
//     textAlign(CENTER);
//     fill(0);
//     text(description, width/2, height/3);
//     pop();

//     //  Display Fortune :
//     push();
//     textSize(32);
//     textAlign(CENTER);
//     fill(0);
//     text(fortune, width/2, height/2);
//     pop();

//     //  Display specific data:
//     push();
//     textSize(32);
//     textAlign(CENTER);
//     fill(0);
//     text(shadow_1, width/2, 2*height/3);
//     pop();
// }

// // //  loading the JSON file on click: [!preload()]    //
// // function mousePressed() {
// //     loadJSON(`assets/data/tarot_interpretations.json`, tarotLoaded);
// // }

// // //  Once JSON is loaded (on click), assign data to variable:    [!preload()]    //
// // function tarotLoaded(data)  {
// //     tarotData   =   data;
// //     let card    =   random(tarotData.tarot_interpretations);
// //     fortune =   random(card.fortune_telling);
// // }


/** API files:  */
let jokeText = ``; // The current joke.
let jokeData = undefined; // The loaded joke data

function preload() {
  jokeData = loadJSON(`https://official-joke-api.appspot.com/jokes/programming/random`);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // We get the joke object as the first element of the array
  let joke = jokeData[0];
  // Set the joke text as the setup and punchline properties together
  jokeText = `${joke.setup}\n\n${joke.punchline}`;
}

function draw() {
  background(0);

  // Display the current joke
  push();
  fill(255, 255, 0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(jokeText, width / 2, height / 2);
  pop();
}
