import React, { Component } from 'react';
import { Layout, Breadcrumb, Button } from 'antd';
import './user.css';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
// import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
// import AppImages from "../../themes/appImages";
import history from '../../util/history';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { getOrganisationData } from "../../util/sessionStorage";
import { getUserModuleMedicalInfoAction } from '../../store/actions/userAction/userAction';
// import moment from 'moment';

const { Header, Footer, Content } = Layout;
// const { Option } = Select;
// const { SubMenu } = Menu;
// let this_Obj = null;

class UserModuleMedical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      loading: false,
    };
    // this_Obj = this;
    // let userId = 877;
  }

  componentDidMount() {
    let userState = this.props.userState;
    let userId = userState.userId;
    this.apiCalls(userId);
  }

  componentDidUpdate(nextProps) {
    let userState = this.props.userState;
    if (userState.onLoad === false && this.state.loading === true) {
      if (!userState.error) {
        this.setState({
          loading: false,
        });
      }
    }
  }

  apiCalls = userId => {
    this.props.getUserModuleMedicalInfoAction(userId);
  };

  headerView = () => {
    return (
      <Header className="comp-player-grades-header-view container mb-n3">
        <div className="row">
          <div className="col-sm d-flex align-content-center">
            <Breadcrumb separator=" > ">
              <Breadcrumb.Item className="breadcrumb-add">{AppConstants.medical}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      </Header>
    );
  };

  contentView = () => {
    let userState = this.props.userState;
    let medical = userState.medicalData;
    return (
      <div className="content-view pt-4" style={{ fontSize: '14px' }}>
        {(medical || []).map((item, index) => (
          <div>
            <div>Existing Medical Conditions: {item.existingMedicalCondition}</div>
            <div>Regular Medications: {item.regularMedication}</div>
          </div>
        ))}
      </div>
    );
  };

  footerView = () => {
    return (
      <div className="fluid-width">
        <div className="footer-view">
          <div className="row">
            <div className="col-sm">
              <div className="d-flex justify-content-end">
                {/* <Button onClick={() => this.props.addVenueAction(venuData)} className="open-reg-button" type="primary"> */}
                <Button
                  className="open-reg-button"
                  type="primary"
                  style={{ marginRight: 20 }}
                  onClick={() => history.push('/userTextualDashboard')}
                >
                  {AppConstants.cancel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="fluid-width default-bg">
        <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
        <InnerHorizontalMenu menu="userModule" userModuleSelectedKey="4" />
        <Layout>
          {this.headerView()}
          <Content className="container">{this.contentView()}</Content>
          <Footer>{this.footerView()}</Footer>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserModuleMedicalInfoAction,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    userState: state.UserState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserModuleMedical);
