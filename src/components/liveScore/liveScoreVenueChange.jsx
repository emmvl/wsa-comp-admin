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
import { liveScoreUpdateVenueChange } from '../../store/actions/LiveScoreAction/liveScoreVenueChamgeAction'
import { isArrayNotEmpty } from '../../util/helpers'
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { getCompetitonVenuesList, } from '../../store/actions/LiveScoreAction/liveScoreMatchAction'
import history from '../../util/history'


const { Header, Footer, Content } = Layout;
const { Option } = Select;

class LiveScoreVenueChange extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.getCompetitonVenuesList(id);
        } else {
            history.push('/')
        }

    }



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
                            {AppConstants.venueChange}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };



    ////////form content view
    contentView = () => {
        return (
            <div className="content-view pt-4">
                {/* <span className='bulk-match-heading' >{AppConstants.whatDoWantDO}</span> */}
                {this.venueChangeView()}
            </div>
        );
    };



    ////this method called after slecting Venue Change option from drop down
    venueChangeView() {
        const { venueChangeData, venueData, courtData } = this.props.liveScoreVenueChangeState
        let venueList = isArrayNotEmpty(venueData) ? venueData : []
        let courtList = isArrayNotEmpty(courtData) ? courtData : []
        
        return (
            <div>
                {/* start time date and time picker row */}
                <span className='bulk-match-heading mt-5 mb-0' >{AppConstants.changeMatchCriteria}</span>
                
                <div className="fluid-width">
                    
                    <div className="row">
                        
                        <div className="col-sm" style={{ marginTop: 5 }}>
                        <InputWithHead heading={AppConstants.startDate} />
                            <DatePicker
                                size="large"
                                style={{ width: "100%" }}
                                format={"DD-MM-YYYY"}
                                showTime={false}
                            // onChange={(startDate) => this.props.liveScoreUpdateVenueChange(moment(startDate).format('YYYY-MM-DD'), "startDate")}
                            // value={venueChangeData.startDate}

                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                        <InputWithHead heading={AppConstants.startTime} />
                            <TimePicker
                                className="comp-venue-time-timepicker"
                                style={{ width: "100%" }}
                                defaultOpenValue={moment("00:00", "hh:mm")}
                                format={"hh:mm"}
                                use12Hours={false}
                            // onChange={(startTime) => this.props.liveScoreUpdateVenueChange(moment(startTime).format('DD-MM-YYYY'), "startTime")}
                            // value={venueChangeData.startTime}
                            />
                        </div>
                    </div>
                </div>

                {/* end time date and time picker row */}
               
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                        <InputWithHead heading={AppConstants.endDate} />
                            <DatePicker
                                size="large"
                                style={{ width: "100%" }}
                                format={"DD-MM-YYYY"}
                                showTime={false}
                                name={'registrationOepn'}
                            // onChange={(endDate) => this.props.liveScoreUpdateVenueChange(moment(endDate).format('DD-MM-YYYY'), "endDate")}
                            // value={venueChangeData.endDate}
                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                        <InputWithHead heading={AppConstants.endTime} />
                            <TimePicker
                                className="comp-venue-time-timepicker"
                                style={{ width: "100%" }}
                                defaultOpenValue={moment("00:00", "HH:mm")}
                                format={"HH:mm"}
                            // onChange={(endTime) => this.props.liveScoreUpdateVenueChange(moment(endTime).format('DD-MM-YYYY'), "endTime")}
                            // value={venueChangeData.endTime}
                            />

                        </div>
                    </div>
                </div>

                {/* venue drop down view */}
                <InputWithHead heading={AppConstants.venue} />
                <div>
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        placeholder={AppConstants.selectVenue}
                        onChange={(venueId) => this.props.liveScoreUpdateVenueChange(venueId, "venueId")}
                        value={venueChangeData.venueId}>

                        {venueList.map((item) => {
                            return (
                                <Option key={'venue' + item.id}
                                    value={item.venueId}>
                                    {item.venueName}

                                </Option>
                            )
                        })}

                    </Select>

                </div>

                {/* court drop down view */}
                <InputWithHead heading={AppConstants.court} />
                <div>
                    <Select
                        mode='multiple'
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        placeholder={AppConstants.selectCourt}
                        onChange={(courtId) => this.props.liveScoreUpdateVenueChange(courtId, "courtId")}
                        value={venueChangeData.courtId}
                    >
                        {courtList.map((item) => {
                            return (
                                <Option key={'court' + item.venueCourtId}
                                    value={item.venueCourtId}>
                                    {item.name}
                                </Option>
                            )
                        })}
                    </Select>

                </div>

            </div>
        )
    }



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

        return (
            <div className="fluid-width">
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"13"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">{this.contentView()}</div>
                    </Content>
                    <Footer >{this.footerView()}</Footer>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreUpdateVenueChange,
        getCompetitonVenuesList
    }, dispatch)
}
function mapStatetoProps(state) {
    return {
        liveScoreVenueChangeState: state.LiveScoreVenueChangeState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreVenueChange));



