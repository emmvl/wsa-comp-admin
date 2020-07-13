import ApiConstants from "../../../themes/apiConstants";

//product listing get API 
function getProductListingAction(sorterBy, order, offset, filter, limit) {
    const action = {
        type: ApiConstants.API_GET_SHOP_PRODUCT_LISTING_LOAD,
        sorterBy, order, offset, filter, limit
    };
    return action;
}


////Add product 
function addProductAction(payload) {
    const action = {
        type: ApiConstants.API_ADD_SHOP_PRODUCT_LOAD,
        payload
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


////get reference type in the add product screen
function getTypesOfProductAction() {
    const action = {
        type: ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_LOAD,
    };
    return action;
}

////////add type in the typelist array in reducer
function addNewTypeAction(typeName) {
    const action = {
        type: ApiConstants.API_SHOP_ADD_TYPE_IN_TYPELIST_LOAD,
        typeName
    };
    return action;
}

////////delete product from the product listing API
function deleteProductAction(productId) {
    const action = {
        type: ApiConstants.API_DELETE_SHOP_PRODUCT_LOAD,
        productId
    };
    return action;
}

//////clearing particular reducer data
function clearProductReducer(dataName) {
    const action = {
        type: ApiConstants.SHOP_PRODUCT_CLEARING_REDUCER_DATA,
        dataName
    };
    return action;
}

////////delete product variant API
function deleteProductVariantAction(optionId, index, subIndex) {
    const action = {
        type: ApiConstants.API_DELETE_SHOP_PRODUCT_VARIANT_LOAD,
        optionId, index, subIndex
    };
    return action;
}

//product details on id API 
function getProductDetailsByIdAction(productId) {
    const action = {
        type: ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_LOAD,
        productId
    };
    return action;
}


export {
    getProductListingAction,
    addProductAction,
    onChangeProductDetails,
    getTypesOfProductAction,
    addNewTypeAction,
    deleteProductAction,
    clearProductReducer,
    deleteProductVariantAction,
    getProductDetailsByIdAction,
}
