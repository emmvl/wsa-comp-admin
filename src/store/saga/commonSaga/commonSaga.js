import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CommonAxiosApi from "../../http/commonHttp/commonAxios";
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../../util/helpers";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";
import AxiosApi from '../../http/registrationHttp/registrationAxios';

function* failSaga(result) {
    yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
    setTimeout(() => {
        alert(result.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_COMMON_SAGA_ERROR,
        error: error,
        status: error.status
    });
}

////get the common year list reference
export function* getTimeSlotInit(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonTimeSlotInit);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_TIME_SLOT_INIT_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}
////get the common year list reference
export function* getCommonDataSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonData);
        console.log(result, 'CommonResult')
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMMON_REF_DATA_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

////addVenueSaga
export function* addVenueSaga(action) {
    try {
        let venueId = action.data.venueId;
        const result = yield call(CommonAxiosApi.addVenue, action.data);
        console.log(result, 'AddVenueSaga' + venueId);
        if (result.status === 1) {
            console.log("*******************************&&&&&" + venueId);
            yield put({
                type: ApiConstants.API_ADD_VENUE_SUCCESS,
                result: venueId == 0 ? result.result.data : null,
                status: result.result.status
            });
            // setTimeout(() => {
            message.success('Successfully Inserted');
            // }, 500);
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        console.log("Error:" + error);
        setTimeout(() => {
            message.error('Something went wrong!');
        }, 800);
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

////get the Venue list for own competition venue and times
export function* venueListSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getVenueList, action.data);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_VENUE_LIST_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

///////get the grades reference data 
export function* gradesReferenceListSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.gradesReferenceList);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GRADES_REFERENCE_LIST_SUCCESS,
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

// Get the favourite Team
export function* favouriteTeamReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.favouriteTeamReference);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_FAVOURITE_TEAM_REFERENCE_SUCCESS,
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

// Get the Firebird Player List
export function* firebirdPlayerReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.firebirdPlayer);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_SUCCESS,
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

// Get the Registration Other Info List
export function* registrationOtherInfoReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.registrationOtherInfo);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_SUCCESS,
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

// Get the Country List
export function* countryReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.countryReference);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COUNTRY_REFERENCE_SUCCESS,
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

// Get the Nationality Reference List
export function* nationalityReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.nationalityReference);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_NATIONALITY_REFERENCE_SUCCESS,
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

// Get the HeardBy Reference List
export function* heardByReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.heardByReference);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_HEARDBY_REFERENCE_SUCCESS,
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

// Get the Player Position Saga
export function* playerPositionReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.playerPosition);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_PLAYER_POSITION_REFERENCE_SUCCESS,
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

////get the Venues list for User Module
export function* venuesListSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getVenuesList, action.data);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_VENUES_LIST_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

export function* venueByIdSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getVenueById, action.data);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_VENUE_BY_ID_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

export function* venueDeleteSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.venueDelete, action.data);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_VENUE_DELETE_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}


export function* getGenderSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getGender);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_GENDER_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}



export function* getPhotoTypeSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.photoType)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_PHOTO_TYPE_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

export function* getAppyToSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.applyToRef)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_APPY_TO_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

export function* getExtraTimeDrawSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.extraTimeDrawRef)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_EXTRA_TIME_DRAW_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

export function* getFinalsFixtureTemplateSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.finalsFixtureTemplateRef)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_FINAL_FIXTURE_TEMPLATE_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

////get the radio meta service for send invites to

export function* getSendInvitesSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.inviteTypeRef)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_INVITE_TYPE_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}
////get the Venue list for own competition venue and times
export function* courtListSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCourtList, action.venueId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COURT_LIST_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

export function* getAllowTeamRegistrationTypeSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.allowTeamRegistrationTypeRefId)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_ALLOW_TEAM_REGISTRATION_TYPE_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

export function* RegistrationRestrictionType() {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.RegistrationRestrictionType)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_REGISTRATION_RESTRICTIONTYPE_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
        } catch (error) {
            yield put({
                type: ApiConstants.API_COMMON_SAGA_ERROR,
                error: error,
                status: error.status
            });
    }  
}

// Get the Disability Reference Saga
export function* disabilityReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.disability);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_DISABILITY_REFERENCE_SUCCESS,
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

export function* getCommonInitSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonInit, action.body);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMMON_INIT_SUCCESS,
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


// Get the Registration payment status
export function* getRegistrationPaymentStatusSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.paymentStatusReference);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_REGISTRATION_PAYMENT_STATUS_SUCCESS,
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

