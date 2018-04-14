const dataParameters = {
    relationships: {
        matches: {
            playerIds: 'filter[playerIds]',
            gameMode: 'filter[gameMode]',
            createdAtStart: 'filter[createdAt-start]',
            createdAtEnd: 'filter[createdAt-end]',
            sort: 'sort',
            limit: 'page[limit]',
            offset: 'page[offset]',
        },
        players: {
            playerIds: 'filter[playerIds]',
            playerNames: 'filter[playerNames]',
        },
    },

    relationships: (params, relationships) => {
        if(!params || !relationships){
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