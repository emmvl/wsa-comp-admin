import { takeEvery } from "redux-saga/effects";

import ApiConstants from "themes/apiConstants";
import { communicationListSaga } from "./communicaitonListSaga";
import { communicationAddSaga } from "./communicationAddSaga";

export default function* rootCommunicationListSaga() {
    yield takeEvery(ApiConstants.API_COMMUNICATION_LIST_LOAD, communicationListSaga);
    yield takeEvery(ApiConstants.API_ADD_COMMUNICATION_LOAD, communicationAddSaga);
}
