import moment from 'moment';
import React, { Component } from 'react';
import {
  Layout,
  Button,
  Tooltip,
  Menu,
  Select,
  DatePicker,
  Checkbox,
  message,
  Spin,
  Modal,
  Radio,
} from 'antd';
import {
  // getDayName,
  getTime,
} from 'themes/dateformate';
import DrawConstant from 'themes/drawConstant';
import { checkDate, getDate, sortSlot, getEndTime } from 'util/drawUtil';
import { randomKeyGen } from 'util/helpers';
import { NavLink } from 'react-router-dom';
import Swappable from 'customComponents/SwappableComponent';
import AppImages from 'themes/appImages';
import '../draws.scss';
const { SubMenu } = Menu;

class MultiFieldDrawsFullCourt extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(nextProps) {}

  componentDidMount() {}
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
    let sourceObejct = drawData[sourceXIndex].slotsArray[sourceYIndex];
    let targetObject = drawData[targetXIndex].slotsArray[targetYIndex];
    if (sourceObejct.drawsId == null && targetObject.drawsId == null) {
      return false;
    }
    return true;
  };
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
    if (sourceObejct.drawsId !== null && targetObject.drawsId !== null) {
      this.updateCompetitionDraws(
        sourceObejct,
        targetObject,
        sourceIndexArray,
        targetIndexArray,
        drawData,
        round_Id,
        sourceObejct.duplicate,
        targetObject.duplicate,
      );
    } else if (sourceObejct.drawsId == null && targetObject.drawsId == null) {
    } else {
      this.updateCompetitionNullDraws(
        sourceObejct,
        targetObject,
        sourceIndexArray,
        targetIndexArray,
        drawData,
        round_Id,
      );
    }
  }
  ///////update the competition draws on  swapping and hitting update Apis if both has value
  updateCompetitionDraws = (
    sourceObejct,
    targetObject,
    sourceIndexArray,
    targetIndexArray,
    drawData,
    round_Id,
    sourceDuplicate,
    targetDuplicate,
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

    let newSourceObj = { ...sourceObejct, ...customTargetObject };
    Object.keys(DrawConstant.switchDrawNameFields).forEach(
      key => (newSourceObj[key] = targetObject[key]),
    );

    let newTargetObj = { ...targetObject, ...customSourceObject };
    Object.keys(DrawConstant.switchDrawNameFields).forEach(
      key => (newTargetObj[key] = sourceObejct[key]),
    );

    drawData[sourceXIndex].slotsArray[sourceYIndex] = newSourceObj;
    drawData[targetXIndex].slotsArray[targetYIndex] = newTargetObj;
    //this.props.updateCompetitionDrawsSwapLoadAction();
    this.setState({ redraw: true });
  };
  ///////update the competition draws on  swapping and hitting update Apis if one has N/A(null)
  updateCompetitionNullDraws = (
    sourceObject,
    targetObject,
    sourceIndexArray,
    targetIndexArray,
    drawData,
    round_Id,
  ) => {
    let updatedKey = this.props.firstTimeCompId === '-1' || this.props.filterDates ? 'all' : 'add';
    let postData = null;
    if (sourceObject.drawsId == null) {
      postData = {
        drawsId: targetObject.drawsId,
        venueCourtId: sourceObject.venueCourtId,
        matchDate: sourceObject.matchDate,
        startTime: sourceObject.startTime,
        endTime: getEndTime(sourceObject.matchDate, targetObject.minuteDuration),
      };
    } else {
      postData = {
        drawsId: sourceObject.drawsId,
        venueCourtId: targetObject.venueCourtId,
        matchDate: targetObject.matchDate,
        startTime: targetObject.startTime,
        endTime: getEndTime(targetObject.matchDate, sourceObject.minuteDuration),
      };
    }

    this.updateEditDrawArray(postData);

    const sourceXIndex = sourceIndexArray[0];
    const sourceYIndex = sourceIndexArray[1];
    const targetXIndex = targetIndexArray[0];
    const targetYIndex = targetIndexArray[1];
    const newSourceObj = JSON.parse(JSON.stringify(targetObject));
    const newTargetObj = JSON.parse(JSON.stringify(sourceObject));

    Object.keys(DrawConstant.switchDrawTimeFields).forEach(
      key => (newSourceObj[key] = sourceObject[key]),
    );
    Object.keys(DrawConstant.switchDrawTimeFields).forEach(
      key => (newTargetObj[key] = targetObject[key]),
    );

    drawData[sourceXIndex].slotsArray[sourceYIndex] = newSourceObj;
    drawData[targetXIndex].slotsArray[targetYIndex] = newTargetObj;
    //this.props.updateCompetitionDrawsSwapLoadAction();
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
  // getColumnData = (indexArray, drawData) => {
  //     let xIndex=indexArray[0];
  //     let yIndex = indexArray[1];
  //     let object = null;

  //     for (let i in drawData) {
  //         let slot = drawData[i].slotsArray[yIndex];
  //         if (slot.drawsId !== null) {
  //             object = slot;
  //             break;
  //         }
  //     }
  //     if(!object){
  //         //empty slot has incorrect start time
  //         object=drawData[xIndex].slotsArray[yIndex];
  //         this.correctWrongDate(object,yIndex);

  //     }
  //     return object;
  // };
  // correctWrongDate=(slot,slotIndex)=>{
  //     const slotDate = moment(slot.matchDate);
  //     const slotEnd = moment(getDate(slot.matchDate) + slot.endTime);
  //     const isCorrectStart = slotEnd.isAfter(slotDate);
  //     if(!isCorrectStart){
  //         if(this.props.drawsState.getRoundsDrawsdata.length>0){
  //             const dateAxis=this.props.drawsState.getRoundsDrawsdata[0].dateNewArray[slotIndex];
  //             slot.matchDate=dateAxis.date;
  //             slot.startTime=moment(slot.matchDate).format('HH:mm');
  //             slot.endTime=dateAxis.endTime;
  //         }
  //     }
  // }

  render() {
    let dateItem = this.props.dateItem;
    let disabledStatus = this.props.competitionStatus == 1;
    var dateMargin = 25;
    var dayMargin = 25;
    let topMargin = 0;
    // let legendsData = isArrayNotEmpty(this.props.drawsState.legendsArray) ? this.props.drawsState.legendsArray : [];
    return (
      <>
        <div
          className="scroll-bar pb-4"
          style={{
            width: dateItem.dateNewArray.length > 0 && dateItem.dateNewArray.length * 140,
            minWidth: 1080,
          }}
        >
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
                  <span key={'day' + index} style={{ left: dateMargin }}>
                    {item.notInDraw == false
                      ? checkDate(item.date, index, dateItem.dateNewArray)
                      : ''}
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
                    key={'time' + index}
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
            if (index !== 0) {
              topMargin += 70;
            }
            return (
              <React.Fragment key={'court' + index}>
                <div className="sr-no" style={{ height: 62 }}>
                  <div className="venueCourt-tex-div">
                    <span className="venueCourt-text">
                      {courtData.venueShortName + '-' + courtData.venueCourtNumber}
                    </span>
                  </div>
                </div>
                {courtData.slotsArray.map((slotObject, slotIndex) => {
                  if (slotIndex !== 0) {
                    leftMargin += 110;
                  }
                  if (slotIndex == 0) {
                    leftMargin = 70;
                  }
                  return (
                    <div key={'slot' + slotIndex}>
                      <span
                        style={{ left: leftMargin, top: topMargin }}
                        className={slotObject.duplicate ? 'borderDuplicate' : 'border'}
                      />
                      <div
                        className={
                          slotObject.duplicate
                            ? slotObject.colorCode == '#EA0628'
                              ? 'box purple-bg boxPink'
                              : 'box purple-bg boxDuplicate'
                            : 'box purple-bg'
                        }
                        style={{
                          backgroundColor: this.props.checkColor(slotObject),
                          left: leftMargin,
                          top: topMargin,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          cursor: disabledStatus && 'no-drop',
                        }}
                      >
                        {this.props.firstTimeCompId == '-1' || this.props.filterDates ? (
                          <Swappable
                            // duplicateDropzoneId={slotObject.duplicate && "duplicateDropzoneId"}
                            // duplicateDragableId={slotObject.duplicate && "duplicateDragableId"}
                            // duplicateDropzoneId={"boxDuplicate"}
                            id={index.toString() + ':' + slotIndex.toString() + ':' + '1'}
                            content={1}
                            swappable={this.props.checkSwap(slotObject)}
                            onSwap={(source, target) =>
                              this.onSwap(source, target, dateItem.draws, '1')
                            }
                            isCurrentSwappable={(source, target) =>
                              this.checkCurrentSwapObjects(source, target, dateItem.draws)
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
                            duplicateDropzoneId={slotObject.duplicate && 'duplicateDropzoneId'}
                            duplicateDragableId={slotObject.duplicate && 'duplicateDragableId'}
                            id={
                              index.toString() +
                              ':' +
                              slotIndex.toString() +
                              ':' +
                              dateItem.roundId.toString()
                            }
                            content={1}
                            swappable={this.props.checkSwap(slotObject)}
                            onSwap={(source, target) =>
                              this.onSwap(source, target, dateItem.draws, dateItem.roundId)
                            }
                            isCurrentSwappable={(source, target) =>
                              this.checkCurrentSwapObjects(source, target, dateItem.draws)
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
                            top: topMargin + 50,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            marginLeft: slotObject.isLocked == 1 && -10,
                          }}
                        >
                          <Menu
                            className="action-triple-dot-draws"
                            theme="light"
                            mode="horizontal"
                            style={{
                              lineHeight: '16px',
                              borderBottom: 0,
                              cursor: disabledStatus && 'no-drop',
                              display: slotObject.isLocked !== 1 && 'flex',
                              justifyContent: slotObject.isLocked !== 1 && 'center',
                            }}
                          >
                            <SubMenu
                              disabled={disabledStatus}
                              // style={{ borderBottomStyle: "solid", borderBottom: 2 }}
                              key="sub1"
                              title={
                                slotObject.isLocked == 1 ? (
                                  <div
                                    className="d-flex justify-content-between"
                                    style={{ width: 80, maxWidth: 80 }}
                                  >
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
                                  onClick={() =>
                                    this.props.firstTimeCompId == '-1' || this.props.filterDates
                                      ? this.props.unlockDraws(
                                          slotObject.drawsId,
                                          '1',
                                          courtData.venueCourtId,
                                        )
                                      : this.props.unlockDraws(
                                          slotObject.drawsId,
                                          dateItem.roundId,
                                          courtData.venueCourtId,
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
              </React.Fragment>
            );
          })}
        </div>
      </>
    );
  }
}

export default MultiFieldDrawsFullCourt;
