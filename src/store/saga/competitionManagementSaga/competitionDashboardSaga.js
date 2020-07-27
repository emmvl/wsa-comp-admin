import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import RegistrationAxiosApi from "../../http/registrationHttp/registrationAxios"
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
            console.log(result)
            yield put({
                type: ApiConstants.API_COMPETITION_STATUS_UPDATE_SUCCESS,
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