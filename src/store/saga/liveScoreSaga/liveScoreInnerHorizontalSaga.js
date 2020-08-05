import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_INNER_HORIZONTAL_FAIL });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_INNER_HORIZONTAL_ERROR,
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

//// get manager list
export function* getInnerHorizontalCompSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.innerHorizontalCompList, action.organisationId)
        if (result.status == 1) {
            yield put({
                type: ApiConstants.API_INNER_HORIZONTAL_COMPETITION_LIST_SUCCESS,
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