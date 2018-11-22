const Biomes = {

    Scorched: {
        name: "Scorched",
        color: "rgb(85,85,85)",
        treePlacement: {
            enabled: false,
            minDistance: 0,
            maxDistance: 0
        }
    },
    Bare: {
        name: "Bare",
        color: "rgb(136,136,136)",
        treePlacement: {
            enabled: false,
            minDistance: 0,
            maxDistance: 0
        }
    },
    Tundra: {
        name: "Tundra",
        color: "rgb(187,187,170)",
        treePlacement: {
            enabled: false,
            minDistance: 0,
            maxDistance: 0
        }
    },
    Snow: {
        name: "Snow",
        color: "rgb(221,221,221)",
        treePlacement: {
            enabled: false,
            minDistance: 0,
            maxDistance: 0
        }
    },
    TemperateDesert: {
        name: "TemperateDesert",
        color: "rgb(201,210,155)",
        treePlacement: {
            enabled: true,
            minDistance: 8,
            maxDistance: 30
        }
    },
    Shrubland: {
        name: "Shrubland",
        color: "rgb(136,153,119)",
        treePlacement: {
            enabled: true,
            minDistance: 3,
            maxDistance: 7
        }
    },
    Taiga: {
        name: "Taiga",
        color: "rgb(153,170,119)",
        treePlacement: {
            enabled: true,
            minDistance: 6,
            maxDistance: 15
        }
    },
    GrassLand: {
        name: "GrassLand",
        color: "rgb(136,170,85)",
        treePlacement: {
            enabled: true,
            minDistance: 2,
            maxDistance: 8
        }
    },
    TemperateDeciduousForest: {
        name: "TemperateDeciduousForest",
        color: "rgb(103,148,89)",
        treePlacement: {
            enabled: true,
            minDistance: 3,
            maxDistance: 10
        }
    },
    TemperateRainForest: {
        name: "TemperateRainForest",
        color: "rgb(68,136,85)",
        treePlacement: {
            enabled: true,
            minDistance: 3,
            maxDistance: 8
        }
    },
    SubtropicalDesert: {
        name: "SubtropicalDesert",
        color: "rgb(210,185,139)",
        treePlacement: {
            enabled: true,
            minDistance: 10,
            maxDistance: 25
        }
    },
    TropicalSeasonalForest: {
        name: "TropicalSeasonalForest",
        color: "rgb(85,153,68)",
        treePlacement: {
            enabled: true,
            minDistance: 2,
            maxDistance: 10
        }
    },
    TropicalRainForest: {
        name: "TropicalRainForest",
        color: "rgb(51,119,85)",
        treePlacement: {
            enabled: true,
            minDistance: 2,
            maxDistance: 10
        }
    },
    Beach: {
        name: "Beach",
        color: "rgb(160,144,119)",
        treePlacement: {
            enabled: false,
            minDistance: 0,
            maxDistance: 0
        }
    },
    Sea: {
        name: "Sea",
        color: "rgb(68,68,122)",
        treePlacement: {
            enabled: false,
            minDistance: 0,
            maxDistance: 0
        }
    },
    DeepSea: {
        name: "DeepSea",
        color: "rgb(60,60,102)",
        treePlacement: {
            enabled: false,
            minDistance: 0,
            maxDistance: 0
        }
    }
}

module.exports = Biomes;