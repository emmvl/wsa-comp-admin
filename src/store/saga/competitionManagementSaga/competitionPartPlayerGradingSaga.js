import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_COMPETITION_PART_PLAYER_GRADING_FAIL });
    setTimeout(() => {
        alert(result.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_COMPETITION_PART_PLAYER_GRADING_ERROR,
        error: error,
        status: error.status
    });
}

//competition part player grade calculate player grading summmary get API
export function* getCompPartPlayerGradingSummarySaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getCompPartPlayerGradingSummary, action.yearRefId, action.competitionId);
        if (result.status === 1) {
            console.log(result)
            yield put({
                type: ApiConstants.API_GET_COMPETITION_PART_PLAYER_GRADE_CALCULATE_SUMMMARY_LIST_SUCCESS,
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


///////save the competition part player grade calculate player grading summmary or say proposed player grading toggle
export function* saveCompPartPlayerGradingSummarySaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.saveCompPartPlayerGradingSummary, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_COMPETITION_PART_PLAYER_GRADE_CALCULATE_SUMMMARY_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            message.success(result.result.data.message)
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

///competition part player grading get API 
export function* getCompPartPlayerGradingSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getCompPartPlayerGrading, action.yearRefId, action.competitionId, action.divisionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMPETITION_PART_PLAYER_GRADING_LIST_SUCCESS,
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

// competition  part player grading add  team

export function* addNewTeamPartPlayerGradingSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.addCompetitionTeam, action.competitionId, action.divisionId, action.teamName);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_ADD_NEW_TEAM_SUCCESS,
                result: result.result.data,
                teamName: action.teamName,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

// competition  part player grading add  team

export function* dragTeamPartPlayerSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.dragAndDropAxios, action.competitionId, action.teamId, action.player);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_DRAG_NEW_TEAM_SUCCESS,
                result: result.result.data,
                teamName: action.teamName,
                status: result.status,
                teamId: action.teamId,
                playerId: action.player,
                source: action.source,
                destination: action.destination
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}


// 
export function* importCompetitionPlayer(action) {
    try {
        const result = yield call(CompetitionAxiosApi.importCompetitionPlayer, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COMPETITION_PLAYER_IMPORT_SUCCESS,
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