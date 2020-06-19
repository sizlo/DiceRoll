const slack = require('./slack.js')

module.exports = {
    doCommand: async function(req, res) {
        let channelId = req.body.channel_id
        slack.getConversationMembers(
            channelId, 
            (members) => pickRandomMember(members, res), 
            (error) => handleError(error, res)
        )
    }
}

function pickRandomMember(userIds, res) {
    let randomUserId = userIds[generateRandomIndexUpTo(userIds.length)]
    slack.getUserInfo(
        randomUserId,
        (userInfo) => handleUserInfoSuccess(userInfo, userIds, res),
        (error) => handleError(error, res)
    )
}

function handleError(error, res) {
    let suffix = ''
    if (error === 'channel_not_found') {
        suffix = '\nYou might need to add @dice_roll to the conversation'
    }
    res.send(slack.buildPrivateResponse(`Error: ${error}${suffix}`))
}

function generateRandomIndexUpTo(maxExclusive) {
    return Math.floor(Math.random() * maxExclusive)
}

function handleUserInfoSuccess(userInfo, userIds, res) {
    if (userInfo.is_bot) {
        let userIdsWithoutThisBot = userIds.filter((userId) => userId != userInfo.id)
        pickRandomMember(userIdsWithoutThisBot, res)
    } else {
        res.send(slack.buildPublicResponse(`Choosing random conversation member... :game_die: Result: @${userInfo.name}`))
    }
}
