import axios from 'axios';
// set default header state for axios
const setAuthToken = token => {
if(token){
    //Apply token to every request
    axios.defaults.headers.common['Authorization'] = token;
}
else{
    //Delete auth header
    delete axios.defaults.headers.common['Authorization'];
}
}
export default setAuthToken;