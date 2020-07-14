import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";

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
            console.log("failSaga", result.data.message)
            yield put({ type: ApiConstants.API_COMPETITION_DASHBOARD_FAIL });
            setTimeout(() => {
                message.error(result.data.message)
            }, 800);
        }
    } catch (error) {
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
}