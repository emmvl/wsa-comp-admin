import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import history from "../../../util/history";

function* failSaga(result) {
    console.log(result, 'API_LIVE_SCORE_TEAM_ERROR')
    yield put({
        type: ApiConstants.API_LIVE_SCORE_TEAM_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    console.log(error, 'API_LIVE_SCORE_TEAM_ERROR')
    yield put({
        type: ApiConstants.API_LIVE_SCORE_TEAM_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.error(error ? error.error ? error.error : "Something went wrong." : "Something went wrong.");
    }, 800);
}

export function* liveScoreTeamSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreTeam, action.competitionID, action.divisionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS,
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

//// Team View Player List saga
export function* liveScoreTeamViewPlayerListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreTeamViewPlayerList, action.teamId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_TEAM_VIEW_PLAYER_LIST_SUCCESS,
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

//// Delete Team Saga
export function* liveScoreDeleteTeamSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreDeleteTeam, action.teamId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_DELETE_TEAM_SUCCESS,
                status: result.status,
            });
            history.push('/liveScoreTeam')
            message.success('Team Deleted Successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreTeamDivisionSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreGetDivision, action.payload)
        console.log('reducer', result)
        if (result.status === 1) {
            yield put({ type: ApiConstants.GET_DIVISION_SUCCESS, payload: result.result.data })
        } else {
            yield call(failSaga, result)
        }
    } catch (e) {
        yield call(errorSaga, e)
    }

}
export function* liveScoreAffilateSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreGetAffilate, action.payload)
        console.log('reducer1', result)
        if (result.status === 1) {
            yield put({ type: ApiConstants.GET_AFFILATE_SUCCESS, payload: result.result.data })
        } else {
            yield call(failSaga, result)
        }
    } catch (e) {
        yield call(errorSaga, e)
    }
}
export function* addTeamLiveScoreSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreAddNewTeam, action.payload)

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_ADD_TEAM_SUCCESS,
            });
            message.success(action.teamId ? 'Team has been updated Successfully' : 'Team has been created Successfully.')
            history.push('/liveScoreTeam')
        }
        else {
            yield call(failSaga, result)
        }
    } catch (e) {
        yield call(errorSaga, e)
    }

}

export function* liveScoreTeamImportSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreTeamImport, action.payload)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_TEAM_IMPORT_SUCCESS
            });
            history.push('/liveScoreTeam')
            message.success('Team Imported Successfully.')
        }
        else {
            yield call(failSaga, result)
        }
    } catch (e) {
        yield call(errorSaga, e)
    }

}

export function* liveScoreGetTeamSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreGetTeamData, action.teamId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_GET_TEAM_SUCCESS,
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