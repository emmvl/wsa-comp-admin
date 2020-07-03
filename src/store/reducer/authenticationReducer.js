import ApiConstants from "../../themes/apiConstants";
import { Encrypt, Decrypt } from "../../util/encryption";
import { JwtEncrypt, JwtDecrypt } from "../../util/jwt";
import history from "../../util/history";
import { setAuthToken, setUserId } from '../../util/sessionStorage'

const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  loggedIn: false,
  forgotPasswordMessage: "",
  forgotPasswordSuccess: false,
};

function login(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.API_LOGIN_LOAD:

      return { ...state, onLoad: true };

    case ApiConstants.API_LOGIN_SUCCESS:
      setUserId(action.result.user.id)
      setAuthToken(action.result.authToken)
      // localStorage.setItem("token", action.result.authToken);
      // let jwtEncrypt = JwtEncrypt(action.result.result.data.user_data)
      // let encryptText = Encrypt(jwtEncrypt)
      // let decryptText = Decrypt(encryptText)
      // let jwtDecrypt = JwtDecrypt(decryptText)
      // history.push("/");
      window.location.reload();
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        loggedIn: true
      };

    case ApiConstants.API_LOGIN_FAIL:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };

    case ApiConstants.API_LOGIN_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };

    ///////forgot password
    case ApiConstants.API_FORGOT_PASSWORD_LOAD:

      return { ...state, onLoad: true };

    case ApiConstants.API_FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPasswordMessage: action.result.message ? action.result.message : "",
        onLoad: false,
        forgotPasswordSuccess: true,
        status: action.status,
      };

    ////clear reducer
    case ApiConstants.ACTION_TO_CLEAR_AUTHENTICATION_REDUCER:
      if (action.key == "forgotPasswordSuccess") {
        state.forgotPasswordSuccess = false
      }
      return {
        ...state,
        onLoad: false,
        error: null,
      };

    default:
      return state;
  }
}

export default login;
