import ApiConstants from '../../../themes/apiConstants'
import liveScoreModal from '../../objectModel/liveScoreModal'
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
    liveScoreIncidentTotalCount: 1,
    liveScoreIncidentCurrentPage: 1,
    incidentData: incidentObj,
    teamResult: [],
    playerResult: [],
    loading: false,
    playerIds: [],
    incidentTypeResult: [],
    successResult: [],
    success: false,
    incidentId: null,
    incidentMediaIds: [],
    incidentMediaList: null,
    team1_Name: null,
    team2_Name: null,
    team1Id: null,
    team2Id: null,
    incidentListActionObject: null

}

// function getTeamObj(teamSelectId, teamArr) {
//     let teamObj = []
//     let obj = ''
//     for (let i in teamArr) {
//         for (let j in teamSelectId) {
//             if (teamSelectId[j] == teamArr[i].id) {
//                 obj = {
//                     name: teamArr[i].name,
//                     id: teamArr[i].id
//                 }
//                 teamObj.push(obj)
//                 break;
//             }
//         }
//     }
//     return teamObj;
// }

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
    return { ids: ids, index }
}

function getMediaUrl(mediaArray, mediaType) {
    let url
    for (let i in mediaArray) {
        var str = mediaArray[i].mediaType;
        var res = str.split("/", 1);
        if (mediaType == res[0]) {
            url = mediaArray[i].mediaUrl
        }
    }
    return url
}

function deleteSelectedMedia(mediaArray, mediaType) {
    for (let i in mediaArray) {
        let str = mediaArray[i].mediaType;
        let res = str.split("/", 1);
        if (mediaType == res[0]) {
            mediaArray.splice(i, 1)
            break;
        }
    }
    return mediaArray
}

function liveScoreIncidentState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_LOAD:
            return { ...state, onLoad: true, incidentListActionObject: action }

        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_SUCCESS:
            const result = action.result
            return {
                ...state,
                onLoad: false,
                liveScoreIncidentResult: isArrayNotEmpty(result.incidents) ? result.incidents : [],
                liveScoreIncidentTotalCount: result.page ? result.page.totalCount : 1,
                liveScoreIncidentCurrentPage: result.page ? result.page.currentPage : 1,
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

            if (action.key === "teamId") {
                state.incidentData['teamId'] = action.data

            } else if (action.key === "playerId") {
                let playerObj = getPlayerObj(action.data, state.playerResult)
                state.incidentData['player'] = playerObj
                state.incidentData['playerIds'] = action.data
                state.playerIds = action.data

            } else if (action.key === "isEdit") {
                let data = action.data
                state.playerResult = []
                state.incidentMediaList = data.incidentMediaList
                state.mediaData = action.data
                state.incidentData['date'] = data.incidentTime
                state.incidentData['time'] = data.incidentTime
                state.incidentData['mnbMatchId'] = data.match.id
                state.incidentData['teamId'] = data.teamId
                state.incidentData['injury'] = data.incidentType.id
                state.incidentData['description'] = data.description
                state.incidentData['playerIds'] = getPlayerId(data.incidentPlayers)
                state.incidentData['addImages'] = isArrayNotEmpty(data.incidentMediaList) ? getMediaUrl(data.incidentMediaList, "image") : null
                state.incidentData['addVideo'] = isArrayNotEmpty(data.incidentMediaList) ? getMediaUrl(data.incidentMediaList, "video") : null
                state.playerIds = getPlayerId(data.incidentPlayers)
                state.incidentMediaIds = getMediaIds(data.incidentMediaList)
                state.incidentId = data.id

                state.team1_Name = data.match.team1.name
                state.team1Id = data.match.team1.id
                state.team2_Name = data.match.team2.name
                state.team2Id = data.match.team2.id


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
                state.playerResult = []

            } else if (action.key === "incidentImage") {
                let array_Media_img = [...state.incidentMediaList]
                state.incidentData['addImages'] = null
                let imageMedia = deleteSelectedMedia(array_Media_img, 'image')
                state.incidentMediaList = imageMedia
                state.incidentMediaIds = getMediaIds(state.incidentMediaList)

            } else if (action.key === "incidentVideo") {
                let array_Media_vid = [...state.incidentMediaList]
                state.incidentData['addVideo'] = null
                let videoMedia = deleteSelectedMedia(array_Media_vid, 'video')
                state.incidentMediaList = videoMedia
                state.incidentMediaIds = getMediaIds(state.incidentMediaList)

            } else if (action.key === "clearPyarIds") {
                state.incidentData['playerIds'] = []
                state.playerIds = []
            } else {
                state.incidentData[action.key] = action.data
            }
            break;
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
                status: action.status,
                umpireKey: action.umpireKey
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

        case ApiConstants.ONCHANGE_COMPETITION_CLEAR_DATA_FROM_LIVESCORE:
            state.incidentListActionObject = null
            return { ...state, onLoad: false };

        default:
            return state
    }
}

export default liveScoreIncidentState
