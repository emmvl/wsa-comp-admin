import ApiConstants from '../../../themes/apiConstants'
import liveScoreLadderSettingModal from '../../objectModel/liveScoreLadderSettingModal'
import { stat } from 'fs';

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    matchResult: [],
    postData: [],
    loader: false
};

function getResultValues(data, matchData) {
    for (let i in matchData) {
        for (let j in data) {
            if (data[j].resultTypeId == matchData[i].id) {
                matchData[i]["points"] = data[j].points
                break;
            }
        }
    }
    return matchData
}

function setPostData(selectedData, matcheResults) {
    let postArray = []
    for (let i in matcheResults) {
        for (let j in selectedData) {
            if (matcheResults[i].id == selectedData[j].resultTypeId) {
                let object = {
                    competitionId: selectedData[j].competitionId,
                    resultTypeId: selectedData[j].resultTypeId,
                    points: selectedData[j].points,
                }
                postArray.push(object)
                break
            }

        }

    }

    return postArray
}



function liveScoreLadderSettingReducer(state = initialState, action) {

    switch (action.type) {

        //LIVESCORE Ladder Setting Get Match Result
        case ApiConstants.API_LADDER_SETTING_MATCH_RESULT_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LADDER_SETTING_MATCH_RESULT_SUCCESS:
            let matchResult = liveScoreLadderSettingModal.getLadderSettingData(action.result)
            let matchData = liveScoreLadderSettingModal.getLadderData(action.result)

            return {
                ...state,
                onLoad: false,
                matchResult: matchResult,
                postData: matchData
            };

        //LIVESCORE Ladder Setting Get Data
        case ApiConstants.API_LADDER_SETTING_GET_DATA_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LADDER_SETTING_GET_DATA_SUCCESS:
            let data = getResultValues(action.result, state.matchResult)
            let post_Array = setPostData(action.result, state.matchResult)
            state.postData = post_Array
            return {
                ...state,
                onLoad: false,
                matchResult: data
            };

        //// Update Ladder Setting
        case ApiConstants.UPDATE_LADDER_SETTING:
            state.matchResult[action.index]['points'] = action.data
            state.postData[action.index]['points'] = JSON.parse(action.data)
            return {
                ...state,
            };

        //LIVESCORE Ladder Setting Post Data
        case ApiConstants.API_LADDER_SETTING_POST_DATA_LOAD:
            return { ...state, loader: true };

        case ApiConstants.API_LADDER_SETTING_POST_DATA_SUCCESS:
            let receivePostData = getResultValues(action.getData, state.matchResult)
            return {
                ...state,
                loader: false,
                matchResult: receivePostData
            };

        case ApiConstants.API_LIVE_SCORE_LADDER_SETTING_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_LADDER_SETTING_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        default:
            return state;
    };

}

export default liveScoreLadderSettingReducer;