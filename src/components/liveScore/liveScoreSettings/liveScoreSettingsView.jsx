import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import Tooltip from 'react-png-tooltip';
import { get } from 'lodash';
import {
  Layout,
  Breadcrumb,
  Select,
  Checkbox,
  Button,
  Radio,
  InputNumber,
  Form,
  message,
  Modal,
} from 'antd';
import { NavLink } from 'react-router-dom';

import InputWithHead from 'customComponents/InputWithHead';
import InnerHorizontalMenu from 'pages/innerHorizontalMenu';
import DashboardLayout from 'pages/dashboardLayout';
import AppConstants from 'themes/appConstants';
import ValidationConstants from 'themes/validationConstant';
import AppImages from 'themes/appImages';
import {
  getLiveScoreSettingInitiate,
  onChangeSettingForm,
  settingDataPostInitiate,
  clearLiveScoreSetting,
  searchVenueList,
  clearFilter,
  settingRegInvitees,
} from 'store/actions/LiveScoreAction/LiveScoreSettingAction';
import Loader from 'customComponents/loader';
import { getLiveScoreCompetiton, getOrganisationData } from 'util/sessionStorage';
import { getCompetitionVenuesList } from 'store/actions/LiveScoreAction/liveScoreMatchAction';
import ImageLoader from 'customComponents/ImageLoader';
import history from 'util/history';
import { captializedString, isImageFormatValid, isImageSizeValid } from 'util/helpers';
import { onInviteesSearchAction } from 'store/actions/registrationAction/competitionFeeAction';
import { umpireCompetitionListAction } from 'store/actions/umpireAction/umpireCompetetionAction';
import { getOnlyYearListAction } from 'store/actions/appAction';

import { initializeCompData } from 'store/actions/LiveScoreAction/liveScoreInnerHorizontalAction';
import { getCurrentYear } from 'util/permissions';
import {
  isTimeoutsEnabled,
  getTimeoutsData,
} from 'components/liveScore/liveScoreSettings/liveScoreSettingsUtils';
import LiveScoreSettingsTimeoutsFields from 'components/liveScore/liveScoreSettings/liveScoreSettingsTimeoutsFileds';
import LiveScoreSettingsInvitees from 'components/liveScore/liveScoreSettings/components/liveScoreSettingsInvitees';
import ExtraTimeFields from 'components/liveScore/liveScoreSettings/components/extraTimeFields';
import ScoringAssignmentsFields from 'components/liveScore/liveScoreSettings/components/scoringAssignmentsFields';
import {
  applyTo1,
  applyTo2,
  buzzerCheckboxes,
  mediumSelectStyles,
  trackFullPeriod,
} from 'components/liveScore/liveScoreSettings/constants/liveScoreSettingsConstants';
import FoulsFields from 'components/liveScore/liveScoreSettings/components/foulsFields';
import SinBinLengthOfTime from './components/sinBinLengthTime';
const { Header, Footer } = Layout;
const { Option } = Select;
const { confirm } = Modal;

class LiveScoreSettingsView extends Component {
  constructor(props) {
    super(props);
    const { location } = props;

    this.state = {
      profileImage: AppImages.circleImage,
      image: null,
      venueData: [],
      reportSelection: 'Period',
      recordSelection: 'Own',
      competitionFormat: null,
      timeOut: null,
      isEdit: get(location, 'state', null),
      selectedComp: get(location, 'state.selectedComp', null),
      screenName: get(location, 'state.screenName', null),
      edit: get(location, 'state.edit', null),
      competitionId: null,
      yearId: 1,
      yearLoading: false,
      organisationTypeRefId: 0,
      regInvitees: false,
      trackFullPeriod: 0,
      onOkClick: true,
    };
    this.formRef = createRef();
  }

  componentDidMount() {
    const {
      location,
      appState,
      getOnlyYearListAction,
      umpireCompetitionListAction,
      settingRegInvitees,
      clearLiveScoreSetting,
      getLiveScoreSettingInitiate,
      getCompetitionVenuesList,
    } = this.props;
    const { screenName, selectedComp, edit } = this.state;
    const orgData = getOrganisationData();
    const { organisationId } = orgData;

    localStorage.setItem('regInvitees', 'true');
    this.setState({
      organisationTypeRefId: orgData.organisationTypeRefId,
      yearLoading: true,
    });
    getOnlyYearListAction(appState.yearList);
    umpireCompetitionListAction(null, null, organisationId);
    settingRegInvitees();
    this.onInviteeSearch('', 3);
    this.onInviteeSearch('', 4);

    if (screenName === 'umpireDashboard') {
      if (selectedComp !== null) {
        if (edit === 'edit' || selectedComp) {
          getLiveScoreSettingInitiate(selectedComp);
        } else {
          clearLiveScoreSetting();
        }
        getCompetitionVenuesList();
      }
    } else {
      const compId = getLiveScoreCompetiton();

      if (compId) {
        const { id } = JSON.parse(compId);

        if (location.state === 'edit' || id) {
          getLiveScoreSettingInitiate(id);
          getCompetitionVenuesList();
          this.setState({ competitionId: id });
        } else {
          clearLiveScoreSetting();
          getCompetitionVenuesList();
        }
      }
    }

    if (location.state === 'add') {
      clearLiveScoreSetting();
      getCompetitionVenuesList();

      this.formRef.current.setFieldsValue({
        recordUmpire: undefined,
      });
    }
  }

