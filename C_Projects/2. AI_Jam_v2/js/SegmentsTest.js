"use strict"




let kmeans;
let data   =   [];

const options   =   {
    'k':    3,
    'maxIter':  4,
    'threshold':    0.5,
}

let img;
const imgSizeY   =   200;
const imgSizeX   =   300;


const colorDict  =   {
    0:  [88,  214, 141],    // Green
    1:  [202, 207, 210],    // Grey
    2:  [97,  106, 107],    // Dark Grey
    3:  [44,  62,  80 ],    // Navy
    4:  [249, 231, 159]     // Yellow
}


/** Preload:    */
function preload()  {
    img =   loadImage(`assets/images/Map_1.jpg`);
    console.log(`img loaded`)
}

/** Called Once On Start:   */
function setup()    {
    //  Creating the canvas:
    createCanvas(windowHeight, windowHeight);
    background(10);

    //  Resizing the image to 200px, 300px:
    img.resize(imgSizeX, imgSizeY);
    img.loadPixels();

    //  Gathering values from every pixel (red, green, blue, alpha):
    for (let x = 0; x < imgSizeX; x++) {
        for (let y = 0; y < imgSizeY; y++) {
            //  off =   (pixelHeight_In_Image * height_Of_Image + pixelWidth_In_Image)  [off = (150 * 200 + 150) = ]
            let off =   (y*imgSizeX + x) * 4;

            //  Evaluating RGB & alpha values:
            const r =   img.pixels[off];
            const g =   img.pixels[off + 1];
            const b =   img.pixels[off + 2];
            const a =   img.pixels[off + 3];

            console.log(r, g, b, a);
            //  Pushing values into data array of pixel:
            data.push({
                r,
                g,
                b
            });
        }
    }

    // call kmeans on the data
    kmeans  =   ml5.kmeans(data, options, modelReady)
}

function modelReady()   {
    console.log('ready!')
    const dataset   =   kmeans.dataset;

    let segmented   =   createImage(imgSizeX, imgSizeY);
    segmented.loadPixels();

    // redraw the image using the color dictionary above
    // use the .centroid value to apply the color

    //  For every pixel, set a RGB for the 
    for (let x = 0; x < segmented.width; x++) {
        for (let y = 0; y < segmented.height; y++) {
            let off =   (x*imgSizeY + y);
            const c =   colorDict[dataset[off].centroid];
            segmented.set(x, y, color(c));
        }
    }

    segmented.updatePixels();
    image(segmented, 0, 0, width, height);
}