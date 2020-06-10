const slack = require('./slack.js')

const diceRegex = /^(\d+)d(\d+)$/
const maxNumberOfDice = 100
const minNumberOfDice = 1
const maxNumberOfSides = 1000000000
const minNumberOfSides = 1

module.exports = {
    doCommand: function(req, res) {
        let diceInput = req.body.text

        if (isEmpty(diceInput)){
            diceInput = '1d6'
        }

        if (!isValid(diceInput)) {
            return slack.buildPrivateResponse(`Input was not valid, give input in the form of XdY. E.g /roll 3d20`)
        }

        let matches = diceRegex.exec(diceInput)
        let numDice = parseInt(matches[1])
        let numSides = parseInt(matches[2])
        
        if (numDice > maxNumberOfDice) {
            return slack.buildPrivateResponse(`The maximum number of dice to roll is ${maxNumberOfDice}`)
        }

        if (numDice < minNumberOfDice) {
            return slack.buildPrivateResponse(`The minimum number of dice to roll is ${minNumberOfDice}`)
        }

        if (numSides > maxNumberOfSides) {
            return slack.buildPrivateResponse(`The maximum number of sides is ${maxNumberOfSides}`)
        }

        if (numSides < minNumberOfSides) {
            return slack.buildPrivateResponse(`The minimum number of sides is ${minNumberOfSides}`)
        }

        let diceResults = rollAllDice(numDice, numSides)
        return slack.buildPublicResponse(`Rolling... :game_die: Result${diceResults.length === 1 ? "" : "s"}: ${diceResults.join(", ")}`)
    }
}

function isEmpty(theString) {
    return !theString || theString.length === 0
}

function isValid(diceInput) {
    return diceRegex.test(diceInput)
}

function rollAllDice(numDice, numSides) {
    let results = []
    for (let i = 0; i < numDice; i++) {
        results.push(generateRandomNumber(numSides))
    }
    return results
}

function generateRandomNumber(maxValue) {
    return Math.floor(Math.random() * maxValue + 1);
}
