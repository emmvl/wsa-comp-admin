import React, { Component } from "react";
import {

  Layout,
  Breadcrumb,
  Button,
  Table,
  Pagination,
  Icon,
  Menu,
  Input,

} from "antd";
import "./liveScore.css";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import { liveScoreCoachListAction } from '../../store/actions/LiveScoreAction/liveScoreCoachAction'
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArrayNotEmpty } from '../../util/helpers'
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'

const { Content } = Layout;
const { SubMenu } = Menu;
function tableSort(a, b, key) {
  let stringA = JSON.stringify(a[key]);
  let stringB = JSON.stringify(b[key]);
  return stringA.localeCompare(stringB);
}

const columns = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    sorter: (a, b) => tableSort(a, b, "firstName"),
    render: (firstName, record) =>
      // <NavLink to={{
      //   pathname: '/liveScoreCoachDetail',
      //   state: { userId: record.id, screenKey: "livescore" }
      // }}>
      <span class="input-heading-add-another pt-0" >{firstName}</span>
    //  </NavLink>
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
    sorter: (a, b) => tableSort(a, b, "lastName"),
    render: (lastName, record) =>
      // <NavLink to={{
      //   pathname: '/userPersonal',
      //   state: { userId: record.id, screenKey: "livescore" }
      // }}>
      <span class="input-heading-add-another pt-0" >{lastName}</span>
    //  </NavLink>
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => tableSort(a, b, "email"),
  },
  {
    title: "Contact No",
    dataIndex: "mobileNumber",
    key: "mobileNumber",
    sorter: (a, b) => tableSort(a, b, "mobileNumber"),
  },
  {
    title: "Team",
    dataIndex: "linkedEntity",
    key: "linkedEntity",
    sorter: (a, b) => tableSort(a, b, "linkedEntity"),
    render: (linkedEntity, record) =>
    // <NavLink to={{
    //     pathname: '/userPersonal',
    //     state: { userId: record.id, screenKey: "livescoreCoach" }
    // }}>
    {
      linkedEntity.length > 0 && linkedEntity.map((item) => (
        <span style={{ color: '#ff8237', cursor: 'pointer' }} className="live-score-desc-text side-bar-profile-data" >{item.name}</span>
      ))
    }
    // </NavLink>
  },
  {
    title: 'Action',
    dataIndex: 'isUsed',
    key: 'isUsed',
    render: (isUsed, record) =>
      <Menu
        className="action-triple-dot-submenu"
        theme="light"
        mode="horizontal"
        style={{ lineHeight: '25px' }}>

        <SubMenu
          key="sub1"
          title={
            <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
          }>
          <Menu.Item key="1">
            <NavLink to={{
              pathname: "/liveScoreAddEditCoach",
              state: { isEdit: true, tableRecord: record }
            }}>
              <span >Edit</span>
            </NavLink>
          </Menu.Item>
        </SubMenu>
      </Menu>
  }
];




class LiveScoreCoaches extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { id } = JSON.parse(getLiveScoreCompetiton())
    this.props.liveScoreCoachListAction(3, 1, id)

    if (id !== null) {
      this.props.getliveScoreTeams(id)
    } else {
      history.push('/')
    }
  }

  contentView = () => {
    let couchesList = isArrayNotEmpty(this.props.liveScoreCoachState.coachesResult) ? this.props.liveScoreCoachState.coachesResult : []
    let teamList = isArrayNotEmpty(this.props.liveScoreCoachState.coachesResult) ? this.props.liveScoreCoachState.coachesResult : []
    console.log(couchesList, "couchesList")
    return (
      <div className="comp-dash-table-view mt-4">
        <div className="table-responsive home-dash-table-view">
          <Table
            className="home-dashboard-table"
            columns={columns}
            dataSource={couchesList}
            pagination={false}
            loading={this.props.liveScoreCoachState.onLoad === true && true}
          />
        </div>
        <div className="comp-dashboard-botton-view-mobile">
          <div
            className="comp-dashboard-botton-view-mobile"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end"
            }} >
            <Pagination
              className="auto-pagination"
              defaultCurrent={1}
              total={8} />
          </div>
        </div>
      </div>
    );
  };

  ///////view for breadcrumb
  headerView = () => {
    return (
      <div className="comp-player-grades-header-drop-down-view mt-4">
        <div className="row">
          <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
            <Breadcrumb separator=" > ">
              <Breadcrumb.Item className="breadcrumb-add">{AppConstants.coachList}</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
            <div className="row">
              <div className="col-sm">
                <div
                  className="comp-dashboard-botton-view-mobile"
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <NavLink to="/liveScoreAddEditCoach">
                    <Button className="primary-add-comp-form" type="primary">
                      + {AppConstants.addCoach}
                    </Button>
                  </NavLink>
                </div>
              </div>
              <div className="col-sm">
                <div
                  className="comp-dashboard-botton-view-mobile"
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end"
                  }}
                >
                  <Button className="primary-add-comp-form" type="primary">

                    <div className="row">
                      <div className="col-sm">
                        <img
                          src={AppImages.export}
                          alt=""
                          className="export-image"
                        />
                        {AppConstants.export}
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
              <div className="col-sm">
                <div
                  className="comp-dashboard-botton-view-mobile"
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end"
                  }}
                >
                  {/* <NavLink to="/liveScoreMatchImport"> */}
                  <Button className="primary-add-comp-form" type="primary">

                    <div className="row">
                      <div className="col-sm">
                        <img
                          src={AppImages.import}
                          alt=""
                          className="export-image"
                        />
                        {AppConstants.import}
                      </div>
                    </div>
                  </Button>
                  {/* </NavLink> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5" style={{ display: "flex", justifyContent: 'flex-end' }} >
          <div className="comp-product-search-inp-width" >
            <Input className="product-reg-search-input"
              // onChange={(e) => this.onChangeSearchText(e)}
              placeholder="Search..."
              // onKeyPress={(e) => this.onKeyEnterSearchText(e)}
              prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
              // onClick={() => this.onClickSearchIcon()}
              />}
              allowClear
            />
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
        <DashboardLayout
          menuHeading={AppConstants.liveScores}
          menuName={AppConstants.liveScores}
          onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
        />
        <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"23"} />
        <Layout>
          {this.headerView()}

          <Content>{this.contentView()}</Content>
        </Layout>
      </div>
    );
  }
}


function mapDispatchtoprops(dispatch) {
  return bindActionCreators({
    liveScoreCoachListAction,
    getliveScoreTeams
  }, dispatch)
}

function mapStatetoProps(state) {
  return {
    liveScoreCoachState: state.LiveScoreCoachState
  }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreCoaches));

// export default LiveScoreCoaches;
