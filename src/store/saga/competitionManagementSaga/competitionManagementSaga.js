import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_COMPETITION_FAIL });
    setTimeout(() => {
        alert(result.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_COMPETITION_ERROR,
        error: error,
        status: error.status
    });
}

export function* competitionManagementSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.competitionDashboard);
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

export function* competitonWithTimeSlots(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getTimeSlotData, action.competitionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMPETITION_WITH_TIME_SLOTS_SUCCESS,
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

