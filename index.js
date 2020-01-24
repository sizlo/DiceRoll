const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const diceRegex = /(\d+)d(\d+)/

app.get('/', (req, res) => res.send('Dice Roll'))

app.post('/command/', (req, res) => {
    let diceInput = req.query.text
    if (isValid(diceInput)) {
        let diceResults = roll(diceInput)
        res.send(diceResults.join(", "))
    } else {
        res.send('Input "' + diceInput + '" is not valid')
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
