import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import RegistrationAxiosApi from "../../http/registrationHttp/registrationAxiosApi"
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";
function* failSaga(result) {
    console.log("failSaga", result.message)
    yield put({ type: ApiConstants.API_COMPETITION_DASHBOARD_FAIL });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    console.log("errorSaga", error)
    yield put({
        type: ApiConstants.API_COMPETITION_DASHBOARD_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error(AppConstants.somethingWentWrong);
    }, 800);
}
export function* competitionDashboardSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.competitionDashboard, action.yearId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COMPETITION_DASHBOARD_SUCCESS,
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
export function* updateCompetitionStatusSaga(action) {
    try {
        const result = yield call(RegistrationAxiosApi.updateCompetitionStatus, action.payload);
        if (result.status === 1) {
            const updateDashboardResult = yield call(CompetitionAxiosApi.competitionDashboard, action.yearId,);
            if (updateDashboardResult.status === 1) {
                yield put({
                    type: ApiConstants.API_COMPETITION_STATUS_UPDATE_SUCCESS,
                    result: result.result.data,
                    updateDashboardResult: updateDashboardResult.result.data,
                    status: result.status,
                });

            }
            else {
                yield put({
                    type: ApiConstants.API_COMPETITION_STATUS_UPDATE_SUCCESS,
                    result: result.result.data,
                    status: result.status,
                });
            }
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* competitionDashboardDeleteSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.competitionDashboardDelete,action.competitionId,action.targetValue);
        if (result.status === 1) {
            
            yield put({
                type: ApiConstants.API_COMPETITION_DASHBOARD_DELETE_SUCCESS,
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

export function* saveReplicateSaga(action){
    try {
        const result = yield call(CompetitionAxiosApi.replicateSave,action.replicateData);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_REPLICATE_SAVE_SUCCESS,
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