

"use strict"


//  kmeans:
let clusters;
let data    =   [];
    //  kmeans options:
const options   =   {
    'k':    3,
    'maxIter':  4,
    'threshold':    0.5,
}

//  Image Selection:
let earthMap, earthMap2, marsMap, clown;
let images  =   [];
let selectedImg =   ``;
    //  Image & image size:
let img;
const imgSizeX  =   195;
const imgSizeY  =   130;

//  Segmented version of the image:
let segmented;
    //  Segment colors:
const colorDict =   {
    0:  [255, 255, 255],            // White
    2:  [191.25, 191.25, 191.25],   // Light Grey
    4:  [127.5, 127.5, 127.5],      // Grey
    3:  [63.75, 63.75, 63.75],      // Dark Grey
    1:  [0, 0, 0],                  // Black
}

const colorDict2    =   {
    1:  [88,  214, 141],    // Green
    0:  [202, 207, 210],    // Grey
    3:  [97,  106, 107],    // Dark Grey
    2:  [44,  62,  80 ],    // Navy
    4:  [249, 231, 159],    // Yellow
}

let debugPixels =   [];


//  Particle variables:
var particles       =   [];
var maxParticles    =   400;
var noiseScale      =   50;
let noiseImg;


/** Called Before Start:    */
function preload()  {
    //  Loading Images:
    earthMap    =   loadImage(`assets/images/earthMap_BnW.jpg`);    //images[0]
    earthMap2   =   loadImage(`assets/images/earthMap.jpg`);        //images[1]
    marsMap     =   loadImage(`assets/images/marsMap.jpg`);         //images[2]
    clown       =   loadImage(`assets/images/clown.jpg`);           //images[3]

    images.push(earthMap, earthMap2, marsMap, clown);

    console.log(`Image Loaded:  \n`, images);
}

    
/** Called On Start:    */
function setup()    {
    console.log(`{___Setup:  ____[Generating]`);

    //  Creating the canvas:
    createCanvas(floor(3*windowHeight/2), windowHeight);
    //  Background:
    background(10);
    //  Creating the map:
    bgSetup();
    //  Creating the particles:
    // particleSetup();

    //  Debugging:
    imgLog();
    console.log(
        `Canvas size: `, width, height,
        `\nImage Selected: `, selectedImg
    );
    console.log(`{___Setup:  ____[Complete]`);
}


//  -   -   -   -   -   -   -   -   -   -   //


/** Setting up the image background:    */
function bgSetup()  {
    console.log(`____Background Setup____[Generating]`);

    //  Selecting a random image from array:
    img =   images[1];
    // random(images);

    //  Resizing the image:
    img.resize(imgSizeX, imgSizeY);
    img.loadPixels();

    //  Assigning RGB & alpha values from the array of pixels to data[]:
    for (let x = 0; x < imgSizeX; x++) {
        for (let y = 0; y < imgSizeY; y++) {
            //  off =   (pixelHeight_In_Image * height_Of_Image + pixelWidth_In_Image)  [off = (150 * 200 + 150) = ]
            let off =   (y*imgSizeX + x)*4;

            //  Evaluating RGB & alpha values:
            const r =   img.pixels[off];
            const g =   img.pixels[off + 1];
            const b =   img.pixels[off + 2];
            const a =   img.pixels[off + 3];

            //  Pushing values in data[]:
            data.push({
                r,
                g,
                b
            });

            console.log(r, g, b, a);
        }
    }

    clusters    =   ml5.kmeans(data, options, mapSegmentation);
    // console.log(clusters);

    console.log(`____Background Setup____[Complete]`);
}
/** Creating the background image:  */
function mapSegmentation()  {
    console.log(`   >   Image Generation    [Generating]`);

    const dataset   =   clusters.dataset;

    //  Creating an image object:
    segmented   =   createImage(imgSizeX, imgSizeY);
    segmented.loadPixels();

    //  
    for (let x = 0; x < segmented.width; x++) {
        for (let y = 0; y < segmented.height; y++) {

            let off =   (x*imgSizeY + y);

            //  Setting color of the pixel:
            const c1 =   colorDict2[dataset[off].centroid];
            segmented.set(x, y, color(c1));

            console.log(
                `\noff:         `, off, 
                `\nDataset:     `, dataset[off], 
                `\nCentroid:    `, dataset[off].centroid, 
                `\nc:           `, c1
            );
        }
    }

    segmented.updatePixels();
    image(segmented, 0, 0, width, height);
    console.log(`   >   Image Generation    [Complete]`);
}


