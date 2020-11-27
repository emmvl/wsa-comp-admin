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
    yield put({ type: ApiConstants.API_UMPIRE_FAIL });

    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong;
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_UMPIRE_ERROR,
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

function* umpirePaymentListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.umpirePaymentList, action.data);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_UMPIRE_PAYMENT_DATA_SUCCESS,
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

function* umpirePaymentTransferSaga(action) {
    try {
        const result = yield call(RegistrationAxiosApi.umpirePaymentTransfer, action.data);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UMPIRE_PAYMENT_TRANSFER_DATA_SUCCESS,
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

function* umpirePaymenExportSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.umpirePaymentExport, action.data);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UMPIRE_PAYMENT_EXPORT_FILE_SUCCESS,
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


export default function* rootUmpirePaymentSaga() {
    yield takeEvery(ApiConstants.API_GET_UMPIRE_PAYMENT_DATA_LOAD, umpirePaymentListSaga);
    yield takeEvery(ApiConstants.API_UMPIRE_PAYMENT_TRANSFER_DATA_LOAD, umpirePaymentTransferSaga);
    yield takeEvery(ApiConstants.API_UMPIRE_PAYMENT_EXPORT_FILE_LOAD, umpirePaymenExportSaga);
}
