import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";

// dummy object of product detail
const defaultAddProductObject = {
    id: "",

}

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    orderStatusListingData: [],
    orderStatusTotalCount: 1,
    orderStatusCurrentPage: 1,
};

////making the object data for order detail 
function makeOrderDetailObject(data) {
    let objectDetailData = {}
    objectDetailData['id'] = data.id
    return objectDetailData
}

function shopOrderStatusState(state = initialState, action) {
    switch (action.type) {

        case ApiConstants.API_SHOP_ORDER_STATUS_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_SHOP_ORDER_STATUS_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        //// /////order status listing  get API 
        case ApiConstants.API_GET_ORDER_STATUS_LISTING_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_ORDER_STATUS_LISTING_SUCCESS:
            let orderStatusData = action.result
            return {
                ...state,
                orderStatusListingData: isArrayNotEmpty(orderStatusData.orders) ? orderStatusData.orders : [],
                orderStatusTotalCount: orderStatusData.page ? orderStatusData.page.totalCount : 1,
                orderStatusCurrentPage: orderStatusData.page ? orderStatusData.page.currentPage : 1,
                onLoad: false,
                status: action.status,
                error: null
            };

        //// //////update order status API 
        case ApiConstants.API_UPDATE_ORDER_STATUS_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_UPDATE_ORDER_STATUS_SUCCESS:
            let allData = state.orderStatusListingData
            let updatedOrderStatus = action.result
            let orderId = updatedOrderStatus ? updatedOrderStatus.id : 0
            let orderStatusIndex = allData.findIndex(x => x.orderId == orderId)
            if (orderStatusIndex > -1) {
                state.orderStatusListingData[orderStatusIndex].paymentStatus = updatedOrderStatus.paymentStatus
                state.orderStatusListingData[orderStatusIndex].fulfilmentStatus = updatedOrderStatus.fulfilmentStatus
            }
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        //// //////order details get API
        case ApiConstants.API_GET_ORDER_DETAILS_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_ORDER_DETAILS_SUCCESS:
            let orderDetails = makeOrderDetailObject(action.result)
            console.log("orderDetails", orderDetails)
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };
        default:
            return state;
    }
}

export default shopOrderStatusState;
