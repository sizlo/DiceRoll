module.exports = function() {
    this.isEmpty = function(theString) {
        return !theString || theString.length === 0
    }
}