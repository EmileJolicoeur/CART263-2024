/*  2. Phaser 3 Setup:  */
class Play extends Phaser.Scene {

    constructor()   {
        //  Tells the parent class the scene's key name:    Uses `play` as a way to refer to the class
        super({
            key:    `play`
        });
    }

    //  setup:
    create()    {
        //  creating a css style:
        let style   =   {
            fontFamily: 'Arial',
            fontSize: `40px`,
            color: '#00ff00'
        };
        //  Text:
        let gameTst   =   `Test`
        //  Display text:
        this.add.text(config.width/2, 100, gameTst, style);


        /** 3. Sprites: */
        this.wall   =   this.physics.add.image(100, 100, `wall`);
        this.wall.setTint(0xdd3333);

        this.avatar =   this.physics.add.sprite(200, 100, `avatar`);

        this.createAvatarAnimations();


        this.avatar.setVelocityX(100);
        this.avatar.setCollideWorldBounds(true);
        this.avatar.play(`av-idle`);

        this.cursors =   this.input.keyboard.createCursorKeys();
    }

    //  draw:
    update()    {
        console.log(`Play scene updated`);


        this.avatar.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.avatar.setVelocityX(-300);
        }
        else if (this.cursors.right.isDown)
        {
            this.avatar.setVelocityX(300);
        }

        if (this.cursors.up.isDown)
        {
            this.avatar.setVelocityY(-300);
        }
        else if (this.cursors.down.isDown)
        {
            this.avatar.setVelocityY(300);
        }

        if (this.avatar.body.velocity.x !== 0 || this.avatar.body.velocity.y !== 0) {
            this.avatar.play(`av-moving`, true);
        }
        else    {
            this.avatar.play(`av-idle`, true);
        }
    }

    /** 3. Sprites: */
    createAvatarAnimations()    {
        this.anims.create({
            key: `av-moving`,
            frames: this.anims.generateFrameNumbers(`avatar`, {
                start:  0,
                end:    7,
            }),

            frameRate:  30,
            //  Amount of times it will loop
            repeat: -1,
        });

        this.anims.create({
            key: `av-idle`,
            frames: this.anims.generateFrameNumbers(`avatar`, {
                start:  0,
                end:    0,
            }),

            frameRate:  30,
            //  Amount of times it will loop
            repeat: 0,
        });
    }
}