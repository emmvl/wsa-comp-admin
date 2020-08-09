import { put, call } from "redux-saga/effects";
import { message } from "antd";

import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import userHttpApi from "../../http/userHttp/userAxiosApi"
import ApiConstants from "../../../themes/apiConstants";
import history from "../../../util/history";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_MANAGER_FAIL });
    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_MANAGER_ERROR,
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

//// get manager list
export function* liveScoreManagerListSaga(action) {
    try {
        const result = yield call(
            userHttpApi.liveScoreManagerList,
            action.roleId,
            action.entityTypeId,
            action.entityId,
            action.searchText,
            action.offset,
            action.sortBy,
            action.sortOrder,
        )
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_MANAGER_LIST_SUCCESS,
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

//// Add/Edit Manager Saga
export function* liveScoreAddEditManagerSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreAddEditManager, action.data, action.teamId, action.exsitingManagerId)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_MANAGER_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            message.success('Add Manager - Successfully Added')
            history.push('/liveScoreManagerList')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//// Add/Edit Manager Saga
export function* liveScoreManagerSearch(action) {
    try {
        const result = yield call(userHttpApi.liveScoreSearchManager, action.data, action.competition_Id)
        if (result) {
            if (result.status === 1) {
                yield put({
                    type: ApiConstants.API_LIVESCORE_MANAGER_SEARCH_SUCCESS,
                    result: result.result.data,
                    status: result.status,
                });
            } else {
                yield call(failSaga, result)
            }
        } else {
            yield put({
                type: ApiConstants.API_LIVESCORE_MANAGER_SEARCH_SUCCESS,
                result: [],
            });
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreManagerImportSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreManagerImport, action.payload)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_MANAGER_IMPORT_SUCCESS
            });
            history.push('/liveScoreManagerList')
            message.success('Manager Imported Successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (e) {
        yield call(errorSaga, e)
    }
}
