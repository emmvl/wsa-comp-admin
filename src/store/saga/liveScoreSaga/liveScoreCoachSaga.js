import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import AppConstants from "../../../themes/appConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import userHttpApi from '../../http/userHttp/userAxiosApi'
import { message } from "antd";
import history from "../../../util/history";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_COACH_FAIL });
    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);

}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_COACH_ERROR,
        error: error,
        status: error.status
    });

    if (error.status == 400) {

        message.config({
            duration: 1.5,
            maxCount: 1,
        });
        message.error((error && error.error) ? error.error : AppConstants.somethingWentWrong);
    } else {
        message.config({
            duration: 1.5,
            maxCount: 1,
        });
        message.error(AppConstants.somethingWentWrong);
    }
}

export function* liveScoreCoachSaga(action) {

    try {
        const result = yield call(userHttpApi.liveScoreCoachesList, action.roleId, action.entityTypeId, action.entityId, action.search, action.offset);
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