import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_COMPETITION_OWN_TEAM_GRADING_FAIL });
    setTimeout(() => {
        alert(result.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_COMPETITION_OWN_TEAM_GRADING_ERROR,
        error: error,
        status: error.status
    });
}

//competition own proposed team grading get api
export function* getCompOwnProposedTeamGradingSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getCompOwnProposedTeamGrading,
            action.yearRefId, action.competitionId, action.divisionId, action.gradeRefId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMPETITION_OWN_PROPOSED_TEAM_GRADING_LIST_SUCCESS,
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

//////competition save own final team grading table data
export function* saveOwnFinalTeamGradingDataSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.saveOwnFinalTeamGradingData,
            action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_COMPETITION_OWN_FINAL_TEAM_GRADING_SUCCESS,
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

//competition part proposed team grading get api
export function* getCompPartProposedTeamGradingSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getCompPartProposedTeamGrading,
            action.yearRefId, action.competitionId, action.divisionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMPETITION_PART_PROPOSED_TEAM_GRADING_LIST_SUCCESS,
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

///////competition save own final team grading table data
export function* savePartProposedTeamGradingDataSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.savePartProposedTeamGradingData,
            action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_COMPETITION_PART_PROPOSED_TEAM_GRADING_SUCCESS,
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


/////get the own team grading summary listing data
export function* getTeamGradingSummarySaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getTeamGradingSummary,
            action.yearRefId, action.competitionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMPETITION_OWN_TEAM_GRADING_SUMMARY_LIST_SUCCESS,
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

////////save the changed grade name in own competition team grading summary data
export function* saveUpdatedGradeTeamSummarySaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.saveUpdatedGradeTeamSummary,
            action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_UPDATED_GRADE_NAME_TEAM_GRADING_SUMMARY_SUCCESS,
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


///////////team grading summmary publish
export function* publishGradeTeamSummarySaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.publishGradeTeamSummary,
            action.yearRefId, action.competitionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_PUBLISH_TEAM_GRADING_SUMMARY_SUCCESS,
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

/////////////get the competition final grades on the basis of competition and division
export function* getCompFinalGradesListSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getCompFinalGradesList,
            action.yearRefId, action.competitionId, action.divisionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMPETITION_FINAL_GRADES_LIST_SUCCESS,
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