

function getLadderSettingData(data) {

    var goalArray = []
    for (let i in data) {
        var object = this.getLadderSettingObject(data[i])
        goalArray.push(object)
    }
    return goalArray
}

function getLadderData(data) {

    var goalArray = []
    for (let i in data) {
        var object = this.getObject(data[i])
        goalArray.push(object)
    }
    return goalArray
}

function getLadderSettingObject(data) {
    console.log(data, 'getLadderSettingObject')
    return {
        "id": data.id,
        "resultTypeId": data.code,
        "points": "",
    }
}

function getObject(data) {
    console.log(data, 'getObject')
    let { id } = JSON.parse(localStorage.getItem('LiveScoreCompetiton'))
    return {
        "competitionId": id,
        "resultTypeId": data.id,
        "points": "",
    }
}


module.exports = { getLadderSettingData, getLadderSettingObject, getLadderData, getObject }