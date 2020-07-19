import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_MATCH_SHEET_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_MATCH_SHEET_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.error("Something went wrong.");
    }, 800);
}

//////get the competition fee list in registration
export function* liveScoreDivisionsaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreGetDivision, action.competitionID, action.compKey);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_SUCCESS,
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

export function* liveScoreMatchSheetSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreCreateDivision,
            action.name,
            action.divisionName,
            action.gradeName,
            action.competitionId,
            action.divisionId);
      
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_CREATE_DIVISION_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            // history.push("/liveScoreDivisionList")
            // message.success("Division created successfully")

        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreMatchSheetPrintSaga(action) {
    try {
        const result = yield call(
            LiveScoreAxiosApi.liveScoreMatchSheetPrint,
            action.competitionId,
            action.divisionId,
            action.teamId,
            action.templateType,
        );

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_MATCH_SHEET_PRINT_SUCCESS,
                status: result.status,
            });
            message.config({ duration: 5, maxCount: 1 });
            message.loading('Print is in processing now, please refresh downloads table after for a while.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreMatchSheetDownloadSaga(action) {
    try {
        const result = yield call(
            LiveScoreAxiosApi.liveScoreMatchSheetDownloadList,
            action.competitionId
        );

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_MATCH_SHEET_DOWNLOADS_SUCCESS,
                matchSheetDownloads: result.result.data.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}
