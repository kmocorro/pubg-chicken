const https = require('https');
const Promise = require('bluebird');
const dataParameters = require('./dataParameters');

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
     * search players 
     */

    searchPlayerName(params, shard = this.defaultShard){
        return this.requestDetails(
            shard,
            this.endpoint.players,
            dataParameters.map(params, dataParameters.relationships.players)
        );
    }

}

module.exports = Chicken;
