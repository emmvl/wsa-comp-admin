import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Button,
    Form,
    DatePicker,
    TimePicker,
    Select,
    InputNumber,
    Modal,
    Input,
} from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import moment from "moment";
import InputWithHead from "../../customComponents/InputWithHead";
import AppImages from "../../themes/appImages";
import { liveScoreUpdateIncident, liveScoreClearIncident } from '../../store/actions/LiveScoreAction/liveScoreIncidentAction'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import history from "../../util/history";
import {  captializedString } from '../../util/helpers';

const { Footer, Content, Header } = Layout;

const { TextArea } = Input;
class LiveScoreAddIncident extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            date: null,
            time: null,
            bodyData: "",
            image: null,
            media: null,
            video: null,
            imageSelection: '',
            videoSelection: '',
            date: null,
            time: null,
            incidentImage: '',
            incidentVideo: '',
            editorData: ""
        }
    }

    componentDidMount() {
        this.props.liveScoreClearIncident();
    }

    //Select Image
    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    //selet video
    selectVideo() {
        const fileInput = document.getElementById('user-vdo');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "video/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    setImage = (data) => {
        const { incidentData } = this.props.liveScoreIncidentState
        if (data.files[0] !== undefined) {
            if (this.state.isEdit == true) {

            }
            this.setState({ image: data.files[0], imageSelection: URL.createObjectURL(data.files[0]) })
            // this.props.liveScoreUpdateNewsAction(data.files[0], "newsImage")
        }
    };

    ////method to setVideo
    setVideo = (data) => {

        if (data.files[0] !== undefined) {
            if (this.state.isEdit == true) {
                // this.setState({ incidentVideo = '' })
            }
            this.setState({ video: data.files[0], videoSelection: URL.createObjectURL(data.files[0]) })
            // this.props.liveScoreUpdateNewsAction(URL.createObjectURL(data.files[0]), "newsVideo")
        }
    };

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view" style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                }} >
                    <div className="row" >
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">{this.state.isEdit == true ? AppConstants.editMatch : AppConstants.addIncident}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }


    //// Form View
    contentView = () => {
        const { incidentData } = this.props.liveScoreIncidentState
        // const { incidentData } = liveScoreIncidentState.incidentData
        console.log(incidentData, "liveScoreIncidentState")
        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead required={"required-field"} heading={AppConstants.date} />


                        <DatePicker
                            size="large"
                            style={{ width: "100%" }}
                            onChange={(date) => this.props.liveScoreUpdateIncident(moment(date).format('MM/DD/YYYY'), "date")}
                            format={"DD-MM-YYYY"}
                            showTime={false}
                            name={'registrationOepn'}
                            placeholder='Select Date'
                            value={incidentData ? incidentData.date ? moment(incidentData.date) : '' : ''}
                        // value={expiryDate ? moment(expiryDate) : ''}
                        />

                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.time} />


                        <TimePicker
                            className="comp-venue-time-timepicker"
                            style={{ width: "100%" }}
                            // onChange={(time) => this.props.liveScoreUpdateIncident(time.format('HH:mm'), "time  ")}
                            onChange={(time) => this.props.liveScoreUpdateIncident(time, "time")}
                            value={incidentData.time}
                            format={"HH:mm"}
                            minuteStep={15}
                            placeholder='Select Time'
                            use12Hours={false}
                        // value={incidentData ? incidentData.time ? moment(incidentData.time, 'HH:mm') : '' : ''}
                        // value={incidentData.time !== null && moment(incidentData.time, 'HH:mm')}
                        />
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead
                            heading={AppConstants.matchID}
                            placeholder={AppConstants.matchID}
                            onChange={(event) => this.props.liveScoreUpdateIncident(event.target.value, "mnbMatchId")}
                            value={incidentData.mnbMatchId} />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.team}
                            placeholder={AppConstants.team}
                            onChange={(event) => this.props.liveScoreUpdateIncident(event.target.value, "team")}
                            value={incidentData.team}
                        />
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead
                            heading={AppConstants.playerConst}
                            placeholder={AppConstants.selectPlayer}
                            name={"team1Score"}
                            onChange={(event) => this.props.liveScoreUpdateIncident(event.target.value, "player")}
                            value={incidentData.player}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead
                            heading={AppConstants.injury}
                            placeholder={AppConstants.selectInjury}
                            name={"team2Score"}
                            onChange={(event) => this.props.liveScoreUpdateIncident(event.target.value, "injury")}
                            value={incidentData.injury} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <InputWithHead
                            heading={AppConstants.claim}
                            placeholder={AppConstants.yesNo}
                            // name={"team2Score"}
                            onChange={(event) => this.props.liveScoreUpdateIncident(event.target.value, "claim")}
                            value={incidentData.claim}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.description} />
                        <TextArea allowClear
                               onChange={(event) => this.props.liveScoreUpdateIncident(captializedString(event.target.value), "description")}
                            // dangerouslySetInnerHTML={{ _html: editData.body }}
                            // dangerouslySetInnerHTML={{ __html: editData.body }}
                            // value={this.html2text(editData.body)}
                            value={incidentData.description}
                            name={'newsTitle'}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.addImages} />
                        <div className="reg-competition-logo-view" onClick={this.selectImage}>
                            <label>
                                <img
                                    src={this.state.imageSelection}
                                    alt=""
                                    height="120"
                                    width="120"
                                    style={{ borderRadius: 60, marginLeft: 0 }}
                                    name={'image'}
                                    onError={ev => {
                                        ev.target.src = AppImages.circleImage;
                                    }}
                                />
                            </label>
                        </div>
                        <input
                            type="file"
                            id="user-pic"
                            style={{ display: 'none' }}
                            onChange={(event) => this.setImage(event.target, 'evt.target')}
                        />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.addVideos} />
                        <div className="reg-competition-logo-view" onClick={this.selectVideo}>
                            <label>
                                <video
                                    src={this.state.videoSelection}
                                    height='120'
                                    width='120'
                                    poster={AppImages.circleImage}
                                />
                            </label>
                        </div>
                        <input
                            type="file"
                            id="user-vdo"
                            style={{ display: 'none' }}
                            onChange={(event) => this.setVideo(event.target, "evt.target")}
                        />
                    </div>
                </div>

            </div >
        )
    }

    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button  onClick={() => history.push("/liveScoreIncidentList")} type="cancel-button">{AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                {/* <Form.Item > */}
                                {/* <Button onClick={(editData.title == '' || editData.author == null) ? this.handleSubmit : this.onSaveButton} className="user-approval-button" */}
                                <Button className="user-approval-button"
                                    type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.save}
                                </Button>
                                {/* </Form.Item> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        // const { getFieldDecorator } = this.props.form
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick ={()=>history.push("./liveScoreCompetitions")}/>
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"17"} />

                <Layout>
                    {this.headerView()}

                    <Form className="login-form">
                        <Content>
                            <div className="formView">
                                {this.contentView()}
                            </div>
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
        liveScoreUpdateIncident,
        liveScoreClearIncident
    }, dispatch)
}
function mapStateToProps(state) {
    return {
        liveScoreIncidentState: state.LiveScoreIncidentState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LiveScoreAddIncident));
