import ApiConstants from "themes/apiConstants";

function getUmpirePaymentData(data) {
    return {
        type: ApiConstants.API_GET_UMPIRE_PAYMENT_DATA_LOAD,
        data,
    };
}

function updateUmpirePaymentData(data) {
    return {
        type: ApiConstants.API_UPDATE_UMPIRE_PAYMENT_DATA,
        data,
    };
}

export {
    getUmpirePaymentData,
    updateUmpirePaymentData
}
