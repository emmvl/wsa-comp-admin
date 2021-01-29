import ApiConstants from "../../../themes/apiConstants";

// stripe payment account balance API
function accountBalanceAction() {
    return {
        type: ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_LOAD,
    };
}

// For stripe charging payment API
function chargingPaymentAction(competitionId, stripeToken) {
    return {
        type: ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_LOAD,
        competitionId,
        stripeToken,
    };
}

// save stripe account
function saveStripeAccountAction(code) {
    return {
        type: ApiConstants.API_SAVE_STRIPE_ACCOUNT_API_LOAD,
        code,
    };
}

// stripe login link
function getStripeLoginLinkAction() {
    return {
        type: ApiConstants.API_GET_STRIPE_LOGIN_LINK_API_LOAD,
    };
}

// stripe payments transfer list
function getStripeTransferListAction(page, starting_after, ending_before, params) {
    return {
        type: ApiConstants.API_GET_STRIPE_PAYMENTS_TRANSFER_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        params,
    };
}

// stripe payout list
function getStripePayoutListAction(page, starting_after, ending_before, params) {
    return {
        type: ApiConstants.API_GET_STRIPE_PAYOUT_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        params,
    };
}

// stripe payout list
function getStripeRefundsListAction(page, starting_after, ending_before, params) {
    return {
        type: ApiConstants.API_GET_STRIPE_REFUND_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        params,
    };
}

// stripe single payout transaction list
function getTransactionPayoutListAction(page, starting_after, ending_before, payoutId) {
    return {
        type: ApiConstants.API_GET_STRIPE_TRANSACTION_PAYOUT_LIST_API_LOAD,
        page,
        starting_after,
        ending_before,
        payoutId,
    };
}

// get invoice
function getInvoice(registrationid, userRegId, invoiceId, teamMemberRegId) {
    return {
        type: ApiConstants.API_GET_INVOICE_LOAD,
        registrationid,
        userRegId,
        invoiceId,
        teamMemberRegId,
    };
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
    membershipType,
    paymentStatus,
) {
    return {
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
        membershipType,
        paymentStatus,
    };
}

// export payment dashboard data
function exportPaymentApi(key, year, dateFrom, dateTo) {
    return {
        type: ApiConstants.API_PAYMENT_DASHBOARD_EXPORT_LOAD,
        key,
        year,
        dateFrom,
        dateTo,
    };
}

function getInvoiceStatusAction(registrationid, userRegId, invoiceId, teamMemberRegId) {
    return {
        type: ApiConstants.API_GET_INVOICE_STATUS_LOAD,
        registrationid,
        userRegId,
        invoiceId,
        teamMemberRegId,
    };
}

function exportPaymentDashboardApi(
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
    membershipType,
    paymentStatus,
) {
    return {
        type: ApiConstants.API_EXPORT_PAYMENT_DASHBOARD_LOAD,
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
        membershipType,
        paymentStatus,
    }
}

function exportPayoutTransaction(payoutId) {
    return {
        type: ApiConstants.API_STRIPE_TRANSACTION_PAYOUT_LIST_EXPORT_LOAD,
        payoutId,
    };
}

function getPaymentSummary(
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
    membershipType,
    paymentStatus,
) {
    return {
        type: ApiConstants.API_PAYMENT_SUMMARY_LIST_LOAD,
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
        membershipType,
        paymentStatus,
    }
}

function exportPaymentSummaryApi(
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
    membershipType,
    paymentStatus,
) {
    return {
        type: ApiConstants.API_EXPORT_PAYMENT_SUMMARY_LOAD,
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
        membershipType,
        paymentStatus,
    }
}

function partialRefundAmountAction(payload) {
    const action = {
        type: ApiConstants.API_PARTIAL_REFUND_AMOUNT_LOAD,
        payload,
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
    getInvoice,
    getPaymentList,
    exportPaymentApi,
    getStripeRefundsListAction,
    getInvoiceStatusAction,
    exportPaymentDashboardApi,
    exportPayoutTransaction,
    getPaymentSummary,
    exportPaymentSummaryApi,
    partialRefundAmountAction
};