//  -   -   -   -   -   -   -   -   -   -   //


/** Setup:  */
function particleSetup()    {
    console.log(`____Particles   ____[Generating]`);

    noiseDetail(1, 0);
    console.log(pixelDensity());

    //  Generating noise Image:
    genNoiseImg();

    //  Initializing particles:
    for (var i = 0; i < maxParticles; i++)  {
        var particle    =   new Object();

        particle.pos    =   createVector(random(width), random(height));
        particles.push(particle);
    }

    console.log(`____Particles   ____[Complete]`);
}
/** */
function genNoiseImg()  {
    console.log(`   >   Noise Map   [Generating]`);
    // noiseImg    =   createGraphics(width, height);
    noiseImg    =   image(segmented, 0, 0, width, height);
    noiseImg.loadPixels();

    var widthD  =   width*pixelDensity();
    var heightD =   height*pixelDensity();

    //  For every pixel on the screen:
    for (var i = 0; i < widthD; i++)    {
        for (var j = 0; j < heightD; j++)   {
            var x   =   i/pixelDensity();
            var y   =   j/pixelDensity();

            let off =   (x*imgSizeY + y);

            //  Setting color of the pixel:
            const c =   colorDict[dataset[off].centroid];
            segmented.set(x, y, color(c));




            // var bright  =   pow(noise(x/noiseScale, y/noiseScale) - 0.3, 1/2)*400;
            // noiseImg.pixels[(i + j*widthD)*4]   =   bright;
            // noiseImg.pixels[(i + j*widthD)*4 + 1]   =   bright;
            // noiseImg.pixels[(i + j*widthD)*4 + 2]   =   bright;
            // noiseImg.pixels[(i + j*widthD)*4 + 3]   =   255;
        }
    }

    noiseImg.updatePixels();

    console.log(`   >   Noise Map   [Complete]`);
}

/** Draw:   */
function particlesDraw()    {
    // push();
    tint(255, random(4, 30));
    image(noiseImg, 0, 0);

    strokeWeight(4);
    stroke(255);
    // pop();

    for (var i = 0; i < particles.length; i++)  {
        var p   =   particles[i];
        p.pos.add(curl(p.pos.x/noiseScale, p.pos.y/noiseScale));
        point(p.pos.x, p.pos.y);
    }
}
/** */
function curl(x, y) {
    var EPSILON =   0.001;

    var n1  =   noise(x + EPSILON, y);
    var n2  =   noise(x - EPSILON, y);

    var cx  =   (n1 - n2)/(2*EPSILON);


    n1  =   noise(x, y + EPSILON);
    n2  =   noise(x, y - EPSILON);

    var cy  =   (n1 - n2)/(2*EPSILON);

    return new createVector(cy, -cx);
}


//  -   -   -   -   -   -   -   -   -   -   //


// /** Called Every Frame: */
function draw() {
    console.log(`Draw`);
    particlesDraw();
}


//  -   -   -   -   -   -   -   -   -   -   //


/** Debugging:  */
function imgLog()   {
    if (img === images[0])  {
        selectedImg =   `Earth`;
    }
    else if (img === images[1]) {
        selectedImg =   `Earth_Edit`;
    }
    else if (img === images[2]) {
        selectedImg =   `Mars`;
    }
    else if (img === images[3]) {
        selectedImg =   `Clown`;
    }
    console.log(selectedImg);
}