# JavaScript Index Notation:    (JSON)
[https://www.youtube.com/watch?v=po6d5FY9jFI]
* To Know:
> prop.names: must have ""
>after final element of list:   != ,    (cannot have commas)


* Json files's 2 main basic uses:
1. json Object:     (archetypes.
json)
> Identified thanks to: {}
2. json Array:      (muppets.json)
    > Identified thanks to: []


Personal preferred use from teach.: json Obj (you can have arrays in objects)

* Gaining access:
    - make your own
    - Get it from internet:
        > Download the file
            > ++ Always accessible
        > Copy/paste the link to `raw` file
            > -- If !internet connection, it will not work
            > ++ There are online services/programs which will send dynamic JSON data on demand
                API --> JSON

* JSON:
    + Repository of useful data lists:
        > [https://github.com/dariusk/corpora]

* APIs:
    + Repository of useful APIs:
        > [https://github.com/15Dkatz/official_joke_api/blob/master/README.md]
    - APIs open in JSON (array) format


* Useful habits:
    > Have a description at the start of your json files    (tarot_interpretations.json)


* Applying your JSON files:   (script.js)
1. preload()
    > Instant
    > Easier
2. on Input {mousePressed() & tarotLoaded()}
    - Dynamic loading:
        > ex:   good or bad choice: [Good = choice1.json, Bad = choice2.json]
        > huge file:    loading files in bg while the game is played


* Loading differences:
    1. loadJSON()   used for object based JSONs
    2. for arrays;  See notes:
        > [https://pippinbarr.com/cart263/topics/data/json.html#the-json-format]


#   Cross-Origin Resource Sharing:  (CORS)
    CORS policy err.    --> Good luck

Personal opin. of teach.:   Find another source

    Use:    Security issue from browser in order to reduce chance of viruses?
