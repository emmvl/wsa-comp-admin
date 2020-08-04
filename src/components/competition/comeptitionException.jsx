import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    DatePicker,
    TimePicker,
    Form,
    message,
    Modal
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import moment from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ValidationConstants from '../../themes/validationConstant'
import { venueListAction, courtListAction } from '../../store/actions/commonAction/commonAction'
import { updateCourtTimingsDrawsAction, getActiveRoundsAction } from "../../store/actions/competitionModuleAction/competitionDrawsAction"
import { generateDrawAction } from "../../store/actions/competitionModuleAction/competitionModuleAction";
import { isArrayNotEmpty } from "../../util/helpers";
import { NavLink } from 'react-router-dom';
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import {
    getOwn_competitionStatus,
    getOrganisationData
} from "../../util/sessionStorage"

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class CompetitionException extends Component {
    constructor(props) {
        super(props);
        this.state = {
            venueId: null,
            venueCourtId: null,
            matchDate: null,
            time: null,
            drawsObj: this.props.location ? this.props.location.state ? this.props.location.state.drawsObj ? this.props.location.state.drawsObj : null : null : null,
            courtLoad: false,
            matchDuration: null,
            drawsId: null,
            reGenerateDrawLoad: false,
            exceptionUpdateLoad: false,
            roundLoad: false,
            drawGenerateModalVisible: false,
            generateRoundId: null
        };
    }

    componentDidMount() {
        if (this.props.location.state && this.props.location.state.drawsObj) {
            this.props.venueListAction();
            let drawsData = this.state.drawsObj
            let venueId = drawsData.venueId
            let venueCourtId = drawsData.venueCourtId
            let startDate = moment(drawsData.matchDate).format("DD-MM-YYYY")
            let matchDate = moment(startDate, "DD-MM-YYYY")
            let time = drawsData.startTime
            let endTime = new Date("01/01/2007 " + drawsData.endTime);
            let startTime = new Date("01/01/2007 " + drawsData.startTime);
            let diffTime = endTime.getTime() - startTime.getTime()
            let matchDuration = Math.round(diffTime / 60000)
            let drawsId = drawsData.drawsId
            let yearRefId = this.props.location.state.yearRefId;
            let competitionId = this.props.location.state.competitionId;
            let organisationId = this.props.location.state.organisationId;
            this.setState({
                venueId, venueCourtId, matchDate, time, matchDuration, drawsId,
                yearRefId, competitionId, organisationId
            })
            this.props.courtListAction(venueId)
        }
        else {
            history.push("/competitionDraws")
        }
    }

    componentDidUpdate(nextProps) {
        let drawsState = this.props.drawsState;
        let competitionModuleState = this.props.competitionModuleState;
        let courtListData = this.props.commonReducerState.courtList
        if (nextProps.commonReducerState !== this.props.commonReducerState) {
            if (nextProps.commonReducerState.courtListData !== courtListData) {
                if (this.props.commonReducerState.courtLoad == false && this.state.courtLoad)
                    if (courtListData.length > 0) {
                        let venueCourtId = courtListData[0].id
                        if (this.state.venueCourtId == null) {
                            this.setState({
                                venueCourtId: venueCourtId
                            })
                        }
                    }
            }
        }

        if (nextProps.drawsState != drawsState) {
            if (drawsState.updateLoad == false && this.state.exceptionUpdateLoad == true) {
                this.setState({ exceptionUpdateLoad: false });

                let competitionStatus = getOwn_competitionStatus();
                if(competitionStatus != 2){
                    this.callGenerateDraw();
                }
                else{
                    this.props.getActiveRoundsAction(this.state.yearRefId, this.state.firstTimeCompId);
                    this.setState({ roundLoad: true });
                }
              
            }
        }

        if (nextProps.competitionModuleState != competitionModuleState) {
            if (competitionModuleState.drawGenerateLoad == false && this.state.reGenerateDrawLoad == true) {
                this.setState({ reGenerateDrawLoad: false });
                history.push('/competitionDraws');
            }
        }

        if (
            this.state.roundLoad == true && this.props.drawsState.onActRndLoad == false
          ) {
            this.setState({roundLoad: false});
            if(this.props.drawsState.activeDrawsRoundsData!= null && 
              this.props.drawsState.activeDrawsRoundsData.length > 0){
                this.setState({drawGenerateModalVisible: true})
              }
              else{
                this.callGenerateDraw();
                // message.config({ duration: 0.9, maxCount: 1 });
                // message.info(AppConstants.roundsNotAvailable);
              }
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
                    <Breadcrumb style={{
                        display: 'flex',
                        lignItems: 'center',
                        alignSelf: 'center'
                    }} separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.exception}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };



    ////////form content view
    contentView = (getFieldDecorator) => {
        return (
            <div className="content-view pt-4">

                {this.exceptionView(getFieldDecorator)}
            </div>
        );
    };

    onChangeVenue(venueId) {
        this.setState({ venueId, venueCourtId: null, courtLoad: true })

        this.props.courtListAction(venueId)
    }

    changeVenueCourtId(courtID) {
        this.setState({ venueCourtId: courtID })
    }



    ////this method called after slecting Venue Change option from drop down
    exceptionView(getFieldDecorator) {

        const { venueList, courtList } = this.props.commonReducerState
        const venueData = isArrayNotEmpty(venueList) ? venueList : []
        const courtData = isArrayNotEmpty(courtList) ? courtList : []
        return (
            <div>
                {/* start time date and time picker row */}
                <span className='form-heading' style={{ textAlign: 'start' }}>{AppConstants.exceptionHeading}</span>
                <div className="fluid-width">
                    {/* venue drop down view */}
                    <InputWithHead required={"required-field"} heading={AppConstants.venue} />
                    <div>

                        <Select
                            showSearch
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            placeholder={AppConstants.selectVenue}
                            onChange={(venueId) => this.onChangeVenue(venueId)}
                            value={this.state.venueId}
                        >

                            {venueData.map((item) => {
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
                    <InputWithHead required={"required-field pb-0"} heading={AppConstants.court} />
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182, paddingTop: 0, marginTop: 0 }}
                        placeholder={AppConstants.selectCourt}
                        value={this.state.venueCourtId}
                        onChange={(venueCourtId) => this.changeVenueCourtId(venueCourtId)}
                    >
                        {courtData.map((item) => {
                            return (
                                <Option key={'court' + item.id}
                                    value={item.id}>
                                    {item.name}
                                </Option>
                            )
                        })}
                    </Select>


                    <div className="row">

                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead required={"required-field"} heading={AppConstants.date} />

                            <DatePicker
                                size="large"
                                style={{ width: "100%" }}
                                format={"DD-MM-YYYY"}
                                placeholder={"dd-mm-yyyy"}
                                onChange={(startDate) => this.onChangeDate(moment(startDate).format("YYYY-MM-DD"))}
                                value={moment(this.state.matchDate)}
                            />

                        </div>

                    </div>
                </div>

                {/* end time date and time picker row */}

                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead required={"required-field"} heading={AppConstants.time} />

                            <TimePicker
                                className="comp-venue-time-timepicker"
                                style={{ width: "100%" }}
                                format={"HH:mm"}
                                onChange={(endTime) => this.onChangeTime(endTime)}
                                value={moment(this.state.time, "HH:mm")}
                            />

                        </div>
                    </div>
                </div>

            </div>
        )
    }

    onChangeTime(endtime) {
        let time = endtime.format("HH:mm")
        this.setState({ time })
    }


    onChangeDate(value) {
        this.setState({ matchDate: value })
    }
    /// for post api of court timming
    courttiming() {
        if (this.state.venueCourtId == null) {
            message.config({ duration: 0.9, maxCount: 1 })
            message.error("Please select court id")
        }
        else {
            let matchDate = moment(this.state.matchDate).format('YYYY-MM-DD') + " " + this.state.time
            var date = moment(this.state.time, "hh:mm:ss A").add(this.state.matchDuration, "minute")
            let postObj =
            {
                "drawsId": this.state.drawsId,
                "venueCourtId": this.state.venueCourtId,
                "matchDate": matchDate,
                "startTime": this.state.time,
                "endTime": moment(date).format("HH:mm")
            }
            this.props.updateCourtTimingsDrawsAction(postObj, null, null, "exception")
            this.setState({ exceptionUpdateLoad: true });
        }
    }

    reGenerateDraw = () => {
        let competitionStatus = getOwn_competitionStatus();
        if(competitionStatus == 2){
          this.props.getActiveRoundsAction(this.state.yearRefId, this.state.firstTimeCompId);
          this.setState({ roundLoad: true });
        }
        else{
          this.callGenerateDraw();
        }
    }

    handleGenerateDrawModal =  (key) =>{
        if(key == "ok"){
          if(this.state.generateRoundId!= null){
            this.callGenerateDraw();
            this.setState({drawGenerateModalVisible: false});
          }
          else{
            message.error("Please select round");
          }
        }
        else{
          this.setState({drawGenerateModalVisible: false});
        }
      }
    
      callGenerateDraw = () =>{
        let payload = {
          yearRefId: this.state.yearRefId,
          competitionUniqueKey: this.state.firstTimeCompId,
          organisationId: getOrganisationData().organisationUniqueKey,
          roundId: this.state.generateRoundId
        };
        this.props.generateDrawAction(payload);
        this.setState({ reGenerateDrawLoad: true });
      }


    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        let activeDrawsRoundsData = this.props.drawsState.activeDrawsRoundsData;
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <NavLink to='/competitionDraws'>
                                    <Button type="cancel-button">{AppConstants.cancel}</Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="user-approval-button" type="primary" onClick={() => this.courttiming()} >
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                
                <Modal
                    className="add-membership-type-modal"
                    title="Regenerate Draw"
                    visible={this.state.drawGenerateModalVisible}
                    onOk={() => this.handleGenerateDrawModal("ok")}
                    onCancel={() => this.handleGenerateDrawModal("cancel")}>
                    <Select
                    className="year-select reg-filter-select-competition ml-2"
                        onChange={(e) => this.setState({generateRoundId: e})}
                        placeholder={'Round'}>
                        {(activeDrawsRoundsData || []).map((d, dIndex) => (
                                <Option key={d.roundId} 
                                value={d.roundId} >{d.name}</Option>
                            ))
                        }
                    
                    </Select>
                </Modal>
            </div>
        );
    };



    /////main render method
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width">
                <DashboardLayout
                    menuHeading={AppConstants.competitions}
                    menuName={AppConstants.competitions}
                />
                <InnerHorizontalMenu menu={'competition'} compSelectedKey={'24'} />
                <Layout>
                    {this.headerView()}
                    <Form
                        onSubmit={this.handleSubmit}
                        noValidate="noValidate">
                        <Content>
                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
                            <Loader visible={this.props.competitionModuleState.drawGenerateLoad} />
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
        venueListAction,
        courtListAction,
        updateCourtTimingsDrawsAction,
        generateDrawAction
    }, dispatch)
}
function mapStatetoProps(state) {
    return {
        commonReducerState: state.CommonReducerState,
        competitionModuleState: state.CompetitionModuleState,
        drawsState: state.CompetitionDrawsState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionException));



