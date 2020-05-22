import React, { Component } from "react";
import { Layout, Breadcrumb, Select, Button } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import loadjs from 'loadjs';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import FixtureSwappable from '../../customComponents/fixtureSwappableComponent';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import {
    setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition,
    setDraws_venue,
    getDraws_venue,
    setDraws_round,
    getDraws_round,
    setDraws_roundTime,
    getDraws_roundTime,
    setDraws_division_grade,
    getDraws_division_grade,
} from "../../util/sessionStorage"
import {
    getYearAndCompetitionOwnAction,
    getVenuesTypeAction
} from '../../store/actions/appAction';
import {
    getCompetitionDrawsAction,
    getDrawsRoundsAction,
    updateCompetitionDraws,
    saveDraws,
    getCompetitionVenue,
    clearDraws,
    publishDraws
} from '../../store/actions/competitionModuleAction/competitionDrawsAction';


const { Header, Footer, Content } = Layout;
const { Option } = Select;

class CompetitionFixtures extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            firstTimeCompId: '',
            venueId: '',
            roundId: '',
            venueLoad: false,
            roundTime: null,
            competitionDivisionGradeId: "",
        }
    }


    componentDidMount() {
        loadjs('assets/js/custom.js');
    }

    componentDidUpdate(nextProps) {
        let drawsRoundData = this.props.drawsState.getDrawsRoundsData;
        let venueData = this.props.drawsState.competitionVenues;
        let divisionGradeNameList = this.props.drawsState.divisionGradeNameList;

        if (nextProps.appState !== this.props.appState) {
            let competitionList = this.props.appState.own_CompetitionArr;
            if (nextProps.appState.own_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let competitionId = competitionList[9].competitionId;
                    this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId);
                    setOwn_competition(competitionId)
                    this.setState({ firstTimeCompId: competitionId, venueLoad: true })
                }
            }
        }
        if (this.state.venueLoad == true && this.props.drawsState.updateLoad == false) {
            if (nextProps.drawsState !== this.props.drawsState) {
                if (nextProps.drawsState.getDrawsRoundsData !== drawsRoundData) {
                    if (venueData.length > 0) {
                        let venueId = venueData[0].id
                        setDraws_venue(venueId)
                        if (drawsRoundData.length > 0) {

                            let roundId = drawsRoundData[0].roundId;
                            setDraws_round(roundId)
                            let roundTime = drawsRoundData[0].startDateTime
                            setDraws_roundTime(roundTime)
                            this.props.getCompetitionDrawsAction(
                                this.state.yearRefId,
                                this.state.firstTimeCompId,
                                venueId,
                                roundId
                            );
                            this.setState({ roundId, venueId, roundTime, venueLoad: false });
                        }
                        else {
                            this.setState({
                                venueId,
                                venueLoad: false
                            })
                        }
                    }
                    if (divisionGradeNameList.length > 0) {
                        let competitionDivisionGradeId = divisionGradeNameList[0].competitionDivisionGradeId;
                        setDraws_division_grade(competitionDivisionGradeId)
                        this.setState({ competitionDivisionGradeId })
                    }
                }
            }
        }
    }

    componentDidMount() {
        loadjs('assets/js/custom.js');
        this.apiCalls();
    }

    apiCalls() {
        this.props.clearDraws()
        let yearId = getOwnCompetitionYear()
        let storedCompetitionId = getOwn_competition()
        let propsData = this.props.appState.own_YearArr.length > 0 ? this.props.appState.own_YearArr : undefined
        let compData = this.props.appState.own_CompetitionArr.length > 0 ? this.props.appState.own_CompetitionArr : undefined
        let venueId = getDraws_venue()
        let roundId = getDraws_round()
        let roundTime = getDraws_roundTime()
        let roundData = this.props.drawsState.getDrawsRoundsData.length > 0 ? this.props.drawsState.getDrawsRoundsData : undefined
        let venueData = this.props.drawsState.competitionVenues.length > 0 ? this.props.drawsState.competitionVenues : undefined
        let competitionDivisionGradeId = getDraws_division_grade()
        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                venueLoad: true
            })
            if (venueId && roundId && roundData && venueData) {
                this.props.getCompetitionDrawsAction(
                    yearId,
                    storedCompetitionId,
                    venueId,
                    roundId
                );
                this.setState({
                    venueId: JSON.parse(venueId),
                    roundId: JSON.parse(roundId),
                    roundTime,
                    competitionDivisionGradeId: JSON.parse(competitionDivisionGradeId),
                    venueLoad: false
                })
            }
            else {

                this.props.getDrawsRoundsAction(yearId, storedCompetitionId);
            }
        }
        else if (yearId) {
            this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
            this.setState({
                yearRefId: JSON.parse(yearId)
            })
        }
        else {
            this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, null, 'own_competition')
            setOwnCompetitionYear(1)
        }
    }

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-draws-header-view mt-4">
                <div className="row">
                    <div
                        className="col-sm"
                        style={{ display: 'flex', alignContent: 'center' }}
                    >
                        <Breadcrumb
                            style={{
                                display: 'flex',
                                lignItems: 'center',
                                alignSelf: 'center'
                            }}
                            separator=" > "
                        >
                            <Breadcrumb.Item className="breadcrumb-add">
                                {' '}
                                {AppConstants.fixtures}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        )
    }
    //////year change onchange
    onYearChange = yearId => {
        this.props.clearDraws("rounds")
        setOwnCompetitionYear(yearId)
        setOwn_competition(undefined)
        this.setState({ firstTimeCompId: null, yearRefId: yearId, roundId: null, roundTime: null, venueId: null, competitionDivisionGradeId: null });
        this.props.getYearAndCompetitionOwnAction(
            this.props.appState.own_YearArr,
            yearId,
            "own_competition"
        );
        // this.setDetailsFieldValue()
    };

    // on Competition change
    onCompetitionChange(competitionId) {
        this.props.clearDraws("rounds")
        setOwn_competition(competitionId)
        this.setState({ firstTimeCompId: competitionId, roundId: null, venueId: null, roundTime: null, venueLoad: true, competitionDivisionGradeId: null });
        this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId);
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="row">
                <div className="col-sm-3">
                    <div className="year-select-heading-view">
                        <span className="year-select-heading">{AppConstants.year}:</span>
                        <Select
                            name={'yearRefId'}
                            className="year-select"
                            onChange={yearRefId => this.onYearChange(yearRefId)}
                            value={this.state.yearRefId}
                        >
                            {this.props.appState.own_YearArr.length > 0 && this.props.appState.own_YearArr.map(item => {
                                return (
                                    <Option key={'yearRefId' + item.id} value={item.id}>
                                        {item.description}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 50
                        }}
                    >
                        <span className="year-select-heading">
                            {AppConstants.competition}:
        </span>
                        <Select
                            style={{ minWidth: 160 }}
                            name={'competition'}
                            className="year-select"
                            onChange={competitionId =>
                                this.onCompetitionChange(competitionId)
                            }
                            value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                        >
                            {this.props.appState.own_CompetitionArr.map(item => {
                                return (
                                    <Option
                                        key={'competition' + item.competitionId}
                                        value={item.competitionId}
                                    >
                                        {item.competitionName}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </div>
                {/* <div className="col-sm-5">
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 50
                    }}
                >
                    <span className="year-select-heading">
                        {AppConstants.division}:
        </span>
                    <Select
                        style={{ minWidth: 160 }}
                        name={'competition'}
                        className="year-select"
                        onChange={competitionDivisionGradeId =>
                            this.onDivisionGradeNameChange(competitionDivisionGradeId)
                        }
                        value={JSON.parse(JSON.stringify(this.state.competitionDivisionGradeId))}
                    >
                        {this.props.drawsState.divisionGradeNameList.map(item => {
                            return (
                                <Option
                                    key={'divisionGradeNameList' + item.competitionDivisionGradeId}
                                    value={item.competitionDivisionGradeId}
                                >
                                    {item.name}
                                </Option>
                            );
                        })}
                    </Select>
                </div>
            </div> */}
            </div>
        );
    };

    ////////form content view
    contentView = () => {
        return (
            <div className="comp-draw-content-view mt-0">
                <div className="row comp-draw-list-top-head">
                    <div className="col-sm-4">
                        <span className='form-heading'>{AppConstants.fixtures}</span>
                        <div className="row"  >
                            <div className="col-sm" >
                                <div style={{
                                    width: "100%", display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }} >
                                    <span className='year-select-heading'>{AppConstants.venue}:</span>
                                    <Select
                                        className="year-select"
                                        // style={{ width: 75 }}
                                        onChange={(venue) => this.setState({ venue })}
                                        value={this.state.venue}
                                    >
                                        <Option value={"abbott"}>{AppConstants.AbbottAddress}</Option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-sm-8 comp-draw-edit-btn-view" >
                        <div className="row">
                            <div className="col-sm mt-1">
                                <NavLink to="/competitionCourtAndTimesAssign">
                                    <Button className="open-reg-button" type="primary">+ {AppConstants.add_TimeSlot}</Button>
                                </NavLink>
                            </div>
                            <div className="col-sm mt-1">
                                <NavLink to="/competitionVenueTimesPrioritisation">
                                    <Button className="open-reg-button" type="primary">+ {AppConstants.addCourt}</Button>
                                </NavLink>
                            </div>
                        </div>
                    </div> */}
                </div>
                {this.dragableView()}
            </div>
        )
    }

    //////the gragable content view inside the container    
    // dragableView = () => {
    //     return (
    //         <div class="draggable-wrap fixtures pb-5">
    //             <div class="horizontal-scroll">
    //                 <div class="table-head-wrap">
    //                     <div class="tablehead-row">
    //                         <div class="sr-no empty-bx"></div>
    //                         <span class="left-25">7:45</span>
    //                         <span class="left-100">8:45</span>
    //                         <span class="left-175">9:45</span>
    //                         <span class="left-250">10:45</span>
    //                         <span class="left-325">11:45</span>
    //                         <span class="left-400">12:45</span>
    //                         <span class="left-475">1:55</span>
    //                         <span class="left-550">3:05</span>
    //                         <span class="left-625">4:15</span>
    //                     </div>
    //                 </div>
    //                 <div class="main-canvas">
    //                     <div class="sr-no">1</div>
    //                     <span class="border left-25"></span>
    //                     <div class="box left-25 grey--bg">N/A</div>
    //                     <span class="border left-100"></span>
    //                     <div class="box left-100 purple-bg">12A</div>
    //                     <span class="border left-175"></span>
    //                     <div class="box left-175 green-bg">13A</div>
    //                     <span class="border left-250"></span>
    //                     <div class="box left-250 yellow-bg black-text">14A</div>
    //                     <span class="border left-325"></span>
    //                     <div class="box left-325 red-bg">15A</div>
    //                     <span class="border left-400"> </span>
    //                     <div class="box left-400 blue-bg">2A</div>
    //                     <span class="border left-475"></span>
    //                     <div class="box left-475 blue-bg">2A</div>
    //                     <span class="border left-550"></span>
    //                     <div class="box left-550 blue-bg">1A</div>
    //                     <span class="border left-625"></span>
    //                     <div class="box left-625 blue-bg">12A</div>




    //                     <div class="sr-no m-top-10">2</div>
    //                     <span class="border left-25 top-50"></span>
    //                     <div class="box left-25 top-50 grey--bg">N/A</div>
    //                     <span class="border left-100 top-50"></span>
    //                     <div class="box left-100 top-50 purple-bg">12A</div>
    //                     <span class="border left-175 top-50"></span>
    //                     <div class="box left-175 top-50 green-bg">13A</div>
    //                     <span class="border left-250 top-50"></span>
    //                     <div class="box left-250 top-50 yellow-bg black-text">14A</div>
    //                     <span class="border left-325 top-50"></span>
    //                     <div class="box left-325 top-50 red-bg">15A</div>
    //                     <span class="border left-400 top-50"> </span>
    //                     <div class="box left-400 top-50 blue-bg">2A</div>
    //                     <span class="border left-475 top-50"></span>
    //                     <div class="box left-475 top-50 blue-bg">2A</div>
    //                     <span class="border left-550 top-50"></span>
    //                     <div class="box left-550 top-50 blue-bg">1A</div>
    //                     <span class="border left-625 top-50"></span>
    //                     <div class="box left-625 top-50 blue-bg">12A</div>
    //                     <div class="sr-no m-top-10">3</div>
    //                     <span class="border left-25  top-100"></span>
    //                     <div class="box left-25 top-100 green-bg">13D</div>
    //                     <span class="border left-100 top-100"></span>
    //                     <div class="box left-100 top-100 yellow-bg black-text">14D</div>
    //                     <span class="border left-175 top-100"></span>
    //                     <div class="box left-175 top-100 red-bg">15F</div>
    //                     <span class="border left-250 top-100"></span>
    //                     <div class="box left-250 top-100 yellow-bg black-text">14C</div>
    //                     <span class="border left-325 top-100"></span>
    //                     <div class="box left-325 top-100 red-bg">15E</div>
    //                     <span class="border left-400 top-100"> </span>
    //                     <div class="box left-400 top-100 orange-bg">5B</div>
    //                     <span class="border left-475 top-100"></span>
    //                     <div class="box left-475 top-100 skyblue-bg">1CD</div>
    //                     <span class="border left-550 top-100"></span>
    //                     <div class="box left-550 top-100 orange-bg">4B</div>
    //                     <span class="border left-625 top-100"></span>
    //                     <div class="box left-625 top-100 aquamarine-bg">5C</div>

    //                     <div class="sr-no m-top-10">4</div>
    //                     <span class="border left-25  top-150"></span>
    //                     <div class="box left-25 top-150 green-bg">13D</div>
    //                     <span class="border left-100 top-150"></span>
    //                     <div class="box left-100 top-150 yellow-bg black-text">14D</div>
    //                     <span class="border left-175 top-150"></span>
    //                     <div class="box left-175 top-150 red-bg">15F</div>
    //                     <span class="border left-250 top-150"></span>
    //                     <div class="box left-250 top-150 yellow-bg black-text">14C</div>
    //                     <span class="border left-325 top-150"></span>
    //                     <div class="box left-325 top-150 red-bg">15E</div>
    //                     <span class="border left-400 top-150"> </span>
    //                     <div class="box left-400 top-150 orange-bg">5B</div>
    //                     <span class="border left-475 top-150"></span>
    //                     <div class="box left-475 top-150 skyblue-bg">1CD</div>
    //                     <span class="border left-550 top-150"></span>
    //                     <div class="box left-550 top-150 orange-bg">4B</div>
    //                     <span class="border left-625 top-150"></span>
    //                     <div class="box left-625 top-150 aquamarine-bg">5C</div>


    //                     <div class="sr-no m-top-10">5</div>
    //                     <span class="border left-25  top-200"></span>
    //                     <div class="box left-25 top-200 green-bg">13D</div>
    //                     <span class="border left-100 top-200"></span>
    //                     <div class="box left-100 top-200 yellow-bg black-text">14D</div>
    //                     <span class="border left-175 top-200"></span>
    //                     <div class="box left-175 top-200 red-bg">15F</div>
    //                     <span class="border left-250 top-200"></span>
    //                     <div class="box left-250 top-200 yellow-bg black-text">14C</div>
    //                     <span class="border left-325 top-200"></span>
    //                     <div class="box left-325 top-200 red-bg">15E</div>
    //                     <span class="border left-400 top-200"> </span>
    //                     <div class="box left-400 top-200 orange-bg">5B</div>
    //                     <span class="border left-475 top-200"></span>
    //                     <div class="box left-475 top-200 skyblue-bg">1CD</div>
    //                     <span class="border left-550 top-200"></span>
    //                     <div class="box left-550 top-200 orange-bg">4B</div>
    //                     <span class="border left-625 top-200"></span>
    //                     <div class="box left-625 top-200 aquamarine-bg">5C</div>
    //                     <div class="sr-no m-top-10">6</div>
    //                     <span class="border left-25  top-250"></span>
    //                     <div class="box left-25 top-250 green-bg">13D</div>
    //                     <span class="border left-100 top-250"></span>
    //                     <div class="box left-100 top-250 green-bg">13C</div>
    //                     <span class="border left-175 top-250"></span>
    //                     <div class="box left-175 top-250 red-bg">15F</div>
    //                     <span class="border left-250 top-250"></span>
    //                     <div class="box left-250 top-250 red-bg">15C</div>
    //                     <span class="border left-325 top-250"></span>
    //                     <div class="box left-325 top-250 red-bg">15E</div>
    //                     <span class="border left-400 top-250"> </span>
    //                     <div class="box left-400 top-250 orange-bg">5B</div>
    //                     <span class="border left-475 top-250"></span>
    //                     <div class="box left-475 top-250 skyblue-bg">1CD</div>
    //                     <span class="border left-550 top-250"></span>
    //                     <div class="box left-550 top-250 orange-bg">4B</div>
    //                     <span class="border left-625 top-250"></span>
    //                     <div class="box left-625 top-250 aquamarine-bg">5C</div>
    //                     <div class="sr-no m-top-10">7</div>
    //                     <span class="border left-25  top-300"></span>
    //                     <div class="box left-25 top-300 green-bg">13B</div>
    //                     <span class="border left-100 top-300"></span>
    //                     <div class="box left-100 top-300 green-bg">13C</div>
    //                     <span class="border left-175 top-300"></span>
    //                     <div class="box left-175 top-300 yellow-bg black-text">14B </div>
    //                     <span class="border left-250 top-300"></span>
    //                     <div class="box left-250 top-300 red-bg">15C</div>
    //                     <span class="border left-325 top-300"></span>
    //                     <div class="box left-325 top-300 red-bg">15B</div>
    //                     <span class="border left-400 top-300"> </span>
    //                     <div class="box left-400 top-300 blue-bg">5A</div>
    //                     <span class="border left-475 top-300"></span>
    //                     <div class="box left-475 top-300 orange-bg">2B</div>
    //                     <span class="border left-550 top-300"></span>
    //                     <div class="box left-550 top-300 orange-bg">3B</div>
    //                     <span class="border left-625 top-300"></span>
    //                     <div class="box left-625 top-300 aquamarine-bg">4C</div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }
    //////the gragable content view inside the container
    dragableView = () => {
        var dateMargin = 25;
        var dayMargin = 25;
        let topMargin = 0;
        let getStaticDrawsData = [{
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }, {
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }, {
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }, {
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 168,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: "A",
                awayTeamId: null,
                homeTeamName: "null",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'red',
                teamArray: [
                    {
                        teamName: "A",
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }, {
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }, {
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }, {
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }, {
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: null,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: null,
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#999999',
                teamArray: [
                    {
                        teamName: null,
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }, {
                drawsId: 168,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: "A",
                awayTeamId: null,
                homeTeamName: "null",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'red',
                teamArray: [
                    {
                        teamName: "A",
                        teamId: null,
                    },
                    {
                        teamName: null,
                        teamId: null,
                    },
                ],
            }]
        }]
        let dateArray = [{ time: "09:00" }, { time: "10:00" }, { time: "09:00" }, { time: "09:00" }]
        return (
            <div className="draggable-wrap draw-data-table">
                <div className="scroll-bar pb-4">
                    <div className="table-head-wrap">
                        {/* Times list */}
                        <div className="tablehead-row-fixture ">
                            <div className="sr-no empty-bx"></div>
                            {dateArray.map((date, index) => {
                                if (index !== 0) {
                                    dayMargin += 75;
                                }
                                // if (index == 0) {
                                //     dayMargin = 30;
                                // }
                                return (
                                    <span style={{ left: dayMargin }}>{date.time}</span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="main-canvas Draws">
                    {getStaticDrawsData.map((courtData, index) => {
                        let leftMargin = 25;
                        if (index !== 0) {
                            topMargin += 50;
                        }
                        return (
                            <div>
                                <div className="fixture-sr-no"> {index + 1}</div>
                                {courtData.slotsArray.map((slotObject, slotIndex) => {
                                    if (slotIndex !== 0) {
                                        leftMargin += 75;
                                    }
                                    // if (slotIndex == 0) {
                                    //     leftMargin = 40;
                                    // }
                                    console.log(slotObject)
                                    return (
                                        <div>
                                            <span
                                                style={{ left: leftMargin, top: topMargin }}
                                                className={
                                                    'fixtureBorder'
                                                }
                                            ></span>
                                            <div
                                                className={
                                                    'fixtureBox'
                                                }
                                                style={{
                                                    backgroundColor: slotObject.colorCode,
                                                    left: leftMargin, top: topMargin, overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <FixtureSwappable
                                                    id={index.toString() + ':' + slotIndex.toString()}
                                                    content={1}
                                                    swappable={true}
                                                    onSwap={(source, target) =>
                                                        console.log(source, target)
                                                    }
                                                >
                                                    {slotObject.drawsId != null ? (
                                                        <span>
                                                            {slotObject.homeTeamName}
                                                        </span>
                                                    ) : (
                                                            <span>N/A</span>
                                                        )}
                                                </FixtureSwappable>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

            </div >
        );
    };

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width"  >
                {/* <div className="footer-view"> */}
                <div className="row" >
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <Button type="cancel-button">{AppConstants.back}</Button>
                        </div>
                    </div>
                    <div className="col-sm" >
                        <div className="comp-buttons-view">
                            <Button className="open-reg-button" type="primary">{AppConstants.next}</Button>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"11"} />
                <Layout className="comp-dash-table-view">
                    {/* <div className="comp-draw-head-content-view"> */}
                    {this.headerView()}
                    {this.dropdownView()}
                    <Content>
                        {this.contentView()}
                    </Content>
                    {/* </div> */}
                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            clearDraws,
            getCompetitionDrawsAction,
            getYearAndCompetitionOwnAction,
            getVenuesTypeAction,
            getDrawsRoundsAction,
            updateCompetitionDraws,
            saveDraws,
            getCompetitionVenue,
            clearDraws,
            publishDraws
        },
        dispatch
    );
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,

        drawsState: state.CompetitionDrawsState
    };
}
export default connect(
    mapStatetoProps,
    mapDispatchToProps
)(CompetitionFixtures);