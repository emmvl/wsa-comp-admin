import React from "react";
import { NavLink } from "react-router-dom";
import { Input, Icon, Select } from "antd";
import "./layout.css";
import history from "../util/history";
import AppConstants from "../themes/appConstants";
import AppImages from "../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserOrganisationAction, onOrganisationChangeAction } from "../store/actions/userAction/userAction";
import {
  setOrganisationData,
  getOrganisationData,
  clearUmpireStorage,
} from "../util/sessionStorage";
import { clearHomeDashboardData, } from "../store/actions/homeAction/homeAction";
import { setUserVars } from 'react-fullstory';

const { Option } = Select;

class DashboardLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowMobile: false,
      dataOnload: false
    };
  }

  async componentDidUpdate(nextProps) {
    if (this.props.userState.onLoad == false && this.state.dataOnload == true) {
      let organisationData = this.props.userState.getUserOrganisation
      if (organisationData.length > 0) {
        let orgData = getOrganisationData();
        let organisationItem = orgData ? orgData : organisationData[0];
        this.setFullStory(organisationItem);
        await setOrganisationData(organisationItem);
        this.props.onOrganisationChangeAction(organisationItem, "organisationChange");
        this.setState({ dataOnload: false });
      }
    }
  }

  componentDidMount() {
    this.setOrganisationKey()
  }

  setOrganisationKey() {
    let organisationData = getOrganisationData()
    if (!organisationData) {
      this.props.userState.getUserOrganisation.length == 0 && this.props.getUserOrganisationAction()
      this.setState({ dataOnload: true })
    } else {
      this.props.userState.getUserOrganisation.length === 0 && this.props.getUserOrganisationAction()
      this.setState({ dataOnload: true })
    }
  }

  logout = async () => {
    await localStorage.clear();
    window.location.reload();
    history.push("/");
  };

  menuImageChange = menuName => {
    switch (menuName) {
      case AppConstants.home:
        return AppImages.homeIcon;

      case AppConstants.account:
        return AppImages.accountIcon;

      case AppConstants.user:
        return AppImages.userIcon;

      case AppConstants.registration:
        return AppImages.regIcon;

      case AppConstants.competitions:
        return AppImages.compIcon;

      case AppConstants.liveScores:
        return AppImages.liveScoreIcon;

      case AppConstants.events:
        return AppImages.eventsIcon;

      case AppConstants.shop:
        return AppImages.shopIcon;

      case AppConstants.umpires:
        return AppImages.umpireIcon;

      case AppConstants.incidents:
        return AppImages.incidentIcon;

      case AppConstants.finance:
        return AppImages.financeIcon;

      default:
        return AppImages.homeIcon;
    }
  };

  ////search view input on width<767px
  searchView = () => {
    this.setState({ windowMobile: !this.state.windowMobile });
  };

  onOrganisationChange = async (organisationData) => {
    this.props.onOrganisationChangeAction(organisationData, "organisationChange")
    this.setFullStory(organisationData)
    setOrganisationData(organisationData)
    this.props.clearHomeDashboardData("user")
    clearUmpireStorage()
    history.push("./")
    window.location.reload();
  }

  setFullStory = (organisationData) => {
    // if(organisationData!= null ){
    //   let exOrgData = getOrganisationData();
    //   if(exOrgData == null || organisationData.organisationUniqueKey!= exOrgData.organisationUniqueKey){
    //     setUserVars({
    //       "displayName" : organisationData.firstName + " " + organisationData.lastName,
    //       "email" : organisationData.userEmail,
    //       "organisation" : organisationData.name
    //      });
    //   }
    // }
  }

  ///////user profile dropdown
  userProfileDropdown() {
    const { menuName } = this.props;
    let userData = this.props.userState.getUserOrganisation;
    let selectedOrgData = getOrganisationData();
    let userImage = (selectedOrgData && selectedOrgData.photoUrl)
      ? selectedOrgData.photoUrl
      : AppImages.defaultUser;

    return (
      <div className="dropdown">
        <button
          className="dropdown-toggle"
          type="button"
          data-toggle="dropdown"
        >
          <img src={userImage} alt=""/>
        </button>

        <ul className="dropdown-menu">
          <li>
            <div className="media">
              <div className="media-left">
                <figure className="user-img-wrap">
                  <img src={userImage} alt=""/>
                </figure>
              </div>

              <div className="media-body">
                {selectedOrgData && (
                  <span className="user-name">
                    {selectedOrgData.firstName + " " + selectedOrgData.lastName}
                  </span>
                )}

                <span className="user-name-btm pt-3">
                  {selectedOrgData && (
                    <span style={{ textTransform: "capitalize" }}>
                      {selectedOrgData.name + "(" + selectedOrgData.userRole + ")"}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </li>

          {userData.length > 0 && (
            <div className="acc-help-support-list-view">
              {userData.map((item, index) => {
                return (
                  <li key={"user" + index}>
                    <a onClick={() => this.onOrganisationChange(item)}>
                      <span style={{ textTransform: "capitalize" }}>{item.name + "(" + item.userRole + ")"}</span>
                    </a>
                  </li>
                )
              })}
            </div>
          )}

          <div className="acc-help-support-list-view">
            <li className={menuName === AppConstants.account ? "active" : ""}>
              <NavLink to="/account/profile">Account Settings</NavLink>
            </li>
            <li>
              <NavLink to="/support">Help & Support</NavLink>
            </li>
          </div>

          <li className="log-out">
            <a onClick={this.logout}>Log Out</a>
          </li>
        </ul>
      </div>
    );
  }

  render() {
    let menuName = this.props.menuName;
    return (
      <header className="site-header">
        <div className="header-wrap">
          <div className="row m-0-res">
            <div className="col-sm-12 d-flex">
              <div className="logo-box">
                <NavLink to="/" className="site-brand">
                  <img src={AppImages.netballLogo1} alt=""/>
                </NavLink>

                <div className="col-sm dashboard-layout-menu-heading-view" onClick={this.props.onMenuHeadingClick}>
                  <span className="dashboard-layout-menu-heading">
                    {this.props.menuHeading}
                  </span>
                </div>

                {/* <div className="col-sm width_200 mt-1">
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 50,
                    }}
                  >
                    <span className="year-select-heading">
                      {AppConstants.organisation}:
                    </span>
                    <Select
                      style={{ minWidth: 160, minHeight: "initial" }}
                      name={"competition"}
                      className="year-select org-select"
                      onChange={organisationUniqueKey => this.onOrganisationChange(organisationUniqueKey)}
                      value={JSON.parse(JSON.stringify(this.state.organisationUniqueKey))}
                    >
                      {this.props.userState.venueOrganisation.map(item => {
                        return (
                          <Option key={"organisationUniqueKey" + item.organisationUniqueKey} value={item.organisationUniqueKey}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                </div> */}
              </div>
              <div className="user-right">
                <ul className="d-flex">
                  {/* <li>
                    <button
                      className="dashboard-lay-search-button"
                      onClick={() => this.searchView()}
                    >
                      <img
                        src={AppImages.searchIcon}
                        height="15"
                        width="15"
                        alt=""
                      />
                    </button>
                    <form className="search-form">
                      <div className="reg-product-search-inp-width">
                        <Input
                          className="product-reg-search-input"
                          placeholder="Search..."
                          prefix={
                            <Icon
                              type="search"
                              style={{
                                color: "rgba(0,0,0,.25)",
                                height: 16,
                                width: 16
                              }}
                            />
                          }
                        />
                      </div>
                    </form>
                  </li> */}
                  <li>
                    <div className="site-menu">
                      <div className="dropdown">
                        {this.props.isManuNotVisible !== true && <button
                          className="dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                        >
                          <img src={this.menuImageChange(menuName)} alt=""/>
                        </button>}
                        <ul className="dropdown-menu">
                          <li
                            className={
                              menuName === AppConstants.home ? "active" : ""
                            }
                          >
                            <div className="home-menu menu-wrap">
                              <NavLink to="/homeDashboard">
                                <span className="icon"/>
                                {AppConstants.home}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.user ? "active" : ""
                            }
                          >
                            <div className="user-menu menu-wrap">
                              <NavLink to="/userTextualDashboard">
                                <span className="icon"/>
                                {AppConstants.user}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.registration
                                ? "active"
                                : ""
                            }
                          >
                            <div className="registration-menu menu-wrap">
                              <NavLink to="/registrationDashboard">
                                <span className="icon"/>
                                {AppConstants.registration}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.competitions
                                ? "active"
                                : ""
                            }
                          >
                            <div className="competitions-menu menu-wrap">
                              <NavLink to="/competitionDashboard">
                                <span className="icon"/>
                                {AppConstants.competitions}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.liveScores
                                ? "active"
                                : ""
                            }
                          >
                            <div className="lives-cores menu-wrap">
                              <NavLink to="/liveScoreCompetitions">
                                <span className="icon"/>
                                {AppConstants.liveScores}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.events ? "active" : ""
                            }
                          >
                            <div className="events-menu menu-wrap">
                              <a href="#">
                                <span className="icon"/>
                                {AppConstants.events}
                              </a>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.shop ? "active" : ""
                            }
                          >
                            <div className="shop-menu menu-wrap">
                              <NavLink to="/shopDashboard">
                                <span className="icon"/>
                                {AppConstants.shop}
                              </NavLink>
                            </div>
                          </li>
                          <li
                            className={
                              menuName === AppConstants.umpires ? "active" : ""
                            }
                          >
                            <div className="umpires-menu menu-wrap">
                              <NavLink to="/umpireDashboard">
                                <span className="icon"/>
                                {AppConstants.umpires}
                              </NavLink>
                            </div>
                          </li>
                          {/* <li
                            className={
                              menuName === AppConstants.incidents
                                ? "active"
                                : ""
                            }
                          >
                            <div className="incidents-menu menu-wrap">
                              <a href="#">
                                <span className="icon"></span>
                                {AppConstants.incidents}
                              </a>
                            </div>
                          </li> */}
                          <li
                            className={
                              menuName === AppConstants.finance ? "active" : ""
                            }
                          >
                            <div className="finance-menu menu-wrap">
                              <a href="#">
                                <span className="icon"/>
                                {AppConstants.finance}
                              </a>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="user-profile-box">
                      {this.userProfileDropdown()}
                    </div>
                  </li>
                </ul>
                {/* {this.state.windowMobile && (
                  <div className="dash-search-inp-width">
                    <Input
                      className="product-reg-search-input"
                      placeholder="Search..."
                      prefix={
                        <Icon
                          type="search"
                          style={{
                            color: "rgba(0,0,0,.25)",
                            height: 16,
                            width: 16
                          }}
                        />
                      }
                    />
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getUserOrganisationAction,
    onOrganisationChangeAction,
    clearHomeDashboardData,
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    userState: state.UserState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout);
