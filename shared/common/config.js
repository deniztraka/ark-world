module.exports = {
    server: {
        port: 5000,
        serverProcessFrequency: 1 / 10,
        maxSubSteps: 10,
        positionAndRotationUpdateFrequencyFromSeconds: 1 / 10,
        quePositionAndRotationDataFrequencyFromSeconds: 1 / 30,
        zoneSize: {
            width: 100,
            height: 100
        },
        vicinityUpdate: true,
        logLevel: 1
    },
    game: {
        bounds: {
            width: 1920,
            height: 1920
        }
    }
}