import { put, call } from "redux-saga/effects";
import { message } from "antd";

import AppConstants from "themes/appConstants";
import ApiConstants from "themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";

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

export function* communicationListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreCommunicationList, action.data);

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
