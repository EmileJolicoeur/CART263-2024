class   Cloud   {
    constructor(x, y)   {
        //  Position:
        this.pos    =   createVector(x, y);
        this.margin =   createVector(x + random(-(this.size/2), (this.size/2)), y + random(-(this.size/2), (this.size/2)));
        // this.margin =   random(-this.size/4, this.size/4);
        //  Dimensions:
        this.size   =   random(5, 30);

        //  Colors:
        this.color  =   {
            base:   random(100, 255),
            alpha:  undefined,//random(1, 15),
        };

        //  Amount:
        this.volume =   random(0, 5);


        this.cloud  =   [];
    }



    displayCloud()  {
        this.color.alpha  =   random(0.001, 5);
        // this.cloud
        noStroke()
        fill(this.color.base, this.color.base, this.color.base, this.color.alpha);
        ellipse(this.pos.x, this.pos.y, this.size, this.size);

        // ellipse(this.margin.x, this.margin.y, this.size, this.size);


    }

    wrapAround()    {
        if (this.pos.x < 0) {
            this.pos.x  =   width;
        }
        else if (this.pos.x < width)    {
            this.pos.x  =   0;
        }

        // this.pos.y  =   constrain(this.pos.y, 0, height);
    }
}