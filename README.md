# pubg-chicken [![npm 0.0.5](https://img.shields.io/badge/npm-v0.0.11-brightgreen.svg)](https://www.npmjs.com/package/pubg-chicken)

NodeJS Wrapper using the official PUBG API

## Installation

$ npm install pubg-chicken --save

## Usage
```javascript
let Chicken = require('pubg-chicken');
let api = new Chicken();
```

For example :
```javascript
    // search player data using IGN name
    app.get('/:playerName', function(req, res){
      
      api.setAPIkey('your-api-key-here');
      
      function player(){
            return new Promise(function(resolve, reject){
                let requested_playerName = req.params.playerName;

                resolve(requested_playerName);
            });

        }

        player().then(function(requested_playerName){
            console.log(requested_playerName);

            api.searchPlayerName({
                playerNames: requested_playerName
            }).then((apiResponse) => {

                res.send(apiResponse);
                
                
            });

        });
    
    });
```

## Status
**v0.0.11** - API for searching IGN data only

**future version** - working on it to fully utilize PUBG API 
