import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Checkbox,
    Button,
    Radio,
    Tabs,
    InputNumber,
    Form,
    Input,
    Icon
} from "antd";
import { NavLink } from "react-router-dom";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import { connect } from 'react-redux';
import AppImages from "../../themes/appImages";
import {
    getLiveScoreSettingInitiate,
    onChangeSettingForm,
    settingDataPostInititae,
    clearLiveScoreSetting,
    searchVenueList,
    clearFilter,
    settingRegInvitees
} from '../../store/actions/LiveScoreAction/LiveScoreSettingAction'
import Loader from '../../customComponents/loader';
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { getCompetitionVenuesList } from '../../store/actions/LiveScoreAction/liveScoreMatchAction'
import ImageLoader from '../../customComponents/ImageLoader'
import history from "../../util/history";
import { isArrayNotEmpty, captializedString } from "../../util/helpers";
import Tooltip from 'react-png-tooltip'
import { onInviteesSearchAction } from "../../store/actions/registrationAction/competitionFeeAction";
import { message } from "antd";
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"



const { Header, Footer } = Layout;
const { Option } = Select;



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
            competitionId: null
        };
    }
    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.props.umpireCompetitionListAction(null, null, organisationId)

        if (this.state.screenName == 'umpireDashboard') {

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
            let comp_id = getLiveScoreCompetiton()
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

            this.props.form.setFieldsValue({
                "recordumpire": undefined
            })
        }

    }

    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreSetting != this.props.liveScoreSetting) {
            const { competitionName, shortName, competitionLogo, scoring, recordUmpireType } = this.props.liveScoreSetting.form
            console.log(this.props.liveScoreSetting, "chchch")
            this.props.form.setFieldsValue({
                competition_name: competitionName,
                short_name: shortName,
                time: this.props.liveScoreSetting.form.timerType,
                venue: this.props.liveScoreSetting.form.venue,
                scoring: scoring,
                recordumpire: this.props.liveScoreSetting.recordUmpire,
                attendanceReport: this.props.liveScoreSetting.form.attendanceRecordingPeriod,
                attendanceRecord: this.props.liveScoreSetting.form.attendanceRecordingType,
            })


        }
        if (nextProps.venueList != this.props.venueList) {
        }
    }


    ////method to select multiple value
    teamChange = (value) => {
        this.props.onChangeSettingForm({ key: 'venue', data: value })
    }


    competition_format = e => {
        this.props.onChangeSettingForm({ key: 'scoring', data: e.target.value })
    };

    setImage = (data) => {
        if (data.files[0] !== undefined) {
            this.setState({ image: data.files[0], profileImage: URL.createObjectURL(data.files[0]) })
            const imgData = URL.createObjectURL(data.files[0])
            this.props.onChangeSettingForm({ key: 'competitionLogo', data: data.files[0] })
            this.props.onChangeSettingForm({ key: 'Logo', data: imgData })
        }
    };

    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    //method to check box selection
    onChangeCheckBox(checkedValues) {

        this.props.onChangeSettingForm({ key: 'record1', data: checkedValues })
    }
    onChangeCheckBox2(checkedValues) {
        this.props.onChangeSettingForm({ key: 'record2', data: checkedValues })
    }

    ////method to change time
    onChangeTime(time, timeString) {
    }

    tabCallBack = (key) => {
        this.setState({ competitionTabKey: key })
    }

    getRecordingTime(days, hours, minutes) {
        let _days = days ? days : 0
        let _hours = hours ? hours : 0
        let _minutes = minutes ? minutes : 0

        let dayToMinutes, hoursToMinutes, _mints, totalMinutes
        dayToMinutes = _days * 24 * 60
        hoursToMinutes = _hours * 60
        _mints = _minutes * 1

        totalMinutes = dayToMinutes + hoursToMinutes + _mints
        return totalMinutes


    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {


            if (!err) {
                const arrayOfVenue = this.props.liveScoreSetting.form.allVenue.map(data => data.id)
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
                    lineupSelectionMins
                } = this.props.liveScoreSetting.form

                const {
                    buzzerEnabled,
                    warningBuzzerEnabled,
                    recordUmpire,
                    affiliateSelected,
                    anyOrgSelected,
                    otherSelected,
                    invitedTo,
                    invitedOrganisation,
                    lineupSelection,
                    borrowedPlayer,
                    gamesBorrowedThreshold,
                    linkedCompetitionId,
                    premierCompLink
                } = this.props.liveScoreSetting

                const umpire = record1.includes("recordUmpire")
                const umpirenum = umpire ? 1 : 0
                const gameTimeTracking = record1.includes("gameTimeTracking")
                const positionTracking = record1.includes("positionTracking")
                const recordGoalAttempts = record1.includes("recordGoalAttempts")
                const centrePassEnabled = record2.includes("centrePassEnabled")
                const incidentsEnabled = record2.includes("incidentsEnabled")

                let attendenceRecordingTime = this.getRecordingTime(days, hours, minutes)
                let lineUpSelectionTime = null
                if (lineupSelection) {
                    lineUpSelectionTime = this.getRecordingTime(lineupSelectionDays, lineupSelectionHours, lineupSelectionMins)

                }

                let orgId = null
                if (this.props.location.state === 'add') {
                    let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
                    orgId = organisationId
                }

                var formData = new FormData();

                formData.append('id', id)
                formData.append('longName', captializedString(competitionName))
                formData.append('name', captializedString(shortName))
                formData.append('logo', competitionLogo)
                // formData.append('recordUmpire', umpirenum)
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
                formData.append('organisationId', orgId ? orgId : this.props.liveScoreSetting.data.organisationId)
                formData.append('buzzerEnabled', buzzerEnabled)
                formData.append('warningBuzzerEnabled', warningBuzzerEnabled)
                formData.append('playerBorrowingType', borrowedPlayer)

                formData.append('gamesBorrowedThreshold', gamesBorrowedThreshold)

                formData.append('linkedCompetitionId', linkedCompetitionId)


                if (attendenceRecordingTime) {
                    formData.append('attendanceSelectionTime', attendenceRecordingTime)
                }


                if (lineupSelection) {
                    formData.append('lineupSelectionEnabled', lineupSelection)
                    formData.append('lineupSelectionTime', lineUpSelectionTime)
                }


                if (this.state.isEdit == 'add') {
                    console.log(invitedTo, 'invitedTo', JSON.stringify(invitedTo))
                    let invitedToArr = invitedTo[0] === 6 ? [] : invitedTo
                    formData.append('invitedTo', JSON.stringify(invitedToArr))
                    formData.append('invitedOrganisation', JSON.stringify(invitedOrganisation))
                }

                this.props.settingDataPostInititae({ body: formData, venue: venue, settingView: this.props.location.state, screenName: this.state.screenName, competitionId: this.state.competitionId, isEdit: this.state.isEdit })

            }
        });
    };

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.settings}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    handleSearch = (value, data) => {
        const filteredData = data.filter(memo => {
            return memo.venueName.toLowerCase().indexOf(value.toLowerCase()) > -1
        })
        this.props.searchVenueList(filteredData)

    };


    //On selection of venue
    onSelectValues(value) {
        this.props.onChangeSettingForm({ key: 'venue', data: value })
        this.props.clearFilter()
    }

    onChnageLineUpSelection(data, checkPositionTrackingEnabled) {

        let posTracking = false

        for (let i in checkPositionTrackingEnabled) {
            if (checkPositionTrackingEnabled[i] == "positionTracking") {
                posTracking = true
                break;
            }
        }

        if (posTracking) {
            this.props.onChangeSettingForm({ key: "lineupSelection", data: data })
        } else {
            message.config({
                duration: 1.5,
                maxCount: 1,
            });
            message.warn(AppConstants.lineUpSelectionMsg)
        }

    }


    ////////form content view
    contentView = (getFieldDecorator) => {
        const { competitionName, competitionLogo, scoring, days, hours, minutes, lineupSelectionDays, lineupSelectionHours, lineupSelectionMins, record1, venue, Logo } = this.props.liveScoreSetting.form
        const { loader, buzzerEnabled, warningBuzzerEnabled, recordUmpire, lineupSelection, gameborrowed, minutesBorrowed, premierCompLink, borrowedPlayer, gamesBorrowedThreshold, linkedCompetitionId } = this.props.liveScoreSetting
        let grade = this.state.venueData
        // const applyTo1 = [{ label: 'Record Umpire', value: "recordUmpire" }, { label: ' Game Time Tracking', value: "gameTimeTracking" }, { label: 'Position Tracking', value: "positionTracking" }];
        const applyTo1 = [{ label: ' Game Time Tracking', value: "gameTimeTracking", }, { label: 'Position Tracking', value: "positionTracking", }, { label: 'Record Goal Attempts', value: "recordGoalAttempts", }];
        const applyTo2 = [{ label: 'Centre Pass Enabled', value: "centrePassEnabled", }, { label: 'Incidents Enabled', value: "incidentsEnabled", }];
        const turnOffBuzzer = [{ label: AppConstants.turnOffBuzzer, value: true }];
        const buzzerEnabledArr = [{ label: AppConstants.turnOff_30Second, value: true }];

        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="content-view pt-4">
                <Form.Item>
                    {getFieldDecorator('competition_name', {
                        rules: [{ required: true, message: ValidationConstants.competitionField }]
                    })(
                        <InputWithHead
                            auto_complete='off'
                            required={"required-field pb-0"}
                            heading={AppConstants.competition_name}
                            placeholder={AppConstants.competition_name}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: 'competitionName', data: e.target.value })
                            }}
                            onBlur={(i) => this.props.form.setFieldsValue({
                                'competition_name': captializedString(i.target.value)
                            })}
                        />
                    )}
                </Form.Item>



                {/* <div className='contextualHelp-RowDirection' >

                    <span className='text-heading-large pt-5' >{AppConstants.short_Name}<span style={{ color: 'red' }}>{'*'}</span></span>
                    <div style={{ marginTop: 28 }}>
                        <Tooltip background='#ff8237'>
                            <span>{AppConstants.shortNameMsg}</span>
                        </Tooltip>
                    </div>
                </div> */}
                <Form.Item>
                    {getFieldDecorator('short_name', {
                        rules: [{ required: true, message: ValidationConstants.shortField }]
                    })(
                        <InputWithHead
                            auto_complete='off'
                            required={"required-field pb-0"}
                            heading={AppConstants.short_Name}
                            placeholder={AppConstants.short_Name}
                            name='shortName'
                            conceptulHelp
                            conceptulHelpMsg={AppConstants.shortNameMsg}
                            marginTop={15}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                            onBlur={(i) => this.props.form.setFieldsValue({
                                'short_name': captializedString(i.target.value)
                            })}
                        />
                    )}
                </Form.Item>

                {/* image and check box view */}
                <InputWithHead heading={AppConstants.competitionLogo} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>
                                {/* <label>
                                    <img
                                        src={this.props.liveScoreSetting.form.Logo}
                                        alt=""
                                        height="120"
                                        width="120"
                                        style={{ borderRadius: 60 }}
                                        name={'image'}


                                        onError={ev => {
                                            ev.target.src = AppImages.circleImage;
                                        }}
                                    />
                                </label> */}

                                <ImageLoader
                                    timeout={this.state.timeout}
                                    // src={this.props.liveScoreSetting.form.Logo}
                                    src={Logo ? Logo : AppImages.circleImage}
                                />

                            </div>
                            <input
                                type="file"
                                id="user-pic"
                                style={{ display: 'none' }}
                                name={"imageFile"}
                                onChange={(evt) => {
                                    this.setImage(evt.target)
                                    this.setState({ timeout: 2000 })
                                    setTimeout(() => {
                                        this.setState({ timeout: null })
                                    }, 2000);
                                }} />

                        </div>
                        <div
                            className="col-sm"
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <Checkbox
                                className="single-checkbox"
                                defaultChecked={true}

                            // onChange={e => this.onChange(e)}
                            >
                                {AppConstants.useDefault}
                            </Checkbox>
                        </div>

                    </div>
                </div>

                {/* venue muilti selection */}
                <InputWithHead
                    required={"required-field pb-0"}
                    heading={AppConstants.venues} />
                <div>
                    <Form.Item>
                        {getFieldDecorator('venue', {
                            rules: [{ required: true, message: ValidationConstants.venueField }]
                        })(
                            <div style={{ marginTop: -15 }}>
                                <Select
                                    mode="multiple"
                                    placeholder={AppConstants.selectVenue}
                                    style={{ width: "100%" }}
                                    onChange={value => {
                                        this.onSelectValues(value)

                                    }}
                                    filterOption={false}
                                    // value={this.state.team === [] ? AppConstants.selectTeam : this.state.team}
                                    onSearch={(value) => { this.handleSearch(value, this.props.liveScoreSetting.mainVenueList) }}
                                    value={venue}
                                >
                                    {this.props.venueList.venueData ? this.props.liveScoreSetting.venueData.map((item) => {
                                        return <Option key={item.venueId} value={item.venueId}>
                                            {item.venueName}
                                        </Option>
                                    }) : ''}
                                </Select>
                            </div>
                        )}
                    </Form.Item>

                </div>

                {/* match settings check boxes */}
                {/* <InputWithHead heading={AppConstants.matchSettings} /> */}
                <span className='text-heading-large pt-5' style={{ marginBottom: this.state.isEdit == "add" ? 10 : 0 }} >{AppConstants.wouldLikeRecord}</span>
                {this.state.isEdit != "add" &&
                    <NavLink
                        to={{
                            pathname: `/liveScoreDivisionList`,
                        }}
                    >
                        <span className="input-heading-add-another pt-3 pb-3">
                            +{AppConstants.divisionSettings}
                        </span>
                    </NavLink>
                }
                <div className="fluid-width" style={{ marginTop: -10 }}>
                    <div className="row">
                        <div className="col-sm">
                            <Checkbox.Group
                                style={{
                                    display: "-ms-flexbox",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}

                                options={applyTo1}
                                value={this.props.liveScoreSetting.form.record1}
                                onChange={e => this.onChangeCheckBox(e)}>
                                {applyTo1.map((item) => (
                                    <Tooltip background='#ff8237'>
                                        {/* <span>{item.helpMsg}</span> */}
                                        {item.helpMsg}
                                    </Tooltip>
                                ))}

                            </Checkbox.Group>
                        </div>
                        <div className="col-sm" style={{ paddingTop: 1 }}>
                            <Checkbox.Group
                                style={{
                                    display: "-ms-flexbox",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}
                                options={applyTo2}
                                value={this.props.liveScoreSetting.form.record2}
                                onChange={e => this.onChangeCheckBox2(e)}
                            >
                                {applyTo2.map((item) => (
                                    <Tooltip background='#ff8237'>
                                        {/* <span>{item.helpMsg}</span> */}
                                        {item.helpMsg}
                                    </Tooltip>
                                ))}
                            </Checkbox.Group>
                        </div>
                    </div>
                </div>

                {/* Record Umpire dropdown view */}
                <InputWithHead required={"required-field pb-3"} conceptulHelp conceptulHelpMsg={AppConstants.recordUmpireMsg} marginTop={5} heading={AppConstants.recordUmpire} />
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator('recordumpire', {
                                rules: [{ required: true, message: ValidationConstants.recordumpireField }]
                            })(
                                <Select
                                    placeholder={'Select Record Umpire'}
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                                    onChange={recordUmpire => this.props.onChangeSettingForm({ key: "recordUmpire", data: recordUmpire })}
                                // value={recordUmpire}
                                >
                                    <Option value={"NONE"}>{'None'}</Option>
                                    <Option value={"USERS"}>{'Integrated'}</Option>
                                    <Option value={"NAMES"}>{'At courts'}</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                </div>

                {/* dropdown view */}
                {/* <InputWithHead heading={AppConstants.attendence_reord_report} /> */}
                <span className='text-heading-large pt-5' >{AppConstants.attendence_reord_report}</span>
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead required={"required-field pb-3"} marginTop={0} conceptulHelp conceptulHelpMsg={AppConstants.recordMsg} heading={AppConstants.record} />
                        <Form.Item>
                            {getFieldDecorator('attendanceRecord', {
                                rules: [{ required: true, message: ValidationConstants.attendanceRecordField }]
                            })(
                                <Select
                                    placeholder={'Select Record'}
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                                    onChange={recordSelection => this.props.onChangeSettingForm({ key: "attendanceRecordingType", data: recordSelection })}
                                    value={this.props.liveScoreSetting.form.attendanceRecordingType}
                                // defaultValue={}
                                // value={this.props.liveScoreSetting.form.attendanceRecordingType}
                                >
                                    <Option value={"OWN"}>{'Own'}</Option>
                                    <Option value={"BOTH"}>{'Both'}</Option>
                                    <Option value={"OPPOSITION"}>{'Opposition'}</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm" >
                        <InputWithHead required={"required-field pb-3"} marginTop={0} conceptulHelp conceptulHelpMsg={AppConstants.reportMsg} heading={AppConstants.report} />
                        <Form.Item>
                            {getFieldDecorator('attendanceReport', {
                                rules: [{ required: true, message: ValidationConstants.attendanceReportField }]
                            })(
                                <Select
                                    placeholder={'Select Report'}
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={reportSelection => this.props.onChangeSettingForm({ key: "attendanceRecordingPeriod", data: reportSelection })}
                                    value={this.props.liveScoreSetting.form.attendanceRecordingPeriod}
                                // value={this.props.liveScoreSetting.form.attendanceRecordingPeriod}
                                >
                                    <Option value={"PERIOD"}>{'Period'}</Option>
                                    <Option value={"MINUTE"}>{'Minute'}</Option>
                                    <Option value={"MATCH"}>{'Games'}</Option>

                                </Select>
                            )}
                        </Form.Item>
                    </div>
                </div>


                {/*Attendance Recording Time*/}
                <InputWithHead heading={AppConstants.attendanceRecordingTime} />
                {/* <span className='text-heading-large pt-5' >{AppConstants.attendanceRecordingTime}</span> */}
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead
                            required={"pt-0"}
                            // marginTop={-15}
                            // conceptulHelp conceptulHelpMsg={AppConstants.reportMsg}
                            heading={AppConstants._days}
                            placeholder={AppConstants._days}
                            name="days"

                            value={days ? days : ""}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}


                        />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead
                            required={"pt-0"}
                            // marginTop={-15}
                            // conceptulHelp conceptulHelpMsg={AppConstants.reportMsg}
                            heading={AppConstants._hours}
                            placeholder={AppConstants._hours}
                            name="hours"
                            value={hours ? hours : ""}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                        />
                    </div>

                    <div className="col-sm"  >
                        <InputWithHead
                            required={"pt-0"}
                            // marginTop={-15}
                            // conceptulHelp conceptulHelpMsg={AppConstants.reportMsg}
                            heading={AppConstants._minutes}
                            placeholder={AppConstants._minutes}
                            name="minutes"
                            value={minutes ? minutes : ""}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                        />

                    </div>
                </div>

                {/* Line up selection */}
                <Checkbox style={{
                    display: "-ms-flexbox",
                    flexDirection: "column",
                    justifyContent: "center"
                }}
                    className="single-checkbox pt-5"
                    onChange={(e) => this.onChnageLineUpSelection(e.target.checked, record1)}
                    // onChange={(e) => this.props.onChangeSettingForm({ key: "lineupSelection", data: e.target.checked })}
                    checked={lineupSelection}
                >
                    {AppConstants.sqadSelection}
                </Checkbox>

                {lineupSelection && <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead
                            // conceptulHelp conceptulHelpMsg={AppConstants.reportMsg}
                            // required={"required-field pb-0"}
                            heading={AppConstants._days}
                            placeholder={AppConstants._days}
                            name="lineupSelectionDays"
                            value={lineupSelectionDays ? lineupSelectionDays : ""}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                        />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead
                            // conceptulHelp conceptulHelpMsg={AppConstants.reportMsg}
                            heading={AppConstants._hours}
                            placeholder={AppConstants._hours}
                            name="lineupSelectionHours"
                            value={lineupSelectionHours ? lineupSelectionHours : ""}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                        />
                    </div>

                    <div className="col-sm"  >
                        <InputWithHead
                            // conceptulHelp conceptulHelpMsg={AppConstants.reportMsg}
                            heading={AppConstants._minutes}
                            placeholder={AppConstants._minutes}
                            name="lineupSelectionMins"
                            value={lineupSelectionMins ? lineupSelectionMins : ""}
                            onChange={(e) => {
                                this.props.onChangeSettingForm({ key: e.target.name, data: e.target.value })
                            }}
                        />

                    </div>
                </div>}

                {/* Player borrowing view */}
                <InputWithHead heading={AppConstants.playerBorrowing} />
                <div className="row mt-0 ml-1" >
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => this.props.onChangeSettingForm({ key: "borrowedPlayer", data: e.target.value })}
                        value={borrowedPlayer}
                    >


                        <div className="row mt-0 ml-1">
                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                                <div >


                                    <Radio
                                        style={{ marginRight: 0, paddingRight: 0 }}
                                        value={'GAMES'}
                                    >{AppConstants.gamesBorrowed}</Radio>
                                </div>

                                {
                                    borrowedPlayer == 'GAMES' &&
                                    <div className='small-steper-style'>
                                        <InputNumber
                                            max={6}
                                            min={3}
                                            value={gamesBorrowedThreshold}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={(number) => this.props.onChangeSettingForm({ key: "number", data: number })}
                                            placeholder={'0'}
                                        />
                                    </div>
                                }

                            </div>

                            <div style={{ marginLeft: 40 }}>
                                <Radio
                                    style={{ marginRight: 0, paddingRight: 0 }}
                                    value={'MINUTES'}
                                >{AppConstants.minutesBorrowed}</Radio>

                            </div>
                        </div>
                    </Radio.Group>
                </div>

                <div style={{ marginTop: 20 }} >
                    <Checkbox style={{
                        display: "-ms-flexbox",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}
                        className="single-checkbox"
                        onChange={(e) => this.props.onChangeSettingForm({ key: "premierCompLink", data: e.target.checked })}
                        checked={premierCompLink}
                    >
                        {AppConstants.premierCompLink}
                    </Checkbox>

                    {
                        premierCompLink &&
                        <div style={{ marginTop: 15 }}>
                            <Select
                                showSearch
                                onChange={(compId) => this.props.onChangeSettingForm({ key: "linkedCompetitionId", data: compId })}
                                placeholder={"Search Competition"}
                                value={linkedCompetitionId ? linkedCompetitionId : undefined}
                                optionFilterProp="children"
                            >
                                {competition.map((item, index) => {
                                    return (
                                        <Option
                                            key={`longName` + index}
                                            value={item.id}>
                                            {item.longName}</Option>
                                    )
                                })}

                            </Select>
                        </div>
                    }

                </div>

                {/* radion button view */}
                {/* <span required={"required-field pb-0"} className="applicable-to-heading">{AppConstants.scoring}</span> */}
                <InputWithHead required={"required-field"} heading={AppConstants.scoring} />
                <div className='contextualHelp-RowDirection' >
                    <Form.Item>
                        {getFieldDecorator('scoring', {
                            rules: [{ required: true, message: ValidationConstants.scoringField }]
                        })(
                            <Radio.Group
                                className="reg-competition-radio"
                                onChange={e => this.competition_format(e)}
                                value={this.props.liveScoreSetting.form.scoring}
                            >
                                <div className="row ml-2" style={{ marginTop: 0 }} >

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Radio style={{ marginRight: 0, paddingRight: 0 }} value={"SINGLE"}>{AppConstants.single}</Radio>
                                        <div style={{ marginLeft: -10 }}>
                                            <Tooltip background='#ff8237'>
                                                <span>{AppConstants.singleScoringMsg}</span>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                                        <Radio style={{ marginRight: 0, paddingRight: 0 }} value={"50_50"}>{'50/50'} </Radio>
                                        <div style={{ marginLeft: -10 }}>
                                            <Tooltip background='#ff8237' >
                                                <span>{AppConstants.fiftyScoringMsg}</span>
                                            </Tooltip>
                                        </div>
                                    </div>

                                </div>
                            </Radio.Group>
                        )}
                    </Form.Item>
                </div>



                {/* timer view */}
                <InputWithHead conceptulHelp conceptulHelpMsg={AppConstants.timerMsg} required={"required-field"} heading={AppConstants.timer} />
                {/* <div className='contextualHelp-RowDirection' >

                    <span className='text-heading-large pt-5' >{AppConstants.timer}<span style={{ color: 'red' }}>{'*'}</span></span>
                    <div style={{ marginTop: 28 }}>
                        <Tooltip background='#ff8237'>
                            <span>{AppConstants.timerMsg}</span>
                        </Tooltip>
                    </div>
                </div> */}
                <div>
                    <Form.Item>
                        {getFieldDecorator('time', {
                            rules: [{ required: true, message: ValidationConstants.timerField }]
                        })(
                            <Select
                                placeholder={'Select Time'}
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={timer => this.props.onChangeSettingForm({ key: "timerType", data: timer })}
                                // value={"CENTRAL"}
                                // value={this.props.liveScoreSetting.form.timerType}
                                // defaultValue={this.props.liveScoreSetting.form.timerType}
                                // defaultValue={this.props.liveScoreSetting.form.timerType}
                                placeholder={"Select Time"}
                            >
                                <Option value={"CENTRAL"}>{'Central'}</Option>
                                <Option value={"PER_MATCH"}>{'Per Match'}</Option>
                                <Option value={"CENTRAL_WITH_MATCH_OVERRIDE"}>{'Central with Per Match Override '}</Option>

                            </Select>
                        )}
                    </Form.Item>
                </div>

                {/* Buzzer button view */}
                <InputWithHead conceptulHelp conceptulHelpMsg={AppConstants.buzzerMsg} marginTop={5} heading={AppConstants.buzzer} />
                <div className="row mt-0 ml-1" >

                    <Checkbox style={{
                        display: "-ms-flexbox",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}
                        className="single-checkbox"
                        onChange={(e) => this.props.onChangeSettingForm({ key: "buzzerEnabled", data: e.target.checked })}
                        checked={buzzerEnabled}
                    >
                        {AppConstants.buzzer}
                    </Checkbox>

                    <Checkbox
                        className="single-checkbox"
                        onChange={(e) => this.props.onChangeSettingForm({ key: "warningBuzzerEnabled", data: e.target.checked })}
                        checked={warningBuzzerEnabled}
                    >
                        {AppConstants.turnOff_30Second}
                    </Checkbox>
                </div>

                {this.state.isEdit == 'add' && this.regInviteesView()}
            </div>
        )
    };

    //// On change Invitees
    onInviteesChange(value) {
        this.props.onChangeSettingForm({ key: "anyOrgSelected", data: value })
        if (value == 7) {
            this.onInviteeSearch("", 3)
        }
        else if (value == 8) {
            this.onInviteeSearch("", 4)
        }
    }

    onInviteeSearch = (value, inviteesType) => {
        this.props.onInviteesSearchAction(value, inviteesType)
    }
    ////////reg invitees search view for any organisation
    associationSearchInvitee = () => {
        let detailsData = this.props.competitionFeesState
        let associationAffilites = detailsData.associationAffilites
        const { associationLeague } = this.props.liveScoreSetting
        return (
            < div className='col-sm ml-3'>
                <Select
                    mode="multiple"
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    onChange={associationAffilite => {
                        this.props.onChangeSettingForm({ key: "associationAffilite", data: associationAffilite })
                    }}
                    value={associationLeague}
                    placeholder={AppConstants.selectOrganisation}
                    filterOption={false}
                    onSearch={(value) => { this.onInviteeSearch(value, 3) }}
                    showSearch={true}
                    onBlur={() => this.onInviteeSearch("", 3)}
                >
                    {associationAffilites.map((item) => {
                        return (
                            <Option
                                key={item.id}
                                value={item.id}>
                                {item.name}</Option>
                        )
                    })}
                </Select>
            </div>
        )

    }

    ////////reg invitees search view for any organisation
    clubSearchInvitee = () => {
        let detailsData = this.props.competitionFeesState
        let clubAffilites = detailsData.clubAffilites
        const { clubSchool } = this.props.liveScoreSetting
        return (
            < div className='col-sm ml-3'>
                <Select
                    mode="multiple"
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    onChange={clubAffilite => {
                        this.props.onChangeSettingForm({ key: "clubAffilite", data: clubAffilite })
                    }}

                    value={clubSchool}
                    placeholder={AppConstants.selectOrganisation}
                    filterOption={false}
                    onSearch={(value) => { this.onInviteeSearch(value, 4) }}
                    onBlur={() => this.onInviteeSearch("", 4)}
                >
                    {clubAffilites.map((item) => {
                        return (
                            <Option
                                key={item.id}
                                value={item.id}>
                                {item.name}</Option>
                        )
                    })}
                </Select>
            </div>
        )
    }

    regInviteesView = () => {
        const { affiliateSelected, anyOrgSelected, otherSelected, nonSelected, affiliateNonSelected, anyOrgNonSelected, registrationInvitees, associationChecked, clubChecked } = this.props.liveScoreSetting
        let invitees = isArrayNotEmpty(registrationInvitees) ? registrationInvitees : [];
        return (
            <div >
                <div>
                    <Radio.Group
                        className="reg-competition-radio mt-5"
                        onChange={(e) => this.props.onChangeSettingForm({ key: "affiliateSelected", data: e.target.value })}
                        value={affiliateSelected}
                    >
                        {(invitees || []).map((item, index) =>
                            (
                                index == 0
                                &&
                                <div>
                                    {item.subReferences.length == 0 ?
                                        <Radio value={item.id}>{item.description}</Radio>
                                        : <div>
                                            <div class="applicable-to-heading invitees-main">{item.description}</div>
                                            {(item.subReferences).map((subItem, subIndex) => (
                                                subItem.id == 2
                                                    ?
                                                    <>
                                                        <div style={{ marginLeft: '20px' }}>
                                                            <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                        </div>


                                                    </>
                                                    :
                                                    <>
                                                        <div style={{ marginLeft: '20px' }}>
                                                            <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                        </div>



                                                        <div style={{ marginLeft: 20 }}>
                                                            <Radio.Group
                                                                onChange={(e) => this.props.onChangeSettingForm({ key: "affiliateNonSelected", data: e.target.value })}
                                                                value={affiliateNonSelected}
                                                            >
                                                                <Radio

                                                                    key={'none1'} value={'none1'}>{'None'}</Radio>
                                                            </Radio.Group>
                                                        </div>
                                                    </>

                                            ))}
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </Radio.Group>


                    <Radio.Group
                        className="reg-competition-radio mt-0"
                        onChange={(e) => this.onInviteesChange(e.target.value)}
                        value={anyOrgSelected}
                    >
                        {(invitees || []).map((item, index) =>
                            (
                                index == 1
                                &&
                                <div>
                                    {item.subReferences.length == 0 ?
                                        <Radio value={item.id}>{item.description}</Radio>
                                        : <div>
                                            <div class="applicable-to-heading invitees-main">{item.description}</div>
                                            {/* {(item.subReferences).map((subItem, subIndex) => (
                                                <div style={{ marginLeft: '20px' }}>
                                                    <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                    <Checkbox
                                                        className="single-checkbox"
                                                        checked={this.props.liveScoreSetting.checkBoxSelection}
                                                        onChange={e => this.props.onChangeSettingForm({ key: 'anyOrgCheckBox', data: e.target.checked, subItem: subItem })}
                                                    >
                                                        {subItem.description}
                                                    </Checkbox>

                                                    {this.affiliatesSearchInvitee(subItem, anyOrgSelected)}

                                                </div>


                                            ))} */}

                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                paddingLeft: 13
                                            }}>

                                                <Checkbox style={{ paddingLeft: 7, paddingTop: 8 }} checked={associationChecked} onChange={e => this.props.onChangeSettingForm({ key: 'associationChecked', data: e.target.checked })}>{item.subReferences[0].description}</Checkbox>

                                                {associationChecked && this.associationSearchInvitee()}

                                                <Checkbox style={{ paddingTop: 15, paddingLeft: associationChecked ? 5 : 0 }} checked={clubChecked} onChange={e => this.props.onChangeSettingForm({ key: 'clubChecked', data: e.target.checked })}>{item.subReferences[1].description}</Checkbox>

                                                {clubChecked && this.clubSearchInvitee()}


                                            </div>


                                            <div style={{ marginLeft: 20 }}>
                                                <Radio.Group
                                                    onChange={(e) => this.props.onChangeSettingForm({ key: "anyOrgNonSelected", data: e.target.value })}
                                                    value={anyOrgNonSelected}
                                                >
                                                    <Radio

                                                        key={'none2'} value={'none2'}>{'None'}</Radio>
                                                </Radio.Group>
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </Radio.Group>

                    <Radio.Group
                        className="reg-competition-radio mt-0"
                        onChange={(e) => this.props.onChangeSettingForm({ key: "otherSelected", data: e.target.value })}
                        value={otherSelected}
                    >
                        {(invitees || []).map((item, index) =>
                            (
                                index > 1
                                &&
                                <div>
                                    {item.subReferences ?

                                        <div>
                                            <div class="applicable-to-heading invitees-main">{item.description}</div>
                                            {(item.subReferences).map((subItem, subIndex) => (
                                                <div style={{ marginLeft: '20px' }}>
                                                    <Radio
                                                        onChange={(e) => this.props.onChangeSettingForm({ key: "none", data: e.target.value })}
                                                        key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                </div>
                                            ))}
                                        </div>


                                        :
                                        <Radio value={item.id}>{item.description}</Radio>
                                    }
                                </div>
                            ))
                        }
                    </Radio.Group>

                </div>

                {/* <div>
                    <Radio.Group
                        className="reg-competition-radio mt-5"
                        onChange={(e) => this.props.onChangeSettingForm({ key: "invitees", data: e.target.value })}
                    >
                        <div>
                            {subReferences.length == 0 ?
                                <Radio value={invitees_1.id}>{invitees_1.description}</Radio>
                                : <div>
                                    <div class="applicable-to-heading invitees-main">{invitees_1.description}</div>
                                    {(subReferences).map((subItem, subIndex) => (
                                        <div style={{ marginLeft: '20px' }}>
                                            <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </Radio.Group>
                </div> */}

            </div >
        );
    };


    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            {/* <div className="reg-add-save-button">
                                <Button type="cancel-button">{AppConstants.delete}</Button>
                            </div> */}
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                {/* <Button className="save-draft-text" type="save-draft-text">
                                    {AppConstants.saveAsDraft}
                                </Button> */}
                                <Button disabled={this.props.liveScoreSetting.loader} onClick={this.handleSubmit} htmlType='submit' className="publish-button" type="primary">
                                    {this.state.competitionTabKey == 6 ? AppConstants.publish : AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    };



    render() {
        const { getFieldDecorator } = this.props.form
        let local_Id = this.state.screenName === 'umpireDashboard' ? null : getLiveScoreCompetiton()
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={this.state.screenName === 'umpireDashboard' ? AppConstants.umpires : AppConstants.liveScores} menuName={this.state.screenName === 'umpireDashboard' ? AppConstants.umpires : AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                {local_Id &&
                    <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"18"} />
                }
                {
                    this.state.isEdit ?
                        <Loader visible={this.props.liveScoreSetting.editLoader} />
                        :
                        <Loader visible={this.props.liveScoreSetting.loader} />
                }
                <Layout>
                    {this.headerView()}
                    {/* <Content> */}
                    <Form autoComplete='off' onSubmit={this.handleSubmit} className="login-form">
                        {/* <Form onSubmit={this.checkSubmit} noValidate="novalidate" className="login-form"> */}
                        <div className="formView">{this.contentView(getFieldDecorator)}</div>
                    </Form>

                    <Footer>{this.footerView()}</Footer>
                </Layout>
            </div>
        );
    }
}
function mapStatetoProps(state) {
    return {
        liveScoreSetting: state.LiveScoreSetting,
        venueList: state.LiveScoreMatchState,
        appState: state.AppState,
        competitionFeesState: state.CompetitionFeesState,
        umpireCompetitionState: state.UmpireCompetitionState
    }
}
export default connect(mapStatetoProps, {
    clearLiveScoreSetting,
    getLiveScoreSettingInitiate,
    onChangeSettingForm,
    getCompetitionVenuesList,
    settingDataPostInititae,
    searchVenueList,
    clearFilter,
    onInviteesSearchAction,
    settingRegInvitees,
    umpireCompetitionListAction
})((Form.create()(LiveScoreSettingsView)));
