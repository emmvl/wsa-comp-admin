import React, { Component } from "react";
import { Layout, Button, Tooltip, Popover, Menu, Select, DatePicker, Checkbox, Form, message, Spin, Modal, Radio } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import history from "../../util/history";
import { NavLink } from 'react-router-dom';
import DrawsPublishModel from '../../customComponents/drawsPublishModel'
import _ from "lodash";
import loadjs from 'loadjs';
import moment from 'moment';
import AppImages from "../../themes/appImages";
import Swappable from '../../customComponents/SwappableComponentTimeline';
import { isArrayNotEmpty } from '../../util/helpers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDayName, getTime } from '../../themes/dateformate';
import Loader from '../../customComponents/loader';
import {
    getCompetitionDrawsAction,
    getDrawsRoundsAction,
    updateCompetitionDrawsTimeline,
    saveDraws,
    getCompetitionVenue,
    updateCourtTimingsDrawsAction,
    clearMultiDraws,
    publishDraws,
    matchesListDrawsAction,
    unlockDrawsAction,
    getActiveRoundsAction,
    changeDrawsDateRangeAction,
    checkBoxOnChange,
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
    setOwn_competitionStatus,
    getOwn_CompetitionFinalRefId, setOwn_CompetitionFinalRefId
} from '../../util/sessionStorage';
import ValidationConstants from '../../themes/validationConstant';
import './draws.scss';
import getColor from "../../util/coloredCheckbox";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Footer, Content } = Layout;
const { SubMenu } = Menu;
const { confirm } = Modal;

const ONE_MIN_WIDTH = 2;
const ONE_HOUR_IN_MIN = 60;

class MultifieldDrawsNewTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: null,
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
            changeDateLoad: false,
            dateRangeCheck: false,
            allVenueChecked: true,
            allVenueCheckedByOne: true,
            allCompChecked: true,
            allDivisionChecked: true,
            showAllVenue: false,
            showAllComp: false,
            showAllDivision: false,
            filterEnable: true,
            showAllOrg: false,
            allOrgChecked: true,
            singleCompDivisionCheked: true,
            filterDates: false,
            regenerateDrawExceptionModalVisible: false,
            regenerateExceptionRefId: 1,
            draggableEventObject: null,
            draggableElMouse: null,
            dragDayTarget: null,
            dragDayTimeRestrictions: null,
            dragDayStart: null,
            courtDataTarget: null,
            tooltipSwappableTime: null,
        };
        this.props.clearMultiDraws();
        this.dragTimeRef = React.createRef();
        this.dragTimeEndRef = React.createRef();
    }

    componentDidUpdate(nextProps) {
        let competitionModuleState = this.props.competitionModuleState;
        let drawsRoundData = this.props.drawsState.getDrawsRoundsData;
        let venueData = this.props.drawsState.competitionVenues;
        let divisionGradeNameList = this.props.drawsState.divisionGradeNameList;
        let changeStatus = this.props.drawsState.changeStatus;

        if (this.state.venueLoad && this.props.drawsState.updateLoad == false) {
            if (nextProps.drawsState.getDrawsRoundsData !== drawsRoundData) {
                if (venueData.length > 0) {
                    let venueId = this.state.firstTimeCompId == -1 || this.state.filterDates ? this.state.venueId : venueData[0].id;
                    setDraws_venue(venueId);
                    if (this.state.firstTimeCompId != "-1" && !this.state.filterDates) {
                        if (drawsRoundData.length > 0) {
                            let roundId = null;
                            let roundTime = null;
                            if (drawsRoundData.length > 1) {
                                roundId = drawsRoundData[1].roundId;
                                setDraws_round(roundId);
                                roundTime = drawsRoundData[1].startDateTime;
                                setDraws_roundTime(roundTime);
                                this.props.getCompetitionDrawsAction(
                                    this.state.yearRefId,
                                    this.state.firstTimeCompId,
                                    venueId,
                                    roundId,
                                    null,
                                    null,
                                    null,
                                    this.state.filterDates
                                );
                                this.setState({
                                    roundId,
                                    roundTime,
                                    venueId,
                                    venueLoad: false,
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
                                    roundId,
                                    null,
                                    null,
                                    null,
                                    this.state.filterDates
                                );
                                this.setState({
                                    roundId,
                                    roundTime,
                                    venueId,
                                    venueLoad: false,
                                });
                            }
                        } else {
                            this.setState({
                                venueId,
                                venueLoad: false,
                            });
                        }
                    } else if (this.state.changeDateLoad == false) {
                        let NullDate = new Date()
                        let startDate = this.state.startDate == null ? moment(NullDate).format("YYYY-MM-DD") : this.state.startDate
                        let endDate = this.state.endDate == null ? moment(NullDate).format("YYYY-MM-DD") : this.state.endDate
                        this.setState({
                            startDate, endDate, venueId
                        })
                        this.props.getCompetitionDrawsAction(
                            this.state.yearRefId,
                            this.state.firstTimeCompId,
                            venueId,
                            0,
                            null,
                            startDate,
                            endDate,
                            this.state.filterDates
                        );
                    } else {
                        this.setState({
                            venueId, changeDateLoad: false
                        })
                        this.props.getCompetitionDrawsAction(
                            this.state.yearRefId,
                            this.state.firstTimeCompId,
                            venueId,
                            0,
                            null,
                            this.state.startDate,
                            this.state.endDate,
                            this.state.filterDates
                        );
                    }
                }
                if (divisionGradeNameList.length > 0) {
                    let competitionDivisionGradeId = divisionGradeNameList[0].competitionDivisionGradeId;
                    setDraws_division_grade(competitionDivisionGradeId);
                    this.setState({ competitionDivisionGradeId });
                }
            }
        }

        if (nextProps.appState !== this.props.appState) {
            let competitionList = this.props.appState.own_CompetitionArr;
            if (nextProps.appState.own_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let storedCompetitionId = getOwn_competition();
                    let storedCompetitionStatus = getOwn_competitionStatus();
                    let storedFinalTypeRefId = getOwn_CompetitionFinalRefId()
                    let competitionId = (storedCompetitionId != undefined && storedCompetitionId !== "undefined") ? storedCompetitionId : competitionList[0].competitionId;
                    let statusRefId = (storedCompetitionStatus != undefined && storedCompetitionStatus !== "undefined") ? storedCompetitionStatus : competitionList[0].statusRefId;
                    let finalTypeRefId = (storedFinalTypeRefId != undefined && storedFinalTypeRefId !== "undefined") ? storedFinalTypeRefId : competitionList[0].finalTypeRefId
                    let yearId = this.state.yearRefId ? this.state.yearRefId : getOwnCompetitionYear()
                    setOwn_competitionStatus(statusRefId)
                    this.props.getDrawsRoundsAction(yearId, competitionId);
                    setOwn_competition(competitionId);
                    setOwn_CompetitionFinalRefId(finalTypeRefId)
                    this.setState({ firstTimeCompId: competitionId, venueLoad: true, competitionStatus: statusRefId, yearRefId: yearId });
                }
            }
        }

        if (nextProps.competitionModuleState != competitionModuleState) {
            if (competitionModuleState.drawGenerateLoad == false && this.state.venueLoad === true) {
                this.setState({ venueLoad: false });
                if (competitionModuleState.status == 5) {
                    message.error(ValidationConstants.drawsMessage[0]);
                } else if (!competitionModuleState.error && competitionModuleState.status == 1) {
                    this.props.clearMultiDraws('rounds');
                    this.setState({
                        firstTimeCompId: this.state.firstTimeCompId,
                        roundId: null,
                        venueId: null,
                        roundTime: null,
                        venueLoad: true,
                        competitionDivisionGradeId: null,
                    });
                    this.props.getDrawsRoundsAction(
                        this.state.yearRefId,
                        this.state.firstTimeCompId
                    );
                }
            }
        }

        if (nextProps.drawsState.changeStatus != changeStatus) {
            if (this.props.drawsState.changeStatus == false && this.state.changeStatus) {
                let statusRefId = this.props.drawsState.publishStatus
                setOwn_competitionStatus(statusRefId)
                message.success("Draws published to live scores successfully");
                this.setState({ changeStatus: false, competitionStatus: statusRefId })

                if (this.props.drawsState.teamNames != null && this.props.drawsState.teamNames != "") {
                    this.setState({ publishModalVisible: true });
                }
            }
        }
        if (this.state.roundLoad && this.props.drawsState.onActRndLoad == false) {
            this.setState({ roundLoad: false });
            if (this.props.drawsState.activeDrawsRoundsData != null &&
                this.props.drawsState.activeDrawsRoundsData.length > 0) {
                this.setState({ drawGenerateModalVisible: true })
            } else {
                this.callGenerateDraw();
            }
        }
    }

    componentDidMount() {
        loadjs('assets/js/custom.js');
        this.apiCalls();
    }

    apiCalls() {
        let yearId = getOwnCompetitionYear();
        let storedCompetitionId = getOwn_competition();
        let storedCompetitionStatus = getOwn_competitionStatus()
        let propsData = this.props.appState.own_YearArr.length > 0
            ? this.props.appState.own_YearArr
            : undefined;
        let compData = this.props.appState.own_CompetitionArr.length > 0
            ? this.props.appState.own_CompetitionArr
            : undefined;
        let venueId = getDraws_venue();
        let roundId = getDraws_round();
        let roundTime = getDraws_roundTime();
        let roundData = this.props.drawsState.getDrawsRoundsData.length > 0
            ? this.props.drawsState.getDrawsRoundsData
            : undefined;
        let venueData = this.props.drawsState.competitionVenues.length > 0
            ? this.props.drawsState.competitionVenues
            : undefined;
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
                    roundId,
                    null,
                    null,
                    null,
                    this.state.filterDates
                );
                this.setState({
                    venueId: JSON.parse(venueId),
                    roundId: JSON.parse(roundId),
                    roundTime: roundTime,
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
        }
    }

    applyDateFilter = () => {
        this.props.clearMultiDraws()
        if (this.state.firstTimeCompId == "-1" || this.state.filterDates) {
            this.props.changeDrawsDateRangeAction(this.state.yearRefId,
                this.state.firstTimeCompId, this.state.startDate, this.state.endDate);
            this.setState({
                roundId: 0,
                roundTime: null,
                venueLoad: true,
                competitionDivisionGradeId: null,
                changeDateLoad: true
            });
        } else {
            this.props.getCompetitionDrawsAction(
                this.state.yearRefId,
                this.state.firstTimeCompId,
                this.state.venueId,
                this.state.roundId,
                this.state.organisation_Id,
                null,
                null,
                this.state.applyDateFilter
            );
        }
    }

    //////year change onchange
    onYearChange = (yearId) => {
        this.props.clearMultiDraws('rounds');
        setOwnCompetitionYear(yearId);
        setOwn_competition(undefined);
        setOwn_competitionStatus(undefined)
        setOwn_CompetitionFinalRefId(undefined)
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

    changeAllVenueStatus = (value, key) => {
        if (key === "venue") {
            this.props.checkBoxOnChange(value, "allCompetitionVenues")
            this.setState({ allVenueChecked: value })
        } else if (key === 'competition') {
            this.props.checkBoxOnChange(value, "allCompetition")
            this.setState({ allCompChecked: value })
        } else if (key === "org") {
            this.props.checkBoxOnChange(value, "allOrganisation")
            this.setState({ allOrgChecked: value })

        } else if (key === 'allDivisionChecked') {
            this.props.checkBoxOnChange(value, "allDivisionChecked")
            this.setState({ allDivisionChecked: value })
        } else if (key === 'singleCompDivisionCheked') {
            this.props.checkBoxOnChange(value, "singleCompDivisionCheked")
            this.setState({ singleCompDivisionCheked: value })
        }
    }

    onSwap(source, target, drawData, round_Id) {
        let sourceIndexArray = source.split(':');
        let targetIndexArray = target.split(':');
        let sourceXIndex = sourceIndexArray[0];
        let sourceYIndex = sourceIndexArray[1];
        let targetXIndex = targetIndexArray[0];
        let targetYIndex = targetIndexArray[1];
        if (sourceXIndex === targetXIndex && sourceYIndex === targetYIndex) {
            return;
        }

        let sourceObejct = drawData[sourceXIndex].slotsArray[sourceYIndex];
        let targetObject = drawData[targetXIndex].slotsArray[targetYIndex];

        // events end time calculations
        const startTimeSource = moment(sourceObejct.matchDate);
        const endTimeSource = moment(sourceObejct.matchDate.slice(0, -5) + sourceObejct.endTime);
        const diffTimeSource = endTimeSource.diff(startTimeSource, 'minutes');
        const newEndTimeSource = moment(targetObject.matchDate).add(diffTimeSource, 'minutes').format('HH:mm');

        const startTimeTarget = moment(targetObject.matchDate);
        const endTimeTarget = moment(targetObject.matchDate.slice(0, -5) + targetObject.endTime);
        const diffTimeTarget = endTimeTarget.diff(startTimeTarget, 'minutes');
        const newEndTimeTarget = moment(sourceObejct.matchDate).add(diffTimeTarget, 'minutes').format('HH:mm');

        if (sourceObejct.drawsId !== null && targetObject.drawsId !== null) {
            this.updateCompetitionDraws(
                sourceObejct,
                targetObject,
                sourceIndexArray,
                targetIndexArray,
                drawData,
                round_Id,
                newEndTimeSource,
                newEndTimeTarget
            );
        }
    }

    checkCurrentSwapObjects(source, target, drawData) {
        let sourceIndexArray = source.split(':');
        let targetIndexArray = target.split(':');
        let sourceXIndex = sourceIndexArray[0];
        let sourceYIndex = sourceIndexArray[1];
        let targetXIndex = targetIndexArray[0];
        let targetYIndex = targetIndexArray[1];

        let sourceObejct = drawData[sourceXIndex].slotsArray[sourceYIndex];
        let targetObject = drawData[targetXIndex].slotsArray[targetYIndex];

        // for end time calculations
        const startTimeSource = moment(sourceObejct.matchDate);
        const endTimeSource = moment(sourceObejct.matchDate.slice(0, -5) + sourceObejct.endTime);
        const diffTimeSource = endTimeSource.diff(startTimeSource, 'minutes');

        const startTimeTarget = moment(targetObject.matchDate);
        const endTimeTarget = moment(targetObject.matchDate.slice(0, -5) + targetObject.endTime);
        const diffTimeTarget = endTimeTarget.diff(startTimeTarget, 'minutes');

        // define next slots with data
        const nextSource = drawData[sourceXIndex].slotsArray.find((slot, index) => {
            if(index > sourceYIndex && slot.drawsId) {
                return slot;
            }
        })

        const nextTarget = drawData[targetXIndex].slotsArray.find((slot, index) => {
            if(index > targetYIndex && slot.drawsId) {
                return slot;
            }
        })

        // define if next events starts later

        const schedule = this.getWeeklySchedule();

        // define end time in day schedule
        const targetDayOfWeek = moment(sourceObejct.matchDate).format('dddd').toLowerCase();
        const targetSchedule = schedule.find(scheduleDay => scheduleDay.day.toLowerCase() === targetDayOfWeek);
        const endWorkingDayTarget = targetObject.matchDate.slice(0, -5) + targetSchedule.timeslot.endTime;

        const sourceDayOfWeek = moment(targetObject.matchDate).format('dddd').toLowerCase();
        const sourceSchedule = schedule.find(scheduleDay => scheduleDay.day.toLowerCase() === sourceDayOfWeek);
        const endWorkingDaySource = sourceObejct.matchDate.slice(0, -5) + sourceSchedule.timeslot.endTime;

        // define if the swappable event finishes before next event or end of the working day

        const sourceEndNew = moment(targetObject.matchDate).add(diffTimeSource, 'minutes');
        const startTimeNextTarget = nextTarget ? moment(nextTarget.matchDate) : moment(endWorkingDayTarget);
        const isStartNextSourceLater = startTimeNextTarget.isSameOrAfter(sourceEndNew);

        const targetEndNew = moment(sourceObejct.matchDate).add(diffTimeTarget, 'minutes');
        const startTimeNextSource = nextSource ? moment(nextSource.matchDate) : moment(endWorkingDaySource);
        const isStartNextTargetLater = startTimeNextSource.isSameOrAfter(targetEndNew);

        // for case when next events starts before end of swappable ones
        if (!isStartNextTargetLater || !isStartNextSourceLater) {
            return false;
        }

        return true;
    }

    getColumnData = (indexArray, drawData) => {
        let yIndex = indexArray[1];
        let object = null;

        for (let i in drawData) {
            let slot = drawData[i].slotsArray[yIndex];
            if (slot.drawsId !== null) {
                object = slot;
                break;
            }
        }
        return object;
    };

    ///////update the competition draws on  swapping and hitting update Apis if both has value
    updateCompetitionDraws = (
        sourceObejct,
        targetObject,
        sourceIndexArray,
        targetIndexArray,
        drawData,
        round_Id,
        newEndTimeSource,
        newEndTimeTarget
    ) => {
        let key = this.state.firstTimeCompId === "-1" || this.state.filterDates ? "all" : "add"
        let customSourceObject = {
            drawsId: targetObject.drawsId,
            homeTeamId: sourceObejct.homeTeamId,
            awayTeamId: sourceObejct.awayTeamId,
            matchDate: moment(targetObject.matchDate).format('YYYY-MM-DD HH:mm'),
            startTime: targetObject.startTime,
            endTime: newEndTimeSource,
            venueCourtId: targetObject.venueCourtId,
            competitionDivisionGradeId: sourceObejct.competitionDivisionGradeId,
            isLocked: 1,
        };
        let customTargetObject = {
            drawsId: sourceObejct.drawsId,
            homeTeamId: targetObject.homeTeamId,
            awayTeamId: targetObject.awayTeamId,
            matchDate: moment(sourceObejct.matchDate).format('YYYY-MM-DD HH:mm'),
            startTime: sourceObejct.startTime,
            endTime: newEndTimeTarget,
            venueCourtId: sourceObejct.venueCourtId,
            competitionDivisionGradeId: targetObject.competitionDivisionGradeId,
            isLocked: 1,
        };
        let postObject = {
            draws: [customSourceObject, customTargetObject],
        };

        let yearId = getOwnCompetitionYear();
        let storedCompetitionId = getOwn_competition();
        let venueId = getDraws_venue();
        let roundId = getDraws_round();

        this.props.updateCompetitionDrawsTimeline(
            postObject,
            sourceIndexArray,
            targetIndexArray,
            key,
            round_Id,
            yearId,
            storedCompetitionId,
            venueId,
            roundId,
            null,
            null,
            null,
            this.state.filterDates
        );

        this.setState({ updateLoad: true, isOnSwapUpdate : true });
    };

    // on Competition change
    onCompetitionChange(competitionId, statusRefId) {
        let own_CompetitionArr = this.props.appState.own_CompetitionArr
        this.props.clearMultiDraws('rounds');
        if (competitionId == -1 || this.state.filterDates) {
            this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId, "all", true, this.state.startDate, this.state.endDate);
            this.setState({ filterDates: true })
        } else {
            let statusIndex = own_CompetitionArr.findIndex((x) => x.competitionId == competitionId)
            let statusRefId = own_CompetitionArr[statusIndex].statusRefId
            let finalTypeRefId = own_CompetitionArr[statusIndex].finalTypeRefId
            setOwn_competition(competitionId);
            setOwn_competitionStatus(statusRefId)
            setOwn_CompetitionFinalRefId(finalTypeRefId)
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
            showAllDivision: false
        });
    }

    //////onRoundsChange
    onRoundsChange = (roundId) => {
        let roundData = this.props.drawsState.getDrawsRoundsData;
        this.props.clearMultiDraws();
        let matchRoundData = roundData.findIndex((x) => x.roundId == roundId);
        let roundTime = roundData[matchRoundData].startDateTime;
        this.setState({ roundId, roundTime });
        setDraws_round(roundId);
        setDraws_roundTime(roundTime);
        this.props.getCompetitionDrawsAction(
            this.state.yearRefId,
            this.state.firstTimeCompId,
            this.state.venueId,
            roundId,
            this.state.organisation_Id,
            null,
            null,
            this.state.filterDates
        );
    };

    checkDisplayCountList = (array, showAllStatus) => {
        if (array.length >= 5 && showAllStatus) {
            return array.length
        } else if (array.length > 0 && showAllStatus == false) {
            return 5
        } else {
            return array.length
        }
    }

    changeShowAllStatus = (key) => {
        if (key === "venue") {
            this.setState({ showAllVenue: !this.state.showAllVenue })
        } else if (key === "comp") {
            this.setState({ showAllComp: !this.state.showAllComp })
        } else if (key === "division") {
            this.setState({ showAllDivision: !this.state.showAllDivision })
        } else if (key === "org") {
            this.setState({ showAllOrg: !this.state.showAllOrg })
        }
    }

    filterOnClick = () => {
        this.setState({ filterEnable: !this.state.filterEnable })
    }

    onMatchesList = () => {
        this.props.matchesListDrawsAction(this.state.firstTimeCompId);
    };

    checkColor(slot) {
        let checkDivisionFalse = this.state.firstTimeCompId == "-1" || this.state.filterDates ? this.checkAllDivisionData() : this.checkAllCompetitionData(this.props.drawsState.divisionGradeNameList, 'competitionDivisionGradeId')
        let checkCompetitionFalse = this.state.firstTimeCompId == "-1" || this.state.filterDates ? this.checkAllCompetitionData(this.props.drawsState.drawsCompetitionArray, "competitionName") : []
        let checkVenueFalse = this.checkAllCompetitionData(this.props.drawsState.competitionVenues, "id")
        let checkOrganisationFalse = this.checkAllCompetitionData(this.props.drawsState.drawOrganisations, "organisationUniqueKey")
        if (!checkDivisionFalse.includes(slot.competitionDivisionGradeId)) {
            if (!checkCompetitionFalse.includes(slot.competitionName)) {
                if (!checkVenueFalse.includes(slot.venueId)) {
                    if (!checkOrganisationFalse.includes(slot.awayTeamOrganisationId) || !checkOrganisationFalse.includes(slot.homeTeamOrganisationId)) {
                        return slot.colorCode
                    } else {
                        return "#999999"
                    }
                } else {
                    return "#999999"
                }
            } else {
                return "#999999"
            }
        } else {
            return "#999999"
        }
    }

    checkAllDivisionData = () => {
        let uncheckedDivisionArr = []
        let { drawDivisions } = this.props.drawsState
        if (drawDivisions.length > 0) {
            for (let i in drawDivisions) {
                let divisionsArr = drawDivisions[i].legendArray
                for (let j in divisionsArr) {
                    if (divisionsArr[j].checked == false) {
                        uncheckedDivisionArr.push(divisionsArr[j].competitionDivisionGradeId)
                    }
                }
            }
        }
        return uncheckedDivisionArr
    }

    checkAllCompetitionData = (checkedArray, key) => {
        let uncheckedArr = []
        if (checkedArray.length > 0) {
            for (let i in checkedArray) {
                if (checkedArray[i].checked == false) {
                    uncheckedArr.push(checkedArray[i][key])
                }
            }
            return uncheckedArr
        }
        return uncheckedArr
    }

    checkSwap(slot) {
        let checkDivisionFalse = this.state.firstTimeCompId == "-1" ? this.checkAllDivisionData() : this.checkAllCompetitionData(this.props.drawsState.divisionGradeNameList, 'competitionDivisionGradeId')
        let checkCompetitionFalse = this.state.firstTimeCompId == "-1" ? this.checkAllCompetitionData(this.props.drawsState.drawsCompetitionArray, "competitionName") : []
        let checkVenueFalse = this.checkAllCompetitionData(this.props.drawsState.competitionVenues, "id")
        let checkOrganisationFalse = this.checkAllCompetitionData(this.props.drawsState.drawOrganisations, "organisationUniqueKey")
        let disabledStatus = this.state.competitionStatus == 1
        if (!checkDivisionFalse.includes(slot.competitionDivisionGradeId)) {
            if (!checkCompetitionFalse.includes(slot.competitionName)) {
                if (!checkVenueFalse.includes(slot.venueId)) {
                    if (!checkOrganisationFalse.includes(slot.awayTeamOrganisationId) || !checkOrganisationFalse.includes(slot.homeTeamOrganisationId)) {
                        if (!disabledStatus) {
                            return true
                        } else {
                            return false
                        }
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            } else {
                return false
            }
        } else {
            return false
        }
    }

    onDateRangeCheck = (val) => {
        this.props.clearMultiDraws("rounds");
        let startDate = moment(new Date()).format("YYYY-MM-DD");
        let endDate = moment(new Date()).format("YYYY-MM-DD");
        this.props.getDrawsRoundsAction(this.state.yearRefId, this.state.firstTimeCompId, null, val);
        this.setState({ filterDates: val, startDate: startDate, endDate: endDate, venueLoad: true, });
    }

    allFilterValue = data => {
        const isAllSelected = isArrayNotEmpty(data) && data.map(item => item.checked).every(item=> item === true);
        return isAllSelected ? true : false;
    }

    getWeeklySchedule = () => {
        let venueData = this.props.drawsState.competitionVenues;

        // console.log('venueData', venueData);

        const weekSlotsTimeSchedule = [];

        if (venueData.length) {
            venueData.forEach(venue => {
                venue.availableTimeslots && venue.availableTimeslots.forEach(venueSlot => {
                    const equalDaysOfWeekSlot = weekSlotsTimeSchedule.find(weekSlot => weekSlot.day === venueSlot.day);

                    if (!equalDaysOfWeekSlot || !weekSlotsTimeSchedule.length) {
                        weekSlotsTimeSchedule.push(venueSlot);
                    }

                    if (equalDaysOfWeekSlot) {
                        const equalDaysOfWeekSlotStart = moment(equalDaysOfWeekSlot.timeslot.startTime, 'HH:mm');
                        const equalDaysOfWeekSlotEnd = moment(equalDaysOfWeekSlot.timeslot.endTime, 'HH:mm');

                        const venueSlotStart = moment(venueSlot.timeslot.startTime, 'HH:mm');
                        const venueSlotEnd = moment(venueSlot.timeslot.endTime, 'HH:mm');

                        const isStartBefore = venueSlotStart.isBefore(equalDaysOfWeekSlotStart);
                        const isEndAfter = venueSlotEnd.isAfter(equalDaysOfWeekSlotEnd);

                        if(isStartBefore) {
                            equalDaysOfWeekSlot.timeslot.startTime = venueSlot.timeslot.startTime;
                        }

                        if(isEndAfter) {
                            equalDaysOfWeekSlot.timeslot.endTime = venueSlot.timeslot.endTime;
                        }
                    }
                })
            });
        }

        return weekSlotsTimeSchedule;
    }

    addNoneDisplayTooltip = () => {
        const tooltip = document.getElementById('draggableTooltip');

        tooltip.setAttribute(
            "style",
            "display: none"
        );
    }

    drawsFieldDragMove = e => {
        const { draggableElMouseX, draggableElMouseY } = this.state.draggableElMouse;
        const { dragDayTimeRestrictions } = this.state;

        const parent = e.currentTarget;
        const boundsParent = parent.getBoundingClientRect();
        const tooltipX = Math.trunc((e.pageX - boundsParent.left - draggableElMouseX));
        const tooltipY = Math.trunc((e.pageY - boundsParent.top - draggableElMouseY)) - 70;

        const tooltip = document.getElementById('draggableTooltip');
        const isTooltipAllowTime = this.dragTimeRef.current?.isSameOrAfter(dragDayTimeRestrictions?.startTime)
                                && this.dragTimeEndRef.current?.isSameOrBefore(dragDayTimeRestrictions?.endTime)
                                && !!this.state.dragDayTarget;


        if (isTooltipAllowTime || this.state.tooltipSwappableTime) {
            tooltip.setAttribute(
                "style",
                    `
                    min-width: fit-content;
                    padding: 5px;
                    background: #fff;
                    border: 1px solid #bbbbc6;
                    border-radius: 5px;
                    position: absolute;
                    left: ${tooltipX}px;
                    top: ${tooltipY}px;
                    z-index: 100`
            );
        }

        else {
            tooltip.setAttribute(
                "style",
                "display: none"
            );
        }
    }

    dayLineDragMove = (e, startDayDate, courtDataSlotsTarget, timeRestrictionsSchedule) => {
        const { draggableEventObject, tooltipSwappableTime, dragDayTarget } = this.state;

        if (dragDayTarget !== e.currentTarget) {
            this.setState({
                dragDayTarget: e.currentTarget,
                dragDayStart: startDayDate,
                dragDayTimeRestrictions: timeRestrictionsSchedule
            });
        }

        if (this.state.courtDataSlotsTarget !== courtDataSlotsTarget) {
            this.setState({ courtDataSlotsTarget })
        }

        const targetCourtId = e.currentTarget.id.split(':')[0];

        const { draggableElMouseX } = this.state.draggableElMouse;

        if (targetCourtId) {
            const bounds = e.currentTarget.getBoundingClientRect();
            const draggableElXStart = Math.trunc(((e.pageX - bounds.left - draggableElMouseX) / ONE_MIN_WIDTH));

            const newTime = startDayDate.clone().add(draggableElXStart, 'minutes');

            const refTimeFormatted = newTime.format('YYYY-MM-DD HH:mm');
            const startTimeNew = moment(refTimeFormatted);
            const newTimeFormatted = startTimeNew.format('HH:mm');
            const newTimeWithDateFormatted = startTimeNew.format('YYYY-MM-DD HH:mm');

            const startTimeOld = moment(draggableEventObject.matchDate);
            const endTimeOld = moment(draggableEventObject.matchDate.slice(0, -5) + draggableEventObject.endTime);
            const diffTime= endTimeOld.diff(startTimeOld, 'minutes');
            const endTimeNew = moment(newTimeWithDateFormatted).add(diffTime, 'minutes');

            this.dragTimeEndRef.current = endTimeNew;

            this.dragTimeRef.current = startTimeNew;

            const notEmptySlot = courtDataSlotsTarget.find(slot => slot.venueCourtId);

            const tooltip = document.getElementById('draggableTooltip');
            const tooltipSwappableTimeFormatted = moment(tooltipSwappableTime).format('HH:mm');

            tooltip.innerHTML = `
                <div>Starting at ${tooltipSwappableTime ? tooltipSwappableTimeFormatted : newTimeFormatted}</div>
                <div>Court ${notEmptySlot?.venueShortName + '-' + notEmptySlot?.venueCourtNumber}</div>
            `;
        }
    }

    dayLineDragEnd = (e) => {
        const targetCourtId = +e.currentTarget.id.split(':')[0];
        const stateVenueId = this.state.dragDayTarget?.id.split(':')[0];

        const tooltip = document.getElementById('draggableTooltip');
        tooltip.setAttribute(
            "style",
            "display: none"
        );

        if (targetCourtId && stateVenueId) {
            const refTimeFormatted = this.dragTimeRef.current.format('YYYY-MM-DD HH:mm');
            const startTimeNew = moment(refTimeFormatted);

            if (startTimeNew.isBefore(this.state.dragDayTimeRestrictions.startTime)) {
                return
            }

            const newTimeFormatted = startTimeNew.format('HH:mm');
            const newTimeWithDateFormatted = startTimeNew.format('YYYY-MM-DD HH:mm');

            const draggableEvent = this.state.draggableEventObject;

            const endTimeNew = this.dragTimeEndRef.current;

            if (endTimeNew.isAfter(this.state.dragDayTimeRestrictions.endTime)) {
                return;
            }

            if (draggableEvent.matchDate === newTimeWithDateFormatted && targetCourtId.toString() === stateVenueId) {
                return;
            }

            const endTimeFormatted = endTimeNew.format('HH:mm');

            const notEmptyTargetDayCourtSlots = this.state.courtDataSlotsTarget.filter(slot =>
                slot.matchDate.slice(0, -5) === newTimeWithDateFormatted.slice(0, -5)
                && slot.drawsId
            );

            const isCourtDataSlotBusy = notEmptyTargetDayCourtSlots
                .some((slot, slotIndex) => {
                    const slotStart = moment(slot.matchDate);
                    const slotEnd = moment(slot.matchDate.slice(0, -5) + slot.endTime);

                    const isStartTimeCondition = startTimeNew.isBefore(slotEnd) && startTimeNew.isAfter(slotStart);
                    const isEndTimeCondition = endTimeNew.isAfter(slotStart) && endTimeNew.isBefore(slotEnd);

                    const isEventOverItself = slot.drawsId === draggableEvent.drawsId
                        && (
                            isStartTimeCondition
                            ||
                            isEndTimeCondition
                        );

                    if (isEventOverItself) {
                        const nextEvent = notEmptyTargetDayCourtSlots[slotIndex + 1];
                        const prevEvent = notEmptyTargetDayCourtSlots[slotIndex - 1];

                        const prevEventEnd = prevEvent && moment(slot.matchDate.slice(0, -5) + prevEvent?.endTime);
                        const nextEventStart = nextEvent && moment(nextEvent?.matchDate);

                        const isPrevEventEndBeforeSlotStart = prevEventEnd && prevEventEnd.isAfter(startTimeNew);
                        const isPrevEventStartAfterSlotEnd = nextEventStart && nextEventStart.isBefore(endTimeNew);

                        if (isPrevEventEndBeforeSlotStart || isPrevEventStartAfterSlotEnd) {
                            return true;
                        }

                        return false;
                    }

                    if (isStartTimeCondition) {
                        return true;
                    }

                    else if (isEndTimeCondition) {
                        return true;
                    }
                });

            if (isCourtDataSlotBusy) {
                return;
            }

            let roundId = getDraws_round();
            let yearId = getOwnCompetitionYear();
            let storedCompetitionId = getOwn_competition();

            const apiData = {
                yearRefId: yearId,
                competitionId: storedCompetitionId,
                venueId: 0,
                roundId: roundId,
                orgId: null,
                startDate: this.state.firstTimeCompId == "-1" || this.state.filterDates ? this.state.startDate : null,
                endDate: this.state.firstTimeCompId == "-1" || this.state.filterDates ? this.state.endDate : null
            }

            const postData = {
                drawsId: draggableEvent.drawsId,
                venueCourtId: stateVenueId,
                matchDate: newTimeWithDateFormatted,
                startTime: newTimeFormatted,
                endTime: endTimeFormatted,
            };

            // console.log('draggableEvent.drawsId', draggableEvent.drawsId)

            this.props.updateCourtTimingsDrawsAction(
                postData,
                null,
                null,
                null,
                roundId,
                apiData,
                this.state.filterDates
            );
        }
    }

    slotObjectMouseDown = (e, draggableEventObject)=> {
        this.setState({ draggableEventObject });

        if (draggableEventObject) {
            const bounds = e.currentTarget.getBoundingClientRect();
            const draggableElMouseX = e.pageX - bounds.left;
            const draggableElMouseY = e.pageY - bounds.top;

            this.setState({
                draggableElMouse: {
                    draggableElMouseX,
                    draggableElMouseY
                }
            });
        }
    }

    checkUnavailableTime = (workingSchedule, startDayTime, endDayTime, date) => {
        const startTime = workingSchedule && workingSchedule.startTime;
        const endTime = workingSchedule && workingSchedule.endTime;

        const newStartTime = startTime && startTime !== startDayTime
            ? moment(date + startTime)
            : moment(date + startDayTime);

        const newEndTime = endTime && endTime !== endDayTime
            ? moment(date + endTime)
            : moment(date + endDayTime);

        return {
            startTime: newStartTime,
            endTime: newEndTime,
        };
    }

    checkUnavailableTimeWidth = (timeRestrictionsSchedule, startDayDate, endDayDate) => {
        const startTimeFormat = timeRestrictionsSchedule && timeRestrictionsSchedule.startTime.format('HH:mm');;
        const endTimeFormat = timeRestrictionsSchedule && timeRestrictionsSchedule.endTime.format('HH:mm');;

        const startDayDateFormat = startDayDate.format('HH:mm');;
        const endDayDateFormat = endDayDate.format('HH:mm');;

        const unavailableStartWidth = startTimeFormat && startTimeFormat !== startDayDateFormat
            ? timeRestrictionsSchedule.startTime.diff(startDayDate, 'minutes') * ONE_MIN_WIDTH
            : null;

        const unavailableEndWidth = endTimeFormat && endTimeFormat !== endDayDateFormat
            ? endDayDate.diff(timeRestrictionsSchedule.endTime, 'minutes') * ONE_MIN_WIDTH
            : null;

        return [unavailableStartWidth, unavailableEndWidth];
    }

    headerView = () => {
        return (
            <div className="comp-draw-content-view" style={{ marginTop: 15 }}>
                <div className="multi-draw-list-top-head row">
                    <div className="col-sm-2 mt-3">
                        <span className="form-heading">{AppConstants.draws}</span>
                    </div>
                    <div className="col-sm-10 row pr-0">
                        <div className="col-sm mt-2">
                            <Select
                                className="year-select reg-filter-select1"
                                style={{ maxWidth: 100, minWidth: 100 }}
                                onChange={(yearRefId) => this.onYearChange(yearRefId)}
                                value={JSON.parse(this.state.yearRefId)}
                            >
                                {this.props.appState.own_YearArr.map((item) => (
                                    <Option key={'year_' + item.id} value={item.id}>
                                        {item.description}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="col-sm-2.5 mt-2">
                            <Select
                                className="year-select reg-filter-select1 innerSelect-value-draws"
                                style={{ minWidth: 210, maxWidth: 210 }}
                                onChange={(competitionId, e) =>
                                    this.onCompetitionChange(competitionId, e.key)
                                }
                                value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                            >
                                {this.props.appState.own_CompetitionArr.length > 0 && (
                                    <Option key="-1" value="-1">{AppConstants.all}</Option>
                                )}
                                {this.props.appState.own_CompetitionArr.map((item) => (
                                    <Option
                                        key={'competition_' + item.competitionId}
                                        value={item.competitionId}
                                    >
                                        {item.competitionName}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="col-sm mt-2">
                            <Select
                                className="year-select reg-filter-select1"
                                style={{ maxWidth: 150, minWidth: 150 }}
                                disabled={this.state.firstTimeCompId == "-1" || this.state.filterDates}
                                onChange={(roundId) => this.onRoundsChange(roundId)}
                                value={this.state.roundId}
                            >
                                {this.props.drawsState.getDrawsRoundsData.map((item) => (
                                    <Option key={'round_' + item.roundId} value={item.roundId}>
                                        {item.name}
                                    </Option>
                                ))}
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
                                }}
                            >
                                <RangePicker
                                    disabled={this.state.firstTimeCompId == "-1" || this.state.filterDates ? false : true}
                                    onChange={(date) => this.onChangeStartDate(moment(date[0]).format("YYYY-MM-DD"), moment(date[1]).format("YYYY-MM-DD"))}
                                    format="DD-MM-YYYY"
                                    style={{ width: '100%', minWidth: 180 }}
                                    value={[moment(this.state.startDate), moment(this.state.endDate)]}
                                />
                            </div>
                        </div>

                        <div className='col-sm-2 mt-2' style={{ minWidth: 160 }}>
                            <Checkbox
                                className="single-checkbox-radio-style"
                                style={{ paddingTop: 8 }}
                                checked={this.state.filterDates}
                                onChange={(e) => this.onDateRangeCheck(e.target.checked)}
                                disabled={this.state.firstTimeCompId == "-1"}
                            >
                                {AppConstants.filterDates}
                            </Checkbox>
                        </div>
                        <div className="col-sm d-flex justify-content-end align-items-center pr-1">
                            <Button className="primary-add-comp-form" type="primary" onClick={() => this.applyDateFilter()}>
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

        const mainCheckboxValue = this.allFilterValue(competitionVenues);

        return (
            <>
                <div className="row d-flex align-items-center">
                    <div className="col-sm d-flex justify-content-start">
                        <span className="user-contact-heading">{AppConstants.venue}</span>
                    </div>
                    <div className="col-sm d-flex justify-content-end" style={{ marginTop: 5 }}>
                        <a
                            className="view-more-btn"
                            data-toggle="collapse"
                            href="#venue-collapsable-div"
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
                        checked={mainCheckboxValue}
                        onChange={e => this.changeAllVenueStatus(e.target.checked, "venue")}
                    >
                        {AppConstants.all}
                    </Checkbox>
                    {isArrayNotEmpty(competitionVenues) && competitionVenues.map((item, index) => {
                        return (
                            index < this.checkDisplayCountList(competitionVenues, showAllVenue) && <div key={"competitionVenue_" + item.id} className="column pl-5">
                                <Checkbox
                                    className="single-checkbox-radio-style"
                                    style={{ paddingTop: 8 }}
                                    checked={item.checked}
                                    onChange={e => this.props.checkBoxOnChange(e.target.checked, "competitionVenues", index)}
                                >
                                    {item.name}
                                </Checkbox>
                            </div>
                        )
                    })}
                    {(isArrayNotEmpty(competitionVenues) || competitionVenues.length > 5) && (
                        <span
                            className="input-heading-add-another pt-4"
                            onClick={() => this.changeShowAllStatus("venue")}
                        >
                            {showAllVenue ? AppConstants.hide : AppConstants.showAll}
                        </span>
                    )}
                </div>
            </>
        )
    }

    ///////left side view for competition liting with checkbox
    competitionLeftView = () => {
        let { own_CompetitionArr } = this.props.appState
        let { drawsCompetitionArray } = this.props.drawsState
        let { showAllComp } = this.state

        const mainCheckboxValue = this.allFilterValue(drawsCompetitionArray);

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
                            href="#comp-collapsable-div"
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
                        checked={mainCheckboxValue}
                        onChange={e => this.changeAllVenueStatus(e.target.checked, "competition")}
                    >
                        {AppConstants.all}
                    </Checkbox>
                    <div className={showAllComp ? "multi-draw-left-list-view" : ""}>
                        {isArrayNotEmpty(drawsCompetitionArray) && drawsCompetitionArray.map((item, index) => {
                            return (
                                index < this.checkDisplayCountList(own_CompetitionArr, showAllComp) && <div className="column pl-5">
                                    <Checkbox
                                        className="single-checkbox-radio-style"
                                        style={{ paddingTop: 8 }}
                                        checked={item.checked}
                                        onChange={e => this.props.checkBoxOnChange(e.target.checked, "competition", index)}
                                    >
                                        {item.competitionName}
                                    </Checkbox>
                                </div>
                            )
                        })}
                    </div>
                    {(isArrayNotEmpty(drawsCompetitionArray) || drawsCompetitionArray.length > 5) && (
                        <span
                            className="input-heading-add-another pt-4"
                            onClick={() => this.changeShowAllStatus("comp")}
                        >
                            {showAllComp ? AppConstants.hide : AppConstants.showAll}
                        </span>
                    )}
                </div>

            </>
        )
    }

    //navigateToDrawEdit
    navigateToDrawEdit = () => {
        if (this.state.firstTimeCompId == "-1" || this.state.filterDates) {
            this.props.clearMultiDraws('rounds');
            history.push("/competitionDrawEdit")
        } else {
            history.push("/competitionDrawEdit")
        }
    }

    ///////left side view for division liting with checkbox
    divisionLeftView = () => {
        let { divisionGradeNameList, drawDivisions } = this.props.drawsState
        let { showAllDivision } = this.state

        const mainCheckboxValue = this.allFilterValue(divisionGradeNameList);

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
                        >
                            <i className="fa fa-angle-up" style={{ color: "#ff8237", }} aria-hidden="true" />
                        </a>
                    </div>
                </div>
                {this.state.firstTimeCompId == "-1" || this.state.filterDates ? (
                    <div id="division-collapsable-div" className="pt-0 collapse in">
                        <Checkbox
                            className="single-checkbox-radio-style"
                            style={{ paddingTop: 8 }}
                            checked={this.state.allDivisionChecked}
                            onChange={e => this.changeAllVenueStatus(e.target.checked, "allDivisionChecked")}
                        >
                            {AppConstants.all}
                        </Checkbox>
                        {isArrayNotEmpty(drawDivisions) && drawDivisions.map((item, index) => (
                            <div className="column pl-5">
                                <div style={{ paddingTop: 10, paddingBottom: 10 }}>
                                    <span className="inbox-time-text">{item.competitionName}</span>
                                </div>
                                {isArrayNotEmpty(item.legendArray) && item.legendArray.map((subItem, subIndex) => (
                                    <div>
                                        <Checkbox
                                            className={`single-checkbox-radio-style ${getColor(subItem.colorCode)}`}
                                            style={{ paddingTop: 8 }}
                                            checked={subItem.checked}
                                            onChange={e => this.props.checkBoxOnChange(e.target.checked, "division", index, subIndex)}
                                        >
                                            {subItem.divisionName + "-" + subItem.gradeName}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {(isArrayNotEmpty(drawDivisions) || drawDivisions.length > 5) && (
                            <span
                                className="input-heading-add-another pt-4"
                                onClick={() => this.changeShowAllStatus("division")}
                            >
                                {showAllDivision ? AppConstants.hide : AppConstants.showAll}
                            </span>
                        )}
                    </div>
                ) : (
                    <div id="division-collapsable-div" className="pt-0 collapse in">
                        <Checkbox
                            className="single-checkbox-radio-style"
                            style={{ paddingTop: 8 }}
                            checked={mainCheckboxValue}
                            onChange={e => this.changeAllVenueStatus(e.target.checked, "singleCompDivisionCheked")}
                        >
                            {AppConstants.all}
                        </Checkbox>
                        {isArrayNotEmpty(divisionGradeNameList) && divisionGradeNameList.map((item, index) => {
                            return (
                                index < this.checkDisplayCountList(divisionGradeNameList, showAllDivision) && <div key={"divisionGrade_" + item.competitionDivisionGradeId} className="column pl-5">
                                    <Checkbox
                                        className={`single-checkbox-radio-style ${getColor(item.colorCode)}`}
                                        style={{ paddingTop: 8 }}
                                        checked={item.checked}
                                        onChange={e => this.props.checkBoxOnChange(e.target.checked, "singleCompeDivision", index)}
                                    >
                                        {item.name}
                                    </Checkbox>
                                </div>
                            )
                        })}

                        {(isArrayNotEmpty(divisionGradeNameList) || divisionGradeNameList.length > 5) && (
                            <span
                                className="input-heading-add-another pt-4"
                                onClick={() => this.changeShowAllStatus("division")}
                            >
                                {showAllDivision ? AppConstants.hide : AppConstants.showAll}
                            </span>
                        )}
                    </div>
                )}
            </>
        )
    }

    ///////left side view for organisation listing with checkbox
    organisationLeftView = () => {
        let { drawOrganisations } = this.props.drawsState
        let { showAllOrg, allOrgChecked } = this.state

        const mainCheckboxValue = this.allFilterValue(drawOrganisations);

        return (
            <>
                <div className="row">
                    <div className="col-sm d-flex justify-content-start">
                        <span className="user-contact-heading">{AppConstants.organisation}</span>
                    </div>
                    <div className="col-sm d-flex justify-content-end" style={{ marginTop: 5 }}>
                        <a
                            className="view-more-btn"
                            data-toggle="collapse"
                            href={`#org-collapsable-div`}
                            role="button"
                            aria-expanded="true"
                        >
                            <i className="fa fa-angle-up" style={{ color: "#ff8237", }} aria-hidden="true" />
                        </a>
                    </div>
                </div>
                <div id="org-collapsable-div" className="pt-3 collapse in">
                    <Checkbox
                        className="single-checkbox-radio-style"
                        style={{ paddingTop: 8 }}
                        checked={mainCheckboxValue}
                        onChange={e => this.changeAllVenueStatus(e.target.checked, "org")}
                    >
                        {AppConstants.all}
                    </Checkbox>
                    <div className={showAllOrg ? "multi-draw-left-list-view" : ""}>
                        {isArrayNotEmpty(drawOrganisations) && drawOrganisations.map((item, index) => {
                            return (
                                index < this.checkDisplayCountList(drawOrganisations, showAllOrg) && <div className="column pl-5">
                                    <Checkbox
                                        className="single-checkbox-radio-style"
                                        style={{ paddingTop: 8 }}
                                        checked={item.checked}
                                        onChange={e => this.props.checkBoxOnChange(e.target.checked, "organisation", index)}
                                    >
                                        {item.organisationName}
                                    </Checkbox>
                                </div>
                            )
                        })}
                    </div>
                    {(isArrayNotEmpty(drawOrganisations) || drawOrganisations.length > 5) && (
                        <span
                            className="input-heading-add-another pt-4"
                            onClick={() => this.changeShowAllStatus("org")}
                        >
                            {showAllOrg ? AppConstants.hide : AppConstants.showAll}
                        </span>
                    )}
                </div>
            </>
        )
    }

    //unlockDraws
    unlockDraws(id, round_Id, venueCourtId) {
        let key = this.state.firstTimeCompId == "-1" || this.state.filterDates ? 'all' : "singleCompetition"
        this.props.unlockDrawsAction(id, round_Id, venueCourtId, key);
    }

    sideMenuView = () => {
        let { filterEnable } = this.state
        return (
            <div
                className="multiDrawContentView multi-draw-list-top-head pr-0"
                style={{ display: !filterEnable && "flex", justifyContent: !filterEnable && 'center', paddingLeft: !filterEnable && 1 }}
            >
                {filterEnable ? (
                    <div
                        className="d-flex align-items-center mt-4"
                        onClick={() => this.filterOnClick()}
                        style={{ cursor: "pointer" }}
                    >
                        <img className="dot-image" src={AppImages.filterIcon} alt="" width="20" height="20" style={{ marginBottom: 7 }} />
                        <span className="input-heading-add-another pt-0 pl-3">{filterEnable ? AppConstants.hideFilter : AppConstants.showFilter}</span>
                    </div>
                ) : (
                    <div
                        className="d-flex align-items-center mt-1"
                        onClick={() => this.filterOnClick()}
                        style={{ cursor: "pointer" }}
                    >
                        <img className="dot-image" src={AppImages.filterIcon} alt="" width="28" height="28" />
                    </div>
                )}
                {filterEnable && this.venueLeftView()}
                {this.state.firstTimeCompId !== "-1" || !this.state.filterDates || filterEnable && this.competitionLeftView()}
                {filterEnable && this.divisionLeftView()}
                {filterEnable && this.organisationLeftView()}
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
                        </div>
                    </div>
                    <div className="col-sm-6 pr-0 d-flex justify-content-end align-items-center">
                        <div onClick={() => this.onMatchesList()}>
                            <img className="dot-image" src={AppImages.downloadIcon} alt="" width="16" height="16" />
                            <span className="input-heading-add-another pt-0 pr-5 pl-3">{AppConstants.matchesList}</span>
                        </div>
                        <Button className="multi-field-draw-edit-button" type="primary" onClick={() => this.navigateToDrawEdit()}>
                            {AppConstants.edit}
                        </Button>
                    </div>
                </div>
                <div>
                    {this.props.drawsState.spinLoad && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                height: 100,
                                alignItems: 'center',
                            }}
                        >
                            <Spin size='default' spinning={this.props.drawsState.spinLoad} />
                        </div>
                    )}
                    {this.props.drawsState.getRoundsDrawsdata.length <= 0 && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                height: 100,
                                alignItems: 'center',
                            }}
                        />
                    )}
                    {this.props.drawsState.updateLoad ? (
                        <div className="draggable-wrap draw-data-table">
                            <Loader visible={this.props.drawsState.updateLoad} />

                            {this.props.drawsState.getRoundsDrawsdata.map((dateItem, dateIndex) => (
                                <div className="pt-4 pb-4" key={"drawData" + dateIndex}>
                                    {this.state.firstTimeCompId != "-1" && (
                                        <div className="draws-round-view">
                                            <span className="draws-round">
                                                {dateItem.roundName}
                                            </span>
                                        </div>
                                    )}
                                    <div key={"drawData" + dateIndex}>
                                        {this.draggableView(dateItem)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="draggable-wrap draw-data-table">
                            <Loader visible={this.props.drawsState.updateLoad} />

                            {this.props.drawsState.getRoundsDrawsdata.map((dateItem, dateIndex) => (
                                <div className="pt-4 pb-4" key={"drawData" + dateIndex}>
                                    {this.state.firstTimeCompId != "-1" && (
                                        <div className="draws-round-view">
                                                <span className="draws-round">
                                                    {dateItem.roundName}
                                                </span>
                                            </div>
                                        )}
                                        {this.draggableView(dateItem)}
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </div>
        );
    }

    checkDate(date, index, dateArray) {
        if (index == 0) {
            return moment(date).format('DD MMM, ddd')
        } else {
            if (moment(dateArray[index].date).format('DD-MM-YYYY') == moment(dateArray[(index - 1)].date).format('DD-MM-YYYY')) {
                return moment(date).format('ddd')
            }
            else {
                return moment(date).format('DD MMM, ddd')
            }
        }
    }

    draggableView = (dateItem) => {
        let disabledStatus = this.state.competitionStatus == 1
        var dateMargin = 25;
        var dayMargin = 25;
        let topMargin = 2;
        let legendsData = isArrayNotEmpty(this.props.drawsState.legendsArray)
            ? this.props.drawsState.legendsArray
            : [];
        let date = [];
        const venueData = this.props.drawsState.competitionVenues;

        dateItem.dateNewArray.map(item => {
            const dateNew = item.date.slice(0, -5);

            if (dateNew !== date[date.length - 1]) {
                date.push(dateNew);
            }
        })

        return (
            <>
                <div
                    className="scroll-bar pb-4"
                    // style={{
                    //     width: dateItem.dateNewArray.length > 0 && dateItem.dateNewArray.length * 140,
                    //     minWidth: 1080
                    // }}
                >
                    <div className="table-head-wrap">
                        {/* Day name list */}
                        <div className="tablehead-row" style={{ marginLeft: 34 }}>
                            <div className="sr-no empty-bx" />
                            {date.map((itemDate, index) => {
                                // for drawing days position
                                const schedule = this.getWeeklySchedule();
                                const itemDateDayOfWeek = moment(itemDate).format('dddd').toLowerCase();

                                const findSchedule = schedule.find(scheduleDay => scheduleDay.day.toLowerCase() === itemDateDayOfWeek);

                                const startDayTime = findSchedule.timeslot.startTime;
                                const endDayTime = findSchedule.timeslot.endTime;

                                const timeAllDayScheduleHours = [startDayTime];

                                while (timeAllDayScheduleHours[timeAllDayScheduleHours.length - 1] !== endDayTime) {
                                    const newTime = moment(itemDate + timeAllDayScheduleHours[timeAllDayScheduleHours.length - 1]).add(ONE_HOUR_IN_MIN, 'minutes').format('HH:mm');
                                    timeAllDayScheduleHours.push(newTime)
                                }
                                const newTimeAllDayScheduleHours = [...timeAllDayScheduleHours];
                                newTimeAllDayScheduleHours.pop();

                                return newTimeAllDayScheduleHours.map((itemTime, indexTime) => {
                                    if (index !== 0 || indexTime !== 0) {
                                        dayMargin += ONE_HOUR_IN_MIN * ONE_MIN_WIDTH;
                                    }
                                    if (index === 0 && indexTime === 0) {
                                        dayMargin = 0;
                                    }

                                    return (
                                        <span
                                            key={"time" + index + indexTime}
                                            style={{
                                                left: dayMargin,
                                                fontSize: 11,
                                                minWidth: ONE_HOUR_IN_MIN * ONE_MIN_WIDTH,
                                            }}
                                        >
                                            {!indexTime ? moment(itemDate + itemTime).format('DD MMM, ddd') : moment(itemDate + itemTime).format('ddd')}
                                        </span>
                                    )

                                })
                            })}
                        </div>

                        {/* Times list */}
                        <div className="tablehead-row" style={{ marginLeft: 34 }}>
                            <div className="sr-no empty-bx" />
                            {date.map((itemDate, index) => {
                                // for drawing time position
                                const schedule = this.getWeeklySchedule();
                                const itemDateDayOfWeek = moment(itemDate).format('dddd').toLowerCase();

                                const findSchedule = schedule.find(scheduleDay => scheduleDay.day.toLowerCase() === itemDateDayOfWeek);

                                const startDayTime = findSchedule.timeslot.startTime;
                                const endDayTime = findSchedule.timeslot.endTime;

                                const timeAllDayScheduleHours = [startDayTime];

                                while (timeAllDayScheduleHours[timeAllDayScheduleHours.length - 1] !== endDayTime) {
                                    const newTime = moment(itemDate + timeAllDayScheduleHours[timeAllDayScheduleHours.length - 1]).add(ONE_HOUR_IN_MIN, 'minutes').format('HH:mm');
                                    timeAllDayScheduleHours.push(newTime)
                                }
                                const newTimeAllDayScheduleHours = [...timeAllDayScheduleHours];
                                newTimeAllDayScheduleHours.pop();

                                const diffHeaderTime = moment(itemDate + timeAllDayScheduleHours[1]).diff(moment(itemDate + timeAllDayScheduleHours[0]), 'minutes') * ONE_MIN_WIDTH;

                                return newTimeAllDayScheduleHours.map((itemTimeMock, indexTimeMock) => {
                                    if (index !== 0 || indexTimeMock !== 0) {
                                        dayMargin += diffHeaderTime;
                                    }
                                    if (index === 0 && indexTimeMock === 0) {
                                        dayMargin = 45;
                                    }

                                    return (
                                        <span
                                            key={"time" + index + indexTimeMock}
                                            style={{
                                                left: dayMargin,
                                                fontSize: 11,
                                                minWidth: 'unset',
                                            }}
                                        >
                                            {itemTimeMock.slice(-5)}
                                        </span>
                                    )

                                })
                            })}
                        </div>
                    </div>
                </div>
                <div
                    className="main-canvas Draws"
                    id="draws-field"
                    onDragOver={e => this.drawsFieldDragMove(e)}
                    onDragLeave={() => this.addNoneDisplayTooltip()}
                >
                    <div
                        id="draggableTooltip"
                        className="unavailable-draws"
                        style={{
                            display: 'none'
                        }}
                    />
                    {dateItem.draws && dateItem.draws.map((courtData, index) => {
                        if (index !== 0) {
                            topMargin += 70;
                        }

                        let prevDaysWidth = 0;
                        let diffDayScheduleTime = 0;

                        return (
                            <div key={"court" + index}>
                                <div className="sr-no" style={{ height: 62, boxSizing: 'border-box' }}>
                                    <div
   className="venueCourt-tex-div"
                                        style={{
                                            // position: 'fixed',
                                            zIndex: 99,
                                            background: 'white',
                                            width: 95,
                                            marginLeft: -20,
                                            textAlign: 'center',
                                            height: 53,
                                        }}
                                    >
                                        <span className="venueCourt-text">
                                            {courtData.venueShortName + '-' + courtData.venueCourtNumber}
                                        </span>
                                    </div>
                                </div>
                                {date.map((fieldItemDate, fieldItemDateIndex) => {
                                    // for check the schedule of the day
                                    const schedule = this.getWeeklySchedule();
                                    const itemDateDayOfWeek = moment(fieldItemDate).format('dddd').toLowerCase();

                                    const findSchedule = schedule.find(scheduleDay => scheduleDay.day.toLowerCase() === itemDateDayOfWeek);

                                    const startDayTime = findSchedule.timeslot.startTime;
                                    const endDayTime = findSchedule.timeslot.endTime;

                                    const timeAllDayScheduleHours = [startDayTime];

                                    while (timeAllDayScheduleHours[timeAllDayScheduleHours.length - 1] !== endDayTime) {
                                        const newTime = moment(fieldItemDate + timeAllDayScheduleHours[timeAllDayScheduleHours.length - 1]).add(ONE_HOUR_IN_MIN, 'minutes').format('HH:mm');
                                        timeAllDayScheduleHours.push(newTime)
                                    }

                                    if (fieldItemDateIndex !== 0 ) {
                                        prevDaysWidth += diffDayScheduleTime;
                                    }
                                    if (fieldItemDateIndex === 0) {
                                        prevDaysWidth = 75;
                                    }

                                    const startDayDate = moment(fieldItemDate + startDayTime);
                                    const endDayDate = moment(fieldItemDate + endDayTime);

                                    diffDayScheduleTime = endDayDate.diff(startDayDate, 'minutes') * ONE_MIN_WIDTH;

                                    // check unavailable time during the day

                                    const courtVenueId = courtData.slotsArray.find(slot => slot.venueId).venueId;
                                    const courtId = courtData.venueCourtId;

                                    let venueDaySchedule;
                                    let workingDayInTimeline;
                                    let courtDaySchedule;

                                    // TODO this.props.drawsState.competitionVenues could be an object with different properties, necessary to fix !!

                                    if (venueData[0]?.availableTimeslots) {
                                        venueData.forEach(venue => {
                                            const daySchedule = venue.availableTimeslots.find(venueDay =>
                                                venueDay?.venueId && venueDay.venueId === courtVenueId && venueDay.day === findSchedule.day);

                                            if (daySchedule) {
                                                venueDaySchedule = daySchedule.timeslot;
                                            }
                                        });

                                        const venueDataSlotForCheck = venueData.find(venue => venue.id === courtVenueId);

                                        // check unavailable days of week for court based on venue schedule

                                        const workingDaysOfVenue = venueDataSlotForCheck.availableTimeslots.filter(venueDay => courtVenueId === venueDay.venueId)
                                        workingDayInTimeline = workingDaysOfVenue.find(workingDayVenue => workingDayVenue.day.toLowerCase() === itemDateDayOfWeek);

                                        // check unavailable time during the working day for court based on court schedule

                                        const courtWeekSchedule = venueDataSlotForCheck.courts.find(court => court.courtId === courtId)?.availableTimeslots;
                                        if (courtWeekSchedule) {
                                            courtDaySchedule = courtWeekSchedule.find(court => court.day === itemDateDayOfWeek)?.timeslot;
                                        }
                                    }

                                    const venueSchedule = this.checkUnavailableTime(venueDaySchedule, startDayTime, endDayTime, fieldItemDate);
                                    const courtSchedule = this.checkUnavailableTime(courtDaySchedule, startDayTime, endDayTime, fieldItemDate);

                                    // unavailable time during the whole day
                                    const timeRestrictionsSchedule = {
                                        startTime: venueSchedule.startTime.isAfter(courtSchedule.startTime) ? venueSchedule.startTime : courtSchedule.startTime,
                                        endTime: venueSchedule.endTime.isBefore(courtSchedule.endTime) ? venueSchedule.endTime : courtSchedule.endTime
                                    }

                                    const unavailableWidth = this.checkUnavailableTimeWidth(timeRestrictionsSchedule, startDayDate, endDayDate)

                                    // render for the whole unavailable day for court based on venue schedule
                                    if (!workingDayInTimeline) {
                                        return (
                                            <div key={"slot" + fieldItemDateIndex}>
                                                <div
                                                    id={courtData.venueCourtId}
                                                    className={'box unavailable-draws'}
                                                    style={{
                                                        left: prevDaysWidth,
                                                        top: topMargin,
                                                        width: diffDayScheduleTime,
                                                        alignItems: 'center',
                                                        cursor: 'not-allowed',
                                                        background: `repeating-linear-gradient( -45deg, #ebf0f3, #ebf0f3 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5 * ONE_MIN_WIDTH}px )`,
                                                    }}
                                                    onDragOver={() => {
                                                        if (this.state.dragDayTarget) {
                                                            this.setState({ dragDayTarget: null})
                                                        }
                                                    }}
                                                >
                                                    {AppConstants.unavailable}
                                                </div>
                                            </div>
                                        )
                                    }

                                    return (
                                        <div key={"slot" + fieldItemDateIndex}>
                                            {/* <span
                                                style={{ left: leftMargin, top: topMargin }}
                                                className={'border'}
                                            /> */}
                                            <div
                                                id={courtData.venueCourtId + ':' + fieldItemDateIndex}
                                                className={'box purple-bg day-box'}
                                                style={{
                                                    minWidth: 'unset',
                                                    left: prevDaysWidth,
                                                    top: topMargin,
                                                    overflow: 'visible',
                                                    whiteSpace: 'nowrap',
                                                    cursor: disabledStatus && "no-drop",
                                                    width: diffDayScheduleTime,
                                                    background: `repeating-linear-gradient( to right, #f5f5f5, #f5f5f5 ${ONE_HOUR_IN_MIN}px, #d9d9d9 ${ONE_HOUR_IN_MIN}px, #d9d9d9 ${ONE_HOUR_IN_MIN * ONE_MIN_WIDTH}px )`
                                                }}
                                                onDragOver={e => this.dayLineDragMove(e, startDayDate, courtData.slotsArray, timeRestrictionsSchedule)}
                                                onDragEnd={e => this.dayLineDragEnd(e)}
                                            >
                                                {unavailableWidth.map((width, widthIndex) => {
                                                    if (width) {
                                                        return (
                                                            <div
                                                                className={'box unavailable-draws'}
                                                                style={{
                                                                    position: 'absolute',
                                                                    right: widthIndex ? 0 : 'auto',
                                                                    left: widthIndex ? 'auto' : 0,
                                                                    top: 0,
                                                                    alignItems: 'center',
                                                                    width: width,
                                                                    height: '100%',
                                                                    background: `repeating-linear-gradient( -45deg, #ebf0f3, #ebf0f3 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5 * ONE_MIN_WIDTH}px )`,
                                                                }}
                                                            >
                                                                {AppConstants.unavailable}
                                                            </div>
                                                        )
}
                                                })}
                                                {courtData.slotsArray.map((slotObject, slotIndex) => {
                                                    if (slotObject.matchDate.slice(0, -5) === fieldItemDate && slotObject.drawsId) {
                                                        // for left margin the event start inside the day
                                                        const startWorkingDayTime = moment(fieldItemDate + startDayTime);
                                                        const startTimeEvent = moment(slotObject.matchDate);

                                                        const diffTimeStartEvent = startTimeEvent.diff(startWorkingDayTime, 'minutes') * ONE_MIN_WIDTH;

                                                        // for width of the event
                                                        const endTimeEvent = moment(fieldItemDate + slotObject.endTime);
                                                        const diffTimeEventDuration = endTimeEvent.diff(startTimeEvent, 'minutes')* ONE_MIN_WIDTH;
                                                        return (
                                                            <div key={"slot" + slotIndex}>
                                                                {/* <span
                                                                    style={{ left: diffTimeStartEvent, top: topMargin }}
                                                                    className={'border'}
                                                                /> */}
                                                                <div
                                                                    id={slotObject.drawsId}
                                                                    onMouseDown={e => this.slotObjectMouseDown(e, slotObject)}
                                                                    onDragOver={() => {
                                                                        if (
                                                                            slotObject.matchDate !== this.state.tooltipSwappableTime
                                                                            && slotObject !== this.state.draggableEventObject
                                                                        )
                                                                        this.setState({ tooltipSwappableTime: slotObject.matchDate })
                                                                    }}
                                                                    onDragLeave={() => {
                                                                        this.setState({ tooltipSwappableTime: null })
                                                                    }}
                                                                    className={'box purple-bg'}
                                                                    style={{
                                                                        backgroundColor: this.checkColor(slotObject),
                                                                        left: diffTimeStartEvent,
                                                                        overflow: 'hidden',
                                                                        whiteSpace: 'nowrap',
                                                                        cursor: disabledStatus && "no-drop",
                                                                        width: diffTimeEventDuration,
                                                                        minWidth: diffTimeEventDuration,
                                                                        height: 48,
                                                                    }}
                                                                >
                                                                    {this.state.firstTimeCompId == "-1" || this.state.filterDates ? (
                                                                        <Swappable
                                                                            id={
                                                                                index.toString() +
                                                                                ':' +
                                                                                slotIndex.toString()
                                                                                +
                                                                                ':' +
                                                                                "1"
                                                                            }
                                                                            content={1}
                                                                            swappable={this.checkSwap(slotObject)}
                                                                            onSwap={(source, target) =>
                                                                                this.onSwap(
                                                                                    source,
                                                                                    target,
                                                                                    dateItem.draws,
                                                                                    dateItem.roundId,
                                                                                )
                                                                            }
                                                                            isCurrentSwappable={(source, target) =>
                                                                                this.checkCurrentSwapObjects(
                                                                                    source,
                                                                                    target,
                                                                                    dateItem.draws,
                                                                                )
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {slotObject.homeTeamName} <br />
                                                                                {slotObject.awayTeamName}
                                                                            </span>
                                                                        </Swappable>
                                                                    ) : (
                                                                        <Swappable
                                                                            id={
                                                                                index.toString() +
                                                                                ':' +
                                                                                slotIndex.toString()
                                                                                +
                                                                                ':' +
                                                                                dateItem.roundId.toString()
                                                                            }
                                                                            content={1}
                                                                            swappable={this.checkSwap(slotObject)}
                                                                            onSwap={(source, target) =>
                                                                                this.onSwap(
                                                                                    source,
                                                                                    target,
                                                                                    dateItem.draws,
                                                                                    dateItem.roundId,
                                                                                )
                                                                            }
                                                                            isCurrentSwappable={(source, target) =>
                                                                                this.checkCurrentSwapObjects(
                                                                                    source,
                                                                                    target,
                                                                                    dateItem.draws,
                                                                                )
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {slotObject.homeTeamName} <br />
                                                                                {slotObject.awayTeamName}
                                                                            </span>
                                                                        </Swappable>
                                                                    )}
                                                                </div>

                                                                {slotObject.drawsId !== null && (
                                                                    <div
                                                                        className="box-exception"
                                                                        style={{
                                                                            left: diffTimeStartEvent,
                                                                            top: 50,
                                                                            overflow: 'hidden',
                                                                            whiteSpace: 'nowrap',
                                                                            minWidth: diffTimeEventDuration,
                                                                        }}
                                                                    >
                                                                        <Menu
                                                                            className="action-triple-dot-draws"
                                                                            theme="light"
                                                                            mode="horizontal"
                                                                            style={{ lineHeight: '16px', borderBottom: 0, cursor: disabledStatus && "no-drop" }}
                                                                        >
                                                                            <SubMenu
                                                                                disabled={disabledStatus}
                                                                                style={{
                                                                                    margin: 0,
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center'
                                                                                }}
                                                                                key="sub1"
                                                                                title={
                                                                                    (
                                                                                        <div>
                                                                                            <img
                                                                                                className="dot-image"
                                                                                                src={AppImages.moreTripleDot}
                                                                                                alt=""
                                                                                                width="16"
                                                                                                height="10"
                                                                                            />
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            >
                                                                                {slotObject.isLocked == 1 && (
                                                                                    <Menu.Item
                                                                                        key="1"
                                                                                        onClick={() => this.state.firstTimeCompId == "-1" || this.state.filterDates
                                                                                            ? this.unlockDraws(
                                                                                                slotObject.drawsId,
                                                                                                "1",
                                                                                                courtData.venueCourtId
                                                                                            )
                                                                                            : this.unlockDraws(
                                                                                                slotObject.drawsId,
                                                                                                dateItem.roundId,
                                                                                                courtData.venueCourtId
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <div style={{ display: 'flex' }}>
                                                                                            <span>Unlock</span>
                                                                                        </div>
                                                                                    </Menu.Item>
                                                                                )}
                                                                                <Menu.Item key="2">
                                                                                    <NavLink
                                                                                        to={{
                                                                                            pathname: `/competitionException`,
                                                                                            state: {
                                                                                                drawsObj: slotObject,
                                                                                                yearRefId: this.state.yearRefId,
                                                                                                competitionId: this.state.firstTimeCompId,
                                                                                                organisationId: this.state.organisationId,
                                                                                            },
                                                                                        }}
                                                                                    >
                                                                                        <span>Exception</span>
                                                                                    </NavLink>
                                                                                </Menu.Item>
                                                                            </SubMenu>
                                                                        </Menu>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    contentView = () => {
        return (
            <div className="row">
                <div className={this.state.filterEnable ? 'col-sm-3' : "col-sm-1"}>{this.sideMenuView()}</div>
                <div className={this.state.filterEnable ? 'col-sm-9' : "col-sm"}>{this.containerView()}</div>
            </div>
        )
    }

    handleRegenerateDrawException = (key) => {
        try {
            if (key === "ok") {
                this.callGenerateDraw(this.state.regenerateExceptionRefId);
                this.setState({ regenerateDrawExceptionModalVisible: false, regenerateExceptionRefId: 1 });
            } else {
                this.setState({ regenerateDrawExceptionModalVisible: false });
            }
        } catch (ex) {
            console.log("Error in handleRegenerateDrawException::" + ex);
        }
    }

    callGenerateDraw = (regenerateExceptionRefId) => {
        let payload = {
            yearRefId: this.state.yearRefId,
            competitionUniqueKey: this.state.firstTimeCompId,
            organisationId: getOrganisationData().organisationUniqueKey,
            roundId: this.state.generateRoundId
        };
        if (regenerateExceptionRefId) {
            payload["exceptionTypeRefId"] = regenerateExceptionRefId;
        }
        this.props.generateDrawAction(payload);
        this.setState({ venueLoad: true });
    }

    reGenerateDraw = () => {
        // let competitionStatus = getOwn_competitionStatus();
        // if (competitionStatus == 2) {
        //     this.props.getActiveRoundsAction(this.state.yearRefId, this.state.firstTimeCompId);
        //     this.setState({ roundLoad: true });
        // } else {
        this.setState({ regenerateDrawExceptionModalVisible: true });
        //this.callGenerateDraw();
        //}
    };

    check = () => {
        if (
            this.state.firstTimeCompId == null ||
            this.state.firstTimeCompId == ''
        ) {
            message.config({ duration: 0.9, maxCount: 1 });
            message.error(ValidationConstants.pleaseSelectCompetition);
        } else if (this.state.venueId == null && this.state.venueId == '') {
            message.config({ duration: 0.9, maxCount: 1 });
            message.error(ValidationConstants.pleaseSelectVenue);
        } else {
            this.setState({ visible: true })
            // this.props.publishDraws(this.state.firstTimeCompId);
        }
    };

    openModel = (props, e) => {
        let this_ = this;
        confirm({
            title: 'You have teams ‘Not in Draw’. Would you still like to proceed?',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            maskClosable: true,
            mask: true,
            onOk() {
                this_.check();
            },
            onCancel() {
                console.log('cancel');
            },
        });
    };

    regenerateDrawExceptionModal = () => {
        try {
            return (
                <Modal
                    className="add-membership-type-modal"
                    title="Draws Regeneration"
                    visible={this.state.regenerateDrawExceptionModalVisible}
                    onOk={() => this.handleRegenerateDrawException("ok")}
                    onCancel={() => this.handleRegenerateDrawException("cancel")}
                >
                    <div style={{ fontWeight: "600" }}>{AppConstants.wantYouRegenerateDraw}</div>
                    <Radio.Group
                        className="reg-competition-radio"
                        value={this.state.regenerateExceptionRefId}
                        onChange={(e) => this.setState({ regenerateExceptionRefId: e.target.value })}
                    >
                        <Radio style={{ fontSize: '14px' }} value={1}>{AppConstants.retainException}</Radio>
                        <Radio style={{ fontSize: '14px' }} value={2}>{AppConstants.removeException}</Radio>
                        <Radio style={{ fontSize: '14px' }} value={3}>{AppConstants.useRound1Template}</Radio>
                    </Radio.Group>
                </Modal>
            )
        } catch (ex) {
            console.log("Error in regenerateDrayExceptionModal::" + ex);
        }
    }

    handleGenerateDrawModal = (key) => {
        if (key === "ok") {
            if (this.state.generateRoundId != null) {
                this.callGenerateDraw();
                this.setState({ drawGenerateModalVisible: false });
            }
            else {
                message.error("Please select round");
            }
        }
        else {
            this.setState({ drawGenerateModalVisible: false });
        }
    }

    //////footer view containing all the buttons like publish and regenerate draws
    footerView = () => {
        let publishStatus = this.props.drawsState.publishStatus;
        let isTeamNotInDraws = this.props.drawsState.isTeamInDraw;
        let activeDrawsRoundsData = this.props.drawsState.activeDrawsRoundsData;
        let isPublish = this.state.competitionStatus == 1;
        let teamNames = this.props.drawsState.teamNames;
        return (
            <div className="fluid-width paddingBottom56px">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="reg-add-save-button" />
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            {/* <NavLink to="/competitionFormat"> */}
                            <Button
                                className="open-reg-button"
                                type="primary"
                                disabled={isPublish}
                                onClick={() => this.reGenerateDraw()}
                            >
                                {AppConstants.regenerateDraw}
                            </Button>
                            <div>
                                <Loader
                                    visible={this.props.competitionModuleState.drawGenerateLoad}
                                />
                            </div>
                            {/* </NavLink> */}
                        </div>
                    </div>
                    <div>
                        <div className="comp-buttons-view">
                            <Tooltip
                                style={{ height: '100%' }}
                                onMouseEnter={() =>
                                    this.setState({
                                        tooltipVisibleDelete: isPublish,
                                    })
                                }
                                onMouseLeave={() =>
                                    this.setState({ tooltipVisibleDelete: false })
                                }
                                visible={this.state.tooltipVisibleDelete}
                                title={AppConstants.statusPublishHover}
                            >
                                <Button
                                    className="open-reg-button"
                                    type="primary"
                                    htmlType="submit"
                                    style={{ height: (isPublish || publishStatus == 1) && "100%", borderRadius: (isPublish || publishStatus == 1) && 6 }}
                                    onClick={() =>
                                        isTeamNotInDraws == 1
                                            ? this.openModel(this.props)
                                            : this.check()
                                    }
                                    disabled={this.state.competitionStatus == 1 || publishStatus == 1}
                                >
                                    {AppConstants.publish}
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    {/* </div> */}
                </div>

                <DrawsPublishModel
                    publishVisible={this.state.visible}
                    divisionGradeNameList={this.props.drawsState.divisionGradeNameList}
                    getDrawsRoundsData={this.props.drawsState.getDrawsRoundsData}
                    modelCheckDivision={e => this.checkDivision(e)}
                    modelCheckRound={e => this.checkRound(e)}
                    modelCancel={this.handleCancel}
                    modelRadio={this.onChangeRadio}
                    modalPublish={(e) => this.publishDraw()}
                    modalDivisions={(e) => this.onSelectDivisionsValues(e)}
                    modalRounds={(e) => this.onSelectRoundValues(e)}
                    modalRadioValue={this.state.value}
                    modalIsShowPart={this.state.publishPartModel.isShowPart}
                    modalIsShowDivision={this.state.publishPartModel.publishPart.isShowDivision}
                    modalIsShowRound={this.state.publishPartModel.publishPart.isShowRound}
                />

                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.regenerateDrawTitle}
                    visible={this.state.drawGenerateModalVisible}
                    onOk={() => this.handleGenerateDrawModal("ok")}
                    onCancel={() => this.handleGenerateDrawModal("cancel")}
                >
                    <Select
                        className="year-select reg-filter-select-competition ml-2"
                        onChange={(e) => this.setState({ generateRoundId: e })}
                        placeholder="Round"
                    >
                        {(activeDrawsRoundsData || []).map((d) => (
                            <Option key={'round_' + d.roundId} value={d.roundId}>{d.name}</Option>
                        ))}
                    </Select>
                </Modal>
                <Modal
                    className="add-membership-type-modal"
                    title="Team Names"
                    visible={this.state.publishModalVisible}
                    onOk={() => this.handlePublishModal("ok")}
                    onCancel={() => this.handlePublishModal("cancel")}
                >
                    <div>
                        <div>{AppConstants.publishModalInfo}</div>
                        <div>{teamNames}</div>
                        <div>{AppConstants.publishModalConfirmationMsg}</div>
                    </div>
                </Modal>
            </div>
        );
    };

    checkDivision = e => {
        if (e.target.checked) {
            this.state.publishPartModel.publishPart.isShowDivision = true;
        }
        else {
            this.state.publishPartModel.publishPart.isShowDivision = false;
            this.onSelectDivisionsValues(null)
        }
        this.setState({
            publishPart: this.state.publishPartModel.publishPart
        })
    }

    checkRound = e => {
        if (e.target.checked) {
            this.state.publishPartModel.publishPart.isShowRound = true;
        } else {
            this.state.publishPartModel.publishPart.isShowRound = false;
            this.onSelectRoundValues(null)
        }
        this.setState({
            publishPart: this.state.publishPartModel.publishPart
        })
    }

    handleCancel = e => {
        this.setState({
            visible: false,
        });
        this.state.publishPartModel.publishPart.isShowRound = false;
        this.state.publishPartModel.publishPart.isShowDivision = false;
        this.state.publishPartModel.isShowPart = false;
        this.state.value = 1;
    };

    onChangeRadio = e => {
        this.setState({
            value: e.target.value,
        });
        if (e.target.value == 2) {
            this.state.publishPartModel.isShowPart = true;
            this.setState({
                publishPartModel: this.state.publishPartModel
            })
        } else {
            this.state.publishPartModel.isShowPart = false;
        }
    };

    publishDraw = () => {
        let payload = {
            isPartial: this.state.publishPartModel.isShowPart,
            divisions: [],
            rounds: []
        }
        if (this.state.publishPartModel.isShowPart) {
            payload.divisions = this.state.selectedDivisions;
            payload.rounds = this.state.selectedRounds
        }
        this.props.publishDraws(this.state.firstTimeCompId, '', payload);
        this.setState({ visible: false, changeStatus: true })
    }

    onSelectDivisionsValues = (e) => {
        this.setState({ selectedDivisions: e })
    }

    onSelectRoundValues = (e) => {
        this.setState({ selectedRounds: e })
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading={AppConstants.competitions}
                    menuName={AppConstants.competitions}
                />

                <InnerHorizontalMenu menu="competition" compSelectedKey="18" />

                <Layout className="comp-dash-table-view">
                    {this.headerView()}
                    <Content>{this.contentView()}</Content>
                    <Footer>{this.footerView()}</Footer>
                    <Loader visible={this.props.drawsState.updateLoad || this.props.competitionModuleState.drawGenerateLoad} />
                    {this.regenerateDrawExceptionModal()}
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
            updateCompetitionDrawsTimeline,
            saveDraws,
            getCompetitionVenue,
            updateCourtTimingsDrawsAction,
            clearMultiDraws,
            publishDraws,
            matchesListDrawsAction,
            generateDrawAction,
            unlockDrawsAction,
            getActiveRoundsAction,
            changeDrawsDateRangeAction,
            checkBoxOnChange,
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

export default connect(mapStateToProps, mapDispatchToProps)(MultifieldDrawsNewTimeline);
