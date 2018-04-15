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
            
            /** 
            * shard parameters: 
            *
            * xbox-as - Asia
            * xbox-eu - Europe
            * xbox-na - North America
            * xbox-oc - Oceania
            * pc-krjp - Korea
            * pc-jp - Japan
            * pc-na - North America
            * pc-eu - Europe
            * pc-oc - Oceania
            * pc-kakao - Kakao
            * pc-sea - South East Asia
            * pc-sa - South and Central America
            * pc-as - Asia
            */
            
            api.searchPlayerNames({
                playerNames: requested_playerName
            }, 'pc-as').then((apiResponse) => {

                res.send(apiResponse);
                
                
            });

        });
    
    });
```

## Status
**v0.0.11** - API for searching IGN data only **searchPlayerName**

**v0.0.17** - added searching for player id **searchPlayerIds**, changed *searchPlayerName* to **searchPlayerNames**

**future version** - working on it to fully utilize PUBG API 
