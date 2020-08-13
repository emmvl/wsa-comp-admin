import ApiConstants from "../../../themes/apiConstants";

///order status listing get API 
function getOrderStatusListingAction(params) {
    const action = {
        type: ApiConstants.API_GET_ORDER_STATUS_LISTING_LOAD,
        params
    };
    return action;
}

export {
    getOrderStatusListingAction,
}


