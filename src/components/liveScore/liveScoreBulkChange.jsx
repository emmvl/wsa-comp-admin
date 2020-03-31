import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    DatePicker,
    TimePicker,
    Form,
    message
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import './liveScore.css';
import moment from "moment";
import ValidationConstants from '../../themes/validationConstant'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formateTime, liveScore_formateDate, formatDateTime } from '../../themes/dateformate'
import {
    BulkMatchPushBackAction,
    liveScoreBringForwardAction,
    liveScoreEndMatchesdAction,
    liveScoreBulkMatchAction,
    liveScoreUpdateBulkAction,
    liveScoreDoubleHeaderAction,
    liveScoreAbandonMatchAction,
    matchResult,
} from '../../store/actions/LiveScoreAction/liveScoreBulkMatchAction';
import { getCompetitonVenuesList, } from '../../store/actions/LiveScoreAction/liveScoreMatchAction'
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'
import Loader from '../../customComponents/loader'
import history from '../../util/history'
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { isArrayNotEmpty } from "../../util/helpers";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class LiveScoreBulkChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.props.matchResult()
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.props.liveScoreBulkMatchAction()
        if (id !== null) {
            this.props.getCompetitonVenuesList(id);
            this.props.getliveScoreDivisions(id)
        } else {
            history.push('/')
        }

    }

    componentDidUpdate() {
        if (this.state.loading == true && this.props.liveScoreBulkMatchState.onLoad == false) {
            this.props.liveScoreUpdateBulkAction(AppConstants.slectOption, 'refreshPage')
            this.setInitalFiledValue()
            this.setState({ loading: false })
        }
    }

    setInitalFiledValue() {
        const { selectedOption } = this.props.liveScoreBulkMatchState
        this.props.form.setFieldsValue({
            'optionData': selectedOption,
        })
    }

    ///////view for breadcrumb
    headerView = () => {
        let isEdit = this.props.location.state ? this.props.location.state.isEdit : null
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
                            {isEdit == true ? AppConstants.editNews : AppConstants.bulkMatchChange}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };


    // initial view
    inital_screen = (getFieldDecorator) => {
        let { venueData, selected_Option } = this.props.liveScoreBulkMatchState
        return (
            <div>
                {/* date picker row */}
                <span className='bulk-match-heading mt-5 mb-0' >{AppConstants.whichMatchChange}</span>
                <div >
                    <InputWithHead heading={AppConstants.matchOnDate}
                        required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator("changeMatchDate", {
                            rules: [{ required: true, message: ValidationConstants.dateField }],
                        })(
                            <DatePicker
                                size="large"
                                style={{ width: "100%" }}
                                onChange={date => this.setState(date)}
                                format={"DD-MM-YYYY"}
                                showTime={false}
                                name={'registrationOepn'}
                            />
                        )}
                    </Form.Item>
                </div>

                {/* time picker row */}
                <InputWithHead heading={AppConstants.forTimeRange} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <TimePicker
                                className="comp-venue-time-timepicker"
                                style={{ width: "100%" }}
                                defaultOpenValue={moment("00:00", "hh:mm A")}
                                defaultValue={moment()}
                                format={"hh:mm A"}
                                minuteStep={15}
                                use12Hours={true}

                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <TimePicker
                                className="comp-venue-time-timepicker"
                                style={{ width: "100%" }}
                                defaultOpenValue={moment("00:00", "hh:mm A")}
                                defaultValue={moment()}
                                format={"hh:mm A"}
                                minuteStep={15}
                                use12Hours={true}

                            />
                        </div>
                    </div>
                </div>

                {/* drop down venue view */}
                <InputWithHead heading={AppConstants.byVenue} />
                <div>
                    <InputWithHead heading={AppConstants.matchOnDate}
                        required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator("changeMatchVenue", {
                            rules: [{ required: true, message: ValidationConstants.venueField }],
                        })(
                            <Select

                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={venueSelection => this.setState({ venueSelection })}
                                placeholder={AppConstants.selectVenue}
                                className="reg-form-multple-select"
                                // onChange={(venueId) => this.props.liveScoreUpdateMatchAction(venueId, "venueId")}
                                onChange={(venueId) => this.props.liveScoreUpdateBulkAction(venueId, "venueId")}
                                value={selected_Option.venueId}
                            >

                                {venueData && venueData.map((item) => {
                                    return (
                                        <Option key={'venue' + item.id}
                                            value={item.venueId}>
                                            {item.venueName}

                                        </Option>
                                    )
                                })}
                            </Select>
                        )}
                    </Form.Item>
                </div>
            </div>
        )
    }

    initialPageView = (getFieldDecorator) => {
        const { selectedOption } = this.props.liveScoreBulkMatchState
        return (
            <div>
                <Form.Item>
                    {getFieldDecorator("optionData", {
                        rules: [{ required: true, message: ValidationConstants.pleaseSelect }],
                    })(
                        <Select
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(selectedOption) => this.props.liveScoreUpdateBulkAction(selectedOption, "selectedOption")}
                            value={selectedOption}
                            placeholder={AppConstants.slectOption}
                        >
                            <Option value={"pushBack"}>{'Push Back'}</Option>
                            <Option value={"bringForward"}>{'Bring Forward'}</Option>
                            <Option value={"abandonMatch"}>{'Abandon Matches'}</Option>
                            <Option value={"endMatch"}>{'End Matches'}</Option>
                            <Option value={"doubleHeader"}>{'Double Header'}</Option>
                        </Select>
                    )}
                </Form.Item>
            </div>
        )
    }


    ////////form content view
    contentView = (getFieldDecorator) => {
        const { selectedOption } = this.props.liveScoreBulkMatchState
        return (
            <div className="content-view pt-4">
                <span className='bulk-match-heading' >{AppConstants.whatDoWantDO}</span>
                {this.initialPageView(getFieldDecorator)}
                {selectedOption == 'pushBack' && this.pushBackView(getFieldDecorator)}
                {selectedOption == 'endMatch' && this.endMatchedView(getFieldDecorator)}
                {selectedOption == 'doubleHeader' && this.doublwHeaderView(getFieldDecorator)}
                {selectedOption == 'bringForward' && this.bringForwardView(getFieldDecorator)}
                {selectedOption == 'abandonMatch' && this.abandondMatchesView(getFieldDecorator)}
            </div>
        );
    };

    onVenueSelection(venue, key) {
        this.props.liveScoreUpdateBulkAction(venue, key)
        this.props.form.setFieldsValue({
            'pushBackCourt': [],
            "bringCourt": [],
            "bringCourtId": [],
            "abandonCourtId": []
        })
    }



    ////this method called after slecting Push Back option from drop down
    pushBackView(getFieldDecorator) {
        const { pushBackData, venueData, pushCourtData } = this.props.liveScoreBulkMatchState
        return (
            <div>
                {/* start time date and time picker row */}
                <span className='bulk-match-heading mt-5 mb-0' >{AppConstants.changeMatchCriteria}</span>
                <InputWithHead heading={AppConstants.startTime}
                    required={"required-field"} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("startDate", {
                                    rules: [{ required: true, message: ValidationConstants.dateField }],
                                })(
                                    <DatePicker
                                        size="large"
                                        style={{ width: "100%" }}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        // onChange={(date) => this.props.liveScoreUpdateBulkAction(moment(date).format('YYYY-MM-DD'), "startDate")}
                                        onChange={(date) => this.props.liveScoreUpdateBulkAction(date, "startDate")}
                                        value={pushBackData.startDate}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("startTime", {
                                    rules: [{ required: true, message: ValidationConstants.timeField }],
                                })(
                                    <TimePicker
                                        className="comp-venue-time-timepicker"
                                        style={{ width: "100%" }}
                                        defaultOpenValue={moment("00:00", "HH:mm")}
                                        format={"HH:mm"}
                                        // minuteStep={15}
                                        use12Hours={false}
                                        onChange={(time) => this.props.liveScoreUpdateBulkAction(time, "startTime")}
                                        value={pushBackData.startTime}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </div>

                {/* end time date and time picker row */}
                <InputWithHead heading={AppConstants.endTime}
                // required={"required-field"} 
                />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("endDate", {
                                    rules: [{ required: true, message: ValidationConstants.dateField }],
                                })(
                                    <DatePicker
                                        size="large"
                                        style={{ width: "100%" }}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        name={'registrationOepn'}
                                        onChange={(date) => this.props.liveScoreUpdateBulkAction(date, "endDate")}
                                        value={pushBackData.endDate}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("endTime", {
                                    rules: [{ required: true, message: ValidationConstants.timeField }],
                                })(
                                    <TimePicker
                                        className="comp-venue-time-timepicker"
                                        style={{ width: "100%" }}
                                        defaultOpenValue={moment("00:00", "HH:mm")}
                                        format={"HH:mm"}
                                        // minuteStep={15}
                                        use12Hours={false}
                                        onChange={(time) => this.props.liveScoreUpdateBulkAction(time, "endTime")}
                                        value={pushBackData.endTime}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </div>

                {/* venue drop down view */}
                <InputWithHead heading={AppConstants.venue}
                    required={"required-field"} />
                <div>
                    <Form.Item>
                        {getFieldDecorator("pushBackVenue", {
                            rules: [{ required: true, message: ValidationConstants.venueField }],
                        })(
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                className="reg-form-multple-select"
                                onChange={(venue) => this.onVenueSelection(venue, 'venueId')}
                                value={pushBackData.venueId}
                                placeholder={AppConstants.selectVenue}
                            >
                                {
                                    venueData && venueData.map((item) => {
                                        return (
                                            <Option key={'venue' + item.venueId}
                                                value={item.venueId}>
                                                {item.venueName}
                                            </Option>
                                        )
                                    })
                                }


                            </Select>
                        )}
                    </Form.Item>
                </div>

                {/* court drop down view */}
                <InputWithHead heading={AppConstants.court}
                    required={"required-field pb-0"} />
                <div>
                    <Form.Item>
                        {getFieldDecorator("pushBackCourt", {
                            rules: [{ required: true, message: ValidationConstants.court }],
                        })(
                            <Select
                                mode='multiple'
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(court) => this.props.liveScoreUpdateBulkAction(court, "venueCourtId")}
                                value={pushBackData.courtId}
                                placeholder={AppConstants.selectCourt}
                            >
                                {pushCourtData && pushCourtData.map((item) => {
                                    return (
                                        <Option key={'court' + item.venueCourtId}
                                            value={item.venueCourtId}>
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        )}
                    </Form.Item>
                </div>

                {/* Push back options */}
                <div className="fluid-width">
                    <span className='bulk-match-heading mt-5 mb-0' >{AppConstants.pushBack}</span>
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.hour}
                                placeholder={AppConstants.hour}
                                onChange={(hours) => this.props.liveScoreUpdateBulkAction(hours.target.value, "hours")}
                                value={pushBackData.hours}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.minutes}
                                placeholder={AppConstants.minutes}
                                onChange={(minutes) => this.props.liveScoreUpdateBulkAction(minutes.target.value, "minutes")}
                                value={pushBackData.minutes}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.seconds}
                                placeholder={AppConstants.seconds}
                                onChange={(seconds) => this.props.liveScoreUpdateBulkAction(seconds.target.value, "seconds")}
                                value={pushBackData.seconds}
                            />
                        </div>
                    </div>
                </div>

                {/* or to this time date and time picker row */}
                <InputWithHead heading={AppConstants.toThisTime} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <DatePicker
                                size="large"
                                style={{ width: "100%" }}
                                format={"DD-MM-YYYY"}
                                showTime={false}
                                onChange={(date) => date && this.props.liveScoreUpdateBulkAction(moment(date).format('DD-MM-YYYY'), "optionalDate")}
                                value={pushBackData.optionalDate && moment(pushBackData.optionalDate, "DD-MM-YYYY")}
                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <TimePicker
                                className="comp-venue-time-timepicker"
                                style={{ width: "100%" }}
                                defaultOpenValue={moment("00:00", "HH:mm")}
                                defaultValue={moment()}
                                onChange={(time) => this.props.liveScoreUpdateBulkAction(time, "optionalTime")}
                                format={"HH:mm"}
                                minuteStep={15}
                                use12Hours={false}
                                value={pushBackData.optionalTime}
                            />
                        </div>
                    </div>
                </div>


            </div>
        )
    }


    ////this method called slecting Bring Forward option from drop down
    bringForwardView(getFieldDecorator) {
        const { bringForwardData, venueData, bringCourtData } = this.props.liveScoreBulkMatchState
        return (
            <div>

                {/* start time date and time picker row */}
                <span className='bulk-match-heading mt-5 mb-0' >{AppConstants.changeMatchCriteria}</span>
                <InputWithHead heading={AppConstants.startTime}
                    required={"required-field"} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("forwardDate", {
                                    rules: [{ required: true, message: ValidationConstants.dateField }],
                                })(
                                    <DatePicker
                                        size="large"
                                        style={{ width: "100%" }}
                                        onChange={(date) => this.props.liveScoreUpdateBulkAction(date, "startDate")}
                                        value={bringForwardData.startDate}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("forwardTime", {
                                    rules: [{ required: true, message: ValidationConstants.timeField }],
                                })(
                                    <TimePicker
                                        className="comp-venue-time-timepicker"
                                        style={{ width: "100%" }}
                                        defaultOpenValue={moment("00:00", "HH:mm")}
                                        onChange={(time) => this.props.liveScoreUpdateBulkAction(time, "startTime")}
                                        format={"HH:mm"}
                                        value={bringForwardData.startTime}
                                        // minuteStep={15}
                                        use12Hours={false}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </div>

                {/* end time date and time picker row */}
                <InputWithHead heading={AppConstants.endTime}
                    required={"required-field"} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("forwardEndDate", {
                                    rules: [{ required: true, message: ValidationConstants.dateField }],
                                })(
                                    <DatePicker
                                        size="large"
                                        style={{ width: "100%" }}
                                        onChange={(date) => this.props.liveScoreUpdateBulkAction(date, "endDate")}
                                        value={bringForwardData.endDate}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        name={'registrationOepn'}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("forwardEndTime", {
                                    rules: [{ required: true, message: ValidationConstants.timeField }],
                                })(
                                    <TimePicker
                                        className="comp-venue-time-timepicker"
                                        style={{ width: "100%" }}
                                        defaultOpenValue={moment("00:00", "HH:mm")}
                                        onChange={(time) => this.props.liveScoreUpdateBulkAction(time, "endTime")}
                                        format={"HH:mm"}
                                        value={bringForwardData.endTime}
                                        // minuteStep={15}
                                        use12Hours={false}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </div>

                {/* venue drop down view */}
                <InputWithHead heading={AppConstants.venue}
                    required={"required-field"} />
                <div>
                    <Form.Item>
                        {getFieldDecorator("bringVenue", {
                            rules: [{ required: true, message: ValidationConstants.venueField }],
                        })(
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                className="reg-form-multple-select"
                                onChange={(venue) => this.onVenueSelection(venue, 'venueId')}
                                value={bringForwardData.venueId}
                                placeholder={AppConstants.selectVenue} >
                                {venueData && venueData.map((item) => {
                                    return (
                                        <Option key={'venue' + item.venueId}
                                            value={item.venueId}>
                                            {item.venueName}
                                        </Option>
                                    )
                                })}

                            </Select>
                        )}
                    </Form.Item>
                </div>

                {/* court drop down view */}
                <InputWithHead heading={AppConstants.court}
                    required={"required-field pb-0"} />
                <div>
                    <Form.Item>
                        {getFieldDecorator("bringCourt", {
                            rules: [{ required: true, message: ValidationConstants.court }],
                        })(
                            <Select
                                mode='multiple'
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(courtId) => this.props.liveScoreUpdateBulkAction(courtId, "courtId")}
                                value={bringForwardData.courtId}
                                placeholder={AppConstants.selectCourt}>
                                {bringCourtData && bringCourtData.map((item) => {
                                    return (
                                        <Option key={'court' + item.venueCourtId}
                                            value={item.venueCourtId}>
                                            {item.name}
                                        </Option>
                                    )
                                })}


                            </Select>
                        )}
                    </Form.Item>
                </div>

                {/* Push back options */}
                <div className="fluid-width">
                    <span className='bulk-match-heading mt-5 mb-0' >{AppConstants.bringForward}</span>
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.hour}
                                placeholder={AppConstants.hour}
                                onChange={(hours) => this.props.liveScoreUpdateBulkAction(hours.target.value, "hours")}
                                value={bringForwardData.hours}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.minutes}
                                placeholder={AppConstants.minutes}
                                onChange={(minutes) => this.props.liveScoreUpdateBulkAction(minutes.target.value, "minutes")}
                                value={bringForwardData.minutes}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.seconds}
                                placeholder={AppConstants.seconds}
                                onChange={(seconds) => this.props.liveScoreUpdateBulkAction(seconds.target.value, "seconds")}
                                value={bringForwardData.seconds}
                            />
                        </div>
                    </div>
                </div>

                {/* or to this time date and time picker row */}
                <InputWithHead heading={AppConstants.toThisTime}
                    required={"required-field"} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>

                            <DatePicker
                                size="large"
                                style={{ width: "100%" }}
                                onChange={(date) => date && this.props.liveScoreUpdateBulkAction(moment(date).format('DD-MM-YYYY'), "optionalDate")}
                                value={bringForwardData.optionalDate && moment(bringForwardData.optionalDate, "DD-MM-YYYY")}
                                // onChange={date => this.dateOnChangeFrom(date)}
                                format={"DD-MM-YYYY"}
                                showTime={false}
                            />

                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>

                            <TimePicker
                                className="comp-venue-time-timepicker"
                                style={{ width: "100%" }}
                                defaultOpenValue={moment("00:00", "hh:mm")}
                                onChange={(time) => this.props.liveScoreUpdateBulkAction(time, "optionalTime")}
                                format={"HH:mm"}
                                value={bringForwardData.optionalTime}
                                format={"HH:mm"}
                                minuteStep={15}
                                use12Hours={false}
                            />

                        </div>
                    </div>
                </div>


            </div>
        )
    }

    ////this method called after slecting End Matches option from drop down
    endMatchedView(getFieldDecorator) {
        const { endMatchData, venueData, endCourtData } = this.props.liveScoreBulkMatchState
        const { roundResult } = this.props.liveScoreState
        return (
            <div>
                {/* start time date and time picker row */}
                <span className='bulk-match-heading mt-5 mb-0' >{AppConstants.changeMatchCriteria}</span>
                <InputWithHead heading={AppConstants.startTime}
                    required={"required-field"} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("endMatchDate", {
                                    rules: [{ required: true, message: ValidationConstants.dateField }],
                                })(
                                    <DatePicker
                                        size="large"
                                        style={{ width: "100%" }}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        onChange={(date) => this.props.liveScoreUpdateBulkAction(date, "startDate")}
                                        value={endMatchData.startDate}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("endMatchTime", {
                                    rules: [{ required: true, message: ValidationConstants.timeField }],
                                })(
                                    <TimePicker
                                        className="comp-venue-time-timepicker"
                                        style={{ width: "100%" }}
                                        defaultOpenValue={moment("00:00", "hh:mm")}
                                        format={"hh:mm"}
                                        // minuteStep={15}
                                        onChange={(time) => this.props.liveScoreUpdateBulkAction(time, "startTime")}
                                        value={endMatchData.startTime}
                                        use12Hours={false}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </div>

                {/* end time date and time picker row */}
                <InputWithHead heading={AppConstants.endTime} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("endDate", {
                                    rules: [{ required: true, message: ValidationConstants.dateField }],
                                })(
                                    <DatePicker
                                        size="large"
                                        style={{ width: "100%" }}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        name={'registrationOepn'}
                                        onChange={(date) => this.props.liveScoreUpdateBulkAction(date, "endDate")}
                                        value={endMatchData.endDate}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <Form.Item>
                                {getFieldDecorator("endTime", {
                                    rules: [{ required: true, message: ValidationConstants.timeField }],
                                })(
                                    <TimePicker
                                        className="comp-venue-time-timepicker"
                                        style={{ width: "100%" }}
                                        defaultOpenValue={moment("00:00", "HH:mm")}
                                        format={"HH:mm"}
                                        onChange={(time) => this.props.liveScoreUpdateBulkAction(time, "endTime")}
                                        value={endMatchData.endTime}
                                        // minuteStep={15}
                                        use12Hours={false}
                                    />
                                )}
                            </Form.Item>

                        </div>
                    </div>
                </div>

                {/* venue drop down view */}
                <InputWithHead heading={AppConstants.venue}
                    required={"required-field"} />
                <div>
                    <Form.Item>
                        {getFieldDecorator("venueEndMatch", {
                            rules: [{ required: true, message: ValidationConstants.venueField }],
                        })(
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(venueId) => this.onVenueSelection(venueId, "venueId")}
                                value={endMatchData.venueId}
                                placeholder={AppConstants.selectVenue}>

                                {venueData && venueData.map((item) => {
                                    return (
                                        <Option key={'venue' + item.venueId}
                                            value={item.venueId}>
                                            {item.venueName}
                                        </Option>
                                    )
                                })}

                            </Select>
                        )}
                    </Form.Item>

                </div>

                {/* court drop down view */}
                <InputWithHead heading={AppConstants.court}
                    required={"required-field pb-0"} />
                <div>
                    <Form.Item>
                        {getFieldDecorator("bringCourtId", {
                            rules: [{ required: true, message: 'Court is required.' }],
                        })(

                            <Select
                                mode='multiple'
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(courtId) => this.props.liveScoreUpdateBulkAction(courtId, "courtId")}
                                value={endMatchData.courtId}
                                placeholder={AppConstants.selectCourt}
                            >
                                {endCourtData && endCourtData.map((item) => {
                                    return (
                                        <Option key={'court' + item.venueCourtId}
                                            value={item.venueCourtId}>
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        )}
                    </Form.Item>

                </div>

                {/* result type */}
                <div className="fluid-width">
                    <InputWithHead heading={AppConstants.round}
                    />
                    <div>
                        <Form.Item>
                            {getFieldDecorator("roundEndMatch", {
                                rules: [{ required: false, message: ValidationConstants.roundField }],
                            })(
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={(round_1) => this.props.liveScoreUpdateBulkAction(round_1, "resultType")}
                                    value={endMatchData.resultType}
                                    placeholder={AppConstants.selectRound}
                                >
                                    {
                                        roundResult && roundResult.map((item) => {
                                            return (
                                                <Option key={'round' + item.id}
                                                    value={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                </div>

            </div>
        )
    }

    ////this method called after slecting Double Header option from drop down
    doublwHeaderView(getFieldDecorator) {
        const { roundResult } = this.props.liveScoreState

        const { doubleHeaderResult } = this.props.liveScoreBulkMatchState
        console.log(doubleHeaderResult, "roundResult")
        return (
            <div>
                {/* round 1 drop down view */}
                <InputWithHead heading={AppConstants.round_1}
                    required={"required-field"} />
                <div>
                    <Form.Item>
                        {getFieldDecorator("round1", {
                            rules: [{ required: true, message: ValidationConstants.roundField }],
                        })(
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(round_1) => this.props.liveScoreUpdateBulkAction(round_1, "round_1")}
                                value={doubleHeaderResult.round_1}
                                placeholder={AppConstants.selectRoundOne}
                            >
                                {
                                    roundResult && roundResult.map((item) => {
                                        return (
                                            <Option key={'round' + item.id}
                                                value={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                </div>

                {/* round 2 drop down view */}
                <InputWithHead heading={AppConstants.round_2}
                    required={"required-field"} />
                <div>
                    <Form.Item>
                        {getFieldDecorator("round2", {
                            rules: [{ required: true, message: ValidationConstants.roundField }],
                        })(
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(round_2) => this.props.liveScoreUpdateBulkAction(round_2, "round_2")}
                                value={doubleHeaderResult.round_2}
                                placeholder={AppConstants.selectRoundOne}
                            >
                                {roundResult && roundResult.map((item) => {
                                    return (
                                        <Option key={'round' + item.id}
                                            value={item.id}>
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        )}
                    </Form.Item>
                </div>
            </div>
        )
    }

    ////this method called after slecting Abandon Matches option from drop down
    abandondMatchesView(getFieldDecorator) {
        const { roundResult } = this.props.liveScoreState
        const { abandonData, venueData, abandonCourtData, matchResult } = this.props.liveScoreBulkMatchState
        console.log(abandonData, 'abandonData')
        return (
            <div>


                <div>
                    {/* start time date and time picker row */}
                    <span className='bulk-match-heading mt-5 mb-0' >{AppConstants.changeMatchCriteria}</span>
                    <InputWithHead heading={AppConstants.startTime}
                        required={"required-field"} />
                    <div className="fluid-width">
                        <div className="row">
                            <div className="col-sm" style={{ marginTop: 5 }}>
                                <Form.Item>
                                    {getFieldDecorator("endMatchDate", {
                                        rules: [{ required: true, message: ValidationConstants.startDateField }],
                                    })(
                                        <DatePicker
                                            size="large"
                                            style={{ width: "100%" }}
                                            format={"DD-MM-YYYY"}
                                            showTime={false}
                                            name={'registrationOepn'}
                                            onChange={(date) => this.props.liveScoreUpdateBulkAction(date, "startDate")}
                                            value={abandonData.startDate}

                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm" style={{ marginTop: 5 }}>

                                <TimePicker
                                    className="comp-venue-time-timepicker"
                                    style={{ width: "100%" }}
                                    defaultOpenValue={moment("00:00", "HH:mm")}
                                    format={"HH:mm"}
                                    // minuteStep={15}
                                    use12Hours={false}
                                    onChange={(time) => this.props.liveScoreUpdateBulkAction(time, "startTime")}
                                    value={abandonData.startTime}
                                />
                            </div>
                        </div>
                    </div>

                    {/* end time date and time picker row */}
                    <InputWithHead heading={AppConstants.endTime} />
                    <div className="fluid-width">
                        <div className="row">
                            <div className="col-sm" style={{ marginTop: 5 }}>
                                <Form.Item>
                                    {getFieldDecorator("endDate", {
                                        rules: [{ required: true, message: ValidationConstants.dateField }],
                                    })(
                                        <DatePicker
                                            size="large"
                                            style={{ width: "100%" }}
                                            format={"DD-MM-YYYY"}
                                            showTime={false}
                                            name={'registrationOepn'}
                                            onChange={(date) => this.props.liveScoreUpdateBulkAction(date, "endDate")}
                                            value={abandonData.endDate}

                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm" style={{ marginTop: 5 }}>
                                <TimePicker
                                    className="comp-venue-time-timepicker"
                                    style={{ width: "100%" }}
                                    defaultOpenValue={moment("00:00", "HH:mm")}
                                    format={"HH:mm"}
                                    // minuteStep={15}
                                    use12Hours={false}
                                    onChange={(time) => this.props.liveScoreUpdateBulkAction(time, "endTime")}
                                    value={abandonData.endTime} />
                            </div>
                        </div>
                    </div>

                    {/* venue drop down view */}
                    <InputWithHead heading={AppConstants.venue}
                        required={"required-field"} />
                    <div>
                        <Form.Item>
                            {getFieldDecorator("venueAbandonMatch", {
                                rules: [{ required: true, message: ValidationConstants.venueField }],
                            })(
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    className="reg-form-multple-select"
                                    onChange={(venueId) => this.onVenueSelection(venueId, "venueId")}
                                    placeholder={AppConstants.selectVenue}
                                    value={abandonData.venueId} >
                                    {venueData && venueData.map((item) => {
                                        return (
                                            <Option key={'venue' + item.venueId}
                                                value={item.venueId}>
                                                {item.venueName}
                                            </Option>
                                        )
                                    })}

                                </Select>
                            )}
                        </Form.Item>

                    </div>

                    {/* court drop down view */}
                    <InputWithHead heading={AppConstants.court}
                        required={"required-field pb-0"} />
                    <div>
                        <Form.Item>
                            {getFieldDecorator("abandonCourtId", {
                                rules: [{ required: true, message: 'Court is required.' }],
                            })(
                                <Select
                                    mode='multiple'
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={(courtId) => this.props.liveScoreUpdateBulkAction(courtId, "courtId")}
                                    value={abandonData.courtId}
                                    placeholder={AppConstants.selectCourt}
                                    value={abandonData.courtId} >

                                    {abandonCourtData && abandonCourtData.map((item) => {
                                        return (
                                            <Option key={'court' + item.venueCourtId}
                                                value={item.venueCourtId}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}

                                </Select>
                            )}
                        </Form.Item>

                    </div>

                    {/* result type */}
                    <div className="fluid-width">
                        <InputWithHead heading={AppConstants.round_1}
                            required={"required-field"} />
                        <div>
                            <Form.Item>
                                {getFieldDecorator("round1", {
                                    rules: [{ required: true, message: ValidationConstants.roundField }],
                                })(
                                    <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                        onChange={(roundId) => this.props.liveScoreUpdateBulkAction(roundId, "roundId")}
                                        placeholder={AppConstants.selectRoundOne}
                                        value={abandonData.roundId}
                                    >
                                        {
                                            roundResult && roundResult.map((item) => {
                                                return (
                                                    <Option key={'round' + item.id}
                                                        value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                    </div>

                </div>
                <span className='bulk-match-heading mt-5 mb-0' >{AppConstants.abandon}</span>
                <InputWithHead heading={AppConstants.selectReason}
                    required={"required-field"} />
                <div>
                    <Form.Item>
                        {getFieldDecorator("reason", {
                            rules: [{ required: true, message: ValidationConstants.selectReason }],
                        })(
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={selectReason => this.setState({ selectReason })}
                                placeholder={AppConstants.selectReason}
                                onChange={(resultType) => this.props.liveScoreUpdateBulkAction(resultType, "resultType")}
                                value={abandonData.resultType}
                            >
                                {isArrayNotEmpty(matchResult) && matchResult.map((item, index) => {
                                    return (
                                        <Option key={item.id}
                                            value={item.id}>
                                            {item.code}
                                        </Option>
                                    )
                                })
                                }

                            </Select>
                        )}
                    </Form.Item>
                </div>



            </div>
        )
    }

    handleSubmit = e => {
        const {
            selectedOption,
            pushBackData,
            bringForwardData,
            endMatchData,
            doubleHeaderResult,
            abandonData
        } = this.props.liveScoreBulkMatchState

        console.log(pushBackData.startDate, pushBackData.startTime, 'pushBackData')

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (selectedOption == 'pushBack') {
                    // let formatedStartDate = formatDateTime(pushBackData.startDate, pushBackData.startTime)
                    // let formatedEndDate = formatDateTime(pushBackData.endDate, pushBackData.endTime)

                    let startDate = moment(pushBackData.startDate).format("YYYY-MMM-DD")
                    let startTime = moment.utc(pushBackData.startTime).format("HH:mm")
                    let postStartDate = startDate + " " + startTime + " " + "UTC"
                    let formatedStartDate = new Date(postStartDate).toISOString()

                    let endDate = moment(pushBackData.endDate).format("YYYY-MMM-DD")
                    let endTime = moment.utc(pushBackData.endTime).format("HH:mm")
                    let postEndDate = endDate + " " + endTime + " " + "UTC"
                    let formatedEndDate = new Date(postEndDate).toISOString()

                    if (pushBackData.hours == "" && pushBackData.minutes == "" && pushBackData.seconds == "") {
                        message.error(ValidationConstants.selectMinuteHourSecond)
                    }
                    else if (pushBackData.venueId == "") {
                        message.config({ duration: 0.9, maxCount: 1 })
                        message.error(ValidationConstants.pleaseSelectvenue)
                    }

                    else {
                        this.props.BulkMatchPushBackAction(pushBackData, formatedStartDate, formatedEndDate)
                        this.setState({ loading: true })
                    }

                } else if (selectedOption == 'bringForward') {
                    // let formatedStartDate = formatDateTime(bringForwardData.startDate, bringForwardData.startTime)
                    // let formatedEndDate = formatDateTime(bringForwardData.endDate, bringForwardData.endTime)

                    let startDate = moment(bringForwardData.startDate).format("YYYY-MMM-DD")
                    let startTime = moment.utc(bringForwardData.startTime).format("HH:mm")
                    let postStartDate = startDate + " " + startTime + " " + "UTC"
                    let formatedStartDate = new Date(postStartDate).toISOString()

                    let endDate = moment(bringForwardData.endDate).format("YYYY-MMM-DD")
                    let endTime = moment.utc(bringForwardData.endTime).format("HH:mm")
                    let postEndDate = endDate + " " + endTime + " " + "UTC"
                    let formatedEndDate = new Date(postEndDate).toISOString()


                    if (bringForwardData.hours == "" && bringForwardData.minutes == "" && bringForwardData.seconds == "") {
                        message.config({ duration: 0.9, maxCount: 1 })
                        message.error(ValidationConstants.selectMinuteHourSecond)
                    }
                    else if (bringForwardData.venueId == "") {
                        message.config({ duration: 0.9, maxCount: 1 })
                        message.error(ValidationConstants.pleaseSelectvenue)
                    }
                    else {
                        this.props.liveScoreBringForwardAction(null, bringForwardData, formatedStartDate, formatedEndDate)
                        this.setState({ loading: true })
                    }
                } else if (selectedOption == 'endMatch') {
                    // let formatedStartDate = formatDateTime(endMatchData.startDate, endMatchData.startTime)
                    // let formatedEndDate = formatDateTime(endMatchData.endDate, endMatchData.endTime)

                    let startDate = moment(endMatchData.startDate).format("YYYY-MMM-DD")
                    let startTime = moment.utc(endMatchData.startTime).format("HH:mm")
                    let postStartDate = startDate + " " + startTime + " " + "UTC"
                    let formatedStartDate = new Date(postStartDate).toISOString()

                    let endDate = moment(endMatchData.endDate).format("YYYY-MMM-DD")
                    let endTime = moment.utc(endMatchData.endTime).format("HH:mm")
                    let postEndDate = endDate + " " + endTime + " " + "UTC"
                    let formatedEndDate = new Date(postEndDate).toISOString()


                    this.props.liveScoreEndMatchesdAction(endMatchData, formatedStartDate, formatedEndDate)
                    this.setState({ loading: true })

                } else if (selectedOption == 'doubleHeader') {
                    this.props.liveScoreDoubleHeaderAction(doubleHeaderResult)
                    this.setState({ loading: true })

                } else if (selectedOption == 'abandonMatch') {
                    // let formatedStartDate = formatDateTime(abandonData.startDate, abandonData.startTime)
                    // let formatedEndDate = formatDateTime(abandonData.endDate, abandonData.endTime)

                    let startDate = moment(abandonData.startDate).format("YYYY-MMM-DD")
                    let startTime = moment.utc(abandonData.startTime).format("HH:mm")
                    let postStartDate = startDate + " " + startTime + " " + "UTC"
                    let formatedStartDate = new Date(postStartDate).toISOString()

                    let endDate = moment(abandonData.endDate).format("YYYY-MMM-DD")
                    let endTime = moment.utc(abandonData.endTime).format("HH:mm")
                    let postEndDate = endDate + " " + endTime + " " + "UTC"
                    let formatedEndDate = new Date(postEndDate).toISOString()

                    this.props.liveScoreAbandonMatchAction(abandonData, formatedStartDate, formatedEndDate)
                    this.setState({ loading: true })

                }

            }
        });
    };

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button onClick={() => history.push('/liveScoreDashboard')} type="cancel-button">{AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };




    /////main render method
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width">
                <Loader visible={this.props.liveScoreBulkMatchState.onLoad} />
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"12"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        onSubmit={this.handleSubmit}
                        noValidate="noValidate">
                        <Content>
                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
                        </Content>
                        <Footer >{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        BulkMatchPushBackAction,
        liveScoreBringForwardAction,
        liveScoreEndMatchesdAction,
        liveScoreBulkMatchAction,
        liveScoreUpdateBulkAction,
        liveScoreDoubleHeaderAction,
        getCompetitonVenuesList,
        getliveScoreDivisions,
        liveScoreAbandonMatchAction,
        matchResult
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreState: state.LiveScoreState,
        liveScoreBulkMatchState: state.LiveScoreBulkMatchState,
        liveScoreState: state.LiveScoreState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreBulkChange));


