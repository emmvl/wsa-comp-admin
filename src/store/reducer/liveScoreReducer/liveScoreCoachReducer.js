import ApiConstants from '../../../themes/apiConstants'
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
var coachObj = {
    id: null,
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    teams: null
}

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    coachdata: coachObj,
    teamId: null,
    teamResult: [],
    coachRadioBtn: 'new',
    coachesResult: [],
    mainCoachListResult: [],
    exsitingManagerId: null,
    loading: false,
    teams: null,
    onLoadSearch: false
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

function genrateTeamId(teamIdArr) {

    let teamId = []
    for (let i in teamIdArr) {
        teamId.push(teamIdArr[i].entityId)
    }

    return teamId

}

function liveScoreCoachState(state = initialState, action) {
    switch (action.type) {

        //LiveScore Coach List
        case ApiConstants.API_LIVE_SCORE_COACH_LIST_LOAD:
            return { ...state, onLoad: true };


        case ApiConstants.API_LIVE_SCORE_COACH_LIST_SUCCESS:
         
            return {
                ...state,
                onLoad: false,
                coachesResult: action.result,
                mainCoachListResult: action.result,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
           
            return {
                ...state,
                onLoad:false,
                loading:false,
                teamResult: action.result,

            };

        ////Update Coach Data
        case ApiConstants.API_LIVE_SCORE_UPDATE_COACH:
         
            if (action.key == 'teamId') {

                let teamObj = getTeamObj(action.data, state.teamResult)
                state.coachdata['teams'] = teamObj
            
                state.teamId = action.data

            } else if (action.key == 'coachRadioBtn') {
                state.coachRadioBtn = action.data
                state.exsitingManagerId = null
            } else if (action.key == "coachSearch") {

                state.exsitingManagerId = action.data
            } else if (action.key == 'isEditCoach') {
                state.onLoad = true
                state.coachdata.id = action.data.id
                state.coachdata.firstName = action.data.firstName
                state.coachdata.lastName = action.data.lastName
                state.coachdata.mobileNumber = action.data.mobileNumber
                state.coachdata.email = action.data.email
               
                let getTeamId = genrateTeamId(action.data.linkedEntity)
                state.teamId = getTeamId

                let coachTeamObj = getTeamObj(state.teamId, state.teamResult)
                state.coachdata['teams'] = coachTeamObj

                state.coachRadioBtn = 'new'

            } else if (action.key == 'isAddCoach') {
                state.coachdata = coachObj
                state.coachdata.id = null
                state.teamId = []
                state.coachRadioBtn = 'new'

            } else {
                state.coachdata[action.key] = action.data
            }

            return {
                ...state,
                onLoad: false,
                loading:false
            }

        ///******fail and error handling */

        case ApiConstants.API_LIVE_SCORE_COACH_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
                loading: false
            };
        case ApiConstants.API_LIVE_SCORE_COACH_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
                loading: false
            };

        ////Add Edit Coach
        //// Add Edit Manager
        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_COACH_LOAD:
            return { ...state, loading: true };

        case ApiConstants.API_LIVE_SCORE_ADD_EDIT_COACH_SUCCESS:
            return {
                loading:false,
                ...state,
            }

        ////Manager Search
        case ApiConstants.API_LIVESCORE_MANAGER_SEARCH_LOAD:
            return { ...state, onLoadSearch: true };

        case ApiConstants.API_LIVESCORE_MANAGER_SEARCH_SUCCESS:
            return {
                ...state,
                onLoadSearch: false,
                coachesResult: action.result,
                status: action.status,
            }

        case ApiConstants.CLEAR_LIVESCORE_MANAGER:

            return {
                ...state,
                coachesResult: state.mainCoachListResult
            }


        default:
            return state;
    }
}

export default liveScoreCoachState;