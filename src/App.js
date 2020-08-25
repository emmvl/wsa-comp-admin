import React , { useEffect } from "react";
import {
  // MemoryRouter,
  Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
// import FullStory from "react-fullstory';

import Routes from "./pages/routes";
import history from "./util/history";
import PrivateRoute from "./util/protectedRoute";
import Login from "./components/login";
import ForgotPassword from "./components/ForgotPassword";
import lazyLoad from "./components/lazyLoad";

import "./customStyles/customStyles.css";
import "./customStyles/antdStyles.css";
import TagManager from 'react-gtm-module'
// const ORG_ID = 'Netball';
const tagManagerArgs = {
  gtmId: process.env.REACT_APP_GTM_ID
}

const tawkTo = require("tawkto-react");

const tawkToPropertyId = '5ef6f3ca4a7c6258179b6f5c'

TagManager.initialize(tagManagerArgs)
function App() {
  useEffect(() => {
    localStorage.token && tawkTo(tawkToPropertyId) 
  }, [])
  return (
    <div className="App">
      {/* <FullStory org={ORG_ID} /> */}
      {/* <MemoryRouter> */}
      <Router history={history} >
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              localStorage.token ? (
                <Redirect to="/homeDashboard" />
              ) : (
                <Redirect to="/login" />
              )
            }
          />

          <Route path="/login" component={lazyLoad(Login)} />
          <Route path="/forgotPassword" component={lazyLoad(ForgotPassword)} />

          <PrivateRoute path="/" component={lazyLoad(Routes)} />
        </Switch>
      </Router>
      {/* </MemoryRouter> */}
    </div>
  );
}

export default App;
