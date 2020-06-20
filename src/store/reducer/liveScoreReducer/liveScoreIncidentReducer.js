import ApiConstants from '../../../themes/apiConstants'
import liveScoreModal from '../../objectModel/liveScoreModal'
var incidentObj = {
    date: "",
    time: "",
    mnbMatchId: "",
    teams: "",
    player: "",
    injury: "",
    claim: "",
    description: "",
    addImages: null,
    addVideo: null
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

function getPlayerObj(playerSelectesId, playerArray){
    let playerObj = []
    let obj = ''

    for(let i in playerArray){
        for(let j in playerSelectesId){
            if(playerSelectesId[j] == playerArray[i].id){
                obj = {
                    'name': playerArray[i].firstName + " " + playerArray[i].lastName,
                    'id' : playerArray[i].id
                }
                playerObj.push(obj)
                break;
            }
        }
    }
    return playerObj
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
                error: action.error,
                status: result.status

            }
        case ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            }
        // case ApiConstants.API_LIVE_SCORE_UPDATE_INCIDENT:
        //     let new_object = state.incidentData
        //     console.log(action,"tatata")

        //     if( action.key == "teamId" ){
        //            let teamObj = getTeamObj(action.data, state.teamResult)
        //            state.incidentData['teams'] = teamObj
        //     }else if (action.key = "playerId"){
        //         let playerObj = getPlayerObj(action.data,state.playerResult)
        //         state.incidentData['player'] = playerObj
        //     }else{
        //         state.incidentData[action.key] = action.data
        //     }

           
        //     return {
        //         ...state,

        //     }

        case ApiConstants.API_LIVE_SCORE_UPDATE_INCIDENT_DATA:
            console.log(action.key,action.data,"acacaac")
            if(action.key == "teamId"){
                let teamObj = getTeamObj(action.data, state.teamResult)
                state.incidentData['teams'] = teamObj
                console.log( state.incidentData, "hjfgjshgjhg")
            }else if(action.key == "playerId"){
                let playerObj = getPlayerObj(action.data,state.playerResult)
                state.incidentData['player'] = playerObj
            }else {
                state.incidentData[action.key] = action.data
                console.log( state.incidentData, "hjfgjshgjhg")
            }

        // case ApiConstants.API_LIVE_SCORE_CLEAR_INCIDENT:
        //     state.incidentData = JSON.parse(JSON.stringify(incidentObj))
        //     return {
        //         ...state,

        //     }

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
        
        default:
            return state
    }
}

export default liveScoreIncidentState