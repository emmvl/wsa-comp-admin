import ApiConstants from "../../themes/apiConstants";

function loginAction(payload) {
  console.log(payload);
  const action = {
    type: ApiConstants.API_LOGIN_LOAD,
    payload: payload
  };

  return action;
}

///forgot password
function forgotPasswordAction(email) {
  const action = {
    type: ApiConstants.API_FORGOT_PASSWORD_LOAD,
    email
  };
  return action;
}
////clear reducer
function clearReducerAction(key) {
  const action = {
    type: ApiConstants.ACTION_TO_CLEAR_AUTHENTICATION_REDUCER,
    key
  };
  return action;
}

export {
  loginAction,
  forgotPasswordAction,
  clearReducerAction,
}