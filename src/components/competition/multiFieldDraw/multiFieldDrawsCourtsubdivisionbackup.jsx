import React, { Component } from "react";
import { Layout, Button, Tooltip, Menu, Select, DatePicker, Checkbox, message, Spin, Modal, Radio } from "antd";
import InnerHorizontalMenu from "../../../pages/innerHorizontalMenu";
import DashboardLayout from "../../../pages/dashboardLayout";
import AppConstants from "../../../themes/appConstants";
import history from "../../../util/history";
import { NavLink } from 'react-router-dom';
import DrawsPublishModel from '../../../customComponents/drawsPublishModel'
// import _ from "lodash";
import loadjs from 'loadjs';
import moment from 'moment';
import AppImages from "../../../themes/appImages";
import Swappable from '../../../customComponents/SwappableComponent';
import { randomKeyGen } from '../../../util/helpers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    // getDayName,
    getTime
} from '../../../themes/dateformate';
import Loader from '../../../customComponents/loader';
import {
    getCompetitionDrawsAction,
    getDrawsRoundsAction,
    updateCompetitionDraws,
    updateCompetitionDrawsSwapLoadAction,
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
    setTimelineModeAction,
} from '../../../store/actions/competitionModuleAction/competitionMultiDrawsAction';
import {
    getYearAndCompetitionOwnAction,
    getVenuesTypeAction,
} from '../../../store/actions/appAction';
import { generateDrawAction } from '../../../store/actions/competitionModuleAction/competitionModuleAction';
import {
    setGlobalYear, getGlobalYear,
    setOwn_competition,
    getOwn_competition,
    setDraws_venue,
    setDraws_round,
    setDraws_roundTime,
    getDraws_venue,
    getDraws_round,
    getDraws_roundTime,
    setDraws_division_grade,
    // getDraws_division_grade,
    getOrganisationData,
    getOwn_competitionStatus,
    setOwn_competitionStatus,
    // getOwn_CompetitionFinalRefId,
    setOwn_CompetitionFinalRefId,
    setLiveScoreUmpireCompition,
    setLiveScoreUmpireCompitionData
} from '../../../util/sessionStorage';
import ValidationConstants from '../../../themes/validationConstant';
import DrawConstant from '../../../themes/drawConstant';
import '../draws.scss';
import getColor from "../../../util/coloredCheckbox";
import {getDate,checkDate} from "../../../util/drawUtil";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Footer, Content } = Layout;
const { SubMenu } = Menu;
const { confirm } = Modal;

class MultifieldDrawsCourtOverview extends Component {
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
            //organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
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
            
