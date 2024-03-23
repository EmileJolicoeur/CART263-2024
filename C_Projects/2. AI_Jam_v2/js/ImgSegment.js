"use strict"

class   WorldMap    {
    constructor(options, windowW, windowH, image)   {
        this.w  =   windowW;
        this.h  =   windowH;


        this.kmeans;
        this.data   =   [];
    
        this.options    =   options;

        this.img    =   image;
        this.imgSizeY   =   200;
        this.imgSizeX   =   300;

        // this.environment    =   toVerify;

        this.colorDict  =   {
            0:  [88,  214, 141],    // Green
            1:  [202, 207, 210],    // Grey
            2:  [97,  106, 107],    // Dark Grey
            3:  [44,  62,  80 ],    // Navy
            4:  [249, 231, 159]     // Yellow
        }
    }


    /** */
    settingUp() {
        //  Resizing the Image:
        this.img.resize(this.imgSizeX, this.imgSizeY);
        this.img.loadPixels();

        for (let x = 0; x < this.imgSizeX; x++) {
            for (let y = 0; y < this.imgSizeY; y++) {
                this. off   =   (y*this.imgSizeX + x)*4;

                this.r  =   this.img.pixels[this.off];
                this.g  =   this.img.pixels[this.off + 1];
                this.b  =   this.img.pixels[this.off + 2];
                this.a  =   this.img.pixels[this.off + 3];

                console.log(this. r, this.g, this.b, this.a);

                this.data.push({
                    r,
                    g,
                    b
                });
                console.log(this.data);
            }
        }

        this.kmeans =   ml5.kmeans(this.data, options, this.modelReady);
    }

    modelReady()    {
        console.log(`ready`);

        this.dataset    =   kmeans.dataset;
        
        this.segmented  =   createImage(this.imgSizeX, this.imgSizeY);
        this.segmented.loadPixels();

        for (let x = 0; x < this.segmented.width; x++)  {
            for (let y = 0; y < this.segmented.height; y++) {
                this. off   =   (x*this.imgSizeY + y);
                this.c  =   this.colorDict[this.dataset[this.off].centroid];
                this.segmented.set(x, y, color(this.c));
            }
        }

        this.segmented.updatePixels();
        image(this.segmented, 0, 0, this.w, this.h);
    }
}