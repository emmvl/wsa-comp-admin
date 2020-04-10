import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_LADDER_SETTING_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_LADDER_SETTING_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.error("Something went wrong.");
    }, 800);
}

export function* laddersSettingGetMatchResult(action) {
    try {

        const result = yield call(LiveScoreAxiosApi.ladderSettingMatchResult);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LADDER_SETTING_MATCH_RESULT_SUCCESS,
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

export function* laddersSettingGetData(action) {
    try {

        const result = yield call(LiveScoreAxiosApi.laddersSettingGetData, action.competitionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LADDER_SETTING_GET_DATA_SUCCESS,
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

export function* laddersSettingPostData(action) {
    try {

        const result = yield call(LiveScoreAxiosApi.laddersSettingPostData, action.postData);
        if (result.status === 1) {
            const result = yield call(LiveScoreAxiosApi.laddersSettingGetData, action.competitionId);
            yield put({
                type: ApiConstants.API_LADDER_SETTING_POST_DATA_SUCCESS,
                result: result.result.data,
                getData: result.result.data,
                status: result.status,
            });
            message.success('Ladder settings updated successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}