import { put, call, takeEvery } from "redux-saga/effects";
import { message } from "antd";

import ApiConstants from "../../themes/apiConstants";
import { setAuthToken } from "../../util/sessionStorage";
import userHttpApi from "../http/userHttp/userAxiosApi";
import commonAxiosApi from "../http/axiosApi";

function* failSaga(result) {
  yield put({
    type: ApiConstants.API_USER_FAIL,
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
    type: ApiConstants.API_USER_ERROR,
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

function* getRoleSaga(action) {
  try {
    const result = yield call(userHttpApi.role, action);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_ROLE_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield put({ type: ApiConstants.API_APP_FAIL });

      setTimeout(() => {
        alert(result.data.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.API_APP_ERROR,
      error: error,
      status: error.status
    });
  }
}

function* getUreSaga(action) {
  try {
    const result = yield call(userHttpApi.ure, action);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_URE_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield put({ type: ApiConstants.API_APP_FAIL });

      setTimeout(() => {
        alert(result.data.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.API_APP_ERROR,
      error: error,
      status: error.status
    });
  }
}

// Get the Affiliates Listing
function* getAffiliatesListingSaga(action) {
  try {
    const result = yield call(userHttpApi.affiliatesListing, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_AFFILIATES_LISTING_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Save the Affiliate Saga
function* saveAffiliateSaga(action) {
  try {
    const result = yield call(userHttpApi.saveAffiliate, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_SAVE_AFFILIATE_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Affiliate by Organisation Id 
function* getAffiliateByOrganisationIdSaga(action) {
  try {
    const result = yield call(userHttpApi.affiliateByOrganisationId, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_AFFILIATE_BY_ORGANISATION_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Affiliate Our Organisation Id 
function* getAffiliateOurOrganisationIdSaga(action) {
  try {
    const resultcharity = yield call(commonAxiosApi.getCharityRoundUp, action);

    if (resultcharity.status === 1) {
      const result = yield call(userHttpApi.affiliateByOrganisationId, action.payload);

      if (result.status === 1) {
        yield put({
          type: ApiConstants.API_AFFILIATE_OUR_ORGANISATION_SUCCESS,
          result: result.result.data,
          charityResult: resultcharity.result.data,
          status: result.status
        });
      } else {
        yield call(failSaga, result);
      }
    }

  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get affiliated to organisation
function* getAffiliatedToOrganisationSaga(action) {
  try {
    const result = yield call(userHttpApi.affiliateToOrganisation, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_AFFILIATE_TO_ORGANISATION_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get Organisation for Venue
function* getOrganisationForVenueSaga(action) {
  try {
    const result = yield call(userHttpApi.getVenueOrganisation);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_ORGANISATION_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Delete Affiliate 
function* deleteAffiliateSaga(action) {
  try {
    const result = yield call(userHttpApi.affiliateDelete, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_AFFILIATE_DELETE_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get particular user organisation
function* getUserOrganisationSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserOrganisation);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_USER_ORGANISATION_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Dashboard Textual Listing 
function* getUserDashboardTextualListingSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserDashboardTextualListing, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_DASHBOARD_TEXTUAL_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Module Personal Data
function* getUserModulePersonalDataSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserModulePersonalData, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Module Personal by Competition Data
function* getUserModulePersonalByCompDataSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserModulePersonalByCompData, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Module Medical Info
function* getUserModuleMedicalInfoSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserModuleMedicalInfo, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_MODULE_MEDICAL_INFO_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Module Registration by Competition Data
function* getUserModuleRegistrationDataSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserModuleRegistrationData, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_MODULE_REGISTRATION_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Module Activity Player
function* getUserModuleActivityPlayerSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserModuleActivityPlayer, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Module Activity Parent
function* getUserModuleActivityParentSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserModuleActivityParent, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Module Activity Scorer
function* getUserModuleActivityScorerSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserModuleActivityScorer, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Module Activity Manager
function* getUserModuleActivityManagerSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserModuleActivityManager, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User  Friend List
function* getUserFriendListSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserFriendList, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_FRIEND_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Refer Friend List 
function* getUserReferFriendListSaga(action) {
  try {
    const result = yield call(userHttpApi.getUserReferFriendList, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_REFER_FRIEND_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Org Photos List 
function* getOrgPhotosListSaga(action) {
  try {
    const result = yield call(userHttpApi.getOrgPhotosList, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_ORG_PHOTO_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Save the Org Photos  
function* saveOrgPhotosSaga(action) {
  try {
    const result = yield call(userHttpApi.saveOrgPhoto, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_SAVE_ORG_PHOTO_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Delete the Org Photos  
function* deleteOrgPhotosSaga(action) {
  try {
    const result = yield call(userHttpApi.deleteOrgPhoto, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_DELETE_ORG_PHOTO_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Delete Org Contact  
function* deleteOrgContactSaga(action) {
  try {
    const result = yield call(userHttpApi.deleteOrgContact, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_DELETE_ORG_CONTACT_SUCCESS,
        result: result.result.data,
        status: result.status
      });

      message.success(result.result.data.message);
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Export Organisation Registration Questions
function* exportOrgRegQuestionsSaga(action) {
  try {
    const result = yield call(userHttpApi.exportOrgRegQuestions, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_EXPORT_ORG_REG_QUESTIONS_SUCCESS,
        result: result.result.data,
        status: result.status
      });

      //  message.success(result.result.data.message);
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the Affiliate Directory 
function* getAffiliateDirectorySaga(action) {
  try {
    const result = yield call(userHttpApi.affiliateDirectory, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_AFFILIATE_DIRECTORY_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

function* exportAffiliateDirectorySaga(action) {
  try {
    const result = yield call(userHttpApi.exportAffiliateDirectory, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_EXPORT_AFFILIATE_DIRECTORY_SUCCESS,
        result: result.result.data,
        status: result.status
      });

      // message.success(result.result.data.message);
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

function* updateUserProfileSaga(action) {
  try {
    const result = yield call(userHttpApi.updateUserProfile, action.data);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_PROFILE_UPDATE_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User History
function* getUserHistorySaga(action) {
  try {
    const result = yield call(userHttpApi.getUserHistory, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_MODULE_HISTORY_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Save the User Photo
function* saveUserPhotosSaga(action) {
  try {
    const result = yield call(userHttpApi.saveUserPhoto, action.payload);

    if (result.status === 1) {
      if (action.userDetail) {
        yield call(saveUserDetailSaga, { payload: action.userDetail });
      } else {
        message.success('Photo is updated successfully.');
      }

      yield put({
        type: ApiConstants.API_USER_PHOTO_UPDATE_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Get the User Detail
function* getUserDetailSaga() {
  try {
    const result = yield call(userHttpApi.getUserDetail);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_DETAIL_SUCCESS,
        result: result.result.data,
        status: result.status
      });
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Save User Detail
function* saveUserDetailSaga(action) {
  try {
    const result = yield call(userHttpApi.saveUserDetail, action.payload);

    if (result.status === 1) {
      setAuthToken(result.result.data.authToken);

      yield put({
        type: ApiConstants.API_USER_DETAIL_UPDATE_SUCCESS,
        result: result.result.data.user,
        status: result.status
      });

      message.success('Profile is updated successfully.');
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

// Update User Password
function* updateUserPasswordSaga(action) {
  try {
    const result = yield call(userHttpApi.updateUserPassword, action.payload);

    if (result.status === 1) {
      setAuthToken(result.result.data.authToken);

      yield put({
        type: ApiConstants.API_USER_PASSWORD_UPDATE_SUCCESS,
        result: result.result.data.user,
        status: result.status
      });

      message.success('Password is updated successfully.');
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

function* updateCharitySaga(action) {
  try {
    const result = yield call(userHttpApi.updateCharity, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_UPDATE_CHARITY_ROUND_UP_SUCCESS,
        result: result.result.data,
        status: result.status
      });

      message.success('Charity updated successfully');
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

function* updateTermsAndConditionsSaga(action) {
  try {
    const result = yield call(userHttpApi.updateTermsAndConditions, action.payload);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_UPDATE_TERMS_AND_CONDITION_SUCCESS,
        result: result.result.data,
        status: result.status
      });

      message.success('Terms and Conditions updated successfully');
    } else {
      yield call(failSaga, result);
    }
  } catch (error) {
    yield call(errorSaga, error);
  }
}

export default function* rootUserSaga() {
  yield takeEvery(ApiConstants.API_ROLE_LOAD, getRoleSaga);
  yield takeEvery(ApiConstants.API_URE_LOAD, getUreSaga);
  yield takeEvery(ApiConstants.API_AFFILIATES_LISTING_LOAD, getAffiliatesListingSaga);
  yield takeEvery(ApiConstants.API_SAVE_AFFILIATE_LOAD, saveAffiliateSaga);
  yield takeEvery(ApiConstants.API_AFFILIATE_BY_ORGANISATION_LOAD, getAffiliateByOrganisationIdSaga);
  yield takeEvery(ApiConstants.API_AFFILIATE_OUR_ORGANISATION_LOAD, getAffiliateOurOrganisationIdSaga);
  yield takeEvery(ApiConstants.API_AFFILIATE_TO_ORGANISATION_LOAD, getAffiliatedToOrganisationSaga);
  yield takeEvery(ApiConstants.API_ORGANISATION_LOAD, getOrganisationForVenueSaga);
  yield takeEvery(ApiConstants.API_AFFILIATE_DELETE_LOAD, deleteAffiliateSaga);
  yield takeEvery(ApiConstants.API_GET_USER_ORGANISATION_LOAD, getUserOrganisationSaga);
  yield takeEvery(ApiConstants.API_USER_DASHBOARD_TEXTUAL_LOAD, getUserDashboardTextualListingSaga);
  yield takeEvery(ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD, getUserModulePersonalDataSaga);
  yield takeEvery(ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD, getUserModulePersonalByCompDataSaga);
  yield takeEvery(ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD, getUserModuleMedicalInfoSaga);
  yield takeEvery(ApiConstants.API_USER_MODULE_REGISTRATION_LOAD, getUserModuleRegistrationDataSaga);
  yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD, getUserModuleActivityPlayerSaga);
  yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD, getUserModuleActivityParentSaga);
  yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD, getUserModuleActivityScorerSaga);
  yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD, getUserModuleActivityManagerSaga);
  yield takeEvery(ApiConstants.API_USER_FRIEND_LOAD, getUserFriendListSaga);
  yield takeEvery(ApiConstants.API_USER_REFER_FRIEND_LOAD, getUserReferFriendListSaga);
  yield takeEvery(ApiConstants.API_GET_ORG_PHOTO_LOAD, getOrgPhotosListSaga);
  yield takeEvery(ApiConstants.API_SAVE_ORG_PHOTO_LOAD, saveOrgPhotosSaga);
  yield takeEvery(ApiConstants.API_DELETE_ORG_PHOTO_LOAD, deleteOrgPhotosSaga);
  yield takeEvery(ApiConstants.API_DELETE_ORG_CONTACT_LOAD, deleteOrgContactSaga);
  yield takeEvery(ApiConstants.API_EXPORT_ORG_REG_QUESTIONS_LOAD, exportOrgRegQuestionsSaga);
  yield takeEvery(ApiConstants.API_AFFILIATE_DIRECTORY_LOAD, getAffiliateDirectorySaga);
  yield takeEvery(ApiConstants.API_EXPORT_AFFILIATE_DIRECTORY_LOAD, exportAffiliateDirectorySaga);
  yield takeEvery(ApiConstants.API_USER_PROFILE_UPDATE_LOAD, updateUserProfileSaga);
  yield takeEvery(ApiConstants.API_USER_MODULE_HISTORY_LOAD, getUserHistorySaga);
  yield takeEvery(ApiConstants.API_USER_PHOTO_UPDATE_LOAD, saveUserPhotosSaga);
  yield takeEvery(ApiConstants.API_USER_DETAIL_LOAD, getUserDetailSaga);
  yield takeEvery(ApiConstants.API_USER_DETAIL_UPDATE_LOAD, saveUserDetailSaga);
  yield takeEvery(ApiConstants.API_USER_PASSWORD_UPDATE_LOAD, updateUserPasswordSaga);
  yield takeEvery(ApiConstants.API_UPDATE_CHARITY_ROUND_UP_LOAD, updateCharitySaga);
  yield takeEvery(ApiConstants.API_UPDATE_TERMS_AND_CONDITION_LOAD, updateTermsAndConditionsSaga);
}
