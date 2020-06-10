const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const roll = require('./roll.js')
const slack = require('./slack.js')

const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/command/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')

    let command = req.body.command
    if (command === 'roll') {
        res.send(roll.doCommand(req, res))
    } else {
        res.send(slack.buildPrivateResponse(`Unknown command: ${command}`))
    }
})

app.listen(port, () => console.log(`Dice Roll listening on port ${port}!`))
