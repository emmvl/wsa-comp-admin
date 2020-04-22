import React, { Component } from 'react';
import { Layout, Breadcrumb, Select, Button, Form } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import { NavLink } from 'react-router-dom';
import loadjs from 'loadjs';
import DashboardLayout from '../../pages/dashboardLayout';
import { getDayName, getTime } from './../../themes/dateformate';
import SwappableComponentEdit from '../../customComponents/SwappableComponentEdit.jsx';
import AppConstants from '../../themes/appConstants';
import history from "../../util/history";

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
} from '../../store/actions/competitionModuleAction/competitionDrawsAction';
import Loader from '../../customComponents/loader'
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
} from "../../util/sessionStorage"
import moment from "moment"
const { Header, Footer, Content } = Layout;
const { Option } = Select;

class CompetitionDrawEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            firstTimeCompId: '',
            venueId: '',
            roundId: '',
            venueLoad: false,
            roundTime: null
        };
    }

    componentDidUpdate(nextProps) {
        let drawsRoundData = this.props.drawsState.getDrawsRoundsData;
        let venueData = this.props.drawsState.competitionVenues;

        if (nextProps.appState !== this.props.appState) {
            let competitionList = this.props.appState.own_CompetitionArr;
            if (nextProps.appState.own_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let competitionId = competitionList[0].competitionId;
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
        this.setState({
            value: e.target.value
        });
    };

    onSwap(source, target) {

        let sourceIndexArray = source.split(':');
        let targetIndexArray = target.split(':');

        let sourceXIndex = sourceIndexArray[0];
        let sourceYIndex = sourceIndexArray[1];
        let sourceZIndex = sourceIndexArray[2];
        let sourceID = sourceIndexArray[3];


        let targetXIndex = targetIndexArray[0];
        let targetYIndex = targetIndexArray[1];
        let targetZIndex = targetIndexArray[2];
        let targetID = targetIndexArray[3];


        let drawData = this.props.drawsState.getStaticDrawsData;

        let sourceObejct = drawData[sourceXIndex].slotsArray[sourceYIndex]
        let targetObject = drawData[targetXIndex].slotsArray[targetYIndex]

        var customSourceObject = null
        var customTargetObject = null
        console.log("Source===", source)
        console.log("Target===", target)
        // console.log("Source",sourceObejct)
        // console.log("Target",targetObject)

        if (targetObject.drawsId !== sourceObejct.drawsId) {


            if (sourceZIndex == 0) {
                if (targetZIndex == 0) {
                    customSourceObject = {
                        drawsId: sourceObejct.drawsId,
                        // roundId: this.state.roundId,
                        homeTeamId: targetObject.homeTeamId,
                        awayTeamId: sourceObejct.awayTeamId,
                        isLocked: 1
                    };
                } else {
                    customSourceObject = {
                        drawsId: sourceObejct.drawsId,
                        // roundId: this.state.roundId,
                        homeTeamId: targetObject.awayTeamId,
                        awayTeamId: sourceObejct.awayTeamId,
                        isLocked: 1
                    };
                }

            } else {
                if (targetZIndex == 0) {
                    customSourceObject = {
                        drawsId: sourceObejct.drawsId,
                        // roundId: this.state.roundId,
                        homeTeamId: sourceObejct.homeTeamId,
                        awayTeamId: targetObject.homeTeamId,
                        isLocked: 1
                    };
                } else {
                    customSourceObject = {
                        drawsId: sourceObejct.drawsId,
                        // roundId: this.state.roundId,
                        homeTeamId: sourceObejct.homeTeamId,
                        awayTeamId: targetObject.awayTeamId,
                        isLocked: 1
                    };
                }

            }
            if (targetZIndex == 0) {
                if (sourceZIndex == 0) {
                    customTargetObject = {
                        drawsId: targetObject.drawsId,
                        // roundId: this.state.roundId,
                        homeTeamId: sourceObejct.homeTeamId,
                        awayTeamId: targetObject.awayTeamId,
                        isLocked: 1
                    }
                } else {
                    customTargetObject = {
                        drawsId: targetObject.drawsId,
                        roundId: this.state.roundId,
                        homeTeamId: sourceObejct.awayTeamId,
                        awayTeamId: targetObject.homeTeamId,
                        isLocked: 1
                    }
                }
            } else {
                if (sourceZIndex == 0) {
                    customTargetObject = {
                        drawsId: targetObject.drawsId,
                        // roundId: this.state.roundId,
                        homeTeamId: targetObject.homeTeamId,
                        awayTeamId: sourceObejct.homeTeamId,
                        isLocked: 1
                    }
                } else {
                    customTargetObject = {
                        drawsId: targetObject.drawsId,
                        // roundId: this.state.roundId,
                        homeTeamId: targetObject.homeTeamId,
                        awayTeamId: sourceObejct.awayTeamId,
                        isLocked: 1
                    }
                }
            }
        } else {
            customSourceObject = {
                drawsId: sourceObejct.drawsId,
                // roundId: this.state.roundId,
                homeTeamId: sourceObejct.awayTeamId,
                awayTeamId: targetObject.homeTeamId,
                isLocked: 1
            };
            customTargetObject = {
                drawsId: targetObject.drawsId,
                // roundId: this.state.roundId,
                homeTeamId: sourceObejct.awayTeamId,
                awayTeamId: targetObject.homeTeamId,
                // homeTeamId: 290,
                // awayTeamId: 294,
                isLocked: 1
            }

        }

        console.log("SourceObject", customSourceObject)
        console.log("TargetObject", customTargetObject)

        let postObject = {
            // drawsMasterId: 1,
            draws: [customSourceObject, customTargetObject]
        };



        this.props.updateCompetitionDraws(
            postObject,
            sourceIndexArray,
            targetIndexArray,
            "edit"
        );


    }


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
                                {AppConstants.draws}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        );
    };

    //////year change onchange
    onYearChange = yearId => {
        this.props.clearDraws("rounds")
        setOwnCompetitionYear(yearId)
        setOwn_competition(undefined)
        this.setState({ firstTimeCompId: null, yearRefId: yearId, roundId: null, roundTime: null, venueId: null });
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
        this.setState({ firstTimeCompId: competitionId, roundId: null, venueId: null, roundTime: null, venueLoad: true });
        this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId);
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="row">
                <div className="col-sm-3">
                    <div className="year-select-heading-view">
                        <span className="year-select-heading">{AppConstants.draws}:</span>
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
                <div className="col-sm-9">
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
            </div>
        );
    };

    ////////on venue change
    onVenueChange = venueId => {
        this.props.clearDraws()
        this.setState({ venueId });
        setDraws_venue(venueId)
        this.props.getCompetitionDrawsAction(
            this.state.yearRefId,
            this.state.firstTimeCompId,
            venueId,
            this.state.roundId
        );
    };

    //////onRoundsChange
    onRoundsChange = roundId => {
        let roundData = this.props.drawsState.getDrawsRoundsData
        this.props.clearDraws()
        let matchRoundData = roundData.findIndex(x => x.roundId == roundId)
        let roundTime = roundData[matchRoundData].startDateTime
        // this.props.dateSelection(roundId)
        this.setState({ roundId, roundTime });
        setDraws_round(roundId)
        setDraws_roundTime(roundTime)
        this.props.getCompetitionDrawsAction(
            this.state.yearRefId,
            this.state.firstTimeCompId,
            this.state.venueId,
            roundId
        );
    };

    ////////form content view
    contentView = () => {

        return (
            <div className="comp-draw-content-view">
                <div className="row comp-draw-list-top-head">
                    <div className="col-sm-10">
                        <span className="form-heading">{AppConstants.draws}</span>
                        <div className="row">
                            <div className="col-sm mr-0">
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span className="year-select-heading">
                                        {AppConstants.venue}:
                  </span>
                                    <Select
                                        className="year-select"
                                        placeholder="Select"
                                        style={{ minWidth: 120, whiteSpace: 'nowrap' }}
                                        onChange={venueId => this.onVenueChange(venueId)}
                                        value={JSON.parse(JSON.stringify(this.state.venueId))}
                                    >
                                        {this.props.drawsState.competitionVenues.length > 0 &&
                                            this.props.drawsState.competitionVenues.map(item => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </div>
                            </div>
                            <div className="col-sm pl-0">
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span className="year-select-heading">
                                        {AppConstants.round}:
                  </span>
                                    <Select
                                        className="year-select"
                                        style={{ minWidth: 100 }}
                                        onChange={roundId => this.onRoundsChange(roundId)}
                                        value={this.state.roundId}
                                    >
                                        {this.props.drawsState.getDrawsRoundsData.length > 0 &&
                                            this.props.drawsState.getDrawsRoundsData.map(item => {
                                                return (
                                                    <Option key={item.roundId} value={item.roundId}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                    {this.state.roundTime !== null &&
                                        <span className="year-select-heading pb-1">
                                            {"Starting"} {"  "}{moment(this.state.roundTime).format("ddd DD/MM")}
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-sm-2 comp-draw-edit-btn-view">
            <NavLink to="/competitionDrawEdit">
              <Button className="live-score-edit" type="primary">
                {AppConstants.edit}
              </Button>
            </NavLink>
          </div> */}
                </div>
                {/* {this.draggableView()} */}
                {
                    this.props.drawsState.updateLoad ?
                        <div><Loader visible={this.props.drawsState.updateLoad} />
                            {this.draggableView()}
                        </div> :
                        this.draggableView()
                }
            </div>
        );
    };

    draggableView = () => {
        var dateMargin = 25;
        var dayMargin = 25;
        let topMargin = 0;
        let topMarginHomeTeam = 36;
        let topMarginAwayTeam = 84;

        return (
            <div className="draggable-wrap draw-data-table">
                <div className="scroll-bar">
                    <div className="table-head-wrap">
                        {/* Day name list */}
                        <div className="tablehead-row">
                            <div className="sr-no empty-bx"></div>
                            {this.props.drawsState.dateArray.map((date, index) => {
                                if (index !== 0) {
                                    dateMargin += 110;
                                }
                                return (
                                    <span style={{ left: dateMargin }} >
                                        {getDayName(date)}
                                    </span>
                                );
                            })}
                        </div>
                        {/* Times list */}
                        <div className="tablehead-row">
                            <div className="sr-no empty-bx"></div>
                            {this.props.drawsState.dateArray.map((date, index) => {
                                if (index !== 0) {
                                    dayMargin += 110;
                                }
                                return (
                                    <span style={{ left: dayMargin }}>{getTime(date)}</span>
                                );
                            })}
                        </div>
                    </div>

                    {/* Slots View */}
                    <div className="main-canvas Draws">
                        {this.props.drawsState.getStaticDrawsData.map((courtData, index) => {
                            let leftMargin = 25;
                            if (index !== 0) {
                                topMargin += 156;
                                topMarginHomeTeam += 156;
                                topMarginAwayTeam += 156;
                            }
                            return (
                                <div>
                                    <div className="sr-no huge-sr">
                                        {courtData.venueCourtNumber}
                                    </div>

                                    {courtData.slotsArray.map((slotObject, slotIndex) => {
                                        if (slotIndex !== 0) {
                                            leftMargin += 110;
                                        }
                                        return slotObject.drawsId === null ? (
                                            <div
                                                className={
                                                    'huge-undraggble-box grey--bg'
                                                }
                                                style={{ top: topMargin, left: leftMargin }}
                                            >
                                                <span>N/A</span>
                                            </div>
                                        ) : (
                                                <div>
                                                    <span
                                                        className={'border huge-border'}
                                                        style={{ top: topMargin, left: leftMargin }}
                                                    ></span>
                                                    <div
                                                        className={
                                                            'small-undraggable-box'
                                                            +
                                                            ' purple-dark'
                                                        }
                                                        style={{
                                                            top: topMargin,
                                                            backgroundColor: slotObject.colorCode,
                                                            left: leftMargin
                                                        }}
                                                    >
                                                        <span>{slotObject.divisionName+ " - " +slotObject.gradeName}</span>
                                                    </div>
                                                    <span
                                                        className={'border'}
                                                        style={{
                                                            top: topMarginHomeTeam,
                                                            left: leftMargin
                                                        }}
                                                    ></span>
                                                    <div
                                                        className={
                                                            'box purple-box' + ' purple-bg'
                                                        }
                                                        style={{
                                                            top: topMarginHomeTeam,
                                                            backgroundColor: slotObject.colorCode,
                                                            left: leftMargin
                                                        }}
                                                    >
                                                        <SwappableComponentEdit
                                                            id={
                                                                index.toString() +
                                                                ':' +
                                                                slotIndex.toString() +
                                                                ':0:' + slotObject.competitionDivisionGradeId
                                                            }
                                                            content={1}
                                                            swappable={true}
                                                            onSwap={(source, target) =>
                                                                this.onSwap(source, target)
                                                            }
                                                        >
                                                            <span>{slotObject.homeTeamName}</span>
                                                        </SwappableComponentEdit>
                                                    </div>
                                                    <span
                                                        className={'border'}
                                                        style={{ top: topMarginAwayTeam, left: leftMargin }}
                                                    ></span>
                                                    <div
                                                        className={
                                                            'box purple-box ' +
                                                            ' purple-bg'
                                                        }
                                                        style={{
                                                            top: topMarginAwayTeam,
                                                            backgroundColor: slotObject.colorCode,
                                                            left: leftMargin
                                                        }}
                                                    >
                                                        <SwappableComponentEdit
                                                            id={
                                                                index.toString() +
                                                                ':' +
                                                                slotIndex.toString() +
                                                                ':1:' + slotObject.competitionDivisionGradeId
                                                            }
                                                            content={1}
                                                            swappable={true}
                                                            onSwap={(source, target) =>
                                                                this.onSwap(source, target)
                                                            }
                                                        >
                                                            <span>{slotObject.awayTeamName}</span>
                                                        </SwappableComponentEdit>
                                                    </div>
                                                </div>
                                            );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">
                {/* <div className="footer-view"> */}
                <div className="row">
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <Button type="cancel-button" onClick={() => history.push('/competitionDraws')}>
                                {AppConstants.back}</Button>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        <div className="comp-buttons-view">
                            <NavLink to="/competitionDraws">
                                <Button className="open-reg-button" type="primary">
                                    {AppConstants.save_publish}
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
        );
    };
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: '#f7fafc' }}>
                <DashboardLayout
                    menuHeading={AppConstants.competitions}
                    menuName={AppConstants.competitions}
                />
                <InnerHorizontalMenu menu={'competition'} compSelectedKey={'18'} />
                {/* <Layout className="container"> */}
                <Layout className="comp-dash-table-view">
                    {/* <Loader visible={this.props.drawsState.updateLoad} /> */}
                    {/* <div className="comp-draw-head-content-view"> */}
                    {this.headerView()}
                    {this.dropdownView()}
                    <Content>{this.contentView()}</Content>
                    {/* </div> */}
                    <Footer>{this.footerView()}</Footer>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getCompetitionDrawsAction,
            getYearAndCompetitionOwnAction,
            getVenuesTypeAction,
            getDrawsRoundsAction,
            updateCompetitionDraws,
            saveDraws,
            getCompetitionVenue,
            clearDraws
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
)(Form.create()(CompetitionDrawEdit));
