import { put, call } from "redux-saga/effects"
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    console.log("failSaga", result.message)
    yield put({ type: ApiConstants.API_UMPIRE_FAIL });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    console.log("errorSaga", error)
    yield put({
        type: ApiConstants.API_UMPIRE_ERROR,
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
export function* getUmpireCompSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreCompetition,
            action.data,
            action.yearId,
            action.orgId,
            action.recordUmpireTypes
        )
        if (result.status == 1) {
            yield put({
                type: ApiConstants.API_UMPIRE_COMPETITION_LIST_SUCCESS,
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