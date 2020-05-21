import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import userHttpApi from '../../http/userHttp/userAxiosApi'
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_COACH_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_COACH_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went wrong.")
}

export function* liveScoreCoachSaga(action) {
    console.log('action', action)
    try {
        const result = yield call(userHttpApi.liveScoreCoachesList, action.roleId, action.entityTypeId, action.entityId);
        if (result.status === 1) {
            console.log('saga', result)
            yield put({
                type: ApiConstants.API_LIVE_SCORE_COACHES_LIST_SUCCESS,
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