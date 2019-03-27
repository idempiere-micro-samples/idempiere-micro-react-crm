// import { CALL_API } from '../middleware/api'
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  // LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS
} from "../constants";

// Login actions

function requestLogin(creds) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  };
}

function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    token: user.token,
    user: user
  };
}

// function loginError(message) {
//   return {
//     type: LOGIN_FAILURE,
//     isFetching: false,
//     isAuthenticated: false,
//     message: message
//   };
// }

// Calls the API to get a token and
// dispatches actions along the way
export function loginUser(creds) {
  const config = {
    method: "GET"
  };
  const tokenUrl = `http://localhost:9080/idempiere-micro-liberty-standalone/session/${creds.username}/login/${creds.password}`;

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds));
    return fetch(tokenUrl, config)
      .then(response => response.json().then(user => ({ user, response })))
      .then(({ user, response }) => {
        if (!response.ok || !user.logged) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(loginError(user.message));
          return Promise.reject(user);
        } else {
          // If login was successful, set the token in local storage
          user = Object.assign({}, user);
          localStorage.setItem("token", user.token);
          localStorage.setItem("user", JSON.stringify(user));
          // Dispatch the success action
          dispatch(receiveLogin(user));
        }
      })
      .catch(err => console.log("Error: ", err));
  };
}

// Logout actions

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  };
}

function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  };
}

// Logs the user out
export function logoutUser() {
  return dispatch => {
    dispatch(requestLogout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(receiveLogout());
  };
}
