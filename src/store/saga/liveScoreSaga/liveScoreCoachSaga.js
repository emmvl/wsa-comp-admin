import { put, call } from "redux-saga/effects"
import { message } from "antd";

import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import userHttpApi from "../../http/userHttp/userAxiosApi";
import history from "../../../util/history";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_COACH_FAIL });
    setTimeout(() => {
        message.error(result.result.data)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_COACH_ERROR,
        error: error,
        status: error.status
    });

    message.error(error ? error.error : 'Something went wrong!!')
}

export function* liveScoreCoachSaga(action) {
    try {
        const result = yield call(userHttpApi.liveScoreCoachesList, action.roleId, action.entityTypeId, action.entityId, action.search, action.offset, action.sortBy, action.sortOrder);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_COACH_LIST_SUCCESS,
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

export function* liveScoreAddCoachSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreAddCoach, action.data, action.teamId, action.exsitingManagerId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_COACH_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            message.success('Add Coach - Successfully Added')
            history.push('/LiveScoreCoaches')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreCoachImportSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreCoachImport, action.payload)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_COACH_IMPORT_SUCCESS
            });
            history.push('/LiveScoreCoaches')
            message.success('Coach Imported Successfully.')
        }
        else {
            yield call(failSaga, result)
        }
    } catch (e) {
        yield call(errorSaga, e)
    }
}
