import React from "react";
import "./App.css";
import "./customStyles/customStyles.css";
import "./customStyles/antdStyles.css";
import Routes from "./pages/routes";
import {
  MemoryRouter,
  Router,
  Route,
  Redirect,
  Switch,
  HashRouter
} from "react-router-dom";
import history from "./util/history";
import Login from "./components/login";
import { Skeleton } from "antd";
import PrivateRoute from "./util/protectedRoute";

function App() {
  const lazyLoad = Component => {
    const lazy = props => {
      return (
        <React.Suspense fallback={<Skeleton avatar paragraph={{ rows: 4 }} />}>
          <Component {...props} />
        </React.Suspense>
      );
    };
    return lazy;
  };

  return (
    <div className="App">
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
          <PrivateRoute path="/" component={lazyLoad(Routes)} />
        </Switch>
      </Router>
      {/* </MemoryRouter> */}
    </div>
  );
}

export default App;
