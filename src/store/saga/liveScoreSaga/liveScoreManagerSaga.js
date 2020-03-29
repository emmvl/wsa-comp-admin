import { put, call } from '../../../../node_modules/redux-saga/effects';
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import userHttpApi from "../../http/userHttp/userAxiosApi"
import ApiConstants from '../../../themes/apiConstants';
import { message } from "antd";
import history from "../../../util/history";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_MANAGER_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_MANAGER_ERROR,
        error: error,
        status: error.status
    });
    console.log(error)
    message.error(error.error ? error.error : "Something went wrong.")
}

//// get manager list
export function* liveScoreManagerListSaga(action) {
    try {
        const result = yield call(userHttpApi.liveScoreManagerList, action.roleId,
            action.entityTypeId, action.entityId)
        if (result.status == 1) {
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
        if (result.status == 1) {
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
        const result = yield call(userHttpApi.liveScoreSearchManager, action.data)
        console.log(result)
        if (result) {
            if (result.status == 1) {
                yield put({
                    type: ApiConstants.API_LIVESCORE_MANAGER_SEARCH_SUCCESS,
                    result: result.result.data,
                    status: result.status,
                });
            }
            else {
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