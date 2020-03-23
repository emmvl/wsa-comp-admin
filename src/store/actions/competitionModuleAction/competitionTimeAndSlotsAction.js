import ApiConstants from "../../../themes/apiConstants";


// get competition with time slots
function getCompetitionWithTimeSlots(year, competitionId, organisationId, userId) {
    const action = {
        type: ApiConstants.API_GET_COMPETITION_WITH_TIME_SLOTS_LOAD,
        year: year,
        competitionId: competitionId,
        organisationId: organisationId,
        userId: userId
    }
    return action;
}
// add and remove time slot
function addRemoveTimeSlot(index, item, key, parentIndex) {
    const action = {
        type: ApiConstants.Api_ADD_REMOVE_TIME_SLOT_TABLE,
        index: index,
        item: item,
        key: key,
        parentIndex: parentIndex

    }
    return action
}
// update time slot data 
function UpdateTimeSlotsData(value, key, contentType, Index, mainId, id) {
    const action = {
        type: ApiConstants.UPDATE_POST_DATA_TIME_SLOTS_COMPETITION,
        value: value,
        key: key,
        contentType: contentType,
        index: Index,
        mainId: mainId,
        id: id,

    }
    return action
}
//update time slot data manaual
function UpdateTimeSlotsDataManual(value, key, contentType, Index, mainId, id, parentIndex) {
    const action = {
        type: ApiConstants.UPDATE_POST_DATA_TIME_SLOTS_MANUAL_COMPETITION,
        value: value,
        key: key,
        contentType: contentType,
        index: Index,
        mainId: mainId,
        id: id,
        parentIndex: parentIndex
    }
    return action
}

// post time slot Data 
function addTimeSlotDataPost(payload) {
    const action = {
        type: ApiConstants.API_COMPETITION_TIMESLOT_POST_LOAD,
        payload: payload
    }
    return action
}

export {
    getCompetitionWithTimeSlots,
    addRemoveTimeSlot,
    UpdateTimeSlotsData,
    UpdateTimeSlotsDataManual,
    addTimeSlotDataPost
}
