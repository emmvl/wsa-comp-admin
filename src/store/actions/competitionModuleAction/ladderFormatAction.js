import ApiConstants from "../../../themes/apiConstants";


/* Get Ladder Format */
function getLadderFormatAction(payload) {
    const action = {
        type: ApiConstants.API_GET_LADDER_FORMAT_LOAD,
        payload: payload
    };
    return action;
}

/* Save Ladder Format */
function saveLadderFormatAction(payload) {
    const action = {
        type: ApiConstants.API_SAVE_LADDER_FORMAT_LOAD,
        payload: payload
    };
    return action;
}

function updateLadderFormatAction(data, key, index) {
    const action = {
      type: ApiConstants.UPDATE_LADDER_FORMAT,
      updatedData: data,
      key: key,
      index: index
    };
    return action;
  }

export {
    getLadderFormatAction,
    saveLadderFormatAction,
    updateLadderFormatAction
}