import axios from "axios";
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from '../utils/setAuthToken';


//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push('/login'))
    .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }));
};

export const loginUser = userData => dispatch => {
    axios
      .post('api/users/login', userData)
      .then(res => {
        //save token to local storage
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        // save token to auth header
        setAuthToken(token);
        // decode token to get user data
        const decoded = jwt_decode(token);
        // set current user
        dispatch(setCurrentUser(decoded));

        
        
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  };
// set logged in user
  export const setCurrentUser = decoded => {
      return {
          type: SET_CURRENT_USER,
          payload: decoded
      }
  }
  // logout user

  export const logoutUser = () =>  dispatch => {
    //Remove token from local storage
    localStorage.getItem('jwtToken');
    // Remove authheader from feature request
    setAuthToken(false);
    // set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({})); 
  }

  