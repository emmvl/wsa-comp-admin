import ApiConstants from "../../../themes/apiConstants";
// competition dashboard
function updateQuickCompetitionData(item) {
    const action = {
        type: ApiConstants.Update_QuickCompetition_Data,
        item
    };
    return action;
}


export {
    updateQuickCompetitionData,

}
