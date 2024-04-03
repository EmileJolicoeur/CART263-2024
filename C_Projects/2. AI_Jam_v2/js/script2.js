"use strict"


let kmeans;
let data    =   [];
const options   =   {
    'k':            3,
    'maxIter':      4,
    'threshold':    0.7,
}

let earthMap, earthMap2, marsMap, clown;

let images      =   [];
let selectedImg =   ``;

let img;
const imgSizeX  =   195;
const imgSizeY  =   130;

let segmented;

let map;

const colorDict =   {
    0:  [202, 207, 210],    //  Grey
    1:  [44,  62,  80 ],    //  Navy
    2:  [88,  214, 141],    //  Green
    3:  [97,  106, 107],    //  Dark Grey
    4:  [249, 231, 159],    //  Yellow


}


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
    console.log(`Setup:  ____Start`);

    createCanvas(floor(3*windowHeight/2), windowHeight);
    background(10);

    // map =   new Map(displayMap());
    displayMap();

    imgLog();
    console.log(`Setup:  ____Completed`);
}


function displayMap()   {
    console.log(`>  Map...   ____Generating`);

    img =   random(images);
    img.resize(imgSizeX, imgSizeY);
    img.loadPixels();

    for (let pixelPosX = 0; pixelPosX < imgSizeX; pixelPosX++)  {
        for (let pixelPosY = 0; pixelPosY < imgSizeY; pixelPosY++)  {

            let off =   4*(pixelPosY*imgSizeX + pixelPosX);

            const r =   img.pixels[off];
            const g =   img.pixels[off +1];
            const b =   img.pixels[off +2];
            const a =   img.pixels[off +3];

            console.log(
                `off:               `, off,
                `\nPosition:        `, pixelPosX, pixelPosY,
                `\nColor Values:    `, r, g, b, a
            );

            data.push({
                r, g, b
            });
        }
    }

    kmeans  =   ml5.kmeans(data, options, genMap);

    console.log(`Map:   `,  selectedImg);
    console.log(`>  Map...   ____Completed`);
}


/** F*/
function genMap()   {
    console.log(`  >>DisplayedMap____Loading`);

    const dataset   =   kmeans.dataset;

    segmented   =   createImage(imgSizeX, imgSizeY);
    segmented.loadPixels();

    for (let pixelPosX = 0; pixelPosX < segmented.width; pixelPosX++)  {
        for (let pixelPosY = 0; pixelPosY < segmented.height; pixelPosY++)  {

            let off =   (pixelPosX*imgSizeY + pixelPosY);

            const colorSelect   =   colorDict[dataset[off].centroid];
            segmented.set(pixelPosX, pixelPosY, color(colorSelect));

            console.log(
                `off:               `,  off,
                `\nDataset: `,  dataset[off],
                `\nColor:           `,  colorSelect
            );
        }

    }

    segmented.updatePixels();
    image(segmented, 0, 0, width, height);

    console.log(`  >>DisplayedMap____Completed`);
}

function draw() {
    // console.log(`Draw:   ________`);

    // map;
}


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
