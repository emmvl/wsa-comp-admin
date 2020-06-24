import { put, call } from '../../../../node_modules/redux-saga/effects';
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import history from "../../../util/history";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_UMPIRES_FAIL });
    setTimeout(() => {
        message.error(result.result.data)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_UMPIRES_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went Wrong.")
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
    console.log(action, "asaga")
    try {
        const result = yield call(LiveScoreAxiosApi.umpireImport, action.payload)
        console.log(result, "umpImp")
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

