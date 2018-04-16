const https = require('https');
const Promise = require('bluebird');
const dataParameters = require('./dataParameters');

/**
 *  NodeJS Wrapper for PUBG API
 * - Kevin Mocorro | kevinmocorro.github@gmail.com | github.com/kmocorro
 * # Looking for collaboration and mentor :)
 * 
 */

class Chicken {
    /**
     * constructing objects
     */
    constructor(apiKey, options = {
        defaultShard: 'pc-as',
    }) {
        this.apiKey = apiKey;
        this.apiURL = 'api.playbattlegrounds.com';
        this.defaultShard = options.defaultShard || 'pc-as';
        this.endpoint = {
            players: 'players',
            matches: 'matches'
        };
        this.telemetry_URL = 'telemetry-cdn.playbattlegrounds.com';
    }

    /**
     * set api key
     */
    setAPIkey(newAPIkey){
        this.apiKey = newAPIkey;
    }

    /**
     * send request to api pubg server
     */
    requestDetails(shard, endpoint, params) {
        return new Promise((resolve, reject) => {

            let qParams = '';

            if (params) {
                Object.keys(params).forEach((key) => {
                    qParams += qParams.length ? `&${key}=${params[key]}` : `?${key}=${params[key]}`;
                });
            }

            const headers = {
                
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${this.apiKey}`

            };

            let resData = '';

            const apiRequest = https.get({
                hostname: this.apiURL,
                path: `/shards/${shard}/${endpoint}${qParams}`,
                headers

            }, (apiResponse) => {
                apiResponse.setEncoding('utf8');
                apiResponse.on('data', data => {
                    resData += data;
                });

                apiResponse.on('end', () => {
                    try {
                        const parsedRESdata = JSON.parse(resData);
                        if(apiResponse.statusCode >= 400){
                            return resolve(parsedRESdata); // if playerName is incorrect, send response not found.
                        }
                        return resolve(parsedRESdata);
                    } catch (err) {
                        return reject(err);
                    }
                });
                apiRequest.on('error', e => reject(e));
            });

        });

    }

    /**
     * 
     * @param {*} apiResponse_matches | matches ID separator
     */
    matchesLoop(apiResponse_matches){
        return new Promise((resolve, reject) => {

           
            let matches = [];
            //console.log(apiResponse_matches);

            for( let i = 0; i<apiResponse_matches.length; i++){
                

                matches.push({
                    link_match_ids: `${apiResponse_matches[i]}`
                });

                if(apiResponse_matches.length == matches.length){
                    
                    //console.log(matches);
                    
                    resolve(matches);
                }

            }

        });
    }

    /**
     * search player data using name map through the attributes json
     */
    searchPlayerNames(params, shard = this.defaultShard){
        return this.requestDetails(
            shard,
            this.endpoint.players,
            dataParameters.map(params, dataParameters.attributes.players)
        );
    }
    
    searchPlayerIds(params, shard = this.defaultShard){
        return this.requestDetails(
            shard,
            this.endpoint.players,
            dataParameters.map(params, dataParameters.attributes.players)
        );
    }

    /* search matches, matchesID is required first, before invoking this function, you need to invoke searchPlayerNames and get the matchID
    searchMatches(matchIds, shard = this.defaultShard){
        return this.requestDetails(
            shard,
            `${this.endpoint.matches}/${matchIds}`
        )
    }
    */

    searchTelemetry(matchIds, shard = this.defaultShard){
        return this.requestDetails(
            shard,
            `${this.endpoint.matches}/${matchIds}`
        ).then((apiResponse) => {
            return this.extractTelemetry(
                apiResponse
            ).then((giveMeTelemetryURL) => {
                return this.requestTelemetry(
                    giveMeTelemetryURL
                );
            });
        });
    }

    extractTelemetry(apiResponse_telemetry){
        return new Promise((resolve, reject) => {
            let assetData = apiResponse_telemetry.included;
            let giveMeTelemetryURL = [];

            for (let i=0; i< assetData.length; i += 1){
                let obj = assetData[i];

                if(obj.type == 'asset'){
                   // console.log(obj.attributes.URL);
                    giveMeTelemetryURL.push(obj.attributes.URL);
                }
                
            }

            if(!giveMeTelemetryURL.length){
                reject('No telemetry url found');
            } else {
                resolve(giveMeTelemetryURL);
            }

        });
    }

    requestTelemetry(URL){
        return new Promise((resolve, reject) => {
            const telePath = URL.toString().replace('https://' + this.telemetry_URL, '');
            const headers = {
                Accept: 'application/vnd.api+json',
            };
            let resData = '';
            
            const apiRequest = https.get({
                hostname: this.telemetry_URL,
                path: telePath,
                headers,
            }, (apiResponse) => {
                apiResponse.setEncoding('utf8');
                apiResponse.on('data', (data) => {
                    resData += data;
                    //console.log(resData);
                });

                apiResponse.on('end', () => {
                    try {
                        const parsedRESdata = JSON.parse(resData);
                        if(apiResponse.statusCode >= 400){
                            return resolve(parsedRESdata); // if matchID is incorrect, send response not found.
                        }
                        return resolve(parsedRESdata);
                    } catch (err) {
                        return reject(err);
                    }
                });
                apiRequest.on('error', e => reject(e));
                
            });

           // console.log(apiRequest);
            
        });
    }
    

    // extractMatches
    extractMatches(params, shard = this.defaultShard){
        return this.requestDetails(
            shard,
            this.endpoint.players,
            dataParameters.map(params, dataParameters.attributes.players)
        ).then((apiResponse) => {
            
            if(typeof apiResponse.data != 'undefined' && apiResponse.data != null && apiResponse.data.length > 0){

                let consolidated_matches = [];
            
                for(let i=0; i<apiResponse.data[0].relationships.matches.data.length;i++){

                    consolidated_matches.push(
                        apiResponse.data[0].relationships.matches.data[i].id
                    );

                    if(apiResponse.data[0].relationships.matches.data.length == consolidated_matches.length){

                        let apiResponse_matches = consolidated_matches;
                        
                        return this.matchesLoop(
                            apiResponse_matches
                        );

                    }

                }
            }

        });

    }

    /* extractTelemetry
    extractTelemetry(params, shard = this.defaultShard){
        return this.requestDetails(
            shard,
            this.endpoint.players,
            dataParameters.map(params, dataParameters.attributes.players)
        ).then((apiResponse) => {
            
            if(typeof apiResponse.data != 'undefined' && apiResponse.data != null && apiResponse.data.length > 0){

                let consolidated_matches = [];
            
                for(let i=0; i<apiResponse.data[0].relationships.matches.data.length;i++){

                    consolidated_matches.push(
                        apiResponse.data[0].relationships.matches.data[i].id
                    );

                    if(apiResponse.data[0].relationships.matches.data.length == consolidated_matches.length){

                        let apiResponse_matches = consolidated_matches;
                        
                        return this.matchesLoop(
                            apiResponse_matches
                        ).then((matches) => {
                            
                            return this.requestDetails(
                                shard,
                                `${matches[i].link_match_ids}`,
                            ).then((apiResponse) => {
                                
                                //console.log(apiResponse.data.relationships.assets.data[0].id);
                                let apiResponse_telemetry = apiResponse;

                                return this.findingTelemetry(
                                    apiResponse_telemetry
                                );

                            });    


                        });

                    }

                }
            }

        });
    }
    */

    
}

module.exports = Chicken;
