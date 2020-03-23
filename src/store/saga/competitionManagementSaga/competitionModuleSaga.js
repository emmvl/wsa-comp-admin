import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";

export function* competitionModuleSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.competitionYear);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_YEAR_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield put({ type: ApiConstants.API_GET_YEAR_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_GET_YEAR_ERROR,
            error: error,
            status: error.status
        });
    }
}

export function* competitonGenerateDrawSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.competitionGenerateDraw, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GENERATE_DRAW_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            console.log("FAILED" + result.data.message);
            yield put({ type: ApiConstants.API_GENERATE_DRAW_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        console.log("error" + error);
        yield put({
            type: ApiConstants.API_GENERATE_DRAW_ERROR,
            error: error,
            status: error.status
        });
    }
}