  componentDidUpdate(nextProps) {
    const { liveScoreSetting, appState, onChangeSettingForm } = this.props;
    const { yearLoading } = this.state;

    if (nextProps.liveScoreSetting !== liveScoreSetting) {
      const { gameTimeTrackingType } = liveScoreSetting.form;

      this.updateFormStateByProps();
      this.setState({
        trackFullPeriod: gameTimeTrackingType,
      });
    }

    if (nextProps.appState !== appState) {
      if (appState.onLoad === false && yearLoading === true) {
        const yearId = appState.yearList.length > 0 ? getCurrentYear(appState.yearList) : null;
        if (appState.yearList.length > 0) {
          onChangeSettingForm({
            key: 'yearRefId',
            data: yearId,
          });
          this.setState({ yearLoading: false });
        }
      }
    }
  }

  updateFormStateByProps = () => {
    const { liveScoreSetting } = this.props;
    const { recordUmpire, form } = liveScoreSetting;

    const {
      competitionName,
      shortName,
      scoring,
      timerType,
      venue,
      attendanceRecordingPeriod,
      attendanceRecordingType,
      whoScoring,
      acceptScoring,
      extraTime,
      extraTimeFor,
      extraTimeType,
      extraTimeDuration,
      extraTimeMainBreak,
      extraTimeQuarterBreak,
      foulsSettings,
    } = form;

    this.formRef.current.setFieldsValue({
      competition_name: competitionName,
      short_name: shortName,
      time: timerType,
      venue,
      scoring,
      recordUmpire,
      attendanceReport: attendanceRecordingPeriod,
      attendanceRecord: attendanceRecordingType,
      whoScoring,
      acceptScoring,
      extraTime,
      extraTimeFor,
      extraTimeType,
      extraTimeDuration,
      extraTimeMainBreak,
      extraTimeQuarterBreak,
      foulsSettings,
    });
  };

  setImage = data => {
    if (data.files[0] !== undefined) {
      const file = data.files[0];
      const extension = file.name.split('.').pop().toLowerCase();
      const imageSizeValid = isImageSizeValid(file.size);
      const isSuccess = isImageFormatValid(extension);
      if (!isSuccess) {
        message.error(AppConstants.logo_Image_Format);
        return;
      }
      if (!imageSizeValid) {
        message.error(AppConstants.logo_Image_Size);
        return;
      }
      this.setState({
        image: data.files[0],
        profileImage: URL.createObjectURL(data.files[0]),
        timeout: 2000,
      });
      setTimeout(() => {
        this.setState({ timeout: null });
      }, 2000);
      const imgData = URL.createObjectURL(data.files[0]);
      this.props.onChangeSettingForm({
        key: 'competitionLogo',
        data: data.files[0],
      });
      this.props.onChangeSettingForm({ key: 'Logo', data: imgData });
    }
  };

