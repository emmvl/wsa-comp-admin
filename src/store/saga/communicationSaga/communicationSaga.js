import { put, call, takeEvery } from "redux-saga/effects";
import { message } from "antd";

import AppConstants from "themes/appConstants";
import ApiConstants from "themes/apiConstants";
import history from "util/history";
import { receiptImportResult } from "util/showImportResult";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import RegistrationAxiosApi from "../../http/registrationHttp/registrationAxiosApi";
import CommonAxiosApi from "store/http/commonHttp/commonAxiosApi";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_COMMUNICATION_LIST_FAIL });

    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong;
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_COMMUNICATION_LIST_ERROR,
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

function* communicationListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.communicationList, action.data);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COMMUNICATION_LIST_SUCCESS,
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



export default function* rootCommunicationListSaga() {
    yield takeEvery(ApiConstants.API_COMMUNICATION_LIST_LOAD, communicationListSaga);

}
