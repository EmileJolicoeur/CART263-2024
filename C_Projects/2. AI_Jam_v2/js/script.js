

"use strict"


//  kmeans:
let kmeans;
let data    =   [];
//  kmeans options:
const options   =   {
    'k':    3,
    'maxIter':  4,
    'threshold':    0.5,
}


//  Image Selection:
let earthMap, marsMap, clown;
let images  =   [];
let selectedImg =   ``;
//  Image & image size:
let img;
const imgSizeX  =   300;
const imgSizeY  =   200;
let segmented;

//  Segment colors:
const colorDict  =   {
    0:  [88,  214, 141],    // Green
    1:  [202, 207, 210],    // Grey
    2:  [97,  106, 107],    // Dark Grey
    3:  [44,  62,  80 ],    // Navy
    4:  [249, 231, 159]     // Yellow
}

//  Background:
let bg;


/** Called Before Start:    */
function preload()  {
    //  Loading Images:
    earthMap    =   loadImage(`assets/images/earthMap.jpg`);
    marsMap     =   loadImage(`assets/images/marsMap.jpg`);
    clown       =   loadImage(`assets/images/clown.jpg`);

    images.push(earthMap, marsMap, clown);

    console.log(`Image Loaded:  \n`, earthMap, marsMap, clown, `\n`, images);
}


/** Called On Start:    */
function setup()    {
    console.log(`[  Starting Setup...`);

    //  Creating the canvas:
    createCanvas(3*windowHeight/2, windowHeight);
    console.log(3*windowHeight/2, windowHeight);

    //  Background:
    background(10);
    //  Selecting a random image from array:
    img =   random(images);
    if (img === images[0])  {
        selectedImg =   `Earth`;
    }
    else if (img === images[1]) {
        selectedImg =   `Mars`;
    }
    else if (img === images[2]) {
        selectedImg =   `Clown`;
    }
    console.log(selectedImg);

    backgroundSetup();

    console.log(`...Setup Complete  ]`);
}

/** Setting up the image background:    */
function backgroundSetup()  {
    console.log(`>  Preparing Background    {...`);

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

            console.log(off + `:`, r, g, b, a);
        }
    }


    kmeans  =   ml5.kmeans(data, options, mapSegmentation);

    console.log(`>  ...}    Background Completed`);
}

/** Creating the background image:  */
function mapSegmentation()  {
    console.log(`   >   Creating Image  (...`);

    const dataset   =   kmeans.dataset;

    //  Creating an image object:
    segmented   =   createImage(imgSizeX, imgSizeY);
    segmented.loadPixels();

    //  
    for (let x = 0; x < segmented.width; x++) {
        for (let y = 0; y < segmented.height; y++) {

            let off =   (x*imgSizeY + y);

            //  Setting color of the pixel:
            const c =   colorDict[dataset[off].centroid];
            segmented.set(x, y, color(c));

            console.log(dataset[off].centroid, c);
        }
    }

    segmented.updatePixels();
    image(segmented, 0, 0, width, height);
    console.log(`   >   ...)   Image Created`);
}


// /** Called Every Frame: */
// function draw() {
    // kmeans  =   ml5.kmeans(data, options, mapSegmentation);
// }