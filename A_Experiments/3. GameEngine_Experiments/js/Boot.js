/*  2. Phaser 3 Setup:  */
class Boot extends Phaser.Scene {

    constructor()   {
        //  Tells the parent class the scene's key name:    Uses `play` as a way to refer to the class
        super({
            key:    `boot`
        });
    }

    preload()   {
        //  Loading Img:
            //  load.image(key name, fileLocation);
        this.load.image('wall', 'assets/img/wall.png');


        /** 3. Sprites: */
        this.load.spritesheet(`avatar`, `assets/img/avatar.png`, {
            frameWidth: 32,
            frameHeight:    32,
            endFrame:   7,
        });


        //arrow function:
        this.load.on('complete', () =>  {
            this.scene.start(`play`);
        });

        
        console.log(`Files loaded`);
    }

    create()    {
        //  creating a css style:
        let style   =   {
            fontFamily: 'Arial',
            fontSize: `40px`,
            color: '#00ff00'
        };
        //  Text:
        let loadingStr   =   `Loading...`
        //  Display text:
        this.add.text(config.width/2, 100, loadingStr, style);

        //  Switches from `Boot` to `Play`:
        this.scene.start(`play`);
        console.log(`Play scene created`);
    }

    update()    {

    }
}