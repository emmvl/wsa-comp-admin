import ApiConstants from '../../../themes/apiConstants'
import { getLiveScoreCompetiton } from '../../../util/sessionStorage';

const initialState = {
  onLoad: false,
  recordLoad: false,
  trackingList: [],
  error: null,
  result: null,
  status: 0,
  trackResultData: null,
  playedCheckBox: false,
  noOfPosition: null,
  finalPostData: null,
  positionList: []
};

function getFilterTrackData(trackData) {
  let trackArr = []
  for (let i in trackData) {
    let trackObj = {
      "id": trackData[i].id,
      "matchId": trackData[i].matchId,
      "teamId": trackData[i].teamId,
      "playerId": trackData[i].playerId,
      "period": trackData[i].period,
      "positionId": trackData[i].positionId,
      "duration": trackData[i].duration,
      "playedInPeriod": trackData[i].playedInPeriod,
      "playedEndPeriod": trackData[i].playedEndPeriod,
      "playedFullPeriod": trackData[i].playedFullPeriod,
      "periodDuration": trackData[i].periodDuration,
      "source": "Web",
      "isPlaying": trackData[i].position ? trackData[i].position.isPlaying : false,
      "createdBy": trackData[i].createdBy,
      "updatedBy": trackData[i].updatedBy
    }
    trackArr.push(trackObj)
  }

  return trackArr
}

function getcountIsPlayingValue(data) {

  let arr = []
  for (let i in data) {
    if (data[i].isPlaying === true) {
      arr.push(data[i])
    }
  }
  return arr
}

function getFilterPositionData(positionData) {
  const competition = JSON.parse(getLiveScoreCompetiton());

  let positionArray = []
  if (competition.gameTimeTracking === false) {
    for (let i in positionData) {
      if (positionData[i].isPlaying === true && positionData[i].isVisible === true) {
        positionArray.push(positionData[i])
      }
    }
  } else {
    for (let i in positionData) {
      if (positionData[i].isVisible === true) {
        positionArray.push(positionData[i])
      }
    }
  }
  return positionArray
}

function getPositionArry(mainArr, positionArray) {
  let position = positionArray
  for (let i in mainArr) {
    for (let j in positionArray) {
      if (mainArr[i].positionId != positionArray[j].id) {
        let obj = {
          "id": null,
          "isPlaying": false,
          "isVisible": false,
          "name": null,
        }
        position.push(obj)
        break;
      }
    }
    break;
  }
  return position
}



