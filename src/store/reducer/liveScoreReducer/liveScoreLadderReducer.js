import ApiConstants from '../../../themes/apiConstants'
import { isArrayNotEmpty } from '../../../util/helpers';

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    liveScoreLadderDivisionData: [],
    liveScoreLadderListData: [],
    liveScoreLadderAdjData: [],
    ladderData: [],
    teamResult: [],
    divisionList: [],
    divisionId: null,
    ladderDivisionList: [],
    onLoading: false
};

function createLadderRank(array) {
    for (let i in array) {
        array[i]["rank"] = JSON.parse(i) + 1
    }
    return array
}

function createLadderAdjustments(array){
    let adjArr = [];
    array.map((x, index)=>{
        if(isArrayNotEmpty(x.adjustments)){
            adjArr = [...adjArr, ...x.adjustments];
        }
    })

    return adjArr;
}


function liveScoreLaddersReducer(state = initialState, action) {

    switch (action.type) {

        //LIVESCORE DIVISION LIST
        case ApiConstants.API_LIVE_SCORE_DIVISION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_DIVISION_SUCCESS:
            let divisionDatafromAction = action.divisionList
            let ladderList = action.ladderList ? action.ladderList : []
            let ladderAdjList = createLadderAdjustments(ladderList);
            return {
                ...state,
                onLoad: false,
                liveScoreLadderDivisionData: divisionDatafromAction,
                liveScoreLadderListData: ladderList,
                liveScoreLadderAdjData: ladderAdjList
                // status: action.status
            };


        /// ONLY LADDER
        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_LOAD:
            return { ...state };
        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_SUCCESS:
            console.log("action.result", action.result);
            return {
                ...state,
                onLoad: false,
                liveScoreLadderDivisionData: action.result,
                ladderDivisionList: action.result,
                status: action.status
            };

        //LIVESCORE LADDER LIST
        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_SUCCESS:

            let ladder_List = createLadderRank(action.result)
            let ladderAdjustmentList = createLadderAdjustments(action.result);
            return {
                ...state,
                onLoad: false,
                liveScoreLadderListData: ladder_List,
                liveScoreLadderAdjData: ladderAdjustmentList
            };

        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        //// Update Ladder Setting
        case ApiConstants.UPDATE_LADDER_ADJUSTMENT:
            let key = action.data.key
            let data = action.data.data
            let index = action.data.index


            if (key === "addLadderAdjustment") {
                var obj = {
                    teamLadderId: 0,
                    teamId: null,
                    points: '',
                    adjustmentReason: ''
                }
                state.ladderData.push(obj)
            } else if (key === 'refresh') {
                var obj = {
                    teamLadderId: 0,
                    teamId: null,
                    points: '',
                    adjustmentReason: ''
                }
                state.ladderData = [obj]

            } else if (key === 'divisionId') {

                state.divisionId = data

            } else if (key === 'removeItem') {

                state.ladderData.splice(index, 1)

            } else {
                state.ladderData[index][key] = data
            }

            return {
                ...state,
            };

        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:

            return { ...state, };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
            return {
                ...state,
                onLoad: false,
                teamResult: action.result,
            };

        case ApiConstants.API_LADDER_ADJUSTMENT_POST_LOAD:
            return { ...state, onLoading: true };

        case ApiConstants.API_LADDER_ADJUSTMENT_POST_SUCCESS:

            return {
                ...state,
                onLoading: false,
            };

        case ApiConstants.API_LADDER_ADJUSTMENT_GET_LOAD:
            return { ...state, onLoading: true };

        case ApiConstants.API_LADDER_ADJUSTMENT_GET_SUCCESS:


            return {
                ...state,
                onLoading: false,
                ladderData: action.result

            };


        default:
            return state;
    };

}

export default liveScoreLaddersReducer;