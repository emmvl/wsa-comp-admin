import React, { Component } from "react";
import { Input, Layout, Breadcrumb, Button, Table, Pagination, Icon, Select } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import matchList from "../../mocks/liveScoreMatchesList.mock"
import { NavLink } from "react-router-dom";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreMatchListAction, changeMatchBulkScore, bulkScoreUpdate,onCancelBulkScoreUpdate } from '../../store/actions/LiveScoreAction/liveScoreMatchAction'
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton, getUmpireCompetitonData } from '../../util/sessionStorage'
import { liveScore_MatchFormate } from '../../themes/dateformate'
import { exportFilesAction } from "../../store/actions/appAction"
import { isArrayNotEmpty, teamListData } from "../../util/helpers";
import { getLiveScoreDivisionList } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'
import { liveScoreRoundListAction } from '../../store/actions/LiveScoreAction/liveScoreRoundAction'
import { message } from "antd";
const { Content } = Layout;
const { Option } = Select;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

var _this = null
function setMatchResult(record) {
    if (record.team1ResultId !== null) {
        if (record.team1ResultId === 4 || record.team1ResultId === 6 || record.team1ResultId === 6) {
            return "Forfeit"
        } else if (record.team1ResultId === 8 || record.team1ResultId === 9) {
            return "Abandoned"
        } else {
            return record.score
        }
    } else {
        return record.score
    }
}

