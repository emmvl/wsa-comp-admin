import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    orderStatusListingData: [],
    orderStatusTotalCount: 1,
    orderStatusCurrentPage: 1,
};

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

        default:
            return state;
    }
}

export default shopOrderStatusState;
