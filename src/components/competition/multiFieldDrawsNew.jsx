import React, { Component } from "react";
import { Layout, Button, Select, DatePicker, Checkbox, message } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import history from "../../util/history";
import '../../../node_modules/react-grid-layout/css/styles.css'
import '../../../node_modules/react-resizable/css/styles.css'
import loadjs from 'loadjs';
import moment from 'moment';
import AppImages from "../../themes/appImages";
import { isArrayNotEmpty } from '../../util/helpers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import {
    getCompetitionDrawsAction,
    getDrawsRoundsAction,
    updateCompetitionDraws,
    saveDraws,
    getCompetitionVenue,
    updateCourtTimingsDrawsAction,
    clearDraws,
    publishDraws,
    matchesListDrawsAction,
    unlockDrawsAction,
    getActiveRoundsAction,
    changeDrawsDateRangeAction
} from '../../store/actions/competitionModuleAction/competitionMultiDrawsAction';
import {
    getYearAndCompetitionOwnAction,
    getVenuesTypeAction,
} from '../../store/actions/appAction';
import { generateDrawAction } from '../../store/actions/competitionModuleAction/competitionModuleAction';
import {
    setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition,
    setDraws_venue,
    setDraws_round,
    setDraws_roundTime,
    getDraws_venue,
    getDraws_round,
    getDraws_roundTime,
    setDraws_division_grade,
    getDraws_division_grade,
    getOrganisationData,
    getOwn_competitionStatus,
    setOwn_competitionStatus
} from '../../util/sessionStorage';
import ValidationConstants from '../../themes/validationConstant';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Footer, Content } = Layout;
const venueStaticData = [
    { name: "Venue 1", checked: true },
    { name: "Venue 2", checked: true },
    { name: "Venue 3", checked: true },
    { name: "Venue 4", checked: false },
    { name: "Venue 1", checked: true },
    { name: "Venue 2", checked: true },
    { name: "Venue 3", checked: true },
    { name: "Venue 4", checked: false },
]
const compStaticData = [
    { name: "Monday Night Social", checked: true },
    { name: "NSW State Age", checked: true },
    { name: "NWA Winter", checked: true },
    { name: "Monday Night Social", checked: true },
    { name: "NSW State Age", checked: true },
    { name: "NWA Winter", checked: true },
]
const divisionStaticData = [{
    name: "Monday Night Social", divisionArr: [
        { name: "Junior-A", checked: true }, { name: "Junior-B", checked: true }, { name: "Opens-A", checked: true }, { name: "Opens-A", checked: false },
        { name: "Junior-A", checked: true }, { name: "Junior-B", checked: true }, { name: "Opens-A", checked: true }, { name: "Opens-A", checked: false }
    ]
}, {
    name: "NSW State Age", divisionArr: [
        { name: "Junior-A", checked: true }, { name: "Junior-B", checked: true }, { name: "Opens-A", checked: true }, { name: "Opens-A", checked: false }
    ]
}]

class MultifieldDrawsNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            firstTimeCompId: '',
            venueId: '',
            roundId: '',
            venueLoad: false,
            roundTime: null,
            competitionDivisionGradeId: '',
            organisationId: getOrganisationData().organisationUniqueKey,
            updateLoad: false,
            organisation_Id: '-1',
            visible: false,
            value: 1,
            publishPartModel: {
                isShowPart: false,
                publishPart: {
                    isShowDivision: false,
                    isShowRound: false
                }
            },
            selectedDivisions: null,
            selectedRounds: null,
            roundLoad: false,
            drawGenerateModalVisible: false,
            competitionStatus: 0,
            tooltipVisibleDelete: false,
            changeStatus: false,
            generateRoundId: null,
            publishModalVisible: false,
            selectedDateRange: null,
            startDate: new Date(),
            endDate: new Date(),
            dateRangeCheck: false,
            allVenueChecked: true,
            allCompChecked: true,
            allDivisionChecked: true,
            showAllVenue: false,
            showAllComp: false,
            showAllDivision: false,
        };
    }


    componentDidUpdate(nextProps) {
        let userState = this.props.userState
        let competitionModuleState = this.props.competitionModuleState;
        let drawsRoundData = this.props.drawsState.getDrawsRoundsData;

        let drawOrganisations = this.props.drawsState.drawOrganisations
        let venueData = this.props.drawsState.competitionVenues;
        let divisionGradeNameList = this.props.drawsState.divisionGradeNameList;
        let changeStatus = this.props.drawsState.changeStatus

        if (
            this.state.venueLoad == true &&
            this.props.drawsState.updateLoad == false
        ) {
            if (nextProps.drawsState.getDrawsRoundsData !== drawsRoundData) {
                if (venueData.length > 0) {
                    let venueId = this.state.firstTimeCompId == -1 || this.state.dateRangeCheck ? this.state.venueId : venueData[0].id;
                    setDraws_venue(venueId);
                    if (this.state.firstTimeCompId != "-1" && !this.state.dateRangeCheck) {
                        if (drawsRoundData.length > 0) {
                            let roundId = null;
                            let roundTime = null;
                            //let currentDate = this.state.dateRangeCheck ? moment(new Date()).format("YYYY-MM-DD") : null;
                            if (drawsRoundData.length > 1) {
                                roundId = drawsRoundData[1].roundId;
                                setDraws_round(roundId);
                                roundTime = drawsRoundData[1].startDateTime;
                                setDraws_roundTime(roundTime);
                                this.props.getCompetitionDrawsAction(
                                    this.state.yearRefId,
                                    this.state.firstTimeCompId,
                                    venueId,
                                    roundId, null, null, null, this.state.dateRangeCheck
                                );
                                this.setState({
                                    roundId,
                                    roundTime,
                                    venueId,
                                    venueLoad: false,
                                    //startDate: currentDate, endDate: currentDate
                                });
                            } else {
                                roundId = drawsRoundData[0].roundId;
                                setDraws_round(roundId);
                                roundTime = drawsRoundData[0].startDateTime;
                                setDraws_roundTime(roundTime);
                                this.props.getCompetitionDrawsAction(
                                    this.state.yearRefId,
                                    this.state.firstTimeCompId,
                                    venueId,
                                    roundId, null, null, null, this.state.dateRangeCheck
                                );
                                this.setState({
                                    roundId,
                                    roundTime,
                                    venueId,
                                    venueLoad: false,
                                    //startDate: currentDate, endDate: currentDate
                                });
                            }
                        } else {
                            this.setState({
                                venueId,
                                venueLoad: false,
                            });
                        }
                    }
                    else if (this.state.changeDateLoad == false) {
                        let NullDate = new Date()
                        // if (this.props.drawsState.allcompetitionDateRange.length > 0) {
                        // let dateRangeData = this.props.drawsState.allcompetitionDateRange
                        // let selectedDateRange = dateRangeData[0].displayRange
                        let startDate = this.state.startDate == null ? moment(NullDate).format("YYYY-MM-DD") : this.state.startDate
                        let endDate = this.state.endDate == null ? moment(NullDate).format("YYYY-MM-DD") : this.state.endDate
                        this.setState({
                            startDate, endDate, venueId
                        })
                        this.props.getCompetitionDrawsAction(
                            this.state.yearRefId,
                            this.state.firstTimeCompId,
                            venueId,
                            0, null, startDate, endDate, this.state.dateRangeCheck
                        );
                        // }
                    }
                    else {
                        this.setState({
                            venueId, changeDateLoad: false
                        })
                        this.props.getCompetitionDrawsAction(
                            this.state.yearRefId,
                            this.state.firstTimeCompId,
                            venueId,
                            0, null, this.state.startDate, this.state.endDate, this.state.dateRangeCheck
                        );
                    }
                }
                if (divisionGradeNameList.length > 0) {
                    let competitionDivisionGradeId =
                        divisionGradeNameList[0].competitionDivisionGradeId;
                    setDraws_division_grade(competitionDivisionGradeId);
                    this.setState({ competitionDivisionGradeId });
                }
            }
        }
        if (nextProps.appState !== this.props.appState) {
            let competitionList = this.props.appState.own_CompetitionArr;
            if (nextProps.appState.own_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let competitionId = competitionList[0].competitionId;
                    let statusRefId = competitionList[0].statusRefId
                    setOwn_competitionStatus(statusRefId)
                    this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId);
                    setOwn_competition(competitionId);
                    this.setState({ firstTimeCompId: competitionId, venueLoad: true, competitionStatus: statusRefId });
                }
            }
        }

        if (nextProps.competitionModuleState != competitionModuleState) {
            if (
                competitionModuleState.drawGenerateLoad == false &&
                this.state.venueLoad === true
            ) {
                this.setState({ venueLoad: false });
                if (competitionModuleState.status == 5) {
                    message.error(ValidationConstants.drawsMessage[0]);
                } else if (
                    !competitionModuleState.error &&
                    competitionModuleState.status == 1
                ) {
                    this.props.clearDraws('rounds');
                    this.setState({
                        firstTimeCompId: this.state.firstTimeCompId,
                        roundId: null,
                        venueId: null,
                        roundTime: null,
                        venueLoad: true,
                        competitionDivisionGradeId: null,
                    });
                    // this.props.getCompetitionVenue(competitionId);
                    this.props.getDrawsRoundsAction(
                        this.state.yearRefId,
                        this.state.firstTimeCompId
                    );
                }
            }
        }

        if (nextProps.drawsState.changeStatus != changeStatus) {
            if (this.props.drawsState.changeStatus == false && this.state.changeStatus == true) {
                let statusRefId = this.props.drawsState.publishStatus
                setOwn_competitionStatus(statusRefId)
                message.success("Draws published to live scores successfully");
                this.setState({ changeStatus: false, competitionStatus: statusRefId })

                if (this.props.drawsState.teamNames != null && this.props.drawsState.teamNames != "") {
                    this.setState({ publishModalVisible: true });
                }
            }
        }
        if (
            this.state.roundLoad == true && this.props.drawsState.onActRndLoad == false
        ) {
            this.setState({ roundLoad: false });
            if (this.props.drawsState.activeDrawsRoundsData != null &&
                this.props.drawsState.activeDrawsRoundsData.length > 0) {
                this.setState({ drawGenerateModalVisible: true })
            }
            else {
                this.callGenerateDraw();
                // message.config({ duration: 0.9, maxCount: 1 });
                // message.info(AppConstants.roundsNotAvailable);
            }
        }

        // if (nextProps.drawsState.drawOrganisations != drawOrganisations) {
        //   if (drawOrganisations.length > 0) {
        //     let organisation_Id = drawOrganisations[0].organisationUniqueKey;
        //     this.setState({ organisation_Id })
        //   }
        // }
    }


    componentDidMount() {
        loadjs('assets/js/custom.js');
        this.apiCalls();
    }

    apiCalls() {
        let yearId = getOwnCompetitionYear();
        let storedCompetitionId = getOwn_competition();
        let storedCompetitionStatus = getOwn_competitionStatus()
        let propsData =
            this.props.appState.own_YearArr.length > 0
                ? this.props.appState.own_YearArr
                : undefined;
        let compData =
            this.props.appState.own_CompetitionArr.length > 0
                ? this.props.appState.own_CompetitionArr
                : undefined;
        let venueId = getDraws_venue();
        let roundId = getDraws_round();
        let roundTime = getDraws_roundTime();
        let roundData =
            this.props.drawsState.getDrawsRoundsData.length > 0
                ? this.props.drawsState.getDrawsRoundsData
                : undefined;
        let venueData =
            this.props.drawsState.competitionVenues.length > 0
                ? this.props.drawsState.competitionVenues
                : undefined;
        let competitionDivisionGradeId = getDraws_division_grade();
        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                competitionStatus: storedCompetitionStatus,
                venueLoad: true,
            });
            if (venueId && roundId && roundData && venueData) {
                this.props.getCompetitionDrawsAction(
                    yearId,
                    storedCompetitionId,
                    venueId,
                    roundId, null, null, null, this.state.dateRangeCheck
                );

                this.setState({
                    venueId: JSON.parse(venueId),
                    roundId: JSON.parse(roundId),
                    roundTime: roundTime,
                    competitionDivisionGradeId: JSON.parse(competitionDivisionGradeId),
                    venueLoad: false,
                });
            } else {
                this.props.getDrawsRoundsAction(yearId, storedCompetitionId);
            }
        } else if (yearId) {
            this.props.getYearAndCompetitionOwnAction(
                this.props.appState.own_YearArr,
                yearId,
                'own_competition'
            );
            this.setState({
                yearRefId: JSON.parse(yearId),
            });
        } else {
            this.props.getYearAndCompetitionOwnAction(
                this.props.appState.own_YearArr,
                null,
                'own_competition'
            );
            setOwnCompetitionYear(1);
        }
    }

    //////year change onchange
    onYearChange = (yearId) => {
        this.props.clearDraws('rounds');
        setOwnCompetitionYear(yearId);
        setOwn_competition(undefined);
        setOwn_competitionStatus(undefined)
        this.setState({
            firstTimeCompId: null,
            yearRefId: yearId,
            roundId: null,
            roundTime: null,
            venueId: null,
            competitionDivisionGradeId: null,
            organisation_Id: "-1",
            competitionStatus: 0
        });
        this.props.getYearAndCompetitionOwnAction(
            this.props.appState.own_YearArr,
            yearId,
            'own_competition'
        );
    };

    onChangeStartDate = (startDate, endDate) => {
        this.setState({
            startDate: startDate,
            endDate: endDate

        })
    }

    // on Competition change
    onCompetitionChange(competitionId, statusRefId) {
        this.props.clearDraws('rounds');
        if (competitionId == -1) {
            this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId, "all");
            this.setState({ dateRangeCheck: true })
        } else {
            setOwn_competition(competitionId);
            setOwn_competitionStatus(statusRefId)
            this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId);
        }

        this.setState({
            firstTimeCompId: competitionId,
            roundId: 0,
            venueId: competitionId == -1 ? this.state.venueId : null,
            roundTime: null,
            venueLoad: true,
            competitionDivisionGradeId: null,
            competitionStatus: statusRefId,
            organisation_Id: "-1",
            selectedDateRange: null,
            // startDate: null,
            // endDate: null
        });
    }

    checkDisplayCountList = (array, showAllStatus) => {
        if (array.length >= 5 && showAllStatus == true) {
            return array.length
        }
        else if (array.length > 0 && showAllStatus == false) {
            return 5
        }
        else {
            return array.length
        }
    }

    changeShowAllStatus = (key) => {
        if (key == "venue") {
            this.setState({ showAllVenue: !this.state.showAllVenue })
        }
        else if (key == "comp") {
            this.setState({ showAllComp: !this.state.showAllComp })
        }
        else if (key == "comp") {
            this.setState({ showAllDivision: !this.state.showAllDivision })
        }
    }

    headerView = () => {
        return (
            <div className="comp-draw-content-view">
                <div className="multi-draw-list-top-head row">
                    <div className="col-sm-3 mt-3">
                        <span className="form-heading">{AppConstants.draws}</span>
                    </div>
                    <div className="col-sm-9 row pr-0">
                        <div className="col-sm mt-2">
                            <Select
                                className="year-select reg-filter-select1"
                                style={{ maxWidth: 150, minWidth: 150 }}
                                onChange={(yearRefId) => this.onYearChange(yearRefId)}
                                value={this.state.yearRefId}
                            >
                                {this.props.appState.own_YearArr.map((item) => {
                                    return (
                                        <Option key={'yearRefId' + item.id} value={item.id}>
                                            {item.description}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                        <div className="col-sm mt-2">
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    minWidth: 250
                                }}>
                                <RangePicker
                                    onChange={(date) => this.onChangeStartDate(moment(date[0]).format("YYYY-MM-DD"), moment(date[1]).format("YYYY-MM-DD"))}
                                    format={"DD-MM-YYYY"}
                                    style={{ width: "100%", minWidth: 180 }}
                                    value={[moment(this.state.startDate), moment(this.state.endDate)]}
                                />
                            </div>
                        </div>
                        <div className="col-sm mt-2">
                            <Select
                                className="year-select reg-filter-select1"
                                style={{ maxWidth: 150, minWidth: 150 }}
                                onChange={(competitionId, e) =>
                                    this.onCompetitionChange(competitionId, e.key)
                                }
                                value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                            >
                                {this.props.appState.own_CompetitionArr.length > 0 && <Option key={"-1"} value={"-1"}>{AppConstants.all}</Option>
                                }
                                {this.props.appState.own_CompetitionArr.map((item) => {
                                    return (
                                        <Option
                                            key={item.statusRefId}
                                            value={item.competitionId}
                                        >
                                            {item.competitionName}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                        <div className="col-sm mt-2">
                            <Select
                                className="year-select reg-filter-select1"
                                style={{ maxWidth: 150, minWidth: 150 }}
                                onChange={(roundId) => this.onRoundsChange(roundId)}
                                value={this.state.roundId}
                            >
                                {this.props.drawsState.getDrawsRoundsData.length > 0 &&
                                    this.props.drawsState.getDrawsRoundsData.map((item) => {
                                        return (
                                            <Option key={item.roundId} value={item.roundId}>
                                                {item.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </div>
                        <div className="col-sm d-flex justify-content-end align-items-center pr-1">
                            <Button className="primary-add-comp-form" type="primary">
                                {AppConstants.go}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    ///////left side view for venue listing with checkbox
    venueLeftView = () => {
        let { competitionVenues } = this.props.drawsState
        let { showAllVenue } = this.state
        return (
            <>
                <div className="row d-flex align-items-center">
                    <div className="col-sm d-flex justify-content-start">
                        <span className="user-contact-heading">{AppConstants.venue}</span>
                    </div>
                    <div className="col-sm d-flex justify-content-end " style={{ marginTop: 5 }}>
                        <a
                            className="view-more-btn"
                            data-toggle="collapse"
                            href={`#venue-collapsable-div`}
                            role="button"
                            aria-expanded="false"
                            // aria-controls={teamIndex}
                        >
                            <i className="fa fa-angle-up" style={{ color: "#ff8237", }} aria-hidden="true" />
                        </a>
                    </div>

                </div>
                <div id="venue-collapsable-div" className="pt-3 collapse in">
                    <Checkbox
                        className="single-checkbox-radio-style"
                        style={{ paddingTop: 8 }}
                        checked={this.state.allVenueChecked}
                        onChange={e => this.setState({ allVenueChecked: e.target.checked })}
                        indeterminate={this.state.allVenueChecked ? false : true}
                    >
                        {AppConstants.all}
                    </Checkbox>
                    {isArrayNotEmpty(competitionVenues) && competitionVenues.map((item, index) => {
                        return (
                            index < this.checkDisplayCountList(competitionVenues, showAllVenue) && <div className="column pl-5">
                                <Checkbox
                                    className="single-checkbox-radio-style"
                                    style={{ paddingTop: 8 }}
                                    checked={item.checked}
                                    // onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.checked, "associationChecked")}
                                >
                                    {item.name}
                                </Checkbox>
                            </div>
                        )
                    })}
                    {isArrayNotEmpty(competitionVenues) && (
                        <span
                            className="input-heading-add-another pt-4"
                            onClick={() => this.changeShowAllStatus("venue")}
                        >
                            {showAllVenue == true ? AppConstants.showLess : AppConstants.showAll}
                        </span>
                    )}
                </div>

            </>
        )
    }

    ///////left side view for competition liting with checkbox
    competitionLeftView = () => {
        let { own_CompetitionArr } = this.props.appState
        let { showAllComp } = this.state
        return (
            <>
                <div className="row">
                    <div className="col-sm d-flex justify-content-start ">
                        <span className="user-contact-heading">{AppConstants.competitions}</span>
                    </div>
                    <div className="col-sm d-flex justify-content-end" style={{ marginTop: 5 }}>
                        <a
                            className="view-more-btn"
                            data-toggle="collapse"
                            href={`#comp-collapsable-div`}
                            role="button"
                            aria-expanded="true"
                            // aria-controls={teamIndex}
                        >
                            <i className="fa fa-angle-up" style={{ color: "#ff8237", }} aria-hidden="true" />
                        </a>
                    </div>
                </div>
                <div id="comp-collapsable-div" className="pt-3 collapse in">
                    <Checkbox
                        className="single-checkbox-radio-style"
                        style={{ paddingTop: 8 }}
                        checked={this.state.allCompChecked}
                        onChange={e => this.setState({ allCompChecked: e.target.checked })}
                        indeterminate={this.state.allCompChecked ? false : true}
                    >
                        {AppConstants.all}
                    </Checkbox>
                    <div className={showAllComp ? "multi-draw-left-list-view" : ""}>
                        {isArrayNotEmpty(own_CompetitionArr) && own_CompetitionArr.map((item, index) => {
                            return (
                                index < this.checkDisplayCountList(own_CompetitionArr, showAllComp) && <div className="column pl-5">
                                    <Checkbox
                                        className="single-checkbox-radio-style"
                                        style={{ paddingTop: 8 }}
                                        checked={item.checked}
                                        // onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.checked, "associationChecked")}
                                    >
                                        {item.competitionName}
                                    </Checkbox>
                                </div>
                            )
                        })}
                    </div>
                    {isArrayNotEmpty(own_CompetitionArr) && (
                        <span
                            className="input-heading-add-another pt-4"
                            onClick={() => this.changeShowAllStatus("comp")}
                        >
                            {showAllComp == true ? AppConstants.showLess : AppConstants.showAll}
                        </span>
                    )}
                </div>

            </>
        )
    }

    ///////left side view for division liting with checkbox
    divisionLeftView = () => {
        return (
            <>
                <div className="row">
                    <div className="col-sm d-flex justify-content-start ">
                        <span className="user-contact-heading">{AppConstants.divisions}</span>
                    </div>
                    <div className="col-sm d-flex justify-content-end" style={{ marginTop: 5 }}>
                        <a
                            className="view-more-btn"
                            data-toggle="collapse"
                            href={`#division-collapsable-div`}
                            role="button"
                            aria-expanded="true"
                            // aria-controls={teamIndex}
                        >
                            <i className="fa fa-angle-up" style={{ color: "#ff8237", }} aria-hidden="true" />
                        </a>
                    </div>
                </div>
                <div id="division-collapsable-div" className="pt-3 collapse in">
                    <Checkbox
                        className="single-checkbox-radio-style"
                        style={{ paddingTop: 8 }}
                        checked={this.state.allDivisionChecked}
                        onChange={e => this.setState({ allDivisionChecked: e.target.checked })}
                        indeterminate={this.state.allDivisionChecked ? false : true}
                    >
                        {AppConstants.all}
                    </Checkbox>
                    {isArrayNotEmpty(divisionStaticData) && divisionStaticData.map((item, index) => {
                        return (
                            <div className="column pl-5">
                                <div style={{ paddingTop: 10, paddingBottom: 10 }}>
                                    <span className="inbox-time-text" >{item.name}</span>
                                </div>
                                {isArrayNotEmpty(item.divisionArr) && item.divisionArr.map((subItem, subIndex) => {
                                    return (
                                        <div>
                                            <Checkbox
                                                className="single-checkbox-radio-style"
                                                style={{ paddingTop: 8 }}
                                                checked={subItem.checked}
                                                // onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.checked, "associationChecked")}
                                            >
                                                {subItem.name}
                                            </Checkbox>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                    <span className="input-heading-add-another pt-4">{AppConstants.showAll}</span>
                </div>
            </>
        )
    }

    sideMenuView = () => {
        return (
            <div className="multiDrawContentView multi-draw-list-top-head pr-0">
                <div className="d-flex align-items-center mt-4">
                    <img className="dot-image" src={AppImages.filterIcon} alt="" width="16" height="16" />
                    <span className="input-heading-add-another pt-0 pl-3">{AppConstants.hideFilter}</span>
                </div>
                {this.venueLeftView()}
                {this.competitionLeftView()}
                {this.divisionLeftView()}
            </div>
        )
    }

    containerView() {
        return (
            <div className="multiDrawContentView">
                <div className="multi-draw-list-top-head row" style={{ alignContent: "center" }}>
                    <div className="col-sm-3 mt-3">
                        <span className="form-heading">{AppConstants.matchCalender}</span>
                    </div>
                    <div className="col-sm-3 mt-3">
                        <div
                            style={{
                                width: "fit-content",
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: "10px",
                                marginTop: 5
                            }}
                        >
                            <Checkbox
                                className="year-select-heading"
                                onChange={(e) => this.setState({ showByMatches: e.target.checked })}
                                checked={this.state.showByMatches} >
                                {AppConstants.showByMatches}
                            </Checkbox>
                        </div>
                    </div>
                    <div className="col-sm-6 pr-0 d-flex justify-content-end align-items-center">
                        <img className="dot-image" src={AppImages.downloadIcon} alt="" width="16" height="16" />
                        <span className="input-heading-add-another pt-0 pr-5 pl-3">{AppConstants.matchesList}</span>
                        <Button className="multi-field-draw-edit-button" type="primary">
                            {AppConstants.edit}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    contentView = () => {
        return (
            <div className='row'>
                <div className='col-sm-3'>{this.sideMenuView()}</div>
                <div className='col-sm-9'>{this.containerView()}</div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.draws}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./liveScoreCompetitions")}
                />
                <InnerHorizontalMenu menu={'competition'} compSelectedKey={'18'} />
                <Layout className="comp-dash-table-view">
                    {this.headerView()}
                    <Content>{this.contentView()}</Content>
                    <Footer />
                    <Loader visible={this.props.drawsState.updateLoad || this.props.competitionModuleState.drawGenerateLoad} />
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
            updateCourtTimingsDrawsAction,
            clearDraws,
            publishDraws,
            matchesListDrawsAction,
            generateDrawAction,
            unlockDrawsAction,
            getActiveRoundsAction,
            changeDrawsDateRangeAction
        },
        dispatch
    );
}

function mapStateToProps(state) {
    return {
        appState: state.AppState,
        drawsState: state.CompetitionMultiDrawsState,
        competitionModuleState: state.CompetitionModuleState,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MultifieldDrawsNew);
