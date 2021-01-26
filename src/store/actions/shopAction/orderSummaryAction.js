import ApiConstants from "../../../themes/apiConstants";

// order summary listing get API
function getOrderSummaryListingAction(params) {
    const action = {
        type: ApiConstants.API_GET_SHOP_ORDER_SUMMARY_LISTING_LOAD,
        params,
    };
    return action;
}

// export order summary  API
function exportOrderSummaryAction(params) {
    const action = {
        type: ApiConstants.API_GET_EXPORT_ORDER_SUMMARY_LOAD,
        params,
    };
    return action;
}

export {
    getOrderSummaryListingAction,
    exportOrderSummaryAction,
};
