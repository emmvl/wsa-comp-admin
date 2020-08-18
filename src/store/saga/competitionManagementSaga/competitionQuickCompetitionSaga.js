import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import CommonAxiosApi from "../../http/commonHttp/commonAxios";
import history from "../../../util/history";
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
    console.log(error)
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
            if (result.result.data.isDrawApplicable == 1) {
                const drawResult = yield call(AxiosApi.quickCompetitionGenerateDraw, action.year, action.competitionUniqueKey)
                if (drawResult.status === 1) {
                    const detailResult = yield call(AxiosApi.getQuickCompetiitonDetails, action.competitionUniqueKey);
                    if (detailResult.status === 1) {
                        yield put({
                            type: ApiConstants.API_UPDATE_QUICK_COMPETITION_SUCCESS,
                            result: result.result.data,
                            drawresult: drawResult.result.data,
                            detailResult: detailResult.result.data,
                            status: result.status,
                            competitionId: action.competitionUniqueKey,
                            competitionName: action.competitionName
                        });
                    }
                }
                else {
                    yield put({
                        type: ApiConstants.API_SAVE_QUICK_COMPETITION_DIVISION_SUCCESS,
                        result: result.result.data,
                        status: result.status
                    });
                    if (drawResult.status != 1) {
                        setTimeout(() => {
                            message.config({
                                duration: 1,
                                maxCount: 1
                            })
                            message.error(drawResult.result.data.message);
                        }, 800);
                    }
                }
            }
            else {
                yield put({
                    type: ApiConstants.API_SAVE_QUICK_COMPETITION_DIVISION_SUCCESS,
                    result: result.result.data,
                    status: result.status
                });
            }
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
            if (result.result.data.isDrawApplicable == 1) {
                const drawResult = yield call(AxiosApi.quickCompetitionGenerateDraw, action.year, action.competitionUniqueKey)
                if (drawResult.status === 1) {
                    const detailResult = yield call(AxiosApi.getQuickCompetiitonDetails, action.competitionUniqueKey);
                    if (detailResult.status === 1) {
                        yield put({
                            type: ApiConstants.API_UPDATE_QUICK_COMPETITION_SUCCESS,
                            result: result.result.data,
                            drawresult: drawResult.result.data,
                            detailResult: detailResult.result.data,
                            status: result.status,
                            competitionId: action.competitionUniqueKey,
                            competitionName: action.competitionName
                        });
                    }
                }
                else {
                    yield put({
                        type: ApiConstants.API_QUICK_COMPETITION_TIMESLOT_POST_SUCCESS,
                        result: result.result.data,
                        status: result.status,
                    });
                    if (drawResult.status != 1) {
                        setTimeout(() => {
                            message.config({
                                duration: 1,
                                maxCount: 1
                            })
                            message.error(drawResult.result.data.message);
                        }, 800);
                    }
                    // setTimeout(() => {
                    //     message.success(result.result.data.message)
                    // }, 500);
                }
            }
            else {
                yield put({
                    type: ApiConstants.API_QUICK_COMPETITION_TIMESLOT_POST_SUCCESS,
                    result: result.result.data,
                    status: result.status,
                });
                setTimeout(() => {
                    message.success(result.result.data.message)
                }, 500);
            }
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
            if (action.buttonPressed == "AddTeam") {
                const detailResult = yield call(AxiosApi.getQuickCompetiitonDetails, action.payload.competitionId);
                if (detailResult.status === 1) {
                    yield put({
                        type: ApiConstants.API_UPDATE_QUICK_COMPETITION_SUCCESS,
                        result: result.result.data,
                        detailResult: detailResult.result.data,
                        status: result.status,
                        competitionId: action.payload.competitionId,
                        competitionName: action.payload.competitionName
                    });
                    if (action.buttonPressed == "AddTeam") {
                        history.push('/quickCompetitionInvitations', { competitionUniqueKey: action.payload.competitionId, year: action.year, importPlayer: JSON.stringify(detailResult.result.data.importPlayer) })
                    }
                }
                else {
                    yield call(failSaga, detailResult)
                }

            } else {
                const drawResult = yield call(AxiosApi.quickCompetitionGenerateDraw, action.year, action.payload.competitionId)
                if (drawResult.status === 1) {
                    const detailResult = yield call(AxiosApi.getQuickCompetiitonDetails, action.payload.competitionId);
                    if (detailResult.status === 1) {
                        yield put({
                            type: ApiConstants.API_UPDATE_QUICK_COMPETITION_SUCCESS,
                            result: result.result.data,
                            drawresult: drawResult.result.data,
                            detailResult: detailResult.result.data,
                            status: result.status,
                            competitionId: action.payload.competitionId,
                            competitionName: action.payload.competitionName
                        });
                    }
                    else {
                        yield call(failSaga, detailResult)
                    }
                }

                else {
                    yield call(failSaga, drawResult)
                }
            }
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

// competition import player and teams
export function* quickCompetitionPlayer(action) {
    try {
        const result = yield call(AxiosApi.importQuickCompetitionPlayer, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.QUICKCOMP_IMPORT_DATA_SUCCESS,
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

// competition add venue saga
export function* quickCompetitionAddVenueSaga(action) {
    try {
        const result = yield call(AxiosApi.addVenueQuickCompetition, action.payload);
        console.log(result)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_QUICK_COMPETITION_ADDVENUE_SUCCESS,
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

//competition get merge quick competition
export function* getMergeCompetitionSaga(action) {
    try {
        const result = yield call(AxiosApi.getMergeCompetitionApi);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_MERGE_COMPETITION_SUCCESS,
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

//competition validate merge quick competition
export function* validateMergeCompetitionSaga(action) {
    try {
        const result = yield call(AxiosApi.validateMergeCompetitionApi, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_VALIDATE_MERGE_COMPETITION_SUCCESS,
                result: result.result.data,
                status: result.status,
                validateSuccess: true,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//competition validate merge quick competition
export function* mergeCompetitionProceedSaga(action) {
    try {
        const result = yield call(AxiosApi.mergeCompetitionProceedApi, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_MERGE_COMPETITION_PROCESS_SUCCESS,
                result: result.result.data,
                status: result.status,
                selectedCompetitionId: action.payload.registrationCompetitionId,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}