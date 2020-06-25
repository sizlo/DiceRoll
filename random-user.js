const slack = require('./slack.js')
const utils = require('./utils.js')()

const usergroupRegex = /^<!subteam\^([^\|]+)(\|.+)?>$/

module.exports = {
    doCommand: async function(req, res) {
        let commandText = req.body.text
        if (isEmpty(commandText)) {
            pickRandomMemberFromCurrentConversation(req, res)
        } else {
            pickRandomMemberFromUsergroup(commandText, res)
        }
    }
}

function pickRandomMemberFromCurrentConversation(req, res) {
    let channelId = req.body.channel_id
    slack.getConversationMembers(
        channelId,
        (members) => pickRandomMember("current conversation", members, res),
        (error) => handleError(error, res)
    )
}

function pickRandomMemberFromUsergroup(commandText, res) {
    if (!isValid(commandText)) {
        res.send(slack.buildPrivateResponse(`Input was not valid, give input in the form of @someusergroup. E.g /randomuser @someusergroup`))
        return
    }

    let matches = usergroupRegex.exec(commandText)
    let usergroupId = matches[1]
    slack.getUsergroupMembers(
        usergroupId,
        (members) => pickRandomMember(`<!subteam^${usergroupId}>`, members, res),
        (error) => handleError(error, res)
    )
}

function isValid(commandText) {
    return usergroupRegex.test(commandText)
}

function pickRandomMember(source, userIds, res) {
    let randomUserId = userIds[generateRandomIndexUpTo(userIds.length)]
    slack.getUserInfo(
        randomUserId,
        (userInfo) => handleUserInfoSuccess(source, userInfo, userIds, res),
        (error) => handleError(error, res)
    )
}

function handleError(error, res) {
    let suffix = ''
    if (error === 'channel_not_found') {
        suffix = '\nYou might need to add @dice_roll to the conversation'
    }
    res.send(slack.buildPrivateResponseWithParsingUsernames(`Error: ${error}${suffix}`))
}

function generateRandomIndexUpTo(maxExclusive) {
    return Math.floor(Math.random() * maxExclusive)
}

function handleUserInfoSuccess(source, userInfo, userIds, res) {
    if (userInfo.is_bot) {
        let userIdsWithoutThisBot = userIds.filter((userId) => userId != userInfo.id)
        pickRandomMember(userIdsWithoutThisBot, res)
    } else {
        res.send(slack.buildPublicResponse(`Choosing random member from ${source}... :game_die: Result: <@${userInfo.id}>`))
    }
}
