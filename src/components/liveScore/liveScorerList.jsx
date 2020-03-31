import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Pagination, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import scorerData from "../../mocks/liveScorerList";
import { liveScoreScorerListAction } from '../../store/actions/LiveScoreAction/liveScoreScorerAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import history from '../../util/history'


function getName(item) {

    var name = item.name;
    console.log(name, "itemmmm")
    return name;
}
const { Content, Footer } = Layout;
const columns = [

    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => a.firstName.length - b.firstName.length,
        render: (firstName, record) =>
            <NavLink to={{
                pathname: '/liveScorerView',
                // pathname: '/userPersonal',
                state: { tableRecord: record, userId: record.id }
            }}>
                <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => a.lastName.length - b.lastName.length,
        render: (firstName, record) =>
            <NavLink to={{
                pathname: '/liveScorerView',
                state: { tableRecord: record, userId: record.id }
            }}>
                <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.length - b.email.length,
    },
    {
        title: 'Contact No',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
        sorter: (a, b) => a.mobileNumber.length - b.mobileNumber.length,
    },
    {
        title: 'Team',
        dataIndex: 'teams',
        key: 'teams',
        sorter: (a, b) => a.teams.length - b.teams.length,
        render: (teams, record) =>
            <NavLink to={{
                pathname: '/liveScorerView',
                // pathname: '/userPersonal',
                state: { tableRecord: record, userId: record.id }
            }}>
                {teams.length > 0 && teams.map((item) => (
                    <span class="input-heading-add-another pt-0" >{item.name}</span>
                ))
                }
            </NavLink>
    },
    {
        title: "Action",
        render: (data, record) => <Menu
            className="action-triple-dot-submenu"
            theme="light"
            mode="horizontal"
            style={{ lineHeight: '25px' }}
        >
            <Menu.SubMenu
                key="sub1"
                title={
                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                }
            >
                <Menu.Item key={'1'}>
                    <NavLink to={{
                        pathname: '/liveScorerView',
                        state: { tableRecord: record }
                    }}><span >Edit</span></NavLink>
                </Menu.Item>
                <Menu.Item key="2" >
                    <NavLink to={{
                        pathname: "./liveScoreAssignMatch",
                        state: { record: record }
                    }}><span >Assign to match</span></NavLink>
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    }
];

const { id } = 1
// JSON.parse(getLiveScoreCompetiton())
class LiveScorerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            scorerTableData: scorerData.scorerData,
        }
    }

    componentDidMount() {
        // let competitionId = getCompetitonId()
        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            },
            "searchText": ""
        }
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {

            this.props.liveScoreScorerListAction(id, 4, body)
        } else {
            history.push('/')
        }
    }
    handlePaggination(page) {
        let offset = page ? 10 * (page - 1) : 0;
        const body = {
            "paging": {
                "limit": 10,
                "offset": offset
            },
            "searchText": ""
        }

        this.props.liveScoreScorerListAction(id, 4, body)
    }
    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                < div className="row" >
                    <div className="col-sm" >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.scorers}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm" style={{

                        display: "flex",
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}>
                        <div className="row">
                            <div className="col-sm">
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end"
                                    }}>
                                    <NavLink to="/liveScoreAddScorer">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addScorer}
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
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end"
                                    }}>

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
                        </div>
                    </div>
                </div >
            </div >
        )
    }
    ////////form content view
    contentView = () => {
        let { liveScoreScorerState } = this.props;
        const { scorerListResult, scorerListCurrentPage, scorerListTotalCount } = this.props.liveScoreScorerState
        let dataSource = scorerListResult ? scorerListResult : []
        // let currentPage = liveScoreScorerState.scorerListResult ? scorerList.page.currentPage : 0
        // let totalpage = liveScoreScorerState.scorerListResult ? scorerList.page.totalCount : 0

        return (

            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table" columns={columns} dataSource={dataSource}
                        pagination={false}
                        loading={this.props.liveScoreScorerState.onLoad == true ? true : false}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={scorerListCurrentPage}
                        total={scorerListTotalCount}
                        onChange={(page) => this.handlePaggination(page)}
                    // defaultPageSize={10}
                    />
                </div>
            </div>
        )
    }

    /////// render function 
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"5"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
                    </Content>

                </Layout>
            </div>
        );
    }
}
function mapDispatchtoprops(dispatch) {
    return bindActionCreators({ liveScoreScorerListAction }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreScorerState: state.LiveScoreScorerState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScorerList));