  selectImage = () => {
    const fileInput = document.getElementById('user-pic');
    if (!fileInput) return;

    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'image/*');
    fileInput.click();
  };

  getRecordingTime(days = 0, hours = 0, minutes = 0) {
    const dayToMinutes = days * 24 * 60;
    const hoursToMinutes = hours * 60;
    const totalMinutes = dayToMinutes + hoursToMinutes + +minutes;

    return totalMinutes;
  }

  handleInputChange = e => {
    this.props.onChangeSettingForm({
      key: e.target.name,
      data: e.target.value,
    });
  };

  handleCheckBoxChange = (fieldKey, value) => {
    this.handleInputChange({
      target: {
        name: fieldKey,
        value,
      },
    });
  };

  handleSubmit = () => {
    const {
      id,
      competitionName,
      shortName,
      competitionLogo,
      scoring,
      record1,
      record2,
      attendanceRecordingType,
      attendanceRecordingPeriod,
      timerType,
      venue,
      days,
      hours,
      minutes,
      lineupSelectionDays,
      lineupSelectionHours,
      lineupSelectionMins,
      timeouts,
      timeoutsToHalves,
      timeoutsToQuarters,
      whoScoring,
      acceptScoring,
      additionalTime,
      extraTime,
      extraTimeFor,
      extraTimeType,
      extraTimeDuration,
      extraTimeMainBreak,
      extraTimeQuarterBreak,
      foulsSettings,
    } = this.props.liveScoreSetting.form;

    const {
      data,
      buzzerEnabled,
      warningBuzzerEnabled,
      recordUmpire,
      invitedTo,
      lineupSelection,
      borrowedPlayer,
      gamesBorrowedThreshold,
      linkedCompetitionId,
      yearRefId,
      invitedAnyAssoc,
      invitedAnyClub,
      associationChecked,
      clubChecked,
      associationLeague,
      clubSchool,
      radioSelectionArr,
      invitedAnyAssocArr,
      invitedAnyClubArr,
    } = this.props.liveScoreSetting;

    let invitedToValue = null;
    let assocValue = null;
    let clubValue = null;
    let selectionValue = null;

    if (JSON.stringify(radioSelectionArr) === JSON.stringify(invitedTo)) {
      invitedToValue = false;
    } else {
      invitedToValue = true;
    }

    if (invitedAnyAssoc.length > 0) {
      if (JSON.stringify(invitedAnyAssocArr) === JSON.stringify(invitedAnyAssoc)) {
        assocValue = false;
      } else {
        assocValue = true;
      }
    }

    if (invitedAnyClub.length > 0) {
      if (JSON.stringify(invitedAnyClubArr) === JSON.stringify(invitedAnyClub)) {
        clubValue = false;
      } else {
        clubValue = true;
      }
    }

    selectionValue = invitedToValue || assocValue || clubValue || '';
    localStorage.setItem('yearId', yearRefId);

    const timeoutsData = getTimeoutsData({
      timeouts,
      timeoutsToHalves,
      timeoutsToQuarters,
    });
    const gameTimeTracking = record1.includes('gameTimeTracking');
    const positionTracking = record1.includes('positionTracking');
    const recordGoalAttempts = record1.includes('recordGoalAttempts');
    const centrePassEnabled = record2.includes('centrePassEnabled');
    const incidentsEnabled = record2.includes('incidentsEnabled');
    const gameTimeTrackingType = record1.includes('gameTimeTracking') && this.state.trackFullPeriod;
    const attendenceRecordingTime = this.getRecordingTime(days, hours, minutes);
    let lineUpSelectionTime = null;
    if (lineupSelection) {
      lineUpSelectionTime = this.getRecordingTime(
        lineupSelectionDays,
        lineupSelectionHours,
        lineupSelectionMins,
      );
    }

    let orgId = null;
    if (this.props.location.state === 'add') {
      const { organisationId } = getOrganisationData() || {};
      orgId = organisationId;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('longName', captializedString(competitionName));
    formData.append('name', captializedString(shortName));
    formData.append('logo', competitionLogo);
    formData.append('recordUmpireType', recordUmpire);
    formData.append('gameTimeTracking', gameTimeTracking);
    formData.append('positionTracking', positionTracking);
    formData.append('recordGoalAttempts', recordGoalAttempts);
    formData.append('centrePassEnabled', centrePassEnabled);
    formData.append('incidentsEnabled', incidentsEnabled);
    formData.append('attendanceRecordingType', attendanceRecordingType);
    formData.append('attendanceRecordingPeriod', attendanceRecordingPeriod);
    formData.append('scoringType', scoring);
    formData.append('timerType', timerType);
    formData.append('organisationId', orgId || data.organisationId);
    formData.append('buzzerEnabled', buzzerEnabled);
    formData.append('warningBuzzerEnabled', warningBuzzerEnabled);
    formData.append('playerBorrowingType', borrowedPlayer);
    formData.append('gamesBorrowedThreshold', gamesBorrowedThreshold);
    formData.append('linkedCompetitionId', linkedCompetitionId);
    formData.append('yearRefId', yearRefId);
    formData.append('isInvitorsChanged', selectionValue.toString());
    formData.append('timeoutDetails', JSON.stringify(timeoutsData));
    formData.append('whoScoring', whoScoring);
    formData.append('acceptScoring', acceptScoring);
    formData.append('extraTime', extraTime);
    formData.append('additionalTime', additionalTime);
    formData.append('extraTimeFor', extraTimeFor);
    formData.append('extraTimeType', extraTimeType);
    formData.append('extraTimeDuration', extraTimeDuration);
    formData.append('extraTimeMainBreak', extraTimeMainBreak);
    formData.append('extraTimeQuarterBreak', extraTimeQuarterBreak);
    formData.append('foulsSettings', JSON.stringify(foulsSettings));

    if (attendenceRecordingTime) {
      formData.append('attendanceSelectionTime', attendenceRecordingTime);
    }
    if (gameTimeTracking !== false) {
      formData.append('gameTimeTrackingType', gameTimeTrackingType);
    }
    if (lineupSelection) {
      formData.append('lineupSelectionEnabled', lineupSelection);
      formData.append('lineupSelectionTime', lineUpSelectionTime);
    }

    const invitedToArr = invitedTo.slice(0);
    formData.append('invitedTo', JSON.stringify(invitedToArr));
    if (invitedAnyAssoc.length > 0) {
      formData.append('invitedAnyAssoc', JSON.stringify(invitedAnyAssoc));
    }
    if (invitedAnyClub.length > 0) {
      formData.append('invitedAnyClub', JSON.stringify(invitedAnyClub));
    }

    if (invitedTo.length === 0) {
      message.config({
        duration: 1.5,
        maxCount: 1,
      });

      message.error(ValidationConstants.pleaseSelectRegInvitees, 1.5);
      localStorage.setItem('regInvitees', 'false');
    } else if (associationChecked === true || clubChecked === true) {
      if (associationChecked === true && clubChecked === true) {
        if (associationLeague.length === 0 || clubSchool.length === 0) {
          message.config({
            duration: 1.5,
            maxCount: 1,
          });
          message.error(ValidationConstants.pleaseSelectOrg, 1.5);
          localStorage.setItem('regInvitees', 'false');
        } else {
          localStorage.setItem('regInvitees', 'true');
        }
      } else if (associationChecked === true) {
        if (associationLeague.length === 0) {
          message.config({
            duration: 1.5,
            maxCount: 1,
          });
          message.error(ValidationConstants.pleaseSelectOrg, 1.5);
          localStorage.setItem('regInvitees', 'false');
        } else {
          localStorage.setItem('regInvitees', 'true');
        }
      } else if (clubChecked === true) {
        if (clubSchool.length === 0) {
          message.config({
            duration: 1.5,
            maxCount: 1,
          });
          message.error(ValidationConstants.pleaseSelectOrg, 1.5);
          localStorage.setItem('regInvitees', 'false');
        } else {
          localStorage.setItem('regInvitees', 'true');
        }
      }
    } else {
      localStorage.setItem('regInvitees', 'true');
    }

    const regInvitees = localStorage.getItem('regInvitees');
    if (regInvitees === 'true') {
      localStorage.setItem('regInvitees', 'false');
      this.props.initializeCompData();
      this.props.settingDataPostInitiate({
        body: formData,
        venue,
        settingView: this.props.location.state,
        screenName: this.state.screenName ? this.state.screenName : 'liveScore',
        competitionId: this.state.competitionId,
        isEdit: this.state.isEdit,
      });
    }
  };

  headerView = () => (
    <div className="header-view">
      <Header className="form-header-view d-flex bg-transparent align-items-center">
        <Breadcrumb separator=" > ">
          <Breadcrumb.Item className="breadcrumb-add">{AppConstants.settings}</Breadcrumb.Item>
        </Breadcrumb>
      </Header>
    </div>
  );

  handleSearch = (value, data) => {
    const filteredData = data.filter(
      memo => memo.venueName.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );
    this.props.searchVenueList(filteredData);
  };

  // On selection of venue
  onSelectValues(value) {
    this.props.onChangeSettingForm({ key: 'venue', data: value });
    this.props.clearFilter();
  }

  onChangeLineUpSelection(data, checkPositionTrackingEnabled) {
    let posTracking = false;

    for (const i in checkPositionTrackingEnabled) {
      if (checkPositionTrackingEnabled[i] === 'positionTracking') {
        posTracking = true;
        break;
      }
    }

    if (posTracking) {
      this.props.onChangeSettingForm({ key: 'lineupSelection', data });
    } else {
      message.config({
        duration: 1.5,
        maxCount: 1,
      });
      message.warn(AppConstants.lineUpSelectionMsg);
    }
  }

  differentPositionTracking = (options, selectedOption) => {
    if (options.value === 'gameTimeTracking' && selectedOption.includes('gameTimeTracking')) {
      return (
        <div className="pt-4">
          <Select
            style={mediumSelectStyles}
            onChange={val => this.setState({ trackFullPeriod: val })}
            value={this.state.trackFullPeriod}
            placeholder={AppConstants.selectCompetition}
          >
            {trackFullPeriod.map(item => (
              <Option key={`trackFullPeriod_${item.value}`} value={item.value}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
      );
    }
  };

  timeoutsView = () => {
    if (!isTimeoutsEnabled) return null;
    const { timeouts } = this.props.liveScoreSetting.form;
    const isTimeoutsChecked = !!timeouts || timeouts === false;

    const handleTimeoutsChange = () => {
      this.props.onChangeSettingForm({
        key: 'timeouts',
        data: isTimeoutsChecked ? null : false,
      });
    };

    return (
      <>
        <InputWithHead
          conceptulHelp
          conceptulHelpMsg={AppConstants.timeouts}
          marginTop={0}
          heading={AppConstants.timeouts}
        />
        <div className="row mt-0 ml-1">
          <Checkbox
            className="single-checkbox d-flex justify-content-center"
            onChange={() => handleTimeoutsChange()}
            checked={isTimeoutsChecked}
          >
            {AppConstants.timeouts}
          </Checkbox>
        </div>

        <LiveScoreSettingsTimeoutsFields
          isVisible={isTimeoutsChecked}
          values={this.props.liveScoreSetting.form}
          onFormChange={this.props.onChangeSettingForm}
          onInviteesChange={this.props.onChangeSettingForm}
          openModel={this.openModel}
          formRef={this.formRef.current}
        />
      </>
    );
  };

  contentView = () => {
    const { liveScoreSetting, umpireCompetitionState, appState } = this.props;
    const {
      lineupSelection,
      premierCompLink,
      borrowedPlayer,
      gamesBorrowedThreshold,
      linkedCompetitionId,
      disabled,
      yearRefId,
    } = liveScoreSetting;
    const {
      days,
      hours,
      minutes,
      lineupSelectionDays,
      lineupSelectionHours,
      lineupSelectionMins,
      record1,
      record2,
      venue,
      Logo,
      timerType,
      additionalTime,
      extraTime,
      extraTimeType,
      extraTimeDuration,
      extraTimeMainBreak,
      extraTimeQuarterBreak,
      scoring,
      whoScoring,
      acceptScoring,
      foulsSettings,
    } = liveScoreSetting.form;

    const competition = get(umpireCompetitionState, 'umpireComptitionList', []);

    const hideWholeScoringSection = process.env.REACT_APP_SCORING_ASSIGNMENTS_FIELDS_ENABLED === 0 ? true : false;

    return (
      <div>
        <div className="formView content-view pt-4 mb-5">
          <div className="row">
            <div className="col-sm">
              <InputWithHead
                auto_complete="off"
                required="required-field"
                heading={AppConstants.year}
              />
              <Select
                style={{ width: 100 }}
                className="year-select reg-filter-select-year"
                onChange={yearId => this.onYearClick(yearId)}
                value={yearRefId}
              >
                {appState.yearList.map(item => (
                  <Option key={`year_${item.id}`} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <Form.Item
            name="competition_name"
            rules={[
              {
                required: true,
                message: ValidationConstants.competitionField,
              },
            ]}
          >
            <InputWithHead
              name="competitionName"
              auto_complete="off"
              required="required-field "
              heading={AppConstants.competitionName}
              placeholder={AppConstants.competitionName}
              onChange={this.handleInputChange}
              onBlur={e => {
                this.formRef.current.setFieldsValue({
                  competition_name: captializedString(e.target.value),
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="short_name"
            rules={[
              {
                required: true,
                message: ValidationConstants.shortField,
              },
            ]}
          >
            <InputWithHead
              name="shortName"
              auto_complete="off"
              required="required-field "
              heading={AppConstants.short_Name}
              placeholder={AppConstants.short_Name}
              conceptulHelp
              conceptulHelpMsg={AppConstants.shortNameMsg}
              marginTop={5}
              onChange={this.handleInputChange}
              onBlur={i =>
                this.formRef.current.setFieldsValue({
                  short_name: captializedString(i.target.value),
                })
              }
            />
          </Form.Item>

          {/* image and check box view */}
          <InputWithHead heading={AppConstants.competitionLogo} isOptional />
          <div className="fluid-width">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className="reg-competition-logo-view" onClick={this.selectImage}>
                  <ImageLoader timeout={this.state.timeout} src={Logo || AppImages.circleImage} />
                </div>
                <input
                  type="file"
                  id="user-pic"
                  className="d-none"
                  name="imageFile"
                  onChange={evt => {
                    this.setImage(evt.target);
                  }}
                  onClick={event => {
                    event.target.value = null;
                  }}
                />
              </div>
              <div className="col-sm">
                <span className="image-size-format-text">{AppConstants.imageSizeFormatText}</span>
              </div>
              <div className="col-sm-12 d-flex align-items-center">
                <Checkbox className="single-checkbox" defaultChecked>
                  {AppConstants.useDefault}
                </Checkbox>
              </div>
            </div>
          </div>

          {/* venue multi selection */}
          <InputWithHead required="required-field " heading={AppConstants.venues} />
          <div>
            <Form.Item
              name="venue"
              rules={[
                {
                  required: true,
                  message: ValidationConstants.venueField,
                },
              ]}
            >
              <>
                <Select
                  mode="multiple"
                  placeholder={AppConstants.selectVenue}
                  className="w-100"
                  onChange={value => {
                    this.onSelectValues(value);
                  }}
                  filterOption={false}
                  onSearch={value => {
                    this.handleSearch(value, this.props.liveScoreSetting.mainVenueList);
                  }}
                  value={venue}
                >
                  {this.props.liveScoreSetting.venueData &&
                    this.props.liveScoreSetting.venueData.map(item => (
                      <Option key={`venue_${item.venueId}`} value={item.venueId}>
                        {item.venueName}
                      </Option>
                    ))}
                </Select>
              </>
            </Form.Item>
          </div>
        </div>

        <div className="formView content-view pt-4 mb-5">
          {/* match settings check boxes */}
          <span
            className="text-heading-large pt-5"
            style={{
              marginBottom: this.state.isEdit === 'add' ? 10 : 0,
            }}
          >
            {AppConstants.wouldLikeRecord}
          </span>
          {this.state.isEdit !== 'add' && (
            <NavLink
              to={{
                pathname: '/matchDayDivisionList',
              }}
            >
              <span className="input-heading-add-another pt-3 pb-3">
                +{AppConstants.divisionSettings}
              </span>
            </NavLink>
          )}
          <div className="fluid-width" style={{ marginTop: -10 }}>
            <div className="row">
              <div className="col-sm-12">
                <Checkbox.Group
                  className="d-flex flex-column justify-content-center"
                  value={record1}
                  onChange={val => this.handleCheckBoxChange('record1', val)}
                >
                  {applyTo1.map(item => (
                    <div key={item.value}>
                      <Checkbox
                        className="single-checkbox-radio-style pt-4 ml-0"
                        value={item.value}
                      >
                        {item.label}
                      </Checkbox>
                      {this.differentPositionTracking(item, record1)}
                    </div>
                  ))}
                </Checkbox.Group>
              </div>
              <div className="col-sm-12">
                <Checkbox.Group
                  className="checkBoxGroup-checkbox-radio-style d-flex flex-column justify-content-center"
                  options={applyTo2}
                  value={record2}
                  onChange={val => this.handleCheckBoxChange('record2', val)}
                >
                  {applyTo2.map(item => {
                    if (item.helpMsg) {
                      return (
                        <div key={item.value}>
                          <Tooltip>{item.helpMsg}</Tooltip>
                        </div>
                      );
                    }
                  })}
                </Checkbox.Group>
              </div>
            </div>
          </div>

          {/* Record Umpire dropdown view */}
          <InputWithHead
            required="required-field"
            conceptulHelp
            conceptulHelpMsg={AppConstants.recordUmpireMsg}
            marginTop={5}
            heading={AppConstants.recordUmpire}
          />
          <div className="row">
            <div className="col-sm">
              <Form.Item
                name="recordUmpire"
                rules={[
                  {
                    required: true,
                    message: ValidationConstants.recordUmpireField,
                  },
                ]}
              >
                <Select
                  placeholder="Select Record Umpire"
                  style={mediumSelectStyles}
                  onChange={val => this.handleCheckBoxChange('recordUmpire', val)}
                >
                  <Option value="NONE">None</Option>
                  <Option value="USERS">Integrated</Option>
                  <Option value="NAMES">At courts</Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="formView content-view pt-4 mb-5">
          {/* dropdown view */}
          <span className="text-heading-large pt-5">{AppConstants.attendance_record_report}</span>

          <div className="row">
            <div className="col-sm">
              <InputWithHead
                conceptulHelp
                conceptulHelpMsg={AppConstants.recordMsg}
                heading={AppConstants.record}
              />
              <Form.Item
                name="attendanceRecord"
                rules={[
                  {
                    required: true,
                    message: ValidationConstants.attendanceRecordField,
                  },
                ]}
              >
                <Select
                  placeholder="Select Record"
                  className="w-100"
                  style={{ paddingRight: 1, minWidth: 182 }}
                  onChange={recordSelection =>
                    this.props.onChangeSettingForm({
                      key: 'attendanceRecordingType',
                      data: recordSelection,
                    })
                  }
                >
                  <Option value="OWN">Own</Option>
                  <Option value="BOTH">Both</Option>
                  <Option value="OPPOSITION">Opposition</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-sm">
              <InputWithHead
                conceptulHelp
                conceptulHelpMsg={AppConstants.reportMsg}
                heading={AppConstants.report}
              />
              <Form.Item
                name="attendanceReport"
                rules={[
                  {
                    required: true,
                    message: ValidationConstants.attendanceReportField,
                  },
                ]}
              >
                <Select
                  placeholder="Select Report"
                  className="w-100"
                  style={{ paddingRight: 1, minWidth: 182 }}
                  onChange={reportSelection =>
                    this.props.onChangeSettingForm({
                      key: 'attendanceRecordingPeriod',
                      data: reportSelection,
                    })
                  }
                  value={this.props.liveScoreSetting.form.attendanceRecordingPeriod}
                  disabled={disabled}
                >
                  <Option value="PERIOD">Period</Option>
                  <Option value="MINUTE">Minute</Option>
                  <Option value="MATCH">Games</Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Attendance Recording Time */}
          <InputWithHead isOptional heading={AppConstants.attendanceRecordingTime} />
          <div className="inside-container-view mt-0">
            <div className="row">
              <div className="col-sm">
                <InputWithHead
                  required="pt-0"
                  heading={AppConstants._days}
                  placeholder={AppConstants._days}
                  name="days"
                  value={days || ''}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="col-sm">
                <InputWithHead
                  required="pt-0"
                  heading={AppConstants._hours}
                  placeholder={AppConstants._hours}
                  name="hours"
                  value={hours || ''}
                  onChange={this.handleInputChange}
                />
              </div>

              <div className="col-sm">
                <InputWithHead
                  required="pt-0"
                  heading={AppConstants._minutes}
                  placeholder={AppConstants._minutes}
                  name="minutes"
                  value={minutes || ''}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Player borrowing view */}
          <InputWithHead isOptional heading={AppConstants.playerBorrowing} />
          <div className="row mt-0 ml-1">
            <Radio.Group
              className="reg-competition-radio w-100"
              name="borrowedPlayer"
              onChange={this.handleInputChange}
              value={borrowedPlayer}
            >
              <div className="row mt-0">
                <div className="col-sm-12">
                  <Radio
                    style={{
                      marginRight: 0,
                      paddingRight: 0,
                    }}
                    value="GAMES"
                  >
                    {AppConstants.gamesBorrowed}
                  </Radio>

                  {borrowedPlayer === 'GAMES' && (
                    <div className="inside-container-view w-100" style={{ marginTop: 15 }}>
                      <div className="small-steper-style">
                        <InputNumber
                          max={6}
                          min={3}
                          value={gamesBorrowedThreshold}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          onChange={number =>
                            this.props.onChangeSettingForm({
                              key: 'number',
                              data: number,
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-sm-12">
                  <Radio
                    style={{
                      marginRight: 0,
                      paddingRight: 0,
                    }}
                    value="MINUTES"
                  >
                    {AppConstants.minutesBorrowed}
                  </Radio>
                </div>
              </div>
            </Radio.Group>
          </div>

          <div className="row">
            <div className="col-sm-12">
              {/* Line up selection */}
              <Checkbox
                className="single-checkbox pt-2 justify-content-center"
                onChange={e => this.onChangeLineUpSelection(e.target.checked, record1)}
                checked={lineupSelection}
              >
                <span className="checkbox-text">
                  {AppConstants.squadSelection}
                  <i className="input-heading__optional">- optional</i>
                </span>
              </Checkbox>

              {lineupSelection && (
                <div className="inside-container-view pt-0" style={{ marginTop: 15 }}>
                  <div className="row">
                    <div className="col-sm">
                      <InputWithHead
                        heading={AppConstants._days}
                        placeholder={AppConstants._days}
                        name="lineupSelectionDays"
                        value={lineupSelectionDays || ''}
                        onChange={this.handleInputChange}
                        marginTop={0}
                      />
                    </div>
                    <div className="col-sm">
                      <InputWithHead
                        heading={AppConstants._hours}
                        placeholder={AppConstants._hours}
                        name="lineupSelectionHours"
                        value={lineupSelectionHours || ''}
                        onChange={this.handleInputChange}
                      />
                    </div>

                    <div className="col-sm">
                      <InputWithHead
                        heading={AppConstants._minutes}
                        placeholder={AppConstants._minutes}
                        name="lineupSelectionMins"
                        value={lineupSelectionMins || ''}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <Checkbox
                className="single-checkbox justify-content-center"
                onChange={e =>
                  this.props.onChangeSettingForm({
                    key: 'premierCompLink',
                    data: e.target.checked,
                  })
                }
                checked={premierCompLink}
              >
                <span className="checkbox-text">
                  {AppConstants.premierCompLink}
                  <i className="input-heading__optional">- optional</i>
                </span>
              </Checkbox>

              {premierCompLink && (
                <div className="inside-container-view" style={{ marginTop: 15 }}>
                  <Select
                    showSearch
                    className="w-100"
                    onChange={compId =>
                      this.props.onChangeSettingForm({
                        key: 'linkedCompetitionId',
                        data: compId,
                      })
                    }
                    placeholder="Search Competition"
                    value={linkedCompetitionId || undefined}
                    optionFilterProp="children"
                  >
                    {competition.map(item => (
                      <Option key={`competition_${item.id}`} value={item.id}>
                        {item.longName}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        { !hideWholeScoringSection &&
          <div className="formView content-view pt-4 mb-5">
            <span className="text-heading-large pt-5">{AppConstants.scoring}</span>

            <ScoringAssignmentsFields
              onInputChange={this.handleInputChange}
              values={{
                scoring,
                whoScoring,
                acceptScoring,
              }}
            />
          </div>
        }

        <div className="formView content-view pt-4 mb-5">
          {/* timer view */}
          <span className="text-heading-large pt-5">{AppConstants.timer}</span>
          <Form.Item
            name="time"
            rules={[
              {
                required: true,
                message: ValidationConstants.timerField,
              },
            ]}
          >
            <>
              <Select
                placeholder="Select Timer"
                style={mediumSelectStyles}
                onChange={timer =>
                  this.props.onChangeSettingForm({
                    key: 'timerType',
                    data: timer,
                  })
                }
                value={timerType}
              >
                <Option value="CENTRAL">Central</Option>
                <Option value="PER_MATCH">Per Match</Option>
                <Option value="CENTRAL_WITH_MATCH_OVERRIDE">Central with Per Match Override</Option>
              </Select>
              <Tooltip>
                <span>{AppConstants.timerMsg}</span>
              </Tooltip>
            </>
          </Form.Item>

          {/* Buzzer button view */}
          <InputWithHead
            isOptional
            conceptulHelp
            conceptulHelpMsg={AppConstants.buzzerMsg}
            marginTop={0}
            heading={AppConstants.buzzer}
          />
          <div className="row mt-0 ml-1">
            {buzzerCheckboxes.map((checkbox, indx) => {
              const className = indx === 0 ? 'mt-0' : 'ml-0';

              return (
                <Checkbox
                  key={checkbox.key}
                  className={`single-checkbox w-100 ${className}`}
                  onChange={e =>
                    this.props.onChangeSettingForm({
                      key: checkbox.key,
                      data: e.target.checked,
                    })
                  }
                  checked={liveScoreSetting[checkbox.key]}
                >
                  {checkbox.label}
                </Checkbox>
              );
            })}
          </div>

          {this.timeoutsView()}

          <Checkbox
            className={`single-checkbox w-100`}
            onChange={e =>
              this.props.onChangeSettingForm({
                key: 'additionalTime',
                data: e.target.checked,
              })
            }
            checked={additionalTime}
          >
            {AppConstants.allowAddedTime}
          </Checkbox>

          <ExtraTimeFields
            values={{
              extraTime,
              extraTimeType,
              extraTimeDuration,
              extraTimeMainBreak,
              extraTimeQuarterBreak,
            }}
            onInputChange={this.handleInputChange}
          />
        </div>

        {isTimeoutsEnabled && (
          <div className="formView content-view pt-4 mb-5">
            <span className="text-heading-large pt-5">{AppConstants.foul}</span>
            <FoulsFields values={foulsSettings} onChange={this.handleInputChange} />
          </div>
        )}

        <div className="formView content-view pt-4 mb-5">
          <SinBinLengthOfTime values={foulsSettings} onChange={this.handleInputChange} />
        </div>

        <div className="formView content-view pt-4 mb-5">
          <span className="text-heading-large pt-5">{AppConstants.competitionInvitees}</span>
          <LiveScoreSettingsInvitees
            stateEditMode={this.state.isEdit}
            localEditMode={this.state.edit}
            okClick={this.state.onOkClick}
            organisationTypeRefId={this.state.organisationTypeRefId}
            onInviteesChange={this.onInviteesChange}
            onOpenModel={this.openModel}
            onFormChange={this.props.onChangeSettingForm}
            onInviteesSearchAction={this.props.onInviteesSearchAction}
          />
        </div>
      </div>
    );
  };

  /// / On change Invitees
  onInviteesChange(value) {
    this.props.onChangeSettingForm({ key: 'anyOrgSelected', data: value });
    if (value == 7) {
      this.onInviteeSearch('', 3);
    } else if (value == 8) {
      this.onInviteeSearch('', 4);
    }
  }

  onInviteeSearch = (value, inviteesType) => {
    this.props.onInviteesSearchAction(value, inviteesType);
  };

  /// /////reg invitees search view for any organisation
  associationSearchInvitee = () => {
    const detailsData = this.props.competitionFeesState;
    const associationAffiliates = detailsData.associationAffilites;
    const { associationLeague } = this.props.liveScoreSetting;
    const disabledComponent =
      (this.state.isEdit === 'edit' || this.state.edit === 'edit') && this.state.onOkClick;
    return (
      <div className="col-sm ml-3">
        <Select
          mode="multiple"
          className="w-100"
          style={{ paddingRight: 1, minWidth: 182 }}
          onChange={associationAffiliate => {
            this.props.onChangeSettingForm({
              key: 'associationAffilite',
              data: associationAffiliate,
            });
          }}
          value={associationLeague}
          placeholder={AppConstants.selectOrganisation}
          filterOption={false}
          onSearch={value => {
            this.onInviteeSearch(value, 3);
          }}
          showSearch
          onBlur={() => this.onInviteeSearch('', 3)}
          disabled={disabledComponent}
        >
          {associationAffiliates.map(item => (
            <Option key={`organisation_${item.id}`} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </div>
    );
  };

  /// /////reg invitees search view for any organisation
  clubSearchInvitee = () => {
    const detailsData = this.props.competitionFeesState;
    const clubAffiliates = detailsData.clubAffilites;
    const { clubSchool } = this.props.liveScoreSetting;
    const disabledComponent =
      (this.state.isEdit === 'edit' || this.state.edit === 'edit') && this.state.onOkClick;
    return (
      <div className="col-sm ml-3">
        <Select
          mode="multiple"
          className="w-100"
          style={{ paddingRight: 1, minWidth: 182 }}
          onChange={clubAffiliate => {
            this.props.onChangeSettingForm({
              key: 'clubAffilite',
              data: clubAffiliate,
            });
          }}
          value={clubSchool}
          placeholder={AppConstants.selectOrganisation}
          filterOption={false}
          onSearch={value => {
            this.onInviteeSearch(value, 4);
          }}
          onBlur={() => this.onInviteeSearch('', 4)}
          disabled={disabledComponent}
        >
          {clubAffiliates.map(item => (
            <Option key={`organisation_${item.id}`} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </div>
    );
  };

  openModel = () => {
    const this_ = this;
    confirm({
      title: AppConstants.editOrganisationMessage,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      maskClosable: true,
      onOk() {
        this_.setState({ onOkClick: false });
      },
      onCancel() {
        this_.setState({ onOkClick: true });
      },
    });
  };

  /// ///footer view containing all the buttons like submit and cancel
  footerView = () => (
    <div className="fluid-width">
      <div className="footer-view">
        <div className="row">
          <div className="col-sm" />
          <div className="col-sm">
            <div className="comp-buttons-view">
              <Button
                disabled={this.props.liveScoreSetting.loader}
                htmlType="submit"
                className="publish-button"
                type="primary"
              >
                {AppConstants.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  onYearClick(yearRefId) {
    this.setState({ yearRefId });
    this.props.onChangeSettingForm({ key: 'yearRefId', data: yearRefId });
  }

  onFinishFailed = () => {
    message.config({ maxCount: 1, duration: 1.5 });
    message.error(ValidationConstants.plzReviewPage);
  };

  render() {
    const { screenName, isEdit } = this.state;
    const { editLoader, loader } = this.props.liveScoreSetting;
    const isUmpireDashboardScreen = screenName === 'umpireDashboard';
    const localId = isUmpireDashboardScreen ? null : getLiveScoreCompetiton();
    const isEditMode = isEdit === 'edit';
    const isVisibleLoader = isEditMode ? editLoader : loader;

    return (
      <div className="fluid-width default-bg">
        <DashboardLayout
          menuHeading={isUmpireDashboardScreen ? AppConstants.umpires : AppConstants.matchDay}
          menuName={isUmpireDashboardScreen ? AppConstants.umpires : AppConstants.liveScores}
          onMenuHeadingClick={() => history.push('./matchDayCompetitions')}
        />
        {localId && <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="18" />}
        <Loader visible={isVisibleLoader} />

        <Layout>
          {this.headerView()}
          <Form
            ref={this.formRef}
            autoComplete="off"
            onFinish={this.handleSubmit}
            onFinishFailed={this.onFinishFailed}
            noValidate="noValidate"
          >
            {this.contentView()}
            <Footer>{this.footerView()}</Footer>
          </Form>
        </Layout>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    liveScoreSetting: state.LiveScoreSetting,
    venueList: state.LiveScoreMatchState,
    competitionFeesState: state.CompetitionFeesState,
    umpireCompetitionState: state.UmpireCompetitionState,
    appState: state.AppState,
  };
}

export default connect(mapStateToProps, {
  clearLiveScoreSetting,
  getLiveScoreSettingInitiate,
  onChangeSettingForm,
  getCompetitionVenuesList,
  settingDataPostInitiate,
  searchVenueList,
  clearFilter,
  onInviteesSearchAction,
  settingRegInvitees,
  umpireCompetitionListAction,
  getOnlyYearListAction,
  initializeCompData,
})(LiveScoreSettingsView);
