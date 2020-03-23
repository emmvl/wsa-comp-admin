import { put, call } from 'redux-saga/effects';
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import ApiConstants from '../../../themes/apiConstants';
import { message } from "antd";
function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.error("Something went wrong.");
    }, 800);
}

export function* liveScoreTeamAttendanceListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreAttendanceList, action.competitionId, action.body);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_TEAM_ATTENDANCE_LIST_SUCCESS,
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
