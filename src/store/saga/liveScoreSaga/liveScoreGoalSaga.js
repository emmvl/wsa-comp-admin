import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_GOAL_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_GOAL_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went wrong.")
}

export function* liveScoreGoalSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreGoalList, action.competitionID, action.goalType);
        if (result.status === 1) {
            // console.log('saga', result)
            yield put({
                type: ApiConstants.API_LIVE_SCORE_GOAL_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
                navigation: action.navigation
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}