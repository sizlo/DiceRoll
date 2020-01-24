const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

const diceRegex = /^(\d+)d(\d+)$/

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/command/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    let diceInput = req.body.text
    if (isValid(diceInput)) {
        let diceResults = roll(diceInput)
        res.send(buildDiceResultResponse(diceInput, diceResults))
    } else {
        res.send(buildErrorResponse(diceInput))
    }
})

app.listen(port, () => console.log(`Dice Roll listening on port ${port}!`))

function isValid(diceInput) {
    return diceRegex.test(diceInput)
}

function roll(diceInput) {
    let matches = diceRegex.exec(diceInput)
    let numDice = parseInt(matches[1])
    let diceValue = parseInt(matches[2])
    let results = []
    for (let i = 0; i < numDice; i++) {
        results.push(generateRandomNumber(diceValue))
    }
    return results
}

function generateRandomNumber(diceValue) {
    return Math.floor(Math.random() * diceValue + 1);
}

function buildDiceResultResponse(diceInput, diceResults) {
    return `
        {
            "response_type": "in_channel",
            "text": "Rolling ${diceInput}... Results: ${diceResults.join(", ")}"
        }
    `
}

function buildErrorResponse(diceInput) {
    return `
        {
            "response_type": "ephemeral",
            "text": "Input ${diceInput} is not valid, give input in the form of XdY. E.g /roll 3d20"
        }
    `
}
