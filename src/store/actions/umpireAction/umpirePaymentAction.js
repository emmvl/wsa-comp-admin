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

function umpirePaymentTransferData(data) {
    return {
        type: ApiConstants.API_UMPIRE_PAYMENT_TRANSFER_DATA_LOAD,
        data,
    };
}

function exportFilesAction(data) {
    return {
        type: ApiConstants.API_UMPIRE_PAYMENT_EXPORT_FILE_LOAD,
        data,
    };
}

export {
    getUmpirePaymentData,
    updateUmpirePaymentData,
    umpirePaymentTransferData,
    exportFilesAction
}
