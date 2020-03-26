function getData(data) {

    var arr = []
    for (let i in data) {
        var object = this.getMatchDivisionObject(data[i])
        arr.push(object)
    }
    return arr
}

function getMatchDivisionObject(data) {
    return {
        id: data.id,
        name: data.name

    }
}

function getMatchViewData(data) {

    var arr = []
    for (let i in data) {
        var object = this.getMatchViewObject(data[i])
        arr.push(object)
    }
    return arr
}

function getMatchViewObject(data) {
    console.log(data, 'getMatchViewObject')
    return {
        playerId: data.playerId,
        photoUrl: data.photoUrl,
        name: data.firstName + " " + data.lastName,
        team: data.team.name,
        attended: data.played == 0 ? false : true
    }
}
module.exports = { getData, getMatchDivisionObject, getMatchViewData, getMatchViewObject }