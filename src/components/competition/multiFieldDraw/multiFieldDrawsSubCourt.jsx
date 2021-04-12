import moment from 'moment';
import React, { Component } from "react";
import {
    // getDayName,
    getTime
} from '../../../themes/dateformate';
import DrawConstant from '../../../themes/drawConstant';
import { checkDate, getDate, sortSlot, getEndTime } from "../../../util/drawUtil";
import { randomKeyGen } from '../../../util/helpers';
import '../draws.scss';
import MultiFieldDrawsCourtExpand from "./multiFieldDrawsCourtExpand";
import MultiFieldDrawsCourtGroup from "./multiFieldDrawsCourtGroup";


class MultiFieldDrawsSubCourt extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidUpdate(nextProps) {

    }

    componentDidMount() {

    }


    checkCurrentSwapObjects = (source, target, drawData) => {
        let sourceIndexArray = source.split(':');
        let targetIndexArray = target.split(':');
        let sourceXIndex = sourceIndexArray[0];
        let sourceYIndex = sourceIndexArray[1];
        let targetXIndex = targetIndexArray[0];
        let targetYIndex = targetIndexArray[1];
        if (sourceXIndex === targetXIndex && sourceYIndex === targetYIndex) {
            return false;
        }
        let sourceObject = drawData[sourceXIndex].slotsArray[sourceYIndex];
        let targetObject = drawData[targetXIndex].slotsArray[targetYIndex];
        if (sourceObject.drawsId == null && targetObject.drawsId == null) {
            return false;
        }
        if (!!drawData[sourceXIndex].isExpanded != !!drawData[targetXIndex].isExpanded) {
            return false;
        }
        if (drawData[sourceXIndex].isExpanded && drawData[targetXIndex].isExpanded) {
            let sourceSlotHeightUnit = 8;
            let targetSlotHeightUnit = 8;
            if (sourceObject.subCourt) {
                sourceSlotHeightUnit = DrawConstant.subCourtHeightUnit[sourceObject.subCourt];
            }
            if (targetObject.subCourt) {
                targetSlotHeightUnit = DrawConstant.subCourtHeightUnit[targetObject.subCourt];
            }
            if (sourceObject.drawsId !== null && targetObject.drawsId !== null) {
                if (sourceSlotHeightUnit != targetSlotHeightUnit) {
                    //only allow same size swap, can be changed to allow if there is enough empty space
                    return false;
                }
            }

            if (sourceObject.subCourt && targetObject.subCourt && sourceSlotHeightUnit != targetSlotHeightUnit) {
                //no enough space
                return false;
            }
            if (sourceSlotHeightUnit == 8 && targetSlotHeightUnit != 8) {
                //not from whole empty court to subcourt
                return false;
            }
        }

        return true;
    }
    onSwap = (source, target, drawData, round_Id) => {
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
        let sourceObject = drawData[sourceXIndex].slotsArray[sourceYIndex];
        let targetObject = drawData[targetXIndex].slotsArray[targetYIndex];

        if (sourceObject.drawsId !== null && targetObject.drawsId !== null) {
            this.updateCompetitionDraws(
                sourceObject,
                targetObject,
                sourceIndexArray,
                targetIndexArray,
                drawData,
                round_Id,
                sourceObject.duplicate, targetObject.duplicate
            );
        } else if (sourceObject.drawsId == null && targetObject.drawsId == null) {
        } else {
            this.updateCompetitionNullDraws(
                sourceObject,
                targetObject,
                sourceIndexArray,
                targetIndexArray,
                drawData,
                round_Id
            );
        }
    }

    ///////update the competition draws on  swapping and hitting update Apis if both has value
    updateCompetitionDraws = (
        sourceObject,
        targetObject,
        sourceIndexArray,
        targetIndexArray,
        drawData,
        round_Id, sourceDuplicate, targetDuplicate
    ) => {
        const sourceXIndex = sourceIndexArray[0];
        const sourceYIndex = sourceIndexArray[1];
        const targetXIndex = targetIndexArray[0];
        const targetYIndex = targetIndexArray[1];
        const newSourceObj = JSON.parse(JSON.stringify(targetObject));
        const newTargetObj = JSON.parse(JSON.stringify(sourceObject));
        let switchDrawTimeFieldKeys = Object.keys(DrawConstant.switchDrawTimeFields);
        switchDrawTimeFieldKeys.forEach(key => newSourceObj[key] = sourceObject[key]);
        switchDrawTimeFieldKeys.forEach(key => newTargetObj[key] = targetObject[key]);

        let postData = null;

        postData = {
            drawsId: targetObject.drawsId,
            venueCourtId: sourceObject.venueCourtId,
            matchDate: sourceObject.matchDate,
            startTime: sourceObject.startTime,
            endTime: getEndTime(sourceObject.matchDate, targetObject.minuteDuration), //keep slot duration
        };
        if (drawData[sourceXIndex].isExpanded) {
            postData.subCourt = sourceObject.subCourt;
        }
        newSourceObj.endTime = postData.endTime;
        this.updateEditDrawArray(postData);

        postData = {
            drawsId: sourceObject.drawsId,
            venueCourtId: targetObject.venueCourtId,
            matchDate: targetObject.matchDate,
            startTime: targetObject.startTime,
            endTime: getEndTime(targetObject.matchDate, sourceObject.minuteDuration),
        };
        if (drawData[sourceXIndex].isExpanded) {
            postData.subCourt = targetObject.subCourt;
        }
        newTargetObj.endTime = postData.endTime;
        this.updateEditDrawArray(postData);



        //newSourceObj.slotId = randomKeyGen(5); //update key to update ui
        //newTargetObj.slotId = randomKeyGen(5);
        drawData[sourceXIndex].slotsArray[sourceYIndex] = newSourceObj;
        drawData[targetXIndex].slotsArray[targetYIndex] = newTargetObj;
        if (drawData[sourceXIndex].isExpanded) {
            newSourceObj.subCourt = sourceObject.subCourt;
            newTargetObj.subCourt = targetObject.subCourt;

        } else {
            if (sourceObject.childSlots) {
                for (let childSlot of sourceObject.childSlots) {
                    switchDrawTimeFieldKeys.forEach(key => childSlot[key] = targetObject[key]);
                    if (childSlot.drawsId) {
                        let changedDraw = {
                            drawsId: childSlot.drawsId,
                            venueCourtId: childSlot.venueCourtId,
                            matchDate: childSlot.matchDate,
                            startTime: childSlot.startTime,
                            endTime: getEndTime(childSlot.matchDate, childSlot.minuteDuration),
                        }
                        this.updateEditDrawArray(changedDraw);
                    }
                }
                if (sourceXIndex == targetXIndex && (!targetObject.childSlots || targetObject.childSlots.length <= 1)) {
                    sortSlot(drawData[sourceXIndex].slotsArray);
                }

            }
            if (targetObject.childSlots) {
                for (let childSlot of targetObject.childSlots) {
                    switchDrawTimeFieldKeys.forEach(key => childSlot[key] = sourceObject[key]);
                    if (childSlot.drawsId) {
                        let changedDraw = {
                            drawsId: childSlot.drawsId,
                            venueCourtId: childSlot.venueCourtId,
                            matchDate: childSlot.matchDate,
                            startTime: childSlot.startTime,
                            endTime: getEndTime(childSlot.matchDate, childSlot.minuteDuration),
                        }
                        this.updateEditDrawArray(changedDraw);
                    }
                }
                if (sourceXIndex == targetXIndex) {
                    sortSlot(drawData[targetXIndex].slotsArray);
                }
            }
            if (sourceXIndex != targetXIndex) {
                let sourceRemoveLength = 1;
                let targetRemoveLength = 1;
                let sourceToAdd = [newSourceObj];
                let targetToAdd = [newTargetObj];
                if (sourceObject.childSlots) {
                    sourceRemoveLength = sourceObject.childSlots.length;
                    targetToAdd = sourceObject.childSlots;
                }
                if (targetObject.childSlots) {
                    targetRemoveLength = targetObject.childSlots.length;
                    sourceToAdd = targetObject.childSlots;
                }
                if (sourceToAdd.length > 1 || sourceRemoveLength > 1) {
                    drawData[sourceXIndex].slotsArray.splice(sourceYIndex, sourceRemoveLength, ...sourceToAdd);
                }
                if (targetToAdd.length > 1 || targetRemoveLength > 1) {
                    drawData[targetXIndex].slotsArray.splice(targetYIndex, targetRemoveLength, ...targetToAdd);
                }

            }

        }
        this.setState({ redraw: true });

    };
    updateEditDrawArray(draw) {
        const editdraw = this.props.editedDraw;
        const drawExistsIndex = editdraw.draws.findIndex(d => d.drawsId == draw.drawsId);
        if (drawExistsIndex > -1) {
            editdraw.draws[drawExistsIndex] = { ...editdraw.draws[drawExistsIndex], ...draw };
        } else {
            editdraw.draws.push(draw);
        }
    }

    ///////update the competition draws on  swapping and hitting update Apis if one has N/A(null)
    updateCompetitionNullDraws = (
        sourceObject,
        targetObject,
        sourceIndexArray,
        targetIndexArray,
        drawData,
        round_Id
    ) => {
        let updatedKey = this.props.firstTimeCompId === "-1" || this.props.filterDates ? "all" : "add";
        const sourceXIndex = sourceIndexArray[0];
        const sourceYIndex = sourceIndexArray[1];
        const targetXIndex = targetIndexArray[0];
        const targetYIndex = parseInt(targetIndexArray[1]);
        const newSourceObj = JSON.parse(JSON.stringify(targetObject));
        const newTargetObj = JSON.parse(JSON.stringify(sourceObject));
        let switchDrawTimeFieldKeys = Object.keys(DrawConstant.switchDrawTimeFields);
        switchDrawTimeFieldKeys.forEach(key => newSourceObj[key] = sourceObject[key]);
        switchDrawTimeFieldKeys.forEach(key => newTargetObj[key] = targetObject[key]);

        let postData = null;
        if (sourceObject.drawsId == null) {

            postData = {
                drawsId: targetObject.drawsId,
                venueCourtId: sourceObject.venueCourtId,
                matchDate: sourceObject.matchDate,
                startTime: sourceObject.startTime,
                endTime: getEndTime(sourceObject.matchDate, targetObject.minuteDuration),//keep slot duration,                
            };
            newSourceObj.endTime = postData.endTime;
        } else {

            postData = {
                drawsId: sourceObject.drawsId,
                venueCourtId: targetObject.venueCourtId,
                matchDate: targetObject.matchDate,
                startTime: targetObject.startTime,
                endTime: getEndTime(targetObject.matchDate, sourceObject.minuteDuration), //targetObject.endTime,
            };
            newTargetObj.endTime = postData.endTime;
        }

        this.updateEditDrawArray(postData);



        //newSourceObj.slotId = randomKeyGen(5); //update key to update ui
        //newTargetObj.slotId = randomKeyGen(5);
        drawData[sourceXIndex].slotsArray[sourceYIndex] = newSourceObj;
        drawData[targetXIndex].slotsArray[targetYIndex] = newTargetObj;


        if (drawData[sourceXIndex].isExpanded) {

            newSourceObj.subCourt = sourceObject.subCourt;
            if (sourceObject.drawsId == null && newSourceObj.subCourt) {
                postData.subCourt = newSourceObj.subCourt;
                this.updateEditDrawArray(postData);
            }

            let sourceSlotHeightUnit = 8;
            let targetSlotHeightUnit = 8;
            if (sourceObject.subCourt) {
                sourceSlotHeightUnit = DrawConstant.subCourtHeightUnit[sourceObject.subCourt];
            }
            let fieldIds = Object.keys(DrawConstant.subCourtHeightUnit).filter(f =>
                DrawConstant.subCourtHeightUnit[f] == sourceSlotHeightUnit);

            if (targetObject.subCourt) {
                targetSlotHeightUnit = DrawConstant.subCourtHeightUnit[targetObject.subCourt];
                newTargetObj.subCourt = targetObject.subCourt;
            } else if (fieldIds.length > 0) {
                newTargetObj.subCourt = fieldIds[0];
            }
            if (sourceObject.drawsId != null) {
                postData.subCourt = newTargetObj.subCourt;
                this.updateEditDrawArray(postData);
            }

            let insertIndex = targetYIndex + 1;
            let targetRemainingHeightUnit = targetSlotHeightUnit - sourceSlotHeightUnit;
            if (targetRemainingHeightUnit > 0) {

                fieldIds = fieldIds.filter(f => f != newTargetObj.subCourt);
                //fill up remaining empty space, A,B           

                if (fieldIds.length > 0) {
                    for (let fId of fieldIds) {
                        if (targetRemainingHeightUnit >= sourceSlotHeightUnit) {
                            let emptyDraw = { ...DrawConstant.emptySlot };
                            emptyDraw.slotId = randomKeyGen(5);
                            let remainingFieldId = fId;
                            emptyDraw.subCourt = remainingFieldId;
                            Object.keys(DrawConstant.emptySlotFieldUpdate).forEach(key => emptyDraw[key] = newTargetObj[key]);
                            drawData[targetXIndex].slotsArray.splice(insertIndex, 0, emptyDraw);
                            targetRemainingHeightUnit -= sourceSlotHeightUnit;
                            insertIndex++;
                        }
                    }
                }
            }

            let sameCourtFields = drawData[sourceXIndex].slotsArray.filter(s => s.matchDate == sourceObject.matchDate);
            if (sameCourtFields.length > 0 && !sameCourtFields.some(s => s.drawsId)) {
                //combine empty fields
                for (let i = 0; i < sameCourtFields.length; i++) {
                    let fieldIndex = drawData[sourceXIndex].slotsArray.indexOf(sameCourtFields[i]);
                    if (i == 0) {
                        drawData[sourceXIndex].slotsArray[fieldIndex].subCourt = null;
                    } else {
                        drawData[sourceXIndex].slotsArray.splice(fieldIndex, 1);
                    }

                }


            }
        } else {
            //grouped fields
            //drawData[sourceXIndex].slotsArray.splice(sourceYIndex,1, newSourceObj);
            //drawData[targetXIndex].slotsArray.splice(targetYIndex,1, newTargetObj);
            if (sourceObject.childSlots) {
                for (let childSlot of sourceObject.childSlots) {
                    switchDrawTimeFieldKeys.forEach(key => childSlot[key] = targetObject[key]);
                    if (childSlot.drawsId) {
                        let changedDraw = {
                            drawsId: childSlot.drawsId,
                            venueCourtId: childSlot.venueCourtId,
                            matchDate: childSlot.matchDate,
                            startTime: childSlot.startTime,
                            endTime: getEndTime(childSlot.matchDate, childSlot.minuteDuration),
                        }
                        this.updateEditDrawArray(changedDraw);
                    }
                }
                if (sourceXIndex == targetXIndex && (!targetObject.childSlots || targetObject.childSlots.length <= 1)) {
                    sortSlot(drawData[sourceXIndex].slotsArray);
                }

            }
            if (targetObject.childSlots) {
                for (let childSlot of targetObject.childSlots) {
                    switchDrawTimeFieldKeys.forEach(key => childSlot[key] = sourceObject[key]);
                    if (childSlot.drawsId) {
                        let changedDraw = {
                            drawsId: childSlot.drawsId,
                            venueCourtId: childSlot.venueCourtId,
                            matchDate: childSlot.matchDate,
                            startTime: childSlot.startTime,
                            endTime: getEndTime(childSlot.matchDate, childSlot.minuteDuration),
                        }
                        this.updateEditDrawArray(changedDraw);
                    }
                }
                if (sourceXIndex == targetXIndex) {
                    sortSlot(drawData[targetXIndex].slotsArray);
                }
            }
            if (sourceXIndex != targetXIndex) {
                let sourceRemoveLength = 1;
                let targetRemoveLength = 1;
                let sourceToAdd = [newSourceObj];
                let targetToAdd = [newTargetObj];
                if (sourceObject.childSlots) {
                    sourceRemoveLength = sourceObject.childSlots.length;
                    targetToAdd = sourceObject.childSlots;
                }
                if (targetObject.childSlots) {
                    targetRemoveLength = targetObject.childSlots.length;
                    sourceToAdd = targetObject.childSlots;
                }
                if (sourceToAdd.length > 1 || sourceRemoveLength > 1) {
                    drawData[sourceXIndex].slotsArray.splice(sourceYIndex, sourceRemoveLength, ...sourceToAdd);
                }
                if (targetToAdd.length > 1 || targetRemoveLength > 1) {
                    drawData[targetXIndex].slotsArray.splice(targetYIndex, targetRemoveLength, ...targetToAdd);
                }

            }

        }


        //this.props.updateCompetitionDrawsSwapLoadAction();  
        this.setState({ redraw: true });
    };


    toggleCourt(courtData) {
        courtData.isExpanded = !courtData.isExpanded;
        this.setState({ redraw: true });
    }



    render() {
        let dateItem = this.props.dateItem;
        let disabledStatus = this.props.competitionStatus == 1
        var dateMargin = 25;
        var dayMargin = 25;

        let globalTopMargin = 0;
        let heightBase = 30;
        const allSubCourts = Object.keys(DrawConstant.subCourtHeightUnit);
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
                        let currentHeightBase = heightBase;
                        if (courtData.isExpanded) {
                            currentHeightBase = 44;
                        }
                        let leftMargin = 25;
                        let slotTopMargin = 0;
                        if (index !== 0) {
                            slotTopMargin = globalTopMargin;
                        }
                        let subCourtTopMargin = slotTopMargin;

                        globalTopMargin += currentHeightBase + 7;
                        let height = currentHeightBase;
                        //let hasCourtSubDivision = courtData.slotsArray.some(d=>d.subCourt && allSubCourts.includes(d.subCourt) );
                        let groupSlots = [];
                        if (courtData.isExpanded) {
                            height = currentHeightBase * 8;
                            globalTopMargin += currentHeightBase * 7;
                        } else {
                            for (let slotObject of courtData.slotsArray) {
                                if (slotObject.subCourt) {
                                    let parentSlot = groupSlots.find(s => s.subCourt && s.matchDate == slotObject.matchDate);
                                    if (parentSlot && parentSlot.childSlots) {
                                        parentSlot.childSlots.push(slotObject);
                                        continue;
                                    }
                                }


                                if (slotObject.drawsId || slotObject.subCourt) {
                                    slotObject.childSlots = [{ ...slotObject }];
                                }

                                groupSlots.push(slotObject);

                            }
                        }
                        return (
                            <React.Fragment key={"court" + index}>
                                <div className="sr-no" style={{ height: height, lineHeight: height + "px" }}>
                                    <div className="venueCourt-tex-div">
                                        <span className="app-color pointer mr-2" onClick={() => this.toggleCourt(courtData)}>{courtData.isExpanded ? "-" : "+"}</span>
                                        <span className="venueCourt-text">
                                            {courtData.venueShortName + '-' + courtData.venueCourtNumber}
                                        </span>

                                    </div>
                                </div>
                                {courtData.isExpanded ?
                                    courtData.slotsArray.map((slotObject, slotIndex) => {
                                        let isSameTimeSlot = false;
                                        if (slotIndex !== 0) {
                                            if (slotObject.subCourt && allSubCourts.includes(slotObject.subCourt)) {
                                                let previousSlot = courtData.slotsArray[slotIndex - 1];
                                                if (previousSlot.matchDate == slotObject.matchDate) {
                                                    isSameTimeSlot = true;
                                                    subCourtTopMargin += currentHeightBase * DrawConstant.subCourtHeightUnit[previousSlot.subCourt];
                                                }
                                            }
                                            if (!isSameTimeSlot) {
                                                leftMargin += 110;
                                                subCourtTopMargin = slotTopMargin;
                                            }
                                        }
                                        if (slotIndex == 0) {
                                            leftMargin = 70;
                                        }

                                        let allprops = {
                                            ...this.props, slotObject, slotIndex, courtData, leftMargin, slotTopMargin: subCourtTopMargin, index,
                                            onSwap: this.onSwap, checkCurrentSwapObjects: this.checkCurrentSwapObjects
                                        };
                                        let slotKey = "";//"slot" + slotIndex;
                                        if (slotObject.slotId) {
                                            slotKey += slotObject.slotId;
                                        }
                                        return (
                                            <MultiFieldDrawsCourtExpand key={slotKey} {...allprops}></MultiFieldDrawsCourtExpand>
                                        );
                                    })
                                    : groupSlots.map((slotObject, groupIndex) => {
                                        let slotIndex = courtData.slotsArray.indexOf(slotObject);
                                        if (slotIndex !== 0) {
                                            leftMargin += 110;
                                        }
                                        if (slotIndex == 0) {
                                            leftMargin = 70;
                                        }
                                        let allprops = {
                                            ...this.props, slotObject, slotIndex, courtData, leftMargin, slotTopMargin, index,
                                            onSwap: this.onSwap, checkCurrentSwapObjects: this.checkCurrentSwapObjects
                                        };
                                        let slotKey = "";//"slot" + slotIndex;
                                        if (slotObject.slotId) {
                                            slotKey += slotObject.slotId;
                                        }
                                        return (
                                            <MultiFieldDrawsCourtGroup key={slotKey} {...allprops}></MultiFieldDrawsCourtGroup>
                                        );
                                    })
                                }
                            </React.Fragment>
                        );
                    })}
                </div>
            </>
        );
    };

}


export default MultiFieldDrawsSubCourt;
