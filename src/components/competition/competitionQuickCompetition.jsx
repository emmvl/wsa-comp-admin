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
import {
    getVenuesTypeAction,
    searchVenueList,
    clearFilter,
} from "../../store/actions/appAction";
import InputWithHead from "../../customComponents/InputWithHead";
import ValidationConstants from "../../themes/validationConstant";
import TimeSlotModal from "../../customComponents/timslotModal"
import CompetitionModal from "../../customComponents/competitionModal"
import DivisionGradeModal from "../../customComponents/divisionGradeModal"
import {
    updateQuickCompetitionData, updateTimeSlot, updateDivision, updateCompetition,
    createQuickCompetitionAction,
    saveQuickCompDivisionAction, getYearAndQuickCompetitionAction, getQuickCompetitionAction,
    quickCompetitionTimeSlotData, updateQuickCompetitionAction, updateQuickCompetitionDraws
} from "../../store/actions/competitionModuleAction/competitionQuickAction"
import { quickCompetitionInit } from "../../store/actions/commonAction/commonAction"
import { getDayName, getTime } from '../../themes/dateformate';
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
            quickCompetitionLoad: false,
            onloadData: false,
            buttonPressed: ""
        }
        this.props.updateCompetition("", "allData")
        this.props.getVenuesTypeAction()
        this.props.getYearAndQuickCompetitionAction(
            this.props.quickCompetitionState.quick_CompetitionYearArr,
            null,
        );
    }


    componentDidMount() {
        let body = {
            Day: "Day"
        }
        this.props.quickCompetitionInit(body)
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
        const { postDivisionData, postTimeslotData, postDraws } = this.props.quickCompetitionState
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.firstTimeCompId.length > 0) {
                    if (postDivisionData.length > 0 && postTimeslotData.length > 0) {
                        let payload = {
                            "competitionId": this.state.firstTimeCompId,
                            "competitionName": quickCompetitionData.competitionName,
                            "competitionVenues": quickCompetitionData.competitionVenues,
                            "draws": postDraws
                        }

                        // console.log(postDraws)
                        this.props.updateQuickCompetitionAction(payload, this.state.yearRefId, this.state.buttonPressed)
                    }
                    else {
                        message.config({
                            maxCount: 1, duration: 1
                        })
                        message.warning(ValidationConstants.divisionAndTimeslot)
                    }
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

    /// set field values
    setFieldValues() {
        let quickCompetitionData = this.props.quickCompetitionState.quickComptitionDetails
        let selectedVenues = this.props.quickCompetitionState.selectedVenues
        this.props.form.setFieldsValue({
            "competition_name": quickCompetitionData.competitionName,
            selectedVenues: selectedVenues
        })
    }
    // onChange = e => {
    //     this.setState({
    //         value: e.target.value,
    //     });
    // };

    // change selected competition
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

    //change selected year 
    onYearChange(yearRefId) {
        this.props.updateCompetition("", "allData")
        this.setState({
            yearRefId, firstTimeCompId: ""
        })
        this.props.getYearAndQuickCompetitionAction(
            this.props.quickCompetitionState.quick_CompetitionYearArr,
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
                <div className="col-sm-2 pb-3">
                    <span className="input-heading-add-another pt-0" onClick={() => this.visibleCompetitionModal()}>+{AppConstants.addNew}</span>
                </div>
            </div>
            <div className="row pb-3" >
                <div className="col-sm-3 pb-3">
                    <div
                        style={{
                            width: "fit-content",
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 50,
                        }}
                    >
                        <span className="year-select-heading">{AppConstants.year}:</span>
                        <Select
                            name={'yearRefId'}
                            className="year-select reg-filter-select-year ml-2"
                            // style={{ width: 90 }}
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
                <div className="col-sm-3 pb-3">
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
                            // style={{ minWidth: 200 }}
                            className="year-select reg-filter-select-competition ml-2"
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
                changeDivision={(index, e) => this.props.updateDivision("divisionName", index, null, e.target.value)}
                changeTeam={(index, gradeIndex, value) => this.props.updateDivision("noOfTeams", index, gradeIndex, value)}
                addDivision={(index) => this.props.updateDivision("addDivision", index)}
                addGrade={(index) => this.props.updateDivision("addGrade", index)}
                removegrade={(index, gradeIndex) => this.props.updateDivision("removeGrade", index, gradeIndex)}
                changegrade={(index, gradeIndex, e) => this.props.updateDivision("gradeName", index, gradeIndex, e.target.value)}
                removeDivision={(index, gradeIndex) => this.props.updateDivision("removeDivision", index, gradeIndex)}
            />
        </div >
        )
    }
    // handle divison api
    handleOK = () => {
        let competitionId = this.state.firstTimeCompId
        let division = this.props.quickCompetitionState.division
        this.props.saveQuickCompDivisionAction(competitionId, division, this.state.yearRefId, this.props.quickCompetitionState.quickComptitionDetails.competitionName)
        this.setState({
            visibleDivisionModal: false
        }
        )
    }

    //close timeslot modal and call timeslot api
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
            competitionTimeslotId: this.props.quickCompetitionState.timeSlotId,
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
        this.props.quickCompetitionTimeSlotData(body, this.state.yearRefId, this.state.firstTimeCompId, this.props.quickCompetitionState.quickComptitionDetails.competitionName
        )
        this.setState({
            timeSlotVisible: false
        })
    }

    //close division modal on press cancel button in division modal
    divisionModalClose = () => {
        this.props.updateDivision("swap")
        this.setState({
            visibleDivisionModal: false
        })
    }

    //close compModalClose on press cancel button
    compModalClose = () => {
        this.setState({
            visibleCompModal: false
        })
    }
    //close competition modal and call create competition
    closeCompModal = () => {
        const { competitionName, competitionDate } = this.props.quickCompetitionState
        this.props.createQuickCompetitionAction(this.state.yearRefId, competitionName, competitionDate)
        this.setState({
            visibleCompModal: false
        })
    }

    ///close timeslot modal
    handleCancel = () => {
        this.props.updateTimeSlot("swapTimeslot")
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



    /// on swap grip view component
    async onSwap(source, target) {
        this.setState({ quickCompetitionLoad: true })
        let sourceIndexArray = source.split(':');
        let targetIndexArray = target.split(':');
        let sourceXIndex = sourceIndexArray[0];
        let sourceYIndex = sourceIndexArray[1];
        let targetXIndex = targetIndexArray[0];
        let targetYIndex = targetIndexArray[1];
        if (sourceXIndex === targetXIndex && sourceYIndex === targetYIndex) {
            return;
        }
        let drawData = this.props.quickCompetitionState.quickComptitionDetails.draws
        let sourceObejct = drawData[sourceXIndex].slotsArray[sourceYIndex];
        let targetObject = drawData[targetXIndex].slotsArray[targetYIndex];

        if (sourceObejct.drawsId !== null && targetObject.drawsId !== null) {
            console.log(sourceObejct, targetObject)
            await this.props.updateQuickCompetitionDraws(sourceIndexArray, targetIndexArray, sourceObejct.drawsId, targetObject.drawsId)
        }
        else if (sourceObejct.drawsId == null && targetObject.drawsId == null) {
            return
        }
        else {
            if (sourceObejct.drawsId == null) {
                await this.props.updateQuickCompetitionDraws(sourceIndexArray, targetIndexArray, sourceObejct.drawsId, targetObject.drawsId, sourceObejct, 'free')
            }
            if (targetObject.drawsId == null) {
                await this.props.updateQuickCompetitionDraws(sourceIndexArray, targetIndexArray, sourceObejct.drawsId, targetObject.drawsId, targetObject, 'free')
            }
        }

        setTimeout(() => {
            this.setState({ quickCompetitionLoad: false })
        }, 100);
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
                                { rules: [{ required: true, message: ValidationConstants.competitionNameIsRequired }] })(
                                    <InputWithHead
                                        required={"required-field pb-0 pt-0"}
                                        placeholder={AppConstants.competition_name}
                                        onChange={(e) => this.props.updateQuickCompetitionData(
                                            captializedString(e.target.value), "competitionName")}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            'competition_name': captializedString(i.target.value)
                                        })}

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
                {
                    this.state.quickCompetitionLoad ?
                        <div>
                            {this.draggableView()}
                        </div>
                        :
                        this.draggableView()
                }

            </div >
        )
    }
    // grid view 
    draggableView = () => {
        var dateMargin = 80;
        var dayMargin = 80;
        let topMargin = 0;
        let getStaticDrawsData = this.props.quickCompetitionState.quickComptitionDetails.draws
        let dateArray = this.props.quickCompetitionState.quickComptitionDetails.dateNewArray
        console.log(this.props.quickCompetitionState)
        return (
            <div className="draggable-wrap draw-data-table">
                <div className="scroll-bar pb-4">
                    <div className="table-head-wrap">
                        <div className="tablehead-row-fixture ">
                            <div className="sr-no empty-bx"></div>
                            {dateArray.map((dateItem, index) => {
                                console.log(dateArray)
                                if (index !== 0) {
                                    dateMargin += 75;
                                }
                                return (
                                    <span key={"key" + index} style={{ left: dateMargin }}>
                                        {dateItem.notInDraw == false ? getDayName(dateItem.date) : ''}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="tablehead-row-fixture ">
                            <div className="sr-no empty-bx"></div>
                            {dateArray.length > 0 &&
                                dateArray.map((item, index) => {
                                    if (index !== 0) {
                                        dayMargin += 75;
                                    }
                                    return (
                                        <span key={"time" + index}
                                            style={{
                                                left: dayMargin,
                                                fontSize: item.notInDraw !== false && 10,
                                            }}
                                        >
                                            {item.notInDraw == false
                                                ? getTime(item.date)
                                                : 'Not in draw'}
                                            {/* {getTime(item.date)} */}
                                        </span>
                                    );
                                })}
                        </div>
                    </div>
                </div>

                <div className="main-canvas Draws">
                    {getStaticDrawsData.map((courtData, index) => {
                        let leftMargin = 80;
                        if (index !== 0) {
                            topMargin += 50;
                        }
                        return (
                            <div key={index + "courtkey"}>
                                <div className="quick-comp-canvas" >
                                    <div className="venueCourt-tex-div" style={{ width: 80 }}>
                                        <span className="venueCourt-text">
                                            {courtData.venueShortName + '-' + courtData.venueCourtNumber}
                                        </span>
                                    </div>
                                </div>
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
                                                    onSwap={(source, target, ) => {
                                                        console.log(source, target)
                                                        return (
                                                            this.onSwap(
                                                                source,
                                                                target,
                                                            ))
                                                    }}
                                                >
                                                    {slotObject.drawsId != null ? (
                                                        <span>
                                                            {slotObject.divisionName + "-" + slotObject.gradeName}
                                                        </span>
                                                    ) : (
                                                            <span>Free</span>
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

    // footer view
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="row" >
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            {/* <Button type="cancel-button">{AppConstants.back}</Button> */}
                        </div>
                    </div>
                    <div className="col-sm" >
                        <div className="comp-buttons-view">
                            <Button className="save-draft-text" htmlType="submit" type="save-draft-text" style={{ width: 160 }}
                                onClick={() => this.setState({ buttonPressed: "saveDraft" })}>{AppConstants.generateFixtures}</Button>
                            <Button className="open-reg-button" htmlType="submit" type="primary"
                                onClick={() => this.setState({ buttonPressed: "AddTeam" })}>
                                {AppConstants.addTeams}</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    /// render function 
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
        getQuickCompetitionAction,
        updateQuickCompetitionAction, quickCompetitionTimeSlotData,
        updateQuickCompetitionDraws
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