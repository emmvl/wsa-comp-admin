import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../../util/helpers";
import { setOrganisationData, getOrganisationData } from "../../../util/sessionStorage";
import AppConstants from "../../../themes/appConstants";

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
    charityRoundUpFilter: [],
    subTotalFees: 0,
    subTotalGst: 0,
    paymentListData: [],
    paymentListPage: 1,
    paymentListTotalCount: 1


}


//for making charity roundup array
function getCharityRoundUpArray(allData) {
    let getCharityRoundUpArray = []
    let feesAllData = allData[0].fees
    for (let i in feesAllData) {
        let charityObj = {
            competitionId: feesAllData[i].competitionDetail.competitionId,
            competitionName: feesAllData[i].competitionDetail.competitionName,
            charityTitle: isArrayNotEmpty(feesAllData[i].charityDetail) ? feesAllData[i].charityDetail[0].roundUpName : "N/A",
            roundUpDescription: isArrayNotEmpty(feesAllData[i].charityDetail) ? feesAllData[i].charityDetail[0].roundUpDescription : "N/A",
            charityDetail: isArrayNotEmpty(feesAllData[i].charityDetail) ? feesAllData[i].charityDetail : [],
        }
        let competitionIdIndex = getCharityRoundUpArray.findIndex(x => x.competitionId == feesAllData[i].competitionDetail.competitionId)
        if (competitionIdIndex === -1) {
            getCharityRoundUpArray.push(charityObj)
        }

    }
    let charityNoneObject = {
        competitionId: 0,
        competitionName: "None",
        charityTitle: "None",
        roundUpDescription: "",
        charityDetail: [],
    }
    getCharityRoundUpArray.push(charityNoneObject)
    return getCharityRoundUpArray
}

//for calculating subtotal 
function calculateSubTotal(allData) {
    let fees_All_Data = allData[0].fees
    let resultData = {
        invoiceSubtotal: 0,
        invoiceGstTotal: 0
    }
    for (let i in fees_All_Data) {

        if (fees_All_Data[i].totalAmount.affiliateFees && fees_All_Data[i].totalAmount.affiliateGst) {
            resultData.invoiceSubtotal = Number(resultData.invoiceSubtotal) + Number(fees_All_Data[i].totalAmount.affiliateFees) +
                Number(fees_All_Data[i].totalAmount.competitionFees) + Number(fees_All_Data[i].totalAmount.membershipFees)

            resultData.invoiceGstTotal = Number(resultData.invoiceGstTotal) + Number(fees_All_Data[i].totalAmount.affiliateGst) +
                Number(fees_All_Data[i].totalAmount.competitionGst) + Number(fees_All_Data[i].totalAmount.membershipGst)
        }
        else {
            resultData.invoiceSubtotal = Number(resultData.invoiceSubtotal) +
                Number(fees_All_Data[i].totalAmount.competitionFees) + Number(fees_All_Data[i].totalAmount.membershipFees)

            resultData.invoiceGstTotal = Number(resultData.invoiceGstTotal) +
                Number(fees_All_Data[i].totalAmount.competitionGst) + Number(fees_All_Data[i].totalAmount.membershipGst)
        }

    }
    return resultData
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
            let invoicedata = isArrayNotEmpty(action.result) ? action.result : []
            let charityRoundUpData = getCharityRoundUpArray(invoicedata)
            let calculateSubTotalData = calculateSubTotal(invoicedata)
            state.subTotalFees=calculateSubTotalData.invoiceSubtotal
            state.subTotalGst=calculateSubTotalData.invoiceGstTotal
            state.charityRoundUpFilter = charityRoundUpData
            state.getInvoicedata = action.result
            return {
                ...state,
                onLoad: false,
            }

        ///payment listing 
        case ApiConstants.API_PAYMENT_TYPE_LIST_LOAD:
            return { ...state, onLoad: true }

        case ApiConstants.API_PAYMENT_TYPE_LIST_SUCCESS:
            let paymentData = action.result;
            return {
                ...state, onLoad: false,
                paymentListData: paymentData.transactions,
                paymentListTotalCount: paymentData.page.totalCount,
                paymentListPage: paymentData.page
                    ? paymentData.page.currentPage
                    : 1,
            }

        default:
            return state;
    }
}

export default stripe;
