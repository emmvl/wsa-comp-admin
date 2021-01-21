import {
    put,
    call,
    takeEvery
} from "redux-saga/effects";
import {
    message
} from "antd";
import AppConstants from "themes/appConstants";
import ApiConstants from "themes/apiConstants";

import UmpireAxiosApi from "store/http/umpireHttp/umpireAxios";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_UMPIRE_POOL_ALLOCATION_FAIL
    });

    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong;
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_UMPIRE_POOL_ALLOCATION_ERROR,
        error: error,
        status: error.status,
    });

    if (error.status === 400) {
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

function* getUmpirePoolAllocationSaga(action) {
    try {
        const result = yield call(UmpireAxiosApi.getUmpirePoolAllocation, action.payload);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_UMPIRE_POOL_DATA_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

function* saveUmpirePoolAllocationSaga(action) {
    try {
        const result = yield call(UmpireAxiosApi.saveUmpirePoolAllocation, action.payload);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_UMPIRE_POOL_DATA_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

function* deleteUmpirePoolAllocationSaga(action) {
    try {
        const result = yield call(UmpireAxiosApi.deleteUmpirePoolAllocation, action.payload);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_DELETE_UMPIRE_POOL_DATA_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export default function* rootUmpirePoolAllocationSaga() {
    yield takeEvery(ApiConstants.API_GET_UMPIRE_POOL_DATA_LOAD, getUmpirePoolAllocationSaga);
    yield takeEvery(ApiConstants.API_SAVE_UMPIRE_POOL_DATA_LOAD, saveUmpirePoolAllocationSaga);
    yield takeEvery(ApiConstants.API_DELETE_UMPIRE_POOL_DATA_LOAD, deleteUmpirePoolAllocationSaga);
}