import { Breadcrumb, Button, Layout, Select, Form, Table } from 'antd';
import React, { Component } from "react";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import { liveScore_MatchFormate } from '../../themes/dateformate'
import moment, { utc } from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLiveScoreDivisionList } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'
import { liveScoreRoundListAction, clearRoundData } from '../../store/actions/LiveScoreAction/liveScoreRoundAction'
import { liveScoreCompetionActioninitiate } from '../../store/actions/LiveScoreAction/liveScoreCompetitionAction';
import Loader from '../../customComponents/loader'
import {getOrganisationData } from "../../util/sessionStorage"
const { Header, Footer, Content } = Layout;
const { Option } = Select;

function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}



const columns2 = [

    {
        title: 'Date/Time',
        dataIndex: 'startTime',
        // key: 'startTime',

        sorter: (a, b) => tableSort(a, b, "startTime"),
        render: (startTime, record, index) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style" style={{ borderBottom: " 1px solid #e8e8e8" }}>
                            <span className="inner-table-row-heading-text">{record.roundName}</span>
                        </div>
                        <div className="table-live-score-table-fixture-style"  >
                            <span  >{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
                        </div>
                    </div >

                )
            } else {
                return (
                    <span>{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
                )
            }
        },
    },
    {
        title: 'Home Team',
        dataIndex: 'team1',
        key: 'team1',
        sorter: (a, b) => tableSort(a, b, "team1"),
        render: (team1, record) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style" style={{ borderBottom: " 1px solid #e8e8e8" }}>

                        </div>
                        <div className="table-live-score-table-fixture-style"  >
                            <NavLink to={{
                                pathname: '/liveScoreTeamView',
                                state: { tableRecord: team1, screenName: 'fromMatchList' }
                            }} >
                                <span class="input-heading-add-another pt-0" >{team1 ? team1.name : ""}</span>
                            </NavLink>
                        </div>
                    </div >

                )
            } else {

                return (
                    <NavLink to={{
                        pathname: '/liveScoreTeamView',
                        state: { tableRecord: team1, screenName: 'fromMatchList' }
                    }} >
                        <span class="input-heading-add-another pt-0" >{team1 ? team1.name : ""}</span>
                    </NavLink>
                )
            }
        }
    },
    {
        title: 'Away Team',
        dataIndex: 'team2',
        key: 'team2',
        sorter: (a, b) => tableSort(a, b, "team2"),
        render: (team2, record) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style" style={{ borderBottom: " 1px solid #e8e8e8" }}>

                        </div>
                        <div className="table-live-score-table-fixture-style"  >
                            <NavLink to={{
                                pathname: '/liveScoreTeamView',
                                state: { tableRecord: team2, screenName: 'fromMatchList' }
                            }} >
                                <span class="input-heading-add-another pt-0" >{team2 ? team2.name : ""}</span>
                            </NavLink>
                        </div>
                    </div >

                )
            } else {

                return (
                    <NavLink to={{
                        pathname: '/liveScoreTeamView',
                        state: { tableRecord: team2, screenName: 'fromMatchList' }
                    }} >
                        <span class="input-heading-add-another pt-0" >{team2 ? team2.name : ""}</span>
                    </NavLink>
                )
            }
        }
    },


    {
        title: 'Venue',
        dataIndex: 'venueCourt',
        key: 'venueCourt',
        sorter: (a, b) => tableSort(a, b, "venueCourt"),
        render: (venueCourt, record) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style" style={{ borderBottom: " 1px solid #e8e8e8" }}>

                        </div>
                        <div className="table-live-score-table-fixture-style"  >
                            <span >{venueCourt ? venueCourt.name : ""}</span>
                        </div>
                    </div >

                )
            } else {

                return (
                    <span>{venueCourt ? venueCourt.name : ""}</span>
                )
            }
        }
    },
    {
        title: 'Match Result',
        dataIndex: 'ms',
        key: 'ms',
        sorter: (a, b) => tableSort(a, b, "ms"),
        render: (venueCourt, record) => {
            if (record.isRoundChnage) {
                return (
                    <div className="table-live-score-table-fixture-style-main">
                        <div className="table-live-score-table-fixture-style" style={{ borderBottom: " 1px solid #e8e8e8" }}>

                        </div>
                        <div className="table-live-score-table-fixture-style"  >
                            {/* <span >{venueCourt ? venueCourt.name : ""}</span> */}
                        </div>
                    </div >

                )
            } else {

                return (
                    <span>{""}</span>
                )
            }
        }
    },

];




