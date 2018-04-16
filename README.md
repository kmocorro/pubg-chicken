# pubg-chicken [![npm 0.0.31](https://img.shields.io/badge/npm-v0.0.31-brightgreen.svg)](https://www.npmjs.com/package/pubg-chicken)

NodeJS Wrapper using the official PUBG API

## Installation

``` $ npm install pubg-chicken@latest --save```

## Usage
```javascript
let Chicken = require('pubg-chicken');
let api = new Chicken();
    api.setAPIkey('your-api-key-here');
```
### API Wrappers
API | Parameters
----|----
```.setAPIkey()``` | ``` .setAPIkey('your-api-key-here') ```
 ```.searchPlayerNames()``` | ```.searchPlayerName({ playerNames: <ign> }, <region-here> ).then((apiResponse) => {}) ``` 
 ```.searchPlayerIds() ``` | ```.searchPlayerIds({ playerIds: <acct-id> }, <region-here> ).then((apiResponse) => {}) ```
 ```.extractMatches()``` | ```.extractMatches({ playerNames: <player-ign> }, <region-here> ).then((matches) => {}) ```
 ```.searchTelemetry()``` | ```.searchTelemetry(<matchID-from-extractMatches()>, <region-here>).then((apiResponse) => {})```
 
For example :
```javascript
    // search player data using IGN name
    app.get('/name/:region/:playerName', function(req, res){
      
        api.searchPlayerNames({
            playerNames: req.params.playerName
            }, req.params.region).then((apiResponse) => { 
                // do something to apiResponse.
            });
      
    });
```

For example :
```javascript
    // search player data using ID
    app.get('/name/:region/:playerID', function(req, res){
      
        api.searchPlayerIds({
            playerIds: req.params.playerID
            }, req.params.region).then((apiResponse) => { 
                // do something to apiResponse.
            });
      
    });
```

For example :
```javascript
    // search player matches IDs using IGN name
    app.get('/matches/:region/:playerName', function(req, res){
      
        api.extractMatches({
            playerNames: req.params.playerName
            }, req.params.region).then((matches) => { 
                // do something to matches.
            });
      
    });
```

For example : (Note: To use **.searchTelemetry()**, you should have **matchID** results from **.extractMatches()** API)
```javascript
    // search player matches IDs using IGN name
    app.get('/telemetry/:region/:matchID', function(req, res){
      
        api.searchTelemetry(req.params.matchID, req.params.region).then((apiResponse) => { 
                // do something to apiResponse.
            });
      
    });
```


## Region parameters
Parameter region/platform | Location
------|------
xbox-as | Asia
xbox-eu | Europe
xbox-na | North America
xbox-oc | Oceania
pc-krjp | Korea
pc-jp | Japan
pc-na | North America
pc-eu | Europe
pc-oc | Oceania
pc-kakao | Kakao
pc-sea | South East Asia
pc-sa | South and Central America
pc-as | Asia

## Status
**v0.0.11** - API for searching IGN data only **searchPlayerName**

**v0.0.17** - Added searching for player id **searchPlayerIds**, changed *searchPlayerName* to **searchPlayerNames**

**v0.0.25** - Added searching for matches IDs **extractMatches**

**v0.0.30** - Added searching for Telemetry for each matchesID **searchTelemetry**

**future version** - working on it to fully utilize PUBG API 
- Kevin Mocorro | kevinmocorro.github@gmail.com


