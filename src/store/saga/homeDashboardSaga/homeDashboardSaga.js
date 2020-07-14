import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/registrationHttp/registrationAxios";
import CommonAxiosApi from "../../http/commonHttp/commonAxios";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    console.log("failSaga", result.result.data.message)
    yield put({
        type: ApiConstants.API_USERCOUNT_FAIL,
        error: result,
        status: result.status
    });
    if (result.result.data.message) {
        setTimeout(() => {
            message.config({
                duration: 1.5,
                maxCount: 1
            })
            message.error(result.result.data.message);
        }, 800);
    } else {
        message.error("Something went wrong.");
    }
}

function* errorSaga(error) {
    console.log("errorSaga", error)
    yield put({
        type: ApiConstants.API_USERCOUNT_ERROR,
        error: error,
        status: error.status
    });

    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error(AppConstants.somethingWentWrong);
    }, 800);
}

//////get the membership fee list in registration
export function* homeDashboardSaga(action) {
    try {
        const result = yield call(AxiosApi.homeDashboardApi, action.year);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USERCOUNT_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//////get the action box list
export function* actionBoxListSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getActionBoxList, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_ACTION_BOX_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//////Update action box
export function* updateActionBoxSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.updateActionBox, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UPDATE_ACTION_BOX_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}
