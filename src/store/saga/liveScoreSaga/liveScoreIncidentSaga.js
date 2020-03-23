import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from '../../../themes/apiConstants'
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.error("Something went wrong.");
    }, 800);
}


export function* liveScoreIncidentListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreIncidentList, action.competitionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_SUCCESS,
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