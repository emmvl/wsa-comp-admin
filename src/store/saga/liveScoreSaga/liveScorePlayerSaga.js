import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import history from '../../../util/history'

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_PLAYER_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_PLAYER_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        // message.error("Something went wrong.");
        message.error(error.error);
    }, 800);
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
                navigation: action.navigation
            });
        } else {

        }
    } catch (error) {

    }
}

////Add/Edit player saga
export function* liveScoreAddEditPlayerSaga(action) {
    try {
        console.log('^^^^^', action)
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
            history.push(action.propsData.screenName == 'fromMatchList' || action.propsData.screenName == 'fromTeamList' ? '/liveScoreTeamView' : '/liveScorePlayerList', { ...action.propsData })
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