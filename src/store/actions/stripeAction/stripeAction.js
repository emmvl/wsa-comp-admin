import ApiConstants from "../../../themes/apiConstants";

//////stripe payment account balance API
function accountBalanceAction() {
    const action = {
        type: ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_LOAD,
    };
    return action;
}
//For stripe charging payment API
function chargingPaymentAction(competitionId, stripeToken) {
    const action = {
        type: ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_LOAD,
        competitionId,
        stripeToken
    };
    return action;
}
//save stripe account
function saveStripeAccountAction(code) {
    const action = {
        type: ApiConstants.API_SAVE_STRIPE_ACCOUNT_API_LOAD,
        code
    };
    return action;
}

////stripe login link
function getStripeLoginLinkAction() {
    const action = {
        type: ApiConstants.API_GET_STRIPE_LOGIN_LINK_API_LOAD,
    };
    return action;
}

////stripe payments transfer list
function getStripeTransferListAction(page, starting_after, ending_before, params) {
    const action = {
        type: ApiConstants.API_GET_STRIPE_PAYMENTS_TRANSFER_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        params
    };
    return action;
}

////stripe payout list
function getStripePayoutListAction(page, starting_after, ending_before, params) {
    const action = {
        type: ApiConstants.API_GET_STRIPE_PAYOUT_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        params
    };
    return action;
}

////stripe single payout transaction list
function getTransactionPayoutListAction(page, starting_after, ending_before, payoutId) {
    const action = {
        type: ApiConstants.API_GET_STRIPE_TRANSACTION_PAYOUT_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        payoutId

    };
    return action;
}

/////get invoice 
function getInvoice(registrationid) {
    const action = {
        type: ApiConstants.API_GET_INVOICE_LOAD,
        registrationid
    }
    return action
}

/// payment dashboard
function getPaymentList(
    offset,
    sortBy,
    sortOrder,
    userId,
    registrationId,
    yearId,
    competitionKey,
    paymentFor,
    dateFrom,
    dateTo,
    searchValue,
    feeType,
    paymentType,
    paymentMethod,
    membershipType
) {
    const action = {
        type: ApiConstants.API_PAYMENT_TYPE_LIST_LOAD,
        offset,
        sortBy,
        sortOrder,
        userId,
        registrationId,
        yearId,
        competitionKey,
        paymentFor,
        dateFrom,
        dateTo,
        searchValue,
        feeType,
        paymentType,
        paymentMethod,
        membershipType
    }
    return action
}

//export payment dashboard data
function exportPaymentApi(key) {
    const action = {
        type: ApiConstants.API_PAYMENT_DASHBOARD_EXPORT_LOAD,
        key
    }
    return action
}

export {
    accountBalanceAction,
    chargingPaymentAction,
    saveStripeAccountAction,
    getStripeLoginLinkAction,
    getStripeTransferListAction,
    getStripePayoutListAction,
    getTransactionPayoutListAction,
    getInvoice, getPaymentList,
    exportPaymentApi
}
