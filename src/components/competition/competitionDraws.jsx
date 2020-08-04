import React, { Component } from 'react';
import {
  Layout,
  Breadcrumb,
  Select,
  Spin,
  Button,
  Form,
  message,
  Modal,
  Menu,
  Tooltip
} from 'antd';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import { NavLink } from 'react-router-dom';
import loadjs from 'loadjs';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import { connect } from 'react-redux';
import AppImages from '../../themes/appImages';
import { bindActionCreators } from 'redux';
import DrawsPublishModel from '../../customComponents/drawsPublishModel'
import {
  getCompetitionDrawsAction,
  getDrawsRoundsAction,
  updateCompetitionDraws,
  saveDraws,
  getCompetitionVenue,
  updateCourtTimingsDrawsAction,
  clearDraws,
  publishDraws,
  matchesListDrawsAction,
  unlockDrawsAction,
  getActiveRoundsAction
} from '../../store/actions/competitionModuleAction/competitionDrawsAction';
import Swappable from '../../customComponents/SwappableComponent';
import { getDayName, getTime } from '../../themes/dateformate';
import {
  getYearAndCompetitionOwnAction,
  getVenuesTypeAction,
} from '../../store/actions/appAction';
import Loader from '../../customComponents/loader';
import history from "../../util/history"
import {setLiveScoreUmpireCompition, setLiveScoreUmpireCompitionData } from "../../util/sessionStorage"

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
  getOrganisationData,

  getOwn_competitionStatus,
  setOwn_competitionStatus
} from '../../util/sessionStorage';
import ValidationConstants from '../../themes/validationConstant';
import moment from 'moment';
import LegendComponent from '../../customComponents/legendComponent';
import { isArrayNotEmpty } from '../../util/helpers';
import { generateDrawAction } from '../../store/actions/competitionModuleAction/competitionModuleAction';
import AppUniqueId from "../../themes/appUniqueId";

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
      competitionDivisionGradeId: '',
      organisationId: getOrganisationData().organisationUniqueKey,
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
      publishModalVisible: false
    };

  }

  componentDidUpdate(nextProps) {
    let userState = this.props.userState
    let competitionModuleState = this.props.competitionModuleState;
    let drawsRoundData = this.props.drawsState.getDrawsRoundsData;
    let drawOrganisations = this.props.drawsState.drawOrganisations
    let venueData = this.props.drawsState.competitionVenues;
    let divisionGradeNameList = this.props.drawsState.divisionGradeNameList;
    let changeStatus = this.props.drawsState.changeStatus
    if (
      this.state.venueLoad == true &&
      this.props.drawsState.updateLoad == false
    ) {
      if (nextProps.drawsState.getDrawsRoundsData !== drawsRoundData) {
        if (venueData.length > 0) {
          let venueId = venueData[0].id;
          setDraws_venue(venueId);
          if (drawsRoundData.length > 0) {
            let roundId = null;
            let roundTime = null;
            if (drawsRoundData.length > 1) {
              roundId = drawsRoundData[1].roundId;
              setDraws_round(roundId);
              roundTime = drawsRoundData[1].startDateTime;
              setDraws_roundTime(roundTime);
              this.props.getCompetitionDrawsAction(
                this.state.yearRefId,
                this.state.firstTimeCompId,
                venueId,
                roundId, null
              );
              this.setState({
                roundId,
                roundTime,
                venueId,
                venueLoad: false,
              });
            } else {
              roundId = drawsRoundData[0].roundId;
              setDraws_round(roundId);
              roundTime = drawsRoundData[0].startDateTime;
              setDraws_roundTime(roundTime);
              this.props.getCompetitionDrawsAction(
                this.state.yearRefId,
                this.state.firstTimeCompId,
                venueId,
                roundId, null
              );
              this.setState({
                roundId,
                roundTime,
                venueId,
                venueLoad: false,
              });
            }
          } else {
            this.setState({
              venueId,
              venueLoad: false,
            });
          }
        }
        if (divisionGradeNameList.length > 0) {
          let competitionDivisionGradeId =
            divisionGradeNameList[0].competitionDivisionGradeId;
          setDraws_division_grade(competitionDivisionGradeId);
          this.setState({ competitionDivisionGradeId });
        }
      }
    }
    if (nextProps.appState !== this.props.appState) {
      let competitionList = this.props.appState.own_CompetitionArr;
      if (nextProps.appState.own_CompetitionArr !== competitionList) {
        if (competitionList.length > 0) {
          let competitionId = competitionList[0].competitionId;
          let statusRefId = competitionList[0].statusRefId
          setOwn_competitionStatus(statusRefId)
          this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId);
          setOwn_competition(competitionId);
          this.setState({ firstTimeCompId: competitionId, venueLoad: true, competitionStatus: statusRefId });
        }
      }
    }

    if (nextProps.competitionModuleState != competitionModuleState) {
      if (
        competitionModuleState.drawGenerateLoad == false &&
        this.state.venueLoad === true
      ) {
        this.setState({ venueLoad: false });
        if (competitionModuleState.status == 5) {
          message.error(ValidationConstants.drawsMessage[0]);
        } else if (
          !competitionModuleState.error &&
          competitionModuleState.status == 1
        ) {
          this.props.clearDraws('rounds');
          this.setState({
            firstTimeCompId: this.state.firstTimeCompId,
            roundId: null,
            venueId: null,
            roundTime: null,
            venueLoad: true,
            competitionDivisionGradeId: null,
          });
          // this.props.getCompetitionVenue(competitionId);
          this.props.getDrawsRoundsAction(
            this.state.yearRefId,
            this.state.firstTimeCompId
          );
        }
      }
    }

    if (nextProps.drawsState.changeStatus != changeStatus) {
      if (this.props.drawsState.changeStatus == false && this.state.changeStatus == true) {
        let statusRefId = this.props.drawsState.publishStatus
        console.log(this.props.appState.own_CompetitionArr)
        setOwn_competitionStatus(statusRefId)
        message.success("Draws published to live scores successfully");
        this.setState({ changeStatus: false, competitionStatus: statusRefId })

        if(this.props.drawsState.teamNames!= null && this.props.drawsState.teamNames!= ""){
          this.setState({publishModalVisible: true});
        }
      }
    }
    if (
      this.state.roundLoad == true && this.props.drawsState.onActRndLoad == false
    ) {
      this.setState({ roundLoad: false });
      if (this.props.drawsState.activeDrawsRoundsData != null &&
        this.props.drawsState.activeDrawsRoundsData.length > 0) {
        this.setState({ drawGenerateModalVisible: true })
      }
      else {
        this.callGenerateDraw();
        // message.config({ duration: 0.9, maxCount: 1 });
        // message.info(AppConstants.roundsNotAvailable);
      }
    }

    // if (nextProps.drawsState.drawOrganisations != drawOrganisations) {
    //   if (drawOrganisations.length > 0) {
    //     let organisation_Id = drawOrganisations[0].organisationUniqueKey;
    //     this.setState({ organisation_Id })
    //   }
    // }
  }

  componentDidMount() {
    loadjs('assets/js/custom.js');
    this.apiCalls();
  }

  apiCalls() {
    this.props.clearDraws();
    let yearId = getOwnCompetitionYear();
    let storedCompetitionId = getOwn_competition();
    let storedCompetitionStatus = getOwn_competitionStatus()
    let propsData =
      this.props.appState.own_YearArr.length > 0
        ? this.props.appState.own_YearArr
        : undefined;
    let compData =
      this.props.appState.own_CompetitionArr.length > 0
        ? this.props.appState.own_CompetitionArr
        : undefined;
    let venueId = getDraws_venue();
    let roundId = getDraws_round();
    let roundTime = getDraws_roundTime();
    let roundData =
      this.props.drawsState.getDrawsRoundsData.length > 0
        ? this.props.drawsState.getDrawsRoundsData
        : undefined;
    let venueData =
      this.props.drawsState.competitionVenues.length > 0
        ? this.props.drawsState.competitionVenues
        : undefined;
    let competitionDivisionGradeId = getDraws_division_grade();
    if (storedCompetitionId && yearId && propsData && compData) {
      this.setState({
        yearRefId: JSON.parse(yearId),
        firstTimeCompId: storedCompetitionId,
        competitionStatus: storedCompetitionStatus,
        venueLoad: true,
      });
      if (venueId && roundId && roundData && venueData) {
        this.props.getCompetitionDrawsAction(
          yearId,
          storedCompetitionId,
          venueId,
          roundId, null
        );

        this.setState({
          venueId: JSON.parse(venueId),
          roundId: JSON.parse(roundId),
          roundTime: roundTime,
          competitionDivisionGradeId: JSON.parse(competitionDivisionGradeId),
          venueLoad: false,
        });
      } else {
        this.props.getDrawsRoundsAction(yearId, storedCompetitionId);
      }
    } else if (yearId) {
      this.props.getYearAndCompetitionOwnAction(
        this.props.appState.own_YearArr,
        yearId,
        'own_competition'
      );
      this.setState({
        yearRefId: JSON.parse(yearId),
      });
    } else {
      this.props.getYearAndCompetitionOwnAction(
        this.props.appState.own_YearArr,
        null,
        'own_competition'
      );
      setOwnCompetitionYear(1);
    }
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  getColumnData = (indexArray, drawData) => {
    let yIndex = indexArray[1];
    // let drawData = this.props.drawsState.getStaticDrawsData;
    let object = null;

    for (let i in drawData) {
      let slot = drawData[i].slotsArray[yIndex];
      if (slot.drawsId !== null) {
        object = slot;
        break;
      }
    }
    return object;
  };

  ///////update the competition draws on  swapping and hitting update Apis if one has N/A(null)
  updateCompetitionNullDraws = (
    sourceObejct,
    targetObject,
    sourceIndexArray,
    targetIndexArray,
    drawData,
    round_Id
  ) => {
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
    this.props.updateCourtTimingsDrawsAction(
      postData,
      sourceIndexArray,
      targetIndexArray,
      'add',
      round_Id
    );

    this.setState({ updateLoad: true });
  };

  ///////update the competition draws on  swapping and hitting update Apis if both has value
  updateCompetitionDraws = (
    sourceObejct,
    targetObject,
    sourceIndexArray,
    targetIndexArray,
    drawsData,
    round_Id
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
    let postObject = {
      draws: [customSourceObject, customTargetObject],
    };

    this.props.updateCompetitionDraws(
      postObject,
      sourceIndexArray,
      targetIndexArray,
      'add',
      round_Id
    );

    this.setState({ updateLoad: true });
  };

  check = () => {
    if (
      this.state.firstTimeCompId == null ||
      this.state.firstTimeCompId == ''
    ) {
      message.config({ duration: 0.9, maxCount: 1 });
      message.error(ValidationConstants.pleaseSelectCompetition);
    } else if (this.state.venueId == null && this.state.venueId == '') {
      message.config({ duration: 0.9, maxCount: 1 });
      message.error(ValidationConstants.pleaseSelectVenue);
    } else {
      this.setState({ visible: true })
      //this.props.publishDraws(this.state.firstTimeCompId);
    }
  };

  openModel = (props, e) => {
    let this_ = this;
    confirm({
      title: 'You have teams ‘Not in Draw’. Would you still like to proceed?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      maskClosable: true,
      mask: true,
      onOk() {
        this_.check();
      },
      onCancel() {
        console.log('cancel');
      },
    });
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
        round_Id
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

  onMatchesList = () => {
    this.props.matchesListDrawsAction(this.state.firstTimeCompId);
  };

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
                alignSelf: 'center',
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
          <div
            className="comp-dashboard-botton-view-mobile"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              disabled={this.state.competitionStatus == 1 ? true : false}
              id={AppUniqueId.matchList_Btn}
              onClick={() => this.onMatchesList()}
              className="primary-add-comp-form"
              type="primary"
            >
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

  onchangeOrganisation = (organisation_Id) => {
    this.setState({
      organisation_Id
    })
  }

  //////year change onchange
  onYearChange = (yearId) => {
    this.props.clearDraws('rounds');
    setOwnCompetitionYear(yearId);
    setOwn_competition(undefined);
    setOwn_competitionStatus(undefined)
    this.setState({
      firstTimeCompId: null,
      yearRefId: yearId,
      roundId: null,
      roundTime: null,
      venueId: null,
      competitionDivisionGradeId: null,
      organisation_Id: "-1",
      competitionStatus: 0
    });
    this.props.getYearAndCompetitionOwnAction(
      this.props.appState.own_YearArr,
      yearId,
      'own_competition'
    );
  };

  // on Competition change
  onCompetitionChange(competitionId, statusRefId) {
    setOwn_competition(competitionId);
    setOwn_competitionStatus(statusRefId)
    this.props.clearDraws('rounds');
    this.setState({
      firstTimeCompId: competitionId,
      roundId: null,
      venueId: null,
      roundTime: null,
      venueLoad: true,
      competitionDivisionGradeId: null,
      competitionStatus: statusRefId,
      organisation_Id: "-1"
    });
    // this.props.getCompetitionVenue(competitionId);
    this.props.getDrawsRoundsAction(this.state.yearRefId, competitionId);
  }

  // on DivisionGradeNameChange
  onDivisionGradeNameChange(competitionDivisionGradeId) {
    setDraws_division_grade(competitionDivisionGradeId);
    this.setState({ competitionDivisionGradeId });
  }

  ///dropdown view containing all the dropdown of header
  dropdownView = () => {
    let disabledStatus = this.state.competitionStatus == 1 ? true : false
    return (
      <div className="row">
        <div className="col-sm-2 pb-3">
          <div
            style={{
              width: '100%',
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
              style={{ width: 90 }}
              onChange={(yearRefId) => this.onYearChange(yearRefId)}
              value={this.state.yearRefId}
            >
              {this.props.appState.own_YearArr.map((item) => {
                return (
                  <Option key={'yearRefId' + item.id} value={item.id}>
                    {item.description}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
        <div className="col-sm pb-3">
          <div
            style={{
              width: "fit-content",
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 50,
            }}
          >
            <span className="year-select-heading">
              {AppConstants.competition}:
            </span>
            <Select
              // style={{ minWidth: 200 }}
              name={'competition'}
              className="year-select reg-filter-select-competition ml-2"
              onChange={(competitionId, e) =>
                this.onCompetitionChange(competitionId, e.key)
              }
              value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
            >
              {this.props.appState.own_CompetitionArr.map((item) => {
                return (
                  <Option
                    key={item.statusRefId}
                    value={item.competitionId}
                  >
                    {item.competitionName}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
        <div className="col-sm pb-3">
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
              id={AppUniqueId.division_dpdn}
              style={{ minWidth: 160 }}
              name={'competition'}
              disabled={disabledStatus}
              className="year-select reg-filter-select1 ml-2"
              onChange={(competitionDivisionGradeId) =>
                this.onDivisionGradeNameChange(competitionDivisionGradeId)
              }
              value={JSON.parse(
                JSON.stringify(this.state.competitionDivisionGradeId)
              )}
            >
              {this.props.drawsState.divisionGradeNameList.map((item) => {
                return (
                  <Option
                    key={
                      'divisionGradeNameList' + item.competitionDivisionGradeId
                    }
                    value={item.competitionDivisionGradeId}
                  >
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </div>

        </div>
        <div className="col-sm pb-3">
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
              {AppConstants.organisation}:
            </span>
            <Select
              disabled={disabledStatus}
              id={AppUniqueId.organisation_dpdn}
              style={{ minWidth: 160 }}
              name={'competition'}
              className="year-select reg-filter-select1 ml-2"
              onChange={(oragnisationId) =>
                this.onchangeOrganisation(oragnisationId)
              }
              value={this.state.organisation_Id}
            >
              <Option
                key={
                  "-1"
                }
                value={"-1"}
              >
                {AppConstants.all}
              </Option>
              {
                this.props.drawsState.drawOrganisations.map((item) => {
                  return (
                    <Option
                      key={
                        'orgId' + item.organisationUniqueKey
                      }
                      value={item.organisationUniqueKey}
                    >
                      {item.organisationName}
                    </Option>
                  );
                })
              }
            </Select>
          </div>
        </div>
      </div >
    );
  };

  ////////on venue change
  onVenueChange = (venueId) => {
    this.setState({ venueId });
    setDraws_venue(venueId);
    this.props.clearDraws();
    this.props.getCompetitionDrawsAction(
      this.state.yearRefId,
      this.state.firstTimeCompId,
      venueId,
      this.state.roundId, this.state.organisation_Id
    );
  };

  //////onRoundsChange
  onRoundsChange = (roundId) => {
    let roundData = this.props.drawsState.getDrawsRoundsData;
    this.props.clearDraws();
    let matchRoundData = roundData.findIndex((x) => x.roundId == roundId);
    let roundTime = roundData[matchRoundData].startDateTime;
    // this.props.dateSelection(roundId)
    this.setState({ roundId, roundTime });
    setDraws_round(roundId);
    setDraws_roundTime(roundTime);
    this.props.getCompetitionDrawsAction(
      this.state.yearRefId,
      this.state.firstTimeCompId,
      this.state.venueId,
      roundId,
      this.state.organisation_Id
    );
  };

  reGenerateDraw = () => {
    let competitionStatus = getOwn_competitionStatus();
    if (competitionStatus == 2) {
      this.props.getActiveRoundsAction(this.state.yearRefId, this.state.firstTimeCompId);
      this.setState({ roundLoad: true });
    }
    else {
      this.callGenerateDraw();
    }

  };

  handleGenerateDrawModal = (key) => {
    if (key == "ok") {
      if (this.state.generateRoundId != null) {
        this.callGenerateDraw();
        this.setState({ drawGenerateModalVisible: false });
      }
      else {
        message.error("Please select round");
      }
    }
    else {
      this.setState({ drawGenerateModalVisible: false });
    }
  }

  callGenerateDraw = () => {
    let payload = {
      yearRefId: this.state.yearRefId,
      competitionUniqueKey: this.state.firstTimeCompId,
      organisationId: getOrganisationData().organisationUniqueKey,
      roundId: this.state.generateRoundId
    };
    this.props.generateDrawAction(payload);
    this.setState({ venueLoad: true });
  }

  handlePublishModal = (key) => {
    if (key == "ok") {
      let competitiondata =  this.props.drawsState.liveScoreCompetiton
      localStorage.setItem("LiveScoreCompetiton", JSON.stringify(competitiondata))
      localStorage.removeItem('stateWideMessege')
      setLiveScoreUmpireCompition(competitiondata.id)
      setLiveScoreUmpireCompitionData(JSON.stringify(competitiondata))
      history.push('/liveScoreLadderList')
    }
    this.setState({ publishModalVisible: false });
  }


  //unlockDraws
  unlockDraws(id, round_Id, venueCourtId) {
    this.props.unlockDrawsAction(id, round_Id, venueCourtId);
  }


  onChangeRadio = e => {
    this.setState({
      value: e.target.value,
    });
    if (e.target.value == 2) {
      this.state.publishPartModel.isShowPart = true;
      this.setState({
        publishPartModel: this.state.publishPartModel
      })
    }
    else {
      this.state.publishPartModel.isShowPart = false;
    }
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
    this.state.publishPartModel.publishPart.isShowRound = false;
    this.state.publishPartModel.publishPart.isShowDivision = false;
    this.state.publishPartModel.isShowPart = false;
    this.state.value = 1;
  };

  checkDivision = e => {
    if (e.target.checked) {
      this.state.publishPartModel.publishPart.isShowDivision = true;
    }
    else {
      this.state.publishPartModel.publishPart.isShowDivision = false;
	  this.onSelectDivisionsValues(null)									
    }
    this.setState({
      publishPart: this.state.publishPartModel.publishPart
    })
  }

  checkRound = e => {
    if (e.target.checked) {
      this.state.publishPartModel.publishPart.isShowRound = true;
    }
    else {
      this.state.publishPartModel.publishPart.isShowRound = false;
	  this.onSelectRoundValues(null)							
    }
    this.setState({
      publishPart: this.state.publishPartModel.publishPart
    })
  }

  onSelectDivisionsValues = (e) => {
    console.log("e" + e);

    this.setState({ selectedDivisions: e })
  }

  onSelectRoundValues = (e) => {
    console.log("e" + e);
    this.setState({ selectedRounds: e })
  }

  publishDraw = () => {
    let payload = {
      isPartial: this.state.publishPartModel.isShowPart,
      divisions: [],
      rounds: []
    }
    if (this.state.publishPartModel.isShowPart == true) {
      payload.divisions = this.state.selectedDivisions;
      payload.rounds = this.state.selectedRounds
    }
    this.props.publishDraws(this.state.firstTimeCompId, '', payload);
    this.setState({ visible: false, changeStatus: true })
  }

  ////// Publish draws
  // publishDraws() {
  //   this.props.saveDraws(this.state.yearRefId, this.state.firstTimeCompId, 1);
  // }

  ////////form content view
  contentView = () => {
    let disabledStatus = this.state.competitionStatus == 1 ? true : false

    let roundTime = '';
    if (this.state.roundTime) {
      if (this.state.roundTime.length > 0) {
        roundTime = moment(this.state.roundTime).format('ddd DD/MM');
      }
    }
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
                    alignItems: 'center',
                  }}
                >
                  <span className="year-select-heading">
                    {AppConstants.venue}:
                  </span>
                  <Select
                    disabled={disabledStatus}
                    id={AppUniqueId.drawsVenueList_dpdn}
                    className="year-select"
                    placeholder="Select"
                    style={{
                      minWidth: 120,
                      maxWidth: 270,
                      whiteSpace: 'nowrap',
                    }}
                    onChange={(venueId) => this.onVenueChange(venueId)}
                    value={JSON.parse(JSON.stringify(this.state.venueId))}
                  >
                    {this.props.drawsState.competitionVenues.length > 0 &&
                      this.props.drawsState.competitionVenues.map((item) => {
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
                    alignItems: 'center',
                  }}
                >
                  <span className="year-select-heading">
                    {AppConstants.round}:
                  </span>
                  <Select
                    id={AppUniqueId.draw_rounds_dpdn}
                    disabled={disabledStatus}
                    className="year-select"
                    style={{ minWidth: 100, maxWidth: 130 }}
                    onChange={(roundId) => this.onRoundsChange(roundId)}
                    value={this.state.roundId}
                  >
                    {this.props.drawsState.getDrawsRoundsData.length > 0 &&
                      this.props.drawsState.getDrawsRoundsData.map((item) => {
                        return (
                          <Option key={item.roundId} value={item.roundId}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>
                  {roundTime !== '' && (
                    <span className="year-select-heading pb-1">
                      {'Starting'} {'  '}
                      {roundTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-2 comp-draw-edit-btn-view">
            <NavLink to="/competitionDrawEdit">
              <Button id={AppUniqueId.editDraw_Btn} className="live-score-edit" type="primary">
                {AppConstants.edit}
              </Button>
            </NavLink>
          </div>
        </div>
        {/* {this.draggableView()} */}
        <div>
          {this.props.drawsState.spinLoad && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                height: 100,
                alignItems: 'center',
              }}
            >
              <Spin size='default' spinning={this.props.drawsState.spinLoad} />
            </div>
          )}
          {this.props.drawsState.updateLoad ? (
            <div className="draggable-wrap draw-data-table">
              <Loader visible={this.props.drawsState.updateLoad} />
              {this.props.drawsState.getRoundsDrawsdata.length > 0 &&
                this.props.drawsState.getRoundsDrawsdata.map(
                  (dateItem, dateIndex) => {
                    return (
                      <div key={"drawData" + dateIndex}>
                        <div className="draws-round-view">
                          <span className="draws-round">
                            {dateItem.roundName}
                          </span>
                        </div>
                        {this.draggableView(dateItem)}
                        <div style={{ display: 'table' }}>
                          <LegendComponent
                            legendArray={dateItem.legendsArray}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          ) : (
              <div className="draggable-wrap draw-data-table">
                {this.props.drawsState.getRoundsDrawsdata.length > 0 &&
                  this.props.drawsState.getRoundsDrawsdata.map(
                    (dateItem, dateIndex) => {
                      return (
                        <div key={"drawData" + dateIndex}>
                          <div className="draws-round-view">
                            <span className="draws-round">
                              {dateItem.roundName}
                            </span>
                          </div>
                          {this.draggableView(dateItem)}
                          <div style={{ display: 'table' }}>
                            <LegendComponent
                              disabled={disabledStatus}
                              legendArray={dateItem.legendsArray}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            )}
        </div>
      </div>
    );
  };

  checkColor(slot) {
    if (slot.competitionDivisionGradeId == this.state.competitionDivisionGradeId || this.state.competitionDivisionGradeId == 0) {
      if (this.state.organisation_Id == slot.awayTeamOrganisationId || this.state.organisation_Id == slot.homeTeamOrganisationId || this.state.organisation_Id == "-1") {
        return slot.colorCode
      }
      else {
        return "#999999"
      }
    }
    else {
      return "#999999"
    }
  }

  checkSwap(slot) {
    let disabledStatus = this.state.competitionStatus == 1 ? true : false
    if (slot.competitionDivisionGradeId == this.state.competitionDivisionGradeId || this.state.competitionDivisionGradeId == 0) {
      if (this.state.organisation_Id == slot.awayTeamOrganisationId || this.state.organisation_Id == slot.homeTeamOrganisationId || this.state.organisation_Id == "-1") {
        if (!disabledStatus) {
          return true
        }
        else {
          return false
        }
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  }

  //////the gragable content view inside the container
  draggableView = (dateItem) => {
    let disabledStatus = this.state.competitionStatus == 1 ? true : false
    var dateMargin = 25;
    var dayMargin = 25;
    let topMargin = 0;
    let legendsData = isArrayNotEmpty(this.props.drawsState.legendsArray)
      ? this.props.drawsState.legendsArray
      : [];
    return (
      <div>
        <div id={AppUniqueId.main_draws_round_tableview} className="scroll-bar pb-4">
          <div className="table-head-wrap">
            {/* Day name list */}
            <div className="tablehead-row">
              <div className="sr-no empty-bx"></div>

              {dateItem.dateNewArray.length > 0 &&
                dateItem.dateNewArray.map((item, index) => {
                  if (index !== 0) {
                    dateMargin += 110;
                  }
                  if (index == 0) {
                    dateMargin = 70;
                  }
                  return (
                    <span key={"day" + index} style={{ left: dateMargin }}>
                      {item.notInDraw == false ? getDayName(item.date) : ''}
                    </span>
                  );
                })}
            </div>
            {/* Times list */}
            <div className="tablehead-row">
              <div className="sr-no empty-bx"></div>

              {dateItem.dateNewArray.length > 0 &&
                dateItem.dateNewArray.map((item, index) => {
                  if (index !== 0) {
                    dayMargin += 110;
                  }
                  if (index == 0) {
                    dayMargin = 70;
                  }
                  return (
                    <span key={"time" + index}
                      style={{
                        left: dayMargin,
                        fontSize: item.notInDraw !== false && 11,
                      }}
                    >
                      {item.notInDraw == false
                        ? getTime(item.date)
                        : 'Not in draw'}
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
              <div key={"court" + index}>
                <div className="sr-no" style={{ height: 62 }}>
                  <div className="venueCourt-tex-div">
                    <span className="venueCourt-text">
                      {courtData.venueShortName +
                        '-' +
                        courtData.venueCourtNumber}
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
                    <div key={"slot" + slotIndex}>
                      <span
                        style={{ left: leftMargin, top: topMargin }}
                        className={'border'}
                      ></span>
                      <div
                        className={'box purple-bg'}
                        style={{
                          backgroundColor:
                            this.checkColor(slotObject),
                          left: leftMargin,
                          top: topMargin,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          cursor: disabledStatus && "no-drop"
                        }}
                      >
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
                            this.checkSwap(slotObject)
                          }
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
                      </div>
                      {
                        slotObject.drawsId !== null && (
                          <div
                            className="box-exception"
                            style={{
                              left: leftMargin,
                              top: topMargin + 50,
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Menu

                              className="action-triple-dot-draws"
                              theme="light"
                              mode="horizontal"
                              style={{ lineHeight: '15px', cursor: disabledStatus && "no-drop" }}
                            >
                              <SubMenu
                                disabled={disabledStatus}
                                key="sub1"
                                title={
                                  slotObject.isLocked == 1 ? (
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: 80,
                                        maxWidth: 80,
                                      }}
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
                                      this.unlockDraws(
                                        slotObject.drawsId,
                                        dateItem.roundId,
                                        courtData.venueCourtId
                                      )
                                    }
                                  >
                                    <div style={{ display: 'flex' }}>
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
                                        yearRefId: this.state.yearRefId,
                                        competitionId: this.state.firstTimeCompId,
                                        organisationId: this.state.organisationId,
                                      },
                                    }}
                                  >
                                    <span>Exception</span>
                                  </NavLink>
                                </Menu.Item>
                              </SubMenu>
                            </Menu>
                          </div>
                        )
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
    let publishStatus = this.props.drawsState.publishStatus;
    let isTeamNotInDraws = this.props.drawsState.isTeamInDraw;
    let activeDrawsRoundsData = this.props.drawsState.activeDrawsRoundsData;
    let isPublish = this.state.competitionStatus == 1 ? true : false;
    let teamNames = this.props.drawsState.teamNames;
    return (
      <div className="fluid-width paddingBottom56px">
        <div className="row">
          <div className="col-sm-3">
            <div className="reg-add-save-button"></div>
          </div>
          <div className="col-sm">
            <div className="comp-buttons-view">
              {/* <NavLink to="/competitionFormat"> */}
              <Button
                id={AppUniqueId.regenrate_Btn}
                className="open-reg-button"
                type="primary"
                disabled={isPublish}
                onClick={() => this.reGenerateDraw()}
              >
                {AppConstants.regenerateDraw}
              </Button>
              <div>
                <Loader
                  visible={this.props.competitionModuleState.drawGenerateLoad}
                />
              </div>
              {/* </NavLink> */}
            </div>
          </div>
          <div>
            <div className="comp-buttons-view">
              <Tooltip
                style={{ height: '100%' }}
                onMouseEnter={() =>
                  this.setState({
                    tooltipVisibleDelete: isPublish ? true : false,
                  })
                }
                onMouseLeave={() =>
                  this.setState({ tooltipVisibleDelete: false })
                }
                visible={this.state.tooltipVisibleDelete}
                title={AppConstants.statusPublishHover}
              >
                <Button
                  id={AppUniqueId.draw_Publish_btn}
                  className="open-reg-button"
                  type="primary"
                  htmlType="submit"
                  style={{ height: (isPublish || publishStatus == 1) && "100%", borderRadius: (isPublish || publishStatus == 1) && 6 }}
                  onClick={() =>
                    isTeamNotInDraws == 1
                      ? this.openModel(this.props)
                      : this.check()
                  }
                  disabled={this.state.competitionStatus == 1 ? true : publishStatus == 1 ? true : false}
                >
                  {AppConstants.publish}
                </Button>
              </Tooltip>
            </div>
          </div>
          {/* </div> */}
        </div>
        <DrawsPublishModel
          publishVisible={this.state.visible}
          divisionGradeNameList={this.props.drawsState.divisionGradeNameList}
          getDrawsRoundsData={this.props.drawsState.getDrawsRoundsData}
          modelCheckDivision={e => this.checkDivision(e)}
          modelCheckRound={e => this.checkRound(e)}
          modelCancel={this.handleCancel}
          modelRadio={this.onChangeRadio}
          modalPublish={(e) => this.publishDraw()}
          modalDivisions={(e) => this.onSelectDivisionsValues(e)}
          modalRounds={(e) => this.onSelectRoundValues(e)}
          modalRadioValue={this.state.value}
          modalIsShowPart={this.state.publishPartModel.isShowPart}
          modalIsShowDivision={this.state.publishPartModel.publishPart.isShowDivision}
          modalIsShowRound={this.state.publishPartModel.publishPart.isShowRound}
        ></DrawsPublishModel>

        <Modal
          title="Regenerate Draw"
          visible={this.state.drawGenerateModalVisible}
          onOk={() => this.handleGenerateDrawModal("ok")}
          onCancel={() => this.handleGenerateDrawModal("cancel")}>
          <Select
            className="year-select reg-filter-select-competition ml-2"
            onChange={(e) => this.setState({ generateRoundId: e })}
            placeholder={'Round'}>
            {(activeDrawsRoundsData || []).map((d, dIndex) => (
              <Option key={d.roundId}
                value={d.roundId} >{d.name}</Option>
            ))
            }

          </Select>
        </Modal>
        <Modal
          title="Team Names"
          visible={this.state.publishModalVisible}
          onOk={() => this.handlePublishModal("ok")}
          onCancel={() => this.handlePublishModal("cancel")}>
          <div>
            <div>{AppConstants.publishModalInfo}</div>
            <div>{teamNames}</div>
            <div>{AppConstants.publishModalConfirmationMsg}</div>
          </div>
        </Modal>
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
      unlockDrawsAction,
      getActiveRoundsAction
    },
    dispatch
  );
}

function mapStatetoProps(state) {
  return {
    appState: state.AppState,
    drawsState: state.CompetitionDrawsState,
    competitionModuleState: state.CompetitionModuleState,
  };
}
export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Form.create()(CompetitionDraws));
