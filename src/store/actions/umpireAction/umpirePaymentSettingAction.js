import ApiConstants from "../../../themes/apiConstants";

function umpirePaymentSettingUpdate(data) {
    const action = {
        type: ApiConstants.API_UPDATE_UMPIRE_PAYMENT_SETTING,
        data

    };

    return action;
}

export {
    umpirePaymentSettingUpdate
} 
