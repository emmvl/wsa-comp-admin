import React, { Component } from "react";
import { Layout, Breadcrumb, Select, Button, Form, message } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from 'react-router-dom';
import loadjs from 'loadjs';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import CompetitionSwappable from '../../customComponents/quickCompetitionComponent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from "../../customComponents/loader"
import history from "../../util/history";
import { captializedString } from "../../util/helpers"
import {
    getVenuesTypeAction,
    searchVenueList,
    clearFilter,

} from "../../store/actions/appAction";
import InputWithHead from "../../customComponents/InputWithHead";
import ValidationConstants from "../../themes/validationConstant";
import TimeSlotModal from "../../customComponents/timslotModal"
import CompetitionModal from "../../customComponents/competiitonModal"
import DivisionGradeModal from "../../customComponents/divisionGradeModal"
import {
    updateQuickCompetitionData, updateTimeSlot, updateDivision, updateCompetition,
    createQuickCompetitionAction,
    saveQuickCompDivisionAction, getYearAndQuickCompetitionAction, getQuickCompetitionAction,
    quickCompetitionTimeSlotData, updateQuickCompetitionAction,
} from "../../store/actions/competitionModuleAction/competitionQuickAction"
import { quickCompetitionInit } from "../../store/actions/commonAction/commonAction"
import { captializedString } from "../../util/helpers";


const { Header, Footer, Content } = Layout;
const { Option } = Select;

