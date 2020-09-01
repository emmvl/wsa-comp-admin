import { put, call, takeEvery, take } from "redux-saga/effects";
import { message } from "antd";

import AppConstants from "themes/appConstants";
import ApiConstants from "themes/apiConstants";
import ValidationConstants from "themes/validationConstant";
import CommonAxiosApi from "store/http/commonHttp/commonAxios";

function* failSaga(result) {
  yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });

  setTimeout(() => {
    message.config({
      duration: 1.5,
      maxCount: 1
    })
    message.error(result.message);
  }, 800);
}

function* errorSaga(error) {
  yield put({
    type: ApiConstants.API_COMMON_SAGA_ERROR,
    error: error,
    status: error.status
  });

  setTimeout(() => {
    message.config({
      duration: 1.5,
      maxCount: 1
    })
    message.error(AppConstants.somethingWentWrong);
  }, 800);
}

// Get the common year list reference
function* getTimeSlotInitSaga(/* action */) {
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

// Get the common year list reference
function* getCommonDataSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonData);

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

// Add venue
function* addVenueSaga(action) {
  try {
    let venueId = action.data.venueId;
    let screenNavigationKey = action.data.screenNavigationKey;

    const result = yield call(CommonAxiosApi.addVenue, action.data);
    if (result.status === 1) {
      let venueData = result.result.data;
      venueData["screenNavigationKey"] = screenNavigationKey;

      yield put({
        type: ApiConstants.API_ADD_VENUE_SUCCESS,
        result: venueId === 0 ? venueData : null,
        status: result.result.status
      });

      // setTimeout(() => {
      message.success(AppConstants.venueSavedSuccessfully);
      // }, 500);
    } else {
      yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });

      setTimeout(() => {
        message.error(result.result.data.message);
      }, 800);
    }
  } catch (error) {
    setTimeout(() => {
      message.error("Something went wrong!");
    }, 800);

    yield put({
      type: ApiConstants.API_COMMON_SAGA_ERROR,
      error: error,
      status: error.status
    });
  }
}

