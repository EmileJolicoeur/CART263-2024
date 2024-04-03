/** */

"use strict"


//__Variable Initialization:____________________________//


//  Image variables:
let images      =   [];             //Array of images
let earth, mars, clown;             //List of assets in images[]
let img;                            //Selected image from images[]
const imgSizeW  =   195;            //Resized image width for kmeans 
const imgSizeH  =   130;            //Resized image height for kmeans
let imgLabel;                       //Debugging:    Name/Label of img

//  Noise variables:
let noiseImg1;                      //1st noise map
let noiseImg2;                      //2nd noise map
let noiseMap;                       //Final noise map
let mapMask;                        //Outline of the selected image
let map;                            //Final segmented image

//Particle variables:
var particles   =   [];             //Array of particles
var particlesNB =   500;            //Total amount of particles
var noiseScaleA =   undefined;      //Size of the noise grain
var noiseScaleB =   undefined;      //Size of the noise grain

//  Kmeans variables:
let kMeans;                         //Kmeans object
let data        =   [];             //Kmeans dataset
const options   =   {               //Kmeans options
    'k':            3,
    'maxIter':      4,
    'threshold':    0.7,
}
const colorDict =   {               //Color values for every pixel in kmeans
    0:  [ 88, 214, 141],            // green
    1:  [ 44,  62,  80],            // navy
    2:  [249, 231, 159],            // yellow
}
// const noiseDict =   {
//     0:  [  0,   0,   0],         // white
//     1:  [128, 128, 128],         // grey
//     2:  [255, 255, 255],         // black
// }

//  Toggles:
let toggle_a    =   false;
let maxToggles  =   4;
let toggle      =   false;


//__Basic Functions:____________________________________//


/** Called Before Start:    */
function preload()  {
    //  Loading Maps:
    earth   =   loadImage(`assets/images/EarthMap.jpg`);
    mars    =   loadImage(`assets/images/MarsMap.jpg`);
    clown   =   loadImage(`assets/images/clown.png`);

    images.push(earth, mars, clown);
    console.log(`Preload Done`, images);
}


/** Called Once On Start:   */
function setup()    {
    createCanvas(floor((3*windowHeight/2)), windowHeight);
    background(10);

    //  Generating noise grain:
    noiseScaleA =   random(25, 75);
    noiseScaleB =   random(100, 300);
    console.log(`Scaled noise:\n\tA:\t${noiseScaleA}\n\tB:\t${noiseScaleB}`);
    
    //  Image selection:
    img =   random(images);
    img.resize(imgSizeW, imgSizeH);
    console.log(width, height, img);

    //  Kmeans:
    gatherData();
    kMeans      =   ml5.kmeans(data, options, mapping);

    //  Noise map settings:
    noiseDetail(1, 0);
    console.log(pixelDensity());

    //  Generating noise placeholders:
    let nMap1;
    let nMap2;
    img.resize(width, height);
    //  Generating cloud path:
    blendingNoise(nMap1, nMap2, img);
    //  Generating clouds:
    createParticles();

    console.log(`Setup Done`);
}


/** Called On Every Frame:  */
function draw() {
    // background(10, 10, 30);
    push();
    tint(255, 0, 0);
    // image(img, 0, 0, width, height);
    pop();
    
    if (toggle_a)   {
        image(mapMask, 0, 0, width, height);                  //fill with transparent noise image
    }

    displayParticles();
}


//__Kmeans Functions:___________________________________//


/** Setup:  Gathering map data: */
function gatherData()   {
    console.log(`\t- Gathering Kmeans Data:\t____[Start]`);
    //  Selecting the image from loaded elements:
    // debugLabels();
    //  Registering the color & alpha values of every pixel in an array:
    img.loadPixels();
    for (let pixX = 0; pixX < imgSizeW; pixX++) {
        for (let pixY = 0; pixY < imgSizeH; pixY++) {
            let off =   4*(pixY*imgSizeW + pixX);

            const r =   img.pixels[off];                    //0:    red value of pixel
            const g =   img.pixels[off + 1];                //1:    green value of pixel
            const b =   img.pixels[off + 2];                //2:    blue value of pixel
            const a =   img.pixels[off + 3];                //3:    alpha value of pixel

            data.push({
                r,
                g,
                b
            });
            console.log(`\t\t> Pixel_#{${pixX}, ${pixY}}:\t`, r, g, b, a);
        }
    }

    console.log(`\t- Gathering Kmeans Data\t____[Complete]`);
}


