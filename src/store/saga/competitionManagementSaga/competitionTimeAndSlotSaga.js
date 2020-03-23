import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import { message } from 'antd'

function* failSaga(result) {
    yield put({ type: ApiConstants.API_COMPETITION_TIMESLOT_FAIL });
    setTimeout(() => {
        message.error("Something went wrong")
        // alert(result.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_COMPETITION_TIMESLOT_ERROR,

    });
    setTimeout(() => {
        message.error("Something went wrong")
        // alert(result.message);
    }, 800);
}



// competition time slot get api
export function* competitonWithTimeSlots(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getTimeSlotData, action.year, action.competitionId, action.organisationId, action.userId);
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


// competition time slot post api
export function* competitonWithTimeSlotsPostApi(action) {
    try {
        const result = yield call(CompetitionAxiosApi.postTimeSlotData, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COMPETITION_TIMESLOT_POST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            setTimeout(() => {
                message.success(result.result.data.message)
            }, 500);
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}