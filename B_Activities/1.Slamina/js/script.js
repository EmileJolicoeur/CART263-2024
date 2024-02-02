/**
Slamina
Emile Jolicoeur

Guessing Game
*/

"use strict";

const animals   =   [
    "aardvark",
    "alligator",
    "alpaca",
    "antelope",
    "ape",
    "armadillo",
    "baboon",
    "badger",
    "bat",
    "bear",
    "beaver",
    "bison",
    "boar",
    "buffalo",
    "bull",
    "camel",
    "canary",
    "capybara",
    "cat",
    "chameleon",
    "cheetah",
    "chimpanzee",
    "chinchilla",
    "chipmunk",
    "cougar",
    "cow",
    "coyote",
    "crocodile",
    "crow",
    "deer",
    "dingo",
    "dog",
    "donkey",
    "dromedary",
    "elephant",
    "elk",
    "ewe",
    "ferret",
    "finch",
    "fish",
    "fox",
    "frog",
    "gazelle",
    "gila monster",
    "giraffe",
    "gnu",
    "goat",
    "gopher",
    "gorilla",
    "grizzly bear",
    "ground hog",
    "guinea pig",
    "hamster",
    "hedgehog",
    "hippopotamus",
    "hog",
    "horse",
    "hyena",
    "ibex",
    "iguana",
    "impala",
    "jackal",
    "jaguar",
    "kangaroo",
    "koala",
    "lamb",
    "lemur",
    "leopard",
    "lion",
    "lizard",
    "llama",
    "lynx",
    "mandrill",
    "marmoset",
    "mink",
    "mole",
    "mongoose",
    "monkey",
    "moose",
    "mountain goat",
    "mouse",
    "mule",
    "muskrat",
    "mustang",
    "mynah bird",
    "newt",
    "ocelot",
    "opossum",
    "orangutan",
    "oryx",
    "otter",
    "ox",
    "panda",
    "panther",
    "parakeet",
    "parrot",
    "pig",
    "platypus",
    "polar bear",
    "porcupine",
    "porpoise",
    "prairie dog",
    "puma",
    "rabbit",
    "raccoon",
    "ram",
    "rat",
    "reindeer",
    "reptile",
    "rhinoceros",
    "salamander",
    "seal",
    "sheep",
    "shrew",
    "silver fox",
    "skunk",
    "sloth",
    "snake",
    "squirrel",
    "tapir",
    "tiger",
    "toad",
    "turtle",
    "walrus",
    "warthog",
    "weasel",
    "whale",
    "wildcat",
    "wolf",
    "wolverine",
    "wombat",
    "woodchuck",
    "yak",
    "zebra"
]

let currentAnimal   =   ``;
let currentAnswer   =   ``;

//Voice of Program:
const speechSynthesizer =   new p5.Speech();
const speechRecognizer  =   new p5.SpeechRec();

/** */
function preload() {

}


/** */
function setup() {
    createCanvas(windowHeight, windowHeight)
    speechRecognizer.continuous =   true;
    speechRecognizer.onResult   =   handleSpeechInput;
    speechRecognizer.start();
}


/** */
function draw() {
    background(0, 0, 0);

    if (currentAnswer === currentAnimal)    {
        fill(0, 255, 0);
    }   else {
        fill(255, 0, 0);
    }

    push();
    textSize(24);
    textAlign(CENTER, CENTER);
    text(currentAnswer, width/2, height/2);
    pop();
}

function handleSpeechInput()    {
    let guessedAnimal   =   `What?`;
    if (speechRecognizer.resultValue)   {
        let lowerCaseResult =   speechRecognizer.resultString.toLowerCase();
        let parts   =   lowerCaseResult.split(`i think it is `);
        if (parts.length > 1)  {
            guessedAnimal   =   parts[1];
        }
    }
    currentAnswer   =   guessedAnimal;
    console.log(currentAnswer);
}


function mousePressed() {
    currentAnimal   =   random(animals);
    let reverseAnimal   =   reverseString(currentAnimal);
    speechSynthesizer.speak(reverseAnimal);
}


/** Reversing the word*/
function reverseString(string)  {
    //Split the string into an array of characters
    let characters  =   string.split(``);
    //Reverse the array of characters
    let reverseCharacters   =   characters.reverse();
    //Join the array of characters
    let result  =   reverseCharacters.join(``);
    //Return result
    return result;
}