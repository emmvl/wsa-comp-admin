
import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    console.log(result)
    yield put({ type: ApiConstants.API_SAVE_VENUE_CHANGE_FAIL });
    setTimeout(() => {
        message.error(result.result.data.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_SAVE_VENUE_CHANGE_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went wrong.")
}

export function* liveScoreChangeVenueSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.venueChangeApi, action.compId, action.data, action.start, action.end);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_VENUE_CHANGE_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            message.success("Venue courts changed successfully.")
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}