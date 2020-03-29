import { put, call } from '../../../../node_modules/redux-saga/effects';
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import ApiConstants from '../../../themes/apiConstants';
import { message } from "antd";
import history from "../../../util/history";
function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_SCORER_LIST_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_SCORER_LIST_ERROR,
        error: error,
        status: error.status,
    });
  
    setTimeout(() => {
        message.error(error ? error.error ? error.error : "Something went wrong." : "Something went wrong.");
        // message.error("Something went wrong.");
    }, 800);
}

//// get manager list
export function* liveScoreScorerListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreScorerList, action.competitionId, action.roleId, action.body)
        if (result.status == 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_SCORER_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//// Add/Edit Scorer Saga
export function* liveScoreAddEditScorerSaga(action) {
    
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreAddEditScorer, action.data, action.teamId, action.existingScorerId)
        if (result.status == 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_SCORER_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            message.success('Add Scorer - Successfully Added')
            history.push('/liveScorerList')

        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}   

export function* liveScoreAssigneMatches(action) {
    
    try {
        const result = yield call(LiveScoreAxiosApi.getAssignMatchesList, action.competitionId, action.teamId, action.body)
        if (result.status == 1) {
            yield put({
                type: ApiConstants.API_LIVESCORE_ASSIGN_MATCHES_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
          
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreChangeAssignStatus(action) {
    
    try {
        const result = yield call(LiveScoreAxiosApi.changeAssignStatus, action.roleId, action.records, action.teamID, action.teamkey)
        if (result.status == 1) {
            yield put({
                type: ApiConstants.API_LIVESCORE_ASSIGN_CHANGE_STATUS_SUCCESS,
                result: result.result.data,
                status: result.status,
                index : action.index,
                scorerKey : action.scorerKey
            });
            message.success('Match assign successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}