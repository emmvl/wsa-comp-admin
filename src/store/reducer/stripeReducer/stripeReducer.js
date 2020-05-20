import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { setOrganisationData, getOrganisationData } from "../../../util/sessionStorage";

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    accountBalance: null,
    stripeLoginLink: null,
    stripeTransferList: [],
    stripeTransferListPage: 1,
    stripeTransferListTotalCount: 1,
    stripePayoutList: [],
    stripePayoutListTotalCount: 1,
    stripePayoutListPage: 1,
}


function stripe(state = initialState, action) {
    switch (action.type) {

        ///******fail and error handling */
        case ApiConstants.API_STRIPE_API_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_STRIPE_API_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        //////stripe payment account balance API
        case ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_SUCCESS:
            console.log("account balance", action.result)
            return {
                ...state,
                accountBalance: action.result,
                onLoad: false,
                status: action.status,
                error: null
            };


        ////////For stripe charging payment API
        case ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        ///////save stripe account
        case ApiConstants.API_SAVE_STRIPE_ACCOUNT_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_SAVE_STRIPE_ACCOUNT_API_SUCCESS:
            let orgData = isArrayNotEmpty(action.result.organisationId) ? action.result.organisationId[0] : getOrganisationData()
            setOrganisationData(orgData)
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////stripe login link
        case ApiConstants.API_GET_STRIPE_LOGIN_LINK_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_STRIPE_LOGIN_LINK_API_SUCCESS:
            return {
                ...state,
                stripeLoginLink: action.result,
                onLoad: false,
                status: action.status,
                error: null
            };

        /////stripe payments transfer list
        case ApiConstants.API_GET_STRIPE_PAYMENTS_TRANSFER_LIST_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_STRIPE_PAYMENTS_TRANSFER_LIST_API_SUCCESS:
            console.log("action.result", action)
            let transferListData = action.result
            return {
                ...state,
                stripeTransferList: isArrayNotEmpty(transferListData.transfers) ? transferListData.transfers : [],
                stripeTransferListTotalCount: transferListData.totalCount,
                stripeTransferListPage: action.page,
                onLoad: false,
                status: action.status,
                error: null
            };

        /////stripe payout list
        case ApiConstants.API_GET_STRIPE_PAYOUT_LIST_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_STRIPE_PAYOUT_LIST_API_SUCCESS:
            console.log("action.result", action)
            let payoutListData = action.result
            return {
                ...state,
                stripePayoutList: isArrayNotEmpty(payoutListData.payouts) ? payoutListData.payouts : [],
                stripePayoutListTotalCount: payoutListData.totalCounnt,
                stripePayoutListPage: action.page,
                onLoad: false,
                status: action.status,
                error: null
            };
        default:
            return state;
    }
}

export default stripe;
