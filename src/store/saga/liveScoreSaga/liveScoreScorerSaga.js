import { put, call } from '../../../../node_modules/redux-saga/effects';
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import ApiConstants from '../../../themes/apiConstants';
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_SCORER_LIST_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_SCORER_LIST_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went wrong.")
}

//// get manager list
export function* liveScoreScorerListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreScorerList, action.competitionId, action.roleId, action.body)
        if (result.status == 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_SCORER_LIST_SUCCESS,
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