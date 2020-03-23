import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";

export function* competitionDashboardSaga(action) {
    console.log(action, 'competitionDashboardSaga')
    try {
        const result = yield call(CompetitionAxiosApi.competitionDashboard, action.yearId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COMPETITION_DASHBOARD_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield put({ type: ApiConstants.API_COMPETITION_DASHBOARD_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMPETITION_DASHBOARD_ERROR,
            error: error,
            status: error.status
        });
    }
}