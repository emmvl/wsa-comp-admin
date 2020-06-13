import ApiConstants from "../../../themes/apiConstants";
import history from "../../../util/history";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,


};


function addProductReducer(state = initialState, action) {
    switch (action.type) {
        //////get the Dashboard list in registration
        case ApiConstants.testApi:
            return { ...state, onLoad: true, error: null };


        default:
            return state;
    }
}

export default addProductReducer;
