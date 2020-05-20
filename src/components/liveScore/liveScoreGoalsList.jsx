import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Pagination, Select, Button, Input, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreGoalListAction } from '../../store/actions/LiveScoreAction/liveScoreGoalsAction'
import history from "../../util/history";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { liveScore_formateDateTime } from '../../themes/dateformate'
import { exportFilesAction } from "../../store/actions/appAction"
let this_Obj = null



/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}


const { Content } = Layout;
const { Option } = Select;


class LiveScoreGoalList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
            teamSelection: "WSA 1",
            selectStatus: "Select Status",
            filter: "By Match",

            columns1: [

                {
                    title: 'Match Id',
                    dataIndex: 'matchId',
                    key: 'matchId',
                    sorter: (a, b) => tableSort(a, b, "matchId"),


                },
                {
                    title: 'Date',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    sorter: (a, b) => tableSort(a, b, "startTime"),
                    render: (startTime) => <span  >{liveScore_formateDateTime(startTime)}</span>

                },
                {
                    title: 'Team',
                    dataIndex: 'teamName',
                    key: 'teamName',
                    sorter: (a, b) => tableSort(a, b, "teamName"),
                },
                {
                    title: 'First Name',
                    dataIndex: 'firstName',
                    key: 'firstName',
                    sorter: (a, b) => tableSort(a, b, "firstName"),
                    render: (firstName, record) =>
                        <NavLink to={{
                            pathname: '/liveScorePlayerView',
                            state: { tableRecord: record }
                        }}>
                            <span class="input-heading-add-another pt-0" >{firstName}</span>
                        </NavLink>
                },
                {
                    title: 'Last Name',
                    dataIndex: 'lastName',
                    key: 'lastName',
                    sorter: (a, b) => tableSort(a, b, 'lastName'),
                    render: (lastName, record) =>
                        <NavLink to={{
                            pathname: '/liveScorePlayerView',
                            state: { tableRecord: record }
                        }}>
                            <span class="input-heading-add-another pt-0" >{lastName}</span>
                        </NavLink>
                },
                {
                    title: 'Position',
                    dataIndex: 'gamePositionName',
                    key: 'gamePositionName',
                    sorter: (a, b) => tableSort(a, b, "gamePositionName"),

                },
                {
                    title: 'Misses',
                    dataIndex: 'miss',
                    key: 'miss',
                    sorter: (a, b) => tableSort(a, b, "miss"),
                },
                // {
                //     title: 'Attempts',
                //     dataIndex: 'attempts',
                //     key: 'attempts',
                //     sorter: (a, b) => checkSorting(a, b, "attempts"),
                // },
                {
                    title: 'Goals',
                    dataIndex: 'goal',
                    key: 'goal',
                    sorter: (a, b) => tableSort(a, b, "goal"),

                },
                {
                    title: 'Goals%',
                    dataIndex: 'goal_percent',
                    key: 'goal_percent',
                    sorter: (a, b) => tableSort(a, b, "goal_percent"),
                },
            ],
            columns2: [
                {
                    title: 'Team',
                    dataIndex: 'teamName',
                    key: 'teamName',
                    sorter: (a, b) => tableSort(a, b, "teamName"),
                },
                {
                    title: 'First Name',
                    dataIndex: 'firstName',
                    key: 'firstName',
                    sorter: (a, b) => tableSort(a, b, "firstName"),
                    render: (firstName, record) =>
                        <NavLink to={{
                            pathname: '/liveScorePlayerView',
                            state: { tableRecord: record }
                        }}>
                            <span class="input-heading-add-another pt-0" >{firstName}</span>
                        </NavLink>
                },
                {
                    title: 'Last Name',
                    dataIndex: 'lastName',
                    key: 'lastName',
                    sorter: (a, b) => tableSort(a, b, 'lastName'),
                    render: (lastName, record) =>
                        <NavLink to={{
                            pathname: '/liveScorePlayerView',
                            state: { tableRecord: record }
                        }}>
                            <span class="input-heading-add-another pt-0" >{lastName}</span>
                        </NavLink>
                },
                {
                    title: 'Position',
                    dataIndex: 'gamePositionName',
                    key: 'gamePositionName',
                    sorter: (a, b) => tableSort(a, b, "gamePositionName"),
                },
                {
                    title: 'Misses',
                    dataIndex: 'miss',
                    key: 'miss',
                    sorter: (a, b) => tableSort(a, b, "miss"),
                },
                // {
                //     title: 'Attempts',
                //     dataIndex: 'attempts',
                //     key: 'attempts',
                //     sorter: (a, b) => checkSorting(a, b, "attempts"),
                // },
                {
                    title: 'Goals',
                    dataIndex: 'goal',
                    key: 'goal',
                    sorter: (a, b) => tableSort(a, b, "goal"),
                },
                {
                    title: 'Goals%',
                    dataIndex: 'goal_percent',
                    key: 'goal_percent',
                    sorter: (a, b) => tableSort(a, b, "goal_percent"),
                },
            ],
            competitionId: null,
            searchText: "",
        }
    }

    componentDidMount() {
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ competitionId: id })
        if (id !== null) {
            this.props.liveScoreGoalListAction(id, this.state.filter, this.state.searchText)
        } else {
            history.push('/')
        }
    }


    onExport() {
        let url = AppConstants.goalExport + this.state.competitionId + `&aggregate=${this.state.filter}`
        this.props.exportFilesAction(url)
    }
    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            this.props.liveScoreGoalListAction(this.state.competitionId, this.state.filter, e.target.value)
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
      
        if (code === 13) { //13 is the enter keycode
            this.props.liveScoreGoalListAction(this.state.competitionId, this.state.filter, e.target.value)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {
       
        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            this.props.liveScoreGoalListAction(this.state.competitionId, this.state.filter, this.state.searchText)
        }
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view ">
                < div className="row" >
                    <div className="col-sm" style={{ alignSelf: 'center' }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.goalState}</Breadcrumb.Item>
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
                                <Select
                                    className="year-select"
                                    style={{ display: "flex", alignItems: "flex-start" }}
                                    onChange={(filter) => {
                                        this.setState({ filter })
                                        this.props.liveScoreGoalListAction(this.state.competitionId, filter, this.state.searchText)
                                    }}
                                    value={this.state.filter} >
                                    <Option value={AppConstants.ByMatch}>{AppConstants.ByMatch}</Option>
                                    <Option value={AppConstants.total}>{AppConstants.total}</Option>
                                </Select>
                            </div>
                            <div className="col-sm"
                                style={{ display: "flex" }}>
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignSelf: 'center',
                                        alignItems: "flex-end",
                                        justifyContent: "flex-end"
                                    }} >
                                    <Button onClick={() => this.onExport()} className="primary-add-comp-form" type="primary">
                                        <div className="row">
                                            <div className="col-sm">
                                                <img
                                                    src={AppImages.export}
                                                    alt=""
                                                    height="12"
                                                    width="12"
                                                    style={{ marginRight: 5 }}
                                                />
                                                {AppConstants.export}
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
                {/* search box */}
                <div className="col-sm pt-3 ml-3 " style={{ display: "flex", justifyContent: 'flex-end', }} >
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
    ////////form content view
    contentView = () => {
        const { liveScoreGoalState } = this.props;
        // let DATA = liveScoreMatchListState ? liveScoreMatchListState.liveScoreMatchListData : []
        let goalList = liveScoreGoalState ? liveScoreGoalState.result : [];

        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table loading={this.props.liveScoreGoalState.onLoad == true && true} className="home-dashboard-table" columns={this.state.filter == "By Match" ? this.state.columns1 : this.state.columns2} dataSource={goalList} pagination={false}
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
        )
    }

    /////// render function
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.shootingStats} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"16"} />
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
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreGoalListAction, exportFilesAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreGoalState: state.LiveScoreGoalState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreGoalList));


