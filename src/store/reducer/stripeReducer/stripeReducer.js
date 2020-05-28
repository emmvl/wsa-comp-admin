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
    stripeTransactionPayoutList: [],
    stripeTransactionPayoutListTotalCount: 1,
    stripeTransactionPayoutListPage: 1,
    getInvoicedata: [],
}


//for making charity roundup array
function getCharityRoundUpArray(allData) {
    let getCharityRoundUpArray = []
    let feesAllData = allData[0].fees
    console.log("feesAllData", feesAllData)

    for (let i in feesAllData) {
        let charityObj = {
            competitionId: feesAllData[i].competitionDetail.competitionId,
            competitionName: feesAllData[i].competitionDetail.competitionName,
            charityTitle: feesAllData[i].charityDetail[0].roundUpName,
            charityDetail: feesAllData[i].charityDetail[0],
        }
        getCharityRoundUpArray.push(charityObj)
    }
    console.log("getCharityRoundUpArray", getCharityRoundUpArray)
    return getCharityRoundUpArray
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
            let payoutListData = action.result
            return {
                ...state,
                stripePayoutList: isArrayNotEmpty(payoutListData.payouts) ? payoutListData.payouts : [],
                stripePayoutListTotalCount: payoutListData.totalCount,
                stripePayoutListPage: action.page,
                onLoad: false,
                status: action.status,
                error: null
            };

        /////stripe single payout transaction list
        case ApiConstants.API_GET_STRIPE_TRANSACTION_PAYOUT_LIST_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_STRIPE_TRANSACTION_PAYOUT_LIST_API_SUCCESS:
            let payoutTransactionListData = action.result
            return {
                ...state,
                stripeTransactionPayoutList: isArrayNotEmpty(payoutTransactionListData.payoutTransfers) ? payoutTransactionListData.payoutTransfers : [],
                stripeTransactionPayoutListTotalCount: payoutTransactionListData.totalCount,
                stripeTransactionPayoutListPage: action.page,
                onLoad: false,
                status: action.status,
                error: null
            };

        ///get invoice
        case ApiConstants.API_GET_INVOICE_LOAD:
            return {
                ...state,
                onLoad: true,
                error: null,

            }

        case ApiConstants.API_GET_INVOICE_SUCCESS:
            console.log("getInvoicedata", action.result)
            let invoicedata = isArrayNotEmpty(action.result) ? action.result : []
            let charityRoundUpData = getCharityRoundUpArray(invoicedata)
            console.log("charityRoundUpData", charityRoundUpData)
            return {
                ...state,
                onLoad: false,
                getInvoicedata: action.result
            }
        default:
            return state;
    }
}

export default stripe;
