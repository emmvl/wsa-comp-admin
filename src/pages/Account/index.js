import React from "react";
import { NavLink, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Breadcrumb, Layout } from "antd";

import AppConstants from "../../themes/appConstants";
import PrivateRoute from "../../util/protectedRoute";
import lazyLoad from "../../components/lazyLoad";
import Loader from "../../customComponents/loader";
import DashboardLayout from "../dashboardLayout";
import InnerHorizontalMenu from "../innerHorizontalMenu";
import Profile from "./Profile";
import Password from "./Password";

const { Header, Footer, Content } = Layout;

function Account(props) {
  const { location: { pathname }, appState } = props;

  return (
    <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
      <DashboardLayout
        menuHeading={AppConstants.account}
        menuName={AppConstants.account}
      />

      <InnerHorizontalMenu
        menu="account"
        selectedKey={pathname === "/account/profile" ? "1" : "2"}
      />

      <Layout>
        <Content className="container">
          <div className="fluid-width">
            <div className="row">
              <div className="col-sm">
                <Header
                  className="form-header-view"
                  style={{
                    paddingLeft: 0,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Breadcrumb separator=" > ">
                    <NavLink to={pathname}>
                      <div className="breadcrumb-product">
                        {pathname === "/account/profile" ? AppConstants.profileHeader : AppConstants.passwordHeader}
                      </div>
                    </NavLink>
                  </Breadcrumb>
                </Header>
              </div>
            </div>

            <Switch>
              <PrivateRoute exact path="/account/profile" component={lazyLoad(Profile)} />
              <PrivateRoute exact path="/account/password" component={lazyLoad(Password)} />

              <Redirect to="/account/profile" />
            </Switch>

            <Loader visible={appState && appState.onLoad} />

            <Footer />
          </div>
        </Content>
      </Layout>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    appState: state.AppState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
