import ApiConstants from '../../../themes/apiConstants'
import { getLiveScoreCompetiton, getUmpireCompetitonData } from '../../../util/sessionStorage';

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
  positionList: [],
  positionData: [],
  positionDuration: null,
  updateDurationData: [],
  tickBox: false
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
  let competition = null

  if (getLiveScoreCompetiton()) {
    competition = JSON.parse(getLiveScoreCompetiton());
  } else {
    competition = JSON.parse(getUmpireCompetitonData());
  }

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

  let obj = {
    "id": null,
    "isPlaying": false,
    "isVisible": false,
    "name": null,
  }
  positionArray.push(obj)
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

function getSelectedPosition(playerId, postArray, positionArray) {
  let selectedPosArr = []

  for (let i in postArray) {
    if (postArray[i].playerId == playerId && postArray[i].positionId > 0) {
      selectedPosArr.push(postArray[i])
    }
  }

  let countPosition = []

  for (let i in positionArray) {
    for (let j in selectedPosArr) {
      if (positionArray[i].id == selectedPosArr[j].positionId && positionArray[i].isPlaying == true) {
        countPosition.push(positionArray[i])
      }
    }
  }

  return countPosition

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
        recordLoad: false,
      };

    case ApiConstants.API_LIVE_SCORE_PLAYER_MINUTE_TRACKING_LIST_SUCCESS:
      let trackResult = getFilterTrackData(action.result.data)
      state.trackResultData = trackResult
      // let postionArr = getPositionArry(action.result.data, state.positionList)
      // state.positionList = postionArr
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
      // let positionDuration = action.data.positionDuration
      let positionDuration = null
      let periodDuration = action.data.periodDuration
      let id = action.data.id

      let positionTrack = action.data.positionTrack
      let gameTimeTrack = action.data.gameTimeTrack
      let attndceRecrd = action.data.attndceRecrd
      let noOfSelectedPosition = null
      let obj = {}


      let userId = localStorage.getItem("userId");
      let findData
      if (id) {
        findData = trackDataRes.findIndex((att) => att.playerId === playerId && att.period === period && att.id === id);
      } else {
        findData = trackDataRes.findIndex((att) => att.playerId === playerId && att.period === period);
      }


      if (positionTrack && gameTimeTrack && attndceRecrd != "MINUTE") {
        let noOfSelectedPosition = getSelectedPosition(playerId, state.trackResultData, state.positionData)
        if (extraKey == 'positionId') {
          if (findData === -1) {
            let trackObj = {
              "id": null,
              "matchId": matchId,
              "teamId": playerdata.teamId,
              "playerId": playerdata.playerId,
              "period": period,
              "positionId": selectedData,
              "duration": state.playedCheckBox ? positionDuration : positionDuration / 2,
              "playedInPeriod": state.playedCheckBox,
              "playedEndPeriod": state.playedCheckBox,
              "playedFullPeriod": state.playedCheckBox,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": parseInt(userId),
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
            noOfSelectedPosition = getSelectedPosition(playerId, trackDataRes, state.positionData)
            positionDuration = noOfSelectedPosition.length > 0 ? periodDuration / noOfSelectedPosition.length : 0

            for (let i in trackDataRes) {
              if (trackDataRes[i].playerId == playerId && trackDataRes[i].playedFullPeriod == true) {
                trackDataRes[i]['duration'] = Math.round(positionDuration)
              } else if (trackDataRes[i].playerId == playerId && trackDataRes[i].playedFullPeriod == false) {
                trackDataRes[i]['duration'] = Math.round(positionDuration) / 2
              }
            }

          } else {
            state.trackResultData[findData][key] = selectedData
            noOfSelectedPosition = getSelectedPosition(playerId, state.trackResultData, state.positionData)
            positionDuration = noOfSelectedPosition.length > 0 ? periodDuration / noOfSelectedPosition.length : 0
            for (let i in state.trackResultData) {
              if (state.trackResultData[i].playerId == playerId && state.trackResultData[i].playedFullPeriod == true) {
                state.trackResultData[i]['duration'] = Math.round(positionDuration)
              } else if (state.trackResultData[i].playerId == playerId && state.trackResultData[i].playedFullPeriod == false) {
                state.trackResultData[i]['duration'] = Math.round(positionDuration) / 2
              }
            }
            state.trackResultData[findData]['updatedBy'] = userId
            state.trackResultData[findData]['createdBy'] = null
          }
        } else if (extraKey === 'checkBox') {
          state.playedCheckBox = selectedData
          state.tickBox = selectedData
          if (findData === -1) {
            let trackObj = {
              "id": null,
              "matchId": matchId,
              "teamId": playerdata.teamId,
              "playerId": playerdata.playerId,
              "period": period,
              "positionId": playerdata.attendance ? playerdata.attendance.positionId ? playerdata.attendance.positionId : 0 : 0,
              "duration": selectedData ? positionDuration : positionDuration / 2,
              "playedInPeriod": selectedData,
              "playedEndPeriod": selectedData,
              "playedFullPeriod": selectedData,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": parseInt(userId),
              "updatedBy": null
            }
            trackDataRes.push(trackObj)

            noOfSelectedPosition = getSelectedPosition(playerId, trackDataRes, state.positionData)
            positionDuration = noOfSelectedPosition.length > 0 ? periodDuration / noOfSelectedPosition.length : 0

            for (let i in trackDataRes) {
              if (trackDataRes[i].playerId == playerId) {
                trackDataRes[i]['duration'] = selectedData ? Math.round(positionDuration) : Math.round(positionDuration) / 2
              }
            }

          } else {
            noOfSelectedPosition = getSelectedPosition(playerId, trackDataRes, state.positionData)
            positionDuration = noOfSelectedPosition.length > 0 ? periodDuration / noOfSelectedPosition.length : 0

            for (let i in state.trackResultData) {
              if (state.trackResultData[i].playerId == playerId) {
                state.trackResultData[i]['duration'] = selectedData ? Math.round(positionDuration) : Math.round(positionDuration) / 2
              }
            }

            state.trackResultData[findData]['playedInPeriod'] = selectedData
            state.trackResultData[findData]['playedEndPeriod'] = selectedData
            state.trackResultData[findData]['playedFullPeriod'] = selectedData
            state.trackResultData[findData]['updatedBy'] = parseInt(userId)
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
            // "positionId": 0,
            "duration": selectedData ? periodDuration : 0,
            "playedInPeriod": selectedData,
            "playedEndPeriod": selectedData,
            "playedFullPeriod": selectedData,
            "periodDuration": periodDuration,
            "source": "Web",
            "createdBy": parseInt(userId),
            "updatedBy": null
          }
          trackDataRes.push(trackObj)
        } else {
          state.trackResultData[findData]['playedInPeriod'] = selectedData
          state.trackResultData[findData]['playedEndPeriod'] = selectedData
          state.trackResultData[findData]['playedFullPeriod'] = selectedData
          // state.trackResultData[findData]['positionId'] = 0
          state.trackResultData[findData]['duration'] = selectedData ? periodDuration : 0
          state.trackResultData[findData]['updatedBy'] = parseInt(userId)
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
              "duration": 0,
              "playedInPeriod": false,
              "playedEndPeriod": null,
              "playedFullPeriod": false,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": parseInt(userId),
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
          } else {
            state.trackResultData[findData][key] = selectedData
            // state.trackResultData[findData]['positionId'] = selectedData
            state.trackResultData[findData]['updatedBy'] = parseInt(userId)
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
              "playedFullPeriod": false,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": parseInt(userId),
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
          } else {
            state.trackResultData[findData]['playedInPeriod'] = selectedData > 0 ? true : false
            state.trackResultData[findData]['playedFullPeriod'] = selectedData == periodDuration ? true : false
            state.trackResultData[findData]['duration'] = selectedData
            state.trackResultData[findData]['updatedBy'] = parseInt(userId)
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
              // "duration": selectedData ? periodDuration : 0,
              "duration": periodDuration,
              "playedInPeriod": false,
              "playedEndPeriod": null,
              "playedFullPeriod": false,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": parseInt(userId),
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
          } else {
            state.trackResultData[findData][key] = selectedData
            // state.trackResultData[findData]['duration'] = selectedData ? periodDuration : 0
            state.trackResultData[findData]['duration'] = periodDuration
            state.trackResultData[findData]['updatedBy'] = parseInt(userId)
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
              // "playedFullPeriod": selectedData == periodDuration ? true : false,
              "playedFullPeriod": false,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": parseInt(userId),
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
          } else {
            state.trackResultData[findData]['playedInPeriod'] = selectedData > 0 ? true : false
            // state.trackResultData[findData]['playedFullPeriod'] = selectedData == periodDuration ? true : false
            state.trackResultData[findData]['playedFullPeriod'] = false
            state.trackResultData[findData]['duration'] = selectedData
            state.trackResultData[findData]['updatedBy'] = parseInt(userId)
            state.trackResultData[findData]['createdBy'] = null

          }
        }
      } else if (!positionTrack && !gameTimeTrack && attndceRecrd != "MINUTE") {

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
            "createdBy": parseInt(userId),
            "updatedBy": null
          }
          trackDataRes.push(trackObj)
        } else {
          state.trackResultData[findData]['playedInPeriod'] = selectedData
          state.trackResultData[findData]['playedEndPeriod'] = selectedData
          state.trackResultData[findData]['playedFullPeriod'] = selectedData
          state.trackResultData[findData]['duration'] = selectedData ? periodDuration : 0
          state.trackResultData[findData]['updatedBy'] = parseInt(userId)
          state.trackResultData[findData]['createdBy'] = null
        }
      } else if (positionTrack && !gameTimeTrack && attndceRecrd != "MINUTE") {

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
              "playedInPeriod": false,
              "playedEndPeriod": null,
              "playedFullPeriod": positionDuration === periodDuration ? true : false,
              "periodDuration": periodDuration,
              "source": "Web",
              "createdBy": parseInt(userId),
              "updatedBy": null
            }
            trackDataRes.push(trackObj)
            noOfSelectedPosition = getSelectedPosition(playerId, trackDataRes, state.positionData)
            positionDuration = noOfSelectedPosition.length > 0 ? periodDuration / noOfSelectedPosition.length : 0

            for (let i in trackDataRes) {
              if (trackDataRes[i].playerId == playerId) {
                trackDataRes[i]['duration'] = Math.round(positionDuration)
              }
            }
          } else {
            state.trackResultData[findData][key] = selectedData
            noOfSelectedPosition = getSelectedPosition(playerId, state.trackResultData, state.positionData)
            positionDuration = noOfSelectedPosition.length > 0 ? periodDuration / noOfSelectedPosition.length : 0
            for (let i in state.trackResultData) {
              if (state.trackResultData[i].playerId == playerId) {
                state.trackResultData[i]['duration'] = Math.round(positionDuration)
              }
            }
            state.trackResultData[findData]["playedInPeriod"] = false
            state.trackResultData[findData]["playedFullPeriod"] = positionDuration === periodDuration ? true : false
            state.trackResultData[findData]['updatedBy'] = parseInt(userId)
            state.trackResultData[findData]['createdBy'] = null
          }
        }
      }

      // console.log(action, 'API_LIVE_SCORE_UPDATE_PLAYER_MINUTE_RECORD', state.trackResultData)
      return {
        ...state,
      };

    case ApiConstants.API_LIVE_SCORE_GET_GAME_POSITION_LIST_SUCCESS:
      state.positionData = action.result
      let countIsPlayingValue = getcountIsPlayingValue(action.result)
      state.noOfPosition = countIsPlayingValue.length
      let filteredData = getFilterPositionData(action.result)

      return {
        ...state,
        onLoad: false,
        recordLoad: false,
        positionList: filteredData
      };


    default:
      return state;
  }
}

export default liveScorePlayerMinuteTrackingState;
