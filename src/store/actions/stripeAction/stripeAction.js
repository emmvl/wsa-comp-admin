import ApiConstants from "../../../themes/apiConstants";

//////stripe payment account balance API
function accountBalanceAction() {
    const action = {
        type: ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_LOAD,
    };
    return action;
}

////////For stripe charging payment API
function chargingPaymentAction(competitionId, stripeToken) {
    const action = {
        type: ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_LOAD,
        competitionId,
        stripeToken
    };
    return action;
}

////save stripe account
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
function getStripeTransferListAction() {
    const action = {
        type: ApiConstants.API_GET_STRIPE_PAYMENTS_TRANSFER_LIST_API_LOAD,
    };
    return action;
}

export {
    accountBalanceAction,
    chargingPaymentAction,
    saveStripeAccountAction,
    getStripeLoginLinkAction,
    getStripeTransferListAction,
}
