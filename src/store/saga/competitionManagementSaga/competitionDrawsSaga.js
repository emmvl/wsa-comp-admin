import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import RegstrartionAxiosApi from "../../http/registrationHttp/registrationAxios";
import { message } from "antd";
import history from "../../../util/history";


function* failSaga(result) {
    yield put({ type: ApiConstants.API_COMPETITION_DRAWS_FAIL });
    setTimeout(() => {
        // alert(result.message);
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_COMPETITION_DRAWS_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went wrong.")
}

///////get competition draws
export function* getCompetitionDrawsSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getCompetitionDraws,
            action.yearRefId, action.competitionId, action.venueId, action.roundId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMPETITION_DRAWS_SUCCESS,
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

////get rounds in the competition draws
export function* getDrawsRoundsSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getDrawsRounds,
            action.yearRefId, action.competitionId);
        if (result.status === 1) {
            const VenueResult = yield call(RegstrartionAxiosApi.getCompetitionVenue, action.competitionId);
            if (VenueResult.status === 1) {
                const division_Result = yield call(CompetitionAxiosApi.getDivisionGradeNameList, action.competitionId);
                if (division_Result.status === 1) {
                    yield put({
                        type: ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_SUCCESS,
                        result: result.result.data,
                        Venue_Result: VenueResult.result.data,
                        division_Result: division_Result.result.data,
                        status: result.status,
                    });
                } else {
                    yield put({
                        type: ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_SUCCESS,
                        result: result.result.data,
                        Venue_Result: VenueResult.result.data,
                        division_Result: [],
                        status: result.status,
                    });
                }
            }
            else {
                yield put({
                    type: ApiConstants.API_GET_COMPETITION_DRAWS_ROUNDS_SUCCESS,
                    result: result.result.data,
                    Venue_Result: [],
                    division_Result: [],
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

//// Update Competition Draws

export function* updateCompetitionDraws(action) {
    try {
        const result = yield call(CompetitionAxiosApi.updateDraws, action.data);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UPDATE_COMPETITION_DRAWS_SUCCESS,
                result: result.result.data,
                status: result.status,
                sourceArray: action.sourceArray,
                targetArray: action.targetArray,
                actionType: action.actionType,
                drawData: action.drawData
            });
            message.success(result.result.data.message)
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)

    }



}

///// Save Draws saga
export function* saveDrawsSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.saveDrawsApi, action.yearId, action.competitionId, action.drawsMasterId);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UPDATE_COMPETITION_SAVE_DRAWS_SUCCESS,
                result: result.result.data,
                status: result.status,

            });
            message.success(result.result.data.message)
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)

    }



}

//// Get Competition venues saga

export function* getCompetitionVenues(action) {
    try {
        const result = yield call(RegstrartionAxiosApi.getCompetitionVenue, action.competitionId);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMPETITION_VENUES_SUCCESS,
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


//////////update draws court timing where N/A(null) is there

export function* updateCourtTimingsDrawsAction(action) {
    try {
        const result = yield call(CompetitionAxiosApi.updateCourtTimingsDrawsAction, action.data);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UPDATE_COMPETITION_DRAWS_COURT_TIMINGS_SUCCESS,
                result: result.result.data,
                status: result.status,
                sourceArray: action.sourceArray,
                targetArray: action.targetArray,
                actionType: action.actionType,
                drawData: action.drawData
            });
            // message.success(result.result.data.message)
            // console.log(action.actionType)
            // if (action.actionType == "exception") {
            //     history.push('/competitionDraws')
            // }

        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)

    }



}


////draws division grade names list

export function* getDivisionGradeNameListSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getDivisionGradeNameList, action.competitionId);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_DRAWS_DIVISION_GRADE_NAME_LIST_SUCCESS,
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

export function* publishDraws(action) {
    try {
        const result = yield call(CompetitionAxiosApi.publishDrawsApi, action.competitionId);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_DRAW_PUBLISH_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            if (action.key == "edit") {
                history.push('/competitionDraws')
            }

        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)

    }
}

export function* drawsMatchesListExportSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.drawsMatchesListApi, action.competitionId);
        console.log("(*****" + result.status);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_DRAW_MATCHES_LIST_SUCCESS,
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
export function* getDivisionSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getDivisionGradeNameList, action.competitionId);
        if (result.status === 1) {

            yield put({
                type: ApiConstants.API_GET_DIVISION_SUCCESS,
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

export function* competitionFixtureSaga(action) {
    try {
        const result = yield call(CompetitionAxiosApi.getFixtureData, action.yearId, action.competitionId, action.competitionDivisionGradeId);
        if (result.status === 1) {

            yield put({
                type: ApiConstants.API_GET_FIXTURE_SUCCESS,
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

//// Update Competition Draws

export function* updateCompetitionFixtures(action) {
    try {
        const result = yield call(CompetitionAxiosApi.updateFixture, action.data);

        if (result.status === 1) {
            const fixtureResult = yield call(CompetitionAxiosApi.getFixtureData, action.yearId, action.competitionId, action.competitionDivisionGradeId);
            if (fixtureResult.status === 1) {
                yield put({
                    type: ApiConstants.API_UPDATE_COMPETITION_FIXTURE_SUCCESS,
                    result: result.result.data,
                    status: result.status,
                    fixtureResult: fixtureResult.result.data,
                    sourceArray: action.sourceArray,
                    targetArray: action.targetArray,
                    roundId: action.roundId
                });

            } else
                yield put({
                    type: ApiConstants.API_UPDATE_COMPETITION_FIXTURE_SUCCESS,
                    result: result.result.data,
                    status: result.status,
                    sourceArray: action.sourceArray,
                    targetArray: action.targetArray,
                    roundId: action.roundId
                });
            message.success(result.result.data.message)
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)

    }



}


//////////update draws court timing where N/A(null) is there
export function* updateDrawsLock(action) {
    try {
        const result = yield call(CompetitionAxiosApi.updateDrawsLock, action.drawsId);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_UPDATE_DRAWS_LOCK_SUCCESS,
                result: result.result.data,
                status: result.status,
                roundId: action.roundId,
                drawsId: action.drawsId,
                venueCourtId: action.venueCourtId
            });
            message.success(result.result.data.message)

        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)

    }
}