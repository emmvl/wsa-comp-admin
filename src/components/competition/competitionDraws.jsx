import React, { Component } from 'react';
import { Layout, Breadcrumb, Select, Button, Form } from 'antd';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import { NavLink } from 'react-router-dom';
import loadjs from 'loadjs';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getCompetitionDrawsAction,
  getDrawsRoundsAction,
  updateCompetitionDraws,
  saveDraws,
  getCompetitionVenue,
  updateCourtTimingsDrawsAction,
  clearDraws,
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
} from "../../util/sessionStorage"
import moment from "moment"
const { Header, Footer, Content } = Layout;
const { Option } = Select;

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

  getColumnData = (indexArray) => {
    let yIndex = indexArray[1];
    let drawData = this.props.drawsState.getStaticDrawsData;
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
    targetIndexArray
  ) => {
    let postData = null
    if (sourceObejct.drawsId == null) {
      let columnObject = this.getColumnData(sourceIndexArray)
      console.log("Column Object Source", columnObject)
      postData = {
        "drawsId": targetObject.drawsId,
        "venueCourtId": targetObject.venueCourtId,
        "matchDate": moment(columnObject.matchDate).format("YYYY-MM-DD HH:mm"),
        "startTime": columnObject.startTime,
        "endTime": columnObject.endTime,
      };
    } else {
      let columnObject = this.getColumnData(targetIndexArray)
      console.log("Column Object Target", columnObject)
      postData = {
        "drawsId": sourceObejct.drawsId,
        "venueCourtId": sourceObejct.venueCourtId,
        "matchDate": moment(columnObject.matchDate).format("YYYY-MM-DD HH:mm"),
        "startTime": columnObject.startTime,
        "endTime": columnObject.endTime,
      };
    }
    this.props.updateCourtTimingsDrawsAction(
      postData,
      sourceIndexArray,
      targetIndexArray,
      "add")
  }

  ///////update the competition draws on  swapping and hitting update Apis if both has value
  updateCompetitionDraws = (
    sourceObejct,
    targetObject,
    sourceIndexArray,
    targetIndexArray
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
      "add"
    );
  }




  onSwap(source, target) {
    let sourceIndexArray = source.split(':');
    let targetIndexArray = target.split(':');
    let sourceXIndex = sourceIndexArray[0];
    let sourceYIndex = sourceIndexArray[1];
    let targetXIndex = targetIndexArray[0];
    let targetYIndex = targetIndexArray[1];
    if (sourceXIndex === targetXIndex && sourceYIndex === targetYIndex) {
      return;
    }
    let drawData = this.props.drawsState.getStaticDrawsData;
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
        targetIndexArray
      )
    }
    else if (sourceObejct.drawsId == null && targetObject.drawsId == null) {
    }
    else {
      this.updateCompetitionNullDraws(
        sourceObejct,
        targetObject,
        sourceIndexArray,
        targetIndexArray
      )
    }
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
    console.log("this.props.drawsState.divisionGradeNameList", this.props.drawsState.divisionGradeNameList)
    return (
      <div className="row">
        <div className="col-sm-3">
          <div className="year-select-heading-view">
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
              marginRight: 50
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

  ////// Publish draws
  publishDraws() {
    this.props.saveDraws(this.state.yearRefId, this.state.firstTimeCompId, 1);
  }

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
                    style={{ minWidth: 120, whiteSpace: 'nowrap' }}
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
                    style={{ minWidth: 100 }}
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
          <div className="col-sm-2 comp-draw-edit-btn-view">
            <NavLink to="/competitionDrawEdit">
              <Button className="live-score-edit" type="primary">
                {AppConstants.edit}
              </Button>
            </NavLink>
          </div>
        </div>
        {/* {this.draggableView()} */}
        {
          this.props.drawsState.updateLoad ?
            <div><Loader visible={this.props.drawsState.updateLoad} />
              {this.draggableView()}
            </div> :
            this.draggableView()
        }
      </div>
    );
  };

  //////the gragable content view inside the container
  draggableView = () => {
    var dateMargin = 25;
    var dayMargin = 25;
    let topMargin = 0;
    return (
      <div className="draggable-wrap draw-data-table">
        <div className="scroll-bar pb-4">
          <div className="table-head-wrap">
            {/* Day name list */}
            <div className="tablehead-row">
              <div className="sr-no empty-bx"></div>
              {this.props.drawsState.dateArray.map((date, index) => {
                if (index !== 0) {
                  dateMargin += 110;
                }
                return (
                  <span style={{ left: dateMargin }} >
                    {getDayName(date)}
                  </span>
                );
              })}
            </div>
            {/* Times list */}
            <div className="tablehead-row">
              <div className="sr-no empty-bx"></div>
              {this.props.drawsState.dateArray.map((date, index) => {
                if (index !== 0) {
                  dayMargin += 110;
                }
                return (
                  <span style={{ left: dayMargin }}>{getTime(date)}</span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="main-canvas Draws">
          {this.props.drawsState.getStaticDrawsData.map((courtData, index) => {
            let leftMargin = 25;
            if (index !== 0) {
              topMargin += 55;
            }
            return (
              <div>
                <div className="sr-no">{index + 1}</div>
                {courtData.slotsArray.map((slotObject, slotIndex) => {
                  if (slotIndex !== 0) {
                    leftMargin += 110;
                  }
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
                          backgroundColor: slotObject.colorCode, left: leftMargin, top: topMargin, overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Swappable
                          id={index.toString() + ':' + slotIndex.toString()}
                          content={1}
                          swappable={true}
                          onSwap={(source, target) =>
                            this.onSwap(source, target)
                          }
                        >
                          {slotObject.drawsId != null ? (
                            <span>
                              {slotObject.homeTeamName} <br />
                              {slotObject.awayTeamName}
                            </span>
                          ) : (
                              <span>N/A</span>
                            )}
                        </Swappable>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  //////footer view containing all the buttons like submit and cancel
  footerView = () => {
    return (
      <div className="fluid-width">
        <div className="row">
          <div className="col-sm-3">
            <div className="reg-add-save-button">
            </div>
          </div>
          <div className="col-sm-9">
            <div className="comp-buttons-view">
              <Button
                className="open-reg-button"
                type="primary"
              >
                {AppConstants.publish}
              </Button>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
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
          {/* <Loader visible={this.props.drawsState.updateLoad} /> */}
          {this.headerView()}
          {this.dropdownView()}
          <Content>{this.contentView()}</Content>
          <Footer>{this.footerView()}</Footer>
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
    },
    dispatch
  );
}

function mapStatetoProps(state) {
  return {
    appState: state.AppState,
    drawsState: state.CompetitionDrawsState
  };
}
export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Form.create()(CompetitionDraws));
