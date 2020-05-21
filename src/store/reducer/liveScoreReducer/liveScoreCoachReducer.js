import ApiConstants from '../../../themes/apiConstants'

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
    coachesResult: []
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

function liveScoreCoachState(state = initialState, action) {
    switch (action.type) {

        //LiveScore Coach List
        case ApiConstants.API_LIVE_SCORE_COACH_LIST_LOAD:
            return { ...state, onLoad: true };


        case ApiConstants.API_LIVE_SCORE_COACH_LIST_SUCCESS:
            console.log(action.result, "result")
            return {
                ...state,
                onLoad: true,
                coachesResult: action.result,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
            console.log(action.result)
            return {
                ...state,
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
            } else {
                state.coachdata[action.key] = action.data
            }



            return {
                ...state,

            }

        ///******fail and error handling */

        case ApiConstants.API_LIVE_SCORE_COACH_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_COACH_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        default:
            return state;
    }
}

export default liveScoreCoachState;