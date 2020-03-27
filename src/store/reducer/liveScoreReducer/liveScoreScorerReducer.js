import ApiConstants from '../../../themes/apiConstants'

let scorerObj = {
    id: null,
    firstName: "firstName",
    lastName: "lastName",
    emailAddress: "emailAddress",
    contactNo: "contactNo",
    teams: null
}

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    scorerListResult: [],
    scorerListPage: 0,
    scorerListTotalCount: "",
    scorerData: scorerObj,
    scorerRadioBtn: 'new',
    existingScorerId: null,
    teamResult: [],
    teamId: null,
    assignMatches: [],
    assignMatchListPage: 0,
    assignMatchTotalCount: "",
}


function genrateTeamId(teamIdArr) {

    let teamId = []
    for (let i in teamIdArr) {
        teamId.push(teamIdArr[i].name)
    }

    return teamId

}


function getTeamObj(teamSelectId, teamArr) {
    console.log(teamSelectId, teamArr, "getTeamObj")
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
    console.log(teamObj)
    return teamObj;
}

function liveScoreScorerState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_SCORER_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_SCORER_LIST_SUCCESS:
            let scorerList = action.result

            // let teamData = getTeamData(scorerList.users)
            return {
                ...state,
                onLoad: false,
                status: action.status,
                scorerListResult: scorerList.users,
                scorerListCurrentPage: scorerList.page.currentPage,
                scorerListTotalCount: scorerList.page.totalCount
            }

        case ApiConstants.API_LIVE_SCORE_DIVISION_SUCCESS:
            console.log('API_LIVE_SCORE_DIVISION_SUCCESS******', action)
            return {
                ...state,
                onLoad: false,
                teamResult: action.result,

            };
        case ApiConstants.API_LIVE_SCORE_UPDATE_SCORER:

            if (action.key == 'teamId') {
                // console.log(action, 'API_LIVE_SCORE_UPDATE_SCORER')
                let selectedTeams = getTeamObj(action.data, state.teamResult)
                state.scorerData['teams'] = selectedTeams
                state.teamId = action.data

            } else if (action.key == 'scorerRadioBtn') {
                state[action.key] = action.data
                state.existingScorerId = null
            } else if (action.key == 'isEditScorer') {
                console.log(action.data, "actionnn")

                state.scorerData.id = action.data.id
                state.scorerData.firstName = action.data.firstName
                state.scorerData.lastName = action.data.lastName
                state.scorerData.mobileNumber = action.data.mobileNumber
                state.scorerData.email = action.data.email

                let getTeamId = genrateTeamId(action.data.teams)
                console.log(action.data, "idddddddddd")
                // state.teamId = action.data.id
                state.teamId = getTeamId
                let selectedTeams = getTeamObj(action.data, state.teamResult)
                state.scorerData['teams'] = selectedTeams

            } else if (action.key == 'isAddScorer') {
                state.managerData = scorerObj
                state.managerData.id = null
                state.teamId = null
                state.scorerRadioBtn = "new"

            } else {
                state.scorerData[action.key] = action.data
            }
            return {
                ...state,
                onLoad: false,
                status: action.status,

            }

        //// Add Edit Manager
        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_SCORER_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_SCORER_SUCCESS:
            return {
                ...state,
                //  onLoad: false
            }

        case ApiConstants.API_LIVESCORE_ASSIGN_MATCHES_LOAD:
            return {
                ...state,
                onLoad: true
            }

        case ApiConstants.API_LIVESCORE_ASSIGN_MATCHES_SUCCESS:

            return {
                ...state,
                onLoad: false,
                assignMatches: action.result.matches,
                assignMatchListPage: 0,
                assignMatchTotalCount: action.result.page.totalCount,
            }
        
        case ApiConstants.API_LIVESCORE_ASSIGN_CHANGE_STATUS_LOAD:
            return{
                ...state,
                onLoad : true
            }    

        case ApiConstants.API_LIVESCORE_ASSIGN_CHANGE_STATUS_SUCCESS:

            console.log( action.result)
            // let index = action.index
            // state.assignMatches[index].scorer1.rosterStatus = "YES"
            
            return {
                ...state,
                onLoad: false,
            
            }



        case ApiConstants.API_LIVE_SCORE_SCORER_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: action.error,
            }

        case ApiConstants.API_LIVE_SCORE_SCORER_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: action.error
            }

        default:
            return state;
    }
}

export default liveScoreScorerState;