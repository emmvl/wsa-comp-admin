import React, { Component } from 'react';
import {
  Layout,
  Breadcrumb,
  Select,
  Button,
  DatePicker,
  TimePicker,
  Form,
  message,
  Radio,
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from 'react-png-tooltip';
import moment from 'moment';
import InputWithHead from '../../customComponents/InputWithHead';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import './liveScore.css';
import ValidationConstants from '../../themes/validationConstant';
// import { formatDateTime } from '../../themes/dateformate';
import {
  BulkMatchPushBackAction,
  liveScoreBringForwardAction,
  liveScoreEndMatchesdAction,
  liveScoreBulkMatchAction,
  liveScoreUpdateBulkAction,
  liveScoreDoubleHeaderAction,
  liveScoreAbandonMatchAction,
  matchResult,
  searchCourtList,
  clearFilter,
} from '../../store/actions/LiveScoreAction/liveScoreBulkMatchAction';
import { getCompetitionVenuesList } from '../../store/actions/LiveScoreAction/liveScoreMatchAction';
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions';
import Loader from '../../customComponents/loader';
import history from '../../util/history';
import { getLiveScoreCompetiton } from '../../util/sessionStorage';
import { isArrayNotEmpty } from '../../util/helpers';
import { liveScoreRoundListAction } from '../../store/actions/LiveScoreAction/liveScoreRoundAction';

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class LiveScoreBulkChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      search: '',
    };
    this.props.matchResult();
    this.props.liveScoreUpdateBulkAction('selectedOption', 'selectedOption');
    this.formRef = React.createRef();
  }

  componentDidMount() {
    if (getLiveScoreCompetiton()) {
      const { id } = JSON.parse(getLiveScoreCompetiton());
      this.props.liveScoreBulkMatchAction();
      if (id !== null) {
        this.props.getCompetitionVenuesList(id, this.state.search);
        this.props.liveScoreRoundListAction(id);
      } else {
        history.push('/matchDayCompetitions');
      }
    } else {
      history.push('/matchDayCompetitions');
    }
  }

  componentDidUpdate() {
    if (this.state.loading && this.props.liveScoreBulkMatchState.onLoad === false) {
      this.props.liveScoreUpdateBulkAction(AppConstants.selectOption, 'refreshPage');
      this.setInitialFieldValues();
      this.setState({ loading: false });
    }
  }

  setInitialFieldValues() {
    this.formRef.current.resetFields();
    const { selectedOption } = this.props.liveScoreBulkMatchState;
    this.formRef.current.setFieldsValue({
      optionData: selectedOption,
    });
  }

  headerView = () => {
    const isEdit = this.props.location.state ? this.props.location.state.isEdit : null;
    return (
      <div className="header-view">
        <Header className="form-header-view d-flex bg-transparent align-items-center">
          <Breadcrumb separator=" > ">
            <Breadcrumb.Item className="breadcrumb-add">
              {isEdit ? AppConstants.editNews : AppConstants.bulkMatchChange}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Header>
      </div>
    );
  };

  // initial view
  inital_screen = () => {
    const {
      venueData,
      // selected_Option
    } = this.props.liveScoreBulkMatchState;
    return (
      <div>
        {/* date picker row */}
        <span className="text-heading-large mt-5 mb-0">{AppConstants.whichMatchChange}</span>
        <div>
          <InputWithHead heading={AppConstants.matchOnDate} required="required-field" />
          <Form.Item
            name="changeMatchDate"
            rules={[{ required: true, message: ValidationConstants.dateField }]}
          >
            <DatePicker
              // size="large"
              className="w-100"
              onChange={date => this.setState(date)}
              format="DD-MM-YYYY"
              placeholder="dd-mm-yyyy"
              showTime={false}
              name="registrationOepn"
            />
          </Form.Item>
        </div>

        {/* time picker row */}
        <InputWithHead heading={AppConstants.forTimeRange} />
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm" style={{ marginTop: 5 }}>
              <TimePicker
                className="comp-venue-time-timepicker w-100"
                defaultValue={moment()}
                format="hh:mm A"
                minuteStep={15}
                use12Hours
              />
            </div>
            <div className="col-sm" style={{ marginTop: 5 }}>
              <TimePicker
                className="comp-venue-time-timepicker w-100"
                defaultValue={moment()}
                format="hh:mm A"
                minuteStep={15}
                use12Hours
              />
            </div>
          </div>
        </div>

        {/* drop down venue view */}
        <InputWithHead heading={AppConstants.byVenue} />
        <div>
          <InputWithHead heading={AppConstants.matchOnDate} required="required-field" />
          <Form.Item
            name="changeMatchVenue"
            rules={[{ required: true, message: ValidationConstants.venueField }]}
          >
            <Select
              style={{ paddingRight: 1, minWidth: 182 }}
              // onChange={venueSelection => this.setState({ venueSelection })}
              placeholder={AppConstants.selectVenue}
              className="reg-form-multiple-select w-100"
              // onChange={(venueId) => this.props.liveScoreUpdateMatchAction(venueId, "venueId")}
              onChange={venueId => this.props.liveScoreUpdateBulkAction(venueId, 'venueId')}
              // value={selected_Option.venueId}
            >
              {venueData &&
                venueData.map(item => (
                  <Option key={`venue_${item.venueId}`} value={item.venueId}>
                    {item.venueName}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>
      </div>
    );
  };

  initialPageView = () => (
    <div>
      <Form.Item
        name="optionData"
        rules={[{ required: true, message: ValidationConstants.pleaseSelect }]}
      >
        <Select
          className="w-100"
          style={{ paddingRight: 1, minWidth: 182 }}
          onChange={selectedOption =>
            this.props.liveScoreUpdateBulkAction(selectedOption, 'selectedOption')
          }
          // value={selectedOption}
          placeholder={AppConstants.selectOption}
        >
          <Option value="pushBack">Push Back</Option>
          <Option value="bringForward">Bring Forward</Option>
          <Option value="abandonMatch">Abandon Matches</Option>
          <Option value="endMatch">End Matches</Option>
          <Option value="doubleHeader">Double Header</Option>
        </Select>
      </Form.Item>
    </div>
  );

  contentView = () => {
    const { selectedOption } = this.props.liveScoreBulkMatchState;
    return (
      <div className="content-view pt-5">
        <div className="d-flex align-items-center">
          <span className="text-heading-large">{AppConstants.whatDoWantDO}</span>
          <div className="mt-n10">
            <Tooltip placement="top">
              <span>{AppConstants.bulkMatchMsg}</span>
              {/* {AppConstants.LatitudeMsg} */}
            </Tooltip>
          </div>
        </div>

        {this.initialPageView()}
        {selectedOption === 'pushBack' && this.pushBackView()}
        {selectedOption === 'endMatch' && this.endMatchedView()}
        {selectedOption === 'doubleHeader' && this.doublwHeaderView()}
        {selectedOption === 'bringForward' && this.bringForwardView()}
        {selectedOption === 'abandonMatch' && this.abandondMatchesView()}
      </div>
    );
  };

  onVenueSelection(venue, key) {
    this.props.liveScoreUpdateBulkAction(venue, key);
    this.formRef.current.setFieldsValue({
      pushBackCourt: [],
      bringCourt: [],
      bringCourtId: [],
      abandonCourtId: [],
    });
  }

  radioBtnContainer() {
    const { bulkRadioBtn } = this.props.liveScoreBulkMatchState;
    return (
      <div style={{ paddingLeft: 12 }}>
        <Radio.Group
          // className="reg-competition-radio"
          onChange={e => this.props.liveScoreUpdateBulkAction(e.target.value, 'bulkRadioBtn')}
          value={bulkRadioBtn}
        >
          <div className="row">
            <Radio value="fixedDuration">{AppConstants.fixedDuration}</Radio>
            <Radio value="specificTime">{AppConstants.specificTime}</Radio>
          </div>
        </Radio.Group>
      </div>
    );
  }

  fixedDurationView(data) {
    return (
      <div>
        <div className="row">
          <div className="col-sm">
            <InputWithHead
              heading={AppConstants.hour}
              placeholder={AppConstants.hour}
              onChange={hours => this.props.liveScoreUpdateBulkAction(hours.target.value, 'hours')}
              value={data.hours}
            />
          </div>
          <div className="col-sm">
            <InputWithHead
              heading={AppConstants.minutes}
              placeholder={AppConstants.minutes}
              onChange={minutes =>
                this.props.liveScoreUpdateBulkAction(minutes.target.value, 'minutes')
              }
              value={data.minutes}
            />
          </div>
          <div className="col-sm">
            <InputWithHead
              heading={AppConstants.seconds}
              placeholder={AppConstants.seconds}
              onChange={seconds =>
                this.props.liveScoreUpdateBulkAction(seconds.target.value, 'seconds')
              }
              value={data.seconds}
            />
          </div>
        </div>
      </div>
    );
  }

  specificTimeViw(data) {
    return (
      <div className="fluid-width">
        <InputWithHead heading={AppConstants.toThisTime} />
        <div className="row">
          <div className="col-sm" style={{ marginTop: 5 }}>
            <DatePicker
              // size="large"
              className="w-100"
              format="DD-MM-YYYY"
              placeholder="dd-mm-yyyy"
              showTime={false}
              onChange={date => date && this.props.liveScoreUpdateBulkAction(date, 'optionalDate')}
              value={data.optionalDate && moment(data.optionalDate, 'DD-MM-YYYY')}
            />
          </div>
          <div className="col-sm" style={{ marginTop: 5 }}>
            <TimePicker
              className="comp-venue-time-timepicker w-100"
              defaultValue={moment()}
              onChange={time => this.props.liveScoreUpdateBulkAction(time, 'optionalTime')}
              onBlur={e =>
                this.props.liveScoreUpdateBulkAction(
                  e.target.value && moment(e.target.value, 'HH:mm'),
                  'optionalTime',
                )
              }
              format="HH:mm"
              minuteStep={15}
              use12Hours={false}
              value={data.optionalTime}
              placeholder="Select Time"
            />
          </div>
        </div>
      </div>
    );
  }

  handleSearch = (value, data) => {
    const filteredData = data.filter(
      memo => memo.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );
    this.props.searchCourtList(filteredData);
  };

  onSearchVenue(searchValue) {
    const { id } = JSON.parse(getLiveScoreCompetiton());
    this.setState({ search: searchValue });
    this.props.getCompetitionVenuesList(id, searchValue);
  }

  ////this method called after selecting Push Back option from drop down
  pushBackView() {
    const {
      pushBackData,
      venueData,
      pushCourtData,
      bulkRadioBtn,
      mainCourtList,
    } = this.props.liveScoreBulkMatchState;

    return (
      <div>
        {/* start time date and time picker row */}
        <span className="text-heading-large mt-5 mb-0">{AppConstants.changeMatchCriteria}</span>
        <InputWithHead heading={AppConstants.startTime} required="required-field" />
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="startDate"
                rules={[{ required: true, message: ValidationConstants.dateField }]}
              >
                <DatePicker
                  // size="large"
                  className="w-100"
                  format="DD-MM-YYYY"
                  placeholder="dd-mm-yyyy"
                  showTime={false}
                  // onChange={(date) => this.props.liveScoreUpdateBulkAction(moment(date).format('YYYY-MM-DD'), "startDate")}
                  onChange={date => this.props.liveScoreUpdateBulkAction(date, 'startDate')}
                  // value={pushBackData.startDate}
                />
              </Form.Item>
            </div>
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="startTime"
                rules={[{ required: true, message: ValidationConstants.timeField }]}
              >
                <TimePicker
                  className="comp-venue-time-timepicker w-100"
                  defaultValue={moment('00:00', 'HH:mm')}
                  format="HH:mm"
                  // minuteStep={15}
                  placeholder="Select Time"
                  use12Hours={false}
                  onChange={time => this.props.liveScoreUpdateBulkAction(time, 'startTime')}
                  onBlur={e =>
                    this.props.liveScoreUpdateBulkAction(
                      e.target.value && moment(e.target.value, 'HH:mm'),
                      'startTime',
                    )
                  }
                  // value={pushBackData.startTime}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* end time date and time picker row */}
        <InputWithHead heading={AppConstants.endTime} required="required-field" />
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="endDate"
                rules={[{ required: true, message: ValidationConstants.dateField }]}
              >
                <DatePicker
                  // size="large"
                  className="w-100"
                  format="DD-MM-YYYY"
                  placeholder="dd-mm-yyyy"
                  showTime={false}
                  name="registrationOepn"
                  onChange={date => this.props.liveScoreUpdateBulkAction(date, 'endDate')}
                  // value={pushBackData.endDate}
                />
              </Form.Item>
            </div>
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="endTime"
                rules={[{ required: true, message: ValidationConstants.timeField }]}
              >
                <TimePicker
                  className="comp-venue-time-timepicker w-100"
                  defaultValue={moment('00:00', 'HH:mm')}
                  format="HH:mm"
                  // minuteStep={15}
                  placeholder="Select Time"
                  use12Hours={false}
                  onChange={time => this.props.liveScoreUpdateBulkAction(time, 'endTime')}
                  onBlur={e =>
                    this.props.liveScoreUpdateBulkAction(
                      e.target.value && moment(e.target.value, 'HH:mm'),
                      'endTime',
                    )
                  }
                  // value={pushBackData.endTime}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* venue drop down view */}
        <InputWithHead
          heading={AppConstants.venue}
          // required="required-field"
        />
        <div>
          <Select
            showSearch
            style={{ paddingRight: 1, minWidth: 182 }}
            className="reg-form-multiple-select w-100"
            onChange={venue => this.onVenueSelection(venue, 'venueId')}
            value={pushBackData.venueId ? pushBackData.venueId : []}
            placeholder={AppConstants.selectVenue}
            optionFilterProp="children"
            onSearch={e => this.onSearchVenue(e)}
          >
            {venueData &&
              venueData.map(item => (
                <Option key={`venue_${item.venueId}`} value={item.venueId}>
                  {item.venueName}
                </Option>
              ))}
          </Select>
        </div>

        {/* court drop down view */}
        <InputWithHead heading={AppConstants.court} required="pb-0" />
        <div>
          <Select
            mode="multiple"
            className="w-100"
            style={{ paddingRight: 1, minWidth: 182 }}
            onChange={court => {
              this.props.liveScoreUpdateBulkAction(court, 'venueCourtId');
              this.props.clearFilter();
            }}
            value={pushBackData.courtId}
            placeholder={AppConstants.selectCourt}
            onSearch={value => {
              this.handleSearch(value, mainCourtList);
            }}
            filterOption={false}
          >
            {pushCourtData &&
              pushCourtData.map(item => (
                <Option key={`court_${item.venueCourtId}`} value={item.venueCourtId}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </div>

        {/* Push back options */}
        <div className="fluid-width">
          <span className="text-heading-large mt-5 mb-0">{AppConstants.pushBack}</span>
          {this.radioBtnContainer()}

          {bulkRadioBtn === 'fixedDuration' && this.fixedDurationView(pushBackData)}
        </div>

        {/* or to this time date and time picker row */}
        {bulkRadioBtn === 'specificTime' && this.specificTimeViw(pushBackData)}
      </div>
    );
  }

  ////this method called selecting Bring Forward option from drop down
  bringForwardView() {
    const {
      bringForwardData,
      venueData,
      bringCourtData,
      bulkRadioBtn,
      mainCourtList,
    } = this.props.liveScoreBulkMatchState;

    return (
      <div>
        {/* start time date and time picker row */}
        <span className="text-heading-large mt-5 mb-0">{AppConstants.changeMatchCriteria}</span>
        <InputWithHead heading={AppConstants.startTime} required="required-field" />
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="forwardDate"
                rules={[{ required: true, message: ValidationConstants.dateField }]}
              >
                <DatePicker
                  // size="large"
                  className="w-100"
                  onChange={date => this.props.liveScoreUpdateBulkAction(date, 'startDate')}
                  // value={bringForwardData.startDate}
                  format="DD-MM-YYYY"
                  placeholder="dd-mm-yyyy"
                  showTime={false}
                />
              </Form.Item>
            </div>
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="forwardTime"
                rules={[{ required: true, message: ValidationConstants.timeField }]}
              >
                <TimePicker
                  className="comp-venue-time-timepicker w-100"
                  defaultValue={moment('00:00', 'HH:mm')}
                  onChange={time => this.props.liveScoreUpdateBulkAction(time, 'startTime')}
                  onBlur={e =>
                    this.props.liveScoreUpdateBulkAction(
                      e.target.value && moment(e.target.value, 'HH:mm'),
                      'startTime',
                    )
                  }
                  format="HH:mm"
                  // value={bringForwardData.startTime}
                  // minuteStep={15}
                  placeholder="Select Time"
                  use12Hours={false}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* end time date and time picker row */}
        <InputWithHead heading={AppConstants.endTime} required="required-field" />
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="forwardEndDate"
                rules={[{ required: true, message: ValidationConstants.dateField }]}
              >
                <DatePicker
                  // size="large"
                  className="w-100"
                  onChange={date => this.props.liveScoreUpdateBulkAction(date, 'endDate')}
                  // value={bringForwardData.endDate}
                  format="DD-MM-YYYY"
                  placeholder="dd-mm-yyyy"
                  showTime={false}
                  name="registrationOepn"
                />
              </Form.Item>
            </div>
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="forwardEndTime"
                rules={[{ required: true, message: ValidationConstants.timeField }]}
              >
                <TimePicker
                  className="comp-venue-time-timepicker w-100"
                  defaultValue={moment('00:00', 'HH:mm')}
                  onChange={time => this.props.liveScoreUpdateBulkAction(time, 'endTime')}
                  onBlur={e =>
                    this.props.liveScoreUpdateBulkAction(
                      e.target.value && moment(e.target.value, 'HH:mm'),
                      'endTime',
                    )
                  }
                  format="HH:mm"
                  placeholder="Select Time"
                  // value={bringForwardData.endTime}
                  // minuteStep={15}
                  use12Hours={false}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* venue drop down view */}
        <InputWithHead
          heading={AppConstants.venue}
          // required="required-field"
        />
        <div>
          <Select
            showSearch
            style={{ paddingRight: 1, minWidth: 182 }}
            className="reg-form-multiple-select w-100"
            onChange={venue => this.onVenueSelection(venue, 'venueId')}
            value={bringForwardData.venueId ? bringForwardData.venueId : []}
            placeholder={AppConstants.selectVenue}
            optionFilterProp="children"
            onSearch={e => this.onSearchVenue(e)}
          >
            {venueData &&
              venueData.map(item => (
                <Option key={`venue_${item.venueId}`} value={item.venueId}>
                  {item.venueName}
                </Option>
              ))}
          </Select>
        </div>

        {/* court drop down view */}
        <InputWithHead heading={AppConstants.court} required="pb-0" />
        <div>
          <Select
            mode="multiple"
            className="w-100"
            style={{ paddingRight: 1, minWidth: 182 }}
            onChange={courtId => {
              this.props.liveScoreUpdateBulkAction(courtId, 'courtId');
              this.props.clearFilter();
            }}
            value={bringForwardData.courtId}
            placeholder={AppConstants.selectCourt}
            onSearch={value => {
              this.handleSearch(value, mainCourtList);
            }}
            filterOption={false}
          >
            {bringCourtData &&
              bringCourtData.map(item => (
                <Option key={`court_${item.venueCourtId}`} value={item.venueCourtId}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </div>

        {/* bring forward options */}
        <div className="fluid-width">
          <span className="text-heading-large mt-5 mb-0">{AppConstants.bringForward}</span>
          {this.radioBtnContainer()}
          {bulkRadioBtn === 'fixedDuration' && this.fixedDurationView(bringForwardData)}
        </div>
        {bulkRadioBtn === 'specificTime' && this.specificTimeViw(bringForwardData)}
      </div>
    );
  }

  ////this method called after selecting End Matches option from drop down
  endMatchedView() {
    const {
      endMatchData,
      venueData,
      endCourtData,
      mainCourtList,
    } = this.props.liveScoreBulkMatchState;
    const { roundList } = this.props.liveScoreRoundState;
    const roundResult = isArrayNotEmpty(roundList) ? roundList : [];

    return (
      <div>
        {/* start time date and time picker row */}
        <span className="text-heading-large mt-5 mb-0">{AppConstants.changeMatchCriteria}</span>
        <InputWithHead heading={AppConstants.startTime} required="required-field" />
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="endMatchDate"
                rules={[{ required: true, message: ValidationConstants.dateField }]}
              >
                <DatePicker
                  // size="large"
                  className="w-100"
                  format="DD-MM-YYYY"
                  placeholder="dd-mm-yyyy"
                  showTime={false}
                  onChange={date => this.props.liveScoreUpdateBulkAction(date, 'startDate')}
                  // value={endMatchData.startDate}
                />
              </Form.Item>
            </div>
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="endMatchTime"
                rules={[{ required: true, message: ValidationConstants.timeField }]}
              >
                <TimePicker
                  className="comp-venue-time-timepicker w-100"
                  defaultValue={moment('00:00', 'hh:mm')}
                  format="hh:mm"
                  // minuteStep={15}
                  placeholder="Select Time"
                  onChange={time => this.props.liveScoreUpdateBulkAction(time, 'startTime')}
                  onBlur={e =>
                    this.props.liveScoreUpdateBulkAction(
                      e.target.value && moment(e.target.value, 'HH:mm'),
                      'startTime',
                    )
                  }
                  // value={endMatchData.startTime}
                  use12Hours={false}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* end time date and time picker row */}
        <InputWithHead heading={AppConstants.endTime} />
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="endDate"
                rules={[{ required: true, message: ValidationConstants.dateField }]}
              >
                <DatePicker
                  // size="large"
                  className="w-100"
                  format="DD-MM-YYYY"
                  placeholder="dd-mm-yyyy"
                  showTime={false}
                  name="registrationOepn"
                  onChange={date => this.props.liveScoreUpdateBulkAction(date, 'endDate')}
                  // value={endMatchData.endDate}
                />
              </Form.Item>
            </div>
            <div className="col-sm" style={{ marginTop: 5 }}>
              <Form.Item
                name="endTime"
                rules={[{ required: true, message: ValidationConstants.timeField }]}
              >
                <TimePicker
                  className="comp-venue-time-timepicker w-100"
                  defaultValue={moment('00:00', 'HH:mm')}
                  format="HH:mm"
                  placeholder="Select Time"
                  onChange={time => this.props.liveScoreUpdateBulkAction(time, 'endTime')}
                  onBlur={e =>
                    this.props.liveScoreUpdateBulkAction(
                      e.target.value && moment(e.target.value, 'HH:mm'),
                      'endTime',
                    )
                  }
                  // value={endMatchData.endTime}
                  // minuteStep={15}
                  use12Hours={false}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* venue drop down view */}
        <InputWithHead
          heading={AppConstants.venue}
          // required="required-field"
        />
        <div>
          <Select
            showSearch
            className="w-100"
            style={{ paddingRight: 1, minWidth: 182 }}
            onChange={venueId => this.onVenueSelection(venueId, 'venueId')}
            value={endMatchData.venueId ? endMatchData.venueId : []}
            placeholder={AppConstants.selectVenue}
            optionFilterProp="children"
            onSearch={e => this.onSearchVenue(e)}
          >
            {venueData &&
              venueData.map(item => (
                <Option key={`venue_${item.venueId}`} value={item.venueId}>
                  {item.venueName}
                </Option>
              ))}
          </Select>
        </div>

        {/* court drop down view */}
        <InputWithHead heading={AppConstants.court} required="pb-0" />
        <div>
          <Select
            mode="multiple"
            className="w-100"
            style={{ paddingRight: 1, minWidth: 182 }}
            onChange={courtId => {
              this.props.liveScoreUpdateBulkAction(courtId, 'courtId');
              this.props.clearFilter();
            }}
            value={endMatchData.courtId}
            placeholder={AppConstants.selectCourt}
            onSearch={value => {
              this.handleSearch(value, mainCourtList);
            }}
            filterOption={false}
          >
            {endCourtData &&
              endCourtData.map(item => (
                <Option key={`court_${item.venueCourtId}`} value={item.venueCourtId}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </div>

        {/* result type */}
        <div className="fluid-width">
          <InputWithHead heading={AppConstants.round} />
          <div>
            <Select
              className="w-100"
              style={{ paddingRight: 1, minWidth: 182 }}
              onChange={round_1 => this.props.liveScoreUpdateBulkAction(round_1, 'resultType')}
              value={endMatchData.resultType ? endMatchData.resultType : []}
              placeholder={AppConstants.selectRound}
              showSearch
              optionFilterProp="children"
            >
              {roundResult.map(item => (
                <Option key={`round_${item.id}`} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    );
  }

  ////this method called after selecting Double Header option from drop down
  doublwHeaderView() {
    const { roundList } = this.props.liveScoreBulkMatchState;
    const roundResult = isArrayNotEmpty(roundList) ? roundList : [];
    // const { doubleHeaderResult } = this.props.liveScoreBulkMatchState;

    return (
      <div>
        {/* round 1 drop down view */}
        <InputWithHead heading={AppConstants.round_1} required="required-field" />
        <div>
          <Form.Item
            name="round1"
            rules={[{ required: true, message: ValidationConstants.roundField }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              className="w-100"
              style={{ paddingRight: 1, minWidth: 182 }}
              onChange={round_1 => this.props.liveScoreUpdateBulkAction(round_1, 'round_1')}
              // value={doubleHeaderResult.round_1}
              placeholder={AppConstants.selectRoundOne}
            >
              {roundResult.map(item => (
                <Option key={`round_${item.name}`} value={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* round 2 drop down view */}
        <InputWithHead heading={AppConstants.round_2} required="required-field" />
        <div>
          <Form.Item
            name="round2"
            rules={[{ required: true, message: ValidationConstants.roundField }]}
          >
            <Select
              className="w-100"
              style={{ paddingRight: 1, minWidth: 182 }}
              onChange={round_2 => this.props.liveScoreUpdateBulkAction(round_2, 'round_2')}
              // value={doubleHeaderResult.round_2}
              placeholder={AppConstants.selectRoundOne}
              showSearch
              optionFilterProp="children"
            >
              {roundResult.map(item => (
                <Option key={`round_${item.name}`} value={item.name}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>
    );
  }

  /// /this method called after selecting Abandon Matches option from drop down
  abandondMatchesView() {
    const { roundList } = this.props.liveScoreRoundState;
    const roundResult = isArrayNotEmpty(roundList) ? roundList : [];
    const {
      abandonData,
      venueData,
      abandonCourtData,
      // matchResult,
      mainCourtList,
    } = this.props.liveScoreBulkMatchState;

    return (
      <div>
        <div>
          {/* start time date and time picker row */}
          <span className="text-heading-large mt-5 mb-0">{AppConstants.changeMatchCriteria}</span>
          <InputWithHead heading={AppConstants.startTime} required="required-field" />
          <div className="fluid-width">
            <div className="row">
              <div className="col-sm" style={{ marginTop: 5 }}>
                <Form.Item
                  name="startMatchDate"
                  rules={[{ required: true, message: ValidationConstants.dateField }]}
                >
                  <DatePicker
                    // size="large"
                    className="w-100"
                    format="DD-MM-YYYY"
                    placeholder="dd-mm-yyyy"
                    showTime={false}
                    name="registrationOepn"
                    onChange={date => this.props.liveScoreUpdateBulkAction(date, 'startDate')}
                    // value={abandonData.startDate}
                  />
                </Form.Item>
              </div>
              <div className="col-sm" style={{ marginTop: 5 }}>
                <Form.Item
                  name="startMatchDateTime"
                  rules={[{ required: true, message: ValidationConstants.selectMinuteHourSecond }]}
                >
                  <TimePicker
                    className="comp-venue-time-timepicker w-100"
                    defaultValue={moment('00:00', 'HH:mm')}
                    format="HH:mm"
                    // minuteStep={15}
                    placeholder="Select Time"
                    use12Hours={false}
                    onChange={time => this.props.liveScoreUpdateBulkAction(time, 'startTime')}
                    onBlur={e =>
                      this.props.liveScoreUpdateBulkAction(
                        e.target.value && moment(e.target.value, 'HH:mm'),
                        'startTime',
                      )
                    }
                    value={abandonData.startTime}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* end time date and time picker row */}
          <InputWithHead heading={AppConstants.endTime} required="required-field" />
          <div className="fluid-width">
            <div className="row">
              <div className="col-sm" style={{ marginTop: 5 }}>
                <Form.Item
                  name="endDate"
                  rules={[{ required: true, message: ValidationConstants.dateField }]}
                >
                  <DatePicker
                    // size="large"
                    className="w-100"
                    format="DD-MM-YYYY"
                    placeholder="dd-mm-yyyy"
                    showTime={false}
                    name="registrationOepn"
                    onChange={date => this.props.liveScoreUpdateBulkAction(date, 'endDate')}
                    // value={abandonData.endDate}
                  />
                </Form.Item>
              </div>
              <div className="col-sm" style={{ marginTop: 5 }}>
                <Form.Item
                  name="endMatchDateTime"
                  rules={[{ required: true, message: ValidationConstants.selectMinuteHourSecond }]}
                >
                  <TimePicker
                    className="comp-venue-time-timepicker w-100"
                    defaultValue={moment('00:00', 'HH:mm')}
                    format="HH:mm"
                    // minuteStep={15}
                    placeholder="Select Time"
                    use12Hours={false}
                    onChange={time => this.props.liveScoreUpdateBulkAction(time, 'endTime')}
                    onBlur={e =>
                      this.props.liveScoreUpdateBulkAction(
                        e.target.value && moment(e.target.value, 'HH:mm'),
                        'endTime',
                      )
                    }
                    value={abandonData.endTime}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* venue drop down view */}
          <InputWithHead
            heading={AppConstants.venue}
            // required="required-field"
          />
          <div>
            <Select
              showSearch
              style={{ paddingRight: 1, minWidth: 182 }}
              className="reg-form-multiple-select w-100"
              onChange={venueId => this.onVenueSelection(venueId, 'venueId')}
              placeholder={AppConstants.selectVenue}
              value={abandonData.venueId ? abandonData.venueId : []}
              optionFilterProp="children"
              onSearch={e => this.onSearchVenue(e)}
            >
              {venueData &&
                venueData.map(item => (
                  <Option key={`venue_${item.venueId}`} value={item.venueId}>
                    {item.venueName}
                  </Option>
                ))}
            </Select>
          </div>

          {/* court drop down view */}
          <InputWithHead heading={AppConstants.court} required="pb-0" />
          <div>
            <Select
              mode="multiple"
              className="w-100"
              style={{ paddingRight: 1, minWidth: 182 }}
              onChange={courtId => {
                this.props.liveScoreUpdateBulkAction(courtId, 'courtId');
                this.props.clearFilter();
              }}
              placeholder={AppConstants.selectCourt}
              value={abandonData.courtId}
              onSearch={value => {
                this.handleSearch(value, mainCourtList);
              }}
              filterOption={false}
            >
              {abandonCourtData &&
                abandonCourtData.map(item => (
                  <Option key={`court_${item.venueCourtId}`} value={item.venueCourtId}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </div>

          {/* result type */}
          <div className="fluid-width">
            <InputWithHead
              heading={AppConstants.round_1}
              // required="required-field"
            />
            <div>
              <Select
                className="w-100"
                style={{ paddingRight: 1, minWidth: 182 }}
                onChange={roundId => this.props.liveScoreUpdateBulkAction(roundId, 'roundId')}
                placeholder={AppConstants.selectRoundOne}
                value={abandonData.roundId ? abandonData.roundId : []}
                showSearch
                optionFilterProp="children"
              >
                {roundResult.map(item => (
                  <Option key={`round_${item.id}`} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <span className="text-heading-large mt-5 mb-0">{AppConstants.abandon}</span>
        <InputWithHead heading={AppConstants.selectReason} required="required-field" />
        <div>
          <Form.Item
            name="reason"
            rules={[{ required: true, message: ValidationConstants.selectReason }]}
          >
            <Select
              className="w-100"
              style={{ paddingRight: 1, minWidth: 182 }}
              // onChange={selectReason => this.setState({ selectReason })}
              placeholder={AppConstants.selectReason}
              onChange={resultType =>
                this.props.liveScoreUpdateBulkAction(resultType, 'resultType')
              }
              // value={abandonData.resultType ? abandonData.resultType : []}
            >
              {/* {isArrayNotEmpty(matchResult) && matchResult.map((item) => (
                                <Option key={'reason_' + item.id} value={item.id}>
                                    {item.code}
                                </Option>
                            ))} */}
              <Option value="8">Incomplete</Option>
              <Option value="9">Not Played</Option>
            </Select>
          </Form.Item>
        </div>
      </div>
    );
  }

  handleSubmit = values => {
    const {
      selectedOption,
      pushBackData,
      bringForwardData,
      endMatchData,
      doubleHeaderResult,
      abandonData,
      bulkRadioBtn,
    } = this.props.liveScoreBulkMatchState;

    if (selectedOption === 'pushBack') {
      const startDate = moment(pushBackData.startDate).format('YYYY-MMM-DD');
      const startTime = moment(pushBackData.startTime).format('HH:mm');
      const postStartDate = moment(`${startDate} ${startTime}`);
      const formatedStartDate = new Date(postStartDate).toISOString();
      const endDate = moment(pushBackData.endDate).format('YYYY-MMM-DD');
      const endTime = moment(pushBackData.endTime).format('HH:mm');
      const postEndDate = moment(`${endDate} ${endTime}`);
      const formatedEndDate = new Date(postEndDate).toISOString();

      let formatedNewDate = '';

      if (bulkRadioBtn === 'fixedDuration') {
        if (pushBackData.hours == '' && pushBackData.minutes == '' && pushBackData.seconds == '') {
          message.config({ duration: 0.9, maxCount: 1 });
          message.error(ValidationConstants.selectMinuteHourSecond);
        } else {
          this.props.BulkMatchPushBackAction(
            pushBackData,
            formatedStartDate,
            formatedEndDate,
            bulkRadioBtn,
            formatedNewDate,
          );
          this.setState({ loading: true });
        }
      } else if (bulkRadioBtn === 'specificTime') {
        if (pushBackData.optionalDate == '' || pushBackData.optionalTime == '') {
          message.config({ duration: 0.9, maxCount: 1 });
          message.error(ValidationConstants.specificTime);
        } else {
          const newDate = moment(pushBackData.optionalDate).format('YYYY-MMM-DD');
          const newTime = moment(pushBackData.optionalTime).format('HH:mm');
          const postNewDate = moment(`${newDate} ${newTime}`);
          formatedNewDate = new Date(postNewDate).toISOString();
          this.props.BulkMatchPushBackAction(
            pushBackData,
            formatedStartDate,
            formatedEndDate,
            bulkRadioBtn,
            formatedNewDate,
          );
          this.setState({ loading: true });
        }
      } else {
        this.props.BulkMatchPushBackAction(
          pushBackData,
          formatedStartDate,
          formatedEndDate,
          bulkRadioBtn,
          formatedNewDate,
        );
        this.setState({ loading: true });
      }
    } else if (selectedOption === 'bringForward') {
      const startDate = moment(bringForwardData.startDate).format('YYYY-MMM-DD');
      const startTime = moment(bringForwardData.startTime).format('HH:mm');
      const postStartDate = moment(`${startDate} ${startTime}`);
      const formatedStartDate = new Date(postStartDate).toISOString();

      const endDate = moment(bringForwardData.endDate).format('YYYY-MMM-DD');
      const endTime = moment(bringForwardData.endTime).format('HH:mm');
      const postEndDate = moment(`${endDate} ${endTime}`);
      const formatedEndDate = new Date(postEndDate).toISOString();

      let formatedNewDate = '';

      if (bulkRadioBtn === 'fixedDuration') {
        if (
          bringForwardData.hours == '' &&
          bringForwardData.minutes == '' &&
          bringForwardData.seconds == ''
        ) {
          message.config({ duration: 0.9, maxCount: 1 });
          message.error(ValidationConstants.selectMinuteHourSecond);
        } else {
          this.props.liveScoreBringForwardAction(
            null,
            bringForwardData,
            formatedStartDate,
            formatedEndDate,
            bulkRadioBtn,
            formatedNewDate,
          );
          this.setState({ loading: true });
        }
      } else if (bulkRadioBtn === 'specificTime') {
        if (bringForwardData.optionalDate == '' || bringForwardData.optionalTime == '') {
          message.config({ duration: 0.9, maxCount: 1 });
          message.error(ValidationConstants.specificTime);
        } else {
          const newDate = moment(bringForwardData.optionalDate).format('YYYY-MMM-DD');
          const newTime = moment(bringForwardData.optionalTime).format('HH:mm');
          const postNewDate = moment(`${newDate} ${newTime}`);
          formatedNewDate = new Date(postNewDate).toISOString();

          this.props.liveScoreBringForwardAction(
            null,
            bringForwardData,
            formatedStartDate,
            formatedEndDate,
            bulkRadioBtn,
            formatedNewDate,
          );
          this.setState({ loading: true });
        }
      } else {
        this.props.liveScoreBringForwardAction(
          null,
          bringForwardData,
          formatedStartDate,
          formatedEndDate,
          bulkRadioBtn,
          formatedNewDate,
        );
        this.setState({ loading: true });
      }
    } else if (selectedOption === 'endMatch') {
      const startDate = moment(endMatchData.startDate).format('YYYY-MMM-DD');
      const startTime = moment(endMatchData.startTime).format('HH:mm');
      const postStartDate = moment(`${startDate} ${startTime}`);
      const formatedStartDate = new Date(postStartDate).toISOString();
      const endDate = moment(endMatchData.endDate).format('YYYY-MMM-DD');
      const endTime = moment(endMatchData.endTime).format('HH:mm');
      const postEndDate = moment(`${endDate} ${endTime}`);
      const formatedEndDate = new Date(postEndDate).toISOString();

      this.props.liveScoreEndMatchesdAction(endMatchData, formatedStartDate, formatedEndDate);
      this.setState({ loading: true });
    } else if (selectedOption === 'doubleHeader') {
      this.props.liveScoreDoubleHeaderAction(doubleHeaderResult);
      this.setState({ loading: true });
    } else if (selectedOption === 'abandonMatch') {
      // let formatedStartDate = formatDateTime(abandonData.startDate, abandonData.startTime)
      // let formatedEndDate = formatDateTime(abandonData.endDate, abandonData.endTime)

      const startDate = moment(abandonData.startDate).format('YYYY-MMM-DD');
      const startTime = moment(abandonData.startTime).format('HH:mm');
      const postStartDate = moment(`${startDate} ${startTime}`);
      const formatedStartDate = new Date(postStartDate).toISOString();

      const endDate = moment(abandonData.endDate).format('YYYY-MMM-DD');
      const endTime = moment(abandonData.endTime).format('HH:mm');
      const postEndDate = moment(`${endDate} ${endTime}`);
      const formatedEndDate = new Date(postEndDate).toISOString();

      this.props.liveScoreAbandonMatchAction(abandonData, formatedStartDate, formatedEndDate);
      this.setState({ loading: true });
    }
  };

  footerView = isSubmitting => (
    <div className="fluid-width">
      <div className="footer-view bulk">
        <div className="row">
          <div className="col-sm">
            <div className="reg-add-save-button">
              <Button
                className="cancelBtnWidth"
                onClick={() => history.push('/matchDayDashboard')}
                type="cancel-button"
              >
                {AppConstants.cancel}
              </Button>
            </div>
          </div>
          <div className="col-sm">
            <div className="comp-buttons-view">
              <Button
                className="publish-button save-draft-text mr-0"
                type="primary"
                htmlType="submit"
                disabled={isSubmitting}
              >
                {AppConstants.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    return (
      <div className="fluid-width">
        <Loader visible={this.props.liveScoreBulkMatchState.onLoad} />
        <DashboardLayout
          menuHeading={AppConstants.matchDay}
          menuName={AppConstants.liveScores}
          onMenuHeadingClick={() => history.push('./matchDayCompetitions')}
        />
        <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="12" />
        <Layout>
          {this.headerView()}
          <Form ref={this.formRef} onFinish={this.handleSubmit} noValidate="noValidate">
            <Content>
              <div className="formView CornerView">{this.contentView()}</div>
            </Content>
            <Footer>{this.footerView()}</Footer>
          </Form>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      BulkMatchPushBackAction,
      liveScoreBringForwardAction,
      liveScoreEndMatchesdAction,
      liveScoreBulkMatchAction,
      liveScoreUpdateBulkAction,
      liveScoreDoubleHeaderAction,
      getCompetitionVenuesList,
      getliveScoreDivisions,
      liveScoreAbandonMatchAction,
      matchResult,
      liveScoreRoundListAction,
      searchCourtList,
      clearFilter,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    liveScoreState: state.LiveScoreState,
    liveScoreBulkMatchState: state.LiveScoreBulkMatchState,
    liveScoreRoundState: state.LiveScoreRoundState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreBulkChange);
