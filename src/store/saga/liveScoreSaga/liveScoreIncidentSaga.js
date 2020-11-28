import { put, call } from "redux-saga/effects"
import ApiConstants from '../../../themes/apiConstants'
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import history from "../../../util/history";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_FAIL,
        error: result,
        status: result.status
    });
    let msg = result.result.data ? result.result.data.message : AppConstants.somethingWentWrong
    message.config({
        duration: 1.5,
        maxCount: 1,
    });
    message.error(msg);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_ERROR,
        error: error,
        status: error.status
    });
    if (error.status == 400) {

        message.config({
            duration: 1.5,
            maxCount: 1,
        });
        message.error((error && error.error) ? error.error : AppConstants.somethingWentWrong);
    } else {
        message.config({
            duration: 1.5,
            maxCount: 1,
        });
        message.error(AppConstants.somethingWentWrong);
    }
}


export function* liveScoreIncidentListSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreIncidentList, action.competitionId, action.search, action.limit, action.offset, action.sortBy, action.sortOrder);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_INCIDENT_LIST_SUCCESS,
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

export function* liveScoreAddEditIncidentSaga(action) {
    try {
        // if (action.data.key === 'media') {

        const result = yield call(LiveScoreAxiosApi.liveScoreAddEditIncident, action.data);
        if (result.status === 1) {
            const mediaResult = yield call(LiveScoreAxiosApi.liveScoreAddEditIncidentMedia, action.data, result.result.data.incidentId);
            if (mediaResult.status === 1) {
                yield put({
                    type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_INCIDENT_SUCCESS,
                    result: mediaResult.result.data,
                    status: mediaResult.status,
                    umpireKey: action.data.umpireKey
                });
                history.push('/matchDayIncidentList')
                message.success('Add Incident - Added Successfully')
            }
            else {
                yield call(failSaga, result)
            }
        } else {
            yield call(failSaga, result)
        }
        // } 

        // else {
        //     const result = yield call(LiveScoreAxiosApi.liveScoreAddEditIncident, action.data);
        //     if (result.status === 1) {
        //         yield put({
        //             type: ApiConstants.API_LIVE_SCORE_ADD_EDIT_INCIDENT_SUCCESS,
        //             result: result.result.data,
        //             status: result.status,
        //         });
        //         history.push('/matchDayIncidentList')
        //         message.success('Add Incident - Added Successfully')
        //     } else {
        //         yield call(failSaga, result)
        //     }
        // }

    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreIncidentTypeSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreIncidentType);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_INCIDENT_TYPE_SUCCESS,
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