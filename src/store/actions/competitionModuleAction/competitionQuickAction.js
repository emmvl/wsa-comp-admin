import ApiConstants from "../../../themes/apiConstants";
// competition dashboard
function updateQuickCompetitionData(item) {
    const action = {
        type: ApiConstants.Update_QuickCompetition_Data,
        item
    };
    return action;
}

function updateTimeSlot(key, index, timeindex, value) {
    const action = {
        type: ApiConstants.API_UPDATE_QUICKCOMPETITION_TIMESLOT,
        key,
        index,
        timeindex,
        value
    }
    return action
}

function updateDivision(key, index, gradeIndex, value) {
    const action = {
        type: ApiConstants.API_UPDATE_QUICKCOMPETITION_Division,
        key,
        index,
        gradeIndex,
        value
    }
    return action
}


function updateCompetition(value, key) {
    const action = {
        type: ApiConstants.API_UPDATE_QUICKCOMPETITION_COMPETITION,
        value, key
    }
    console.log(action)
    return action
}

export {
    updateQuickCompetitionData,
    updateTimeSlot,
    updateDivision,
    updateCompetition

}
