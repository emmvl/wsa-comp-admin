import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination } from "antd";

import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'
import history from "../../util/history";
const { Content } = Layout;

////columens data
const columns = [
    {
        title: 'Logo',
        dataIndex: 'logoUrl',
        key: 'logoUrl',
        render: (logoUrl) => logoUrl ? <img style={{ height: 60, width: 80 }} src={logoUrl} /> : <span>{AppConstants.noImage}</span>,
    },
    {
        title: 'Team Name',
        dataIndex: 'name',
        key: 'name',
        // sorter: (a, b) => a.team.length - b.team.length,
        render: (name, record) =>
            <NavLink to={{
                pathname: "/liveScoreTeamView",
                state: { teamId: record.id, screen: 'Team' }
            }} >
                <span className="input-heading-add-another pt-0">{name}</span>
            </NavLink>,
    },
    {
        title: 'Team Alias Name',
        dataIndex: 'alias',
        key: 'alias',
        // sorter: (a, b) => a.alias.length - b.alias.length,
        render: (alias) => <span>{alias}</span>
    },
    {
        title: 'Affiliate',
        dataIndex: 'organisation',
        key: 'organisation',
        // sorter: (a, b) => a.organisation.length - b.organisation.length,
        render: (organisation) => <span>{organisation.name}</span>
    },

    // Affiliate
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        // sorter: (a, b) => a.division.length - b.division.length,
        render: (division) => <span>{division.name}</span>
    },
    {
        title: '#Players',
        dataIndex: 'playersCount',
        key: 'playersCount',
        // sorter: (a, b) => a.playersCount.length - b.playersCount.length,
        render: (playersCount) => <span>{playersCount}</span>
    },
    {
        title: 'Manager',
        dataIndex: 'managers',
        key: 'managers',
        // sorter: (a, b) => a.manager.length - b.manager.length,
        render: (managers) => <span>{managers[0].name}</span>
    },
    {
        title: 'Contact',
        dataIndex: 'managers',
        key: 'managers',
        // sorter: (a, b) => a.managers.length - b.managers.length,
        render: (managers) => <span>{managers[0].mobileNumber}</span>
        // render: (managers, record) =>
        //     <NavLink to={{
        //         pathname: '',
        //         state: { tableRecord: record }
        //     }}>
        //         {managers.length > 0 && managers.map((item) => (
        //             <span class="input-heading-add-another pt-0" >{item.mobileNumber}</span>
        //         ))
        //         }
        //     </NavLink>
    },

    {
        title: 'Email',
        dataIndex: 'managers',
        key: 'managers',
        // sorter: (a, b) => a.managers.length - b.managers.length,
        render: (managers) => <span>{managers[0].email}</span>

        // render: (managers, record) =>
        //     <NavLink to={{
        //         pathname: '',
        //         state: { tableRecord: record }
        //     }}>
        //         {managers.length > 0 && managers.map((item) => (
        //             <span class="input-heading-add-another pt-0" >{item.email}</span>
        //         ))
        //         }
        //     </NavLink>
    },
];

////Array data
const data = [
    {
        key: '1',
        team: "WAS 1",
        division: "11 A",
        player: "2",
        manager: "test score",
        number: "9646097979",
        email: "amit.webethics@gmail.com",
        image: null
    },
    {
        key: '2',
        team: "WSA 2",
        division: "11 B",
        player: "6",
        manager: "Darren Geros",
        number: "0414753444",
        email: "darren.geros@oracle.com",
        image: null
    },


];

class LiveScoreTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.getliveScoreTeams(id)
        } else {
            history.push("/")
        }

    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.teamList}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
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
                                    <NavLink to="/liveScoreAddTeam">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addTeam}
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
                                    <NavLink to="/liveScoreTeamImport">
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
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    ////////tableView view for Team list
    tableView = () => {
        const teamResult = this.props.liveScoreTeamState;
        const teamData = teamResult.teamResult;
        // console.log(teamResult.teamResult, "teamResult")
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreTeamState.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={teamData}
                        pagination={false}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        defaultCurrent={1}
                        total={8}
                    // onChange={this.handleTableChange}
                    />
                </div>
            </div>
        );
    };

    ////main render method
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"3"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.tableView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}
// export default LiveScoreTeam;

function mapDispatchtoprops(dispatch) {
    return bindActionCreators({ getliveScoreTeams }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreTeamState: state.LiveScoreTeamState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreTeam));