/** Setup/ml5.kmeans:   Generating the segmented map:   */
function mapping()  {
    console.log(`\t- Mapping Kmeans:\t____[Start]`);
    const dataset   =   kMeans.dataset;

    map =   createImage(imgSizeW, imgSizeH);
    map.loadPixels();
    console.log(map.width, map.height);

    for (let pixX = 0; pixX < map.width; pixX++) {
        for (let pixY = 0; pixY < map.height; pixY++)    {
            let off =   (pixX*imgSizeH + pixY);
            const c =   colorDict[dataset[off].centroid];
            map.set(pixX, pixY, color(c));

            console.log(`\t\t> Pixel_#{${pixX}, ${pixY}}:\t`, c, color(c));
        }
    }
    map.updatePixels();
    image(map, 0, 0, width, height);

    console.log(`\t- Mapping Kmeans:\t____[Complete]`);
}


//__Noise Map Functions:________________________________//


/** Generates a noise map from selected values: */
function mapNoiseImg(picture)    {
    noiseMap    =   createImage(width, height);
    noiseMap.loadPixels();
    // console.log(`\t- Generating Mask:\t____[Start]`);
    picture.filter(THRESHOLD);
    picture.filter(BLUR, 0.75)
    picture.filter(INVERT);

    noiseMap.updatePixels();

    image(noiseMap, 0, 0, width, height);

    console.log(`\t- Generating Mask:\t____[Complete]`);

    return noiseMap;
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
    console.log(`Particle Path Complete`);
    
    return noiseImg;
}

/** Blending the different noise maps into 1:   */
function blendingNoise(placeholder, placeholder2, picture)  {
    noiseImg1   =   genNoiseImg(placeholder, noiseScaleA);
    noiseImg2   =   genNoiseImg(placeholder2, noiseScaleB);
    mapMask     =   mapNoiseImg(picture);

    noiseImg1.blend(
        noiseImg2, 
        0, 0, width, height, 
        0, 0, width, height, 
        DARKEST
        // SCREEN
        // DODGE
    );

    // noiseImg1.filter(INVERT);
    noiseImg1.blend(
        mapMask, 
        0, 0, width, height, 
        0, 0, width, height, 
        // DARKEST
        // SCREEN
        DODGE
        // LIGHTEST
    );
}


//__Particle Functions:_________________________________//


/** Generate cloud particles:   */
function createParticles()  {
    //initialize particle
    for (var i = 0; i < particlesNB; i++) {
        var particle    =   new Cloud(random(width), random(height));

        particles.push(particle);           //add particle to particle list
    }
}

/** Drawing particles:  */
function displayParticles() {
    for (var i = 0; i < particles.length; i++)  {
        let p   =   particles[i];
        p.displayCloud();
        p.pos.add(curl(p.pos.x/noiseScaleA && p.pos.x/noiseScaleB, p.pos.y/noiseScaleA && p.pos.y/noiseScaleB));
    } 
}

/** Get gradient vector:    */
function curl(x, y) {
    var EPSILON = random(0.001, 0.05);                    //sampling interval
    var speed   =   random(0.01, 2);

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

    // console.log(x, y);

    // return new createVector(cx*speed, cy*speed);     //gradient toward higher position
    return new createVector(cy*speed, -cx*speed);       //rotate 90deg
}


//__Debugging:__________________________________________//


/** Toggling Layers:    */
function keyPressed()   {
    //  Creating toggles:
    if (event.keyCode === 32)   {
        toggle_a  =   !toggle_a;
        console.log(toggle_a);
    }
}

/** Announcing in log which image it is:    */
function imgLabels()    {
    //  Debugging:__Logging map:
    if (img === earth)  {
        imgLabel    =   `Earth`;
    }
    else if (img === mars)  {
        imgLabel    =   `Mars`;
    }
    else if (img === clown) {
        imgLabel    =   `Clown`;
    }
}