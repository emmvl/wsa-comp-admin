import ApiConstants from "../../../themes/apiConstants";

function accountBalanceAction() {
    const action = {
        type: ApiConstants.API_STRIPE_ACCOUNT_BALANCE_API_LOAD,
    };
    return action;
}

function chargingPaymentAction(competitionId, stripeToken) {
    const action = {
        type: ApiConstants.API_STRIPE_CHARGING_PAYMENT_API_LOAD,
        competitionId,
        stripeToken
    };
    return action;
}

export {
    accountBalanceAction,
    chargingPaymentAction
}
