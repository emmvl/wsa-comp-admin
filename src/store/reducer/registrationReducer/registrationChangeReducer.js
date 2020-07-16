import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../../util/helpers";

let obj = {
    userName: null,
    userRegister: null,
    competitionName: null,
    competitionAdministrator: null,
    regDate: null,
    compDate: null,
    regChangeType: null,
    courtGame: null,
    reasonToDeRegister: null
}


const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    detailsData: obj
}


function regChangeReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_UPDATE_REG_REVIEW:

            let key = action.data.key
            let data = action.data.data

            state.detailsData[key] = data
            return {
                ...state,

            };


        default:
            return state;
    }
}

export default regChangeReducer;