const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000

const diceRegex = /^(\d+)d(\d+)$/
const maxNumberOfDice = 100
const minNumberOfDice = 1
const maxNumberOfSides = 1000000000
const minNumberOfSides = 1

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/command/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')

    let diceInput = req.body.text

    if (isEmpty(diceInput)){
        diceInput = '1d6'
    }

    if (!isValid(diceInput)) {
        res.send(buildErrorResponse(`Input ${diceInput} is not valid, give input in the form of XdY. E.g /roll 3d20`))
        return
    }

    let matches = diceRegex.exec(diceInput)
    let numDice = parseInt(matches[1])
    let numSides = parseInt(matches[2])
    
    if (numDice > maxNumberOfDice) {
        res.send(buildErrorResponse(`The maximum number of dice to roll is ${maxNumberOfDice}`))
        return
    }

    if (numDice < minNumberOfDice) {
        res.send(buildErrorResponse(`The minimum number of dice to roll is ${minNumberOfDice}`))
        return
    }

    if (numSides > maxNumberOfSides) {
        res.send(buildErrorResponse(`The maximum number of sides is ${maxNumberOfSides}`))
        return
    }

    if (numSides < minNumberOfSides) {
        res.send(buildErrorResponse(`The minimum number of sides is ${minNumberOfSides}`))
        return
    }

    let diceResults = roll(numDice, numSides)
    res.send(buildDiceResultResponse(diceResults))
})

app.listen(port, () => console.log(`Dice Roll listening on port ${port}!`))

function isEmpty(theString) {
    return !theString || theString.length === 0
}

function isValid(diceInput) {
    return diceRegex.test(diceInput)
}

function roll(numDice, numSides) {
    let results = []
    for (let i = 0; i < numDice; i++) {
        results.push(generateRandomNumber(numSides))
    }
    return results
}

function generateRandomNumber(maxValue) {
    return Math.floor(Math.random() * maxValue + 1);
}

function buildErrorResponse(message) {
    return `
        {
            "response_type": "ephemeral",
            "text": "${message}"
        }
    `
}

function buildTooManyDiceResponse(diceInput) {
    return `
        {
            "response_type": "ephemeral",
            "text": "The maximum number of dice to roll is ${maxNumberOfDice}"
        }
    `
}

function buildDiceResultResponse(diceResults) {
    return `
        {
            "response_type": "in_channel",
            "text": "Rolling... :game_die: Results: ${diceResults.join(", ")}"
        }
    `
}