class CompetitionQuickCompetition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            competition: "2019winter",
            venue: "abbott",
            firstTimeCompId: '',
            timeSlotVisible: false,
            visibleCompModal: false,
            visibleDivisionModal: false,
            yearRefId: 1,
            quickCompetitionLoad: false
        }
        this.props.updateCompetition("", "allData")
        this.props.getVenuesTypeAction()
    }


    componentDidMount() {
        loadjs('assets/js/custom.js');
        let body = {
            Day: "Day"
        }
        this.props.quickCompetitionInit(body)
        this.props.getYearAndQuickCompetitionAction(
            this.props.appState.quick_CompetitionYearArr,
            null,
        );
    }

    componentDidUpdate(nextProps) {
        if (nextProps.quickCompetitionState !== this.props.quickCompetitionState) {
            let competitionList = this.props.quickCompetitionState.quick_CompetitionArr;
            if (nextProps.quickCompetitionState.quick_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let competitionId = competitionList[0].competitionId;
                    this.setState({ firstTimeCompId: competitionId, quickCompetitionLoad: true });
                    this.props.getQuickCompetitionAction(competitionId)
                }
            }
            let selectedCompetition = this.props.quickCompetitionState.selectedCompetition
            if (nextProps.selectedCompetition != selectedCompetition) {
                if (selectedCompetition.length > 0) {
                    this.props.updateCompetition("", "allData")
                    let competitionId = selectedCompetition;
                    this.props.getQuickCompetitionAction(competitionId)
                    this.setState({ firstTimeCompId: competitionId, quickCompetitionLoad: true });
                }
            }
        }
        if (nextProps.quickCompetitionState.quickComptitionDetails !== this.props.quickCompetitionState.quickComptitionDetails) {
            if (this.state.quickCompetitionLoad === true && this.props.quickCompetitionState.onQuickCompLoad === false) {
                this.setFieldValues()
                this.setState({
                    quickCompetitionLoad: false,
                })
            }
        }
    }

    saveAPIsActionCall = (e) => {
        let quickCompetitionData = this.props.quickCompetitionState.quickComptitionDetails
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.firstTimeCompId.length > 0) {
                    let payload = {
                        "competitionId": this.state.firstTimeCompId,
                        "competitionName": quickCompetitionData.competitionName,
                        "competitionVenues": quickCompetitionData.competitionVenues
                    }

                    this.props.updateQuickCompetitionAction(payload,this.state.yearRefId)
                }
                else {
                    message.config({
                        maxCount: 1, duration: 1
                    })
                    message.warning(ValidationConstants.pleaseSelectCompetition)
                }
            }
        })

    }

    setFieldValues() {
        let quickCompetitionData = this.props.quickCompetitionState.quickComptitionDetails
        let selectedVenues = this.props.quickCompetitionState.selectedVenues
        this.props.form.setFieldsValue({
            competition_name: quickCompetitionData.competitionName,
            selectedVenues: selectedVenues
        })
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };
    onCompetitionChange(competitionId) {
        this.props.updateCompetition("", "allData")
        this.setState({ firstTimeCompId: competitionId, quickCompetitionLoad: true });
        this.props.getQuickCompetitionAction(competitionId)
        this.setFieldValues()
    }

    //visible competition modal
    visibleCompetitionModal() {
        this.props.updateCompetition("", "clear")
        this.setState({
            visibleCompModal: true
        })
    }

    //change year 
    onYearChange(yearRefId) {
        this.props.updateCompetition("", "allData")
        this.setState({
            yearRefId, firstTimeCompId: ""
        })
        this.props.getYearAndQuickCompetitionAction(
            this.props.appState.quick_CompetitionYearArr,
            yearRefId,
        );
        this.setFieldValues()

    }

    ///////view for breadcrumb
    headerView = (getFieldDecorator) => {
        let timeSlotData = this.props.quickCompetitionState.timeSlot
        let division = this.props.quickCompetitionState.division
        let compName = this.props.quickCompetitionState.competitionName
        let competitionDate = this.props.quickCompetitionState.competitionDate
        let quickCompetitionState = this.props.quickCompetitionState
        return (<div className="fluid-width">
            <Header className="comp-draws-header-view mt-5" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.quickCompetition1}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                </div>
            </Header >
            <div className="row" >
                <div className="col-sm-2 pt-0">
                    <span className="input-heading-add-another pt-0" onClick={() => this.visibleCompetitionModal()}>+{AppConstants.addNew}</span>
                </div>
            </div>
            <div className="row" >
                <div className="col-sm-3">
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 50,
                        }}
                    >
                        <span className="year-select-heading">{AppConstants.year}:</span>
                        <Select
                            name={'yearRefId'}
                            className="year-select"
                            style={{ minWidth: 100 }}
                            onChange={(yearRefId) => this.onYearChange(yearRefId)}
                            value={this.state.yearRefId}
                        >
                            {quickCompetitionState.quick_CompetitionYearArr.length > 0 && quickCompetitionState.quick_CompetitionYearArr.map((item) => {
                                return (
                                    <Option key={'yearRefId' + item.id} value={item.id}>
                                        {item.description}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </div>
                <div className="col-sm-3">
                    <div
                        style={{
                            width: "fit-content",
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 50
                        }}
                    >
                        <span className="year-select-heading">{AppConstants.competition}:</span>
                        <Select
                            name={'competition'}
                            style={{ minWidth: 160 }}
                            className="year-select"
                            onChange={competitionId =>
                                this.onCompetitionChange(competitionId)
                            }
                            value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                        >
                            {quickCompetitionState.quick_CompetitionArr.length > 0 && quickCompetitionState.quick_CompetitionArr.map(item => {
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
            <TimeSlotModal
                visible={this.state.timeSlotVisible}
                onCancel={this.handleCancel}
                timeSlotOK={() => this.closeTimeSlotModal()}
                modalTitle={AppConstants.timeSlot}
                timeslots={timeSlotData}
                weekDays={this.props.commonState.days}
                addTimeSlot={() => this.props.updateTimeSlot("add")}
                addStartTime={(index) => this.props.updateTimeSlot("addStartTime", index)}
                removetimeSlotDay={(index) => this.props.updateTimeSlot("remove", index)}
                removeStartTime={(index, timeIndex) => this.props.updateTimeSlot("removeStartTime", index, timeIndex)}
                UpdateTimeSlotsDataManual={(startTime, index, timeIndex) => this.props.updateTimeSlot("changeTime", index, timeIndex, startTime)}
                changeDay={(day, index) => this.props.updateTimeSlot("day", index, null, day)}
            />

            <CompetitionModal
                handleOK={() => this.closeCompModal()}
                visible={this.state.visibleCompModal}
                onCancel={this.compModalClose}
                modalTitle={AppConstants.competition}
                competitionChange={(e) => this.props.updateCompetition(captializedString(e.target.value), "add")}
                competitionName={compName}
                selectedDate={competitionDate}
                updateDate={(date) => this.props.updateCompetition(date, "date")}
            />

            <DivisionGradeModal
                visible={this.state.visibleDivisionModal}
                onCancel={this.divisionModalClose}
                modalTitle={AppConstants.divisionGradeAndTeams}
                division={division}
                onOK={(e) => this.handleOK(e)}
                changeDivision={(index, e) => this.props.updateDivision("divisionName", index, null, captializedString(e.target.value))}
                changeTeam={(index, gradeIndex, value) => this.props.updateDivision("noOfTeams", index, gradeIndex, value)}
                addDivision={(index) => this.props.updateDivision("addDivision", index)}
                addGrade={(index) => this.props.updateDivision("addGrade", index)}
                removegrade={(index, gradeIndex) => this.props.updateDivision("removeGrade", index, gradeIndex)}
                changegrade={(index, gradeIndex, e) => this.props.updateDivision("gradeName", index, gradeIndex, captializedString(e.target.value))}
                removeDivision={(index, gradeIndex) => this.props.updateDivision("removeDivision", index, gradeIndex)}
            />
        </div >
        )
    }

    handleOK = () => {
        let competitionId = this.state.firstTimeCompId
        let division = this.props.quickCompetitionState.division
        this.props.saveQuickCompDivisionAction(competitionId, division)
        this.setState({
            visibleDivisionModal: false
        }
        )
    }

    //close timeslot modal 
    closeTimeSlotModal = () => {
        let timeslot = this.props.quickCompetitionState.timeSlot
        let timeSlotManualperVenueArray = []
        let timeslots = []
        for (let j in timeslot) {
            let manualStartTime = timeslot[j].startTime
            for (let k in manualStartTime) {
                let manualAllVenueObj =
                {
                    "competitionVenueTimeslotsDayTimeId": 0,
                    "dayRefId": timeslot[j].dayRefId,
                    "startTime": manualStartTime[k].startTime,
                    "sortOrder": JSON.parse(k),
                    "competitionTimeslotsEntity": [],
                }
                timeSlotManualperVenueArray.push(manualAllVenueObj)
            }
            timeslots = timeSlotManualperVenueArray

        }
        let body = {
            applyToVenueRefId: 1,
            competitionTimeslotId: 0,
            competitionTimeslotManual: [{
                timeslots: timeslots,
                venueId: 0
            }],
            competitionTimeslotsEntity: [],
            competitionUniqueKey: this.state.firstTimeCompId,
            competitionVenueTimeslotsDayTime: [],
            competitionVenues: [],
            organisationId: 1,
            timeslotGenerationRefId: 2,
            timeslotRotationRefId: 7,
        }
        this.props.quickCompetitionTimeSlotData(body)
        this.setState({
            timeSlotVisible: false
        })
    }

    //close division modal
    divisionModalClose = () => {
        this.props.updateDivision("swap")
        this.setState({
            visibleDivisionModal: false
        })
    }

    //close compModalClose
    compModalClose = () => {
        this.setState({
            visibleCompModal: false
        })
    }
    //close competition modal
    closeCompModal = () => {
        const { competitionName, competitionDate } = this.props.quickCompetitionState
        this.props.createQuickCompetitionAction(this.state.yearRefId, competitionName, competitionDate)
        this.setState({
            visibleCompModal: false
        })
    }

    ///close timeslot modal
    handleCancel = () => {
        this.setState({
            timeSlotVisible: false
        })
    }

    //On selection of venue
    onSelectValues(item, detailsData) {
        this.props.updateQuickCompetitionData(item, "venues")
        this.props.clearFilter()
    }

    // for search venue
    handleSearch = (value, data) => {
        const filteredData = data.filter(memo => {
            return memo.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        })
        this.props.searchVenueList(filteredData)
    };

    //open time slot modal
    visibleTimeModal = () => {
        if (this.state.firstTimeCompId.length > 0) {
            this.setState({
                timeSlotVisible: true
            })
        }
        else {
            message.config({
                maxCount: 1, duration: 1
            })
            message.warning(ValidationConstants.pleaseSelectCompetition)
        }

    }

    //open division modal
    visibleDivisonModal = () => {
        if (this.state.firstTimeCompId.length > 0) {
            this.setState({
                visibleDivisionModal: true
            })
        }
        else {
            message.config({
                maxCount: 1, duration: 1
            })
            message.warning(ValidationConstants.pleaseSelectCompetition)
        }
    }

    /////form content view
    contentView = (getFieldDecorator) => {
        let appState = this.props.appState
        let quickCompetitionState = this.props.quickCompetitionState
        return (
            <div className="comp-draw-content-view mt-0 ">
                <div className="row comp-draw-list-top-head">
                    <div className="col-sm-3 " >
                        <Form.Item >
                            {getFieldDecorator('competition_name',
                                { normalize: (input) => captializedString(input), rules: [{ required: true, message: ValidationConstants.competitionNameIsRequired }] })(
                                    <InputWithHead
                                        required={"required-field pb-0 pt-0"}
                                        placeholder={AppConstants.competition_name}
                                        onChange={(e) => this.props.updateQuickCompetitionData(captializedString(
                                            e.target.value), "competitionName")}
                                    />
                                )}
                        </Form.Item>
                    </div>
                    <div className="col-sm mt-2  quick-comp-btn-view">
                        <Button className="open-reg-button" onClick={() => this.visibleTimeModal()} type="primary">+ {AppConstants.add_TimeSlot}</Button>
                    </div>
                    <div className="col-sm-2.5 mt-2  quick-comp-btn-view paddingview">
                        <Button className="open-reg-button" type="primary" onClick={() => this.visibleDivisonModal()}>+ {AppConstants.addDivisionsAndGrades}</Button>
                    </div>
                    <div className="col-sm-3 mt-2  comp-draw-edit-btn-view">
                        <Button className="open-reg-button" type="primary" onClick={() => this.visibleDivisonModal()}>+ {AppConstants.addDivisionsAndGrades}</Button>
                    </div>

                </div>
                <div className="row  ml-4 pb-5">
                    <div className="col-sm-3 division" >
                        <InputWithHead required={"required-field pb-0 pt-0 "} heading={AppConstants.venue} />
                        <Form.Item  >
                            {getFieldDecorator('selectedVenues', { rules: [{ required: true, message: ValidationConstants.pleaseSelectvenue }] })(
                                <Select
                                    mode="multiple"
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={venueSelection => {
                                        this.onSelectValues(venueSelection, quickCompetitionState.selectedVenues)
                                    }}
                                    placeholder={AppConstants.selectVenue}
                                    filterOption={false}
                                    // onBlur={() => console.log("called")}
                                    onSearch={(value) => { this.handleSearch(value, appState.mainVenueList) }}
                                >
                                    {appState.venueList.length > 0 && appState.venueList.map((item) => {
                                        return (
                                            <Option
                                                key={item.id}
                                                value={item.id}>
                                                {item.name}</Option>
                                        )
                                    })}
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                </div>
                {this.dragableView()}
            </div >
        )
    }

    dragableView = () => {
        var dateMargin = 25;
        var dayMargin = 25;
        let topMargin = 0;
        let getStaticDrawsData = [{
            venueCourtNumber: 1, venueCourtName: "1", venueShortName: "Lots", slotsArray: [{
                drawsId: 12,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "3B",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#25ab85',
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
                drawsId: 13,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: "11A",
                awayTeamId: null,
                homeTeamName: "11A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'pink',
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
                drawsId: 25,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "15A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'blue',
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
                drawsId: 14,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "16A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'orange',
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
                drawsId: 12,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "17A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#282828',
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
                drawsId: 26,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "26L",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#875241',
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
                drawsId: 27,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "25T",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#279792',
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
                drawsId: 17,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "17D",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'red',
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
                drawsId: 59,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "25A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#859642',
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
                drawsId: 84,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "66A",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#628549',
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
                drawsId: 65,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "62F",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: '#279792',
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
                drawsId: 20,
                venueCourtNumber: 1,
                venueCourtName: null,
                venueShortName: null,
                matchDate: null,
                startTime: null,
                endTime: null,
                homeTeamId: null,
                awayTeamId: null,
                homeTeamName: "25S",
                awayTeamName: null,
                gradeName: null,
                competitionDivisionGradeId: null,
                divisionName: null,
                isLocked: 0,
                colorCode: 'green',
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
                homeTeamName: "PG8",
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
        },
        ]
        let dateArray = [{ time: "09:00" }, { time: "10:00" }, { time: "11:00" }, { time: "12:00" }]
        return (
            <div className="draggable-wrap draw-data-table">
                <div className="scroll-bar pb-4">
                    <div className="table-head-wrap">
                        <div className="tablehead-row-fixture ">
                            <div className="sr-no empty-bx"></div>
                            {dateArray.map((date, index) => {
                                if (index !== 0) {
                                    dayMargin += 75;
                                }
                                return (
                                    <span key={"key" + index} style={{ left: dayMargin }}>{date.time}</span>
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
                            <div key={index + "courtkey"}>
                                <div className="fixture-sr-no"> {index + 1}</div>
                                {courtData.slotsArray.map((slotObject, slotIndex) => {
                                    if (slotIndex !== 0) {
                                        leftMargin += 75;
                                    }
                                    return (
                                        <div key={slotIndex + "slotkey"}>
                                            <span
                                                key={slotIndex + "key"}
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
                                                <CompetitionSwappable
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
                                                </CompetitionSwappable>
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
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="row" >
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <Button type="cancel-button">{AppConstants.back}</Button>
                        </div>
                    </div>
                    <div className="col-sm" >
                        <div className="comp-buttons-view">
                            <Button className="save-draft-text" htmlType="submit" type="save-draft-text">{AppConstants.saveAsDraft}</Button>
                            <Button className="open-reg-button" type="primary">{AppConstants.addTeams}</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"2"} />
                <Loader visible={this.props.quickCompetitionState.onQuickCompLoad} />
                <Layout className="comp-dash-table-view">

                    {/* <div className="comp-draw-head-content-view"> */}
                    {this.headerView(getFieldDecorator)}
                    <Form
                        onSubmit={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        <Content>
                            {this.contentView(getFieldDecorator)}
                        </Content>
                        {/* </div> */}
                        <Footer >
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>

            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getVenuesTypeAction,
        searchVenueList,
        clearFilter,
        updateQuickCompetitionData,
        getYearAndQuickCompetitionAction,
        updateTimeSlot,
        quickCompetitionInit,
        updateDivision,
        updateCompetition,
        createQuickCompetitionAction,
        saveQuickCompDivisionAction,
        getQuickCompetitionAction, updateQuickCompetitionAction, quickCompetitionTimeSlotData,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        quickCompetitionState: state.QuickCompetitionState,
        commonState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionQuickCompetition));