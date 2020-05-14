import { put, call } from '../../../../node_modules/redux-saga/effects';
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went Wrong.")
}

export function* liveScoreGameTimeStatisticsSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.gameTimeStatistics, action.competitionId,
            action.aggregate,
            action.offset,
            action.searchText
            )
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_GAME_TIME_STATISTICS_LIST_SUCCESS,
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

