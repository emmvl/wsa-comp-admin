import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import Tooltip from 'react-png-tooltip'
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
} from "antd";
import { NavLink } from "react-router-dom";

import InputWithHead from "customComponents/InputWithHead";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";
import AppConstants from "themes/appConstants";
import ValidationConstants from "themes/validationConstant";
import AppImages from "themes/appImages";
import {
    getLiveScoreSettingInitiate,
    onChangeSettingForm,
    settingDataPostInitiate,
    clearLiveScoreSetting,
    searchVenueList,
    clearFilter,
    settingRegInvitees,
} from 'store/actions/LiveScoreAction/LiveScoreSettingAction'
import Loader from 'customComponents/loader';
import { getLiveScoreCompetiton, getOrganisationData } from 'util/sessionStorage'
import { getCompetitionVenuesList } from 'store/actions/LiveScoreAction/liveScoreMatchAction'
import ImageLoader from 'customComponents/ImageLoader'
import history from "util/history";
import {
    isArrayNotEmpty, captializedString, isImageFormatValid, isImageSizeValid,
} from "util/helpers";
import { onInviteesSearchAction } from "store/actions/registrationAction/competitionFeeAction";
import { umpireCompetitionListAction } from "store/actions/umpireAction/umpireCompetetionAction";
import { getOnlyYearListAction } from "store/actions/appAction";

import { initializeCompData } from 'store/actions/LiveScoreAction/liveScoreInnerHorizontalAction'
import { getCurrentYear } from "util/permissions";
import {
    isTimeoutsEnabled,
    getTimeoutsData,
} from 'components/liveScore/liveScoreSettings/liveScoreSettingsUtils'
import LiveScoreSettingsTimeoutsFields from 'components/liveScore/liveScoreSettings/liveScoreSettingsTimeoutsFileds'

const { Header, Footer } = Layout;
const { Option } = Select;
const { confirm } = Modal;

class LiveScoreSettingsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileImage: AppImages.circleImage,
            image: null,
            venueData: [],
            reportSelection: 'Period',
            recordSelection: 'Own',
            competitionFormat: null,
            timeOut: null,
            isEdit: props.location ? props.location.state ? props.location.state : null : null,
            selectedComp: props.location ? props.location.state ? props.location.state.selectedComp ? props.location.state.selectedComp : null : null : null,
            screenName: props.location ? props.location.state ? props.location.state.screenName ? props.location.state.screenName : null : null : null,
            edit: props.location ? props.location.state ? props.location.state.edit ? props.location.state.edit : null : null : null,
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
        localStorage.setItem("regInvitees", "true")
        const orgData = getOrganisationData() ? getOrganisationData() : null
        this.setState({ organisationTypeRefId: orgData.organisationTypeRefId })
        this.props.getOnlyYearListAction(this.props.appState.yearList)
        this.onInviteeSearch('', 3)
        this.onInviteeSearch('', 4)
        this.setState({ yearLoading: true })
        const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.props.umpireCompetitionListAction(null, null, organisationId)

        if (this.state.screenName === 'umpireDashboard') {
            this.props.settingRegInvitees()
            if (this.state.selectedComp !== null) {
                if (this.state.edit === 'edit' || this.state.selectedComp) {
                    this.props.getLiveScoreSettingInitiate(this.state.selectedComp)
                    this.props.getCompetitionVenuesList()
                } else {
                    this.props.clearLiveScoreSetting()
                    this.props.getCompetitionVenuesList()
                }
            }
        } else {
            const comp_id = getLiveScoreCompetiton()
            this.props.settingRegInvitees()
            if (comp_id) {
                const { id } = JSON.parse(getLiveScoreCompetiton())
                if (this.props.location.state === 'edit' || id) {
                    this.props.getLiveScoreSettingInitiate(id)
                    this.props.getCompetitionVenuesList()
                    this.setState({ competitionId: id })
                } else {
                    this.props.clearLiveScoreSetting()
                    this.props.getCompetitionVenuesList()
                }
            }
        }

        if (this.props.location.state === 'add') {
            this.props.clearLiveScoreSetting()
            this.props.getCompetitionVenuesList()

            this.formRef.current.setFieldsValue({
                recordumpire: undefined,
            })
        }
    }

    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreSetting != this.props.liveScoreSetting) {
            const {
                competitionName,
                shortName,
                scoring,
                gameTimeTrackingType,
            } = this.props.liveScoreSetting.form
            this.formRef.current.setFieldsValue({
                competition_name: competitionName,
                short_name: shortName,
                time: this.props.liveScoreSetting.form.timerType,
                venue: this.props.liveScoreSetting.form.venue,
                scoring,
                recordumpire: this.props.liveScoreSetting.recordUmpire,
                attendanceReport: this.props.liveScoreSetting.form.attendanceRecordingPeriod,
                attendanceRecord: this.props.liveScoreSetting.form.attendanceRecordingType,
            })

            this.setState({
                trackFullPeriod: gameTimeTrackingType,
            })
        }

        if (nextProps.venueList != this.props.venueList) {
        }

        if (nextProps.appState !== this.props.appState) {
            if (this.props.appState.onLoad === false && this.state.yearLoading === true) {
                const yearId = this.props.appState.yearList.length > 0 ? getCurrentYear(this.props.appState.yearList) : null
                if (this.props.appState.yearList.length > 0) {
                    this.props.onChangeSettingForm({ key: "yearRefId", data: yearId })
                    this.setState({ yearLoading: false });
                }
            }
        }
    }

    /// /method to select multiple value
    teamChange = (value) => {
        this.props.onChangeSettingForm({ key: 'venue', data: value })
    }

    competition_format = (e) => {
        this.props.onChangeSettingForm({ key: 'scoring', data: e.target.value })
    };

    setImage = (data) => {
        if (data.files[0] !== undefined) {
            const file = data.files[0]
            const extension = file.name.split('.').pop().toLowerCase();
            const imageSizeValid = isImageSizeValid(file.size)
            const isSuccess = isImageFormatValid(extension);
            if (!isSuccess) {
                message.error(AppConstants.logo_Image_Format);
                return
            }
            if (!imageSizeValid) {
                message.error(AppConstants.logo_Image_Size);
                return
            }
            this.setState({ image: data.files[0], profileImage: URL.createObjectURL(data.files[0]), timeout: 2000 })
            setTimeout(() => {
                this.setState({ timeout: null })
            }, 2000);
            const imgData = URL.createObjectURL(data.files[0])
            this.props.onChangeSettingForm({ key: 'competitionLogo', data: data.files[0] })
            this.props.onChangeSettingForm({ key: 'Logo', data: imgData })
        }
    };

    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (fileInput) {
            fileInput.click();
        }
    }

    // method to check box selection
    onChangeCheckBox(checkedValues) {
        this.props.onChangeSettingForm({ key: 'record1', data: checkedValues })
    }

    onChangeCheckBox2(checkedValues) {
        this.props.onChangeSettingForm({ key: 'record2', data: checkedValues })
    }

    /// /method to change time
    // onChangeTime(time, timeString) {
    // }

    tabCallBack = (key) => {
        this.setState({ competitionTabKey: key })
    }

    getRecordingTime(days, hours, minutes) {
        const _days = days || 0
        const _hours = hours || 0
        const _minutes = minutes || 0

        let dayToMinutes; let hoursToMinutes; let _mints; let
            totalMinutes
        dayToMinutes = _days * 24 * 60
        hoursToMinutes = _hours * 60
        _mints = _minutes * 1

        totalMinutes = dayToMinutes + hoursToMinutes + _mints
        return totalMinutes
    }

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
        } = this.props.liveScoreSetting.form

        const {
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
        } = this.props.liveScoreSetting

        let invitedToValue = null
        let assocValue = null
        let clubValue = null
        let selectionValue = null

        if (JSON.stringify(radioSelectionArr) === JSON.stringify(invitedTo)) {
            invitedToValue = false
        } else {
            invitedToValue = true
        }

        if (invitedAnyAssoc.length > 0) {
            if (JSON.stringify(invitedAnyAssocArr) === JSON.stringify(invitedAnyAssoc)) {
                assocValue = false
            } else {
                assocValue = true
            }
        }

        if (invitedAnyClub.length > 0) {
            if (JSON.stringify(invitedAnyClubArr) === JSON.stringify(invitedAnyClub)) {
                clubValue = false
            } else {
                clubValue = true
            }
        }

        if (invitedToValue || assocValue || clubValue) {
            selectionValue = true
        } else {
            selectionValue = false
        }
        localStorage.setItem("yearId", yearRefId)

        const timeoutsData = getTimeoutsData({
            timeouts,
            timeoutsToHalves,
            timeoutsToQuarters,
        })
        const gameTimeTracking = record1.includes("gameTimeTracking")
        const positionTracking = record1.includes("positionTracking")
        const recordGoalAttempts = record1.includes("recordGoalAttempts")
        const centrePassEnabled = record2.includes("centrePassEnabled")
        const incidentsEnabled = record2.includes("incidentsEnabled")
        const gameTimeTrackingType = record1.includes("gameTimeTracking") && this.state.trackFullPeriod
        const attendenceRecordingTime = this.getRecordingTime(days, hours, minutes)
        let lineUpSelectionTime = null
        if (lineupSelection) {
            lineUpSelectionTime = this.getRecordingTime(lineupSelectionDays, lineupSelectionHours, lineupSelectionMins)
        }

        let orgId = null
        if (this.props.location.state === 'add') {
            const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
            orgId = organisationId
        }

        const formData = new FormData();
        formData.append('id', id)
        formData.append('longName', captializedString(competitionName))
        formData.append('name', captializedString(shortName))
        formData.append('logo', competitionLogo)
        formData.append('recordUmpireType', recordUmpire)
        formData.append('gameTimeTracking', gameTimeTracking)
        formData.append('positionTracking', positionTracking)
        formData.append('recordGoalAttempts', recordGoalAttempts)
        formData.append('centrePassEnabled', centrePassEnabled)
        formData.append('incidentsEnabled', incidentsEnabled)
        formData.append('attendanceRecordingType', attendanceRecordingType)
        formData.append('attendanceRecordingPeriod', attendanceRecordingPeriod)
        formData.append('scoringType', scoring)
        formData.append('timerType', timerType)
        formData.append('organisationId', orgId || this.props.liveScoreSetting.data.organisationId)
        formData.append('buzzerEnabled', buzzerEnabled)
        formData.append('warningBuzzerEnabled', warningBuzzerEnabled)
        formData.append('playerBorrowingType', borrowedPlayer)
        formData.append('gamesBorrowedThreshold', gamesBorrowedThreshold)
        formData.append('linkedCompetitionId', linkedCompetitionId)
        formData.append('yearRefId', yearRefId)
        formData.append('isInvitorsChanged', selectionValue.toString())
        formData.append('timeoutDetails', JSON.stringify(timeoutsData))

        if (attendenceRecordingTime) {
            formData.append('attendanceSelectionTime', attendenceRecordingTime)
        }
        if (gameTimeTracking !== false) {
            formData.append('gameTimeTrackingType', gameTimeTrackingType)
        }
        if (lineupSelection) {
            formData.append('lineupSelectionEnabled', lineupSelection)
            formData.append('lineupSelectionTime', lineUpSelectionTime)
        }

        const invitedToArr = invitedTo.slice(0);
        formData.append('invitedTo', JSON.stringify(invitedToArr))
        if (invitedAnyAssoc.length > 0) {
            formData.append('invitedAnyAssoc', JSON.stringify(invitedAnyAssoc))
        }
        if (invitedAnyClub.length > 0) {
            formData.append('invitedAnyClub', JSON.stringify(invitedAnyClub))
        }

        if (invitedTo.length === 0) {
            message.config({
                duration: 1.5,
                maxCount: 1,
            })
            message.error(ValidationConstants.pleaseSelectRegInvitees, 1.5);
            localStorage.setItem("regInvitees", "false")
        } else if (associationChecked === true || clubChecked === true) {
            if (associationChecked === true && clubChecked === true) {
                if (associationLeague.length === 0 || clubSchool.length === 0) {
                    message.config({
                        duration: 1.5,
                        maxCount: 1,
                    })
                    message.error(ValidationConstants.pleaseSelectOrg, 1.5);
                    localStorage.setItem("regInvitees", "false")
                } else {
                    localStorage.setItem("regInvitees", "true")
                }
            } else if (associationChecked === true) {
                if (associationLeague.length === 0) {
                    message.config({
                        duration: 1.5,
                        maxCount: 1,
                    })
                    message.error(ValidationConstants.pleaseSelectOrg, 1.5);
                    localStorage.setItem("regInvitees", "false")
                } else {
                    localStorage.setItem("regInvitees", "true")
                }
            } else if (clubChecked === true) {
                if (clubSchool.length === 0) {
                    message.config({
                        duration: 1.5,
                        maxCount: 1,
                    })
                    message.error(ValidationConstants.pleaseSelectOrg, 1.5);
                    localStorage.setItem("regInvitees", "false")
                } else {
                    localStorage.setItem("regInvitees", "true")
                }
            }
        } else {
            localStorage.setItem("regInvitees", "true")
        }

        const regInvitees = localStorage.getItem("regInvitees")
        if (regInvitees === "true") {
            localStorage.setItem("regInvitees", "false")
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
                    <Breadcrumb.Item className="breadcrumb-add">
                        {AppConstants.settings}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Header>
        </div>
    );

    handleSearch = (value, data) => {
        const filteredData = data.filter((memo) => memo.venueName.toLowerCase().indexOf(value.toLowerCase()) > -1)
        this.props.searchVenueList(filteredData)
    };

    // On selection of venue
    onSelectValues(value) {
        this.props.onChangeSettingForm({ key: 'venue', data: value })
        this.props.clearFilter()
    }

    onChnageLineUpSelection(data, checkPositionTrackingEnabled) {
        let posTracking = false

        for (const i in checkPositionTrackingEnabled) {
            if (checkPositionTrackingEnabled[i] === "positionTracking") {
                posTracking = true
                break;
            }
        }

        if (posTracking) {
            this.props.onChangeSettingForm({ key: "lineupSelection", data })
        } else {
            message.config({
                duration: 1.5,
                maxCount: 1,
            });
            message.warn(AppConstants.lineUpSelectionMsg)
        }
    }

    differentPositionTracking = (options, selectedOption) => {
        const trackFullPeriod = [{ value: 0, name: "Track Full Period" }, { value: 1, name: "Track End of Period" }]
        if (options.value === "gameTimeTracking" && selectedOption.includes("gameTimeTracking")) {
            return (
                <div className="pt-4">
                    <Select
                        style={{
                            width: '100%', paddingRight: 1, minWidth: 182, maxWidth: 300,
                        }}
                        onChange={(trackFullPeriod) => this.setState({ trackFullPeriod })}
                        value={this.state.trackFullPeriod}
                        placeholder={AppConstants.selectCompetition}
                    >
                        {trackFullPeriod.map((item) => (
                            <Option key={`trackFullPeriod_${item.value}`} value={item.value}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
            )
        }
    }

    timeoutsView = () => {
        if (!isTimeoutsEnabled) return null;
        const { timeouts } = this.props.liveScoreSetting.form;
        const isTimeoutsChecked = !!timeouts || timeouts === false

        const handleTimeoutsChange = () => {
            this.props.onChangeSettingForm({
                key: "timeouts",
                data: isTimeoutsChecked ? null : false,
            })
        }

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
                    formRef={this.formRef.current}
                />
            </>
        );
    }

    contentView = () => {
        const {
            days,
            hours,
            minutes,
            lineupSelectionDays,
            lineupSelectionHours,
            lineupSelectionMins,
            record1,
            venue,
            Logo,
        } = this.props.liveScoreSetting.form
        const {
            buzzerEnabled,
            warningBuzzerEnabled,
            lineupSelection,
            premierCompLink,
            borrowedPlayer,
            gamesBorrowedThreshold,
            linkedCompetitionId,
            disabled,
        } = this.props.liveScoreSetting
        const applyTo1 = [
            { label: 'Game Time Tracking', value: "gameTimeTracking" },
            { label: 'Position Tracking', value: "positionTracking" },
            { label: 'Record Goal Attempts', value: "recordGoalAttempts" },
        ];
        const applyTo2 = [
            { label: 'Centre Pass Enabled', value: "centrePassEnabled" },
            { label: 'Incidents Enabled', value: "incidentsEnabled" },
        ];
        const competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []

        return (
            <div className="content-view pt-4">
                <Form.Item name="competition_name" rules={[{ required: true, message: ValidationConstants.competitionField }]}>
                    <InputWithHead
                        auto_complete="off"
                        required="required-field "
                        heading={AppConstants.competition_name}
                        placeholder={AppConstants.competition_name}
                        onChange={(e) => {
                            this.props.onChangeSettingForm({ key: 'competitionName', data: e.target.value })
                        }}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            competition_name: captializedString(i.target.value),
                        })}
                    />
                </Form.Item>

                <Form.Item name="short_name" rules={[{ required: true, message: ValidationConstants.shortField }]}>
                    <InputWithHead
                        auto_complete="off"
                        required="required-field "
                        heading={AppConstants.short_Name}
                        placeholder={AppConstants.short_Name}
                        name="shortName"
                        conceptulHelp
                        conceptulHelpMsg={AppConstants.shortNameMsg}
                        marginTop={5}
                        onChange={(e) => {
                            this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                        }}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            short_name: captializedString(i.target.value),
                        })}
                    />
                </Form.Item>

                {/* image and check box view */}
                <InputWithHead heading={AppConstants.competitionLogo} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>
                                <ImageLoader
                                    timeout={this.state.timeout}
                                    src={Logo || AppImages.circleImage}
                                />
                            </div>
                            <input
                                type="file"
                                id="user-pic"
                                className="d-none"
                                name="imageFile"
                                onChange={(evt) => {
                                    this.setImage(evt.target)
                                }}
                                onClick={(event) => {
                                    event.target.value = null
                                }}
                            />
                        </div>
                        <div className="col-sm d-flex align-items-center">
                            <Checkbox
                                className="single-checkbox"
                                defaultChecked
                            >
                                {AppConstants.useDefault}
                            </Checkbox>
                        </div>
                    </div>
                    <span className="image-size-format-text">
                        {AppConstants.imageSizeFormatText}
                    </span>
                </div>

                {/* venue multi selection */}
                <InputWithHead
                    required="required-field "
                    heading={AppConstants.venues}
                />
                <div>
                    <Form.Item name="venue" rules={[{ required: true, message: ValidationConstants.venueField }]}>
                        <div>
                            <Select
                                mode="multiple"
                                placeholder={AppConstants.selectVenue}
                                className="w-100"
                                onChange={(value) => {
                                    this.onSelectValues(value)
                                }}
                                filterOption={false}
                                onSearch={(value) => {
                                    this.handleSearch(value, this.props.liveScoreSetting.mainVenueList)
                                }}
                                value={venue}
                            >
                                {this.props.liveScoreSetting.venueData && this.props.liveScoreSetting.venueData.map((item) => (
                                    <Option key={`venue_${item.venueId}`} value={item.venueId}>
                                        {item.venueName}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </Form.Item>
                </div>

                {/* match settings check boxes */}
                <span className="text-heading-large pt-5" style={{ marginBottom: this.state.isEdit === "add" ? 10 : 0 }}>
                    {AppConstants.wouldLikeRecord}
                </span>
                {this.state.isEdit != "add" && (
                    <NavLink
                        to={{
                            pathname: '/matchDayDivisionList',
                        }}
                    >
                        <span className="input-heading-add-another pt-3 pb-3">
                            +
                            {AppConstants.divisionSettings}
                        </span>
                    </NavLink>
                )}
                <div className="fluid-width" style={{ marginTop: -10 }}>
                    <div className="row">
                        <div className="col-sm">
                            <Checkbox.Group
                                className="d-flex flex-column justify-content-center"
                                value={this.props.liveScoreSetting.form.record1}
                                onChange={(e) => this.onChangeCheckBox(e)}
                            >
                                {applyTo1.map((item) => (
                                    <div key={item.value}>
                                        <Checkbox className="single-checkbox-radio-style pt-4 ml-0" value={item.value}>
                                            {item.label}
                                        </Checkbox>
                                        {this.differentPositionTracking(item, this.props.liveScoreSetting.form.record1)}
                                    </div>
                                ))}
                            </Checkbox.Group>
                        </div>
                        <div className="col-sm" style={{ paddingTop: 1 }}>
                            <Checkbox.Group
                                className="checkBoxGroup-checkbox-radio-style d-flex flex-column justify-content-center"
                                options={applyTo2}
                                value={this.props.liveScoreSetting.form.record2}
                                onChange={(e) => this.onChangeCheckBox2(e)}
                            >
                                {
                                    applyTo2.map((item) => {
                                        if (item.helpMsg) {
                                            return (
                                                <div key={item.value}>
                                                    <Tooltip>
                                                        {item.helpMsg}
                                                    </Tooltip>
                                                </div>
                                            )
                                        }
                                    })
                                }
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
                        <Form.Item name="recordumpire" rules={[{ required: true, message: ValidationConstants.recordUmpireField }]}>
                            <Select
                                placeholder="Select Record Umpire"
                                className="w-100"
                                style={{ paddingRight: 1, minWidth: 182 }}
                                onChange={(recordUmpire) => this.props.onChangeSettingForm({
                                    key: "recordUmpire",
                                    data: recordUmpire,
                                })}
                            >
                                <Option value="NONE">None</Option>
                                <Option value="USERS">Integrated</Option>
                                <Option value="NAMES">At courts</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                {/* dropdown view */}
                <span className="text-heading-large pt-5">{AppConstants.attendance_record_report}</span>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            required="required-field"
                            conceptulHelp
                            conceptulHelpMsg={AppConstants.recordMsg}
                            marginTop={5}
                            heading={AppConstants.record}
                        />
                        <Form.Item name="attendanceRecord" rules={[{ required: true, message: ValidationConstants.attendanceRecordField }]}>
                            <Select
                                placeholder="Select Record"
                                className="w-100"
                                style={{ paddingRight: 1, minWidth: 182 }}
                                onChange={(recordSelection) => this.props.onChangeSettingForm({
                                    key: "attendanceRecordingType",
                                    data: recordSelection,
                                })}
                            >
                                <Option value="OWN">Own</Option>
                                <Option value="BOTH">Both</Option>
                                <Option value="OPPOSITION">Opposition</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <InputWithHead
                            required="required-field"
                            marginTop={5}
                            conceptulHelp
                            conceptulHelpMsg={AppConstants.reportMsg}
                            heading={AppConstants.report}
                        />
                        <Form.Item name="attendanceReport" rules={[{ required: true, message: ValidationConstants.attendanceReportField }]}>
                            <Select
                                placeholder="Select Report"
                                className="w-100"
                                style={{ paddingRight: 1, minWidth: 182 }}
                                onChange={(reportSelection) => this.props.onChangeSettingForm({
                                    key: "attendanceRecordingPeriod",
                                    data: reportSelection,
                                })}
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
                <InputWithHead heading={AppConstants.attendanceRecordingTime} />
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            required="pt-0"
                            heading={AppConstants._days}
                            placeholder={AppConstants._days}
                            name="days"
                            value={days || ""}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead
                            required="pt-0"
                            heading={AppConstants._hours}
                            placeholder={AppConstants._hours}
                            name="hours"
                            value={hours || ""}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                        />
                    </div>

                    <div className="col-sm">
                        <InputWithHead
                            required="pt-0"
                            heading={AppConstants._minutes}
                            placeholder={AppConstants._minutes}
                            name="minutes"
                            value={minutes || ""}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                        />
                    </div>
                </div>

                {/* Line up selection */}
                <Checkbox
                    className="single-checkbox pt-5 justify-content-center"
                    onChange={(e) => this.onChnageLineUpSelection(e.target.checked, record1)}
                    checked={lineupSelection}
                >
                    {AppConstants.squadSelection}
                </Checkbox>

                {lineupSelection && (
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants._days}
                                placeholder={AppConstants._days}
                                name="lineupSelectionDays"
                                value={lineupSelectionDays || ""}
                                onChange={(e) => {
                                    this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                                }}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants._hours}
                                placeholder={AppConstants._hours}
                                name="lineupSelectionHours"
                                value={lineupSelectionHours || ""}
                                onChange={(e) => {
                                    this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                                }}
                            />
                        </div>

                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants._minutes}
                                placeholder={AppConstants._minutes}
                                name="lineupSelectionMins"
                                value={lineupSelectionMins || ""}
                                onChange={(e) => {
                                    this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Player borrowing view */}
                <InputWithHead heading={AppConstants.playerBorrowing} />
                <div className="row mt-0 ml-1">
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => this.props.onChangeSettingForm({
                            key: "borrowedPlayer",
                            data: e.target.value,
                        })}
                        value={borrowedPlayer}
                    >
                        <div className="row mt-0 ml-1">
                            <div className="d-flex align-items-center flex-row justify-content-center">
                                <div>
                                    <Radio style={{ marginRight: 0, paddingRight: 0 }} value="GAMES">
                                        {AppConstants.gamesBorrowed}
                                    </Radio>
                                </div>

                                {borrowedPlayer === 'GAMES' && (
                                    <div className="small-steper-style">
                                        <InputNumber
                                            max={6}
                                            min={3}
                                            value={gamesBorrowedThreshold}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={(number) => this.props.onChangeSettingForm({
                                                key: "number",
                                                data: number,
                                            })}
                                            placeholder="0"
                                        />
                                    </div>
                                )}
                            </div>

                            <div style={{ marginLeft: 40 }}>
                                <Radio style={{ marginRight: 0, paddingRight: 0 }} value="MINUTES">
                                    {AppConstants.minutesBorrowed}
                                </Radio>
                            </div>
                        </div>
                    </Radio.Group>
                </div>

                <div style={{ marginTop: 20 }}>
                    <Checkbox
                        className="single-checkbox  justify-content-center"
                        onChange={(e) => this.props.onChangeSettingForm({
                            key: "premierCompLink",
                            data: e.target.checked,
                        })}
                        checked={premierCompLink}
                    >
                        {AppConstants.premierCompLink}
                    </Checkbox>

                    {premierCompLink && (
                        <div style={{ marginTop: 15 }}>
                            <Select
                                showSearch
                                onChange={(compId) => this.props.onChangeSettingForm({
                                    key: "linkedCompetitionId",
                                    data: compId,
                                })}
                                placeholder="Search Competition"
                                value={linkedCompetitionId || undefined}
                                optionFilterProp="children"
                            >
                                {competition.map((item) => (
                                    <Option key={`competition_${item.id}`} value={item.id}>{item.longName}</Option>
                                ))}
                            </Select>
                        </div>
                    )}
                </div>

                {/* radio button view */}
                <span className="text-heading-large pt-5">{AppConstants.scoringAndTimer}</span>

                <InputWithHead required="required-field pb-1" heading={AppConstants.scoring} />
                <div className="contextualHelp-RowDirection">
                    <Form.Item name="scoring" rules={[{ required: true, message: ValidationConstants.scoringField }]}>
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={(e) => this.competition_format(e)}
                            style={{
                                overflowX: 'unset',
                            }}
                        >
                            <div className="row ml-2 mt-0">
                                <div className="d-flex align-items-center">
                                    <Radio style={{ marginRight: 0, paddingRight: 0 }} value="SINGLE">{AppConstants.single}</Radio>
                                    <div className="mt-n10 ml-n10 mt-1">
                                        <Tooltip>
                                            <span>{AppConstants.singleScoringMsg}</span>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center" style={{ marginLeft: 10 }}>
                                    <Radio style={{ marginRight: 0, paddingRight: 0 }} value="50_50">50/50</Radio>
                                    <div className="mt-n10 ml-n10 mt-1">
                                        <Tooltip>
                                            <span>{AppConstants.fiftyScoringMsg}</span>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </div>

                {/* timer view */}
                <InputWithHead
                    conceptulHelp
                    conceptulHelpMsg={AppConstants.timerMsg}
                    marginTop={5}
                    required="required-field"
                    heading={AppConstants.timer}
                />
                <div>
                    <Form.Item name="time" rules={[{ required: true, message: ValidationConstants.timerField }]}>
                        <Select
                            placeholder="Select Time"
                            className="w-100"
                            style={{ paddingRight: 1, minWidth: 182 }}
                            onChange={(timer) => this.props.onChangeSettingForm({ key: "timerType", data: timer })}
                        >
                            <Option value="CENTRAL">Central</Option>
                            <Option value="PER_MATCH">Per Match</Option>
                            <Option value="CENTRAL_WITH_MATCH_OVERRIDE">Central with Per Match Override</Option>
                        </Select>
                    </Form.Item>
                </div>

                {/* Buzzer button view */}
                <InputWithHead conceptulHelp conceptulHelpMsg={AppConstants.buzzerMsg} marginTop={0} heading={AppConstants.buzzer} />
                <div className="row mt-0 ml-1">
                    <Checkbox
                        className="single-checkbox d-flex justify-content-center"
                        onChange={(e) => this.props.onChangeSettingForm({
                            key: "buzzerEnabled",
                            data: e.target.checked,
                        })}
                        checked={buzzerEnabled}
                    >
                        {AppConstants.buzzer}
                    </Checkbox>

                    <Checkbox
                        className="single-checkbox"
                        onChange={(e) => this.props.onChangeSettingForm({
                            key: "warningBuzzerEnabled",
                            data: e.target.checked,
                        })}
                        checked={warningBuzzerEnabled}
                    >
                        {AppConstants.turnOff_30Second}
                    </Checkbox>
                </div>

                {this.timeoutsView()}
                {this.regInviteesView()}
            </div>
        )
    };

    /// / On change Invitees
    onInviteesChange(value) {
        this.props.onChangeSettingForm({ key: "anyOrgSelected", data: value })
        if (value == 7) {
            this.onInviteeSearch("", 3)
        } else if (value == 8) {
            this.onInviteeSearch("", 4)
        }
    }

    onInviteeSearch = (value, inviteesType) => {
        this.props.onInviteesSearchAction(value, inviteesType)
    }

    /// /////reg invitees search view for any organisation
    associationSearchInvitee = () => {
        const detailsData = this.props.competitionFeesState
        const associationAffiliates = detailsData.associationAffilites
        const { associationLeague } = this.props.liveScoreSetting
        const disabledComponent = ((this.state.isEdit === 'edit' || this.state.edit === 'edit') && this.state.onOkClick)
        return (
            <div className="col-sm ml-3">
                <Select
                    mode="multiple"
                    className="w-100"
                    style={{ paddingRight: 1, minWidth: 182 }}
                    onChange={(associationAffiliate) => {
                        this.props.onChangeSettingForm({ key: "associationAffilite", data: associationAffiliate })
                    }}
                    value={associationLeague}
                    placeholder={AppConstants.selectOrganisation}
                    filterOption={false}
                    onSearch={(value) => {
                        this.onInviteeSearch(value, 3)
                    }}
                    showSearch
                    onBlur={() => this.onInviteeSearch("", 3)}
                    disabled={disabledComponent}
                >
                    {associationAffiliates.map((item) => (
                        <Option key={`organisation_${item.id}`} value={item.id}>{item.name}</Option>
                    ))}
                </Select>
            </div>
        )
    }

    /// /////reg invitees search view for any organisation
    clubSearchInvitee = () => {
        const detailsData = this.props.competitionFeesState
        const clubAffiliates = detailsData.clubAffilites
        const { clubSchool } = this.props.liveScoreSetting
        const disabledComponent = ((this.state.isEdit === 'edit' || this.state.edit === 'edit') && this.state.onOkClick)
        return (
            <div className="col-sm ml-3">
                <Select
                    mode="multiple"
                    className="w-100"
                    style={{ paddingRight: 1, minWidth: 182 }}
                    onChange={(clubAffiliate) => {
                        this.props.onChangeSettingForm({ key: "clubAffilite", data: clubAffiliate })
                    }}
                    value={clubSchool}
                    placeholder={AppConstants.selectOrganisation}
                    filterOption={false}
                    onSearch={(value) => {
                        this.onInviteeSearch(value, 4)
                    }}
                    onBlur={() => this.onInviteeSearch("", 4)}
                    disabled={disabledComponent}
                >
                    {clubAffiliates.map((item) => (
                        <Option key={`organisation_${item.id}`} value={item.id}>{item.name}</Option>
                    ))}
                </Select>
            </div>
        )
    }

    openModel = () => {
        const this_ = this;
        confirm({
            title: AppConstants.editOrganisationMessage,
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            maskClosable: true,
            onOk() {
                this_.setState({ onOkClick: false })
            },
            onCancel() {
                this_.setState({ onOkClick: true })
            },
        });
    };

    regInviteesView = () => {
        const {
            affiliateSelected,
            anyOrgSelected,
            otherSelected,
            affiliateNonSelected,
            anyOrgNonSelected,
            registrationInvitees,
            associationChecked,
            clubChecked,
        } = this.props.liveScoreSetting
        const invitees = isArrayNotEmpty(registrationInvitees) ? registrationInvitees : [];
        const orgLevelId = JSON.stringify(this.state.organisationTypeRefId);
        const disabledComponent = ((this.state.isEdit === 'edit' || this.state.edit === 'edit') && this.state.onOkClick)
        const isEdit = (this.state.isEdit || this.state.edit) ? this.state.isEdit || this.state.edit : 'add'
        return (
            <div className={((isEdit.edit === 'edit' || isEdit === 'edit') && this.state.onOkClick) && "inside-container-view"}>
                {((isEdit.edit === 'edit' || isEdit === 'edit') && this.state.onOkClick) && (
                    <div className="transfer-image-view">
                        <Button onClick={() => this.openModel()} className="primary-add-comp-form" type="primary">
                            {AppConstants.edit}
                        </Button>
                    </div>
                )}

                <div>
                    <Radio.Group
                        className={`reg-competition-radio${(isEdit.edit === 'edit' || isEdit == 'edit') && this.state.onOkClick}` ? "" : " mt-5"}
                        onChange={(e) => this.props.onChangeSettingForm({
                            key: "affiliateSelected",
                            data: e.target.value,
                        })}
                        value={affiliateSelected}
                        disabled={disabledComponent}
                    >
                        {(invitees || []).map((item, index) => (index == 0 && (
                            <div>
                                {item.subReferences.length === 0
                                    ? <Radio value={item.id}>{item.description}</Radio>
                                    : (
                                        <div>
                                            <div className="applicable-to-heading invitees-main">
                                                {(orgLevelId == '2' || orgLevelId == '3') && item.description}
                                            </div>
                                            {(item.subReferences).map((subItem, subIndex) => (
                                                orgLevelId == '2' && subItem.id == 2
                                                    ? (
                                                        <>
                                                            <div style={{ marginLeft: 20 }}>
                                                                <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                            </div>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            {((orgLevelId == '2' || orgLevelId == '3') && subItem.id == 3) && (
                                                                <>
                                                                    <div style={{ marginLeft: 20 }}>
                                                                        <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                                    </div>

                                                                    <div style={{ marginLeft: 20 }}>
                                                                        <Radio.Group
                                                                            onChange={(e) => this.props.onChangeSettingForm({
                                                                                key: "affiliateNonSelected",
                                                                                data: e.target.value,
                                                                                subItem,
                                                                            })}
                                                                            value={affiliateNonSelected}
                                                                            disabled={disabledComponent}
                                                                        >
                                                                            <Radio disabled={disabledComponent} key="none1" value="none1">
                                                                            None
                                                                            </Radio>
                                                                        </Radio.Group>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </>
                                                    )
                                            ))}
                                        </div>
                                    )}
                            </div>
                        )))}
                    </Radio.Group>

                    <Radio.Group
                        className="reg-competition-radio mt-0"
                        onChange={(e) => this.onInviteesChange(e.target.value)}
                        value={anyOrgSelected}
                        disabled={disabledComponent}
                    >
                        {(invitees || []).map((item, index) => (index == 1 && (
                            <div>
                                {item.subReferences.length === 0 ? (
                                    <Radio value={item.id}>{item.description}</Radio>
                                ) : (
                                    <div>
                                        <div className="applicable-to-heading invitees-main">{item.description}</div>

                                        <div className="d-flex flex-column" style={{ paddingLeft: 13 }}>
                                            <Checkbox
                                                disabled={disabledComponent}
                                                className="single-checkbox-radio-style"
                                                style={{ paddingLeft: 7, paddingTop: 8 }}
                                                checked={associationChecked}
                                                onChange={(e) => this.props.onChangeSettingForm({
                                                    key: 'associationChecked',
                                                    data: e.target.checked,
                                                    checkBoxId: item.subReferences[0].id,
                                                })}
                                            >
                                                {item.subReferences[0].description}
                                            </Checkbox>

                                            {associationChecked && this.associationSearchInvitee()}

                                            <Checkbox
                                                disabled={disabledComponent}
                                                className="single-checkbox-radio-style"
                                                style={{ paddingTop: 15, paddingLeft: associationChecked ? 5 : 0 }}
                                                checked={clubChecked}
                                                onChange={(e) => this.props.onChangeSettingForm({
                                                    key: 'clubChecked',
                                                    data: e.target.checked,
                                                    checkBoxId: item.subReferences[1].id,
                                                })}
                                            >
                                                {item.subReferences[1].description}
                                            </Checkbox>

                                            {clubChecked && this.clubSearchInvitee()}
                                        </div>

                                        <div style={{ marginLeft: 20 }}>
                                            <Radio.Group
                                                onChange={(e) => this.props.onChangeSettingForm({
                                                    key: "anyOrgNonSelected",
                                                    data: e.target.value,
                                                })}
                                                value={anyOrgNonSelected}
                                                disabled={disabledComponent}
                                            >
                                                <Radio disabled={disabledComponent} key="none2" value="none2">
                                                            None
                                                </Radio>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )))}
                    </Radio.Group>

                    <Radio.Group
                        className="reg-competition-radio mt-0"
                        onChange={(e) => this.props.onChangeSettingForm({ key: "otherSelected", data: e.target.value })}
                        value={otherSelected}
                        disabled={disabledComponent}
                    >
                        {(invitees || []).map((item, index) => (index > 1 && (
                            <div>
                                {item.subReferences ? (
                                    <div>
                                        <div className="applicable-to-heading invitees-main">{item.description}</div>
                                        {(item.subReferences).map((subItem) => (
                                            <div key={`subReference_${subItem.id}`} style={{ marginLeft: 20 }}>
                                                <Radio
                                                    onChange={(e) => this.props.onChangeSettingForm({
                                                        key: "none",
                                                        data: e.target.value,
                                                    })}
                                                    key={subItem.id}
                                                    value={subItem.id}
                                                >
                                                    {subItem.description}
                                                </Radio>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    item.id == 5 && <Radio value={item.id}>{item.description}</Radio>
                                )}
                            </div>
                        )))}
                    </Radio.Group>
                </div>
            </div>
        );
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
                                {this.state.competitionTabKey == 6 ? AppConstants.publish : AppConstants.save}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    onYearClick(yearRefId) {
        this.setState({ yearRefId })
        this.props.onChangeSettingForm({ key: "yearRefId", data: yearRefId })
    }

    dropDownView = () => {
        const { yearList } = this.props.appState
        const { yearRefId } = this.props.liveScoreSetting
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="w-ft d-flex flex-row align-items-center">
                                <span className="year-select-heading">
                                    {AppConstants.year}
:
                                </span>

                                <Select
                                    className="year-select reg-filter-select-year ml-2"
                                    onChange={(yearId) => this.onYearClick(yearId)}
                                    value={yearRefId}
                                >
                                    {yearList.map((item) => (
                                        <Option key={`year_${item.id}`} value={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    onFinishFailed = () => {
        message.config({ maxCount: 1, duration: 1.5 })
        message.error(ValidationConstants.plzReviewPage)
    };

    render() {
        const local_Id = this.state.screenName === 'umpireDashboard' ? null : getLiveScoreCompetiton()
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading={this.state.screenName === 'umpireDashboard' ? AppConstants.umpires : AppConstants.matchDay}
                    menuName={this.state.screenName === 'umpireDashboard' ? AppConstants.umpires : AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./matchDayCompetitions")}
                />
                {local_Id && (
                    <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="18" />
                )}
                {this.state.isEdit === 'edit' ? (
                    <Loader visible={this.props.liveScoreSetting.editLoader} />
                ) : (
                    <Loader visible={this.props.liveScoreSetting.loader} />
                )}
                <Layout>
                    {this.headerView()}
                    {this.dropDownView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.handleSubmit}
                        onFinishFailed={this.onFinishFailed}
                        className="login-form"
                        noValidate="noValidate"
                    >
                        <div className="formView">{this.contentView()}</div>
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
    }
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
