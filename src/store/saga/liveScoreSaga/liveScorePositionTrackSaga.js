import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_POSITION_TRACKING_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_POSITION_TRACKING_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went wrong.")
}

//// get manager list
export function* liveScorePositionTrackSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScorePositionTrackList, action.data)
        if (result.status == 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_POSITION_TRACKING_SUCCESS,
                result: result.result.data,
                status: result.status,
                reporting: action.data.reporting,
                aggregate: action.data.aggregate
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}