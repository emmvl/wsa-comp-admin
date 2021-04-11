import { Popover } from "antd";
import React, { Component } from "react";
import DrawConstant from 'themes/drawConstant';
import Swappable from '../../../customComponents/SwappableComponent';
//import '../draws.scss';


class MultiFieldDrawsCourtGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidUpdate(nextProps) {

    }

    componentDidMount() {
    }

    render() {
        let dateItem = this.props.dateItem;
        let index = this.props.index;
        let slotObject = this.props.slotObject;
        let slotIndex = this.props.slotIndex;
        let courtData = this.props.courtData;
        let leftMargin = this.props.leftMargin;
        let slotTopMargin = this.props.slotTopMargin;
        let disabledStatus = this.props.competitionStatus == 1

        let topMargin = 0;

        let heightBase = 30;


        topMargin = slotTopMargin;

        let slotHeight = heightBase;


        if (slotIndex == 0) {
            leftMargin = 70;

        }
        var childArray = [0];
        if (slotObject.childSlots) {
            let totalHeightUnit=slotObject.childSlots.map(s=>DrawConstant.subCourtHeightUnit[s.subCourt]).reduce((a,b)=>{return a+b},0);
            if( totalHeightUnit > 4){
                childArray.push(4);
            }            
        }
        let barHeightClass = "h-" + (100 / childArray.length);
        let barStartIndex = -1;
        return (
            <div>
                <div
                    className={slotObject.duplicate ? slotObject.colorCode == "#EA0628" ? 'box purple-bg boxPink' : 'box purple-bg boxDuplicate' : 'box purple-bg'}
                    style={{
                        backgroundColor: this.props.checkColor(slotObject),
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
                            swappable={this.props.checkSwap(slotObject)}
                            onSwap={(source, target) =>
                                this.props.onSwap(
                                    source,
                                    target,
                                    dateItem.draws,
                                    "1"
                                )
                            }
                            isCurrentSwappable={(source, target) =>
                                this.props.checkCurrentSwapObjects(
                                    source,
                                    target,
                                    dateItem.draws,
                                )
                            }
                        >
                            {(slotObject.drawsId != null || slotObject.subCourt) ? (
                                <Popover content={slotObject.childSlots.map((childSlot, cindex) => {
                                    if (childSlot.homeTeamId) {
                                        return <span key={childSlot.homeTeamId + "" + cindex}> {childSlot.homeTeamName} V {childSlot.awayTeamName}<br /> </span>
                                    }
                                })} trigger="click">
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        {childArray.map((columnindex, rindex) => {
                                            let totalHeightUnit = 0;
                                            return <div key={"barRow"+rindex} className={`d-flex justify-content-between align-items-center w-100 ${barHeightClass}`}>
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
                                                                style={{ height: 5, width: 15, margin: 2.5, flexBasis: widthUnit }}
                                                            />
                                                        }
                                                    })
                                                }
                                            </div>
                                        })
                                        }
                                    </div>
                                </Popover>

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
                            swappable={this.props.checkSwap(slotObject)}
                            onSwap={(source, target) =>
                                this.props.onSwap(
                                    source,
                                    target,
                                    dateItem.draws,
                                    dateItem.roundId
                                )
                            }
                            isCurrentSwappable={(source, target) =>
                                this.props.checkCurrentSwapObjects(
                                    source,
                                    target,
                                    dateItem.draws,
                                )
                            }

                        >
                            {(slotObject.drawsId != null ||slotObject.subCourt) ? (
                                <Popover content={slotObject.childSlots.map((childSlot, cindex) => {
                                    if (childSlot.homeTeamId) {
                                        return <span key={childSlot.homeTeamId + "" + cindex}> {childSlot.homeTeamName} V {childSlot.awayTeamName}<br /> </span>
                                    }
                                })
                                } trigger="click">
                                    <div className="d-flex flex-column align-items-center w-100">
                                        {childArray.map((columnindex, rindex) => {
                                            let totalHeightUnit = 0;
                                            return <div key={"barRow"+rindex} className={`d-flex justify-content-between align-items-center w-100 ${barHeightClass}`}>
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
                                                                style={{ height: 5, width: 15, margin: 2.5, flexBasis: widthUnit }}
                                                            />
                                                        }
                                                    })
                                                }
                                            </div>
                                        })
                                        }

                                    </div>
                                </Popover>
                            ) : (
                                <span>Free</span>
                            )}
                        </Swappable>
                    )}
                </div>


            </div>
        );
    };

}


export default MultiFieldDrawsCourtGroup;
