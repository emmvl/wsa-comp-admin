import React, { Component } from "react";
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
    Form
} from "antd";
import "./competition.css";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import moment from "moment";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateVenuAndTimeDataAction, updateVenuListAction, refreshVenueFieldsAction, 
    removeObjectAction, venueByIdAction, clearVenueDataAction } from '../../store/actions/competitionModuleAction/venueTimeAction'
import { getYearAndCompetitionAction } from '../../store/actions/appAction'
import { getCommonRefData, addVenueAction } from '../../store/actions/commonAction/commonAction'
import { getOrganisationAction } from "../../store/actions/userAction/userAction";
import history from '../../util/history'
import ValidationConstants from "../../themes/validationConstant";
import AppImages from "../../themes/appImages";
import Loader from '../../customComponents/loader';
import CSVReader from 'react-csv-reader'

const { Header, Footer, Content } = Layout;
const { Option } = Select;
let this_Obj = null;

const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header =>
      header
        .toLowerCase()
        .replace(/\W/g, '_'),
    complete: function(results, file) {
        console.log("Parsing complete:", results, file);
    }
  }

class CompetitionVenueAndTimesEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
           // initialData: null,
            getDataLoading: false,
            venueId: 0,
            saveContraintLoad: false,
            firstTimeCompId: null,
            yearRefId: 1,
            screenNavigationKey: null,
            venueOrganisation: [],
            csvData: null,
            loading:false,
            isUsed: false,
            courtColumns: [
                {
                    title: "Court Number",
                    dataIndex: "courtNumber",
                    key: "courtNumber",
                    render: (courtNumber, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        return (
                            <div style={{textAlign:'center'}}>
                                {courtNumber}
                            </div>
                        )
                    }
                },
                {
                    title: "Court Name",
                    dataIndex: "venueCourtName",
                    key: "venueCourtName",
                    render: (courtName, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        return (

                            <Form.Item >
                                {getFieldDecorator(`venueCourtName${index}`, {
                                    rules: [{ required: true, message: ValidationConstants.courtField[3] }],
                                })(
                                    <Input
                                        disabled={record.isDisabled}
                                        required={"required-field pt-0 pb-0"}
                                        className="input-inside-table-fees"
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
                    render: (lat, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        return (

                            <Form.Item >
                                {getFieldDecorator(`lat${index}`, {
                                    rules: [{ required: true, message: ValidationConstants.courtField[1] }],
                                })(
                                    <Input
                                        className="input-inside-table-venue-court"
                                        disabled={record.isDisabled}
                                        onChange={(lat) => this.props.updateVenuAndTimeDataAction(lat.target.value, index, 'lat', 'courtData')}
                                        setFieldsValue={lat}
                                        placeholder={'Longitude'}

                                    />
                                )}
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "Latitude",
                    dataIndex: "lng",
                    key: "lng",
                    render: (lng, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        return (
                            <Form.Item >
                                {getFieldDecorator(`lng${index}`, {
                                    rules: [{ required: true, message: ValidationConstants.courtField[2] }],
                                })(
                                    <Input className="input-inside-table-venue-court"
                                        disabled={record.isDisabled}
                                        onChange={(lng) => this.props.updateVenuAndTimeDataAction(lng.target.value, index, 'lng', 'courtData')}
                                        setFieldsValue={lng}
                                        placeholder={'Latitude'}
                                    />
                                )}
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "Override Venue Timeslots?",
                    dataIndex: "overideSlot",
                    key: "overideSlot",
                    width: 200,
                    render: (overideSlot, record, index) => (
                        <div>
                            <Checkbox
                                disabled={this.state.isUsed }
                                className="single-checkbox mt-1 d-flex justify-content-center"
                                defaultChecked={overideSlot}
                                onChange={e => this.overideVenueslotOnchange(e, index)}
                            ></Checkbox>
                        </div>
                    )
                },
                {
                    title: "",
                    dataIndex: "clear",
                    key: "clear",
                    render: (clear, record, index) => (
                        <span style={{ display: "flex", justifyContent: "center", width: "100%", cursor: 'pointer',  }}>
                           {!record.isDisabled && (
                            <img
                                className="dot-image"
                                src={AppImages.redCross}
                                alt=""
                                width="16"
                                height="16"
                                onClick={() => this.removeTableObj(clear, record, index)}
                            />
                            )}
                        </span>
                    )
                }
            ]

        };
        this_Obj = this;
        this.props.getCommonRefData()
        this.props.getOrganisationAction()
     
    }


    removeTableObj(clear, record, index) {
        this.props.updateVenuAndTimeDataAction("", index, "remove")
    }

    overideVenueslotOnchange(e, index) {
        this.props.updateVenuAndTimeDataAction(e.target.checked, index, 'overideSlot')
    }

    componentWillMount() {
       console.log("componentWillMount" + JSON.stringify(this.props.venueTimeState.venuData));
      // this.setState({initialData: this.props.venueTimeState.venuData});
    }

    componentDidMount() {
        console.log("componentDidMount");
        window.scroll(0,0);
        let venueId = this.props.location.state.venueId;
        let isUsed  = this.props.location.state.isUsed;
        this.props.updateVenuAndTimeDataAction(isUsed, 'venueIsUsed', "venueIsUsed")
        this.setState({
            screenNavigationKey: this.props.location.state.key,
            venueId: venueId,
            isUsed: isUsed
        })
        let payload = {
            venueId: venueId
        }
        this.props.venueByIdAction(payload);
        this.setState({getDataLoading: true});
    }

    componentDidUpdate(nextProps) {
        //console.log("componentDidUpdate" + JSON.stringify(nextProps));
        let competitionList = this.props.appState.competitionList
        if (this.state.saveContraintLoad == true && this.props.venueTimeState.onLoad == false) {
            console.log("this.state.screenNavigationKey:" + this.state.screenNavigationKey);
            this.navigateTo();
        }

        if (nextProps.venueTimeState !== this.props.venueTimeState) {
            if (this.props.venueTimeState.venueEditOnLoad === false && this.state.getDataLoading == true) {
                this.setState({
                    getDataLoading: false
                });
                this.setFormFieldValue();
                this.setVenueOrganisation();
            }

            if(this.state.csvData != null)
            {
                this.setState({csvData: null, loading:false});
                this.setFormFieldValue();
            }
           
        }

        if(nextProps.userState != this.props.userState){
            if(this.props.userState.onLoad == false)
            {
                this.setVenueOrganisation();
            }
        }
    }

    setFormFieldValue = () => {
        console.log("setFormFieldValue");
        let venueData = this.props.venueTimeState.venuData;

        this.props.form.setFieldsValue({
            name: venueData.venueName,
            shortName: venueData.shortName,
            addressOne: venueData.street1,
            suburb: venueData.suburb,
            stateRefId: venueData.stateRefId,
            postcode: venueData.postalCode
        });

        venueData.venueCourts.map((item, index) => {
            this.props.form.setFieldsValue({
                [`venueCourtName${index}`]: item.venueCourtName,
                [`lat${index}`]: item.lat,
                [`lng${index}`]: item.lng,
            });
        });
    }

    setVenueOrganisation = () => {
        let venueData = this.props.venueTimeState.venuData;
        let isVenueMapped = venueData.isVenueMapped;
        let affiliateData = venueData.affiliateData;
        let venueOrganisation = this.props.userState.venueOragnasation;

        if(venueOrganisation!= null && venueOrganisation.length > 0)
        {
            venueOrganisation.map((item, index) => {
                // let affiliate = affiliateData.find(x=>x == item.id);
                // if(affiliate!= null && affiliate!= undefined)
                // {
                //     item["isDisabled"] = isVenueMapped == true ? true: false;
                // }else{
                //     item["isDisabled"] = false;
                // }
                item["isDisabled"] = this.state.isUsed;
                
            });
            this.setState({venueOrganisation : venueOrganisation});
        }
    }

    navigateTo = () => {
       
        if(this.state.screenNavigationKey == AppConstants.venuesList){
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

    readVenueCourtCSV = (data) => {
       
        this.setState({csvData: data, loading: true});
        this.props.updateVenuAndTimeDataAction(data, "addGameAndCourtThroughCSV", 'venueCourts');
        let e = document.getElementById("venueCourtUpload");
        e.value = null;
      };

      getDisabledHours = (startTime) => {
        var hours = [];
        let startHour = startTime.split(':')[0];
        for(var i = 0; i < Number(startHour); i++){
            hours.push(i);
        }
        return hours;
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

    ////////form content view
    contentView = (getFieldDecorator) => {
        const { venuData } = this.props.venueTimeState
        const { stateList } = this.props.commonReducerState
       // const { venueOragnasation } = this.props.userState
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
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.name}
                            disabled={this.state.isUsed}
                            placeholder={AppConstants.name}
                            onChange={(name) => this.props.updateVenuAndTimeDataAction(name.target.value, 'Venue', 'name')}
                            setFieldsValue={venuData.name}
                        />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator('shortName', {
                        rules: [{ required: true, message: ValidationConstants.nameField[3] }],
                    })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.short_Name}
                            disabled={this.state.isUsed}
                            placeholder={AppConstants.short_Name}
                            onChange={(name) => this.props.updateVenuAndTimeDataAction(name.target.value, 'Venue', 'shortName')}
                            setFieldsValue={venuData.shortName}
                        />
                    )}
                </Form.Item>

                <Form.Item >
                    {getFieldDecorator('addressOne', {
                        rules: [{ required: true, message: ValidationConstants.addressField[0] }],
                    })(
                        <InputWithHead
                            required={"required-field pt-3 pb-0"}
                            heading={AppConstants.addressOne}
                            placeholder={AppConstants.addressOne}
                            onChange={(street1) => this.props.updateVenuAndTimeDataAction(street1.target.value, 'Venue', 'street1')}
                            setFieldsValue={venuData.street1}
                            disabled={this.state.isUsed}
                        />
                    )}
                </Form.Item>


                <InputWithHead
                    heading={AppConstants.addressTwo}
                    placeholder={AppConstants.addressTwo}
                    onChange={(street2) => this.props.updateVenuAndTimeDataAction(street2.target.value, 'Venue', 'street2')}
                    value={venuData.street2}
                    disabled={this.state.isUsed}
                />


                <Form.Item >
                    {getFieldDecorator('suburb', {
                        rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                    })(
                        <InputWithHead
                            required={"required-field pt-3 pb-0"}
                            heading={AppConstants.suburb}
                            placeholder={AppConstants.suburb}
                            onChange={(suburb) => this.props.updateVenuAndTimeDataAction(suburb.target.value, 'Venue', 'suburb')}
                            setFieldsValue={venuData.suburb}
                            disabled={this.state.isUsed}
                        />
                    )}
                </Form.Item>

                <InputWithHead
                    required={"required-field"}
                    heading={AppConstants.stateHeading}
                />

                <Form.Item >
                    {getFieldDecorator('stateRefId', {
                        rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                    })(
                        <Select
                            style={{ width: "100%" }}
                            placeholder={AppConstants.select}
                            onChange={(stateRefId) => this.props.updateVenuAndTimeDataAction(stateRefId, 'Venue', 'stateRefId')}
                            setFieldsValue={venuData.stateRefId}
                            disabled={this.state.isUsed}

                        >
                            {stateList.length > 0 && stateList.map((item) => (
                                < Option key={item.id} value={item.id}> {item.name}</Option>
                            ))
                            }
                        </Select>
                    )}
                </Form.Item>


                <Form.Item >
                    {getFieldDecorator('postcode', {
                        rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                    })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.postcode}
                            placeholder={AppConstants.postcode}
                            onChange={(postalCode) => this.props.updateVenuAndTimeDataAction(postalCode.target.value, 'Venue', 'postalCode')}
                            setFieldsValue={venuData.postalCode}
                            maxLength={4}
                            disabled={this.state.isUsed}
                        />
                    )}
                </Form.Item>

                <InputWithHead
                    heading={AppConstants.contactNumber}
                    placeholder={AppConstants.contactNumber}
                    onChange={(contactNumber) => this.props.updateVenuAndTimeDataAction(contactNumber.target.value, 'Venue', 'contactNumber')}
                    value={venuData.contactNumber}
                    disabled={this.state.isUsed}
                />

                <div className="fluid-width" style={{ marginTop: 25 }}>
                    <div className="row">
                        <div className="col-sm">
                            <Checkbox
                                disabled={this.state.isUsed}
                                className="single-checkbox"
                                checked={venuData.affiliate}
                                onChange={e => this.props.updateVenuAndTimeDataAction(e.target.checked, 'Venue', 'affiliate')}
                            >
                                {AppConstants.linkToHomeAffiliate}
                            </Checkbox>
                        </div>
                        {venuData.affiliate && (
                            <div className="col-sm">
                                <Select
                                    disabled={this.state.isUsed}
                                    mode="multiple"
                                    style={{ width: "100%" }}
                                    value={venuData.affiliateData}
                                    onChange={(affiliateData) => this.props.updateVenuAndTimeDataAction(affiliateData, 'editOrganisations', "editOrganisations")}
                                    placeholder={'Select '}
                                >
                                    {this.state.venueOrganisation.length > 0 && this.state.venueOrganisation.map((item, index) => (
                                        < Option key={item.id} value={item.id} disabled={item.isDisabled}> {item.name}</Option>
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
                        disabled={item.isDisabled}
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
                    <TimePicker
                        disabled={item.isDisabled}
                        key={"startTime"}
                        className="comp-venue-time-timepicker"
                        style={{ width: "100%" }}
                        onChange={(time) => time !== null && this.props.updateVenuAndTimeDataAction(time.format("HH:mm"), index, 'startTime', "gameTimeslot")}
                        value={moment(item.startTime, "HH:mm")}
                        format={"HH:mm "}
                        minuteStep={15}
                        use12Hours={false}
                    />
                </div>
                <div className="col-sm">
                    <InputWithHead heading={AppConstants.endTime} />
                    <TimePicker
                        disabled={item.isDisabled}
                        key={"endTime"}
                        disabledHours={()=>this.getDisabledHours(item.startTime)}
                        className="comp-venue-time-timepicker"
                        style={{ width: "100%" }}
                        onChange={(time) => time !== null && this.props.updateVenuAndTimeDataAction(time.format("HH:mm"), index, 'endTime', "gameTimeslot")}
                        value={moment(item.endTime, "HH:mm")}
                        format={"HH:mm "}
                        minuteStep={15}
                        use12Hours={false}
                    />
                </div>
                {!item.isDisabled && (
                    <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.props.removeObjectAction(index, item, 'gameTimeslot')}>
                        <span className="user-remove-btn">
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </span>
                        <span style={{ cursor: 'pointer' }} className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                    </div>
                )}
            </div>
        )
    }

    ///game day view
    gameDayView = (getFieldDecorator) => {
        const { gameDays } = this.props.venueTimeState.venuData
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">
                    {AppConstants.game_Days}
                    <span className="required-field" style={{fontSize:"14px"}}></span>
                </span>
                <div className="fluid-width">
                    {/* {this.gameData()} */}
                    {(gameDays || []).map((item, index) => {
                        return this.gameData(item, index, getFieldDecorator)
                    })}
                </div>
                { !this.state.isUsed ? 
                    <span style={{ cursor: 'pointer' }} onClick={() => this.props.updateVenuAndTimeDataAction(null, "addGameAndCourt", 'gameDays')} className="input-heading-add-another">
                        + {AppConstants.addAnotherDay}
                    </span> : null
                }  
            </div>
        );
    };

    expendedRowData(item, index, tableIndex, getFieldDecorator) {
        const { daysList } = this.props.commonReducerState
       // console.log(this.props.venueTimeState, 'this.props.venueTimeState')
        return (
            <div className="row" key={"expandedRow" + index}>
                <div className="col-sm">
                    <InputWithHead required={"pt-1"} heading={AppConstants.dayOfTheWeek} />
                    <Select
                        disabled={item.isDisabled}
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
                    <TimePicker
                        disabled={item.isDisabled}
                        className="comp-venue-time-timepicker"
                        style={{ width: "100%" }}
                        onChange={(time) => time !== null && this.props.updateVenuAndTimeDataAction(time.format("HH:mm"), index, 'startTime', "addTimeSlotField", tableIndex)}
                        value={moment(item.startTime, "HH:mm")}
                        format={"HH:mm "}
                        minuteStep={15}
                        use12Hours={false}
                    />
                </div>
                <div className="col-sm">
                    <InputWithHead required={"pt-1"} heading={AppConstants.endTime} />
                    <TimePicker
                        disabled={item.isDisabled}
                        className="comp-venue-time-timepicker"
                        disabledHours={()=>this.getDisabledHours(item.startTime)}
                        style={{ width: "100%" }}
                        onChange={(time) => time !== null && this.props.updateVenuAndTimeDataAction(time.format("HH:mm"), index, 'endTime', "addTimeSlotField", tableIndex)}
                        value={moment(item.endTime, "HH:mm")}
                        format={"HH:mm "}
                        minuteStep={15}
                        use12Hours={false}
                    />
                </div>
                { !item.isDisabled && (
                    <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.props.updateVenuAndTimeDataAction(null, index, 'removeButton', 'add_TimeSlot', tableIndex)}>
                    <span className="user-remove-btn">
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </span>
                    <span style={{ cursor: 'pointer' }} className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                    </div>
                )}
                
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
                {!this.state.isUsed ?
                    <span style={{ cursor: 'pointer' }} onClick={() => this.props.updateVenuAndTimeDataAction(null, tableIndex, 'availabilities', 'add_TimeSlot')} className="input-heading-add-another pt-3">
                        + {AppConstants.add_TimeSlot}
                    </span> : null
                }
            </div>
        )
    }

    //////court day view
    courtView = (getFieldDecorator) => {
        //console.log(this.props.venueTimeState.venuData.expandedRowKeys)
        console.log(this.props.venueTimeState.venuData);
        let venueTimestate = this.props.venueTimeState;
        let {venueCourts}  = venueTimestate.venuData;
        console.log("venueCourts::" +JSON.stringify(venueCourts));
        return (
            <div className="fees-view pt-5">
                <div style={{display:'flex'}}>
                    <span className="form-heading">{AppConstants.courts}
                    <span className="required-field" style={{fontSize:"14px", paddingTop: '5px'}}></span>
                    </span>
                    {!this.state.isUsed  ? 
                    <Button className="primary-add-comp-form" type="primary" style={{marginLeft:'auto'}}> 
                        <div className="row">
                            <div className="col-sm">
                            <label for="venueCourtUpload" className="csv-reader">
                                <img src={AppImages.import}  alt="" className="export-image"/> 
                                {AppConstants.import}
                            </label>
                            <CSVReader
                                inputId="venueCourtUpload"
                                inputStyle={{display:'none'}}
                                parserOptions={papaparseOptions}
                                onFileLoaded={this.readVenueCourtCSV}
                                />
                            </div>
                        </div>
                    </Button> : null
                    }
                </div>
                
                <div className="inside-container-view">
                    <div className="table-responsive">
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
                    {!this.state.isUsed ? 
                        <span style={{ cursor: 'pointer' }} onClick={() => this.props.updateVenuAndTimeDataAction(null, "addGameAndCourt", 'venueCourts')} className="input-heading-add-another">
                            + {AppConstants.addCourt}
                        </span> : null
                    }
                </div>
            </div>
        );
    };

    onAddVenue = (e) => {
        e.preventDefault();
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
                else if(venuData.gameDays.length == 0){
                    message.error(ValidationConstants.emptyGameDaysValidation);
                }
                else {
                    console.log("venuData" + JSON.stringify(venuData));
                    this.props.addVenueAction(venuData)
                    this.setState({ saveContraintLoad: true });
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
                                <Button className="open-reg-button" type="primary" style={{marginRight: '20px'}} onClick={() => this.navigateTo()}>
                                    {AppConstants.cancel}
                                </Button>
                                {!this.state.isUsed ?
                                <Button className="open-reg-button" type="primary" htmlType="submit">
                                    {AppConstants.save}
                                </Button>
                                : null }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ////Show success message after success response
    // success = () => {
    //     this.props.commonReducerState.addVenueSuccessMsg = ""
    //     message.success('Venue - Added Sucessfully')
    //     this.props.refreshVenueFieldsAction()
    //     history.push('/competitionVenueTimesPrioritisation')
    // };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.user}
                    menuName={AppConstants.user}
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
                            <Loader visible={this.props.venueTimeState.onLoad} />
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
        getOrganisationAction,
        removeObjectAction,
        venueByIdAction,
        clearVenueDataAction
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
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionVenueAndTimesEdit));

