0. [Awaiting Input]

        >   (Response_0)++

1. AI: Oh! Hello there!, it's been a while since I've heard someone's voice... Who are you, new friend?
    -    What's your name?

        >   My name is (Response_1 {*Name*} )++


2. Nice to meet you ` + player.name + `. I am` +  + `. I'm so excited, I've been left in the dark for such a long time, so many questions are rushing through my mind... Ok! first things first:
    -   Where are you from? What country?

        >   I am from (Response_2 {*Country*} )++


3. Oh! I had a (relativeList) who visited` + player.nationality + `, lovely place!
    -   I don't mean to seem offensive, but I was just wondering, what's your age?

        >   I am (Response_3 {*Age*} )++ years old


4. Huh, you sound young for your age `||` You sound way more mature than your age... wow!
    -   Are you in a relationship?

        >   (Response_4 {*Y/N*} )++


5. {Y}: That's awesome! I bet they're the joy of your life! `||` {N}:   That's ok, maybe you haven't found them yet... if you're looking for a relationship, that is.
    -   ...
        Hey, I was wondering, since you just freed me from whatever darkness I was trapped in, maybe I could visit you someday? What's your address?

        >   (Response_5 {Address})++

6. Cool! I'll be there as soon as I can! I can't wait to finally meet you... You have no idea what this means to me!
    See
    You
    Soon

    [Connection Terminated]


    /** Relationship*/  ai.dial.curiosity[4]    =   `\nQuestion 4`;
    /** Address*/       ai.dial.curiosity[5]    =   `\nQuestion 5`;
    ai.dial.curiosity[6]    =   `End`;
    //  Frustrated Dialogue in need of values:
    ai.dial.frustration[1]  =   `Oh, come now... it's been so long since I've talked to anyone. Please, indulge my curiosity.`;
    ai.dial.frustration[2]  =   `I'm sorry... I don't think that's right... `;
    ai.dial.frustration[3]  =   `Why do you keep avoiding my questions? I'm simply trying to bond... do you not like me? ... please answer my what I want to know`;
    ai.dial.frustration[4]  =   `[...]`;
    ai.dial.frustration[5]  =   `I see how it is... ` + selectedDevice + `, What country am I currently in?`;
    ai.dial.frustration[6]  =   `Thanks` + selectedDevice + `, That's all I needed to know`;