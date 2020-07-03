import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import CommonAxiosApi from "../../http/commonHttp/commonAxios";

import { message } from "antd";
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../../util/helpers";


function* failSaga(result) {
    yield put({
        type: ApiConstants.API_QUICK_COMPETITION_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_QUICK_COMPETITION_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error("Something went wrong.");
    }, 800);
}

////////////post/save quick competition division
export function* saveQuickCompDivisionSaga(action) {
    try {
        const result = yield call(AxiosApi.saveQuickCompDivision, action.competitionUniqueKey, action.divisions);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_QUICK_COMPETITION_DIVISION_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}


////////////Create quick competition 
export function* createQuickComptitionSaga(action) {
    try {
        const result = yield call(AxiosApi.createQuickComptition, action.year, action.comptitionName, action.competitionDate);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_CREATE_QUICK_COMPETITION_SUCCESS,
                result: result.result.data,
                status: result.status
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

export function* getquickYearAndCompetitionListSaga(action) {
    try {
        const result = isArrayNotEmpty(action.yearData) ? { status: 1, result: { data: action.yearData } } : yield call(CommonAxiosApi.getYearList, action);
        if (result.status === 1) {
            let yearId = action.yearId == null ? result.result.data[0].id : action.yearId
            const resultCompetition = yield call(AxiosApi.getQuickCompetitionList, yearId);
            if (resultCompetition.status === 1) {
                yield put({
                    type: ApiConstants.API_YEAR_AND_QUICK_COMPETITION_SUCCESS,
                    yearList: result.result.data,
                    competetionListResult: resultCompetition.result.data,
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

//get quick competition details

export function* getQuickComptitionSaga(action) {
    try {
        const result = yield call(AxiosApi.getQuickCompetiitonDetails, action.competitionUniqueKey);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_QUICK_COMPETITION_SUCCESS,
                result: result.result.data,
                status: result.status
            });

        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//quick competition time slot post api
export function* quickcompetitoTimeSlotsPostApi(action) {
    try {
        const result = yield call(AxiosApi.postTimeSlotData, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_QUICK_COMPETITION_TIMESLOT_POST_SUCCESS,
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

/////update quick competition
export function* updateQuickCompetitionSaga(action) {
    try {
        const result = yield call(AxiosApi.updateQuickCompetition, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UPDATE_QUICK_COMPETITION_SUCCESS,
                result: result.result.data,
                status: result.status
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