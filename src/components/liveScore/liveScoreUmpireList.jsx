import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination, Input, Icon } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import { liveScoreUmpiresListAction } from '../../store/actions/LiveScoreAction/livescoreUmpiresAction'
import history from "../../util/history";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { getTime, liveScore_formateDate } from '../../themes/dateformate'
import { exportFilesAction } from "../../store/actions/appAction"


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
        title: 'Date', 
        dataIndex: 'match',
        key: 'match',
        sorter: (a, b) => tableSort(a, b, "match"),
        render: (match) =>
            <span  >{match ? liveScore_formateDate(match.startTime) : ""}</span>
    },
    {
        title: 'Time',
        dataIndex: 'match',
        key: 'match',
        sorter: (a, b) => tableSort(a, b, "match"),
        render: (match) =>
            <span  >{match ? getTime(match.startTime) : ""}</span>
    },
    {
        title: 'Match',
        dataIndex: 'match',
        key: 'match',
        sorter: (a, b) => tableSort(a, b, "match"),
        render: (match, record) =>
            <NavLink to={{
                pathname: "/liveScoreMatchDetails",
                state: { matchId: record.matchId }
            }}>
                <span className="input-heading-add-another pt-0" >{match.team1.name} vs {match.team2.name}</span>
            </NavLink>
    },
    {
        title: 'First Umpire Name',
        dataIndex: 'umpire1FullName',
        key: 'umpire1FullName',
        sorter: (a, b) => tableSort(a, b, "umpire1FullName"),
        render: (umpire1FullName) => <NavLink to={{
            // pathname: "/liveScoreMatchDetails",
            // state: { tableRecord: record }
        }}>
            <span className="input-heading-add-another pt-0">{umpire1FullName}</span>
        </NavLink>
    },

    {
        title: 'First Umpire Club',
        dataIndex: 'umpire1Club',
        key: 'umpire1Club',
        sorter: (a, b) => tableSort(a, b, "umpire1Club"),
        render: (umpire1Club) =>
            <span>{umpire1Club ? umpire1Club.name : ""}</span>
    },
    {
        title: 'Second Umpire Name',
        dataIndex: 'umpire2FullName',
        key: 'umpire2FullName',
        sorter: (a, b) => tableSort(a, b, "umpire2FullName"),
        render: (umpire2FullName) => <NavLink to={{
            // pathname: "/liveScoreMatchDetails",
            // state: { tableRecord: record }
        }}>
            <span className="input-heading-add-another pt-0">{umpire2FullName ? umpire2FullName : ""}</span>
        </NavLink>
    },
    {
        title: 'Second Umpire Club',
        dataIndex: 'umpire2Club',
        key: 'umpire2Club',
        sorter: (a, b) => tableSort(a, b, "umpire2Club"),
        render: (umpire2Club) =>
            <span>{umpire2Club ? umpire2Club.name : ""}</span>
    },
];


class LiveScoreUmpireList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            competitionId: null
        };
    }

    componentDidMount() {

        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                },
                "search": this.state.searchText
            }
            this.props.liveScoreUmpiresListAction(id, body)
        } else {
            history.push("/")
        }

        this.setState({ competitionId: id })
    }

    handleUmpireTableList(page, competitionId) {

        let offset = page ? 10 * (page - 1) : 0
        const body =
        {
            "paging": {
                "limit": 10,
                "offset": offset
            },
        }

        this.props.liveScoreUmpiresListAction(competitionId, body)

    }

    // on change search text
    onChangeSearchText = (e) => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                },
                "search": e.target.value
            }

            this.props.liveScoreUmpiresListAction(id, body)
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (code === 13) { //13 is the enter keycode
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                },
                "search": e.target.value
            }
            this.props.liveScoreUmpiresListAction(id, body)
        }
    }
    // on click of search icon
    onClickSearchIcon = () => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            const body =
            {
                "paging": {
                    "limit": 10,
                    "offset": 0
                },
                "search": this.state.searchText
            }
            this.props.liveScoreUmpiresListAction(id, body)
        }
    }

    // on Export
    onExport = () => {
        let url = AppConstants.matchExport + this.state.competitionId
        this.props.exportFilesAction(url)
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.umpireList}</Breadcrumb.Item>
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
                                        <NavLink to={{ 
                                            pathname: `/liveScoreUmpireImport`,
                                            state: { screenName: 'liveScoreUmpireList' }
                                        }} className="text-decoration-none">
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
                <div className="mt-5" style={{ display: "flex", justifyContent: 'flex-end' }} >
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


    ////////tableView view for Umpire list
    tableView = () => {
        const { umpiresListResult } = this.props.liveScoreUmpiresState
        const { id } = JSON.parse(getLiveScoreCompetiton())

        let dataSource = umpiresListResult ? umpiresListResult.matchUmpires : []
        // let total = this.props.umpiresListResult.umpirescount
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreUmpiresState.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
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
                    </div>
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            // current={this.props.liveScoreUmpiresState.page.currentPage}
                            current={1}
                            total={10}
                            onChange={(page) => this.handleUmpireTableList(page, id)}
                            defaultPageSize={10}
                        />
                    </div>
                </div>
            </div>
        );
    };

    ////main render method
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"6"} />
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreUmpiresListAction, exportFilesAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreUmpiresState: state.LiveScoreUmpiresState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreUmpireList));