function setMatchBulkScore(record) {
    if (record.team1ResultId !== null) {
        if (record.team1ResultId === 4 || record.team1ResultId === 6 || record.team1ResultId === 6) {
            return true
        } else if (record.team1ResultId === 8 || record.team1ResultId === 9) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function getVenueName(data) {

    let venue_name = ""
    if (data.venue.shortName) {
        venue_name = data.venue.shortName + " - " + data.name
    } else {
        venue_name = data.venue.name + " - " + data.name
    }

    return venue_name
}


const columns = [
    {
        title: 'Match Id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, "id"),
        render: (id) => {
            return (
                _this.onMatchClick(id, '/liveScoreMatchDetails')
            )
        }
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => tableSort(a, b, "startTime"),
        render: (startTime) =>
            <span>{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
    },
    {
        title: 'Home',
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, "team1"),
        // render: (team1) => <span class="input-heading-add-another pt-0">{team1.name}</span>
        render: (team1, record) => teamListData(team1.id) ?
            <NavLink to={{
                pathname: '/liveScoreTeamView',
                state: { tableRecord: team1, screenName: 'fromMatchList' }
            }} >
                <span class="input-heading-add-another pt-0" >{team1.name}</span>
            </NavLink> : <span  >{team1.name}</span>
    },
    {
        title: 'Away',
        dataIndex: 'team2',
        key: 'team2',
        sorter: (a, b) => tableSort(a, b, "team2"),

        render: (team2, record) => teamListData(team2.id) ?
            <NavLink to={{
                pathname: '/liveScoreTeamView',
                state: { tableRecord: team2, screenName: 'fromMatchList' }
            }} >
                <span class="input-heading-add-another pt-0" >{team2.name}</span>
            </NavLink> :
            <span  >{team2.name}</span>
    },
    {
        title: 'Venue',
        dataIndex: 'venueCourt',
        key: 'venueCourt',
        sorter: (a, b) => tableSort(a, b, "venueCourt"),
        // render: (venueCourt, record) => <span>{venueCourt.venue.shortName + " - " + venueCourt.name}</span>
        render: (venueCourt, record) => <span>{getVenueName(venueCourt)}</span>
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        sorter: (a, b) => tableSort(a, b, "division"),
        render: (division) => <span>{division.name}</span>
    },
    {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        sorter: (a, b) => tableSort(a, b, "score"),
        // render: (score, records) => <span nowrap>{setMatchResult(records)}</span>
        render: (score, records, index) => {
            return (
                _this.scoreView(score, records, index)
            )
        }
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        sorter: (a, b) => tableSort(a, b, "type"),
    },
    {
        title: 'Match Duration',
        dataIndex: 'matchDuration',
        key: 'matchDuration',
        sorter: (a, b) => tableSort(a, b, "matchDuration"),
    },
    {
        title: 'Main Break',
        dataIndex: 'mainBreakDuration',
        key: 'mainBreakDuration',
        sorter: (a, b) => tableSort(a, b, "mainBreakDuration"),
    },
    {
        title: 'Quarter Break',
        dataIndex: 'qtrBreak',
        key: 'qtrBreak',
        sorter: (a, b) => tableSort(a, b, "qtrBreak"),
    },
];

class LiveScoreMatchesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionId: null,
            searchText: "",
            umpireKey: this.props.location ? this.props.location.state ? this.props.location.state.umpireKey : null : null,
            selectedDivision: 'All',
            selectedRound: 'All',
            isBulkUpload: false,
            isScoreChanged: false
        }
        _this = this
    }

    componentDidMount() {

        if (this.state.umpireKey == 'umpire') {
            const { id } = JSON.parse(getUmpireCompetitonData())
            this.setState({ competitionId: id })
            if (id !== null) {
                this.handleMatchTableList(1, id)
            } else {
                history.push('/')
            }
        } else {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            this.setState({ competitionId: id })
            if (id !== null) {
                this.handleMatchTableList(1, id)
                this.props.getLiveScoreDivisionList(id)
                this.props.liveScoreRoundListAction(id)
            } else {
                history.push('/')
            }
        }
    }

    onMatchClick(data, screenName) {
        return (
            <NavLink to={{
                pathname: screenName,
                state: { matchId: data, umpireKey: this.state.umpireKey }
            }} >
                <span class="input-heading-add-another pt-0" >{data}</span>
            </NavLink>
        )
    }


    handleMatchTableList(page, competitionID) {
        let offset = page ? 10 * (page - 1) : 0;
        let start = 1
        this.props.liveScoreMatchListAction(competitionID, start, offset, this.state.searchText, this.state.selectedDivision == 'All' ? null : this.state.selectedDivision, this.state.selectedRound == 'All' ? null : this.state.selectedRound)

    }

    onExport() {
        let url = AppConstants.matchExport + this.state.competitionId
        this.props.exportFilesAction(url)
    }

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            this.props.liveScoreMatchListAction(this.state.competitionId, 1, 0, e.target.value, this.state.selectedDivision == 'All' ? null : this.state.selectedDivision, this.state.selectedRound == 'All' ? null : this.state.selectedRound)
        }
    }

    // search key 
    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;

        if (code === 13) { //13 is the enter keycode
            this.props.liveScoreMatchListAction(this.state.competitionId, 1, 0, e.target.value, this.state.selectedDivision == 'All' ? null : this.state.selectedDivision, this.state.selectedRound == 'All' ? null : this.state.selectedRound)
        }
    }

    // on click of search icon
    onClickSearchIcon = () => {

        if (this.state.searchText == null || this.state.searchText == "") {
        }
        else {
            this.props.liveScoreMatchListAction(this.state.competitionId, 1, 0, this.state.searchText, this.state.selectedDivision == 'All' ? null : this.state.selectedDivision, this.state.selectedRound == 'All' ? null : this.state.selectedRound)
        }
    }

    scoreView(score, records, index) {
        return (
            <div >
                {
                    this.state.isBulkUpload ?
                        <div>
                            {setMatchBulkScore(records) === false ?
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <Input
                                        className="table-input-box-style"
                                        value={records.team1Score}
                                        type="number"
                                        onChange={(e) => this.props.changeMatchBulkScore(e.target.value, "team1Score", index)}
                                    />
                                    <span style={{ paddingLeft: 5, paddingRight: 5 }}>:</span>
                                    <Input
                                        className="table-input-box-style"
                                        value={records.team2Score}
                                        type="number"
                                        onChange={(e) => this.props.changeMatchBulkScore(e.target.value, "team2Score", index)}
                                    />
                                </div>
                                : setMatchResult(records)
                            }
                        </div>

                        :
                        <span nowrap>{setMatchResult(records)}</span>
                }

            </div>
        )
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.matchList}</Breadcrumb.Item>
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
                                    {/* <NavLink to={{
                                        pathname: '/liveScoreAddMatch',
                                    }}> */}
                                    <Button disabled={this.state.isBulkUpload} onClick={() => this.setState({ isBulkUpload: true })} className="primary-add-comp-form" type="primary">
                                        {AppConstants.bulkScoreUpload}
                                    </Button>
                                    {/* </NavLink> */}
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
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <NavLink to={{
                                        pathname: '/liveScoreAddMatch',
                                    }}>
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addMatches}
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
                                    <NavLink to="/liveScoreMatchImport">
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
                {/* <div className="mt-5" style={{ display: "flex", justifyContent: 'flex-end' }} >
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
                </div> */}
            </div>
        )
    }

    onPageChange(page){
        let checkScoreChanged = this.checkIsScoreChanged()
        if (checkScoreChanged === true) {
            message.info("Please save or cancel the current changes! ");
        }else{
            this.handleMatchTableList(page, this.state.competitionId)
        }
    }

    //////// tableView
    tableView = () => {
        const { liveScoreMatchListState } = this.props;
        let DATA = liveScoreMatchListState ? liveScoreMatchListState.liveScoreMatchListData : []
        // const { id } = JSON.parse(getLiveScoreCompetiton())
        let total = liveScoreMatchListState.liveScoreMatchListTotalCount;

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.liveScoreMatchListState.onLoad == true && true}
                        className="home-dashboard-table" columns={columns}
                        dataSource={DATA}
                        pagination={false}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-5"
                        current={liveScoreMatchListState.liveScoreMatchListPage}
                        total={total}
                        onChange={(page) => this.onPageChange(page)}
                        defaultPageSize={10}
                    />
                </div>

                {this.state.isBulkUpload === true && <div className="d-flex justify-content-end">

                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button style={{ height: 48, width: 130 }} onClick={() => this.onCancel()} type="cancel-button">{AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button onClick={this.handleSubmit} className="user-approval-button" type="primary">
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>}

            </div>
        )
    }

    checkIsScoreChanged() {
        let { liveScoreMatchListData, liveScoreBulkScoreList } = this.props.liveScoreMatchListState
       
        let isChanged = false

        for (let i in liveScoreMatchListData) {

            if (liveScoreMatchListData[i].team1Score !== liveScoreBulkScoreList[i].team1Score || liveScoreMatchListData[i].team2Score !== liveScoreBulkScoreList[i].team2Score) {
                isChanged = true
                break;
            }

            if (isChanged === true) {
                break;
            }

        }
        return isChanged

    }

    createPostMatchArray() {
        let { liveScoreMatchListData, liveScoreBulkScoreList } = this.props.liveScoreMatchListState
        let array = []
        for (let i in liveScoreMatchListData) {
            if (liveScoreMatchListData[i].team1Score !== liveScoreBulkScoreList[i].team1Score || liveScoreMatchListData[i].team2Score !== liveScoreBulkScoreList[i].team2Score) {
                let requestObject = {
                    "id": liveScoreMatchListData[i].id,
                    "team1Score":JSON.parse(liveScoreMatchListData[i].team1Score),
                    "team2Score":JSON.parse(liveScoreMatchListData[i].team2Score)
                }
                array.push(requestObject)
            }
           
        }
        return array
    }

    handleSubmit = () => {
        let checkScoreChanged = this.checkIsScoreChanged()
        if (checkScoreChanged === true) {
            let postArray = this.createPostMatchArray()
            this.props.bulkScoreUpdate(postArray)
        } else {
            this.setState({isBulkUpload:false})
        }
    }


    onCancel() {
        this.setState({ isBulkUpload: false })
        this.props.onCancelBulkScoreUpdate()
    }

    onChangeDivision(division) {
        let offset = 0;
        let start = 1
        this.props.liveScoreMatchListAction(this.state.competitionId, start, offset, this.state.searchText, division == 'All' ? null : division, this.state.selectedRound == 'All' ? null : this.state.selectedRound)
        this.setState({ selectedDivision: division })
    }

    onChangeRound(roundName) {
        let offset = 0;
        let start = 1
        this.props.liveScoreMatchListAction(this.state.competitionId, start, offset, this.state.searchText, this.state.selectedDivision == 'All' ? null : this.state.selectedDivision, roundName == 'All' ? null : roundName)
        this.setState({ selectedRound: roundName })
    }


      ///dropdown view containing all the dropdown of header
      dropdownView = () => {
        let { divisionList, roundList } = this.props.liveScoreMatchListState
        let divisionListArr = isArrayNotEmpty(divisionList) ? divisionList : []
        let roundListArr = isArrayNotEmpty(roundList) ? roundList : []
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="row">
                    <div className="col-sm"  >
                            <span className='year-select-heading'>{AppConstants.division}:</span>
                            <Select
                                className="year-select"
                                style={{ minWidth: 160 }}
                                onChange={(divisionId) => this.onChangeDivision(divisionId)}
                                value={this.state.selectedDivision}
                            >
                                <Option value={'All'}>{'All'}</Option>
                                {
                                    divisionListArr.map((item) => {
                                        return <Option value={item.id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                    </div>
                    <div className="col-sm" >
                            <span className='year-select-heading'>{AppConstants.round}:</span>
                            <Select
                                className="year-select"
                                style={{ minWidth: 160 }}
                                onChange={(roundName) => this.onChangeRound(roundName)}
                                value={this.state.selectedRound}
                            >
                                <Option value={'All'}>{'All'}</Option>
                                {
                                    roundListArr.map((item) => {
                                        return <Option value={item.name}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </div>

                    <div className="col-sm" style={{ display: "flex", justifyContent: 'flex-end',alignItems:"center" }} >
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
            </div>
        )
    }
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                {
                    this.state.umpireKey ?
                        <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                        :
                        <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                }

                {
                    this.state.umpireKey ?
                        <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"1"} />
                        :
                        <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"2"} />
                }
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}
                    <Content>
                        {this.tableView()}
                    </Content>
                </Layout>
            </div >
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreMatchListAction,
        exportFilesAction,
        getLiveScoreDivisionList,
        liveScoreRoundListAction,
        changeMatchBulkScore,
        bulkScoreUpdate,
        onCancelBulkScoreUpdate
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreMatchListState: state.LiveScoreMatchState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreMatchesList));

