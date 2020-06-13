import ApiConstants from '../../../themes/apiConstants'
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../../util/helpers";


const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    liveScoreDivisionList: [],
    allTeamData: [],
    isLoaderActive: false,
    allDivisionData: []
};

function liveScoreMatchSheetState(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_GET_FIXTURE_COMP_LOAD:
            return {
                ...state,
                isLoaderActive: false
            }

        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_SUCCESS:
            let divisionArray = JSON.parse(JSON.stringify(action.result))
            state.allDivisionData = JSON.parse(JSON.stringify(action.result))
            let divisionObject = {
                name: "All",
                id: null
            }

            state.allDivisionData.unshift(divisionObject)
            state.isLoaderActive = false
            console.log(action.result, 'arrayMatchSheet', divisionArray)
            return {
                ...state,
                onLoad: false,
                liveScoreDivisionList: divisionArray,
                status: action.status
            };

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
            state.isLoaderActive = false
            return {
                ...state,
                onLoad: false,
                teamResult: teamsArray,
            };


        default:
            return state;
    }
}
export default liveScoreMatchSheetState;  
