//import { Popover } from "antd";
import { DatePicker, Layout, Menu, Modal, Select } from "antd";
import React, { Component } from "react";
import moment from 'moment';
import Swappable from '../../../customComponents/SwappableComponentTimeline';
import { checkDate, getDate, getDiffBetweenStartAndEnd, getNextEventForSwap } from "../../../util/drawUtil";
import { NavLink } from 'react-router-dom';
import DrawConstant from 'themes/drawConstant';
//import '../draws.scss';
const ONE_MIN_WIDTH = 2;
const ONE_HOUR_IN_MIN = 60;
const { SubMenu } = Menu;
class MultiFieldDrawsCourtGroupTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidUpdate(nextProps) {

    }

    componentDidMount() {
    }

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
        const checkDivisionFalse = this.props.firstTimeCompId == "-1" ? this.checkAllDivisionData() : this.checkAllCompetitionData(this.props.drawsState.divisionGradeNameList, 'competitionDivisionGradeId')
        const checkCompetitionFalse = this.props.firstTimeCompId == "-1" ? this.checkAllCompetitionData(this.props.drawsState.drawsCompetitionArray, "competitionName") : []
        const checkVenueFalse = this.checkAllCompetitionData(this.props.drawsState.competitionVenues, "id")
        const checkOrganisationFalse = this.checkAllCompetitionData(this.props.drawsState.drawOrganisations, "organisationUniqueKey")
        const disabledStatus = this.props.competitionStatus == 1
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




    //unlockDraws
    unlockDraws(id, round_Id, venueCourtId) {
        let key = this.props.firstTimeCompId == "-1" || this.props.filterDates ? 'all' : "singleCompetition"
        this.props.unlockDrawsAction(id, round_Id, venueCourtId, key);
    }




    render() {

        let dateItem = this.props.dateItem;
        let index = this.props.index;
        let courtData = this.props.courtData;
        let leftMargin = this.props.leftMargin;
        let slotTopMargin = this.props.slotTopMargin;
        let disabledStatus = this.props.competitionStatus == 1;
        let groupSlots = this.props.groupSlots;

        let currentHeightBase = this.props.currentHeightBase;
        let isDayInPast = this.props.isDayInPast;
        let timeRestrictionsSchedule = this.props.timeRestrictionsSchedule;
        let isAxisInverted = this.props.isAxisInverted;
        let fieldItemDate = this.props.fieldItemDate;
        let startDayTime = this.props.startDayTime;


        let topMargin = 0;

        let heightBase = 30;


        topMargin = slotTopMargin;

        let slotHeight = heightBase;


        return (
            groupSlots.map((slotObject, groupIndex) => {
                if (getDate(slotObject.matchDate) === fieldItemDate && slotObject.drawsId) {
                    // for left margin the event start inside the day
                    const startWorkingDayTime = moment(fieldItemDate + startDayTime);
                    const startTimeEvent = moment(slotObject.matchDate);

                    const diffTimeStartEvent = startTimeEvent.diff(startWorkingDayTime, 'minutes') * ONE_MIN_WIDTH;
                    // for width of the event
                    const endTimeEvent = moment(fieldItemDate + slotObject.endTime);
                    const diffTimeEventDuration = endTimeEvent.diff(startTimeEvent, 'minutes') * ONE_MIN_WIDTH;

                    let slotIndex = courtData.slotsArray.indexOf(slotObject);
                    if (slotIndex !== 0) {
                        leftMargin += 110;
                    }
                    if (slotIndex == 0) {
                        leftMargin = 70;
                    }
                    let slotKey = "";//"slot" + slotIndex;
                    if (slotObject.slotId) {
                        slotKey += slotObject.slotId;
                    }
                    var childArray = [0];
                    // if (slotObject.childSlots && slotObject.childSlots.length > 4) {
                    //     childArray.push(4);
                    // }
                    if (slotObject.childSlots) {
                        let totalHeightUnit = slotObject.childSlots.map(s => DrawConstant.subCourtHeightUnit[s.subCourt]).reduce((a, b) => { return a + b }, 0);
                        if (totalHeightUnit > 4) {
                            childArray.push(4);
                        }
                    }
                    let barHeightClass = (isAxisInverted ? "w" : "h") + "-" + (100 / childArray.length);
                    let barStartIndex = -1;
                    return (
                        <div
                            key={slotKey}
                            style={{
                                position: 'absolute',
                                ...(isAxisInverted ? {
                                    left: 0,
                                    top: diffTimeStartEvent,
                                } : {
                                    left: diffTimeStartEvent,
                                    top: 0,
                                })
                            }}
                        >
                            <div
                                id={slotObject.drawsId}
                                onMouseDown={this.props.slotObjectMouseDown}
                                onTouchStart={this.props.slotObjectMouseDown}
                                onDragOver={() => this.props.slotObjectDragOver(slotObject)}
                                onTouchMove={() => this.props.slotObjectDragOver(slotObject)}
                                onDragLeave={() => {
                                    this.props.setTooltipSwappableTime();
                                }}
                                onMouseEnter={e => this.props.slotObjectMouseEnter(e, slotObject, true)}
                                onMouseLeave={this.props.slotObjectMouseLeave}
                                className={'box-draws purple-bg'}
                                style={{
                                    backgroundColor: this.checkColor(slotObject),
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    cursor: timeRestrictionsSchedule.isUnavailable || isDayInPast ? 'not-allowed' : disabledStatus && "no-drop",
                                    opacity: isDayInPast ? 0.7 : 1,
                                    ...(isAxisInverted ? {
                                        width: currentHeightBase,
                                        minWidth: currentHeightBase,
                                        height: diffTimeEventDuration,
                                    } : {
                                        width: diffTimeEventDuration,
                                        minWidth: diffTimeEventDuration,
                                        height: currentHeightBase,
                                    })
                                }}
                            >
                                {this.props.firstTimeCompId == "-1" || this.props.filterDates ? (
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
                                        swappable={timeRestrictionsSchedule.isUnavailable || isDayInPast || disabledStatus
                                            ? false
                                            : this.checkSwap(slotObject)
                                        }
                                        onSwap={(source, target) =>
                                            this.props.onSwap(
                                                source,
                                                target,
                                                dateItem.draws,
                                                dateItem.roundId,
                                            )
                                        }
                                        isCurrentSwappable={(source, target) =>
                                            isDayInPast || disabledStatus
                                                ? false
                                                : this.props.checkCurrentSwapObjects(
                                                    source,
                                                    target,
                                                    dateItem.draws,
                                                )
                                        }
                                    >
                                        <div className={`d-flex align-items-center w-100 ${isAxisInverted ? "flex-row" : "flex-column"}`}>
                                            {childArray.map((columnindex, rindex) => {
                                                let totalHeightUnit = 0;
                                                let barRowClass = barHeightClass;
                                                if (isAxisInverted) {
                                                    barRowClass += " h-100 flex-column";
                                                } else {
                                                    barRowClass += " w-100";
                                                }
                                                return <div key={"barRow" + rindex} className={`d-flex justify-content-between align-items-center ${barRowClass}`}>
                                                    {
                                                        slotObject.childSlots.map((childSlot, cindex) => {
                                                            if (totalHeightUnit < 4 && cindex > barStartIndex) {
                                                                barStartIndex = cindex;
                                                                let widthUnit = 0;
                                                                let barBgClass = "bg-white";
                                                                if (childSlot.subCourt) {
                                                                    let slotHeightUnit = DrawConstant.subCourtHeightUnit[childSlot.subCourt];
                                                                    totalHeightUnit += slotHeightUnit;
                                                                    widthUnit = (slotHeightUnit * 25) + "%";
                                                                    if (!childSlot.drawsId) { barBgClass = "bg-grey"; }
                                                                }
                                                                return <div className={`flex-col ${barBgClass}`}
                                                                    key={childSlot.homeTeamId + "" + cindex}
                                                                    style={{ height: isAxisInverted ? 15 : 5, width: isAxisInverted ? 5 : 15, margin: 2.5, flexBasis: widthUnit }}
                                                                />
                                                            }
                                                        })
                                                    }
                                                </div>
                                            })
                                            }
                                        </div>
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
                                        swappable={timeRestrictionsSchedule.isUnavailable || isDayInPast || disabledStatus
                                            ? false
                                            : this.checkSwap(slotObject)
                                        }
                                        onSwap={(source, target) =>
                                            this.props.onSwap(
                                                source,
                                                target,
                                                dateItem.draws,
                                                dateItem.roundId,
                                            )
                                        }
                                        isCurrentSwappable={(source, target) =>
                                            isDayInPast || disabledStatus
                                                ? false
                                                : this.props.checkCurrentSwapObjects(
                                                    source,
                                                    target,
                                                    dateItem.draws,
                                                )
                                        }
                                    >
                                        <div className={`d-flex align-items-center w-100 ${isAxisInverted ? "flex-row" : "flex-column"}`}>
                                            {childArray.map((columnindex, rindex) => {
                                                let totalHeightUnit = 0;
                                                let barRowClass = barHeightClass;
                                                if (isAxisInverted) {
                                                    barRowClass += " h-100 flex-column";
                                                } else {
                                                    barRowClass += " w-100";
                                                }
                                                return <div key={"barRow" + rindex} className={`d-flex justify-content-between align-items-center ${barRowClass}`}>
                                                    {
                                                        slotObject.childSlots.map((childSlot, cindex) => {
                                                            if (totalHeightUnit < 4 && cindex > barStartIndex) {
                                                                barStartIndex = cindex;
                                                                let widthUnit = 0;
                                                                let barBgClass = "bg-white";
                                                                if (childSlot.subCourt) {
                                                                    let slotHeightUnit = DrawConstant.subCourtHeightUnit[childSlot.subCourt];
                                                                    totalHeightUnit += slotHeightUnit;
                                                                    widthUnit = (slotHeightUnit * 25) + "%";
                                                                    if (!childSlot.drawsId) { barBgClass = "bg-grey"; }
                                                                }
                                                                return <div className={`flex-col ${barBgClass}`}
                                                                    key={childSlot.homeTeamId + "" + cindex}
                                                                    style={{ height: isAxisInverted ? 15 : 5, width: isAxisInverted ? 5 : 15, margin: 2.5, flexBasis: widthUnit }}
                                                                />
                                                            }
                                                        })
                                                    }
                                                </div>
                                            })
                                            }
                                        </div>
                                    </Swappable>
                                )}
                            </div>

                        </div>
                    );
                }
            })
        );
    };

}


export default MultiFieldDrawsCourtGroupTimeline;
