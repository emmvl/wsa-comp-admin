import ApiConstants from "../../../themes/apiConstants";
// competition dashboard
function getProduct() {
    const action = {
        type: ApiConstants.API_SHOP_API_LOAD,

    };
    return action;
}







export {
    getProduct,
}
