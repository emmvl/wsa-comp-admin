import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Layout,
    Breadcrumb,
    Input,
    Button,
    Table,
    Select,
    Checkbox,
    TimePicker,
    message,
    Form,

} from 'antd';
import moment from 'moment';
import CSVReader from 'react-csv-reader'
import Tooltip from 'react-png-tooltip'

import "./competition.css";
import InputWithHead from '../../customComponents/InputWithHead';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from "../../themes/appConstants";
import {
    updateVenuAndTimeDataAction, updateVenuListAction, refreshVenueFieldsAction,
    removeObjectAction, clearVenueDataAction
} from '../../store/actions/competitionModuleAction/venueTimeAction'
import { getYearAndCompetitionAction } from '../../store/actions/appAction'
import { getCommonRefData, addVenueAction, checkVenueDuplication } from '../../store/actions/commonAction/commonAction'
import { getAffiliatesListingAction } from '../../store/actions/userAction/userAction'
import history from '../../util/history'
import ValidationConstants from "../../themes/validationConstant";
import AppImages from '../../themes/appImages';
import { captializedString } from '../../util/helpers';
import PlacesAutocomplete from "./elements/PlaceAutoComplete";
import Loader from "../../customComponents/loader";
import {
    getOrganisationData
} from "../../util/sessionStorage"

const { Header, Footer, Content } = Layout;
const { Option } = Select;

const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header =>
        header
            .toLowerCase()
            .replace(/\W/g, '_')
}

class CompetitionVenueAndTimesAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveContraintLoad: false,
            firstTimeCompId: null,
            yearRefId: 1,
            screenNavigationKey: null,
            csvData: null,
            loading: false,
            screenHeader: "",
            hover: false,
            venueAddress: null,
            venueAddressError: '',
            courtColumns: [
                {
                    title: "Court Numbers",
                    dataIndex: "courtNumber",
                    key: "courtNumber",
                    render: (courtNumber, record, index) => (
                        <div style={{ textAlign: 'center' }}>
                            {courtNumber}
                        </div>
                    )
                },
                {
                    title: "Court Name",
                    dataIndex: "venueCourtName",
                    key: "venueCourtName",
                    render: (courtName, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        return (

                            <Form.Item>
                                {getFieldDecorator(`venueCourtName${index}`, {
                                    rules: [{ required: true, message: ValidationConstants.courtField[3] }],
                                })(
                                    <Input
                                        disabled={record.isDisabled}
                                        required={"required-field pt-0 pb-0"}
                                        className="input-inside-table-venue-court"
                                        onChange={(courtName) => this.props.updateVenuAndTimeDataAction(courtName.target.value, index, 'venueCourtName', 'courtData')}
                                        setFieldsValue={courtName}
                                        placeholder={'Court Name'}
                                    />
                                )}
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "Longitude",
                    dataIndex: "lat",
                    key: "lat",
                    // Sorter: true,
                    filterDropdown: true,
                    filterIcon: () => {
                        return (
                            <Tooltip placement="bottom" background='#ff8237'>
                                <span>{AppConstants.LatitudeMsg}</span>
                            </Tooltip>
                        );
                    },

                    render: (lat, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        // console.log(index, 'tooltipindex')
                        return (
                            // <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: index > 0 ? 0 : 150 }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                <Form.Item >
                                    {getFieldDecorator(`lat${index}`, {
                                        rules: [{ required: true, message: ValidationConstants.courtField[1] }],
                                    })(
                                        <Input
                                            className="input-inside-table-venue-court"
                                            onChange={(lat) => this.props.updateVenuAndTimeDataAction(lat.target.value, index, 'lat', 'courtData')}
                                            setFieldsValue={lat}
                                            placeholder={'Longitude'}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        )
                    }
                },
                {
                    title: "Latitude",
                    dataIndex: "lng",
                    key: "lng",
                    filterDropdown: true,
                    filterIcon: () => {
                        return (
                            <Tooltip placement="bottom" background='#ff8237'>
                                <span>{AppConstants.LatitudeMsg}</span>
                            </Tooltip>
                        );
                    },
                    render: (lng, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        return (
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                <Form.Item >
                                    {getFieldDecorator(`lng${index}`, {
                                        rules: [{ required: true, message: ValidationConstants.courtField[2] }],
                                    })(
                                        <Input className="input-inside-table-venue-court"
                                            onChange={(lng) => this.props.updateVenuAndTimeDataAction(lng.target.value, index, 'lng', 'courtData')}
                                            setFieldsValue={lng}
                                            placeholder={'Latitude'}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        )
                    }
                },
                {
                    // title: "Override Venue Timeslots?",
                    title: <span >Override Venue Timeslots?</span>,
                    dataIndex: "overideSlot",
                    key: "overideSlot",
                    width: "22%",
                    filterDropdown: true,
                    filterIcon: () => {
                        return (

                            <Tooltip placement="bottom" background='#ff8237'>
                                {AppConstants.overRideSlotMsg}
                            </Tooltip>

                        );
                    },
                    render: (overideSlot, record, index) => (
                        // <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                        <Checkbox
                            className="single-checkbox mt-1 d-flex justify-content-center"
                            defaultChecked={overideSlot}
                            onChange={e => this.overideVenueslotOnchange(e, index)}
                        ></Checkbox>
                        // </div>
                    )
                },
                {
                    title: "",
                    dataIndex: "clear",
                    key: "clear",
                    render: (clear, record, index) => (
                        <span style={{ display: "flex", justifyContent: "center", width: "100%", cursor: 'pointer' }}>
                            <img
                                className="dot-image"
                                src={AppImages.redCross}
                                alt=""
                                width="16"
                                height="16"
                                onClick={() => this.removeTableObj(clear, record, index)}
                            />
                        </span>
                    )
                }
            ]

        };
        this.myRef = React.createRef()
        this.props.getCommonRefData()
        const organisationData = getOrganisationData();
        this.props.getAffiliatesListingAction({
            organisationId: organisationData.organisationUniqueKey,
            affiliatedToOrgId: -1,
            organisationTypeRefId: -1,
            statusRefId: -1,
            paging: { limit: -1, offset: 0 },
            stateOrganisations: true,
          });

    }



    removeTableObj(clear, record, index) {
        this.props.updateVenuAndTimeDataAction("", index, "remove")
    }

    overideVenueslotOnchange(e, index) {
        this.props.updateVenuAndTimeDataAction(e.target.checked, index, 'overideSlot')
    }
    componentDidMount() {
        window.scroll(0, 0);
        // this.myRef.current.scrollTo(0, 0);
        let screenNavigationKey = this.props.location.state ? this.props.location.state.key : '';
        this.setState({
            screenNavigationKey: screenNavigationKey
        })
        this.setHeaderValue(screenNavigationKey);
        this.props.checkVenueDuplication();
    }

    setHeaderValue = (screenNavigationKey) => {

        if (screenNavigationKey === AppConstants.venues)
            this.setState({ screenHeader: AppConstants.competitions });
        else if ((screenNavigationKey === AppConstants.competitionFees) ||
            (screenNavigationKey === AppConstants.competitionDetails) ||
            (screenNavigationKey === AppConstants.dashboard))
            this.setState({ screenHeader: AppConstants.registration });
        else if (screenNavigationKey === AppConstants.venuesList)
            this.setState({ screenHeader: AppConstants.user });

    }

    componentDidUpdate(nextProps) {
        if (this.state.saveContraintLoad === true && this.props.commonReducerState.onVenueDataLoad === false) {
            this.navigateTo();
        }

        if (nextProps.venueTimeState !== this.props.venueTimeState) {
            if (this.state.csvData != null) {
                this.setState({ csvData: null, loading: false });
                this.setFormFieldValue();
            }
        }
    }

    setFormFieldValue = () => {

        let venueData = this.props.venueTimeState.venuData;
        // console.log("setFormFieldValue" + JSON.stringify(venueData));
        // this.props.form.setFieldsValue({
        //     name: venueData.venueName,
        //     addressOne: venueData.street1,
        //     suburb: venueData.suburb,
        //     stateRefId: venueData.stateRefId,
        //     postcode: venueData.postalCode
        // });

        venueData.venueCourts.map((item, index) => {
            this.props.form.setFieldsValue({
                [`venueCourtName${index}`]: item.venueCourtName,
                [`lat${index}`]: item.lat,
                [`lng${index}`]: item.lng,
            });
        });
    }

    readVenueCourtCSV = (data) => {
        this.setState({ csvData: data, loading: true });
        this.props.updateVenuAndTimeDataAction(data, "addGameAndCourtThroughCSV", 'venueCourts');
        let e = document.getElementById("venueCourtUpload");
        e.value = null;
    };

    navigateTo = () => {
        if (this.state.screenNavigationKey == AppConstants.venues) {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                history.push('/competitionVenueTimesPrioritisation', 'fromAddVenue')
            }, 800);
            this.setState({ saveContraintLoad: false })
        }
        else if (this.state.screenNavigationKey == AppConstants.competitionFees) {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                // history.push('/registrationCompetitionFee')
                history.push('/registrationCompetitionFee', { venueScreen: true, id: this.props.location.state ? this.props.location.state.id : null })
            }, 800);
            this.setState({ saveContraintLoad: false })
        }
        else if (this.state.screenNavigationKey == AppConstants.competitionDetails) {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                history.push('/competitionOpenRegForm')
            }, 800);
            this.setState({ saveContraintLoad: false })
        }
        else if (this.state.screenNavigationKey == AppConstants.dashboard) {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                history.push('/registrationCompetitionForm', { venueScreen: true, id: this.props.location.state ? this.props.location.state.id : null })
            }, 800);
            this.setState({ saveContraintLoad: false })
        }
        else if (this.state.screenNavigationKey == AppConstants.venuesList) {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                history.push('/venuesList')
            }, 800);
            this.setState({ saveContraintLoad: false })
        }
        else {
            setTimeout(() => {
                this.props.clearVenueDataAction("venue");
                history.push('/')
            }, 800);
            this.setState({ saveContraintLoad: false })
        }
    }

    getDisabledHours = (startTime) => {
        var hours = [];
        let startHour = startTime.split(':')[0];
        for (var i = 0; i < Number(startHour); i++) {
            hours.push(i);
        }
        return hours;
    }

    getDisabledMinutes = (selectedHour, startTime) => {
        // console.log("&&&&&&&&&&&" + startTime);
        // console.log("selectedHour::" + startTime.split(":")[0]);
        // console.log("Current Minute::" + startTime.split(":")[1]);
        // console.log("*****selectedHour:::" + selectedHour);
        let hour = Number(startTime.split(":")[0]);
        let min = Number(startTime.split(":")[1]);
        var minutes = [];
        if (selectedHour === hour) {
            for (var i = 0; i <= min; i++) {
                minutes.push(i);
            }
        }
        if (selectedHour < hour) {
            for (var i = 0; i <= 60; i++) {
                minutes.push(i);
            }
        }
        return minutes;

    }

    validateTime = (rule, value, callback, startTime, endTime, type) => {
        //console.log("StartTime" + startTime + "EndTime::" + endTime + "Type::" + type);
        if (type == "end") {
            if (startTime > endTime) {
                callback('End time should be greater than start time');
                return;
            }

        }
        callback();
    }

    onChangeGameTimePicker = (time, value, index, key1, key2) => {
        if (time != null)
            this.props.updateVenuAndTimeDataAction(time.format("HH:mm"), index, key1, key2)
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view">
                <div className="row">
                    <div
                        className="col-sm"
                        style={{ display: "flex", alignContent: "center" }}
                    >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.venueAndTimes}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        );
    };

    handlePlacesAutocomplete = (data) => {
        const { stateList } = this.props.commonReducerState;
        const address = data;
        this.props.checkVenueDuplication(address);

        if (!address.addressOne && !address.suburb) {
            this.setState({
                venueAddressError: ValidationConstants.venueAddressDetailsError,
            })
        }
        else {
            this.setState({
                venueAddressError: ''
            })
        }

        this.setState({
            venueAddress: address,
        });

        const stateRefId = stateList.length > 0 && address.state
            ? stateList.find((state) => state.name === address.state).id
            : null;

        this.props.form.setFieldsValue({
            stateRefId,
            addressOne: address.addressOne || null,
            suburb: address.suburb || null,
            postcode: address.postcode || null,
        });

        if (address.addressOne) {
            this.props.updateVenuAndTimeDataAction(stateRefId, 'Venue', 'stateRefId');
            this.props.updateVenuAndTimeDataAction(address.addressOne, 'Venue', 'street1');
            this.props.updateVenuAndTimeDataAction(address.suburb, 'Venue', 'suburb');
            this.props.updateVenuAndTimeDataAction(address.postcode, 'Venue', 'postalCode');
            this.props.updateVenuAndTimeDataAction(address.lat, 'Venue', 'lat');
            this.props.updateVenuAndTimeDataAction(address.lng, 'Venue', 'lng');
        }
    };

    onChangeLinkToAffiliate = (affiliateData) => {
        this.props.updateVenuAndTimeDataAction(affiliateData, 'organisations', 'organisations')
    }
    ////////form content view
    contentView = (getFieldDecorator) => {
        const { venuData } = this.props.venueTimeState
        const { stateList } = this.props.commonReducerState
        const { affiliateList } = this.props.userState
        return (
            <div className="content-view">
                <span className="form-heading" >
                    {AppConstants.venue}
                </span>
                <Form.Item >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: ValidationConstants.nameField[2] }],
                    })(
                        <InputWithHead
                            auto_complete="off"
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.name}
                            placeholder={AppConstants.name}
                            onChange={(name) => this.props.updateVenuAndTimeDataAction(captializedString(name.target.value), 'Venue', 'name')}
                            setFieldsValue={venuData.name}
                            onBlur={(i) => this.props.form.setFieldsValue({
                                'name': captializedString(i.target.value)
                            })}
                        />
                    )}
                </Form.Item>
                <Form.Item className='formLineHeight'>
                    {getFieldDecorator('shortName', {
                        rules: [{ required: true, message: ValidationConstants.nameField[3] }],
                    })(
                        <InputWithHead
                            auto_complete="new-shortName"
                            required={"required-field"}
                            heading={AppConstants.short_Name}
                            disabled={this.state.isUsed}
                            placeholder={AppConstants.short_Name}
                            maxLength={4}
                            onChange={(name) => this.props.updateVenuAndTimeDataAction(captializedString(name.target.value), 'Venue', 'shortName')}
                            setFieldsValue={venuData.shortName}
                            onBlur={(i) => this.props.form.setFieldsValue({
                                'shortName': captializedString(i.target.value)
                            })}
                        />
                    )}
                </Form.Item>
                <Form.Item className='formLineHeight' name="venueAddress">
                    <PlacesAutocomplete
                        heading={AppConstants.venueSearch}
                        required
                        error={this.state.venueAddressError}
                        onBlur={() => {
                            this.setState({
                                venueAddressError: ''
                            })
                        }}
                        onSetData={this.handlePlacesAutocomplete}
                    />
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator('addressOne')(
                        <InputWithHead
                            auto_complete="new-addressOne"
                            required={"required-field pt-3 pb-0"}
                            heading={AppConstants.addressOne}
                            placeholder={AppConstants.addressOne}
                            setFieldsValue={venuData.street1}
                            readOnly
                        />
                    )}
                </Form.Item>


                <InputWithHead
                    auto_complete="new-addressTwo"
                    heading={AppConstants.addressTwo}
                    placeholder={AppConstants.addressTwo}
                    onChange={(street2) => this.props.updateVenuAndTimeDataAction(street2.target.value, 'Venue', 'street2')}
                    value={venuData.street2}
                />


                <Form.Item  >
                    {getFieldDecorator('suburb')(
                        <InputWithHead
                            auto_complete="new-suburb"
                            required={"required-field pt-3 pb-0"}
                            heading={AppConstants.suburb}
                            placeholder={AppConstants.suburb}
                            setFieldsValue={venuData.suburb}
                            readOnly
                        />
                    )}
                </Form.Item>

                <InputWithHead
                    required={"required-field"}
                    heading={AppConstants.stateHeading}
                />

                <Form.Item >
                    {getFieldDecorator('stateRefId')(
                        <Select
                            style={{ width: "100%" }}
                            placeholder={AppConstants.select}
                            setFieldsValue={venuData.stateRefId}
                            disabled
                        >
                            {stateList.length > 0 && stateList.map((item) => (
                                < Option key={item.id} value={item.id}> {item.name}</Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>


                <Form.Item className="formLineHeight" >
                    {getFieldDecorator('postcode')(
                        <InputWithHead
                            auto_complete="new-postcode"
                            required={"required-field"}
                            heading={AppConstants.postcode}
                            placeholder={AppConstants.postcode}
                            setFieldsValue={venuData.postalCode}
                            maxLength={4}
                            readOnly
                        />
                    )}
                </Form.Item>

                <InputWithHead
                    auto_complete="new-contact"
                    heading={AppConstants.contactNumber}
                    placeholder={AppConstants.contactNumber}
                    onChange={(contactNumber) => this.props.updateVenuAndTimeDataAction(contactNumber.target.value, 'Venue', 'contactNumber')}
                    value={venuData.contactNumber}
                />

                <div className="fluid-width" style={{ marginTop: 25 }}>
                    <div className="row">
                        <div className="col-sm">
                            <Checkbox
                                className="single-checkbox"
                                defaultChecked={false}
                                onChange={e => this.props.updateVenuAndTimeDataAction(e.target.checked, 'Venue', 'affiliate')}
                            >
                                {AppConstants.linkToHomeAffiliate}
                            </Checkbox>
                        </div>
                        {venuData.affiliate && (
                            <div className="col-sm">
                                <Select
                                    mode="multiple"
                                    showSearch
                                    style={{ width: "100%" }}
                                    onChange={(affiliateData) => this.onChangeLinkToAffiliate(affiliateData)}
                                    placeholder={'Select'}
                                    optionFilterProp="children"
                                >
                                    {affiliateList.length > 0 && affiliateList.map((item, index) => (
                                        < Option key={item.id} value={item.id}> {item.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    gameData(item, index, getFieldDecorator) {
        const { daysList } = this.props.commonReducerState
        return (
            <div className="row" key={"gameDay" + index}>
                <div className="col-sm">
                    <InputWithHead heading={AppConstants.dayOfTheWeek} />
                    <Select
                        // className="year-select"
                        style={{ width: "100%" }}
                        onChange={(dayOfTheWeek) => this.props.updateVenuAndTimeDataAction(dayOfTheWeek, index, 'dayRefId', 'gameTimeslot')}
                        value={item.dayRefId}
                        placeholder={'Select Week Day'}
                    >
                        {daysList.length > 0 && daysList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.description}</Option>
                        ))
                        }
                    </Select>

                </div>
                <div className="col-sm">
                    <InputWithHead heading={AppConstants.startTime} />
                    {/* <Form.Item >
                            {getFieldDecorator(`gstartTime${index}`, {
                               validateTrigger: "onChange",
                                rules: [{ required: true, message: ValidationConstants.courtField[6] },
                                {validator: (rule, value, callback) => this.validateTime(rule, value, callback, item.startTime, item.endTime, 'start')}],
                            })( */}
                    <TimePicker
                        key={"startTime"}
                        className="comp-venue-time-timepicker"
                        style={{ width: "100%" }}
                        onChange={(time) => time !== null && this.onChangeGameTimePicker(time, time.format("HH:mm"), index, 'startTime', "gameTimeslot")}
                        value={moment(item.startTime, "HH:mm")}
                        format={"HH:mm "}
                        // minuteStep={15}
                        use12Hours={false}
                    />
                    {/* )}
                    </Form.Item> */}
                </div>
                <div className="col-sm">
                    <InputWithHead heading={AppConstants.endTime} />
                    {/* <Form.Item >
                            {getFieldDecorator(`gendTime${index}`, {
                               validateTrigger: "onChange",
                                rules: [{ required: true, message: ValidationConstants.courtField[6] },
                                {validator: (rule, value, callback) => this.validateTime(rule, value, callback, item.startTime, item.endTime, 'end')}],
                            })( */}
                    <TimePicker
                        key={"endTime"}
                        disabledHours={() => this.getDisabledHours(item.startTime)}
                        disabledMinutes={(e) => this.getDisabledMinutes(e, item.startTime)}
                        className="comp-venue-time-timepicker"
                        style={{ width: "100%" }}
                        onChange={(time) => time !== null && this.onChangeGameTimePicker(time, time.format("HH:mm"), index, 'endTime', "gameTimeslot")}
                        value={moment(item.endTime, "HH:mm")}
                        format={"HH:mm "}
                        // minuteStep={15}
                        use12Hours={false}
                    />
                    {/* )}
                    </Form.Item> */}
                </div>
                <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.props.removeObjectAction(index, item, 'gameTimeslot')}>
                    <span className="user-remove-btn">
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </span>
                    <span style={{ cursor: 'pointer' }} className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                </div>
            </div>
        )
    }

    handleMouseIn() {
        this.setState({ hover: true })
    }

    handleMouseOut() {
        this.setState({ hover: false })
    }

    ///game day view
    gameDayView = (getFieldDecorator) => {
        const { gameDays } = this.props.venueTimeState.venuData
        return (
            <div className="fees-view pt-5">
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                    <span className="form-heading">
                        {AppConstants.game_Days}
                        <span className="required-field" style={{ fontSize: "14px" }}></span>
                    </span>

                    <div style={{ marginTop: -15, }}>
                        <Tooltip background='#ff8237'>
                            {AppConstants.gameDayMsg}
                        </Tooltip>
                    </div>

                </div>

                <div className="fluid-width">
                    {/* {this.gameData()} */}
                    {gameDays.map((item, index) => {
                        return this.gameData(item, index, getFieldDecorator)
                    })}
                </div>
                <span style={{ cursor: 'pointer' }} onClick={() => this.props.updateVenuAndTimeDataAction(null, "addGameAndCourt", 'gameDays')} className="input-heading-add-another">
                    + {AppConstants.addDay}
                </span>
            </div>
        );
    };

    expendedRowData(item, index, tableIndex, getFieldDecorator) {
        const { daysList } = this.props.commonReducerState
        return (
            <div className="row" key={"available" + index}>
                <div className="col-sm">
                    <InputWithHead required={"pt-1"} heading={AppConstants.dayOfTheWeek} />
                    <Select
                        style={{ width: "100%" }}
                        onChange={(dayOfTheWeek) => this.props.updateVenuAndTimeDataAction(dayOfTheWeek, index, 'dayRefId', 'addTimeSlotField', tableIndex)}
                        value={item.dayRefId}
                        placeholder={'Select Week Day'}
                    >
                        {daysList.length > 0 && daysList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.description}</Option>
                        ))
                        }
                    </Select>
                </div>
                <div className="col-sm">
                    <InputWithHead required={"pt-1"} heading={AppConstants.startTime} />
                    {/* <Form.Item >
                            {getFieldDecorator(`startTime${index}${tableIndex}`, {
                               validateTrigger: "onChange",
                                rules: [{ required: true, message: ValidationConstants.courtField[6] },
                                {validator: (rule, value, callback) => this.validateTime(rule, value, callback, item.startTime, item.endTime, 'start')}],
                            })( */}
                    <TimePicker
                        className="comp-venue-time-timepicker"
                        style={{ width: "100%" }}
                        onChange={(time) => time !== null && this.props.updateVenuAndTimeDataAction(time.format("HH:mm"), index, 'startTime', "addTimeSlotField", tableIndex)}
                        value={moment(item.startTime, "HH:mm")}
                        format={"HH:mm "}
                        // minuteStep={15}
                        use12Hours={false}
                    />
                    {/* )}
                        </Form.Item> */}
                </div>
                <div className="col-sm">
                    <InputWithHead required={"pt-1"} heading={AppConstants.endTime} />
                    {/* <Form.Item >
                        {getFieldDecorator(`endTime${index}${tableIndex}`, {
                           validateTrigger: "onChange",
                            rules: [{ required: true, message: ValidationConstants.courtField[7] },
                            {validator: (rule, value, callback) => this.validateTime(rule, value, callback, item.startTime, item.endTime, 'end')}],
                        })( */}
                    <TimePicker
                        className="comp-venue-time-timepicker"
                        style={{ width: "100%" }}
                        disabledHours={() => this.getDisabledHours(item.startTime)}
                        disabledMinutes={(e) => this.getDisabledMinutes(e, item.startTime)}
                        onChange={(time) => time !== null && this.props.updateVenuAndTimeDataAction(time.format("HH:mm"), index, 'endTime', "addTimeSlotField", tableIndex)}
                        value={moment(item.endTime, "HH:mm")}
                        format={"HH:mm "}
                        // minuteStep={15}
                        use12Hours={false}
                    />
                    {/* )}
                    </Form.Item> */}
                </div>
                <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.props.updateVenuAndTimeDataAction(null, index, 'removeButton', 'add_TimeSlot', tableIndex)}>
                    <span className="user-remove-btn">
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </span>
                    <span style={{ cursor: 'pointer' }} className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                </div>
            </div>
        )
    }

    expandedRowView = (item, tableIndex, getFieldDecorator) => {

        return (
            <div className="comp-expanded-row-view inside-container-view mt-2">
                {item.availabilities.map((item, index) => {
                    return this.expendedRowData(item, index, tableIndex, getFieldDecorator)
                })}
                {/* {this.gameData(item, index)} */}
                <span style={{ cursor: 'pointer' }} onClick={() => this.props.updateVenuAndTimeDataAction(null, tableIndex, 'availabilities', 'add_TimeSlot')} className="input-heading-add-another pt-3">
                    + {AppConstants.add_TimeSlot}
                </span>
            </div>
        )
    }

    //////court day view
    courtView = (getFieldDecorator) => {
        let venueCourts = [...this.props.venueTimeState.venuData.venueCourts];
        //console.log("venueCourts" + JSON.stringify(venueCourts));
        return (
            <div className="fees-view pt-5">
                <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                        <span className="form-heading">
                            {AppConstants.courts} <span className="required-field" style={{ fontSize: "14px", paddingTop: '5px' }}></span>
                        </span>
                        <div style={{ marginTop: -15, }}>
                            <Tooltip background='#ff8237'>
                                {AppConstants.courtsMsg}
                            </Tooltip>
                        </div>
                    </div>
                    <Button className="primary-add-comp-form" type="primary" style={{ marginLeft: 'auto' }}>
                        <div className="row">
                            <div className="col-sm">
                                <label for="venueCourtUpload" className="csv-reader">
                                    <img src={AppImages.import} alt="" className="export-image" />
                                    {AppConstants.import}
                                </label>
                                <CSVReader
                                    inputId="venueCourtUpload"
                                    inputStyle={{ display: 'none' }}
                                    parserOptions={papaparseOptions}
                                    onFileLoaded={(e) => this.readVenueCourtCSV(e)} />
                            </div>
                        </div>
                    </Button>
                </div>

                <div className="inside-container-view">
                    <div className="contextual-table-responsive content-responsive">
                        <Table
                            className="fees-table"
                            columns={this.state.courtColumns}
                            dataSource={venueCourts}
                            pagination={false}
                            Divider=" false"
                            expandedRowKeys={this.props.venueTimeState.venuData.expandedRowKeys}
                            expandedRowRender={(record, index) => this.expandedRowView(record, index, getFieldDecorator)}
                            expandIconAsCell={false}
                            expandIconColumnIndex={-1}
                            loading={this.state.loading == true && true}
                        />
                    </div>
                    <span style={{ cursor: 'pointer' }} onClick={() => this.props.updateVenuAndTimeDataAction(null, "addGameAndCourt", 'venueCourts')} className="input-heading-add-another">
                        + {AppConstants.addCourt}
                    </span>
                </div>
            </div>
        );
    };

    onAddVenue = (e) => {
        e.preventDefault();
        let hasError = false;
        let venueAddressError = false;

        if (this.props.commonReducerState.venueAddressDuplication) {
            message.error(ValidationConstants.duplicatedVenueAddressError);
            return;
        }

        if (!this.state.venueAddress) {
            this.setState({ venueAddressError: ValidationConstants.venueAddressRequiredError });
            message.error(AppConstants.venueAddressSelect);
            venueAddressError = true;
        }

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { venuData } = this.props.venueTimeState
                message.config({
                    duration: 3.5,
                    maxCount: 1,
                });
                if (venuData.venueCourts.length == 0) {
                    message.error(ValidationConstants.emptyAddCourtValidation);
                }
                if (venuData.gameDays.length == 0) {
                    message.error(ValidationConstants.emptyGameDaysValidation);
                }
                else {

                    if (venuData.venueCourts.length == 0) {
                        message.error(ValidationConstants.emptyAddCourtValidation);
                        return;
                    }

                    venuData.venueCourts.map((item, index) => {
                        (item.availabilities || []).map((avItem, avIndex) => {
                            if (avItem.startTime > avItem.endTime) {
                                hasError = true;
                            }
                        })
                    });

                    if (hasError) {
                        message.error(ValidationConstants.venueCourtEndTimeValidation);
                        return;
                    }

                    venuData.gameDays.map((item, index) => {
                        if (item.startTime > item.endTime) {
                            hasError = true;
                            // break;
                        }
                    });

                    if (hasError) {
                        message.error(ValidationConstants.gameDayEndTimeValidation);
                        return;
                    }

                    if (venueAddressError) {
                        message.error(AppConstants.venueAddressSelect);
                        return;
                    }

                    if (!hasError) {
                        venuData["screenNavigationKey"] = this.state.screenNavigationKey;
                        //console.log("venuData" + JSON.stringify(venuData));
                        this.props.addVenueAction(venuData)
                        this.setState({ saveContraintLoad: true });
                    }
                }
            }
        })

    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                {/* <Button onClick={() => this.props.addVenueAction(venuData)} className="open-reg-button" type="primary"> */}
                                <Button className="publish-button" type="primary" style={{ marginRight: '20px' }}
                                    onClick={() => this.navigateTo()}>
                                    {AppConstants.cancel}
                                </Button>
                                <Button className="publish-button" type="primary" htmlType="submit">
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        // console.log(this.props.venueTimeState.venuData, 'this.props.commonReducerState')
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <Loader visible={this.props.commonReducerState.onLoad || this.props.venueTimeState.onLoad} />
                <DashboardLayout
                    menuHeading={this.state.screenHeader}
                    menuName={this.state.screenHeader}
                />
                {/* <InnerHorizontalMenu menu={"competition"} compSelectedKey={"7"} /> */}
                <Layout>
                    {this.headerView()}
                    <Form
                        autocomplete="off"
                        onSubmit={this.onAddVenue}
                        noValidate="noValidate">
                        <Content>
                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
                            <div className="formView">{this.gameDayView(getFieldDecorator)}</div>
                            <div className="formView">{this.courtView(getFieldDecorator)}</div>
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateVenuAndTimeDataAction,
        getYearAndCompetitionAction,
        updateVenuListAction,
        getCommonRefData,
        addVenueAction,
        refreshVenueFieldsAction,
        getAffiliatesListingAction,
        removeObjectAction,
        clearVenueDataAction,
        checkVenueDuplication,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        venueTimeState: state.VenueTimeState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState,
        userState: state.UserState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionVenueAndTimesAdd));

