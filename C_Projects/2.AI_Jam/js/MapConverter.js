/** */

"use strict"


//  Image variables:
let images  =   [];
let earth, mars, clown;
let img;
let imgLabel;


//  Toggle for noiseMap:
let filteredImg_1   =   false;
let filteredImg_2   =   false;
let filteredImg_3   =   false;
let filteredImg_4   =   false;

//  Particle variables:
var particles       =   [];
var particlesNB     =   500;
var noiseScaleA     =   50;
var noiseScaleB     =   200;
let noiseMap;

let noiseImg1;
let noiseImg2;


//  -   -   -   -   -   -   -   -   -   -   //


/** Called Before Start:    */
function preload()  {
    earth   =   loadImage(`assets/images/EarthMap.jpg`);
    mars    =   loadImage(`assets/images/MarsMap.jpg`);
    clown   =   loadImage(`assets/images/clown.png`);

    //  Adding images to array:
    images.push(earth, mars, clown);

    console.log(`Files Loaded`);
}


/** Called On Start:    */
function setup()    {
    createCanvas(floor(3*windowHeight/2), windowHeight);
    background(100);

    console.log(width, height);

    //  Image selector:
    img =   selectMap();
    // image(img, 0, 0, width, height);

    
    img.loadPixels();
    noiseMap    =   img;
    mapToNoise(noiseMap);


    /*  Noise map settings: */
    noiseDetail(1.75, 0);
    console.log(pixelDensity());

    //  Generating noise maps:
    let noisePlaceholder1;
    let noisePlaceholder2;
    
    noiseImg1   =   genNoiseImg(noisePlaceholder1, noiseScaleA);
    noiseImg2   =   genNoiseImg(noisePlaceholder2, noiseScaleB);

    blendNoise();

    //  Initiating particles:
    for (var i = 0; i < particlesNB; i++) {
        var particle    =   new Object();

        particle.pos    =   createVector(random(width), random(height));
        particles.push(particle);
    }

    
}

function blendNoise()   {
    //  Merge the noise map layers:
    noiseImg1.blend(
        noiseImg2, 
        0, 0, width, height, 
        0, 0, width, height, 
        // BLEND
        // DARKEST
        // LIGHTEST
        // DIFFERENCE
        // MULTIPLY
        EXCLUSION
        // SCREEN
        // REPLACE
        // OVERLAY
        // HARD_LIGHT
        // SOFT_LIGHT
        // DODGE
        // BURN
        // ADD
        // NORMAL
    );

    noiseImg1.filter(INVERT);

    noiseMap.blend(
        noiseImg1,
        0, 0, width, height,
        0, 0, width, height,
    //     BLEND
    //     // DARKEST
    //     // LIGHTEST
    //     // DIFFERENCE
    //     // MULTIPLY
    //     // EXCLUSION
    //     // SCREEN
    //     // REPLACE
    //     // OVERLAY
    //     // HARD_LIGHT
    //     // SOFT_LIGHT
    //     // DODGE
    //     // BURN
    //     // ADD
    //     // NORMAL
    );
}

/** On Every Frame: */
function draw() {
    // background(0, 0, 0);
    // image(img, 0, 0, width, height);

    // tint(255, 4);
    // image(noiseImg1, 0, 0, width, height);

    if (filteredImg_1 === true) {
        image(img, 0, 0, width, height);
    }
    if (filteredImg_2 === true) {
        image(noiseImg1, 0, 0, width, height);
    }
    if (filteredImg_3 === true) {
        image(noiseImg2, 0, 0, width, height);
    }
    if (filteredImg_4 === true) {
        image(noiseMap, 0, 0, width, height);
    }

    // background(10, 10, 30);

    // image(img, 0, 0, width, height);        //fill with transparent noise image
    //fill(0, 4);
    //rect(0, 0, width, height);

    strokeWeight(4);                        //particle size
    stroke(255, 0, 0);

    for (var i = 0; i < particles.length; i++)  {
        var p   =   particles[i];           //pick a particle
        p.pos.add(curl(p.pos.x/noiseScaleA, p.pos.y/noiseScaleA));
        point(p.pos.x, p.pos.y);
    }
}


//__________________________________________//


/** Selecting the reference image:  */
function selectMap()    {
    //  Selecting random image from list:
    let image   =   random(images);

    //  Debugging:__Logging map:
    if (image === earth)    {
        imgLabel    =   `Earth`;
    }
    else if (image === mars)    {
        imgLabel    =   `Mars`;
    }
    else if (image === clown)   {
        imgLabel    =   `Clown`;
    }
    console.log(`Map_Selected:\t` + imgLabel);
    
    return image;
}

/** Generating the segmented map:   */
function mapping()  {
    const dataset   =   kMeans.dataset;

    map =   createImage(imgSizeW, imgSizeH);
    map.loadPixels();

    for (let pixelX = 0; pixelX < map.width; pixelX++) {
        for (let pixelY = 0; pixelY < map.height; pixelY++)    {
            let off =   (pixelX*imgSizeH + pixelY);

            const c =   colorDict[dataset[off].centroid];
            map.set(pixelX, pixelY, color(c));
        }
    }

    map.updatePixels();
    // image(map, 0, 0, width, height);
}


/** Generates noise Image:  */
function genNoiseImg(noiseImg, noiseScale)  {
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
    
    return noiseImg;
}


/** */
function mapToNoise(picture)    {

    picture    =   createGraphics(width, height);
    picture.loadPixels();
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
    
    return noiseImg;
    picture.filter(THRESHOLD);
    picture.filter(BLUR, 1)

    // image(picture, 0, 0, width, height);

    return picture;
}


/** Get gradient vector:    */
function curl(x, y) {
    var EPSILON = random(0.001, 0.05);                    //sampling interval
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

    // return new createVector(cx, cy);     //gradient toward higher position
    return new createVector(cy, -cx);       //rotate 90deg
}


/** Debugging:  */
function keyPressed()   {
    if (event.keyCode === 49)   {
        filteredImg_1 =   !filteredImg_1;
        console.log(filteredImg_1);
    }
    if (event.keyCode === 50)   {
        filteredImg_2 =   !filteredImg_2;
        console.log(filteredImg_2);
    }
    if (event.keyCode === 51)   {
        filteredImg_3 =   !filteredImg_3;
        console.log(filteredImg_3);
    }
    if (event.keyCode === 52)   {
        filteredImg_3 =   !filteredImg_3;
        console.log(filteredImg_3);
    }
    
}



// .filter(THRESHOLD, BLUR)