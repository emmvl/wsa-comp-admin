import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal, Select } from "antd";

import AppConstants from "themes/appConstants";
import AppImages from "themes/appImages";
import history from "util/history";
import {
  setOrganisationData,
  getOrganisationData,
  clearUmpireStorage,
  setImpersonationAffiliate,
  getImpersonationAffiliate,
  setPrevUrl,
} from "util/sessionStorage";
import { clearHomeDashboardData } from "store/actions/homeAction/homeAction";
import {
  getAffiliatesListingAction,
  getOrganisationAction,
  getUserOrganisationAction,
  impersonationAction,
  onOrganisationChangeAction,
  getUreAction,
} from "store/actions/userAction/userAction";
import Loader from "customComponents/loader";

import "./layout.css";

const { Option } = Select;

class DashboardLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      windowMobile: false,
      dataOnload: false,
      impersonationLoad: true,
      openImpersonationModal: false,
      impersonationAffiliateOrgId: null,
      impersonationOrgData: null,
      logout: false,
    };
  }

  async componentDidUpdate(nextProps) {
    if (this.props.userState !== nextProps.userState) {
      if (this.props.userState.onLoad === false && this.state.dataOnload === true) {
        let organisationData = this.props.userState.getUserOrganisation;

        if (organisationData.length > 0) {
          let presetOrganisation = await this.getPresetOrganisation();

          let orgData = presetOrganisation ? presetOrganisation : getOrganisationData();
          let organisationItem = orgData ? orgData : organisationData[0];

          await setOrganisationData(organisationItem);
          this.props.onOrganisationChangeAction(organisationItem, "organisationChange");

          const isImpersonation = this.props.userState.userRoleEntity
            .findIndex((role) => role.roleId === 10) > -1;

          this.setState({
            dataOnload: false,
            impersonationOrgData: isImpersonation ? orgData : null,
          });
        }

        if (this.props.userState.impersonation && !this.state.impersonationLoad) {
          const impersonationAffiliate = this.state.impersonationAffiliateOrgId
            ? this.props.userState.affiliateList.find(
                (affiliate) => affiliate.affiliateOrgId === this.state.impersonationAffiliateOrgId,
              )
            : null;
          await setImpersonationAffiliate(impersonationAffiliate);

          window.location.reload();
        }
      }

      if (
        this.props.userState.impersonation
        && this.state.impersonationLoad
        && !this.props.userState.impersonationLoad
      ) {
        if (this.state.logout) {
          localStorage.clear();
          history.push("/login");
          // window.location.reload();
        } else if (!this.state.dataOnload) {
          this.props.getUserOrganisationAction();
          this.setState({
            dataOnload: true,
            impersonationLoad: false,
          });
        }
      }

      if (this.props.userState.userRoleEntity !== nextProps.userState.userRoleEntity) {
        const isImpersonation = this.props.userState.userRoleEntity
          .findIndex((role) => role.roleId === 10) > -1;

        const orgData = await getOrganisationData();

        this.setState({
          impersonationOrgData: isImpersonation ? orgData : null,
        });
      }
    }
  }

  componentDidMount() {
    this.setOrganisationKey();
    this.props.getUreAction();
  }

  getPresetOrganisation = () => {
    const userOrganisationData = this.props.userState.getUserOrganisation;
    const impersonationAffiliate = getImpersonationAffiliate();

    if (!impersonationAffiliate) {
      if (this.state.impersonationAffiliateOrgId) {
        return userOrganisationData.find((org) => org.organisationUniqueKey === this.state.impersonationAffiliateOrgId);
      }

      return null;
    }

    return userOrganisationData
      .find((org) => org.organisationUniqueKey === impersonationAffiliate.affiliateOrgId);
  }

  setOrganisationKey = () => {
    let organisationData = getOrganisationData();
    if (!organisationData) {
      this.props.userState.getUserOrganisation.length === 0 && this.props.getUserOrganisationAction();
      this.setState({ dataOnload: true });
    } else {
      this.props.userState.getUserOrganisation.length === 0 && this.props.getUserOrganisationAction();
      this.setState({ dataOnload: true });
    }
  }

  endImpersonation = async () => {
    const impersonationAffiliate = getImpersonationAffiliate();

    if (impersonationAffiliate) {
      this.props.impersonationAction({
        orgId: impersonationAffiliate.affiliateOrgId,
        access: false,
      });

      await setImpersonationAffiliate(null);
      await setOrganisationData(null);

      this.setState({ impersonationLoad: true, endImpersonation: true });
    }
  };

  logout = async () => {
    const impersonationOrg = getImpersonationAffiliate();
    if (impersonationOrg) {
      this.props.impersonationAction({
        orgId: impersonationOrg.affiliateOrgId,
        access: false,
      });

      this.setState({ logout: true });
    } else {
      localStorage.clear();
      history.push("/login");
      // window.location.reload();
    }
  };

  changeId = menuName => {
    switch (menuName) {
      case AppConstants.home:
        return AppConstants.home_icon;
      default:
        return AppConstants.home_icon;
    }
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

  searchView = () => {
    this.setState({ windowMobile: !this.state.windowMobile });
  };

  onOrganisationChange = async (organisationData) => {
    this.props.onOrganisationChangeAction(organisationData, "organisationChange");
    this.setFullStory(organisationData);
    setOrganisationData(organisationData);
    this.props.clearHomeDashboardData("user");
    clearUmpireStorage();
    localStorage.removeItem('own_competition')
    setPrevUrl(history.location);
    history.push("./homeDashboard", { orgChange: "changeOrg" });
    window.location.reload();
  }

  setFullStory = (organisationData) => {
    // if (organisationData != null) {
    //   let exOrgData = getOrganisationData();
    //   if (exOrgData == null || organisationData.organisationUniqueKey !== exOrgData.organisationUniqueKey) {
    //     setUserVars({
    //       displayName: organisationData.firstName + " " + organisationData.lastName,
    //       email: organisationData.userEmail,
    //       organisation: organisationData.name,
    //     });
    //   }
    // }
  };

  handleImpersonation = () => {
    const organisationData = getOrganisationData();
    this.props.getAffiliatesListingAction({
      organisationId: organisationData.organisationUniqueKey,
      affiliatedToOrgId: -1,
      organisationTypeRefId: -1,
      statusRefId: -1,
      paging: { limit: -1, offset: 0 },
    });
    this.setState({ openImpersonationModal: true });
  };

  handleImpersonationModal = (button) => {
    if (button === "ok") {
      this.setState({ openImpersonationModal: false });
      const orgData = this.props.userState.affiliateList.find((affiliate) => affiliate.affiliateOrgId === this.state.impersonationAffiliateOrgId);
      if (orgData) {
        this.props.impersonationAction({
          orgId: orgData.affiliateOrgId,
          access: true,
        });
      }
    } else {
      this.setState({ openImpersonationModal: false });
    }
  };

  handleImpersonationOrg = (e) => {
    this.setState({ impersonationAffiliateOrgId: e });
  };

  userProfileDropdown = () => {
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
          <img id={AppConstants.user_profile_icon} src={userImage} alt="" />
        </button>

        <ul className="dropdown-menu">
          <li>
            <div className="media">
              <div className="media-left">
                <figure className="user-img-wrap">
                  <img src={userImage} alt="" />
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
              {userData.map((item, index) => (
                <li key={"user" + index}>
                  <a onClick={() => this.onOrganisationChange(item)}>
                    <span style={{ textTransform: "capitalize" }}>{item.name + "(" + item.userRole + ")"}</span>
                  </a>
                </li>
              ))}
            </div>
          )}

          <div className="acc-help-support-list-view">
            {!this.state.impersonationOrgData && (
              <li>
                <a id={AppConstants.impersonation} onClick={this.handleImpersonation}>
                  {AppConstants.impersonation}
                </a>
              </li>
            )}
            <li className={menuName === AppConstants.account ? "active" : ""}>
              <NavLink id={AppConstants.acct_settings_label} to="/account/profile">Account Settings</NavLink>
            </li>
            <li>
              <NavLink id={AppConstants.help_support_label} to="/support">Help & Support</NavLink>
            </li>
          </div>

          <li className="log-out">
            <a id={AppConstants.log_out} onClick={this.logout}>Log Out</a>
          </li>
        </ul>
      </div>
    );
  };

  render() {
    let menuName = this.props.menuName;

    return (
      <>
        {this.state.impersonationOrgData && (
          <div className="col-sm-12 d-flex impersonation-bar">
            You are impersonating access to {this.state.impersonationOrgData.name}.
            <a onClick={this.endImpersonation}>End access</a>
          </div>
        )}

        <header
          className={`site-header ${
            this.state.impersonationLoad && this.state.impersonationOrgData
              ? "impersonation-site-header"
              : ""
          }`}
        >
          <div className="header-wrap">
            <div className="row m-0-res">
              <div className="col-sm-12 d-flex">
                <div className="logo-box">
                  <NavLink to="/" className="site-brand">
                    <img src={AppImages.netballLogo1} alt="" />
                  </NavLink>

                  <div className="col-sm dashboard-layout-menu-heading-view" onClick={this.props.onMenuHeadingClick}>
                    <span id={this.props.menuId} className="dashboard-layout-menu-heading">
                      {this.props.menuHeading}
                    </span>
                  </div>
                </div>

                <div className="user-right">
                  <ul className="d-flex">
                    <li>
                      <div className="site-menu">
                        <div className="dropdown">
                          {this.props.isManuNotVisible !== true && (
                            <button
                              className="dropdown-toggle"
                              type="button"
                              data-toggle="dropdown"
                            >
                              <img id={this.changeId(menuName)} src={this.menuImageChange(menuName)} alt="" />
                            </button>
                          )}

                          <ul className="dropdown-menu">
                            <li className={menuName === AppConstants.home ? "active" : ""}>
                              <div className="home-menu menu-wrap">
                                <NavLink to="/homeDashboard">
                                  <span className="icon" />
                                  {AppConstants.home}
                                </NavLink>
                              </div>
                            </li>
                            <li className={menuName === AppConstants.user ? "active" : ""}>
                              <div className="user-menu menu-wrap">
                                <NavLink to="/userTextualDashboard">
                                  <span className="icon" />
                                  {AppConstants.user}
                                </NavLink>
                              </div>
                            </li>
                            <li className={menuName === AppConstants.registration ? "active" : ""}>
                              <div id={AppConstants.registration_icon} className="registration-menu menu-wrap">
                                <NavLink to="/registrationDashboard">
                                  <span id={AppConstants.registrations_label} className="icon" />
                                  {AppConstants.registration}
                                </NavLink>
                              </div>
                            </li>
                            <li className={menuName === AppConstants.competitions ? "active" : ""}>
                              <div id={AppConstants.competition_icon} className="competitions-menu menu-wrap">
                                <NavLink to="/competitionDashboard">
                                  <span id={AppConstants.competitions_label} className="icon" />
                                  {AppConstants.competitions}
                                </NavLink>
                              </div>
                            </li>
                            <li className={menuName === AppConstants.liveScores ? "active" : ""}>
                              <div className="lives-cores menu-wrap">
                                <NavLink to="/liveScoreCompetitions">
                                  <span className="icon" />
                                  {AppConstants.liveScores}
                                </NavLink>
                              </div>
                            </li>
                            <li className={menuName === AppConstants.events ? "active" : ""}>
                              <div className="events-menu menu-wrap">
                                <a href="#">
                                  <span className="icon" />
                                  {AppConstants.events}
                                </a>
                              </div>
                            </li>
                            <li className={menuName === AppConstants.shop ? "active" : ""}>
                              <div className="shop-menu menu-wrap">
                                <NavLink to="/shopDashboard">
                                  <span className="icon" />
                                  {AppConstants.shop}
                                </NavLink>
                              </div>
                            </li>
                            <li className={menuName === AppConstants.umpires ? "active" : ""}>
                              <div className="umpires-menu menu-wrap">
                                <NavLink to="/umpireDashboard">
                                  <span className="icon" />
                                  {AppConstants.umpires}
                                </NavLink>
                              </div>
                            </li>
                            <li className={menuName === AppConstants.finance ? "active" : ""}>
                              <div className="finance-menu menu-wrap">
                                <a href="#">
                                  <span className="icon" />
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
                </div>
              </div>
            </div>
          </div>

          <Modal
            className="add-membership-type-modal"
            title={AppConstants.impersonationOrgSelect}
            visible={this.state.openImpersonationModal}
            onOk={() => this.handleImpersonationModal("ok")}
            onCancel={() => this.handleImpersonationModal("cancel")}
          >
            <Select
              className="w-100 reg-filter-select-competition"
              onChange={this.handleImpersonationOrg}
              placeholder="Organisation"
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              loading={this.props.userState.onLoad}
            >
              {(this.props.userState.affiliateList || []).map((affiliate) => (
                <Option
                  key={affiliate.affiliateOrgId}
                  value={affiliate.affiliateOrgId}
                >
                  {affiliate.affiliateName}
                </Option>
              ))}
            </Select>
          </Modal>

          <Loader visible={this.props.userState.impersonationLoad} />
        </header>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getUreAction,
    getUserOrganisationAction,
    onOrganisationChangeAction,
    clearHomeDashboardData,
    getOrganisationAction,
    impersonationAction,
    getAffiliatesListingAction,
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    userState: state.UserState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout);
