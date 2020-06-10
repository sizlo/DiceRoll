module.exports = {
    buildPrivateResponse: function(message) {
        return {
            'response_type': 'ephemeral',
            'text': `${message}`
        }
    },

    buildPublicResponse: function(message) {
        return {
            'response_type': 'in_channel',
            'text': `${message}`
        }
    }
}
