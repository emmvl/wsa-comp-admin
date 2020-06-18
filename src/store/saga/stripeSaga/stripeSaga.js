import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/stripeHttp/stripeAxios";
import { message } from "antd";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_STRIPE_API_FAIL,
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
        type: ApiConstants.API_STRIPE_API_ERROR,
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



////////stripe payment account balance API
export function* accountBalanceSaga(action) {
    try {
        const result = yield call(AxiosApi.accountBalance, action);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_SUCCESS,
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

/////For stripe charging payment API
export function* chargingPaymentSaga(action) {
    try {
        const result = yield call(AxiosApi.chargingPayment, action.competitionId, action.stripeToken);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_SUCCESS,
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

/////////save stripe account
export function* saveStripeAccountSaga(action) {
    try {
        const result = yield call(AxiosApi.saveStripeAccount, action.code);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_STRIPE_ACCOUNT_API_SUCCESS,
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


///////stripe login link
export function* getStripeLoginLinkSaga(action) {
    try {
        const result = yield call(AxiosApi.getStripeLoginLink, action);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_STRIPE_LOGIN_LINK_API_SUCCESS,
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



///stripe payments transfer list
export function* getStripeTransferListSaga(action) {
    try {
        const result = yield call(AxiosApi.getStripeTransferList, action.page, action.starting_after, action.ending_before);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_STRIPE_PAYMENTS_TRANSFER_LIST_API_SUCCESS,
                result: result.result.data,
                page: action.page,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

/////stripe payout list
export function* getStripePayoutListSaga(action) {
    try {
        const result = yield call(AxiosApi.getStripePayoutList, action.page, action.starting_after, action.ending_before);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_STRIPE_PAYOUT_LIST_API_SUCCESS,
                result: result.result.data,
                page: action.page,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//////stripe single payout transaction list
export function* getTransactionPayoutListSaga(action) {
    try {
        const result = yield call(AxiosApi.getTransactionPayoutList, action.page, action.starting_after, action.ending_before, action.payoutId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_STRIPE_TRANSACTION_PAYOUT_LIST_API_SUCCESS,
                result: result.result.data,
                page: action.page,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}


//get invoice saga
export function* getInvoiceSaga(action) {
    try {
        const result = yield call(AxiosApi.getInvoice, action.registrationid);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_INVOICE_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//get invoice saga
export function* getPaymentListSaga(action) {
    try {
        const result = yield call(AxiosApi.getPaymentList, action.offset);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_PAYMENT_TYPE_LIST_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

