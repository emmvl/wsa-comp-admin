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
    successResult: [],
    success: false,
    incidentId: null,
    incidentMediaIds: []

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

function getMediaIds(mediaArray) {

    let media = []

    for (let i in mediaArray) {
        media.push(mediaArray[i].id)
    }

    return media
}

function removeMediaId(mediaArr, mediaType) {

    let ids = null

    let index = mediaArr.findIndex((x) => x.mediaType === mediaType)

    if (index > -1) {
        ids = mediaArr[index].id
    }


    // for (let i in mediaArr) {

    //     if (mediaType == mediaArr[i].mediaType) {
    //         ids = mediaArr[i].id
    //         index = JSON.parse(i)
    //     }
    // }

    return { ids: ids, index: index }
}

function getMediaUrl(mediaArray, mediaType) {

    let url

    for (let i in mediaArray) {

        if (mediaType == mediaArray[i].mediaType) {
            url = mediaArray[i].mediaUrl
        }

    }
    return url

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
                state.incidentData['teamId'] = action.data

            } else if (action.key == "playerId") {
                let playerObj = getPlayerObj(action.data, state.playerResult)
                state.incidentData['player'] = playerObj
                state.incidentData['playerIds'] = action.data
                state.playerIds = action.data

            } else if (action.key === "isEdit") {
                let data = action.data


                state.mediaData = action.data

                state.incidentData['date'] = data.incidentTime
                state.incidentData['time'] = data.incidentTime
                state.incidentData['mnbMatchId'] = data.match.id
                state.incidentData['teamId'] = data.teamId
                state.incidentData['injury'] = data.incidentType.id
                state.incidentData['description'] = data.description
                state.incidentData['playerIds'] = getPlayerId(data.incidentPlayers)
                state.incidentData['addImages'] = isArrayNotEmpty(data.incidentMediaList) ? getMediaUrl(data.incidentMediaList, "image/png") : null
                state.incidentData['addVideo'] = isArrayNotEmpty(data.incidentMediaList) ? getMediaUrl(data.incidentMediaList, "video/mp4") : null
                state.playerIds = getPlayerId(data.incidentPlayers)
                state.incidentMediaIds = getMediaIds(data.incidentMediaList)
                state.incidentId = data.id



            } else if (action.key === "clearImage") {
                if (state.mediaData) {
                    state.incidentData['addImages'] = null

                    let imageId = removeMediaId(state.mediaData.incidentMediaList, "image/png")
                    let media_Array = state.incidentMediaIds
                    media_Array.splice(imageId.index, 1)
                    state.mediaData.incidentMediaList.splice(imageId.index, 1)
                    state.incidentMediaIds = media_Array

                }


            } else if (action.key === "clearVideo") {
                if (state.mediaData) {
                    state.incidentData['addVideo'] = null

                    let videoId = removeMediaId(state.mediaData.incidentMediaList, "video/mp4")

                    let media_Array = state.incidentMediaIds
                    media_Array.splice(videoId.index, 1)
                    state.mediaData.incidentMediaList.splice(videoId.index, 1)
                    state.incidentMediaIds = media_Array
                }




            } else if (action.key === "isAdd") {
                state.incidentData = []
                state.incidentMediaIds = []

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