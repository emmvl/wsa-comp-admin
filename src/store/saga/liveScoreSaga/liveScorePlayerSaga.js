import { put, call } from "redux-saga/effects";
import { message } from "antd";

import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import history from '../../../util/history'
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_PLAYER_FAIL,
        error: result,
        status: result.status
    });
    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_PLAYER_ERROR,
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

////player list saga
export function* liveScorePlayerSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScorePlayerList, action.competitionID);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_PLAYER_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {

        }
    } catch (error) {

    }
}

////Add/Edit player saga
export function* liveScoreAddEditPlayerSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreAddEditPlayer, action.data);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_PLAYER_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            message.config({
                duration: 1.5,
                maxCount: 1,
            });
            message.success(action.playerId ? 'Player Edited Successfully.' : 'Player Added Successfully.')
            // history.push(action.temaViewPlayer ? '/liveScoreTeamView' : '/liveScorePlayerList', { tableRecord: action.data.teamId })
            history.push(action.propsData.screenName === 'fromMatchList' || action.propsData.screenName === 'fromTeamList' ? '/liveScoreTeamView' : '/liveScorePlayerList', { ...action.propsData })
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

////Match Import
export function* liveScorePlayerImportSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScorePlayerImport, action.competitionId, action.csvFile);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_MATCH_IMPORT_SUCCESS,
            });
            history.push('/liveScorePlayerList')
            message.success('Player Imported Successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//// Player list paginaion

////player list saga
export function* getPlayerListPagginationSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.getPlayerWithPaggination, action.competitionID, action.offset, action.limit, action.search, action.sortBy, action.sortOrder);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_PLAYER_LIST_PAGGINATION_SUCCESS,
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
