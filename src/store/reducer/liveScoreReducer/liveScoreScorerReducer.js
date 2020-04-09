import ApiConstants from '../../../themes/apiConstants'

let scorerObj = {
    id: null,
    firstName: "",
    lastName: "",
    emailAddress: "",
    contactNo: "",
    teams: []
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
    allTeamData: [],
    teamId: null,
    assignMatches: [],
    assignMatchListPage: 0,
    assignMatchTotalCount: "",
    searchScorer: [],
    onLoadSearch: false
}


function genrateTeamId(teamIdArr) {

    let teamId = []
    for (let i in teamIdArr) {
        teamId.push(teamIdArr[i].name)
    }

    return teamId

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
            }
        }
    }

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

        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
            let teamsArray = JSON.parse(JSON.stringify(action.result))
            state.allTeamData = JSON.parse(JSON.stringify(action.result))
            let teamObject = {
                name: "All Teams",
                id: null
            }

            state.allTeamData.unshift(teamObject)

            return {
                ...state,
                onLoad: false,
                teamResult: teamsArray,

            };


        case ApiConstants.API_LIVE_SCORE_UPDATE_SCORER:

            if (action.key == 'teamId') {
                let selectedTeams = getTeamObj(action.data, state.teamResult)

                state.scorerData['teams'] = selectedTeams
                state.teamId = action.data
            } else if (action.key == 'scorerRadioBtn') {
                state[action.key] = action.data
                state.existingScorerId = null
            } else if (action.key == 'isEditScorer') {

                state.scorerData = action.data
            } else if (action.key == 'isAddScorer') {
                scorerObj = {
                    firstName: "",
                    lastName: "",
                    emailAddress: "",
                    contactNo: "",
                    teams: []
                }
                state.scorerData = scorerObj
                state.teamId = null
                state.scorerRadioBtn = "new"
            } else if (action.key == 'scorerSearch') {
                state.existingScorerId = action.data
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
            return {
                ...state,
                onLoad: true
            }

        case ApiConstants.API_LIVESCORE_ASSIGN_CHANGE_STATUS_SUCCESS:

            let index = action.index
            state.assignMatches[index][action.scorerKey] = action.result

            return {
                ...state,
                onLoad: false,

            }

        case ApiConstants.API_LIVESCORE_UNASSIGN_STATUS_LOAD:
            return {
                ...state,
                onLoad: true
            }
        case ApiConstants.API_LIVESCORE_UNASSIGN_STATUS_SUCCESS:

            let indexValue = action.index
            state.assignMatches[indexValue][action.scorerKey] = null

            return {
                ...state,
                onLoad: false,

            }



        case ApiConstants.API_LIVESCORE_SCORER_SEARCH_LOAD:
            
            return {
                ...state,
                onLoadSearch: true
            }
        case ApiConstants.API_LIVESCORE_SCORER_SEARCH_SUCCESS:
            let searchdata = action.result
            return {
                ...state,
                onLoadSearch: false,
                searchScorer: searchdata
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