            editedDraw:{
                draws:[],
                apiData:null
            },
            switchDrawNameFields:DrawConstant.switchDrawNameFields,
            switchDrawTimeFields:DrawConstant.switchDrawTimeFields,
        };
       
    }

    componentDidUpdate(nextProps) {
       console.log("componentDidUpdate");
    }

    componentDidMount() {
        
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
        // let drawData = this.props.drawsState.getStaticDrawsData;
        let sourceObejct = drawData[sourceXIndex].slotsArray[sourceYIndex];
        let targetObject = drawData[targetXIndex].slotsArray[targetYIndex];
        let sourceSlotHeightUnit=8;
        let targetSlotHeightUnit=8;
        if(sourceObejct.subCourt){
            sourceSlotHeightUnit=DrawConstant.subCourtHeightUnit[sourceObejct.subCourt];
        }
        if(targetObject.subCourt){
            targetSlotHeightUnit=DrawConstant.subCourtHeightUnit[targetObject.subCourt];
        }
        if(targetSlotHeightUnit<sourceSlotHeightUnit){
            //no enough space
            return;
        }
        if (sourceObejct.drawsId !== null && targetObject.drawsId !== null) {
            this.updateCompetitionDraws(
                sourceObejct,
                targetObject,
                sourceIndexArray,
                targetIndexArray,
                drawData,
                round_Id,
                sourceObejct.duplicate, targetObject.duplicate
            );
        } else if (sourceObejct.drawsId == null && targetObject.drawsId == null) {
        } else {
            this.updateCompetitionNullDraws(
                sourceObejct,
                targetObject,
                sourceIndexArray,
                targetIndexArray,
                drawData,
                round_Id
            );
        }
    }

    getColumnData = (indexArray, drawData) => {
        let xIndex=indexArray[0];
        let yIndex = indexArray[1];
        let object = null;

        for (let i in drawData) {
            let slot = drawData[i].slotsArray[yIndex];
            if (slot.drawsId !== null) {
                object = slot;
                break;
            }
        }
        if(!object){            
            //empty slot has incorrect start time
            object=drawData[xIndex].slotsArray[yIndex];
            this.correctWrongDate(object,yIndex);

        }
        return object;
    };
    correctWrongDate=(slot,slotIndex)=>{
        const slotDate = moment(slot.matchDate);
        const slotEnd = moment(getDate(slot.matchDate) + slot.endTime);
        const isCorrectStart = slotEnd.isAfter(slotDate);
        if(!isCorrectStart){
            if(this.props.drawsState.getRoundsDrawsdata.length>0){
                const dateAxis=this.props.drawsState.getRoundsDrawsdata[0].dateNewArray[slotIndex];
                slot.matchDate=dateAxis.date;
                slot.startTime=moment(slot.matchDate).format('HH:mm');
                slot.endTime=dateAxis.endTime;
            }           
        }
    }

    ///////update the competition draws on  swapping and hitting update Apis if both has value
    updateCompetitionDraws = (
        sourceObejct,
        targetObject,
        sourceIndexArray,
        targetIndexArray,
        drawData,
        round_Id, sourceDuplicate, targetDuplicate
    ) => {
        
        let customSourceObject = {
            // drawsId: sourceObejct.drawsId,
            drawsId: targetObject.drawsId,
            homeTeamId: sourceObejct.homeTeamId,
            awayTeamId: sourceObejct.awayTeamId,
            competitionDivisionGradeId: sourceObejct.competitionDivisionGradeId,
            isLocked: 1,
        };
        let customTargetObject = {
            // drawsId: targetObject.drawsId,
            drawsId: sourceObejct.drawsId,
            homeTeamId: targetObject.homeTeamId,
            awayTeamId: targetObject.awayTeamId,
            // homeTeamId: 268,
            // awayTeamId: 262,
            competitionDivisionGradeId: targetObject.competitionDivisionGradeId,
            isLocked: 1,
        };
       
        this.updateEditDrawArray(customSourceObject);
        this.updateEditDrawArray(customTargetObject);

        const sourceXIndex = sourceIndexArray[0];
        const sourceYIndex = sourceIndexArray[1];
        const targetXIndex = targetIndexArray[0];
        const targetYIndex = targetIndexArray[1];
             
        let newSourceObj={...sourceObejct, ...customTargetObject};
        Object.keys(this.props.switchDrawNameFields).forEach(key => newSourceObj[key] = targetObject[key]);         
        
        let newTargetObj={...targetObject, ...customSourceObject};
        Object.keys(this.props.switchDrawNameFields).forEach(key => newTargetObj[key] = sourceObejct[key]); 

        drawData[sourceXIndex].slotsArray[sourceYIndex]=newSourceObj;
        drawData[targetXIndex].slotsArray[targetYIndex]=newTargetObj;
        //this.props.updateCompetitionDrawsSwapLoadAction();       
        this.setState({redraw:true });
        
    };
    updateEditDrawArray(draw){
        const editdraw= this.props.editedDraw;        
        const drawExistsIndex=editdraw.draws.findIndex(d=>d.drawsId==draw.drawsId);
        if(drawExistsIndex>-1){
            editdraw.draws[drawExistsIndex]={...editdraw.draws[drawExistsIndex], ...draw};
        }else{
            editdraw.draws.push(draw);
        }
    }
    ///////update the competition draws on  swapping and hitting update Apis if one has N/A(null)
    updateCompetitionNullDraws = (
        sourceObejct,
        targetObject,
        sourceIndexArray,
        targetIndexArray,
        drawData,
        round_Id
    ) => {
        let updatedKey = this.props.firstTimeCompId === "-1" || this.props.filterDates ? "all" : "add"
        let postData = null;
        if (sourceObejct.drawsId == null) {
            let columnObject = this.getColumnData(sourceIndexArray, drawData);
            postData = {
                drawsId: targetObject.drawsId,
                venueCourtId: sourceObejct.venueCourtId,
                matchDate: moment(columnObject.matchDate).format('YYYY-MM-DD HH:mm'),
                startTime: columnObject.startTime,
                endTime: columnObject.endTime,
            };
        } else {
            let columnObject = this.getColumnData(targetIndexArray, drawData);
            postData = {
                drawsId: sourceObejct.drawsId,
                venueCourtId: targetObject.venueCourtId,
                matchDate: moment(columnObject.matchDate).format('YYYY-MM-DD HH:mm'),
                startTime: columnObject.startTime,
                endTime: columnObject.endTime,
            };
        }

        this.updateEditDrawArray(postData);

        const sourceXIndex = sourceIndexArray[0];
        const sourceYIndex = sourceIndexArray[1];
        const targetXIndex = targetIndexArray[0];
        const targetYIndex = targetIndexArray[1];
        const newSourceObj = JSON.parse(JSON.stringify(targetObject));
        const newTargetObj = JSON.parse(JSON.stringify(sourceObejct));
        
        Object.keys(this.props.switchDrawTimeFields).forEach(key => newSourceObj[key] = sourceObejct[key]);
        newSourceObj.subCourt=sourceObejct.subCourt;
        Object.keys(this.props.switchDrawTimeFields).forEach(key => newTargetObj[key] = targetObject[key]); 
        let sourceSlotHeightUnit=8;
        let targetSlotHeightUnit=8;
        if(sourceObejct.subCourt){
            sourceSlotHeightUnit=DrawConstant.subCourtHeightUnit[sourceObejct.subCourt];
        }
        if(targetObject.subCourt){
            targetSlotHeightUnit=DrawConstant.subCourtHeightUnit[targetObject.subCourt];
        }
        
        if(targetSlotHeightUnit>sourceSlotHeightUnit){
            newTargetObj.subCourt=sourceObejct.subCourt;
            //fill up remaining empty space
           // let emptyDraw={...this.state.emptySlot};
           // Object.keys(this.state.emptySlotFieldUpdate).forEach(key => emptyDraw[key] = draw[key]); 
          //  drawData[targetXIndex].slotsArray.splice(targetYIndex,0,)
        }
        
        newSourceObj.slotId= randomKeyGen(5); //update key to update ui
        newTargetObj.slotId= randomKeyGen(5);

        drawData[sourceXIndex].slotsArray[sourceYIndex]=newSourceObj;
        drawData[targetXIndex].slotsArray[targetYIndex]=newTargetObj;
        //this.props.updateCompetitionDrawsSwapLoadAction();  
        this.setState({  redraw:true });
    };

   

    checkColor(slot) {
        let checkDivisionFalse = this.props.firstTimeCompId == "-1" || this.props.filterDates ? this.checkAllDivisionData() : this.checkAllCompetitionData(this.props.drawsState.divisionGradeNameList, 'competitionDivisionGradeId')
        let checkCompetitionFalse = this.props.firstTimeCompId == "-1" || this.props.filterDates ? this.checkAllCompetitionData(this.props.drawsState.drawsCompetitionArray, "competitionName") : []
        let checkVenueFalse = this.checkAllCompetitionData(this.props.drawsState.competitionVenues, "id")
        let checkOrganisationFalse = this.checkAllCompetitionData(this.props.drawsState.drawOrganisations, "organisationUniqueKey")
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
        }
        return uncheckedArr
    }

    checkSwap(slot) {
        let checkDivisionFalse = this.props.firstTimeCompId == "-1" ? this.checkAllDivisionData() : this.checkAllCompetitionData(this.props.drawsState.divisionGradeNameList, 'competitionDivisionGradeId')
        let checkCompetitionFalse = this.props.firstTimeCompId == "-1" ? this.checkAllCompetitionData(this.props.drawsState.drawsCompetitionArray, "competitionName") : []
        let checkVenueFalse = this.checkAllCompetitionData(this.props.drawsState.competitionVenues, "id")
        let checkOrganisationFalse = this.checkAllCompetitionData(this.props.drawsState.drawOrganisations, "organisationUniqueKey")
        let disabledStatus = this.props.competitionStatus == 1
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

   


    //unlockDraws
    unlockDraws(id, round_Id, venueCourtId) {
        let key = this.props.firstTimeCompId == "-1" || this.props.filterDates ? 'all' : "singleCompetition"
        this.props.unlockDrawsAction(id, round_Id, venueCourtId, key);
    }




    render() {
        let dateItem=this.props.dateItem;
        let disabledStatus = this.props.competitionStatus == 1
        var dateMargin = 25;
        var dayMargin = 25;
        let topMargin = 0;
        let globalTopMargin=0;
        let heightBase=30;
        const allSubCourts= Object.keys(DrawConstant.subCourtHeightUnit);
        // let legendsData = isArrayNotEmpty(this.props.drawsState.legendsArray) ? this.props.drawsState.legendsArray : [];
        return (
            <>
                <div className="scroll-bar pb-4" style={{ width: dateItem.dateNewArray.length > 0 && dateItem.dateNewArray.length * 140, minWidth: 1080 }}>
                    <div className="table-head-wrap">
                        {/* Day name list */}
                        <div className="tablehead-row">
                            <div className="sr-no empty-bx" />
                            {dateItem.dateNewArray.map((item, index) => {
                                if (index !== 0) {
                                    dateMargin += 110;
                                }
                                if (index == 0) {
                                    dateMargin = 70;
                                }
                                return (
                                    <span key={"day" + index} style={{ left: dateMargin }}>
                                        {item.notInDraw == false ? checkDate(item.date, index, dateItem.dateNewArray) : ''}
                                    </span>
                                );
                            })}
                        </div>
                        {/* Times list */}
                        <div className="tablehead-row">
                            <div className="sr-no empty-bx" />

                            {dateItem.dateNewArray.map((item, index) => {
                                if (index !== 0) {
                                    dayMargin += 110;
                                }
                                if (index == 0) {
                                    dayMargin = 70;
                                }
                                return (
                                    <span
                                        key={"time" + index}
                                        style={{
                                            left: dayMargin,
                                            fontSize: item.notInDraw !== false && 11,
                                        }}
                                    >
                                        {item.notInDraw == false ? getTime(item.date) : 'Not in draw'}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="main-canvas Draws">
                    {dateItem.draws.map((courtData, index) => {
                        let leftMargin = 25;
                        let slotTopMargin=0;
                        if (index !== 0) {
                            slotTopMargin = globalTopMargin;
                        }
                        globalTopMargin+=70;
                        let height=heightBase;
                        let hasCourtSubDivision= true; //courtData.slotsArray.some(d=>d.subCourt && allSubCourts.includes(d.subCourt) );
                        if(hasCourtSubDivision){
                            height=heightBase*8;
                            globalTopMargin+=heightBase*7;
                        }
                        return (
                            <>
                                <div key={"court" + index} className="sr-no" style={{ height: height }}>
                                    <div className="venueCourt-tex-div">
                                        <span className="venueCourt-text">
                                            {courtData.venueShortName + '-' + courtData.venueCourtNumber}
                                        </span>
                                    </div>
                                </div>
                                {courtData.slotsArray.map((slotObject, slotIndex) => {
                                    topMargin=slotTopMargin;
                                    let isSameTimeSlot=false;
                                    let slotHeightUnit=8;
                                    let slotHeight=heightBase-14;
                                    let slotHasSubCourt=true;
                                    if (slotIndex !== 0) {                                        
                                        if(slotObject.subCourt && allSubCourts.includes(slotObject.subCourt)){
                                            //slotHasSubCourt=true;
                                            slotHeightUnit=DrawConstant.subCourtHeightUnit[slotObject.subCourt];
                                            let previousSlot= courtData.slotsArray[slotIndex-1];
                                            if(previousSlot.matchDate==slotObject.matchDate){
                                                isSameTimeSlot=true;                                               
                                                topMargin+=heightBase*DrawConstant.subCourtHeightUnit[previousSlot.subCourt];                                               
                                            }       
                                        }
                                        if(!isSameTimeSlot){
                                           leftMargin += 110;
                                        }
                                    }
                                    if (slotIndex == 0) {
                                        leftMargin = 70;
                                        if(slotObject.subCourt && allSubCourts.includes(slotObject.subCourt)){
                                           //slotHasSubCourt=true;
                                           slotHeightUnit=DrawConstant.subCourtHeightUnit[slotObject.subCourt];
                                        }
                                    }
                                    if(slotHasSubCourt){
                                        slotHeight= heightBase*slotHeightUnit -21; // minus box exception height and margin
                                    }
                                    let slotKey="slot" + slotIndex;
                                    if(slotObject.slotId){
                                        slotKey+=slotObject.slotId;
                                        if(index==3) console.log(slotKey);
                                    }
                                    if(slotIndex==0 && index==3){
                                        console.log("------");
                                    }
                                    
                                    return (
                                        <div key={slotKey} >
                                            <span
                                                style={{ left: leftMargin, top: topMargin }}
                                                className={slotObject.duplicate ? 'borderDuplicate' : 'border'}
                                            />
                                            <div
                                                className={slotObject.duplicate ? slotObject.colorCode == "#EA0628" ? 'box purple-bg boxPink' : 'box purple-bg boxDuplicate' : 'box purple-bg'}
                                                style={{
                                                    backgroundColor: this.checkColor(slotObject),
                                                    left: leftMargin,
                                                    top: topMargin,
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    cursor: disabledStatus && "no-drop",
                                                    height: slotHeight
                                                }}
                                            >
                                                {this.props.firstTimeCompId == "-1" || this.props.filterDates ? (
                                                    <Swappable
                                                        // duplicateDropzoneId={slotObject.duplicate && "duplicateDropzoneId"}
                                                        // duplicateDragableId={slotObject.duplicate && "duplicateDragableId"}
                                                        // duplicateDropzoneId={"boxDuplicate"}
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
                                                                "1"
                                                            )
                                                        }
                                                    >
                                                        {slotObject.drawsId != null ? (
                                                            <span>
                                                                {slotObject.homeTeamName} <br />
                                                                {slotObject.awayTeamName}
                                                            </span>
                                                        ) : (
                                                                <span>Free</span>
                                                            )}
                                                    </Swappable>
                                                ) : (
                                                        <Swappable
                                                            duplicateDropzoneId={slotObject.duplicate && "duplicateDropzoneId"}
                                                            duplicateDragableId={slotObject.duplicate && "duplicateDragableId"}
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
                                                                    dateItem.roundId
                                                                )
                                                            }
                                                        >
                                                            {slotObject.drawsId != null ? (
                                                                <span>
                                                                    {slotObject.homeTeamName} <br />
                                                                    {slotObject.awayTeamName}
                                                                </span>
                                                            ) : (
                                                                    <span>Free</span>
                                                                )}
                                                        </Swappable>
                                                    )}
                                            </div>

                                            {slotObject.drawsId !== null && (
                                                <div
                                                    className="box-exception"
                                                    style={{
                                                        left: leftMargin,
                                                        top: topMargin + slotHeight+2,
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap',
                                                        marginLeft: slotObject.isLocked == 1 && -10
                                                    }}
                                                >
                                                    <Menu
                                                        className="action-triple-dot-draws"
                                                        theme="light"
                                                        mode="horizontal"
                                                        style={{
                                                            lineHeight: '16px',
                                                            borderBottom: 0,
                                                            cursor: disabledStatus && "no-drop",
                                                            display: slotObject.isLocked !== 1 && "flex",
                                                            justifyContent: slotObject.isLocked !== 1 && "center"
                                                        }}
                                                    >
                                                        <SubMenu
                                                            disabled={disabledStatus}
                                                            // style={{ borderBottomStyle: "solid", borderBottom: 2 }}
                                                            key="sub1"
                                                            title={
                                                                slotObject.isLocked == 1 ? (
                                                                    <div className="d-flex justify-content-between" style={{ width: 80, maxWidth: 80 }}>
                                                                        <img
                                                                            className="dot-image"
                                                                            src={AppImages.drawsLock}
                                                                            alt=""
                                                                            width="16"
                                                                            height="10"
                                                                        />
                                                                        <img
                                                                            className="dot-image"
                                                                            src={AppImages.moreTripleDot}
                                                                            alt=""
                                                                            width="16"
                                                                            height="10"
                                                                        />
                                                                    </div>
                                                                ) : (
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
                                                                    onClick={() => this.props.firstTimeCompId == "-1" || this.props.filterDates
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
                                                                            yearRefId: this.props.yearRefId,
                                                                            competitionId: this.props.firstTimeCompId,
                                                                            organisationId: this.props.organisationId,
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
                                    );
                                })}
                            </>
                        );
                    })}
                </div>
            </>
        );
    };

}


export default MultifieldDrawsCourtOverview;
