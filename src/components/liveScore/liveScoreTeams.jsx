import React, { Component } from "react";
import { Input, Icon, Layout, Button, Table, Breadcrumb, Pagination } from "antd";

import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { getTeamsWithPagging } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import history from "../../util/history";
import { isArrayNotEmpty } from "../../util/helpers";
const { Content } = Layout;


/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}
////columens data
const columns = [
    {
        title: 'Logo',
        dataIndex: 'logoUrl',
        key: 'logoUrl',
        sorter: (a, b) => tableSort(a, b, "logoUrl"),
        render: (logoUrl) => logoUrl ? <img style={{ height: 60, width: 80 }} src={logoUrl} /> : <span>{AppConstants.noImage}</span>,
    },
    {
        title: 'Team Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => tableSort(a, b, "name"),
        render: (name, record) =>

            <NavLink to={{
                pathname: "/liveScoreTeamView",
                state: { tableRecord: record, screenName: 'fromTeamList' }
            }} >
                <span className="input-heading-add-another pt-0">{name}</span>
            </NavLink>,
    },
    {
        title: 'Team Alias Name',
        dataIndex: 'alias',
        key: 'alias',
        sorter: (a, b) => tableSort(a, b, "alias"),
        render: (alias) => <span>{alias}</span>
    },
    {
        title: 'Affiliate',
        dataIndex: 'organisation',
        key: 'organisation',
        sorter: (a, b) => tableSort(a, b, "organisation"),
        render: (organisation) => <span>{organisation ? organisation.name : ""}</span>
    },

    // Affiliate
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        sorter: (a, b) => tableSort(a, b, "division"),
        render: (division) => <span>{division ? division.name : ""}</span>
    },
    {
        title: '#Players',
        dataIndex: 'playersCount',
        key: 'playersCount',
        sorter: (a, b) => tableSort(a, b, "playersCount"),
        render: (playersCount) => <span>{playersCount}</span>
    },
    {
        title: 'Manager',
        dataIndex: 'managers',
        key: 'managers',
        sorter: (a, b) => tableSort(a, b, "managers"),
        render: (managers, record) => <span >

            {isArrayNotEmpty(managers) && managers.map((item) => (
                <span className="live-score-desc-text side-bar-profile-data" >{item.name}</span>
            ))
            }
        </span>
    },
    {
        title: 'Contact',
        dataIndex: 'managers',
        key: 'managers',
        sorter: (a, b) => tableSort(a, b, "managers"),

        render: (managers, record) => <span>
            {isArrayNotEmpty(managers) && managers.map((item) => (
                <span className="live-score-desc-text side-bar-profile-data" >{item.mobileNumber}</span>
            ))
            }
        </span>
    },

    {
        title: 'Email',
        dataIndex: 'managers',
        key: 'managers',
        sorter: (a, b) => tableSort(a, b, "managers"),
        render: (managers, record) => <span>
            {isArrayNotEmpty(managers) && managers.map((item) => (
                <span className="live-score-desc-text side-bar-profile-data" >{item.email}</span>
            ))
            }
        </span>
    },
];


class LiveScoreTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conpetitionId: null,
            searchText: ""
        };
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ conpetitionId: id })
        if (id !== null) {
            this.props.getTeamsWithPagging(id, 0, 10, this.state.searchText)
        } else {
            history.push("/")
        }

    }

    /// Handle Page change
    handlePageChnage(page) {
        let offset = page ? 10 * (page - 1) : 0;
        this.props.getTeamsWithPagging(this.state.conpetitionId, offset, 10, this.state.searchText)
    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            this.props.getTeamsWithPagging(this.state.conpetitionId, 0, 10, e.target.value)
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            this.props.getTeamsWithPagging(this.state.conpetitionId, 0, 10, this.state.searchText)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {

        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            this.props.getTeamsWithPagging(this.state.conpetitionId, 0, 10, this.state.searchText)
        }
    }
    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row ">
                    <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.teamList}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                        <div className="row">

                            <div className="col-sm pt-1">
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

                            <div className="col-sm pt-1">
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
                            <div className="col-sm pt-1">
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
                {/* search box */}

                <div className="col-sm pt-5 ml-3" style={{ display: "flex", justifyContent: 'flex-end' }} >
                    <div className="comp-product-search-inp-width" >
                        <Input className="product-reg-search-input"
                            onChange={(e) => this.onChangeSearchText(e)}
                            placeholder="Search..."
                            onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                            prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                onClick={() => this.onClickSearchIcon()}
                            />}
                            allowClear
                        />
                    </div>
                </div>
            </div>
        )
    }


    ////////tableView view for Team list
    tableView = () => {
        const teamResult = this.props.liveScoreTeamState;
        const teamData = teamResult.teamResult;
        let total = teamResult.totalTeams
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
                        total={total}
                        onChange={(page) => this.handlePageChnage(page)}
                    />
                </div>
            </div>
        );
    };

    ////main render method
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
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
    return bindActionCreators({ getTeamsWithPagging }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreTeamState: state.LiveScoreTeamState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreTeam));