function liveScorePlayerMinuteTrackingState(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_RECORD_LOAD:
      return {
        ...state,
        recordLoad: true,
        status: action.status
      };

    case ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_RECORD_SUCCESS:
      return {
        ...state,
        recordLoad: false,
        status: action.status,
        onLoad: false
      };

    case ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_TRACKING_LIST_LOAD:
      return {
        ...state,
        onLoad: true,
        status: action.status,
        recordLoad: false
      };

    case ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_TRACKING_LIST_SUCCESS:
      let trackResult = getFilterTrackData(action.result.data)
      state.trackResultData = trackResult
      let postionArr = getPositionArry(action.result.data, state.positionList)
      state.positionList = postionArr
      return {
        ...state,
        onLoad: false,
        trackingList: action.result.data,
        status: action.status,
        recordLoad: false
      };

    case ApiConstants.API_LIVE_SCORE_UPDATE_PLAYER_MINUTE_RECORD:

      let index = action.data.index
      let key = action.data.key
      let matchId = action.data.matchId
      let extraKey = action.data.extraKey
      let period = action.data.period
      let playerId = action.data.playerId
      let selectedData = action.data.selectedData
      let team = action.data.team
      let playerdata = action.data.playerdata
      let trackDataRes = state.trackResultData
      let positionDuration = action.data.positionDuration
      let periodDuration = action.data.periodDuration
      let id = action.data.id

      let positionTrack = action.data.positionTrack
      let gameTimeTrack = action.data.gameTimeTrack
      let attndceRecrd = action.data.attndceRecrd


      let userId = localStorage.getItem("userId");
      let findData
      if (id) {
        findData = trackDataRes.findIndex((att) => att.playerId === playerId && att.period === period && att.id === id);
      } else {
        findData = trackDataRes.findIndex((att) => att.playerId === playerId && att.period === period);
      }


      if (positionTrack && gameTimeTrack && attndceRecrd != "MINUTE") {

        if (extraKey == 'positionId') {
          if (findData === -1) {
            let trackObj = {
              "id": null,
              "matchId": matchId,
              "teamId": playerdata.teamId,
              "playerId": playerdata.playerId,
              "period": period,
              "positionId": selectedData,
              "duration": positionDuration,
              "playedInPeriod": state.playedCheckBox,
              "playedEndPeriod": state.playedCheckBox,
              "playedFullPeriod": state.playedCheckBox,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": userId,
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
          } else {
            state.trackResultData[findData][key] = selectedData
            state.trackResultData[findData]['updatedBy'] = userId
            state.trackResultData[findData]['createdBy'] = null
          }
        } else if (extraKey === 'checkBox') {
          if (findData === -1) {
            let trackObj = {
              "id": null,
              "matchId": matchId,
              "teamId": playerdata.teamId,
              "playerId": playerdata.playerId,
              "period": period,
              "positionId": playerdata.attendance ? playerdata.attendance.positionId ? playerdata.attendance.positionId : 0 : 0,
              "duration": positionDuration,
              "playedInPeriod": selectedData,
              "playedEndPeriod": selectedData,
              "playedFullPeriod": selectedData,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": userId,
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
          } else {


            state.trackResultData[findData]['playedInPeriod'] = selectedData
            state.trackResultData[findData]['playedEndPeriod'] = selectedData
            state.trackResultData[findData]['playedFullPeriod'] = selectedData
            state.trackResultData[findData]['updatedBy'] = userId
            state.trackResultData[findData]['createdBy'] = null
          }
        }
      } else if (!positionTrack && gameTimeTrack && attndceRecrd != "MINUTE") {

        if (findData === -1) {
          let trackObj = {
            "id": null,
            "matchId": matchId,
            "teamId": playerdata.teamId,
            "playerId": playerdata.playerId,
            "period": period,
            "positionId": playerdata.attendance ? playerdata.attendance.positionId ? playerdata.attendance.positionId : 0 : 0,
            "duration": selectedData ? periodDuration : 0,
            "playedInPeriod": selectedData,
            "playedEndPeriod": selectedData,
            "playedFullPeriod": selectedData,
            "periodDuration": periodDuration,
            "source": "Web",
            "createdBy": userId,
            "updatedBy": null
          }
          trackDataRes.push(trackObj)
        } else {
          state.trackResultData[findData]['playedInPeriod'] = selectedData
          state.trackResultData[findData]['playedEndPeriod'] = selectedData
          state.trackResultData[findData]['playedFullPeriod'] = selectedData
          state.trackResultData[findData]['duration'] = selectedData ? periodDuration : 0
          state.trackResultData[findData]['updatedBy'] = userId
          state.trackResultData[findData]['createdBy'] = null
        }
      } else if (positionTrack && !gameTimeTrack && attndceRecrd === "MINUTE") {

        if (extraKey == 'positionId') {
          if (findData === -1) {
            let trackObj = {
              "id": null,
              "matchId": matchId,
              "teamId": playerdata.teamId,
              "playerId": playerdata.playerId,
              "period": period,
              // "positionId": playerdata.attendance ? playerdata.attendance.positionId ? playerdata.attendance.positionId : 0 : 0,
              "positionId": selectedData,
              "duration": positionDuration,
              "playedInPeriod": false,
              "playedEndPeriod": null,
              "playedFullPeriod": false,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": userId,
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
          } else {
            state.trackResultData[findData][key] = selectedData
            // state.trackResultData[findData]['positionId'] = selectedData
            state.trackResultData[findData]['updatedBy'] = userId
            state.trackResultData[findData]['createdBy'] = null
          }
        } else if (extraKey === 'seconds') {
          if (findData === -1) {
            let trackObj = {
              "id": null,
              "matchId": matchId,
              "teamId": playerdata.teamId,
              "playerId": playerdata.playerId,
              "period": period,
              "positionId": playerdata.attendance ? playerdata.attendance.positionId ? playerdata.attendance.positionId : 0 : 0,
              "duration": selectedData,
              "playedInPeriod": selectedData > 0 ? true : false,
              "playedEndPeriod": null,
              "playedFullPeriod": selectedData == periodDuration ? true : false,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": userId,
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
          } else {
            state.trackResultData[findData]['playedInPeriod'] = selectedData > 0 ? true : false
            state.trackResultData[findData]['playedFullPeriod'] = selectedData == periodDuration ? true : false
            state.trackResultData[findData]['duration'] = selectedData
            state.trackResultData[findData]['updatedBy'] = userId
            state.trackResultData[findData]['createdBy'] = null

          }
        }
      } else if (!positionTrack && !gameTimeTrack && attndceRecrd === "MINUTE") {

        if (extraKey == 'playedFullPeriod') {
          if (findData === -1) {
            let trackObj = {
              "id": null,
              "matchId": matchId,
              "teamId": playerdata.teamId,
              "playerId": playerdata.playerId,
              "period": period,
              "positionId": playerdata.attendance ? playerdata.attendance.positionId ? playerdata.attendance.positionId : 0 : 0,
              "duration": selectedData ? periodDuration : 0,
              "playedInPeriod": false,
              "playedEndPeriod": null,
              "playedFullPeriod": false,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": userId,
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
          } else {
            state.trackResultData[findData][key] = selectedData
            state.trackResultData[findData]['duration'] = selectedData ? periodDuration : 0
            state.trackResultData[findData]['updatedBy'] = userId
            state.trackResultData[findData]['createdBy'] = null
          }
        } else if (extraKey === 'seconds') {
          if (findData === -1) {
            let trackObj = {
              "id": null,
              "matchId": matchId,
              "teamId": playerdata.teamId,
              "playerId": playerdata.playerId,
              "period": period,
              "positionId": playerdata.attendance ? playerdata.attendance.positionId ? playerdata.attendance.positionId : 0 : 0,
              "duration": selectedData,
              "playedInPeriod": selectedData > 0 ? true : false,
              "playedEndPeriod": null,
              "playedFullPeriod": selectedData == periodDuration ? true : false,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": userId,
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
          } else {
            state.trackResultData[findData]['playedInPeriod'] = selectedData > 0 ? true : false
            state.trackResultData[findData]['playedFullPeriod'] = selectedData == periodDuration ? true : false
            state.trackResultData[findData]['duration'] = selectedData
            state.trackResultData[findData]['updatedBy'] = userId
            state.trackResultData[findData]['createdBy'] = null

          }
        }
      } else if (!positionTrack && !gameTimeTrack && attndceRecrd == "MATCH") {

        if (findData === -1) {
          let trackObj = {
            "id": null,
            "matchId": matchId,
            "teamId": playerdata.teamId,
            "playerId": playerdata.playerId,
            "period": period,
            "positionId": playerdata.attendance ? playerdata.attendance.positionId ? playerdata.attendance.positionId : 0 : 0,
            "duration": selectedData ? periodDuration : 0,
            "playedInPeriod": selectedData,
            "playedEndPeriod": null,
            "playedFullPeriod": selectedData,
            "periodDuration": periodDuration,
            "source": "Web",
            "createdBy": userId,
            "updatedBy": null
          }
          trackDataRes.push(trackObj)
        } else {
          state.trackResultData[findData]['playedInPeriod'] = selectedData
          state.trackResultData[findData]['playedEndPeriod'] = selectedData
          state.trackResultData[findData]['playedFullPeriod'] = selectedData
          state.trackResultData[findData]['duration'] = selectedData ? periodDuration : 0
          state.trackResultData[findData]['updatedBy'] = userId
          state.trackResultData[findData]['createdBy'] = null
        }
      }

      // console.log(action, 'API_LIVE_SCORE_UPDATE_PLAYER_MINUTE_RECORD', state.trackResultData)
      return {
        ...state,
      };

    case ApiConstants.API_LIVE_SCORE_GET_GAME_POSITION_LIST_SUCCESS:

      let countIsPlayingValue = getcountIsPlayingValue(action.result)
      state.noOfPosition = countIsPlayingValue.length
      return {
        ...state,
        onLoad: false,
        recordLoad: false,
        positionList: action.result
      };


    default:
      return state;
  }
}

export default liveScorePlayerMinuteTrackingState;
