import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import userHttpApi from "../../http/userHttp/userAxiosApi";
import { message } from "antd";
import { setAuthToken } from "../../../util/sessionStorage";

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

export function* getRoleSaga(action) {
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

///////Ure Saga///////
export function* getUreSaga(action) {
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


/* Get the Affiliates Listing  */
export function* getAffiliatesListingSaga(action) {
    try {
        const result = yield call(userHttpApi.affiliatesListing, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATES_LISTING_SUCCESS,
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

/* Save the Affilaite Saga */
export function* saveAffiliateSaga(action) {
    try {
        const result = yield call(
            userHttpApi.saveAffiliate,
            action.payload
        );
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_AFFILIATE_SUCCESS,
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

/* Get the Affiliate by Organisation Id  */
export function* getAffiliateByOrganisationIdSaga(action) {
    try {
        const result = yield call(userHttpApi.affiliateByOrganisationId, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATE_BY_ORGANISATION_SUCCESS,
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

/* Get the Affiliate Our Organisation Id  */
export function* getAffiliateOurOrganisationIdSaga(action) {
    try {
        const result = yield call(userHttpApi.affiliateByOrganisationId, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATE_OUR_ORGANISATION_SUCCESS,
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

/* Get the AffiliatedToOrganisation  */
export function* getAffiliatedToOrganisationSaga(action) {
    try {
        const result = yield call(userHttpApi.affiliateToOrganisation, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATE_TO_ORGANISATION_SUCCESS,
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

// getOrganisationForVenueSaga 
export function* getOrganisationForVenueSaga(action) {
    try {
        const result = yield call(userHttpApi.getVenueOrganisation);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_ORGANISATION_SUCCESS,
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

/* Delete Affiliate  */
export function* deleteAffiliateSaga(action) {
    try {
        const result = yield call(userHttpApi.affiliateDelete, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATE_DELETE_SUCCESS,
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



//get particular user organisation 
export function* getUserOrganisationSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserOrganisation);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_USER_ORGANISATION_SUCCESS,
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


/* Get the User Dashboard Textual Listing  */
export function* getUserDashboardTextualListingSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserDashboardTextualListing, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_DASHBOARD_TEXTUAL_SUCCESS,
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

/* Get the User Module Personal Data */
export function* getUserModulePersonalDataSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModulePersonalData, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_SUCCESS,
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

/* Get the User Module Personal by Competition Data */
export function* getUserModulePersonalByCompDataSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModulePersonalByCompData, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_SUCCESS,
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

/* Get the User Module Medical Info */
export function* getUserModuleMedicalInfoSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleMedicalInfo, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_MEDICAL_INFO_SUCCESS,
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

/* Get the User Module Registration by Competition Data */
export function* getUserModuleRegistrationDataSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleRegistrationData, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_REGISTRATION_SUCCESS,
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

/* Get the User Module Activity Player */
export function* getUserModuleActivityPlayerSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleActivityPlayer, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_SUCCESS,
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

/* Get the User Module Activity Parent */
export function* getUserModuleActivityParentSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleActivityParent, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_SUCCESS,
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

/* Get the User Module Activity Scorer */
export function* getUserModuleActivityScorerSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleActivityScorer, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_SUCCESS,
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

/* Get the User Module Activity Manager */
export function* getUserModuleActivityManagerSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleActivityManager, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_SUCCESS,
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

/* Get the User  Friend List */
export function* getUserFriendListSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserFriendList, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_FRIEND_SUCCESS,
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

/* Get the User Refer Friend List  */
export function* getUserReferFriendListSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserReferFriendList, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_REFER_FRIEND_SUCCESS,
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

/* Get the Org Photos List  */
export function* getOrgPhotosListSaga(action) {
    try {
        const result = yield call(userHttpApi.getOrgPhotosList, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_ORG_PHOTO_SUCCESS,
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

/* Save the Org Photos   */
export function* saveOrgPhotosSaga(action) {
    try {
        const result = yield call(userHttpApi.saveOrgPhoto, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_ORG_PHOTO_SUCCESS,
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

/* Delete the Org Photos   */
export function* deleteOrgPhotosSaga(action) {
    try {
        const result = yield call(userHttpApi.deleteOrgPhoto, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_DELETE_ORG_PHOTO_SUCCESS,
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

/* Delete Org Contact   */
export function* deleteOrgContactSaga(action) {
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
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

/* Export Organisation Registration Quesations */
export function* exportOrgRegQuestionsSaga(action) {
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
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

/* Get the Affiliate Directory  */
export function* getAffiliateDirectorySaga(action) {
    try {
        const result = yield call(userHttpApi.affiliateDirectory, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATE_DIRECTORY_SUCCESS,
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

export function* exportAffiliateDirectorySaga(action) {
    try {
        const result = yield call(userHttpApi.exportAffiliateDirectory, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_EXPORT_AFFILIATE_DIRECTORY_SUCCESS,
                result: result.result.data,
                status: result.status
            });
          //  message.success(result.result.data.message);
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* updateUserProfileSaga(action) {
    try {
        const result = yield call(userHttpApi.updateUserProfile, action.data);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_PROFILE_UPDATE_SUCCESS,
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

/* Get the User History */
export function* getUserHistorySaga(action) {
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

/* Save the User Photo */
export function* saveUserPhotosSaga(action) {
    try {
        const result = yield call(userHttpApi.saveUserPhoto, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_PHOTO_UPDATE_SUCCESS,
                result: result.result.data[0],
                status: result.status
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

/* Get the User Detail */
export function* getUserDetailSaga() {
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

/* Save the User Detail */
export function* saveUserDetailSaga(action) {
    try {
        const result = yield call(userHttpApi.saveUserDetail, action.payload);
        if (result.status === 1) {
            setAuthToken(result.result.data.authToken);

            yield put({
                type: ApiConstants.API_USER_DETAIL_UPDATE_SUCCESS,
                result: result.result.data.user,
                status: result.status
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

/* Update the User Password */
export function* updateUserPasswordSaga(action) {
    try {
        const result = yield call(userHttpApi.updateUserPassword, action.payload);
        if (result.status === 1) {
            setAuthToken(result.result.data.authToken);

            yield put({
                type: ApiConstants.API_USER_PASSWORD_UPDATE_SUCCESS,
                result: result.result.data.user,
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