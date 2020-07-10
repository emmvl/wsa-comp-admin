import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";

// dummy object of product detail
const defaultAddProductObject = {
    productName: "",
    cost: 0,
    description: "",
    price: 0,
    type: "",
    affiliates: {
        "direct": 1,
        "firstLevel": 0,
        "secondLevel": 0
    },
    image: "",
    tax: 0,
    invetoryTracking: true,
    deliveryType: "",
    quantity: 0,
    width: 0,
    height: 0,
    length: 0,
    weight: 0,
    createByOrg: 1,
    variants: [
        {
            "name": "",
            "options": [
                {
                    "optionName": "",
                    "properties": {
                        "price": 0,
                        "SKU": "",
                        "barcode": "",
                        "quantity": 0
                    }
                }
            ]
        }
    ],
    variantsChecked: false,
    availableIfOutOfStock: 0,
    taxApplicable: false,
}

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    productDeatilData: defaultAddProductObject,
    productListingData: [],
    productListingTotalCount: 1,
    productListingCurrentPage: 1,
    typesProductList: [], //////reference types in add product screen for the type dropdown
    getDetailsLoad: false,
};

////adding extra parameters in the productDeatilData
function makeDetailDataObject(data) {
    let productData = data
    if (isArrayNotEmpty(productData.variants)) {
        productData['variantsChecked'] = false
    }
    else {
        productData['variantsChecked'] = false
    }
    return productData
}



function shopProductState(state = initialState, action) {
    switch (action.type) {

        case ApiConstants.API_SHOP_PRODUCT_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_SHOP_PRODUCT_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        /////////product listing get API 
        case ApiConstants.API_GET_SHOP_PRODUCT_LISTING_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_SHOP_PRODUCT_LISTING_SUCCESS:
            return {
                ...state,
                productListingData: isArrayNotEmpty(action.result.result) ? action.result.result : [],
                productListingTotalCount: action.result.page ? action.result.page.totalCount : 1,
                productListingCurrentPage: action.result.page ? action.result.page.currentPage : 1,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////////Add product 
        case ApiConstants.API_ADD_SHOP_PRODUCT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_ADD_SHOP_PRODUCT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////onchange Add/Edit product details
        case ApiConstants.SHOP_PRODUCT_DETAILS_ONCHANGE:
            if (action.key === "variantName") {
                state.productDeatilData["variants"][action.index]["name"] = action.data
            }
            if (action.key === "variantOption") {
                state.productDeatilData["variants"][action.index]["options"] = action.data
            }
            if (action.key == "type") {
                state.productDeatilData["type"] = action.data
            }
            else {
                state.productDeatilData[action.key] = action.data
            }

            return {
                ...state,
            };

        //////////get reference type in the add product screen
        case ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_SUCCESS:
            return {
                ...state,
                typesProductList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
                status: action.status,
                error: null
            };

        //////////////////delete product from the product listing API 
        case ApiConstants.API_DELETE_SHOP_PRODUCT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_DELETE_SHOP_PRODUCT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        ///clearing particular reducer data
        case ApiConstants.SHOP_PRODUCT_CLEARING_REDUCER_DATA:
            if (action.dataName === "productDeatilData") {
                // dummy object of product detail
                const defaultAddProductObject = {
                    productName: "",
                    cost: 0,
                    description: "",
                    price: 0,
                    type: "",
                    affiliates: {
                        "direct": 1,
                        "firstLevel": 0,
                        "secondLevel": 0
                    },
                    image: "",
                    tax: 0,
                    invetoryTracking: true,
                    deliveryType: "",
                    quantity: 0,
                    width: 0,
                    height: 0,
                    length: 0,
                    weight: 0,
                    createByOrg: 1,
                    variants: [
                        {
                            "name": "",
                            "options": [
                                {
                                    "optionName": "",
                                    "properties": {
                                        "price": 0,
                                        "SKU": "",
                                        "barcode": "",
                                        "quantity": 0
                                    }
                                }
                            ]
                        }
                    ],
                    variantsChecked: false,
                    availableIfOutOfStock: 0,
                    taxApplicable: false,
                }
                state.productDeatilData = defaultAddProductObject
            }
            return {
                ...state, error: null
            };


        /////////////////////////delete product variant API
        case ApiConstants.API_DELETE_SHOP_PRODUCT_VARIANT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_DELETE_SHOP_PRODUCT_VARIANT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        ////////////add type in the typelist array in from the API
        case ApiConstants.API_SHOP_ADD_TYPE_IN_TYPELIST_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_SHOP_ADD_TYPE_IN_TYPELIST_SUCCESS:
            state.typesProductList.push(action.result)
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////////////product details on id API
        case ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_LOAD:
            return { ...state, onLoad: true, getDetailsLoad: true, error: null };

        case ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_SUCCESS:
            state.productDeatilData = makeDetailDataObject(action.result)
            state.getDetailsLoad = false
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

export default shopProductState;