class LiveScoreSeasonFixture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            division: "",
            grade: "all",
            teams: "all",
            value: "periods",
            gameTimeTracking: false,
            onCompLoad: false,
            onDivisionLoad: false,
            selectedComp: null

        }
    }
    componentDidMount() {
        // this.props.liveScoreCompetionActioninitiate(body, selectedYear, this.state.orgKey)
        const body = {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }
        this.setState({ onCompLoad: true })
        let orgParam =  this.props.location.search.split("?organisationKey=")
        let orgKey  = orgParam[1]
        // let  orgKey  = getOrganisationData() ? getOrganisationData().organisationId :null
        this.props.liveScoreCompetionActioninitiate(body, 1, orgKey)
    }

    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreCompetition !== this.props.liveScoreCompetition) {
            if (this.state.onCompLoad == true && this.props.liveScoreCompetition.loader == false) {
                let firstComp = this.props.liveScoreCompetition.List && this.props.liveScoreCompetition.List.competitions[0].id
                this.props.getLiveScoreDivisionList(firstComp)
                this.setState({ selectedComp: firstComp, onCompLoad: false, onDivisionLoad: true })
            }
        }

        if (this.props.liveScoreMatchState !== nextProps.liveScoreMatchState) {
            if (this.props.liveScoreMatchState.onLoad == false && this.state.onDivisionLoad == true) {
                if (this.props.liveScoreMatchState.divisionList.length > 0) {
                    let division = this.props.liveScoreMatchState.divisionList[0].id
                    this.setState({ onDivisionLoad: false, division })
                    this.props.liveScoreRoundListAction(this.state.selectedComp, division)
                }
            }
        }
    }




    onChangeComp(compID) {
        let selectedComp = compID.comp
        this.props.clearRoundData("all")
        this.props.getLiveScoreDivisionList(selectedComp)
        this.setState({ selectedComp, onDivisionLoad: true, division: null })

    }

    changeDivision(divisionId) {
        let division = divisionId.division
        this.props.liveScoreRoundListAction(this.state.selectedComp, division)
        this.props.clearRoundData("round")
        this.setState({ division })
    }

    ///////view for breadcrumb
    headerView = () => {
        return (

            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add"> {AppConstants.seasonFixture}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let competition = this.props.liveScoreCompetition.List ? this.props.liveScoreCompetition.List.competitions : []
        let division = this.props.liveScoreMatchState.divisionList ? this.props.liveScoreMatchState.divisionList : []
        console.log(division)
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="row" >
                    <div className="col-sm-4" >
                        <div className="com-year-select-heading-view" >
                            <span className='year-select-heading'>{AppConstants.season}:</span>
                            <Select
                                className="year-select"
                                style={{ minWidth: 160 }}
                                onChange={(comp) => this.onChangeComp({ comp })}
                                value={this.state.selectedComp}
                            >{
                                    competition.map((item) => {
                                        return <Option value={item.id}>{item.name}</Option>
                                    })
                                }

                            </Select>
                        </div>
                    </div>
                    <div className="col-sm-2" >
                        <div style={{
                            width: "100%", display: "flex",
                            flexDirection: "row",
                            alignItems: "center", marginRight: 50
                        }} >
                            <span className='year-select-heading'>{AppConstants.grade}:</span>
                            <Select
                                className="year-select"
                                // style={{ width: 140 }}
                                onChange={(division) => this.changeDivision({ division })}
                                value={this.state.division}
                            >{
                                    division.map((item) => {
                                        return <Option value={item.id}>{item.name}</Option>
                                    })
                                }

                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    createRequiredArray(array) {
        let finalArray = []
        for (let i in array) {
            let matcheArray = array[i].matches
            for (let j in matcheArray) {
                if (j == 0) {
                    matcheArray[j]["isRoundChnage"] = true
                }
                matcheArray[j]["roundName"] = array[i].name
                matcheArray[j]["roundId"] = array[i].id
                finalArray.push(matcheArray[j])
            }
        }
        return finalArray
    }



    ////////form content view
    contentView = () => {

        let roundsArray = this.props.liveScoreMatchState.roundList
        let newArray = this.createRequiredArray(roundsArray)
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">

                    <Table
                        className="livescore-seasonfixture-table"
                        columns={columns2}
                        dataSource={newArray}
                        size="small"
                        pagination={false}
                        loading={this.props.liveScoreMatchState.rounLoad}
                    />
                 
                </div>
            </div>
        )
    }



    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm" >
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                <Button className="save-draft-text" type="save-draft-text">{AppConstants.preview}</Button>
                                <Button className="open-reg-button" type="primary">{AppConstants.print}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render() {
        console.log(this.props.liveScoreCompetition)
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <Loader visible={this.props.liveScoreCompetition.loader || this.props.liveScoreMatchState.onLoad} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getLiveScoreDivisionList,
        liveScoreRoundListAction,
        liveScoreCompetionActioninitiate,
        clearRoundData
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreMatchState: state.LiveScoreMatchState,
        liveScoreCompetition: state.liveScoreCompetition
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreSeasonFixture));

