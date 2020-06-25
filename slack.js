const request = require('request')

const slackUrl = 'https://slack.com/api'
const conversationMembersEndpoint = 'conversations.members'
const userGroupUsersEndpoint = 'usergroups.users.list'
const usersInfoEndpoint = 'users.info'
const token = process.env.SLACK_TOKEN

module.exports = {
    buildPrivateResponse: function(message) {
        return buildResponse(message, 'ephemeral')
    },

    buildPrivateResponseWithParsingUsernames: function(message) {
        return buildResponse(message, 'ephemeral', 'full')
    },

    buildPublicResponse: function(message) {
        return buildResponse(message, 'in_channel')
    },

    getConversationMembers: function(channelId, successCallback, errorCallback) {
        let url = `${slackUrl}/${conversationMembersEndpoint}?token=${token}&channel=${channelId}`
        get(url, (body) => successCallback(body.members), errorCallback)
    },

    getUsergroupMembers: function(usergroupId, successCallback, errorCallback) {
        let url = `${slackUrl}/${userGroupUsersEndpoint}?token=${token}&usergroup=${usergroupId}`
        get(url, (body) => successCallback(body.users), errorCallback)
    },

    getUserInfo: function(userId, successCallback, errorCallback) {
        let url = `${slackUrl}/${usersInfoEndpoint}?token=${token}&user=${userId}`
        get(url, (body) => successCallback(body.user), errorCallback)
    }
}

function buildResponse(message, responseType, parse = undefined) {
    return {
        'response_type': responseType,
        'text': message,
        'parse': parse
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
