import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/registrationHttp/registrationAxios";
import { message } from "antd";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_USERCOUNT_FAIL,
        error: result,
        status: result.status
    });
    if (result.result.data.message) {
        setTimeout(() => {
            message.error(result.result.data.message);
        }, 800);
    } else {
        message.error("Something went wrong.");
    }
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_USERCOUNT_ERROR,
        error: error,
        status: error.status
    });

    setTimeout(() => {
        // message.error(error.result.data.message);
        message.error("Something went wrong.");
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

