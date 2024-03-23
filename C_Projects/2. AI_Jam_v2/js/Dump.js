"use strict"


//TODO: with simple circle blur straight forward.

var particles = [];
var n = 500;//number of particle
var noiseScale = 50;//noise scale;

function setup() {
  
  createCanvas(500, 500);
  background(10);
  noiseDetail(1, 0);
  console.log(pixelDensity());
  //generate noise image
  genNoiseImg();
  image(noiseImg, 0, 0);
  
  //initialize particle
  for(var i=0; i<n; i++){
    var particle = new Object();
    
    particle.pos = createVector(random(width), random(height));
    particles.push(particle);//add particle to particle list
  }
}


//get gradient vector
function curl(x, y){
  var EPSILON = 0.001;//sampling interval
  //Find rate of change in X direction
  var n1 = noise(x + EPSILON, y);
  var n2 = noise(x - EPSILON, y);
  //Average to find approximate derivative
  var cx = (n1 - n2)/(2 * EPSILON);

  //Find rate of change in Y direction
  n1 = noise(x, y + EPSILON);
  n2 = noise(x, y - EPSILON);

  //Average to find approximate derivative
  var cy = (n1 - n2)/(2 * EPSILON);
  
  //return new createVector(cx, cy);//gradient toward higher position
  return new createVector(cy, -cx);//rotate 90deg
}

function draw() {
  tint(255, 4);
  image(noiseImg, 0, 0);//fill with transparent noise image
  //fill(0, 4);
  //rect(0, 0, width, height);
  
  strokeWeight(4);//particle size
  stroke(255);
  
  
  for(var i=0; i<particles.length; i++){
    var p = particles[i];//pick a particle
    p.pos.add(curl(p.pos.x/noiseScale, p.pos.y/noiseScale));
    point(p.pos.x, p.pos.y);
  }
}

function genNoiseImg(){
  noiseImg = createGraphics(width, height);
  noiseImg.loadPixels();
  var widthd = width*pixelDensity();
  var heightd = height*pixelDensity();
  for(var i=0; i<widthd; i++){
    for(var j=0; j<heightd; j++){
      var x = i/pixelDensity();
      var y = j/pixelDensity();
      var bright = pow(noise(x/noiseScale, y/noiseScale)-0.3, 1/2.0)*400;
      noiseImg.pixels[(i+j*widthd)*4] = bright;
      noiseImg.pixels[(i+j*widthd)*4+1] = bright;
      noiseImg.pixels[(i+j*widthd)*4+2] = bright;
      noiseImg.pixels[(i+j*widthd)*4+3] = 255;
    }
  }
  noiseImg.updatePixels();
}


// //  Wind particles:
// var wind    =   [];
// //  Number of particles:
// let noiseImg;
// var n   =   500;
// //  noise:
// var noiseScale  =   50;

// //Planet images:
// let planets =   []
// let world;

// /** */
// function preload() {
//     planets[0]    =   loadImage(`assets/images/EarthMap.jpg`);
//     planets[1]    =   loadImage(`assets/images/MarsMap.jpg`);
// }


// /** */
// function setup() {
//     createCanvas(4*windowHeight/3, windowHeight);
//     background(10, 50, 100);
//     //  Randomly select a planet model:
//     world   =   random(planets);

//     noiseDetail(2, 0);
//     console.log(pixelDensity());

//     //Generating noiseImage:
//     genNoiseImg();
//     image(noiseImg, 0, 0);

//     //Starting particles:
//     for (var i = 0; i < n; i++) {
//         var particle    =   new Cloud();

//         //Makes it rotate (L/R):
//         particle.pos    =   createVector(random(width)), random(height);
//         particles.push(particle);
//     }
// }


// /** Rotation orientation:   */
// function curl(x, y) {
//     //  Interval sampling:
//     var EPSILON =   0.001;

    
//     //  Finding rate of change: X
//     var n1  =   noise(x + EPSILON, y);
//     var n2  =   noise(x, y);
//     var n3  =   noise(x - EPSILON, y);

//     //Finding aprox. derivative:
//     var cx  =   (n1 - n3) / (3*EPSILON);

//     //  Finding rate of change: Y
//     var n1  =   noise(x, y + EPSILON);
//     var n2  =   noise(x, y);
//     var n3  =   noise(x, y - EPSILON);

//     //Finding aprox. derivative:
//     var cy  =   (n1 - n3) / (3*EPSILON);

//     //  Towards high pos.:
//     return new createVector(cx, cy);
//     //  Towards low pos.:
//     // return new createVector(cy, -cx);
// }


// /** */
// function draw() {

//     image(world, 0, 0, width, height);
//     console.log(world);

//     tint(125, 4);
//     image(noiseImg, 0, 0);
//     // fill(0, 4);
//     // rect(0, 0, width, height);

//     //  Particle size:
//     strokeWeight(4);
//     stroke(255);


//     //  Display Atmosphere:
//     for(var i = 0; i < particles.length; i++)   {
//         var p   =   particles[i];
//         p.pos.add(curl(p.pos.x/noiseScale, p.pos.y/noiseScale));
//         point(p.pos.x, p.pos.y);
//     }
// }



// /** Generating an image:    */
// function genNoiseImg()  {
//     noiseImg    =   createGraphics(width, height);
//     noiseImg.loadPixels();
//     var width_d =   width*pixelDensity();
//     var height_d    =   height*pixelDensity();

//     //  Creating the different layers of the world's height map:
//     for (var i = 0; i < width_d; i++)  {
//         for (var j = 0; j < height_d; j++)  {
//             var x   =   i/pixelDensity();
//             var y   =   j/pixelDensity();
//             var bright  =   pow(noise(x/noiseScale, y/noiseScale)-0.3, 1/2.0)*400;
//             noiseImg.pixels[(i+j*width_d)*4]    =   bright;
//             noiseImg.pixels[(i+j*width_d)*4+1]  =   bright;
//             noiseImg.pixels[(i+j*width_d)*4+2]  =   bright;
//             noiseImg.pixels[(i+j*width_d)*4+3]  =   255;
//         }
//         noiseImg.updatePixels();
//     }
// }