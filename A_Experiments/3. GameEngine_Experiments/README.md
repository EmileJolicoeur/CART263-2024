##  Game Engine Experiments:

# 1. Phaser.io: What is it?
Phaser 3.0 is the game engine we will be using.[^phaser3main]

* Categories of examples for game scripts[^phaser3examples]:
    >   make sure the resources you use are for phaser 3.0 (non-compatible with  previous versions)

    - Example:  GameObjects/Sprites:
        - Details to notice in script:
            > Javascript style is not in es6
            > No comments/explanations
            > Can't copy-paste the script (!phaserLibrary)
            > Structure is not as good as it could be

            - Funct. names are different from p5.js:
                > preload   =   preload;
                > create    =   setup;
                > update    =   draw;

        Still, it remains straightforward

* Learning resources[^phaser3learn]:
    - "Getting Started" & "Making your first Game"  =   Good way to test knowledge after examples

    - "API Docs":   (Good to learn)
        - Categories option bar
            GameObjects/Sprites:
        - Things to notice on page:
            > Members   =   Properties of class
            > Methods   =   "things you can do with a sprite"
            > Explanations/Descriptions are very technical

* Downloading the library:
    min.js  =   minified javascript
    or...
    Copy CDN link

[^phaser3main]  https://phaser.io/
[^phaser3examples]  https://labs.phaser.io/
[^phaser3learn] https://phaser.io/learn


# 2. Phaser 3 Setup:
Details phaser creators usually do:
- Main script:  script.js   =   main.js

- Scenes:
    > Each scene is it's own file
    > Each scene will be it's own class

    - class Play extends Phaser.Scene   {}:
        - "extends":
            Phaser method of switching between/display many scenes on the screen

- Methods:
    - "add.gameObj();"
        - add   =   Way to join all types of game objects under one function
            (if you need to create a game object)
        - gameObj   =   location where you choose what kind of game object it is


# 3. Sprites:
[^piskelapp] https://www.piskelapp.com/p/create/sprite


# 4. Physics & Movement:
- Types of physics:
    > Matter.js     [More sophisticated movement/collisions]
    > Multi
    - Arcade    (seen in this example)


# 5. Physics & Collisions: