"use strict"

//  Particle variables:
var particles   =   [];
var particlesNB =   100;    //number of particle
var noiseScale  =   50;     //noise scale;

let noiseImg1;
let noiseImg2;
let img;

let toggle  =   false;


//  -   -   -   -   -   -   -   -   -   -   //


/** Called Before Start:    */
function preload()  {
    img =   loadImage(`assets/images/EarthMap.jpg`);
    console.log(`Preload Complete`);
}


/** Called Once On Start:   */
function setup()    {
    createCanvas(floor((3*windowHeight/2)), windowHeight);  //Creating Canvas
    background(10);                                         //Coloring Background
    
    console.log(width, height);                             //Logging Canvas Dimensions

    //  Noise map settings:
    noiseDetail(1, 0.75);                                   //
    console.log(pixelDensity());

    //generate noise image
    let noise1;
    let noise2;
    
    noiseImg1   =   genNoiseImg(noise1);
    noiseImg2   =   genNoiseImg(noise2);

    noiseImg1.filter(INVERT);
    noiseImg1.blend(
        noiseImg2, 
        0, 0, width, height, 
        0, 0, width, height, 
        DARKEST
        // SCREEN
        // DODGE
    );


    //initialize particle
    for (var i = 0; i < particlesNB; i++) {
        var particle    =   new Cloud(random(width), random(height));

        particles.push(particle);           //add particle to particle list
    }

    console.log(`Setup Complete`);
}
/** Generates noise Image:  */
function genNoiseImg(noiseImg)  {
    noiseImg    =   createGraphics(width, height);
    noiseImg.loadPixels();
    var widthd  =   width*pixelDensity();
    var heightd =   height*pixelDensity();
    for (var i = 0; i < widthd; i++)    {
        for (var j = 0; j < heightd; j++)   {
            var x   =   i/pixelDensity();
            var y   =   j/pixelDensity();
            var bright  =   pow(noise(x/noiseScale, y/noiseScale) - 0.3, 1/2.0)*400;
            noiseImg.pixels[(i + j*widthd)*4]   =   bright;
            noiseImg.pixels[(i + j*widthd)*4 + 1]   =   bright;
            noiseImg.pixels[(i + j*widthd)*4 + 2]   =   bright;
            noiseImg.pixels[(i + j*widthd)*4 + 3]   =   255;
        }
    }
    noiseImg.updatePixels();
    console.log(`Particle Path Complete`);
    
    return noiseImg;
}


/** Called On Every Frame:  */
function draw() {
    // background(10, 10, 30);
    image(img, 0, 0, width, height);

    if (toggle) {
        image(noiseImg1, 0, 0, width, height);                  //fill with transparent noise image
    }

    for (var i = 0; i < particles.length; i++)  {
        let p   =   particles[i];
        p.displayCloud();
        p.pos.add(curl(p.pos.x/noiseScale, p.pos.y/noiseScale));
        p.pos.x +=  40;
    } 
}



/** Get gradient vector:    */
function curl(x, y) {
    var EPSILON = random(0.001, 0.05);                    //sampling interval
    var speed   =   random(0.01, 4);

    //Find rate of change in X direction
    var n1  =   noise(x + EPSILON, y);
    var n2  =   noise(x - EPSILON, y);
    //Average to find approximate derivative
    var cx  =   (n1 - n2)/(2 * EPSILON);

    //Find rate of change in Y direction
    n1  =   noise(x, y + EPSILON);
    n2  =   noise(x, y - EPSILON);
    //Average to find approximate derivative
    var cy  =   (n1 - n2)/(2*EPSILON);

    console.log(x, y);

    // return new createVector(cx*speed, cy*speed);     //gradient toward higher position
    return new createVector(cy*speed, -cx*speed);       //rotate 90deg
}


//______________________________________________________//


/** Debugging:  */
function keyPressed()   {
    if (event.keyCode === 32)   {
        toggle  =   !toggle;
        console.log(toggle);
    }
}