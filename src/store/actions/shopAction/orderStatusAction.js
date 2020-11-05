import ApiConstants from "../../../themes/apiConstants";

///order status listing get API
function getOrderStatusListingAction(params) {
    const action = {
        type: ApiConstants.API_GET_ORDER_STATUS_LISTING_LOAD,
        params
    };
    return action;
}

///update order status API
function updateOrderStatusAction(payload) {
    const action = {
        type: ApiConstants.API_UPDATE_ORDER_STATUS_LOAD,
        payload
    };
    return action;
}


///order details get API
function getOrderDetailsAction(id) {
    const action = {
        type: ApiConstants.API_GET_ORDER_DETAILS_LOAD,
        id
    };
    return action;
}

//////clearing particular reducer data
function clearOrderStatusReducer(dataName) {
    const action = {
        type: ApiConstants.SHOP_ORDER_STATUS_CLEARING_REDUCER_DATA,
        dataName
    };
    return action;
}

///purchases listing get API
function getPurchasesListingAction(params) {
    const action = {
        type: ApiConstants.API_GET_PURCHASES_LISTING_LOAD,
        params
    };
    return action;
}

function getReferenceOrderStatus(){
    return{
        type:ApiConstants.API_GET_REFERENCE_ORDER_STATUS_LOAD
    }
}

function updateOrderFullfilmentStatus(key,value){
    return {
        type:ApiConstants.API_UPDATE_FULFILLMENT_STATUS,
        key,value
    }
}

export {
    getOrderStatusListingAction,
    updateOrderStatusAction,
    getOrderDetailsAction,
    clearOrderStatusReducer,
    getPurchasesListingAction,
    getReferenceOrderStatus,
    updateOrderFullfilmentStatus
}


