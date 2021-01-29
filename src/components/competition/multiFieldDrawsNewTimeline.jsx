import React, { Component } from "react";
import { Layout, Button, Tooltip, Menu, Select, DatePicker, Checkbox, message, Spin, Modal, Radio } from "antd";
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
    setGlobalYear,
    getGlobalYear,
    setOwn_competition,
    getOwn_competition,
    setDraws_venue,
    setDraws_round,
    setDraws_roundTime,
    getDraws_venue,
    getDraws_round,
    getDraws_roundTime,
    setDraws_division_grade,
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

const TOOLTIP_STYLES = `
    min-width: fit-content;
    padding: 5px;
    background: #fff;
    border: 1px solid #bbbbc6;
    border-radius: 5px;
    position: absolute;
    z-index: 100;
`;

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
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
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
            isFilterSchedule: false,
            isDivisionNameShow: false,
            isAxisInverted: false,
            regenerateDrawExceptionModalVisible: false,
            regenerateExceptionRefId: 1,
            draggableEventObject: null,
            draggableElMouse: null,
            dragDayTarget: null,
            dragDayTimeRestrictions: null,
            dragDayStart: null,
            courtDataTarget: null,
            tooltipSwappableTime: null,
            ePageHoverTooltip: null,
            hoverTooltipFunc: null,
            isDragging: false,
            screenKey: this.props.location.state ? this.props.location.state.screenKey ? this.props.location.state.screenKey : null : null
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
                    let yearId = this.state.yearRefId ? this.state.yearRefId : getGlobalYear()
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
                message.success("Draws published to Match Day successfully");
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
        const yearId = getGlobalYear();
        const storedCompetitionId = getOwn_competition();
        const storedCompetitionStatus = getOwn_competitionStatus()
        const propsData = this.props.appState.own_YearArr.length > 0
            ? this.props.appState.own_YearArr
            : undefined;
        const compData = this.props.appState.own_CompetitionArr.length > 0
            ? this.props.appState.own_CompetitionArr
            : undefined;
        const venueId = getDraws_venue();
        const roundId = getDraws_round();
        const roundTime = getDraws_roundTime();
        const roundData = this.props.drawsState.getDrawsRoundsData.length > 0
            ? this.props.drawsState.getDrawsRoundsData
            : undefined;
        const venueData = this.props.drawsState.competitionVenues.length > 0
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

    onYearChange = (yearId) => {
        this.props.clearMultiDraws('rounds');
        setGlobalYear(yearId);
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

    getDiffBetweenStartAndEnd = eventObj => {
        const startTime = moment(eventObj.matchDate);
        const endTime = moment(this.getDate(eventObj.matchDate) + eventObj.endTime);
        const diffTime = endTime.diff(startTime, 'minutes');

        return diffTime;
    }

    onSwap(source, target, drawData, round_Id) {
        this.setState({
            isDragging: false,
            tooltipSwappableTime: null
        });
        const sourceIndexArray = source.split(':');
        const targetIndexArray = target.split(':');
        const sourceXIndex = sourceIndexArray[0];
        const sourceYIndex = sourceIndexArray[1];
        const targetXIndex = targetIndexArray[0];
        const targetYIndex = targetIndexArray[1];
        if (sourceXIndex === targetXIndex && sourceYIndex === targetYIndex) {
            return;
        }

        const sourceObejct = drawData[sourceXIndex].slotsArray[sourceYIndex];
        const targetObject = drawData[targetXIndex].slotsArray[targetYIndex];

        // events end time calculations
        const diffTimeSource = this.getDiffBetweenStartAndEnd(sourceObejct);
        const newEndTimeSource = moment(targetObject.matchDate).add(diffTimeSource, 'minutes').format('HH:mm');

        const diffTimeTarget = this.getDiffBetweenStartAndEnd(targetObject);
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

    getNextEventForSwap = (data, date, eventIndex) => {
        const dataFiltered = data.filter(slot => this.getDate(slot.matchDate) === date);

        const nextEvent = data.find((slot, index) => (index > eventIndex && slot.drawsId && dataFiltered.includes(slot)));
        return nextEvent;
    }

    checkCurrentSwapObjects(source, target, drawData) {
        const sourceIndexArray = source.split(':');
        const targetIndexArray = target.split(':');
        const sourceXIndex = sourceIndexArray[0];
        const sourceYIndex = sourceIndexArray[1];
        const targetXIndex = targetIndexArray[0];
        const targetYIndex = targetIndexArray[1];

        const sourceObejct = drawData[sourceXIndex].slotsArray[sourceYIndex];
        const targetObject = drawData[targetXIndex].slotsArray[targetYIndex];

        const sourceDraws = drawData[sourceXIndex];
        const targetDraws = drawData[targetXIndex];

        // for end time calculations
        const sourceObejctDate = this.getDate(sourceObejct.matchDate);
        const diffTimeSource = this.getDiffBetweenStartAndEnd(sourceObejct);

        const targetObjectDate = this.getDate(targetObject.matchDate);
        const diffTimeTarget = this.getDiffBetweenStartAndEnd(targetObject);

        // define next slots with data for the swappable objects days
        const nextSource = this.getNextEventForSwap(drawData[sourceXIndex].slotsArray, sourceObejctDate, sourceYIndex);
        const nextTarget = this.getNextEventForSwap(drawData[targetXIndex].slotsArray, targetObjectDate, targetYIndex);

        // define if the swappable event finishes before next event or end of the working day
        const targetObjectRestrictionEnd = this.getDayTimeRestrictions(targetDraws, targetObjectDate).endTime;
        const sourceObjectRestrictionEnd = this.getDayTimeRestrictions(sourceDraws, sourceObejctDate).endTime;

        const sourceEndNew = moment(targetObject.matchDate).add(diffTimeSource, 'minutes');
        const startTimeNextTarget = nextTarget ? moment(nextTarget.matchDate) : targetObjectRestrictionEnd;
        const isStartNextSourceLater = startTimeNextTarget.isSameOrAfter(sourceEndNew);

        const targetEndNew = moment(sourceObejct.matchDate).add(diffTimeTarget, 'minutes');
        const startTimeNextSource = nextSource ? moment(nextSource.matchDate) : sourceObjectRestrictionEnd;
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
        const key = this.state.firstTimeCompId === "-1" || this.state.filterDates ? "all" : "add"
        const customSourceObject = {
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
        const customTargetObject = {
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
        const postObject = {
            draws: [customSourceObject, customTargetObject],
        };

        const yearId = getGlobalYear();
        const storedCompetitionId = getOwn_competition();
        const venueId = getDraws_venue();
        const roundId = getDraws_round();

        this.props.updateCompetitionDrawsTimeline(
            postObject,
            sourceIndexArray,
            targetIndexArray,
            key,
            round_Id,
            yearId,
            storedCompetitionId,
            venueId,
            this.state.firstTimeCompId == "-1" || this.state.filterDates ? 0 : roundId,
            null,
            null,
            null,
            this.state.filterDates
        );
        this.setState({ updateLoad: true, isOnSwapUpdate: true });
    };

    // on Competition change
    onCompetitionChange(competitionId, statusRefId) {
        const own_CompetitionArr = this.props.appState.own_CompetitionArr
        this.props.clearMultiDraws('rounds');
        if (competitionId == -1 || this.state.filterDates) {
            this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId, "all", true, this.state.startDate, this.state.endDate);
            this.setState({ filterDates: true })
        } else {
            const statusIndex = own_CompetitionArr.findIndex((x) => x.competitionId == competitionId)
            const statusRefId = own_CompetitionArr[statusIndex].statusRefId
            const finalTypeRefId = own_CompetitionArr[statusIndex].finalTypeRefId
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
        const roundData = this.props.drawsState.getDrawsRoundsData;
        this.props.clearMultiDraws();
        const matchRoundData = roundData.findIndex((x) => x.roundId == roundId);
        const roundTime = roundData[matchRoundData].startDateTime;
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
        const checkDivisionFalse = this.state.firstTimeCompId == "-1" || this.state.filterDates ? this.checkAllDivisionData() : this.checkAllCompetitionData(this.props.drawsState.divisionGradeNameList, 'competitionDivisionGradeId')
        const checkCompetitionFalse = this.state.firstTimeCompId == "-1" || this.state.filterDates ? this.checkAllCompetitionData(this.props.drawsState.drawsCompetitionArray, "competitionName") : []
        const checkVenueFalse = this.checkAllCompetitionData(this.props.drawsState.competitionVenues, "id")
        const checkOrganisationFalse = this.checkAllCompetitionData(this.props.drawsState.drawOrganisations, "organisationUniqueKey")
        if (!checkDivisionFalse.includes(slot.competitionDivisionGradeId)) {
            if (!checkCompetitionFalse.includes(slot.competitionName)) {
                if (!checkVenueFalse.includes(slot.venueId)) {
                    if (!checkOrganisationFalse.includes(slot.awayTeamOrganisationId) || !checkOrganisationFalse.includes(slot.homeTeamOrganisationId)) {
                        return slot.colorCode
                    }
                }
            }
        }
        return "#999999"
    }

    checkAllDivisionData = () => {
        const uncheckedDivisionArr = []
        const { drawDivisions } = this.props.drawsState
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
        const uncheckedArr = []
        if (checkedArray.length > 0) {
            for (let i in checkedArray) {
                if (checkedArray[i].checked == false) {
                    uncheckedArr.push(checkedArray[i][key])
                }
            }
        }
        return uncheckedArr
    }

    checkSwap(slot) {
        const checkDivisionFalse = this.state.firstTimeCompId == "-1" ? this.checkAllDivisionData() : this.checkAllCompetitionData(this.props.drawsState.divisionGradeNameList, 'competitionDivisionGradeId')
        const checkCompetitionFalse = this.state.firstTimeCompId == "-1" ? this.checkAllCompetitionData(this.props.drawsState.drawsCompetitionArray, "competitionName") : []
        const checkVenueFalse = this.checkAllCompetitionData(this.props.drawsState.competitionVenues, "id")
        const checkOrganisationFalse = this.checkAllCompetitionData(this.props.drawsState.drawOrganisations, "organisationUniqueKey")
        const disabledStatus = this.state.competitionStatus == 1
        if (!checkDivisionFalse.includes(slot.competitionDivisionGradeId)) {
            if (!checkCompetitionFalse.includes(slot.competitionName)) {
                if (!checkVenueFalse.includes(slot.venueId)) {
                    if (!checkOrganisationFalse.includes(slot.awayTeamOrganisationId) || !checkOrganisationFalse.includes(slot.homeTeamOrganisationId)) {
                        if (!disabledStatus) {
                            return true
                        }
                    }
                }
            }
        }
        return false
    }

    onDateRangeCheck = (val) => {
        this.props.clearMultiDraws("rounds");
        let startDate = moment(new Date()).format("YYYY-MM-DD");
        let endDate = moment(new Date()).format("YYYY-MM-DD");
        this.props.getDrawsRoundsAction(this.state.yearRefId, this.state.firstTimeCompId, null, val);
        this.setState({ filterDates: val, startDate: startDate, endDate: endDate, venueLoad: true, });
    }

    onCalendarCheckboxChange = (key, value) => {
        this.setState({ [key]: value });
    }

    allFilterValue = data => {
        const isAllSelected = isArrayNotEmpty(data) && data.map(item => item.checked).every(item => item === true);
        return isAllSelected ? true : false;
    }

    getDate = date => {
        return date.slice(0, -5);
    }

    getWeeklySchedule = () => {
        const venueData = this.props.drawsState.competitionVenues;
        const clonedvenueData = _.cloneDeep(venueData);

        const weekSlotsTimeSchedule = [];

        if (clonedvenueData.length) {
            clonedvenueData.forEach(venue => {
                venue.availableTimeslots && venue.availableTimeslots.forEach(venueSlot => {
                    const equalDaysOfWeekSlot = weekSlotsTimeSchedule.find(weekSlot => weekSlot.day === venueSlot.day);

                    if (!equalDaysOfWeekSlot || !weekSlotsTimeSchedule.length) {
                        weekSlotsTimeSchedule.push({
                            day: venueSlot.day,
                            timeslot: venueSlot.timeslot
                        });
                    }

                    if (equalDaysOfWeekSlot) {
                        const equalDaysOfWeekSlotStart = moment(equalDaysOfWeekSlot.timeslot.startTime, 'HH:mm');
                        const equalDaysOfWeekSlotEnd = moment(equalDaysOfWeekSlot.timeslot.endTime, 'HH:mm');

                        const venueSlotStart = moment(venueSlot.timeslot.startTime, 'HH:mm');
                        const venueSlotEnd = moment(venueSlot.timeslot.endTime, 'HH:mm');

                        const isStartBefore = venueSlotStart.isBefore(equalDaysOfWeekSlotStart);
                        const isEndAfter = venueSlotEnd.isAfter(equalDaysOfWeekSlotEnd);

                        const equalDayInSchedule = weekSlotsTimeSchedule.find(item => item.day === equalDaysOfWeekSlot.day);

                        if (isStartBefore) {
                            equalDayInSchedule.timeslot.startTime = venueSlot.timeslot.startTime;
                        }

                        if (isEndAfter) {
                            equalDayInSchedule.timeslot.endTime = venueSlot.timeslot.endTime;
                        }
                    }
                })
            });
        }

        return weekSlotsTimeSchedule;
    }

    setDisplayNoneStyleTooltip = () => {
        const tooltip = document.getElementById('draggableTooltip');

        tooltip.setAttribute(
            "style",
            "display: none"
        );
    }

    addDisplayNoneTooltip = () => {
        const { hoverTooltipFunc } = this.state;

        if (hoverTooltipFunc) {
            clearTimeout(hoverTooltipFunc);
        }

        this.setState({ ePageHoverTooltip: null })

        this.setDisplayNoneStyleTooltip();
    }

    drawsFieldMove = e => {
        const { draggableElMouseX, draggableElMouseY } = !!this.state.draggableElMouse && this.state.draggableElMouse;
        const { 
            dragDayTimeRestrictions, 
            tooltipSwappableTime, 
            dragDayTarget, 
            ePageHoverTooltip, 
            hoverTooltipFunc, 
            isDragging
        } = this.state;

        const parent = e.currentTarget;
        const boundsParent = parent.getBoundingClientRect();

        const pageX = ePageHoverTooltip ? ePageHoverTooltip.pageX : e.pageX;
        const pageY = ePageHoverTooltip ? ePageHoverTooltip.pageY : e.pageY;

        const tooltipX = Math.trunc((pageX - boundsParent.left - draggableElMouseX));
        const tooltipY = Math.trunc((pageY - boundsParent.top - draggableElMouseY)) - 90;

        const tooltip = document.getElementById('draggableTooltip');
        const isTooltipAllowTime = isDragging && this.dragTimeRef.current?.isSameOrAfter(dragDayTimeRestrictions?.startTime)
            && this.dragTimeEndRef.current?.isSameOrBefore(dragDayTimeRestrictions?.endTime)
            && !!dragDayTarget;

        const fullTooltipStyles = TOOLTIP_STYLES + `left: ${tooltipX}px; top: ${tooltipY}px`;

        if (hoverTooltipFunc) {
            clearTimeout(hoverTooltipFunc);
        }

        if ((isTooltipAllowTime || tooltipSwappableTime) && !ePageHoverTooltip && isDragging) {
            tooltip.setAttribute(
                "style",
                fullTooltipStyles
            );
        } else if (ePageHoverTooltip && !isDragging) {
            this.setState({
                hoverTooltipFunc: setTimeout(() => {
                    tooltip.setAttribute(
                        "style",
                        fullTooltipStyles
                    );
                }, 500)
            });
        } else {
            this.setDisplayNoneStyleTooltip();
        }
    }

    drawsFieldUp = () => {
        this.addDisplayNoneTooltip();
        this.setState({ isDragging: false });
    }

    dayLineDragMove = (e, startDayDate, courtDataSlotsTarget, timeRestrictionsSchedule) => {
        const { draggableEventObject, tooltipSwappableTime, dragDayTarget, isAxisInverted } = this.state;

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

        const { draggableElMouseX, draggableElMouseY } = this.state.draggableElMouse;

        if (targetCourtId) {
            const bounds = e.currentTarget.getBoundingClientRect();

            const draggableElXStart = isAxisInverted ? 
                Math.trunc(((e.pageY - bounds.top - draggableElMouseY) / ONE_MIN_WIDTH))
                : 
                Math.trunc(((e.pageX - bounds.left - draggableElMouseX) / ONE_MIN_WIDTH));

            const newTime = startDayDate.clone().add(draggableElXStart, 'minutes');

            const refTimeFormatted = newTime.format('YYYY-MM-DD HH:mm');
            const startTimeNew = moment(refTimeFormatted);
            const newTimeFormatted = startTimeNew.format('HH:mm');
            const newTimeWithDateFormatted = startTimeNew.format('YYYY-MM-DD HH:mm');

            const startTimeOld = moment(draggableEventObject.matchDate);
            const endTimeOld = moment(this.getDate(draggableEventObject.matchDate) + draggableEventObject.endTime);
            const diffTime = endTimeOld.diff(startTimeOld, 'minutes');
            const endTimeNew = moment(newTimeWithDateFormatted).add(diffTime, 'minutes');

            this.dragTimeEndRef.current = endTimeNew;

            this.dragTimeRef.current = startTimeNew;

            const notEmptySlot = courtDataSlotsTarget.find(slot => slot.venueCourtId);

            const tooltip = document.getElementById('draggableTooltip');
            const tooltipSwappableTimeFormatted = moment(tooltipSwappableTime).format('HH:mm');

            tooltip.innerHTML = `
                <div>${draggableEventObject.homeTeamName} vs ${draggableEventObject.awayTeamName}</div>
                <div>Starting at ${tooltipSwappableTime ? tooltipSwappableTimeFormatted : newTimeFormatted}</div>
                <div>Court ${notEmptySlot?.venueShortName + '-' + notEmptySlot?.venueCourtNumber}</div>
            `;
        }
    }

    dayLineDragEnd = (e) => {
        const targetCourtId = +e.currentTarget.id.split(':')[0];
        const stateVenueId = this.state.dragDayTarget?.id.split(':')[0];

        const { draggableEventObject, dragDayTimeRestrictions } = this.state;

        this.setState({
            isDragging: false,
        });

        if (!stateVenueId) {
            message.error(AppConstants.timeNotAllowed);
            return
        }

        if (targetCourtId && stateVenueId) {
            const refTimeFormatted = this.dragTimeRef.current.format('YYYY-MM-DD HH:mm');
            const startTimeNew = moment(refTimeFormatted);

            if (startTimeNew.isBefore(dragDayTimeRestrictions.startTime)) {
                message.error(AppConstants.timeNotAllowed);
                return
            }

            const newTimeFormatted = startTimeNew.format('HH:mm');
            const newTimeWithDateFormatted = startTimeNew.format('YYYY-MM-DD HH:mm');

            const endTimeNew = this.dragTimeEndRef.current;

            if (endTimeNew.isAfter(dragDayTimeRestrictions.endTime)) {
                message.error(AppConstants.timeNotAllowed);
                return;
            }

            if (draggableEventObject.matchDate === newTimeWithDateFormatted && targetCourtId.toString() === stateVenueId) {
                message.error(AppConstants.timeNotAllowed);
                return;
            }

            const endTimeFormatted = endTimeNew.format('HH:mm');

            const notEmptyTargetDayCourtSlots = this.state.courtDataSlotsTarget.filter(slot =>
                this.getDate(slot.matchDate) === this.getDate(newTimeWithDateFormatted)
                && slot.drawsId
            );

            const isCourtDataSlotBusy = notEmptyTargetDayCourtSlots
                .some((slot, slotIndex) => {
                    const slotStart = moment(slot.matchDate);
                    const slotEnd = moment(this.getDate(slot.matchDate) + slot.endTime);

                    const isStartTimeCondition = startTimeNew.isBefore(slotEnd) && startTimeNew.isAfter(slotStart);
                    const isEndTimeCondition = endTimeNew.isAfter(slotStart) && endTimeNew.isBefore(slotEnd);
                    const isSlotEventInside = startTimeNew.isBefore(slotStart) && endTimeNew.isAfter(slotEnd);

                    const isEventOverItself = slot.drawsId === draggableEventObject.drawsId
                        && (
                            isStartTimeCondition
                            ||
                            isEndTimeCondition
                        );

                    if (isEventOverItself) {
                        const nextEvent = notEmptyTargetDayCourtSlots[slotIndex + 1];
                        const prevEvent = notEmptyTargetDayCourtSlots[slotIndex - 1];

                        const prevEventEnd = prevEvent && moment(this.getDate(slot.matchDate) + prevEvent?.endTime);
                        const nextEventStart = nextEvent && moment(nextEvent?.matchDate);

                        const isPrevEventEndBeforeSlotStart = prevEventEnd && prevEventEnd.isAfter(startTimeNew);
                        const isPrevEventStartAfterSlotEnd = nextEventStart && nextEventStart.isBefore(endTimeNew);

                        if (isPrevEventEndBeforeSlotStart || isPrevEventStartAfterSlotEnd) {
                            return true;
                        }

                        return false;
                    }

                    if (isStartTimeCondition || isEndTimeCondition || isSlotEventInside) {
                        return true;
                    }
                    return;
                });

            if (isCourtDataSlotBusy) {
                message.error(AppConstants.timeNotAllowed);
                return;
            }

            const roundId = getDraws_round();
            const yearId = getGlobalYear();
            const storedCompetitionId = getOwn_competition();

            const apiData = {
                yearRefId: yearId,
                competitionId: storedCompetitionId,
                venueId: 0,
                roundId: this.state.firstTimeCompId == "-1" || this.state.filterDates ? 0 : roundId,
                orgId: null,
                startDate: this.state.firstTimeCompId == "-1" || this.state.filterDates ? this.state.startDate : null,
                endDate: this.state.firstTimeCompId == "-1" || this.state.filterDates ? this.state.endDate : null
            }

            const postData = {
                drawsId: draggableEventObject.drawsId,
                venueCourtId: stateVenueId,
                matchDate: newTimeWithDateFormatted,
                startTime: newTimeFormatted,
                endTime: endTimeFormatted,
            };

            this.props.updateCourtTimingsDrawsAction(
                postData,
                null,
                null,
                null,
                this.state.firstTimeCompId == "-1" || this.state.filterDates ? 0 : roundId,
                apiData,
                this.state.filterDates
            );
        }
    }

    setDraggableElMouse = e => {
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

    slotObjectMouseEnter = (e, draggableEventObject) => {
        if (!this.state.isDragging) {
            const ePageHoverTooltip = {
                pageX: e.pageX,
                pageY: e.pageY
            }

            this.setState({
                draggableEventObject,
                ePageHoverTooltip,
            });
        }

        this.setDisplayNoneStyleTooltip();
        this.setDraggableElMouse(e);

        const tooltip = document.getElementById('draggableTooltip');

        tooltip.innerHTML = `
            <div>${draggableEventObject.homeTeamName} vs ${draggableEventObject.awayTeamName}</div>
            <div>Starting at ${draggableEventObject.startTime}</div>
            <div>Court ${draggableEventObject.venueShortName}-${draggableEventObject.venueCourtName}</div>
        `;
    }

    slotObjectMouseDown = e => {
        this.setState({ ePageHoverTooltip: null, isDragging: true });

        this.setDraggableElMouse(e);
        this.addDisplayNoneTooltip();
    }

    slotObjectMouseLeave = () => {
        this.setState({ ePageHoverTooltip: null });
    }

    slotObjectDragOver = slotObject => {
        const { tooltipSwappableTime, draggableEventObject } = this.state;

        if (
            slotObject.matchDate !== tooltipSwappableTime
            && slotObject !== draggableEventObject
        )
            this.setState({ tooltipSwappableTime: slotObject.matchDate })
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
        const startTimeRestriction = timeRestrictionsSchedule && timeRestrictionsSchedule.startTime;
        const endTimeRestriction = timeRestrictionsSchedule && timeRestrictionsSchedule.endTime;

        const unavailableStartWidth = startTimeRestriction && startTimeRestriction.isAfter(startDayDate)
            ? timeRestrictionsSchedule.startTime.diff(startDayDate, 'minutes') * ONE_MIN_WIDTH
            : null;

        const unavailableEndWidth = endTimeRestriction && endTimeRestriction.isBefore(endDayDate)
            ? endDayDate.diff(timeRestrictionsSchedule.endTime, 'minutes') * ONE_MIN_WIDTH
            : null;

        return [unavailableStartWidth, unavailableEndWidth];
    }

    getDayTimeRestrictions = (courtData, fieldItemDate) => {
        const venueData = this.props.drawsState.competitionVenues;

        // for check the schedule of the day
        const schedule = this.getWeeklySchedule();
        const itemDateDayOfWeek = moment(fieldItemDate).format('dddd').toLowerCase();

        const findSchedule = schedule.find(scheduleDay => scheduleDay.day.toLowerCase() === itemDateDayOfWeek);

        const startDayTime = findSchedule ? findSchedule.timeslot.startTime : '00:00';
        const endDayTime = findSchedule ? findSchedule.timeslot.endTime : '24:00';

        const startDayTimeStartHour = this.getEndTime(fieldItemDate + startDayTime);
        const endDayTimeStartHour = this.getEndTime(fieldItemDate + endDayTime);

        const timeAllDayScheduleHours = [startDayTimeStartHour];

        while (timeAllDayScheduleHours[timeAllDayScheduleHours.length - 1] !== endDayTimeStartHour) {
            const newTime = moment(fieldItemDate + timeAllDayScheduleHours[timeAllDayScheduleHours.length - 1]).add(ONE_HOUR_IN_MIN, 'minutes').format('HH:mm');
            timeAllDayScheduleHours.push(newTime)
        }

        // check unavailable time during the day

        const courtVenueId = courtData.slotsArray.find(slot => slot.venueId).venueId;
        const courtId = courtData.venueCourtId;

        let venueDaySchedule;
        let workingDayInTimeline;
        let courtDaySchedule;

        // TODO this.props.drawsState.competitionVenues could be an object with different properties, necessary to fix !!

        if (venueData[0]?.availableTimeslots) {
            venueData.forEach(venue => {
                const daySchedule = venue.availableTimeslots.find(venueDaySchedule =>
                    venueDaySchedule?.venueId && venueDaySchedule.venueId === courtVenueId && venueDaySchedule.day === findSchedule?.day);

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

        const dayTimeRestrictions = workingDayInTimeline
            ? {
                startTime: venueSchedule.startTime.isAfter(courtSchedule.startTime) ? venueSchedule.startTime : courtSchedule.startTime,
                endTime: venueSchedule.endTime.isBefore(courtSchedule.endTime) ? venueSchedule.endTime : courtSchedule.endTime,
                isUnavailable: false
            }
            : !findSchedule
                ? {
                    startTime: moment(fieldItemDate + '00:00'),
                    endTime: moment(fieldItemDate + '23:59'),
                    isUnavailable: true
                }
                : null;

        return dayTimeRestrictions;
    }

    headerView = () => {
        return (
            <>
                {this.state.screenKey &&
                    <div className="row" style={{ marginTop: "15px" }}>
                        <div className="col-sm d-flex justify-content-end">
                            <div className="reg-add-save-button">
                                <Button
                                    onClick={() => history.push(this.state.screenKey)}
                                    className="primary-add-comp-form"
                                    type="primary"
                                >
                                    {AppConstants.backToMatchDay}
                                </Button>
                            </div>
                        </div>
                    </div>
                }
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
                            <div className='col-sm-1 mt-2 mr-n27' style={{ minWidth: 160}}>
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
                            <div className="col-sm mt-2">
                                <div className="w-100 d-flex flex-row align-items-center" style={{ minWidth: 255 }}>
                                    <RangePicker
                                        disabled={this.state.firstTimeCompId == "-1" || this.state.filterDates ? false : true}
                                        onChange={(date) => this.onChangeStartDate(moment(date[0]).format("YYYY-MM-DD"), moment(date[1]).format("YYYY-MM-DD"))}
                                        format="DD-MM-YYYY"
                                        style={{ width: '100%', minWidth: 200 }}
                                        value={[moment(this.state.startDate), moment(this.state.endDate)]}
                                    />
                                </div>
                            </div>


                            <div className="col-sm-0 d-flex justify-content-end align-items-center pr-1 goBtn">
                                <Button className="primary-add-comp-form" type="primary" onClick={() => this.applyDateFilter()}>
                                    {AppConstants.go}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    ///////left side view for venue listing with checkbox
    venueLeftView = () => {
        const { competitionVenues } = this.props.drawsState
        const { showAllVenue } = this.state

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
                            <i className="fa fa-angle-up" style={{ color: "#ff8237" }} aria-hidden="true" />
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
        const { own_CompetitionArr } = this.props.appState
        const { drawsCompetitionArray } = this.props.drawsState
        const { showAllComp } = this.state

        const mainCheckboxValue = this.allFilterValue(drawsCompetitionArray);

        return (
            <>
                <div className="row">
                    <div className="col-sm d-flex justify-content-start">
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
                            <i className="fa fa-angle-up" style={{ color: "#ff8237" }} aria-hidden="true" />
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
        const { divisionGradeNameList, drawDivisions } = this.props.drawsState
        const { showAllDivision } = this.state

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
                            <i className="fa fa-angle-up" style={{ color: "#ff8237" }} aria-hidden="true" />
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
        const { drawOrganisations } = this.props.drawsState
        const { showAllOrg } = this.state

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
                            <i className="fa fa-angle-up" style={{ color: "#ff8237" }} aria-hidden="true" />
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
        const key = this.state.firstTimeCompId == "-1" || this.state.filterDates ? 'all' : "singleCompetition"
        this.props.unlockDrawsAction(id, round_Id, venueCourtId, key);
    }

    sideMenuView = () => {
        const { filterEnable } = this.state
        return (
            <div
                className="multiDrawContentView multi-draw-list-top-head pr-0"
                style={{ display: !filterEnable && "flex", justifyContent: !filterEnable && 'center', paddingLeft: !filterEnable && 1 }}
            >
                {filterEnable ? (
                    <div
                        className="d-flex align-items-center mt-4 pointer"
                        onClick={() => this.filterOnClick()}
                    >
                        <img className="dot-image" src={AppImages.filterIcon} alt="" width="20" height="20" style={{ marginBottom: 7 }} />
                        <span className="input-heading-add-another pt-0 pl-3">{filterEnable ? AppConstants.hideFilter : AppConstants.showFilter}</span>
                    </div>
                ) : (
                        <div
                            className="d-flex align-items-center mt-1 pointer"
                            onClick={() => this.filterOnClick()}
                        >
                            <img className="dot-image" src={AppImages.filterIcon} alt="" width="28" height="28" />
                        </div>
                    )}
                {filterEnable && this.venueLeftView()}
                {this.state.firstTimeCompId !== "-1" || !this.state.filterDates || (filterEnable && this.competitionLeftView())}
                {filterEnable && this.divisionLeftView()}
                {filterEnable && this.organisationLeftView()}
            </div>
        )
    }

    containerView() {
        return (
            <div className="multiDrawContentView">
                <div className="multi-draw-list-top-head row align-content-center">
                    <div className="col-sm-7 mt-3 pr-0" style={{ minWidth: 310 }}>
                        <span className="form-heading">{AppConstants.matchCalender}</span>
                        <Checkbox
                            className="single-checkbox-radio-style my-2"
                            checked={this.state.isFilterSchedule}
                            onChange={e => this.onCalendarCheckboxChange('isFilterSchedule', e.target.checked)}
                        >
                            {AppConstants.showOnlyScheduledMatches}
                        </Checkbox>
                        <Checkbox
                            className="single-checkbox-radio-style ml-0 my-2"
                            checked={this.state.isDivisionNameShow}
                            onChange={e => this.onCalendarCheckboxChange('isDivisionNameShow', e.target.checked)}
                        >
                            {AppConstants.showByDivision}
                        </Checkbox>
                        <Checkbox
                            className="single-checkbox-radio-style ml-0 my-2"
                            checked={this.state.isAxisInverted}
                            onChange={e => this.onCalendarCheckboxChange('isAxisInverted', e.target.checked)}
                        >
                            {AppConstants.invertAxis}
                        </Checkbox>
                    </div>
                    <div
                        className="col-sm-4 pr-0 d-flex justify-content-end align-items-center"
                        style={{
                            width: 'unset',
                            maxWidth: '100%',
                            flex: '1 0 auto'
                        }}
                    >
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
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: 100 }}
                        >
                            <Spin size='default' spinning={this.props.drawsState.spinLoad} />
                        </div>
                    )}
                    {this.props.drawsState.getRoundsDrawsdata.length <= 0 && (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: 100 }}
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

    getStartTime = dateWithStartTime => {
        const isTimeStartsAtHourStart = moment(dateWithStartTime).format('HH:mm') === moment(dateWithStartTime).startOf('hour').format('HH:mm');

        const startTime = isTimeStartsAtHourStart
            ? moment(dateWithStartTime).format('HH:mm')
            : moment(dateWithStartTime).startOf('hour').format('HH:mm');

        return startTime;
    }

    getEndTime = dateWithEndTime => {
        const isTimeEndsAtHourEnd = moment(dateWithEndTime).format('HH:mm') === moment(dateWithEndTime).startOf('hour').format('HH:mm');

        const endTime = isTimeEndsAtHourEnd
            ? moment(dateWithEndTime).format('HH:mm')
            : moment(dateWithEndTime).endOf('hour').add(1, 'minutes').format('HH:mm');

        return endTime;
    }

    getStartAndEndDayTime = (itemDate, dateNewArray) => {
        const schedule = this.getWeeklySchedule();
        const { isFilterSchedule } = this.state;

        const filteredDateArray = dateNewArray
            .filter(item => this.getDate(item.date) === itemDate);

        const dayDate = this.getDate(filteredDateArray[0].date);

        // for Show only scheduled matches filter
        const sortedByStartTimeDateArray = filteredDateArray.sort((a, b) => moment(a.date) - moment(b.date));
        const firstEventInDayStart = sortedByStartTimeDateArray[0]?.date;

        const sortedByEndTimeDateArray = filteredDateArray
            .sort((a, b) => moment(this.getDate(a.date) + a.endTime) - moment(this.getDate(b.date) + b.endTime));
        const lastEventInDayEnd = dayDate + sortedByEndTimeDateArray[sortedByEndTimeDateArray.length - 1].endTime;

        const firstEventHourStart = moment(firstEventInDayStart).startOf('hour').format('HH:mm');

        const lastEventHourEnd = this.getEndTime(lastEventInDayEnd);
        ////

        const itemDateDayOfWeek = moment(itemDate).format('dddd').toLowerCase();

        const findSchedule = schedule.find(scheduleDay => scheduleDay.day.toLowerCase() === itemDateDayOfWeek);

        const scheduleHourStart = findSchedule && this.getStartTime(dayDate + findSchedule.timeslot.startTime);
        const scheduleHourEnd = findSchedule && this.getEndTime(dayDate + findSchedule.timeslot.endTime);

        const startDayTime = isFilterSchedule || !findSchedule ? firstEventHourStart : scheduleHourStart;
        const endDayTime = isFilterSchedule || !findSchedule ? lastEventHourEnd : scheduleHourEnd;

        return { startDayTime, endDayTime };
    }

    getDraggableViewHeaderData = (itemDate, dateNewArray) => {
        const { startDayTime, endDayTime } = this.getStartAndEndDayTime(itemDate, dateNewArray);

        const startDayTimeStartHour = this.getStartTime(itemDate + startDayTime);
        const endDayTimeStartHour = this.getEndTime(itemDate + endDayTime);

        const timeAllDayScheduleHours = [startDayTimeStartHour];

        while (timeAllDayScheduleHours[timeAllDayScheduleHours.length - 1] !== endDayTimeStartHour) {
            const newTime = moment(itemDate + timeAllDayScheduleHours[timeAllDayScheduleHours.length - 1]).add(ONE_HOUR_IN_MIN, 'minutes').format('HH:mm');
            timeAllDayScheduleHours.push(newTime)
        }

        return timeAllDayScheduleHours;
    }

    defineDayBg = () => {
        const { isAxisInverted } = this.state;

        let backgroundSize = '';
        let backgroundImage = '';
        let backgroundPosition = '';
        let backgroundPositionCounter = -30;

        for (let i = 0; i <= 10; i++) {
            backgroundSize += `${ONE_MIN_WIDTH * ONE_HOUR_IN_MIN / 2}px ${ONE_MIN_WIDTH * 30}px`;
            backgroundImage += 'radial-gradient(1px 1px at left center, rgb(170, 170, 170) 1px, transparent 1px)';
            backgroundPosition += `0px ${backgroundPositionCounter}px`;
            backgroundPositionCounter += 5;

            if (i < 10) {
                backgroundSize += ', ';
                backgroundImage += ', ';
                backgroundPosition += ', ';
            }
        }

        const horizontalDashedBg = {
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 51%,rgba(255,255,255,0) 100%),' +
                            'linear-gradient(to bottom, rgba(170,170,170,1) 0%, rgba(170,170,170,0) 2%, rgba(170,170,170,0) 100%)',
            backgroundSize: `5px ${ONE_MIN_WIDTH * 30}px`
        }

        const dayBgAvailable = isAxisInverted ? {
            ...horizontalDashedBg,
        } : {
            backgroundSize,
            backgroundImage,
            backgroundPosition,
        };

        return dayBgAvailable;
    }

    dayHeadView = (date, dateNewArray, dayMargin) => {
        const { isAxisInverted } = this.state;

        return (
            <div 
                className={`draws-x-head d-flex ${isAxisInverted ? 'flex-column align-items-end' : ''}`} 
                style={{
                    margin: isAxisInverted ? 0 : '0 0 0 34px',
                    top: isAxisInverted ? -8 : 0,
                }}
            >
                {date.map((itemDate, index) => {
                    // for drawing days position
                    const newTimeAllDayScheduleHours = [
                        ...this.getDraggableViewHeaderData(
                            itemDate,
                            dateNewArray
                        ),
                    ];

                    if (index < date.length - 1) {
                        newTimeAllDayScheduleHours.pop();
                    }

                    return newTimeAllDayScheduleHours.map(
                        (itemTime, indexTime) => {
                            if (index !== 0 || indexTime !== 0) {
                                dayMargin += ONE_HOUR_IN_MIN * ONE_MIN_WIDTH;
                            }
                            if (index === 0 && indexTime === 0) {
                                dayMargin = 0;
                            }

                            return (
                                <div
                                    key={"time" + index + indexTime}
                                    className={`d-flex ${isAxisInverted ? 'justify-content-end' : 'flex-column'}`}
                                    style={{
                                        left: dayMargin,
                                        fontSize: 11,
                                        width: isAxisInverted ? 'fit-content' : ONE_HOUR_IN_MIN * ONE_MIN_WIDTH,
                                        height: isAxisInverted ? ONE_HOUR_IN_MIN * ONE_MIN_WIDTH : 'fit-content',
                                    }}
                                >
                                    <span className="draws-x-head-text">
                                        {!indexTime
                                            ? moment(itemDate + itemTime).format("DD MMM, ddd")
                                            : moment(itemDate + itemTime).format("ddd")
                                        }
                                    </span>
                                    <span className="draws-x-head-text">
                                        {isAxisInverted ? `, ${itemTime.slice(-5)}` : itemTime.slice(-5)}
                                    </span>
                                </div>
                            );
                        }
                    );
                })}
            </div>
        );
    }

    courtHorizontalHeadView = (dateItem) => {
        return (
            <div 
                className="table-head-wrap d-flex position-relative" 
                style={{
                    left: 180,
                }}
            >
                {dateItem.draws && dateItem.draws.map((courtData, index) => {
                    return (
                        <div
                            key={"court" + index} 
                            className="d-flex justify-content-center"
                            style={{ width: 70 }}
                        >
                            <span className="draws-x-head-text">
                                {courtData.venueShortName + '-' + courtData.venueCourtNumber}
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    unavailableTextView = () => {
        const { isAxisInverted } = this.state;

        return (
            <span 
                className={isAxisInverted ? '' : 'text-overflow'}
                style={{
                    transform: isAxisInverted ? 'rotate(-90deg)' : 'none',
                }}
            >
                {AppConstants.unavailable}
            </span>
        );
    }

    draggableView = (dateItem) => {
        let disabledStatus = this.state.competitionStatus == 1;
        let dayMargin = 25;
        let topMargin = 2;
        const date = [];

        const { isFilterSchedule, isAxisInverted } = this.state;

        const { dateNewArray } = dateItem;

        dateNewArray.forEach(item => {
            const dateNew = this.getDate(item.date);

            if (dateNew !== date[date.length - 1]) {
                date.push(dateNew);
            }
        });
        
        const dayBgAvailable = this.defineDayBg();

        return (
            <>
                <div
                    className="scroll-bar"
                    style={{
                        width: 'fit-content',
                    }}
                >
                    {/* Horizontal head */}
                    {isAxisInverted ?    
                        this.courtHorizontalHeadView(dateItem)
                        : 
                        <div className="table-head-wrap">
                            {this.dayHeadView(date, dateNewArray, dayMargin)}
                        </div>
                    }

                </div>
                <div
                    className={`main-canvas Draws ${isAxisInverted ? 'd-flex' : ''}`}
                    id="draws-field"
                    onDragOver={e => this.drawsFieldMove(e)}
                    onMouseMove={e => this.drawsFieldMove(e)}
                    onDragLeave={this.addDisplayNoneTooltip}
                    onMouseLeave={this.addDisplayNoneTooltip}
                    onMouseUp={this.drawsFieldUp}
                    onTouchEnd={this.drawsFieldUp}
                >

                    {isAxisInverted &&    
                        this.dayHeadView(date, dateNewArray, dayMargin)
                    }
                    <div
                        id="draggableTooltip"
                        className="unavailable-draws"
                        // don't change this inline style, tooltip won't work !!
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
                            <div 
                                key={"court" + index} 
                                style={{ 
                                    height: isAxisInverted ? 'unset' : 70,
                                    width: isAxisInverted ? 70 : 'unset',
                                    display: 'flex', 
                                    alignItems: 'center',
                                    ...(isAxisInverted && {
                                        position: 'relative',
                                        left: 40,
                                    })
                                }}
                            >
                                {!isAxisInverted && 
                                    <div
                                        className="venueCourt-tex-div text-center ml-n20 d-flex justify-content-center align-items-center"
                                        style={{
                                            width: 95,
                                            height: 48,
                                        }}
                                    >
                                        <span className="venueCourt-text">
                                            {courtData.venueShortName + '-' + courtData.venueCourtNumber}
                                        </span>
                                    </div>
                                }

                                {date.map((fieldItemDate, fieldItemDateIndex) => {
                                    // for check the schedule of the day
                                    const { startDayTime, endDayTime } = this.getStartAndEndDayTime(fieldItemDate, dateNewArray);

                                    const startDayDate = moment(fieldItemDate + startDayTime);
                                    const endDayDate = moment(fieldItemDate + endDayTime);

                                    const dateNow = moment();
                                    const isDayInPast = dateNow.isAfter(endDayDate);

                                    if (fieldItemDateIndex !== 0) {
                                        prevDaysWidth += diffDayScheduleTime;
                                    }
                                    if (fieldItemDateIndex === 0) {
                                        prevDaysWidth = 0;
                                    }

                                    if (fieldItemDateIndex === date.length - 1) {
                                        // for the last day in schedule width and right dashed line in the end of the day
                                        diffDayScheduleTime = endDayDate.diff(startDayDate, 'minutes') * ONE_MIN_WIDTH + 1;
                                    } else if (fieldItemDateIndex === date.length - 1 && isFilterSchedule) {
                                        diffDayScheduleTime = (endDayDate.diff(startDayDate, 'minutes') - ONE_HOUR_IN_MIN) * ONE_MIN_WIDTH;
                                    } else {
                                        diffDayScheduleTime = endDayDate.diff(startDayDate, 'minutes') * ONE_MIN_WIDTH;
                                    }

                                    const timeRestrictionsSchedule = this.getDayTimeRestrictions(courtData, fieldItemDate);

                                    const unavailableWidth = this.checkUnavailableTimeWidth(timeRestrictionsSchedule, startDayDate, endDayDate);

                                    // render for the whole unavailable day for court based on venue schedule
                                    if (!timeRestrictionsSchedule) {
                                        return (
                                            <div
                                                key={"slot" + fieldItemDateIndex}
                                                className={isAxisInverted ? 'position-absolute' : 'position-relative'}
                                                style={{ 
                                                    width: `calc(100%) - ${prevDaysWidth}`,
                                                    height: '100%', 
                                                    left: isAxisInverted ? '50%' : 75,
                                                }}
                                            >
                                                <div
                                                    id={courtData.venueCourtId}
                                                    className="box-draws unavailable-draws align-items-center"
                                                    style={{
                                                        minWidth: 48,
                                                        // cursor: 'not-allowed',
                                                        background: `repeating-linear-gradient( -45deg, #ebf0f3, #ebf0f3 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5 * ONE_MIN_WIDTH}px )`,
                                                        ...(isAxisInverted ? {
                                                            left: 0,
                                                            top: prevDaysWidth,
                                                            width: 48,
                                                            height: diffDayScheduleTime,
                                                            transform: 'translateX(-50%)',
                                                        } : {
                                                            left: prevDaysWidth,
                                                            top: '50%',
                                                            width: diffDayScheduleTime,
                                                            height: 48,
                                                            transform: 'translateY(-50%)',
                                                        })
                                                    }}
                                                    onDragOver={() => {
                                                        if (this.state.dragDayTarget) {
                                                            this.setState({ dragDayTarget: null })
                                                        }
                                                    }}
                                                    onDragEnd={e => this.dayLineDragEnd(e)}
                                                >
                                                    {this.unavailableTextView()}
                                                </div>
                                            </div>
                                        )
                                    }

                                    const dayBg = timeRestrictionsSchedule.isUnavailable ? {
                                        background: `repeating-linear-gradient( -45deg, #ebf0f3, #ebf0f3 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5 * ONE_MIN_WIDTH}px )`,
                                    } : dayBgAvailable;

                                    return (
                                        <div
                                            key={"slot" + fieldItemDateIndex}
                                            className={isAxisInverted ? 'position-absolute' : 'position-relative'}
                                            style={{ 
                                                width: `calc(100%) - ${prevDaysWidth}`, 
                                                height: '100%',
                                                left: isAxisInverted ? '50%' : 75,
                                            }}
                                        >
                                            <div
                                                id={courtData.venueCourtId + ':' + fieldItemDateIndex}
                                                className={`box-draws white-bg-timeline day-box ${isAxisInverted ? 'position-absolute' : ''}`}
                                                style={{
                                                    minWidth: 'unset',
                                                    overflow: 'visible',
                                                    whiteSpace: 'nowrap',
                                                    cursor: disabledStatus && "no-drop",
                                                    borderRadius: '0px',
                                                    left: 0,
                                                    ...dayBg,
                                                    ...(isAxisInverted ?
                                                        {
                                                            top: prevDaysWidth,
                                                            width: 48,
                                                            height: diffDayScheduleTime,
                                                            transform: 'translateX(-50%)',
                                                        } : {
                                                            top: '50%',
                                                            width: diffDayScheduleTime,
                                                            height: 48,
                                                            transform: 'translateY(-50%)',
                                                        })
                                                }}
                                                onDragOver={e => {
                                                    if (!timeRestrictionsSchedule.isUnavailable && !isDayInPast) {
                                                        this.dayLineDragMove(e, startDayDate, courtData.slotsArray, timeRestrictionsSchedule)
                                                    }
                                                }}
                                                onDragEnd={e => {
                                                    if (!timeRestrictionsSchedule.isUnavailable && !isDayInPast)
                                                        this.dayLineDragEnd(e)
                                                }}
                                                onTouchMove={e => {
                                                    if (!timeRestrictionsSchedule.isUnavailable && !isDayInPast) {
                                                        this.dayLineDragMove(e, startDayDate, courtData.slotsArray, timeRestrictionsSchedule)
                                                    }
                                                }}
                                                onTouchEnd={e => {
                                                    if (!timeRestrictionsSchedule.isUnavailable && !isDayInPast)
                                                        this.dayLineDragEnd(e)
                                                }}
                                            >
                                                {timeRestrictionsSchedule.isUnavailable && this.unavailableTextView()}

                                                {unavailableWidth.map((width, widthIndex) => {
                                                    if (width) {
                                                        return (
                                                            <div
                                                                className="box-draws unavailable-draws position-absolute align-items-center"
                                                                style={{
                                                                    background: `repeating-linear-gradient( -45deg, #ebf0f3, #ebf0f3 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5}px, #d9d9d9 ${ONE_HOUR_IN_MIN / 5 * ONE_MIN_WIDTH}px )`,
                                                                    cursor: 'not-allowed',
                                                                    ...(isAxisInverted ?
                                                                        {
                                                                            bottom: widthIndex ? 0 : 'auto',
                                                                            top: widthIndex ? 'auto' : 0,
                                                                            left: 0,
                                                                            height: width,
                                                                            minHeight: width,
                                                                            width: '100%',
                                                                        } : {
                                                                            right: widthIndex ? 0 : 'auto',
                                                                            left: widthIndex ? 'auto' : 0,
                                                                            top: 0,
                                                                            width,
                                                                            minWidth: width,
                                                                            height: '100%',
                                                                        })
                                                                }}
                                                            >
                                                                {this.unavailableTextView()}
                                                            </div>
                                                        )
                                                    }
                                                })}
                                                {courtData.slotsArray.map((slotObject, slotIndex) => {
                                                    if (this.getDate(slotObject.matchDate) === fieldItemDate && slotObject.drawsId) {
                                                        // for left margin the event start inside the day
                                                        const startWorkingDayTime = moment(fieldItemDate + startDayTime);
                                                        const startTimeEvent = moment(slotObject.matchDate);

                                                        const diffTimeStartEvent = startTimeEvent.diff(startWorkingDayTime, 'minutes') * ONE_MIN_WIDTH;
                                                        // for width of the event
                                                        const endTimeEvent = moment(fieldItemDate + slotObject.endTime);
                                                        const diffTimeEventDuration = endTimeEvent.diff(startTimeEvent, 'minutes') * ONE_MIN_WIDTH;
                                                        return (
                                                            <div 
                                                                key={"slot" + slotIndex}
                                                                style={{
                                                                    position: 'absolute',
                                                                    left: isAxisInverted ? 0 : diffTimeStartEvent,
                                                                    top: isAxisInverted ? diffTimeStartEvent : 0,
                                                                }}
                                                            >
                                                                <div
                                                                    id={slotObject.drawsId}
                                                                    onMouseDown={this.slotObjectMouseDown}
                                                                    onTouchStart={this.slotObjectMouseDown}
                                                                    onDragOver={() => this.slotObjectDragOver(slotObject)}
                                                                    onTouchMove={() => this.slotObjectDragOver(slotObject)}
                                                                    onDragLeave={() => {
                                                                        this.setState({ tooltipSwappableTime: null })
                                                                    }}
                                                                    onMouseEnter={e => this.slotObjectMouseEnter(e, slotObject)}
                                                                    onMouseLeave={this.slotObjectMouseLeave}
                                                                    className={'box-draws purple-bg'}
                                                                    style={{
                                                                        backgroundColor: this.checkColor(slotObject),
                                                                        // left: isAxisInverted ? 0 : diffTimeStartEvent,
                                                                        // top: isAxisInverted ? diffTimeStartEvent : 0,
                                                                        overflow: 'hidden',
                                                                        whiteSpace: 'nowrap',
                                                                        cursor: timeRestrictionsSchedule.isUnavailable || isDayInPast ? 'not-allowed' : disabledStatus && "no-drop",
                                                                        width: isAxisInverted ? 48 : diffTimeEventDuration,
                                                                        minWidth: isAxisInverted ? 48 : diffTimeEventDuration,
                                                                        height: isAxisInverted ? diffTimeEventDuration : 48,
                                                                        opacity: isDayInPast ? 0.7 : 1,
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
                                                                            swappable={timeRestrictionsSchedule.isUnavailable || isDayInPast ? false : this.checkSwap(slotObject)}
                                                                            onSwap={(source, target) =>
                                                                                this.onSwap(
                                                                                    source,
                                                                                    target,
                                                                                    dateItem.draws,
                                                                                    dateItem.roundId,
                                                                                )
                                                                            }
                                                                            isCurrentSwappable={(source, target) =>
                                                                                isDayInPast
                                                                                    ? false
                                                                                    : this.checkCurrentSwapObjects(
                                                                                        source,
                                                                                        target,
                                                                                        dateItem.draws,
                                                                                    )
                                                                            }
                                                                        >
                                                                            {this.state.isDivisionNameShow ? (
                                                                                <span className="text-overflow">
                                                                                    {slotObject.divisionName + "-" + slotObject.gradeName}
                                                                                </span>
                                                                            ) : (
                                                                                    <span className="text-overflow">
                                                                                        {slotObject.homeTeamName} <br />
                                                                                        {slotObject.awayTeamName}
                                                                                    </span>
                                                                                )
                                                                            }
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
                                                                                swappable={timeRestrictionsSchedule.isUnavailable || isDayInPast ? false : this.checkSwap(slotObject)}
                                                                                onSwap={(source, target) =>
                                                                                    this.onSwap(
                                                                                        source,
                                                                                        target,
                                                                                        dateItem.draws,
                                                                                        dateItem.roundId,
                                                                                    )
                                                                                }
                                                                                isCurrentSwappable={(source, target) =>
                                                                                    isDayInPast
                                                                                        ? false
                                                                                        : this.checkCurrentSwapObjects(
                                                                                            source,
                                                                                            target,
                                                                                            dateItem.draws,
                                                                                        )
                                                                                }
                                                                            >
                                                                                {this.state.isDivisionNameShow ? (
                                                                                    <span className="text-overflow">
                                                                                        {slotObject.divisionName + "-" + slotObject.gradeName}
                                                                                    </span>
                                                                                ) : (
                                                                                        <span className="text-overflow">
                                                                                            {slotObject.homeTeamName} <br />
                                                                                            {slotObject.awayTeamName}
                                                                                        </span>
                                                                                    )
                                                                                }
                                                                            </Swappable>
                                                                        )}
                                                                </div>

                                                                {slotObject.drawsId !== null && (
                                                                    <div
                                                                        // className="box-exception"
                                                                        className="position-absolute"
                                                                        style={{
                                                                            // left: diffTimeStartEvent,
                                                                            top: isAxisInverted ? '50%' : 48,
                                                                            left: isAxisInverted ? 48 : '50%',
                                                                            transform: isAxisInverted ? 'translateY(-50%)' : 'translateX(-50%)',
                                                                            overflow: 'hidden',
                                                                            whiteSpace: 'nowrap',
                                                                            minWidth: 16,
                                                                        }}
                                                                    >
                                                                        {!timeRestrictionsSchedule.isUnavailable && !isDayInPast && <Menu
                                                                            className="action-triple-dot-draws"
                                                                            theme="light"
                                                                            mode="horizontal"
                                                                            style={{ 
                                                                                lineHeight: '16px', 
                                                                                borderBottom: 0, 
                                                                                cursor: disabledStatus && "no-drop",
                                                                            }}
                                                                        >
                                                                            <SubMenu
                                                                                disabled={disabledStatus}
                                                                                className="m-0 d-flex justify-content-center"
                                                                                key="sub1"
                                                                                title={
                                                                                    (
                                                                                        <div>
                                                                                            {slotObject.isLocked == 1 ? (
                                                                                                <img
                                                                                                    className="dot-image"
                                                                                                    src={AppImages.drawsLock}
                                                                                                    alt=""
                                                                                                    width="16"
                                                                                                    height="10"
                                                                                                />

                                                                                            ) : (
                                                                                                    <img
                                                                                                        className="dot-image"
                                                                                                        src={AppImages.moreTripleDot}
                                                                                                        alt=""
                                                                                                        width="16"
                                                                                                        height="10"
                                                                                                        style={{ 
                                                                                                            transform: isAxisInverted ? 'rotate(-90deg)' : 'none' 
                                                                                                        }}
                                                                                                    />
                                                                                                )}
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
                                                                                        <div className="d-flex">
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
                                                                        }
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
        const payload = {
            yearRefId: this.state.yearRefId,
            competitionUniqueKey: this.state.firstTimeCompId,
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            roundId: this.state.generateRoundId
        };
        if (regenerateExceptionRefId) {
            payload["exceptionTypeRefId"] = regenerateExceptionRefId;
        }
        this.props.generateDrawAction(payload);
        this.setState({ venueLoad: true });
    }

    reGenerateDraw = () => {
        this.setState({ regenerateDrawExceptionModalVisible: true });
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
        const { publishStatus, activeDrawsRoundsData, teamNames } = this.props.drawsState;
        const isTeamNotInDraws = this.props.drawsState.isTeamInDraw;
        const isPublish = this.state.competitionStatus == 1;
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
                                className="h-100"
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
        const payload = {
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
