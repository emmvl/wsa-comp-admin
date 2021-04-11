import { DatePicker, Layout, Menu, Modal, Select } from "antd";
import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import Swappable from '../../../customComponents/SwappableComponent';
import AppImages from "../../../themes/appImages";
import DrawConstant from '../../../themes/drawConstant';
//import '../draws.scss';

const { SubMenu } = Menu;

class MultiFieldDrawsCourtExpand extends Component {
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

        let heightBase = 44;
        const allSubCourts = Object.keys(DrawConstant.subCourtHeightUnit);


        topMargin = slotTopMargin;
        let isSameTimeSlot = false;
        let slotHeightUnit = 8;
        let slotHeight = heightBase - 14;
        let slotHasSubCourt = true;
        if (slotIndex !== 0) {
            if (slotObject.subCourt && allSubCourts.includes(slotObject.subCourt)) {                
                slotHeightUnit = DrawConstant.subCourtHeightUnit[slotObject.subCourt];

                // let previousSlot = courtData.slotsArray[slotIndex - 1];
                // if (previousSlot.matchDate == slotObject.matchDate) {
                //     isSameTimeSlot = true;
                //     topMargin += heightBase * DrawConstant.subCourtHeightUnit[previousSlot.subCourt];
                // }
            }
            // if (!isSameTimeSlot) {
                
            // }
        }
        if (slotIndex == 0) {
            leftMargin = 70;
            if (slotObject.subCourt && allSubCourts.includes(slotObject.subCourt)) {
                
                slotHeightUnit = DrawConstant.subCourtHeightUnit[slotObject.subCourt];
            }
        }
        if (slotHasSubCourt) {
            slotHeight = heightBase * slotHeightUnit - 21; // minus box exception height and margin
        }

        return (
            <div >
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
                            {slotObject.drawsId != null ? (
                                <span>
                                    {slotObject.homeTeamName} {slotHeightUnit>1? <br /> : " V "}
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
                            {slotObject.drawsId != null ? (
                                <span>
                                    {slotObject.homeTeamName} {slotHeightUnit>1? <br /> : " V "}
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
                            top: topMargin + slotHeight + 2,
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
                                            ? this.props.unlockDraws(
                                                slotObject.drawsId,
                                                "1",
                                                courtData.venueCourtId
                                            )
                                            : this.props.unlockDraws(
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





    };

}


export default MultiFieldDrawsCourtExpand;
