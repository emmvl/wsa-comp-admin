import React, { Component } from "react";
import { Input, Icon, Layout, Button, Table, Breadcrumb, Pagination } from "antd";

import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { getTeamsWithPagination } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import history from "../../util/history";
import { exportFilesAction } from "../../store/actions/appAction"

import { isArrayNotEmpty, teamListData } from "../../util/helpers";
const { Content } = Layout;

let this_Obj = null

//listeners for sorting
const listeners = (key) => ({
    onClick: () => tableSort(key),
});

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }

    this_Obj.setState({ sortBy, sortOrder });

    this_Obj.props.getTeamsWithPagination(this_Obj.state.conpetitionId, this_Obj.state.offset, 10, this_Obj.state.searchText, sortBy, sortOrder)
}
////columens data
const columns = [
    {
        title: 'Logo',
        dataIndex: 'logoUrl',
        key: 'logoUrl',
        sorter: false,
        render: (logoUrl) => logoUrl ? <img style={{ height: 60, width: 80 }} src={logoUrl} /> : <span>{AppConstants.noImage}</span>,
    },
    {
        title: 'Team Name',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('teamName'),
        render: (name, record) => teamListData(record.id) ?

            <NavLink to={{
                pathname: "/liveScoreTeamView",
                state: { tableRecord: record, screenName: 'fromTeamList' }
            }} >
                <span className="input-heading-add-another pt-0">{record.name}</span>
            </NavLink> :
            <span >{name}</span>
    },
    {
        title: 'Team Alias Name',
        dataIndex: 'alias',
        key: 'alias',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('teamAliasName'),
        render: (alias) => <span>{alias}</span>
    },
    {
        title: 'Affiliate',
        dataIndex: 'competitionOrganisation',
        key: 'organisation',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('affiliate'),
        render: (competitionOrganisation) => <span>{competitionOrganisation ? competitionOrganisation.name : ""}</span>
    },

    // Affiliate
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('division'),
        render: (division) => <span>{division ? division.name : ""}</span>
    },
    {
        title: '#Players',
        dataIndex: 'playersCount',
        key: 'playersCount',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('players'),
        render: (playersCount) => <span>{playersCount}</span>
    },
    {
        title: 'Manager',
        dataIndex: 'managers',
        key: 'managers_1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('manager'),
        render: (managers, record) => <div>
            {isArrayNotEmpty(managers) && managers.map((item, i) => (
                <span key={`managerName${i}` + item.id} className="desc-text-style side-bar-profile-data" >{item.name}</span>
            ))
            }
        </div>
    },
    {
        title: 'Contact',
        dataIndex: 'managers',
        key: 'managers_2',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('contact'),

        render: (managers, record) => <div>
            {isArrayNotEmpty(managers) && managers.map((item, i) => (
                <span key={`managerMobile${i}` + item.id} className="desc-text-style side-bar-profile-data" >{item.mobileNumber}</span>
            ))
            }
        </div>
    },

    {
        title: 'Email',
        dataIndex: 'managers',
        key: 'managers_3',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('email'),
        render: (managers, record) => <div>
            {isArrayNotEmpty(managers) && managers.map((item, index) => (
                <span key={`managerEmail${index}` + item.id} className="desc-text-style side-bar-profile-data" >{item.email}</span>
            ))
            }
        </div>
    },
];


class LiveScoreTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conpetitionId: null,
            searchText: "",
            offset: 0
        };
        this_Obj = this
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ conpetitionId: id })
        if (id !== null) {
            this.props.getTeamsWithPagination(id, 0, 10, this.state.searchText)
        } else {
            history.push("/")
        }

    }

    /// Handle Page change
    handlePageChnage(page) {
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({ offset: offset })
        this.props.getTeamsWithPagination(this.state.conpetitionId, offset, 10, this.state.searchText, this.state.sortBy, this.state.sortOrder)
    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            this.props.getTeamsWithPagination(this.state.conpetitionId, 0, 10, e.target.value, this.state.sortBy, this.state.sortOrder)
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            this.props.getTeamsWithPagination(this.state.conpetitionId, 0, 10, this.state.searchText)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {

        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            this.props.getTeamsWithPagination(this.state.conpetitionId, 0, 10, this.state.searchText)
        }
    }

    // on Export
    onExport = () => {
        let url = AppConstants.teamExport + this.state.conpetitionId + `&offset=${this.state.offset}&limit=${10}`
        this.props.exportFilesAction(url)
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

                                    <Button onClick={() => this.onExport()} className="primary-add-comp-form" type="primary">
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
                        rowKey={(record, index) => "teamData" + record.id + index}
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
    return bindActionCreators({ getTeamsWithPagination, exportFilesAction }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreTeamState: state.LiveScoreTeamState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreTeam));
