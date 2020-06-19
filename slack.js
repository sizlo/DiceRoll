const request = require('request')

const slackUrl = 'https://slack.com/api'
const conversationMembersEndpoint = 'conversations.members'
const usersInfoEndpoint = 'users.info'
const token = process.env.SLACK_TOKEN

module.exports = {
    buildPrivateResponse: function(message) {
        return buildResponse(message, 'ephemeral')
    },

    buildPublicResponse: function(message) {
        return buildResponse(message, 'in_channel')
    },

    getConversationMembers: function(channelId, successCallback, errorCallback) {
        let url = `${slackUrl}/${conversationMembersEndpoint}?token=${token}&channel=${channelId}`
        get(url, (body) => successCallback(body.members), errorCallback)
    },

    getUserInfo: function(userId, successCallback, errorCallback) {
        let url = `${slackUrl}/${usersInfoEndpoint}?token=${token}&user=${userId}`
        get(url, (body) => successCallback(body.user), errorCallback)
    }
}

function buildResponse(message, responseType) {
    return {
        'response_type': responseType,
        'text': message,
        'parse': 'full'
    }
}

function get(url, successCallback, errorCallback) {
    request(url, (error, response, bodyString) => {
        if (error) {
            errorCallback(error)
        } else if (response.statusCode != 200) {
            errorCallback(`Invalid status code <${response.statusCode}>`)
        } else {
            try {
                body = JSON.parse(bodyString)
                if (body.ok) {
                    successCallback(body)
                } else {
                    errorCallback(body.error)
                }
            } catch (error) {
                errorCallback(`Could not parse json: ${bodyString}`)
            }
        }
    })
}
