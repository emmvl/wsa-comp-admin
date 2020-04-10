import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/registrationHttp/registrationAxios";
import commonAxiosApi from "../../http/axiosApi";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { message } from "antd";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_COMPETITION_FEES_FAIL,
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
        type: ApiConstants.API_COMPETITION_FEES_ERROR,
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

//////get the competition fee list in registration
export function* regCompetitionFeeListSaga(action) {
    try {
        const result = yield call(AxiosApi.registrationCompetitionFeeList, action.offset, action.yearRefId, action.searchText);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_REG_COMPETITION_LIST_SUCCESS,
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


//////delete the competition list product
export function* regCompetitionFeeListDeleteSaga(action) {
    try {
        const result = yield call(
            AxiosApi.registrationCompetitionFeeListDelete,
            action.competitionId
        );
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_REG_COMPETITION_LIST_DELETE_SUCCESS,
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

/////get the competition fees all the data in one API
export function* getAllCompetitionFeesDeatilsSaga(action) {
    try {
        const resultcharity = isArrayNotEmpty(action.charityRoundup) ? { status: 1, resultcharity: { data: action.charityRoundup } } : yield call(commonAxiosApi.getCharityRoundUp, action);
        const govtVoucherResult = isArrayNotEmpty(action.govtVoucher) ? { status: 1, govtVoucherResult: { data: action.govtVoucher } } : yield call(commonAxiosApi.getGovtVouchers, action);
        if (resultcharity.status === 1) {
            yield put({
                type: ApiConstants.API_REG_COMPETITION_FEE_DEFAULT_CHARITY_SUCCESS,
                charityResult: resultcharity.result.data,
                govtVoucherResult: govtVoucherResult.result.data,
                status: resultcharity.status
            });
            const resultData = yield call(
                AxiosApi.getDefaultCompFeesMembershipProduct, action.hasRegistration
            );
            if (resultData.status === 1) {
                yield put({
                    type: ApiConstants.API_GET_DEFAULT_COMPETITION_FEES_MEMBERHSIP_PRODUCT_SUCCESS,
                    result: resultData.result.data,
                    status: resultData.status
                });

                const result = yield call(
                    AxiosApi.getAllCompetitionFeesDeatils,
                    action.competitionId
                );
                if (result.status === 1) {
                    yield put({
                        type: ApiConstants.API_GET_COMPETITION_FEES_DETAILS_SUCCESS,
                        result: result.result.data,
                        status: result.status
                    });
                }
                else {
                    yield call(failSaga, result)

                }

            }
            else {
                yield call(failSaga, resultData)
            }
        }
        else {
            yield call(failSaga, resultcharity)
        }
    } catch (error) {
        console.log("error", error)
        yield call(errorSaga, error)
    }
}




////get default competition membershipproduct tab details
export function* getDefaultCompFeesMembershipProductSaga(action) {
    try {
        const result = yield call(
            AxiosApi.getDefaultCompFeesMembershipProduct, action.hasRegistration
        );
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_DEFAULT_COMPETITION_FEES_MEMBERHSIP_PRODUCT_SUCCESS,
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
///////////save the competition fees deatils 
export function* saveCompetitionFeesDetailsSaga(action) {
    try {
        const result = yield call(
            AxiosApi.saveCompetitionFeesDetails,
            action.payload
        );
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_COMPETITION_FEES_DETAILS_SUCCESS,
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

/////save the competition membership tab details
export function* saveCompetitionFeesMembershipTabSaga(action) {
    try {
        const result = yield call(
            AxiosApi.saveCompetitionFeesMembershipTab,
            action.payload,
            action.competitionId
        );
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_COMPETITION_FEES_MEMBERHSIP_TAB_SUCCESS,
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




/////save the division table data  in the competition fees section
export function* saveCompetitionFeesDivisionSaga(action) {
    try {
        const result = yield call(
            AxiosApi.saveCompetitionFeesDivisionAction,
            action.payload,
            action.competitionId
        );
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_COMPETITION_FEES_DIVISION_TAB_SUCCESS,
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


///////competition format types in the competition fees section from the reference table
export function* getCasualFeeDefault(action) {
    try {

        const casualPaymentOption = yield call(commonAxiosApi.getCasualPayment, action);

        if (casualPaymentOption.status === 1) {
            yield put({
                type: ApiConstants.GET_CASUAL_FEE_DETAIL_API_SUCCESS,
                casualPaymentOptionResult: casualPaymentOption.result.data,
                // seasonalPaymentOptionResult: seasonalPaymentOption.result.data,
                status: casualPaymentOption.status
            });
        } else {
            yield call(failSaga, casualPaymentOption)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}



///////competition format types in the competition fees section from the reference table
export function* getSeasonalFeeDefault(action) {
    try {
        const seasonalPaymentOption = yield call(commonAxiosApi.getSeasonalPayment, action)
        if (seasonalPaymentOption.status === 1) {
            yield put({
                type: ApiConstants.GET_SEASONAL_FEE_DETAIL_API_SUCCESS,
                seasonalPaymentOptionResult: seasonalPaymentOption.result.data,
                status: seasonalPaymentOption.status
            });
        } else {
            yield call(failSaga, seasonalPaymentOption)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* postPaymentOptionSaga(action) {
    try {
        const result = yield call(AxiosApi.postCompetitionPayment, action.value, action.competitionId)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_POST_COMPETITION_FEE_PAYMENT_SUCCESS,
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


//// Save Competition fee - section
export function* saveCompetitionFeesSection(action) {
    try {
        const result = yield call(AxiosApi.postCompetitionFeeSection, action.data, action.competitionId)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_COMPETITION_FEES_SECTION_SUCCESS,
                result: result.result.data,
                status: result.status
            })
            message.success(result.result.data.message);
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* postCompetitonDiscountSaga(action) {
    try {
        const result = yield call(AxiosApi.postCompetitonFeeDiscount, action.payload, action.competitionId)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_POST_COMPETITION_FEE_DISCOUNT_SUCCESS,
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

export function* defaultCompetitionDiscountSaga(action) {
    try {
        const result = yield call(AxiosApi.competitionFeeDiscountTypes, action);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COMPETITION_DISCOUNT_TYPE_SUCCESS,
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

export function* defaultCharity_voucherSaga(action) {
    try {
        const result = yield call(commonAxiosApi.getCharityRoundUp, action);
        const govtVoucherResult = yield call(commonAxiosApi.getGovtVouchers, action)

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COMPETITION_FEE_DEFAULT_CHARITY_SUCCESS,
                charityResult: result.result.data,
                govtVoucherResult: govtVoucherResult.result.data,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

/////get the default competition logo api
export function* getDefaultCompFeesLogoSaga(action) {
    try {
        const result = yield call(AxiosApi.getDefaultCompFeesLogo, action);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COMPETITION_FEE_DEFAULT_LOGO_SUCCESS,
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



