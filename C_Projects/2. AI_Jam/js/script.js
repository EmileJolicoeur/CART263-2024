
"use strict"


//  BackgroundImage:
    //  List of images:
let marsImg     =   undefined;
let earthImg    =   undefined;
let clownImg    =   undefined;
let img   =   undefined;
let bgImg       =   [];
    //  Kmeans elements:
let kmeans;
let baseImg;
let data    =   [];

let imgSize =   undefined;

//  Color association:
const colorSelect   =   {
    0:  [88, 214, 141],     //  Green
    1:  [202, 207, 210],    //  Grey
    2:  [97, 106, 107],     //  D-Grey
    3:  [44, 62, 80],       //  Navy
    4:  [249, 231, 159],    //  Yellow
};
//  Options:
const options   =   {
    'k':    3,
    'maxIter':  4,
    'threshold':    0.5,
};


//  Particles array:
var particles   =   [];
//  Amount of particles:
var particlesNB  =   500;
//  Noise scale:
var noiseScale  =   100;
//  Image of the noise:
let noiseImg    =   undefined;


function preload()  {
    earthImg    =   loadImage(`assets/images/EarthMap.jpg`);
    // marsImg     =   loadImage(`assets/images/MarsMap.jpg`);
    // clownImg    =   loadImage(`assets/images/Clown.png`);
    // bgImg.push({marsImg, earthImg, clownImg});

    console.log(
        `Preload:___Complete:\n`,
        bgImg
    );
}

/** Called on 1st Frame:    */
function setup() {
    imgSize =   windowHeight;
    //  Setting up the background:
    img =   bgImg   // random(bgImg);
    chosenImg.resize(imgSize, imgSize);
    chosenImg.loadPixels();

    //  Getting the width in pixels and associating it with a color:
    for (let x = 0; x < imgSize; x++)   {
        //  Getting the height in pixels and associating it with a color:
        for (let y = 0; y < imgSize; y++)   {
            let off =   (y*imgSize + x)*4;
            const red   =   chosenImg.pixels[off];
            const green =   chosenImg.pixels[off + 1];
            const blue  =   chosenImg.pixels[off + 2];
            const a     =   chosenImg.pixels[off + 3];

            data.push({red, green, blue});
        }
    }

    kmeans  =   ml5.kmeans(data, options, modelReady);



    createCanvas(imgSize, imgSize);
    background(chosenImg);
    noiseDetail(1, 0);
    console.log(pixelDensity());
    //generate noise image
    genNoiseImg();
    image(noiseImg, 0, 0);
  
    //initialize particle
    for(var i = 0; i < particlesNB; i++){
        var particle    =   new Object();
    
        particle.pos    =   createVector(random(width), random(height));
        particles.push(particle);//add particle to particle list
    }

    console.log(chosenImg);
}

function modelReady()   {
    console.log(`ready`);
    const dataset   =   kmeans.dataset;

    let segmented   =   createImage(imgSize, imgSize);
    segmented.loadPixels();

    for (let x = 0; x < segmented.width; x++)   {
        for (let y = 0; y < segmented.height; y++)  {
            let off =   (x*imgSize + y);
            const c =   colorSelect[dataset[off].centroid];
            segmented.set(x, y, color(c));
        }
    }

    segmented.updatePixels();
    image(segmented, 0, 0, width, height);
}


//get gradient vector
function curl(x, y){
    var EPSILON = 0.001;//sampling interval
    //Find rate of change in X direction
    var n1  =   noise(x + EPSILON, y);
    var n2  =   noise(x - EPSILON, y);
    //Average to find approximate derivative
    var cx = (n1 - n2)/(2 * EPSILON);

    //Find rate of change in Y direction
    n1  =   noise(x, y + EPSILON);
    n2  =   noise(x, y - EPSILON);

    //Average to find approximate derivative
    var cy  =   (n1 - n2)/(2*EPSILON);

    //return new createVector(cx, cy);//gradient toward higher position
    return new createVector(cy, -cx);//rotate 90deg
}

/** Called on Every Frame:  */
function draw() {
    tint(255, 4);
    image(noiseImg, 0, 0);//fill with transparent noise image
    //fill(0, 4);
    //rect(0, 0, width, height);

    strokeWeight(4);//particle size
    stroke(255);


    for(var i = 0; i < particles.length; i++){
        var p   =   particles[i];//pick a particle
        p.pos.add(curl(p.pos.x/noiseScale, p.pos.y/noiseScale));
        point(p.pos.x, p.pos.y);
    }
}

function genNoiseImg(){
    noiseImg    =   createGraphics(width, height);
    noiseImg.loadPixels();
    var widthd  =   width*pixelDensity();
    var heightd =   height*pixelDensity();
    for(var i = 0; i<widthd; i++){
        for(var j = 0; j < heightd; j++){
            var x   =   i/pixelDensity();
            var y   =   j/pixelDensity();
            var bright = pow(noise(x/noiseScale, y/noiseScale)-0.3, 1/2.0)*400;
            noiseImg.pixels[(i + j*widthd)*4]   =   bright;
            noiseImg.pixels[(i + j*widthd)*4 + 1]   =   bright;
            noiseImg.pixels[(i + j*widthd)*4 + 2]   =   bright;
            noiseImg.pixels[(i + j*widthd)*4 + 3]   =   255;
        }
    }
    noiseImg.updatePixels();
}