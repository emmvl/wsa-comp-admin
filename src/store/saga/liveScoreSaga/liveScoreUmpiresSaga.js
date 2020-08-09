import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import history from "../../../util/history";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_UMPIRES_FAIL });
    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_UMPIRES_ERROR,
        error: error,
        status: error.status
    });
    if (error.status == 400) {

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

export function* liveScoreUmpiresSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.umpiresList, action.competitionId, action.body)

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_UMPIRES_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
                // navigation: action.navigation
            })
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}


export function* liveScoreUmpiresImportSaga(action) {

    try {
        const result = yield call(LiveScoreAxiosApi.umpireImport, action.payload)

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_UMPIRES_IMPORT_SUCCESS,
                result: result.result.data,
                status: result.status,
                // navigation: action.navigation
            })
            history.push('/liveScoreUmpireList')
            message.success('Umpire Imported Successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

