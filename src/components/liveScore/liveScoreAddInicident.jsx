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
import { liveScoreUpdateIncidentData } from '../../store/actions/LiveScoreAction/liveScoreIncidentAction'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import history from "../../util/history";
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import { isArrayNotEmpty, captializedString } from "../../util/helpers";
import { getLiveScoreCompetiton } from '../../util/sessionStorage';
import { liveScorePlayerListAction } from '../../store/actions/LiveScoreAction/liveScorePlayerAction'


const { Footer, Content, Header } = Layout;
const { Option } = Select;

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
        const { id } = JSON.parse(getLiveScoreCompetiton())

        // this.props.liveScoreClearIncident();

        if (id !== null) {
            this.props.getliveScoreTeams(id);
            this.props.liveScorePlayerListAction(id);
        }
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

    Capitalize(str) {
        let text = str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
        return text
        // return str.charAt(0).toUpperCase() + str.slice(1);
    }
    //// Form View
    contentView = (getFieldDecorator) => {
        const { incidentData, teamResult, playerResult, teamId } = this.props.liveScoreIncidentState
        console.log(incidentData, "incidentData")
        let playerData = isArrayNotEmpty(playerResult) ? playerResult : []

        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead required={"required-field"} heading={AppConstants.date} />


                        <DatePicker
                            size="large"
                            style={{ width: "100%" }}
                            onChange={(date) => { this.props.liveScoreUpdateIncidentData(moment(date).format('MM/DD/YYYY'), "date") }}
                            format={"DD-MM-YYYY"}
                            showTime={false}
                            name={'registrationOepn'}
                            placeholder={"dd-mm-yyyy"}
                            value={incidentData ? incidentData.date ? moment(incidentData.date) : '' : ''}

                        />

                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.time} />

                        <TimePicker
                            className="comp-venue-time-timepicker"
                            style={{ width: "100%" }}
                            onChange={(time) => this.props.liveScoreUpdateIncidentData(time, 'time  ')}
                            format={"HH:mm"}
                            placeholder='Select Time'
                            defaultOpenValue={moment("00:00", "HH:mm")}
                            use12Hours={false}
                        />
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead
                            heading={AppConstants.matchID}
                            placeholder={AppConstants.matchID}
                            onChange={(event) => this.props.liveScoreUpdateIncidentData(event.target.value, "mnbMatchId")}
                            value={incidentData ? incidentData.mnbMatchId : ''} />
                    </div>
                    <div className="col-sm" >
                        <Form.Item className="slct-in-add-manager-livescore">
                            <InputWithHead
                                required={"required-field "}
                                heading={AppConstants.team} />
                            {getFieldDecorator("incidentTeamName", {
                                rules: [{ required: true, message: ValidationConstants.teamName }],
                            })(

                                <Select
                                    showSearch
                                    mode="multiple"
                                    className="reg-form-multple-select"
                                    placeholder='Select Home Team'
                                    style={{ width: "100%" }}
                                    onChange={(homeTeam) => this.props.liveScoreUpdateIncidentData(homeTeam, "team1id")}
                                    value={incidentData.team1Id ? incidentData.team1Id : ''}

                                    optionFilterProp="children"
                                >
                                    {isArrayNotEmpty(teamResult) && teamResult.map((item) => (
                                        < Option value={item.id} > {item.name}</Option>
                                    ))
                                    }
                                </Select>
                            )}

                        </Form.Item>
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item className="slct-in-add-manager-livescore">
                            <InputWithHead
                                required={"required-field "}
                                heading={AppConstants.players} />
                            {getFieldDecorator("incidentPlayerName", {
                                rules: [{ required: true, message: ValidationConstants.playerName }],
                            })(
                                <Select
                                    loading={this.props.liveScoreState.onLoad == true && true}
                                    mode="multiple"
                                    showSearch={true}
                                    placeholder={AppConstants.selectPlayer}
                                    style={{ width: "100%", }}
                                    onChange={(playerId) => this.props.liveScoreUpdateIncidentData(playerId, "playerId")}
                                >
                                    {isArrayNotEmpty(playerResult) && playerResult.map((item) => (
                                        < Option value={item.playerId} > {item.firstName + " " + item.lastName}</Option>
                                    ))
                                    }
                                </Select>
                            )}

                        </Form.Item>
                    </div>
                    <div className="col-sm">

                        <InputWithHead
                            type='text'
                            heading={AppConstants.incident}

                        />
                        <Select
                            // loading={this.props.liveScoreState.onLoad == true && true}
                            showSearch={true}
                            placeholder={AppConstants.selectIncident}
                            style={{ width: "100%", }}
                            onChange={(incident) => this.props.liveScoreUpdateIncidentData(incident, "injury")}
                            value={incidentData.injury ? incidentData.injury : undefined}
                        >
                            <Option value="SPECTATOR">{AppConstants._spectator}</Option>
                            <Option value="DISCIPLINE">{AppConstants.discipline}</Option>
                            <Option value="INJURY AMBULANCE">{AppConstants.injuryAmbulance}</Option>
                            <Option value="INJURY-FIRST ADD">{AppConstants.injuryFirstAdd}</Option>

                        </Select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <InputWithHead
                            heading={AppConstants.claim}
                            placeholder={AppConstants.yesNo}
                            onChange={(event) => this.props.liveScoreUpdateIncidentData(event.target.value, "claim")}
                            value={incidentData ? incidentData.claim : ""}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.description} />
                        <TextArea allowClear
                            onChange={(event) => this.props.liveScoreUpdateIncidentData(captializedString(event.target.value), "description")}
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
                                <Button onClick={() => history.push("/liveScoreIncidentList")} type="cancel-button">{AppConstants.cancel}</Button>
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
        const { getFieldDecorator } = this.props.form
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"17"} />

                <Layout>
                    {this.headerView()}

                    <Form onSubmit={this.onSaveClick} className="login-form" noValidate="noValidate">
                        <Content>
                            <div className="formView">
                                {this.contentView(getFieldDecorator)}
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
        liveScoreUpdateIncidentData,
        // liveScoreClearIncident,
        getliveScoreTeams,
        liveScorePlayerListAction
    }, dispatch)
}
function mapStateToProps(state) {
    return {
        liveScoreIncidentState: state.LiveScoreIncidentState,
        liveScoreState: state.LiveScoreState

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LiveScoreAddIncident));
