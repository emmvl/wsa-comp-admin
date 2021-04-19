import ApiConstants from '../../../themes/apiConstants';

function umpireRosterListAction(
  competitionID,
  status,
  refRoleId,
  paginationBody,
  sortBy,
  sortOrder,
  entityType,
) {
  const action = {
    type: ApiConstants.API_UMPIRE_ROSTER_LIST_LOAD,
    competitionID,
    status,
    refRoleId,
    paginationBody,
    sortBy,
    sortOrder,
    entityType,
  };
  return action;
}

function umpireRosterOnActionClick(data) {
  const action = {
    type: ApiConstants.API_UMPIRE_ROSTER_ACTION_CLICK_LOAD,
    data,
  };
  return action;
}

function setPageSizeAction(pageSize) {
  const action = {
    type: ApiConstants.SET_UMPIRE_ROSTER_LIST_PAGE_SIZE,
    pageSize,
  };

  return action;
}

function setPageNumberAction(pageNum) {
  const action = {
    type: ApiConstants.SET_UMPIRE_ROSTER_LIST_PAGE_CURRENT_NUMBER,
    pageNum,
  };

  return action;
}

export {
  umpireRosterListAction,
  umpireRosterOnActionClick,
  setPageSizeAction,
  setPageNumberAction,
};
