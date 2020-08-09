function getPositionTrackListData(data, reporting) {

    var arr = []
    for (let i in data) {
        var object = this.getPositionTrackListObject(data[i], reporting)
        arr.push(object)
    }
    return arr
}

//// For All Games Column
function getPositionTrackListObject(data, reporting) {
    return {
        teamName: data.team.name,
        teamId: data.team.id,
        firstName: data.player.firstName,
        lastName: data.player.lastName,
        gs: getPointsValue(data.gs, data.play, reporting),
        ga: getPointsValue(data.ga, data.play, reporting),
        wa: getPointsValue(data.wa, data.play, reporting),
        c: getPointsValue(data.c, data.play, reporting),
        wd: getPointsValue(data.wd, data.play, reporting),
        gd: getPointsValue(data.gd, data.play, reporting),
        gk: getPointsValue(data.gk, data.play, reporting),
        i: getPointsValue(data.i, data.play, reporting),
        played: getPointsValue(data.play, data.playDuration, reporting),
        bench: getPointsValue(data.bench, data.playDuration, reporting),
        noPlay: reporting === 'PERCENT' ? ((JSON.parse(data.playDuration) - data.play) / JSON.parse(data.playDuration)) * 100 + "%" : (JSON.parse(data.bench) / JSON.parse(data.playDuration)),
    }
}

function getPositionTrackMatchListData(data, reporting) {

    var arr = []
    for (let i in data) {
        var object = this.getPositionTrackMatchListObject(data[i], reporting)
        arr.push(object)
    }
    return arr
}



//// For By Match Column
function getPositionTrackMatchListObject(data, reporting) {

    return {
        matchId: data.match.id,
        teamName: data.team.name,
        teamId: data.team.id,
        firstName: data.player.firstName,
        lastName: data.player.lastName,
        gs: getPointsValue(data.gs, data.play, reporting),
        ga: getPointsValue(data.ga, data.play, reporting),
        wa: getPointsValue(data.wa, data.play, reporting),
        c: getPointsValue(data.c, data.play, reporting),
        wd: getPointsValue(data.wd, data.play, reporting),
        gd: getPointsValue(data.gd, data.play, reporting),
        gk: getPointsValue(data.gk, data.play, reporting),
        i: getPointsValue(data.i, data.play, reporting),
        played: getPointsValue(data.play, data.playDuration, reporting),
        bench: getPointsValue(data.bench, data.playDuration, reporting),
        noPlay: reporting === 'PERCENT' ? ((JSON.parse(data.playDuration) - data.play) / JSON.parse(data.playDuration)) * 100 + "%" : (JSON.parse(data.bench) / JSON.parse(data.playDuration)),
    }
}

function getPointsValue(point_1, point_2, reporting) {


    let point1 = JSON.parse(point_1)
    let point2 = JSON.parse(point_2)

    let division = 0

    if (point2 == 0) {
        division = 0
    } else {
        division = point1 / point2
    }

    if (Number(point1) > 1) {
        return reporting === 'PERCENT' ? (division * 100).toFixed(2) + "%" : reporting === 'MINUTE' ? Number(point1) + ' mins' : Number(point1)
    } else {
        return reporting === 'PERCENT' ? (division * 100).toFixed(2) + "%" : reporting === 'MINUTE' ? Number(point1) : Number(point1)
    }



}


module.exports = { getPositionTrackListData, getPositionTrackListObject, getPositionTrackMatchListData, getPositionTrackMatchListObject }