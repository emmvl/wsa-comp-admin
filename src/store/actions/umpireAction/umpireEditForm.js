import ApiConstants from "../../../themes/apiConstants";

function getUmpire(data) {
    const action = {
        type: ApiConstants.GET_UMPIRE_LOAD,
        data,
    };
    return action;
}

export {
    getUmpire
}