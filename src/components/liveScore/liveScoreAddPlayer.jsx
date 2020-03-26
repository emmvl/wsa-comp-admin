import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Form
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import AppImages from "../../themes/appImages";
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'
import { liveScoreUpdatePlayerDataAction, liveScoreAddEditPlayerAction } from '../../store/actions/LiveScoreAction/liveScorePlayerAction'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from "moment";
import history from '../../util/history'
import Loader from '../../customComponents/loader'
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class LiveScoreAddPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileImage: AppImages.circleImage,
            teamSelection: "",
            playerId: '',
            firstName: '',
            lastName: '',
            contactNo: '',
            isEdit: this.props.location.state ? this.props.location.state.isEdit : null,
            loading: false,
            playerData: props.location.state ? props.location.state.playerData : null,
            temaViewPlayer: props.location.state ? props.location.state.temaViewPlayer ? props.location.state.temaViewPlayer : null : null,
            screenName: props.location.state ? props.location.state.screenName : null,
        };
        console.log(this.props.location.state, '^^^^^**')
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        // this.props.getliveScoreDivisions(id)
        this.props.getliveScoreTeams(id)
        if (this.state.isEdit == true) {
            if (this.props.location.state.screen === 'editTeam') {
                this.props.liveScoreUpdatePlayerDataAction({
                    playerId: this.state.playerData.id,
                    firstName: this.state.playerData.firstName,
                    lastName: this.state.playerData.lastName,
                    profilePicture: this.state.playerData.photoUrl,
                    phoneNumber: this.state.playerData.phoneNumber,
                    dob: this.state.playerData.dateOfBirth,
                    team: { id: this.state.playerData.teamId },
                    division: { id: 1 }
                }, 'editplayerScreen')
            } else {
                this.props.liveScoreUpdatePlayerDataAction(this.state.playerData, 'editplayerScreen')
            }

            this.setInitalFiledValue()
        } else {
            this.props.liveScoreUpdatePlayerDataAction('', 'addplayerScreen')
        }
    }

    setInitalFiledValue() {
        const { playerData } = this.props.liveScorePlayerState
        this.props.form.setFieldsValue({
            'firstName': playerData.firstName,
            'lastName': playerData.lastName,
            "team": playerData.teamId
        })
    }


    ////method to setimage
    setImage = (data) => {
        const { playerData } = this.props.liveScorePlayerState

        if (data.files[0] !== undefined) {

            this.setState({ image: data.files[0], profileImage: URL.createObjectURL(data.files[0]) })
            if (this.state.isEdit == true) {
                playerData.photoUrl = null
            }
        }

        // this.props.liveScoreUpdatePlayerDataAction(this.state.image, "photoUrl")
    };

    ///method to open file to select image
    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
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
                            {this.state.isEdit == true ? AppConstants.editPlayer : AppConstants.addPlayer}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    ////////form content view
    contentView = (getFieldDecorator) => {
        // let teamData = this.props.liveScoreState.teamResult ? this.props.liveScoreState.teamResult : []
        const { playerData } = this.props.liveScorePlayerState
        const teamResult = this.props.liveScoreTeamState;
        const teamData = teamResult.teamResult;

        return (
            <div className="content-view pt-0">

                {/* First and Last name row */}
                <div className='row'>
                    <div className="col-sm" >
                        <Form.Item >
                            {getFieldDecorator('firstName', {
                                rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                            })(
                                <InputWithHead
                                    required={"required-field pb-0"}
                                    heading={AppConstants.firstName}
                                    placeholder={AppConstants.enter_firstName}
                                    name={'firstName'}
                                    onChange={(firstName) => this.props.liveScoreUpdatePlayerDataAction(firstName.target.value, 'firstName')}
                                    value={playerData.firstName}
                                />
                            )}
                        </Form.Item>

                    </div>
                    <div className="col-sm" >
                        <Form.Item >
                            {getFieldDecorator('lastName', {
                                rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                            })(
                                <InputWithHead
                                    required={"required-field pb-0"}
                                    heading={AppConstants.lastName}
                                    placeholder={AppConstants.enterLastName}
                                    name={'lastName'}
                                    onChange={(lastName) => this.props.liveScoreUpdatePlayerDataAction(lastName.target.value, 'lastName')}
                                    value={playerData.lastName}
                                />
                            )}
                        </Form.Item>

                    </div>
                </div>

                {/* DOB and Contact No. row */}
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.dOB} />
                        <DatePicker
                            size="large"
                            style={{ width: "100%" }}
                            onChange={(dateOfBirth) => dateOfBirth && this.props.liveScoreUpdatePlayerDataAction(moment(dateOfBirth).format('DD-MM-YYYY'), 'dateOfBirth')}
                            format={"DD-MM-YYYY"}
                            showTime={false}
                            name={'date'}
                            value={playerData.dateOfBirth && moment(playerData.dateOfBirth, "DD-MM-YYYY")}
                        />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead
                            heading={AppConstants.contactNO}
                            placeholder={AppConstants.enterContactNo}
                            name={'contactNo'}
                            onChange={(phoneNumber) => this.props.liveScoreUpdatePlayerDataAction(phoneNumber.target.value, 'phoneNumber')}
                            value={playerData.phoneNumber}
                        />
                    </div>
                </div>

                {/* PlayerId and Team Selection row */}
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead
                            heading={AppConstants.playerId}
                            placeholder={AppConstants.enterPlayerID}
                            name={'playerId'}
                            onChange={(mnbPlayerId) => this.props.liveScoreUpdatePlayerDataAction(mnbPlayerId.target.value, 'mnbPlayerId')}
                            value={playerData.mnbPlayerId}
                        />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead required={"required-field"} heading={AppConstants.team} />
                        <Form.Item>
                            {getFieldDecorator('team', {
                                rules: [{ required: true, message: ValidationConstants.teamName }]
                            })(
                                <Select
                                    loading={this.props.liveScoreState.onLoad == true && true}
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={(teamId) => this.props.liveScoreUpdatePlayerDataAction(teamId, 'teamId')}
                                    value={playerData.teamId}
                                    placeholder={AppConstants.selectTeam}
                                >
                                    {teamData.length > 0 && teamData.map((item) => (
                                        < Option value={item.id} > {item.name}</Option>
                                    ))
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                </div>

                {/* Profile Selection and check box row */}

                <InputWithHead heading={AppConstants.profilePic} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>
                                <label>
                                    <img
                                        src={playerData.photoUrl ? playerData.photoUrl : this.state.profileImage}
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
                                onChange={(evt) => this.setImage(evt.target)} />
                            <span className="form-err">{this.state.imageError}</span>
                        </div>
                        {/* <div
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
                        </div> */}
                    </div>
                </div>

            </div>
        );
    };

    ////Api call after on save click
    onSaveClick = (e) => {
        const { playerData } = this.props.liveScorePlayerState


        let playerId = this.state.playerData ? this.state.playerData.playerId : ''
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(this.props.location)
                this.props.liveScoreAddEditPlayerAction(playerData, playerId, this.state.image, this.state.temaViewPlayer, { teamId: playerData.teamId, screen: this.props.location.state ? this.props.location.state.screen : null, screenName: this.state.screenName })
            }
        });
    }


    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button onClick={() => history.push(this.state.temaViewPlayer ? 'liveScoreTeamView' : '/liveScorePlayerList', { ...this.props.location.state })} type="cancel-button">{AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Form.Item >
                                    <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}>
                                        {AppConstants.save}
                                    </Button>
                                </Form.Item>
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
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <Loader visible={this.props.liveScorePlayerState.onLoad} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"7"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        onSubmit={this.onSaveClick}
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
        getliveScoreDivisions,
        liveScoreUpdatePlayerDataAction,
        liveScoreAddEditPlayerAction,
        getliveScoreTeams
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreState: state.LiveScoreState,
        liveScorePlayerState: state.LiveScorePlayerState,
        liveScoreTeamState: state.LiveScoreTeamState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreAddPlayer));


