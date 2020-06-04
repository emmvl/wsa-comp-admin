import React, { Component } from 'react';
import { Layout, Breadcrumb, Select, Button, Form, message, Modal, Menu } from 'antd';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import { NavLink } from 'react-router-dom';
import loadjs from 'loadjs';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import { connect } from 'react-redux';
import AppImages from "../../themes/appImages";
import { bindActionCreators } from 'redux';
import {
  getCompetitionDrawsAction,
  getDrawsRoundsAction,
  updateCompetitionDraws,
  saveDraws,
  getCompetitionVenue,
  updateCourtTimingsDrawsAction,
  clearDraws,
  publishDraws, matchesListDrawsAction, unlockDrawsAction
} from '../../store/actions/competitionModuleAction/competitionDrawsAction';
import Swappable from '../../customComponents/SwappableComponent';
import { getDayName, getTime } from '../../themes/dateformate';
import {
  getYearAndCompetitionOwnAction,
  getVenuesTypeAction
} from '../../store/actions/appAction';
import Loader from '../../customComponents/loader'
import {
  setOwnCompetitionYear,
  getOwnCompetitionYear,
  setOwn_competition,
  getOwn_competition,
  setDraws_venue,
  setDraws_round,
  setDraws_roundTime,
  getDraws_venue,
  getDraws_round,
  getDraws_roundTime,
  setDraws_division_grade,
  getDraws_division_grade,
  getOrganisationData
} from "../../util/sessionStorage"
import ValidationConstants from "../../themes/validationConstant"
import moment from "moment";
import LegendComponent from '../../customComponents/legendComponent';
import { isArrayNotEmpty } from "../../util/helpers";
import { generateDrawAction } from "../../store/actions/competitionModuleAction/competitionModuleAction";
const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu;
class CompetitionDraws extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearRefId: 1,
      firstTimeCompId: '',
      venueId: '',
      roundId: '',
      venueLoad: false,
      roundTime: null,
      competitionDivisionGradeId: "",
    };
  }

  componentDidUpdate(nextProps) {
    let competitionModuleState = this.props.competitionModuleState;
    let drawsRoundData = this.props.drawsState.getDrawsRoundsData;
    let venueData = this.props.drawsState.competitionVenues;
    let divisionGradeNameList = this.props.drawsState.divisionGradeNameList;

    if (this.state.venueLoad == true && this.props.drawsState.updateLoad == false) {
      if (nextProps.drawsState.getDrawsRoundsData !== drawsRoundData) {
        if (venueData.length > 0) {
          let venueId = venueData[0].id
          setDraws_venue(venueId)
          if (drawsRoundData.length > 0) {
            let roundId = drawsRoundData[0].roundId;
            setDraws_round(roundId)
            let roundTime = drawsRoundData[0].startDateTime
            setDraws_roundTime(roundTime)
            this.props.getCompetitionDrawsAction(
              this.state.yearRefId,
              this.state.firstTimeCompId,
              venueId,
              roundId
            );
            this.setState({
              roundId, roundTime, venueId,
              venueLoad: false,
            });

          }
          else {
            this.setState({
              venueId,
              venueLoad: false,
            })
          }
        }
        if (divisionGradeNameList.length > 0) {
          let competitionDivisionGradeId = divisionGradeNameList[0].competitionDivisionGradeId;
          setDraws_division_grade(competitionDivisionGradeId)
          this.setState({ competitionDivisionGradeId })
        }
      }
    }
    if (nextProps.appState !== this.props.appState) {
      let competitionList = this.props.appState.own_CompetitionArr;
      if (nextProps.appState.own_CompetitionArr !== competitionList) {
        if (competitionList.length > 0) {
          let competitionId = competitionList[0].competitionId;
          this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId);
          setOwn_competition(competitionId)
          this.setState({ firstTimeCompId: competitionId, venueLoad: true })
        }
      }
    }

    if (nextProps.competitionModuleState != competitionModuleState) {
      if (competitionModuleState.drawGenerateLoad == false
        && this.state.venueLoad === true) {
        this.setState({ venueLoad: false });
        if (competitionModuleState.status == 5) {
          message.error(ValidationConstants.drawsMessage[0]);
        }
        else if (!competitionModuleState.error && competitionModuleState.status == 1) {
          this.props.clearDraws("rounds")
          this.setState({ firstTimeCompId: this.state.firstTimeCompId, roundId: null, venueId: null, roundTime: null, venueLoad: true, competitionDivisionGradeId: null });
          // this.props.getCompetitionVenue(competitionId);
          this.props.getDrawsRoundsAction(this.state.yearRefId, this.state.firstTimeCompId);
        }
      }
    }
  }

  componentDidMount() {
    loadjs('assets/js/custom.js');
    this.apiCalls();
  }

  apiCalls() {
    this.props.clearDraws()
    let yearId = getOwnCompetitionYear()
    let storedCompetitionId = getOwn_competition()
    let propsData = this.props.appState.own_YearArr.length > 0 ? this.props.appState.own_YearArr : undefined
    let compData = this.props.appState.own_CompetitionArr.length > 0 ? this.props.appState.own_CompetitionArr : undefined
    let venueId = getDraws_venue()
    let roundId = getDraws_round()
    let roundTime = getDraws_roundTime()
    let roundData = this.props.drawsState.getDrawsRoundsData.length > 0 ? this.props.drawsState.getDrawsRoundsData : undefined
    let venueData = this.props.drawsState.competitionVenues.length > 0 ? this.props.drawsState.competitionVenues : undefined
    let competitionDivisionGradeId = getDraws_division_grade()
    if (storedCompetitionId && yearId && propsData && compData) {
      this.setState({
        yearRefId: JSON.parse(yearId),
        firstTimeCompId: storedCompetitionId,
        venueLoad: true
      })
      if (venueId && roundId && roundData && venueData) {

        this.props.getCompetitionDrawsAction(
          yearId,
          storedCompetitionId,
          venueId,
          roundId
        );
        this.setState({
          venueId: JSON.parse(venueId),
          roundId: JSON.parse(roundId),
          roundTime,
          competitionDivisionGradeId: JSON.parse(competitionDivisionGradeId),
          venueLoad: false
        })
      }
      else {

        this.props.getDrawsRoundsAction(yearId, storedCompetitionId);
      }
    }
    else if (yearId) {
      this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
      this.setState({
        yearRefId: JSON.parse(yearId)
      })
    }
    else {
      this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, null, 'own_competition')
      setOwnCompetitionYear(1)
    }
  }

  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  getColumnData = (indexArray, drawData) => {
    let yIndex = indexArray[1];
    // let drawData = this.props.drawsState.getStaticDrawsData;
    let object = null

    for (let i in drawData) {
      let slot = drawData[i].slotsArray[yIndex]
      if (slot.drawsId !== null) {
        object = slot
        break
      }
    }
    return object
  }

  ///////update the competition draws on  swapping and hitting update Apis if one has N/A(null)
  updateCompetitionNullDraws = (
    sourceObejct,
    targetObject,
    sourceIndexArray,
    targetIndexArray,
    drawData, round_Id
  ) => {
    let postData = null
    if (sourceObejct.drawsId == null) {
      let columnObject = this.getColumnData(sourceIndexArray, drawData)
      console.log("Column Object Source", columnObject)
      postData = {
        "drawsId": targetObject.drawsId,
        "venueCourtId": sourceObejct.venueCourtId,
        "matchDate": moment(columnObject.matchDate).format("YYYY-MM-DD HH:mm"),
        "startTime": columnObject.startTime,
        "endTime": columnObject.endTime,
      };
    } else {
      let columnObject = this.getColumnData(targetIndexArray, drawData)
      console.log("Column Object target", columnObject)
      postData = {
        "drawsId": sourceObejct.drawsId,
        "venueCourtId": targetObject.venueCourtId,
        "matchDate": moment(columnObject.matchDate).format("YYYY-MM-DD HH:mm"),
        "startTime": columnObject.startTime,
        "endTime": columnObject.endTime,
      };
    }
    this.props.updateCourtTimingsDrawsAction(
      postData,
      sourceIndexArray,
      targetIndexArray,
      "add", round_Id)
  }

  ///////update the competition draws on  swapping and hitting update Apis if both has value
  updateCompetitionDraws = (
    sourceObejct,
    targetObject,
    sourceIndexArray,
    targetIndexArray, drawsData, round_Id
  ) => {
    let customSourceObject = {
      // drawsId: sourceObejct.drawsId,
      drawsId: targetObject.drawsId,
      homeTeamId: sourceObejct.homeTeamId,
      awayTeamId: sourceObejct.awayTeamId,
      competitionDivisionGradeId: sourceObejct.competitionDivisionGradeId,
      isLocked: 1
    };
    let customTargetObject = {
      // drawsId: targetObject.drawsId,
      drawsId: sourceObejct.drawsId,
      homeTeamId: targetObject.homeTeamId,
      awayTeamId: targetObject.awayTeamId,
      // homeTeamId: 268,
      // awayTeamId: 262,
      competitionDivisionGradeId: targetObject.competitionDivisionGradeId,
      isLocked: 1
    };
    let postObject = {
      draws: [customSourceObject, customTargetObject]
    };

    this.props.updateCompetitionDraws(
      postObject,
      sourceIndexArray,
      targetIndexArray,
      "add", round_Id
    );
  }


  check = () => {
    if (this.state.firstTimeCompId == null || this.state.firstTimeCompId == "") {
      message.config({ duration: 0.9, maxCount: 1 })
      message.error(ValidationConstants.pleaseSelectCompetition)
    }
    else if (this.state.venueId == null && this.state.venueId == "") {
      message.config({ duration: 0.9, maxCount: 1 })
      message.error(ValidationConstants.pleaseSelectVenue)
    }
    else if (this.state.roundId == null || this.state.roundId == "") {
      message.config({ duration: 0.9, maxCount: 1 })
      message.error(ValidationConstants.pleaseSelectRound)
    }
    else {
      this.props.publishDraws(this.state.firstTimeCompId)
    }
  }



  openModel = (props, e) => {
    let this_ = this
    confirm({
      title: 'You have teams ‘Not in Draw’. Would you still like to proceed?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      maskClosable: true,
      mask: true,
      onOk() {
        this_.check()
      },
      onCancel() {
        console.log("cancel")
      },
    });
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
    // console.log("Source",sourceObejct)
    // console.log("Target",targetObject)
    // drawData
    if (sourceObejct.drawsId !== null && targetObject.drawsId !== null) {
      this.updateCompetitionDraws(
        sourceObejct,
        targetObject,
        sourceIndexArray,
        targetIndexArray,
        drawData, round_Id
      )
    }
    else if (sourceObejct.drawsId == null && targetObject.drawsId == null) {
    }
    else {
      this.updateCompetitionNullDraws(
        sourceObejct,
        targetObject,
        sourceIndexArray,
        targetIndexArray,
        drawData, round_Id
      )
    }
  }

  onMatchesList = () => {
    this.props.matchesListDrawsAction(this.state.firstTimeCompId);
  }

  ///////view for breadcrumb
  headerView = () => {
    return (
      <Header className="comp-draws-header-view mt-4">
        <div className="row">
          <div
            className="col-sm"
            style={{ display: 'flex', alignContent: 'center' }}
          >
            <Breadcrumb
              style={{
                display: 'flex',
                lignItems: 'center',
                alignSelf: 'center'
              }}
              separator=" > "
            >
              <Breadcrumb.Item className="breadcrumb-add">
                {' '}
                {AppConstants.draws}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className="col-sm" style={{ alignSelf: 'center' }}>
          <div className="comp-dashboard-botton-view-mobile" style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => this.onMatchesList()} className="primary-add-comp-form" type="primary">
              <div className="row">
                <div className="col-sm">
                  <img src={AppImages.export} alt="" className="export-image" />
                  {AppConstants.matchesList}
                </div>
              </div>
            </Button>
          </div>
        </div>
      </Header>
    );
  };

  //////year change onchange
  onYearChange = yearId => {
    this.props.clearDraws("rounds")
    setOwnCompetitionYear(yearId)
    setOwn_competition(undefined)
    this.setState({ firstTimeCompId: null, yearRefId: yearId, roundId: null, roundTime: null, venueId: null, competitionDivisionGradeId: null });
    this.props.getYearAndCompetitionOwnAction(
      this.props.appState.own_YearArr,
      yearId,
      "own_competition"
    );
  };

  // on Competition change
  onCompetitionChange(competitionId) {
    setOwn_competition(competitionId)
    this.props.clearDraws("rounds")
    this.setState({ firstTimeCompId: competitionId, roundId: null, venueId: null, roundTime: null, venueLoad: true, competitionDivisionGradeId: null });
    // this.props.getCompetitionVenue(competitionId);
    this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId);
  }

  // on DivisionGradeNameChange
  onDivisionGradeNameChange(competitionDivisionGradeId) {
    setDraws_division_grade(competitionDivisionGradeId)
    this.setState({ competitionDivisionGradeId });
  }

  ///dropdown view containing all the dropdown of header
  dropdownView = () => {
    return (
      <div className="row">
        <div className="col-sm-3">
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 50
          }}>
            <span className="year-select-heading">{AppConstants.draws}:</span>
            <Select
              name={'yearRefId'}
              className="year-select"
              onChange={yearRefId => this.onYearChange(yearRefId)}
              value={this.state.yearRefId}
            >
              {this.props.appState.own_YearArr.map(item => {
                return (
                  <Option key={'yearRefId' + item.id} value={item.id}>
                    {item.description}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
        <div className="col-sm-4">
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 50
            }}
          >
            <span className="year-select-heading">
              {AppConstants.competition}:
            </span>
            <Select
              style={{ minWidth: 160 }}
              name={'competition'}
              className="year-select"
              onChange={competitionId =>
                this.onCompetitionChange(competitionId)
              }
              value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
            >
              {this.props.appState.own_CompetitionArr.map(item => {
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
        <div className="col-sm-5">
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              // marginRight: 50
            }}
          >
            <span className="year-select-heading">
              {AppConstants.division}:
            </span>
            <Select
              style={{ minWidth: 160 }}
              name={'competition'}
              className="year-select"
              onChange={competitionDivisionGradeId =>
                this.onDivisionGradeNameChange(competitionDivisionGradeId)
              }
              value={JSON.parse(JSON.stringify(this.state.competitionDivisionGradeId))}
            >
              {this.props.drawsState.divisionGradeNameList.map(item => {
                return (
                  <Option
                    key={'divisionGradeNameList' + item.competitionDivisionGradeId}
                    value={item.competitionDivisionGradeId}
                  >
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
    );
  };

  ////////on venue change
  onVenueChange = venueId => {
    this.setState({ venueId });
    setDraws_venue(venueId)
    this.props.clearDraws()
    this.props.getCompetitionDrawsAction(
      this.state.yearRefId,
      this.state.firstTimeCompId,
      venueId,
      this.state.roundId
    );
  };

  //////onRoundsChange
  onRoundsChange = roundId => {
    let roundData = this.props.drawsState.getDrawsRoundsData
    this.props.clearDraws()
    let matchRoundData = roundData.findIndex(x => x.roundId == roundId)
    let roundTime = roundData[matchRoundData].startDateTime
    // this.props.dateSelection(roundId)
    this.setState({ roundId, roundTime });
    setDraws_round(roundId)
    setDraws_roundTime(roundTime)
    this.props.getCompetitionDrawsAction(
      this.state.yearRefId,
      this.state.firstTimeCompId,
      this.state.venueId,
      roundId
    );
  };

  reGenerateDraw = () => {
    let payload = {
      yearRefId: this.state.yearRefId,
      competitionUniqueKey: this.state.firstTimeCompId,
      organisationId: getOrganisationData().organisationUniqueKey
    }
    this.props.generateDrawAction(payload);
    this.setState({ venueLoad: true });
  }
  //unlockDraws

  unlockDraws(id, round_Id,venueCourtId) {
    this.props.unlockDrawsAction(id, round_Id,venueCourtId)


  }


  ////// Publish draws
  // publishDraws() {
  //   this.props.saveDraws(this.state.yearRefId, this.state.firstTimeCompId, 1);
  // }

  ////////form content view
  contentView = () => {
    return (
      <div className="comp-draw-content-view">
        <div className="row comp-draw-list-top-head">
          <div className="col-sm-10">
            <span className="form-heading">{AppConstants.draws}</span>
            <div className="row">
              <div className="col-sm mr-0">
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <span className="year-select-heading">
                    {AppConstants.venue}:
                  </span>
                  <Select
                    className="year-select"
                    placeholder="Select"
                    style={{ minWidth: 120, maxWidth: 270, whiteSpace: 'nowrap' }}
                    onChange={venueId => this.onVenueChange(venueId)}
                    value={JSON.parse(JSON.stringify(this.state.venueId))}
                  >
                    {this.props.drawsState.competitionVenues.length > 0 &&
                      this.props.drawsState.competitionVenues.map(item => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
              <div className="col-sm pl-0">
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <span className="year-select-heading">
                    {AppConstants.round}:
                  </span>
                  <Select
                    className="year-select"
                    style={{ minWidth: 100, maxWidth: 130 }}
                    onChange={roundId => this.onRoundsChange(roundId)}
                    value={this.state.roundId}
                  >
                    {this.props.drawsState.getDrawsRoundsData.length > 0 &&
                      this.props.drawsState.getDrawsRoundsData.map(item => {
                        return (
                          <Option key={item.roundId} value={item.roundId}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                  {this.state.roundTime !== null &&
                    <span className="year-select-heading pb-1">
                      {"Starting"} {"  "}{moment(this.state.roundTime).format("ddd DD/MM")}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-sm-2 comp-draw-edit-btn-view">
            <NavLink to="/competitionDrawEdit">
              <Button className="live-score-edit" type="primary">
                {AppConstants.edit}
              </Button>
            </NavLink>
          </div> */}

        </div>
        {/* {this.draggableView()} */}
        {
          this.props.drawsState.updateLoad ?
            <div className="draggable-wrap draw-data-table"><Loader visible={this.props.drawsState.updateLoad} />
              {this.props.drawsState.getRoundsDrawsdata.length > 0 && this.props.drawsState.getRoundsDrawsdata.map((dateItem, dateIndex) => {

                return (
                  <div>
                    <div className="draws-round-view" >

                      <span className="draws-round">{dateItem.roundName}</span>

                    </div>
                    {this.draggableView(dateItem)}
                    <LegendComponent legendArray={dateItem.legendsArray} />
                  </div>
                )
              })}
            </div> :
            <div className="draggable-wrap draw-data-table">
              {
                this.props.drawsState.getRoundsDrawsdata.length > 0 && this.props.drawsState.getRoundsDrawsdata.map((dateItem, dateIndex) => {
                  return (
                    <div>
                      <div className="draws-round-view" >

                        <span className="draws-round">{dateItem.roundName}</span>

                      </div>
                      {this.draggableView(dateItem)}
                      <LegendComponent legendArray={dateItem.legendsArray} />
                    </div>
                  )
                }
                )
              }
            </div>
        }
      </div>
    );
  };


  //////the gragable content view inside the container
  draggableView = (dateItem) => {
    var dateMargin = 25;
    var dayMargin = 25;
    let topMargin = 0;
    console.log(dateItem)
    let legendsData = isArrayNotEmpty(this.props.drawsState.legendsArray) ? this.props.drawsState.legendsArray : []
    return (
      <div >

        <div className="scroll-bar pb-4">
          <div className="table-head-wrap">
            {/* Day name list */}
            <div className="tablehead-row">
              <div className="sr-no empty-bx"></div>

              {
                dateItem.dateNewArray.length > 0 && dateItem.dateNewArray.map((item, index) => {
                  if (index !== 0) {
                    dateMargin += 110;
                  }
                  if (index == 0) {
                    dateMargin = 70
                  }
                  return (
                    <span style={{ left: dateMargin }} >
                      {item.notInDraw == false ? getDayName(item.date) : ""}
                    </span>
                  );
                })
              }

            </div>
            {/* Times list */}
            <div className="tablehead-row">
              <div className="sr-no empty-bx"></div>


              {dateItem.dateNewArray.length > 0 && dateItem.dateNewArray.map((item, index) => {
                if (index !== 0) {
                  dayMargin += 110;
                }
                if (index == 0) {
                  dayMargin = 70;
                }
                return (
                  <span style={{ left: dayMargin, fontSize: item.notInDraw !== false && 11 }}>{item.notInDraw == false ? getTime(item.date) : "Not in draw"}</span>
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
              <div>
                <div className="sr-no" style={{ height: 62 }}>
                  <div className="venueCourt-tex-div">
                    <span className="venueCourt-text">{courtData.venueShortName + "-" + courtData.venueCourtName}</span>
                  </div>
                </div>
                {courtData.slotsArray.map((slotObject, slotIndex) => {
                  if (slotIndex !== 0) {
                    leftMargin += 110;
                  }
                  if (slotIndex == 0) {
                    leftMargin = 70;
                  }
                  console.log(slotObject.isLocked)
                  return (
                    <div>
                      <span
                        style={{ left: leftMargin, top: topMargin }}
                        className={
                          'border'
                        }
                      ></span>
                      <div
                        className={
                          'box purple-bg'
                        }
                        style={{
                          backgroundColor: slotObject.competitionDivisionGradeId == this.state.competitionDivisionGradeId || this.state.competitionDivisionGradeId == 0 ? slotObject.colorCode : "#999999",
                          left: leftMargin, top: topMargin, overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Swappable
                          id={index.toString() + ':' + slotIndex.toString() + ':' + dateItem.roundId.toString()}
                          content={1}
                          swappable={slotObject.competitionDivisionGradeId == this.state.competitionDivisionGradeId || this.state.competitionDivisionGradeId == 0 ? true : false}
                          onSwap={(source, target) =>
                            this.onSwap(source, target, dateItem.draws, dateItem.roundId)
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

                      </div>
                      {slotObject.drawsId !== null &&
                        <div className='box-exception' style={{
                          left: leftMargin, top: topMargin + 50, overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}>

                          <Menu
                            className="action-triple-dot-draws"
                            theme="light"
                            mode="horizontal"
                            style={{ lineHeight: '15px', }}
                          >
                            <SubMenu
                              key="sub1"
                              title={





                                slotObject.isLocked == 1 ?
                                  <div style={{ display: 'flex', justifyContent: 'space-between', width: 80, maxWidth: 80 }}>
                                    <img className="dot-image" src={AppImages.drawsLock} alt="" width="16" height="10" />
                                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="10" />
                                  </div>
                                  :
                                  <div>
                                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="10" />
                                  </div>
                              }
                            >
                              {slotObject.isLocked == 1 &&
                                <Menu.Item key="1">
                                  <span onClick={() => this.unlockDraws(slotObject.drawsId, dateItem.roundId,courtData.venueCourtId)} >Unlock</span>
                                </Menu.Item>
                              }
                              <Menu.Item key="2" >
                                <NavLink to={{ pathname: `/competitionException`, state: { drawsObj: slotObject } }} >
                                  <span >Exception</span>
                                </NavLink>
                              </Menu.Item>
                            </SubMenu>
                          </Menu>


                        </div>
                      }
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="draws-legend-view">
          {/* <LegendComponent legendArray={Array(10).fill(legendsData).flat()} /> */}

        </div>
      </div>
    );
  };
  //////footer view containing all the buttons like submit and cancel
  footerView = () => {
    let publishStatus = this.props.drawsState.publishStatus
    let isTeamNotInDraws = this.props.drawsState.isTeamInDraw
    return (
      <div className="fluid-width">
        <div className="row">
          <div className="col-sm-3">
            <div className="reg-add-save-button">
            </div>
          </div>
          <div className="col-sm">
            <div className="comp-buttons-view">
              {/* <NavLink to="/competitionFormat"> */}
              <Button className="open-reg-button" type="primary" onClick={() => this.reGenerateDraw()}>
                {AppConstants.regenerateDraw}
              </Button>
              <div><Loader visible={this.props.competitionModuleState.drawGenerateLoad} />
              </div>
              {/* </NavLink> */}
            </div>
          </div>
          <div>
            <div className="comp-buttons-view">
              <Button
                className="open-reg-button"
                type="primary"
                htmlType="submit"
                onClick={() => isTeamNotInDraws == 1 ? this.openModel(this.props) : this.check()}
                disabled={publishStatus == 0 ? false : true}
              >
                {AppConstants.publish}
              </Button>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div >
    );
  };

  render() {
    return (
      <div className="fluid-width" style={{ backgroundColor: '#f7fafc' }}>
        <DashboardLayout
          menuHeading={AppConstants.competitions}
          menuName={AppConstants.competitions}
        />
        <InnerHorizontalMenu menu={'competition'} compSelectedKey={'18'} />
        <Layout className="comp-dash-table-view">
          {this.headerView()}
          {this.dropdownView()}
          {/* <Form
            onSubmit={this.saveAPIsActionCall}
          > */}
          {/* <Loader visible={this.props.drawsState.updateLoad} /> */}
          <Content>{this.contentView()}</Content>
          <Footer>{this.footerView()}</Footer>
          {/* </Form> */}
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
      updateCompetitionDraws,
      saveDraws,
      getCompetitionVenue,
      updateCourtTimingsDrawsAction,
      clearDraws,
      publishDraws,
      matchesListDrawsAction,
      generateDrawAction,
      unlockDrawsAction
    },
    dispatch
  );
}

function mapStatetoProps(state) {
  return {
    appState: state.AppState,
    drawsState: state.CompetitionDrawsState,
    competitionModuleState: state.CompetitionModuleState
  };
}
export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Form.create()(CompetitionDraws));
