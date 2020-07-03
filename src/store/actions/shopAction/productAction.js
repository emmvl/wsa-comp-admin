import ApiConstants from "../../../themes/apiConstants";

//product listing get API 
function getProductListingAction(sorterBy, order, offset, filter) {
    const action = {
        type: ApiConstants.API_GET_SHOP_PRODUCT_LISTING_LOAD,
        sorterBy, order, offset, filter
    };
    return action;
}


////Add product 
function addProductAction() {
    const action = {
        type: ApiConstants.API_ADD_SHOP_PRODUCT_LOAD,

    };
    return action;
}

//// add/edit product details action
function onChangeProductDetails(data, key, index) {
    const action = {
        type: ApiConstants.SHOP_PRODUCT_DETAILS_ONCHANGE,
        data,
        key,
        index
    }
    return action
}





export {
    getProductListingAction,
    addProductAction,
    onChangeProductDetails,
}
