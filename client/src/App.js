import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser} from './actions/authActions';
import store from './store';
import Navbar from './component/layout/Navbar';
import Footer from './component/layout/Footer';
import Landing from './component/layout/Landing';
import Register from './component/layout/auth/Register';
import Login from './component/layout/auth/Login';
import './App.css';

//check for token
if(localStorage.jwtToken) {
// set auth token heaader auth
setAuthToken(localStorage.jwtToken);
// decode token and get user info
const decoded = jwt_decode(localStorage.jwtToken);
// set user and isAuthenticated
store.dispatch(setCurrentUser(decoded))
}

class App extends Component {
  render() {
    return (
      <Provider store = { store }>
      <Router>
      <div className='App'>
        <Navbar />
        <Route exact path ='/' component={ Landing } />
        <div className = 'container'>
        <Route exact path='/register' component = { Register }/>
        <Route exact path='/login' component = { Login }/>
          </div>
        <Footer />
      </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
