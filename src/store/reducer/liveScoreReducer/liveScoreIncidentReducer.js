import ApiConstants from '../../../themes/apiConstants'
import liveScoreModal from '../../objectModel/liveScoreModal'
import moment from "moment";
import { isArrayNotEmpty } from "../../../util/helpers";

var incidentObj = {
    date: "",
    time: "",
    mnbMatchId: "",
    teamId: "",
    playerIds: [],
    injury: "",
    claim: "",
    description: "",
    addImages: null,
    addVideo: null,
    success: false
}

const initialState = {
    onLoad: false,
    status: 0,
    error: null,
    result: null,
    liveScoreIncidentResult: [],
    incidentData: incidentObj,
    teamResult: [],
    playerResult: [],
    loading: false,
    playerIds: [],
    incidentTypeResult: [],
    successResult: []

}


function getTeamObj(teamSelectId, teamArr) {

    let teamObj = []
    let obj = ''
    for (let i in teamArr) {

        for (let j in teamSelectId) {
            if (teamSelectId[j] == teamArr[i].id) {
                obj = {
                    "name": teamArr[i].name,
                    "id": teamArr[i].id
                }
                teamObj.push(obj)
                break;
            }
        }
    }
    return teamObj;
}

function getPlayerObj(playerSelectesId, playerArray) {
    let playerObj = []
    let obj = ''

    for (let i in playerArray) {
        for (let j in playerSelectesId) {
            if (playerSelectesId[j] == playerArray[i].id) {
                obj = {
                    'name': playerArray[i].firstName + " " + playerArray[i].lastName,
                    'id': playerArray[i].id
                }
                playerObj.push(obj)
                break;
            }
        }
    }
    return playerObj
}

function getPlayerId(playerArr) {

    let arr = []
    for (let i in playerArr) {
        arr.push(playerArr[i].player.id)
    }

    return arr
}

function liveScoreIncidentState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_LOAD:
            return { ...state, onLoad: true }

        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_SUCCESS:
            const result = action.result

            return {

                ...state,
                onLoad: false,
                liveScoreIncidentResult: result,
                status: action.status
            }

        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                loading: false,
                error: action.error,
                status: result.status

            }
        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                loading: false,
                status: action.status
            }

        case ApiConstants.API_LIVE_SCORE_UPDATE_INCIDENT_DATA:

            if (action.key == "teamId") {
                // let teamObj = getTeamObj(action.data, state.teamResult)  
                // state.incidentData['teams'] = teamObj
                state.incidentData['teamId'] = action.data


            } else if (action.key == "playerId") {
                let playerObj = getPlayerObj(action.data, state.playerResult)
                state.incidentData['player'] = playerObj
                state.incidentData['playerIds'] = action.data
                state.playerIds = action.data

            } else if (action.key === "isEdit") {
                state.incidentData['date'] = action.data.incidentTime
                state.incidentData['time'] = action.data.incidentTime
                state.incidentData['mnbMatchId'] = action.data.match.id
                state.incidentData['teamId'] = action.data.teamId
                state.incidentData['injury'] = action.data.incidentType.id
                state.incidentData['description'] = action.data.description
                state.incidentData['playerIds'] = getPlayerId(action.data.incidentPlayers)
                state.incidentData['addImages'] = isArrayNotEmpty(action.data.incidentMediaList) ? action.data.incidentMediaList[0] ? action.data.incidentMediaList[0].mediaUrl : null : null
                state.incidentData['addVideo'] = isArrayNotEmpty(action.data.incidentMediaList) ? action.data.incidentMediaList[1] ? action.data.incidentMediaList[1].mediaUrl : null : null

                state.playerIds = getPlayerId(action.data.incidentPlayers)
              
            } else if (action.key === "isAdd") {
                state.incidentData = []
                // state.playerIds = []

            } else {
                state.incidentData[action.key] = action.data


            }


        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:

            state.teamResult = action.result
            return {
                ...state,
                onLoad: false,
                teamResult: action.result,
                status: action.status
            }



        case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_PLAYER_LIST_SUCCESS:

            var playerListResult = liveScoreModal.getPlayerListData(action.result)

            return {
                ...state,
                onLoad: false,
                playerResult: playerListResult,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_INCIDENT_LOAD:
            return { ...state, loading: true }

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_INCIDENT_SUCCESS:

            return {

                ...state,
                loading: false,
                success: true,
                successResult: action.result,
                status: action.status
            }

        case ApiConstants.API_LIVE_SCORE_INCIDENT_TYPE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_INCIDENT_TYPE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                incidentTypeResult: action.result,
                status: action.status
            }

        default:
            return state
    }
}

export default liveScoreIncidentState