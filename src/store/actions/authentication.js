import ApiConstants from "../../themes/apiConstants";

function loginAction(payload) {
  return {
    type: ApiConstants.API_LOGIN_LOAD,
    payload: payload
  };
}

function qrSubmitAction(payload) {
  return {
    type: ApiConstants.API_QR_CODE_LOAD,
    payload: payload
  };
}

// forgot password
function forgotPasswordAction(email) {
  return {
    type: ApiConstants.API_FORGOT_PASSWORD_LOAD,
    email
  };
}

// clear reducer
function clearReducerAction(key) {
  return {
    type: ApiConstants.ACTION_TO_CLEAR_AUTHENTICATION_REDUCER,
    key
  };
}

export {
  loginAction,
  qrSubmitAction,
  forgotPasswordAction,
  clearReducerAction,
}