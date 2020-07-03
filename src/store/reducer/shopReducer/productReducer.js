import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";


// dummy object of product detail
const defaultAddProductObject = {
    productName: "",
    description: "",
    affiliates: {
        "_direct": 1,
        "_first_level": 0,
        "_second_level": 0
    },
    price: 0,
    cost: 0,
    tax: 0,
    invetoryTracking: true,
    barcode: "",
    SKU: "",
    quantity: 0,
    deliveryType: "",
    types: [],
    width: "",
    length: "",
    height: "",
    weight: "",
    variants: [
        {
            "name": "color",
            "options": [
                {
                    "optionName": "green",
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
    purchaseOutOfStock: false,
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
};


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
                onLoad: false,
                status: action.status,
                error: null
            };

        //////////Add product 
        case ApiConstants.API_ADD_SHOP_PRODUCT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_ADD_SHOP_PRODUCT_SUCCESS:
            console.log(action.result)
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////onchange Add/Edit product details
        case ApiConstants.SHOP_PRODUCT_DETAILS_ONCHANGE:
            if (action.key == "types") {
                let typesArray = []
                typesArray.push(action.data)
                state.productDeatilData["types"] = typesArray
            }
            else {
                state.productDeatilData[action.key] = action.data
            }
            if (action.key === "variantName") {
                state.productDeatilData["variants"][action.index]["name"] = action.data
            }
            if (action.key === "variantOption") {
                state.productDeatilData["variants"][action.index]["options"] = action.data
            }
            return {
                ...state,
            };
        default:
            return state;
    }
}

export default shopProductState;
