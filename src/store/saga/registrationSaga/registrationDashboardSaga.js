import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/registrationHttp/registrationAxios";
import { message } from "antd";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_REG_DASHBOARD_LIST_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_REG_DASHBOARD_LIST_ERROR,
        error: error,
        status: error.status
    });

    setTimeout(() => {
        // message.error(error.result.data.message);
        message.error("Something went wrong.");
    }, 800);
}

//////get the membership fee list in registration
export function* regDashboardListSaga(action) {
    try {
        const result = yield call(AxiosApi.registrationDashboardList, action.offset, action.yearRefId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_REG_DASHBOARD_LIST_SUCCESS,
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

