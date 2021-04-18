import { DatePicker, Layout, Menu, Modal, Select } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Swappable from '../../../customComponents/SwappableComponentTimeline';
import AppImages from '../../../themes/appImages';
import DrawConstant from '../../../themes/drawConstant';
import {
  checkDate,
  getDate,
  getDiffBetweenStartAndEnd,
  getNextEventForSwap,
} from '../../../util/drawUtil';
//import '../draws.scss';
const ONE_MIN_WIDTH = 2;
const ONE_HOUR_IN_MIN = 60;
const { SubMenu } = Menu;

class MultiFieldDrawsCourtExpandTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(nextProps) {}

  componentDidMount() {}

  render() {
    let dateItem = this.props.dateItem;
    let index = this.props.index;
    let courtData = this.props.courtData;
    let leftMargin = this.props.leftMargin;
    let slotTopMargin = 0;
    let subCourtTopMargin = slotTopMargin;
    let currentHeightBase = this.props.currentHeightBase;
    let isDayInPast = this.props.isDayInPast;
    let timeRestrictionsSchedule = this.props.timeRestrictionsSchedule;
    let disabledStatus = this.props.competitionStatus == 1;
    let isAxisInverted = this.props.isAxisInverted;
    let fieldItemDate = this.props.fieldItemDate;
    let allSubCourts = this.props.allSubCourts;
    let startDayTime = this.props.startDayTime;

    return courtData.slotsArray.map((slotObject, slotIndex) => {
      if (getDate(slotObject.matchDate) === fieldItemDate && slotObject.drawsId) {
        // for left margin the event start inside the day
        const startWorkingDayTime = moment(fieldItemDate + startDayTime);
        const startTimeEvent = moment(slotObject.matchDate);

        const diffTimeStartEvent =
          startTimeEvent.diff(startWorkingDayTime, 'minutes') * ONE_MIN_WIDTH;
        // for width of the event
        const endTimeEvent = moment(fieldItemDate + slotObject.endTime);
        const diffTimeEventDuration = endTimeEvent.diff(startTimeEvent, 'minutes') * ONE_MIN_WIDTH;

        let isSameTimeSlot = false;
        let slotHeightUnit = 8;
        if (slotIndex !== 0) {
          if (slotObject.subCourt && allSubCourts.includes(slotObject.subCourt)) {
            slotHeightUnit = DrawConstant.subCourtHeightUnit[slotObject.subCourt];
            let previousSlot = courtData.slotsArray[slotIndex - 1];
            if (previousSlot.matchDate == slotObject.matchDate) {
              isSameTimeSlot = true;
              subCourtTopMargin +=
                currentHeightBase * DrawConstant.subCourtHeightUnit[previousSlot.subCourt];
            }
          }
          if (!isSameTimeSlot) {
            leftMargin += 110;
            subCourtTopMargin = slotTopMargin;
          }
        }
        if (slotIndex == 0) {
          leftMargin = 70;
          if (slotObject.subCourt && allSubCourts.includes(slotObject.subCourt)) {
            slotHeightUnit = DrawConstant.subCourtHeightUnit[slotObject.subCourt];
          }
        }
        let slotKey = ''; //"slot" + slotIndex;
        if (slotObject.slotId) {
          slotKey += slotObject.slotId;
        }

        let topMargin = subCourtTopMargin;

        let slotHeight = currentHeightBase - 14;
        let slotHasSubCourt = true;
        if (slotHasSubCourt) {
          slotHeight = currentHeightBase * slotHeightUnit - 21; // minus box exception height and margin
        }

        return (
          <div
            key={slotKey}
            style={{
              position: 'absolute',
              ...(isAxisInverted
                ? {
                    left: topMargin,
                    top: diffTimeStartEvent,
                  }
                : {
                    left: diffTimeStartEvent,
                    top: topMargin,
                  }),
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
              onMouseEnter={e => this.props.slotObjectMouseEnter(e, slotObject)}
              onMouseLeave={this.props.slotObjectMouseLeave}
              className={'box-draws purple-bg'}
              style={{
                backgroundColor: this.props.checkColor(slotObject),
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                cursor:
                  timeRestrictionsSchedule.isUnavailable || isDayInPast
                    ? 'not-allowed'
                    : disabledStatus && 'no-drop',
                opacity: isDayInPast ? 0.7 : 1,
                ...(isAxisInverted
                  ? {
                      width: slotHeight,
                      minWidth: slotHeight,
                      height: diffTimeEventDuration,
                    }
                  : {
                      width: diffTimeEventDuration,
                      minWidth: diffTimeEventDuration,
                      height: slotHeight,
                    }),
              }}
            >
              {this.props.firstTimeCompId == '-1' || this.props.filterDates ? (
                <Swappable
                  id={index.toString() + ':' + slotIndex.toString() + ':' + '1'}
                  content={1}
                  swappable={
                    timeRestrictionsSchedule.isUnavailable || isDayInPast || disabledStatus
                      ? false
                      : this.props.checkSwap(slotObject)
                  }
                  onSwap={(source, target) =>
                    this.props.onSwap(source, target, dateItem.draws, dateItem.roundId)
                  }
                  isCurrentSwappable={(source, target) =>
                    isDayInPast || disabledStatus
                      ? false
                      : this.props.checkCurrentSwapObjects(source, target, dateItem.draws)
                  }
                >
                  {this.props.isDivisionNameShow ? (
                    <span
                      className="text-overflow"
                      style={{
                        writingMode: isAxisInverted && slotHeightUnit === 1 ? 'tb' : 'unset',
                      }}
                    >
                      {slotObject.divisionName + '-' + slotObject.gradeName}
                    </span>
                  ) : (
                    <span
                      className="text-overflow"
                      style={{
                        writingMode: isAxisInverted && slotHeightUnit === 1 ? 'tb' : 'unset',
                      }}
                    >
                      {slotObject.homeTeamName} {slotHeightUnit > 1 ? <br /> : ' V '}
                      {slotObject.awayTeamName}
                    </span>
                  )}
                </Swappable>
              ) : (
                <Swappable
                  id={
                    index.toString() +
                    ':' +
                    slotIndex.toString() +
                    ':' +
                    dateItem.roundId.toString()
                  }
                  content={1}
                  swappable={
                    timeRestrictionsSchedule.isUnavailable || isDayInPast || disabledStatus
                      ? false
                      : this.props.checkSwap(slotObject)
                  }
                  onSwap={(source, target) =>
                    this.props.onSwap(source, target, dateItem.draws, dateItem.roundId)
                  }
                  isCurrentSwappable={(source, target) =>
                    isDayInPast || disabledStatus
                      ? false
                      : this.props.checkCurrentSwapObjects(source, target, dateItem.draws)
                  }
                >
                  {this.props.isDivisionNameShow ? (
                    <span
                      className="text-overflow"
                      style={{
                        writingMode: isAxisInverted && slotHeightUnit === 1 ? 'tb' : 'unset',
                      }}
                    >
                      {slotObject.divisionName + '-' + slotObject.gradeName}
                    </span>
                  ) : (
                    <span
                      className="text-overflow"
                      style={{
                        writingMode: isAxisInverted && slotHeightUnit === 1 ? 'tb' : 'unset',
                      }}
                    >
                      {slotObject.homeTeamName} {slotHeightUnit > 1 ? <br /> : ' V '}
                      {slotObject.awayTeamName}
                    </span>
                  )}
                </Swappable>
              )}
            </div>

            {slotObject.drawsId !== null && (
              <div
                // className="box-exception"
                className="position-absolute"
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  minWidth: 16,
                  ...(isAxisInverted
                    ? {
                        top: '50%',
                        left: slotHeight,
                        transform: 'translateY(-50%)',
                      }
                    : {
                        top: slotHeight,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }),
                }}
              >
                {!timeRestrictionsSchedule.isUnavailable && !isDayInPast && (
                  <Menu
                    className="action-triple-dot-draws"
                    theme="light"
                    mode="horizontal"
                    style={{
                      lineHeight: '16px',
                      borderBottom: 0,
                      cursor: disabledStatus && 'no-drop',
                    }}
                  >
                    <SubMenu
                      disabled={disabledStatus}
                      className="m-0 d-flex justify-content-center"
                      key="sub1"
                      title={
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
                                transform: isAxisInverted ? 'rotate(-90deg)' : 'none',
                              }}
                            />
                          )}
                        </div>
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
                )}
              </div>
            )}
          </div>
        );
      }
    });
  }
}

export default MultiFieldDrawsCourtExpandTimeline;