// Get the Venue list for own competition venue and times
function* venueListSaga(action) {
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

// Get the grades reference data
export function* gradesReferenceListSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.gradesReferenceList);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GRADES_REFERENCE_LIST_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the favourite Team
function* favouriteTeamReferenceSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.favouriteTeamReference);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_FAVOURITE_TEAM_REFERENCE_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Firebird Player List
function* firebirdPlayerReferenceSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.firebirdPlayer);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Registration Other Info List
function* registrationOtherInfoReferenceSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.registrationOtherInfo);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Country List
function* countryReferenceSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.countryReference);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_COUNTRY_REFERENCE_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Nationality Reference List
function* nationalityReferenceSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.nationalityReference);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_NATIONALITY_REFERENCE_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the HeardBy Reference List
function* heardByReferenceSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.heardByReference);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_HEARDBY_REFERENCE_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Player Position Saga
function* playerPositionReferenceSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.playerPosition);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_PLAYER_POSITION_REFERENCE_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Venues list for User Module
function* venuesListSaga(action) {
  try {
    const result = yield call(CommonAxiosApi.getVenuesList, action.data,action.sortBy,action.sortOrder);

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

function* venueByIdSaga(action) {
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

function* venueDeleteSaga(action) {
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

function* getGenderSaga(/* action */) {
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

function* getPhotoTypeSaga(/* action */) {
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

function* getApplyToSaga(/* action */) {
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

function* getExtraTimeDrawSaga(/* action */) {
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

function* getFinalsFixtureTemplateSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.finalsFixtureTemplateRef);

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

// Get the radio meta service for send invites to
function* getSendInvitesSaga(/* action */) {
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

// Get the Venue list for own competition venue and times
function* courtListSaga(action) {
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

function* getAllowTeamRegistrationTypeSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.allowTeamRegistrationTypeRefId);

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

function* RegistrationRestrictionTypeSaga() {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.RegistrationRestrictionType);

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
function* disabilityReferenceSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.disability);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_DISABILITY_REFERENCE_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

function* getCommonInitSaga(action) {
  try {
    const result = yield call(CommonAxiosApi.getCommonInit, action.body);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_COMMON_INIT_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get state reference data
function* getStateReferenceSaga(action) {
  try {
    const result = yield call(CommonAxiosApi.getStateReference, action.body);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_STATE_REFERENCE_DATA_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Registration payment status
function* getRegistrationPaymentStatusSaga(/* action */) {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.paymentStatusReference);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REGISTRATION_PAYMENT_STATUS_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the match print template type
function* getMatchPrintTemplateTypeSaga() {
  try {
    const result = yield call(CommonAxiosApi.getMatchPrintTemplateType, AppConstants.matchPrintTemplateType);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_MATCH_PRINT_TEMPLATE_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the match print template type
function* checkVenueAddressDuplicationSaga(action) {
  try {
    const result = yield call(CommonAxiosApi.checkVenueDuplication, action.body);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_VENUE_ADDRESS_CHECK_DUPLICATION_SUCCESS,
        result: result.result.data,
        status: result.status,
      });

      if (result.result.data.duplicated) {
        message.error(ValidationConstants.duplicatedVenueAddressError);
      }
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Reg Change Type Reference Saga
function* registrationChangeSaga() {
  try {
    const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.registrationChangeRef);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REGISTRATION_CHANGE_TYPE_SUCCESS,
        result: result.result.data,
        status: result.status,
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}


export default function* rootCommonSaga() {
  yield takeEvery(ApiConstants.API_TIME_SLOT_INIT_LOAD, getTimeSlotInitSaga);
  yield takeEvery(ApiConstants.API_GET_COMMON_REF_DATA_LOAD, getCommonDataSaga);
  yield takeEvery(ApiConstants.API_ADD_VENUE_LOAD, addVenueSaga);
  yield takeEvery(ApiConstants.API_VENUE_LIST_LOAD, venueListSaga);
  yield takeEvery(ApiConstants.API_GRADES_REFERENCE_LIST_LOAD, gradesReferenceListSaga);
  yield takeEvery(ApiConstants.API_FAVOURITE_TEAM_REFERENCE_LOAD, favouriteTeamReferenceSaga);
  yield takeEvery(ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_LOAD, firebirdPlayerReferenceSaga);
  yield takeEvery(ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_LOAD, registrationOtherInfoReferenceSaga);
  yield takeEvery(ApiConstants.API_COUNTRY_REFERENCE_LOAD, countryReferenceSaga);
  yield takeEvery(ApiConstants.API_NATIONALITY_REFERENCE_LOAD, nationalityReferenceSaga);
  yield takeEvery(ApiConstants.API_HEARDBY_REFERENCE_LOAD, heardByReferenceSaga);
  yield takeEvery(ApiConstants.API_PLAYER_POSITION_REFERENCE_LOAD, playerPositionReferenceSaga);
  yield takeEvery(ApiConstants.API_VENUES_LIST_LOAD, venuesListSaga);
  yield takeEvery(ApiConstants.API_VENUE_BY_ID_LOAD, venueByIdSaga);
  yield takeEvery(ApiConstants.API_VENUE_DELETE_LOAD, venueDeleteSaga);
  yield takeEvery(ApiConstants.API_GET_GENDER_LOAD, getGenderSaga);
  yield takeEvery(ApiConstants.API_GET_PHOTO_TYPE_LOAD, getPhotoTypeSaga);
  yield takeEvery(ApiConstants.API_GET_APPY_TO_LOAD, getApplyToSaga);
  yield takeEvery(ApiConstants.API_GET_EXTRA_TIME_DRAW_LOAD, getExtraTimeDrawSaga);
  yield takeEvery(ApiConstants.API_GET_FINAL_FIXTURE_TEMPLATE_LOAD, getFinalsFixtureTemplateSaga);
  yield takeEvery(ApiConstants.API_GET_INVITE_TYPE_LOAD, getSendInvitesSaga);
  yield takeEvery(ApiConstants.API_COURT_LIST_LOAD, courtListSaga);
  yield takeEvery(ApiConstants.API_ALLOW_TEAM_REGISTRATION_TYPE_LOAD, getAllowTeamRegistrationTypeSaga);
  yield takeEvery(ApiConstants.API_REGISTRATION_RESTRICTIONTYPE_LOAD, RegistrationRestrictionTypeSaga);
  yield takeEvery(ApiConstants.API_DISABILITY_REFERENCE_LOAD, disabilityReferenceSaga);
  yield takeEvery(ApiConstants.API_GET_COMMON_INIT_LOAD, getCommonInitSaga);
  yield takeEvery(ApiConstants.API_GET_STATE_REFERENCE_DATA_LOAD, getStateReferenceSaga);
  yield takeEvery(ApiConstants.API_REGISTRATION_PAYMENT_STATUS_LOAD, getRegistrationPaymentStatusSaga);
  yield takeEvery(ApiConstants.API_MATCH_PRINT_TEMPLATE_LOAD, getMatchPrintTemplateTypeSaga);
  yield takeEvery(ApiConstants.API_VENUE_ADDRESS_CHECK_DUPLICATION_LOAD, checkVenueAddressDuplicationSaga);
  yield takeEvery(ApiConstants.API_REGISTRATION_CHANGE_TYPE_LOAD, registrationChangeSaga);
}
