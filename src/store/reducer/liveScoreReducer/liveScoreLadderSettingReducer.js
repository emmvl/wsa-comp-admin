import ApiConstants from '../../../themes/apiConstants'
import liveScoreLadderSettingModal from '../../objectModel/liveScoreLadderSettingModal'
import { stat } from 'fs';
import { getLiveScoreCompetiton } from '../../../util/sessionStorage';
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


function matchPostArray(id, data){

    let object = {
        status:false,
        result:null,
    }

    for(let i in data){
        if(data[i].resultTypeId == id){
            object = {
                status:true,
                result:data[i],
            }
            break
        }
       
    }

    return object
}


function setPostData(selectedData, matcheResults, compId) {
    let postArray = []
    let object = null
    for (let i in matcheResults) {
            let postResultObject= matchPostArray(matcheResults[i].id, selectedData)
            if(postResultObject.status == true){
                 object = {
                    competitionId: postResultObject.result.competitionId,
                    resultTypeId:  postResultObject.result.resultTypeId,
                    points:  postResultObject.result.points,
                }
            }else{
                 object = {
                    competitionId: compId,
                    resultTypeId:  matcheResults[i].id,
                    points:  0,
                }

            }

            postArray.push(object)
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
            const { id } = JSON.parse(getLiveScoreCompetiton())
            let data = getResultValues(action.result, state.matchResult)
            let post_Array = setPostData(action.result, state.matchResult, id)
            state.postData = post_Array
            return {
                ...state,
                onLoad: false,
                matchResult: data
            };

        //// Update Ladder Setting
        case ApiConstants.UPDATE_LADDER_SETTING:
            state.matchResult[action.index]['points'] = action.data
            state.postData[action.index]['points'] = action.data
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