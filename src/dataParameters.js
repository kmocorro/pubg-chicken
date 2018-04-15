const dataParameters = {
    attributes: {
        matches: {
            gameMode: 'filter[gameMode]',
        },
        players: {
            playerIds: 'filter[playerIds]',
            playerNames: 'filter[playerNames]',
        },
    },

    map: (params, map) => {
        if(!params || !map){
            return undefined;
        }

        const selectedFilters = {};

        Object.keys(params).forEach((key) => {
            if(params[key] !== undefined){
                selectedFilters[map[key]] = params[key];
            }
        });
        return Object.keys(selectedFilters).length ? selectedFilters : undefined;
    },
};

module.exports = dataParameters;