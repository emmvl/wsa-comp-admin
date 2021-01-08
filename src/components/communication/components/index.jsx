import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Input,
    Button,
    DatePicker,
    TimePicker,
    Form,
    Modal,
    Spin,
    Checkbox,
    message,
    AutoComplete,
    Radio,
} from "antd";
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import moment from "moment";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import htmlToDraft from 'html-to-draftjs';

import InputWithHead from "../../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../../pages/innerHorizontalMenu";
import DashboardLayout from "../../../pages/dashboardLayout";
import AppConstants from "../../../themes/appConstants";
import AppImages from "../../../themes/appImages";
import { getliveScoreScorerList } from '../../../store/actions/LiveScoreAction/liveScoreAction';
import ValidationConstants from "../../../themes/validationConstant";
import history from '../../../util/history';
import Loader from '../../../customComponents/loader';

import { getLiveScoreCompetiton, getKeyForStateWideMessage, getOrganisationData } from '../../../util/sessionStorage';
import { isArrayNotEmpty, captializedString } from "../../../util/helpers";
import { liveScoreManagerListAction } from '../../../store/actions/LiveScoreAction/liveScoreManagerAction';
import ImageLoader from '../../../customComponents/ImageLoader';

import { getAffiliateToOrganisationAction, clearListAction, getUserDashboardTextualAction } from "../../../store/actions/userAction/userAction";
import { updateCommunicationModuleData } from '../../../store/actions/communicationAction/communicationAction';
import CommunicationRichTextEditor from "./RichTextEditor";
import CommunicationTargets from "./ReceiversSelectView";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
{ /* eslint-disable react/prop-types */ }
class AddCommunication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            // communicationImage: AppImages.circleImage,
            recipientSelection: AppConstants.selectRecipients,
            communicationTitle: null,
            author: '',
            managerData: [],
            scorerData: [],
            imageSelection: AppImages.circleImage,
            videoSelection: '',
            date: null,
            time: null,
            isEdit: props.location.state ? props.location.state.isEdit : false,
            load: false,
            visible: false,
            bodyData: "",
            image: null,
            media: null,
            video: null,
            key: props.location.state ? props.location.state.key ? props.location.state.key : null : null,
            getDataLoading: false,
            editorState: EditorState.createEmpty(),
            authorName: 'abc',
            imageTimeout: null,
            videoTimeout: null,
            screenKey: props.location ? props.location.state ? props.location.state.screenKey ? props.location.state.screenKey : null : null : null,
            crossImageIcon: false,
            crossVideoIcon: false,
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            yearRefId: -1,
            competitionUniqueKey: '-1',
            roleId: -1,
            genderRefId: -1,
            linkedEntityId: '-1',
            postalCode: '',
            searchText: '',
            deleteLoading: false,
            dobFrom: '-1',
            dobTo: '-1',
            sortBy: null,
            sortOrder: null,
            offsetData: 0,
            postCode: "-1",
            exsitingValue: undefined,
            userValue: undefined,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        let name;
        if (getLiveScoreCompetiton()) {
            const AuthorData = JSON.parse(getLiveScoreCompetiton());
            name = AuthorData.longName;
        } else {
            name = 'World sport actioa';
        }

        if (getLiveScoreCompetiton()) {
            const { id, organisationId } = JSON.parse(getLiveScoreCompetiton());
            if (this.state.screenKey === 'stateWideMsg') {
                this.props.getliveScoreScorerList(organisationId, 4);
                this.props.liveScoreManagerListAction(3, 1, null, null, null, null, null, null, organisationId);
            } else {
                this.props.getliveScoreScorerList(id, 4);
                this.props.liveScoreManagerListAction(3, 1, null, null, null, null, null, null, 1);
            }
        } else {
            this.props.getliveScoreScorerList(1, 4);
            this.props.liveScoreManagerListAction(3, 1, 1);
        }

        this.setState({ getDataLoading: false, authorName: name });
        const { addEditcommunication } = this.props.liveScoreCommunicationState;
        this.formRef.current.setFieldsValue({
            author: addEditcommunication.author ? addEditcommunication.author : name,
        });

        if (this.state.isEdit === true) {
            this.props.setDefaultImageVideoNewAction({
                communicationImage: this.props.location.state.item.communicationImage,
                communicationVideo: this.props.location.state.item.communicationVideo,
                author: name,
            });
            this.props.liveScoreAddcommunicationDetailsAction(this.props.location.state.item);
            this.setInitialValue(this.props.location.state.item, name);
        } else {
            this.props.liveScoreRefreshcommunicationAction();
        }
    }

    onChangeEditorData = (event) => {
        this.props.liveScoreUpdateCommunicationAction(event, "body");
        // this.setState({ editorState: event })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    setInitialValue(data, author) {
        let authorData = null;
        if (getLiveScoreCompetiton()) {
            authorData = JSON.parse(getLiveScoreCompetiton());
        }
        this.formRef.current.setFieldsValue({
            communication_Title: data.title,
            author: data.author ? data.author : author || (authorData ? authorData.longName : 'World sport actioa'),
        });

        const finalBody = data ? data.body ? data.body : "" : "";

        const html = finalBody;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState,
            });
        }
    }

    componentDidUpdate(nextProps) {
        const communicationState = this.props.liveScoreCommunicationState.addCommunicationResult;
        const onLoad_2Data = this.props.liveScoreCommunicationState;
        if (nextProps.communicationState !== communicationState) {
            if (onLoad_2Data.onLoad_2 === false && this.state.getDataLoading === true) {
                // debugger
                const appendData = this.props.liveScoreCommunicationState.addCommunicationResult;
                if (this.state.isEdit === true) {
                    if (!appendData.hasOwnProperty('communicationVideo')) {
                        appendData.communicationVideo = this.props.location.state.item.communicationVideo;
                    }
                    if (!appendData.hasOwnProperty('communicationImage')) {
                        appendData.communicationImage = this.props.location.state.item.communicationImage;
                    }
                }

                const { success } = this.props.liveScoreCommunicationState;

                if (success) {
                    history.push({
                        pathname: '/matchDaycommunicationView',
                        state: { item: appendData, id: this.state.key, screenKey: this.state.screenKey },
                    });
                }
            }
        }
    }

    /// method to show modal view after click
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    /// method to hide modal view after ok click
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    };

    /// method to hide modal view after click on cancle button
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };

    onChangeExpiryDate(date) {
        const { addEditcommunication } = this.props.liveScoreCommunicationState;
    }

    /// method to change time slots
    onChangeTime(time, timeString) {
    }

    // method to setimage
    setImage = (data) => {
        this.setState({ imageSelection: null, image: null });
        this.props.liveScoreUpdateCommunicationAction(null, "communicationImage");

        const { liveScoreCommunicationState } = this.props;
        const editData = liveScoreCommunicationState.addEditcommunication;

        if (data.files[0] !== undefined) {
            if (this.state.isEdit) {
                editData.communicationImage = '';
            }

            this.setState({ image: data.files[0], imageSelection: URL.createObjectURL(data.files[0]) });
        }
    };

    /// method to open file to select image
    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (fileInput) {
            fileInput.click();
        }
    }

    // method to setVideo
    setVideo = (data) => {
        const { liveScoreCommunicationState } = this.props;
        const editData = liveScoreCommunicationState.addEditcommunication;

        this.setState({ video: null, videoSelection: '', crossVideoIcon: false });
        this.props.liveScoreUpdateCommunicationAction(null, "communicationVideo");

        if (data.files[0] !== undefined) {
            if (data.files[0].size > AppConstants.video_size) {
                message.error(AppConstants.videoSize);
                return;
            }
            this.setState({
                videoTimeout: 2000,
                crossVideoIcon: false,
                video: data.files[0],
                videoSelection: URL.createObjectURL(data.files[0]),
            });
            setTimeout(() => {
                this.setState({ videoTimeout: null, crossVideoIcon: true });
            }, 2000);

            if (this.state.isEdit) {
                editData.communicationVideo = '';
            }
        }
    };

    // method to open file to select video
    selectVideo() {
        const fileInput = document.getElementById('user-vdo');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "video/*");
        if (fileInput) {
            fileInput.click();
        }
    }

    // On change title
    onChangeTitle(title) {
        const { liveScoreCommunicationState } = this.props;
        const editData = liveScoreCommunicationState.addEditcommunication;
        editData.title = title;
        this.props.liveScoreUpdateCommunicationAction(editData);
    }

    // modal view
    ModalView() {
        return (
            <Modal
                // title="WSA 1"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                centered
                width={0}
                height={0}
                closable={false}
            >
                <Spin size="large" />
            </Modal>
        );
    }

    // view for breadcrumb
    headerView = () => {
        const isEdit = this.props.location.state ? this.props.location.state.isEdit : null;
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {isEdit ? AppConstants.addCommunication : AppConstants.addCommunication}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    /// Manager and Scorer view
    scorerView = () => {
        const { scorerListResult } = this.props.liveScoreState;
        const scorerList = isArrayNotEmpty(scorerListResult) ? scorerListResult : [];

        return (
            <div className="row">
                <div className="col-sm">
                    <InputWithHead required="pb-0" heading={AppConstants.scorerHeading} />
                    <Select
                        mode="tags"
                        placeholder={AppConstants.searchScorer}
                        style={{ width: '100%' }}
                    >
                        {scorerList.map((item) => (
                            <Option key={`scorer_${item.firstName}`} value={item.firstName}>
                                {item.NameWithNumber}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
        );
    }

    /// Manager and Scorer view
    managerView = () => {
        const { managerListResult } = this.props.liveScoreMangerState;
        const managerList = isArrayNotEmpty(managerListResult) ? managerListResult : [];

        return (
            <div className="row">
                <div className="col-sm">
                    <InputWithHead required="pb-0" heading={AppConstants.managerHeading} />
                    <Select
                        mode="tags"
                        placeholder="Select Manager"
                        style={{ width: '100%' }}
                        // onChange={e => this.venueChange(e)}
                        // value={this.state.venue === [] ? AppConstants.selectVenue : this.state.venue}
                    >
                        {managerList.map((item) => (
                            <Option key={`manager_${item.firstName}`} value={item.firstName}>
                                {`${item.firstName} ${item.lastName}`}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
        );
    }

    deleteImage() {
        this.setState({ image: null, imageSelection: AppImages.circleImage, crossImageIcon: false });
        this.props.liveScoreUpdateCommunicationAction(null, "communicationImage");
    }

    deleteVideo() {
        this.setState({ video: null, videoSelection: '', crossVideoIcon: false });
        this.props.liveScoreUpdateCommunicationAction(null, "communicationVideo");
    }

    contentView = () => {
        const {
            addEditcommunication, communication_expire_date, expire_time, communicationImage, communicationVideo,
        } = this.props.liveScoreCommunicationState;
        const editData = addEditcommunication;
        const expiryDate = communication_expire_date;
        const expiryTime = expire_time;
        const expiryTime_formate = expiryTime ? moment(expiryTime).format("HH:mm") : null;
        const stateWideMsg = getKeyForStateWideMessage();
        return (
            <div className="content-view pt-4">
                <Form.Item name="communication_Title" rules={[{ required: true, message: ValidationConstants.communicationValidation[0] }]}>
                    <InputWithHead
                        required="required-field pt-0"
                        heading={AppConstants.communicationTitle}
                        placeholder={AppConstants.enterCommunicationTitle}
                        name="communicationTitle"
                        onChange={(event) => this.props.liveScoreUpdateCommunicationAction(captializedString(event.target.value), "title")}
                        value={editData.title}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            communication_Title: captializedString(i.target.value),
                        })}
                    />
                </Form.Item>
                <InputWithHead
                    // required=""
                    heading={AppConstants.communicationBody}
                    // value={editData.body}
                />

                <CommunicationRichTextEditor
                    onChangeEditorData={this.onChangeEditorData}
                    onEditorStateChange={this.onEditorStateChange}
                />

                <Form.Item name="author" rules={[{ required: true, message: ValidationConstants.communicationValidation[1] }]}>
                    <InputWithHead
                        required="required-field pt-4"
                        heading={AppConstants.author}
                        placeholder={AppConstants.enterAuthor}
                        name="authorName"
                        onChange={(event) => this.props.liveScoreUpdateCommunicationAction(captializedString(event.target.value), "author")}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            author: captializedString(i.target.value),
                        })}
                    />
                </Form.Item>
                {this.state.recipientSelection === "Individual Manager" && this.managerView()}
                {this.state.recipientSelection === "Individual Scorer" && this.scorerView()}
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.communicationImage} />
                        <div className="reg-competition-logo-view" onClick={this.selectImage}>
                            <ImageLoader
                                timeout={this.state.imageTimeout}
                                src={communicationImage || this.state.imageSelection}
                            />
                        </div>
                        <div>
                            <input
                                type="file"
                                id="user-pic"
                                style={{ display: 'none' }}
                                onChange={(event) => {
                                    this.setImage(event.target, 'evt.target');
                                    this.setState({ imageTimeout: 2000, crossImageIcon: false });
                                    setTimeout(() => {
                                        this.setState({ imageTimeout: null, crossImageIcon: true });
                                    }, 2000);
                                }}
                                onClick={(event) => {
                                    event.target.value = null;
                                }}
                            />

                            <div style={{ position: 'absolute', bottom: 65, left: 150 }}>
                                {(this.state.crossImageIcon || communicationImage) && (
                                    <span className="user-remove-btn pl-2" style={{ cursor: 'pointer' }}>
                                        <img
                                            className="dot-image"
                                            src={AppImages.redCross}
                                            alt=""
                                            width="16"
                                            height="16"
                                            onClick={() => this.deleteImage()}
                                        />
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.communicationVideo} />
                        <div className="reg-competition-logo-view" onClick={this.selectVideo}>
                            <ImageLoader
                                timeout={this.state.videoTimeout}
                                video
                                src={communicationVideo || this.state.videoSelection}
                                poster={(communicationVideo || this.state.videoSelection != '') ? '' : AppImages.circleImage}
                            />
                        </div>
                        <input
                            type="file"
                            id="user-vdo"
                            style={{ display: 'none' }}
                            onChange={(event) => {
                                this.setVideo(event.target, "evt.target");
                            }}
                            onClick={(event) => {
                                event.target.value = null;
                            }}
                        />
                        <div style={{ position: 'absolute', bottom: 65, left: 150 }}>
                            {(this.state.crossVideoIcon || communicationVideo)
                            && (
                                <span className="user-remove-btn pl-2" style={{ cursor: 'pointer' }}>
                                    <img
                                        className="dot-image"
                                        src={AppImages.redCross}
                                        alt=""
                                        width="16"
                                        height="16"
                                        onClick={() => this.deleteVideo()}
                                    />
                                </span>
                            )}
                        </div>
                        <span className="video_Message">{AppConstants.videoSizeMessage}</span>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.communicationExpiryDate} />
                        <DatePicker
                            // size="large"
                            style={{ width: '100%' }}
                            onChange={(date) => this.props.liveScoreUpdateCommunicationAction(date, "expire_date")}
                            format="DD-MM-YYYY"
                            value={expiryDate ? moment(expiryDate) : ''}
                            showTime={false}
                            placeholder="dd-mm-yyyy"
                            name="registrationOepn"
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.communicationExpiryTime} />
                        <TimePicker
                            className="comp-venue-time-timepicker"
                            style={{ width: '100%' }}
                            format="HH:mm"
                            value={expiryTime_formate !== null && moment(expiryTime_formate, "HH:mm")}
                            onChange={(time) => this.props.liveScoreUpdateCommunicationAction(time, "expire_time")}
                            onBlur={(e) => this.props.liveScoreUpdateCommunicationAction(e.target.value && moment(e.target.value, "HH:mm"), 'expire_time')}
                            placeholder="Select Time"
                        />
                    </div>
                </div>

                <CommunicationTargets
                    userSearchApi={this.userSearchApi}
                    updateCommunicationModuleData={updateCommunicationModuleData}
                    getAffiliateToOrganisationAction={getAffiliateToOrganisationAction}
                    {...this.props.communicationModuleState}
                />
            </div>
        );
    };

    userSearchApi(searchText) {
        const {
            organisationId,
            yearRefId,
            competitionUniqueKey,
            roleId,
            genderRefId,
            linkedEntityId,
            dobFrom,
            dobTo,
            postCode,
        } = this.state;

        const filter = {
            organisationId,
            yearRefId,
            competitionUniqueKey,
            roleId,
            genderRefId,
            linkedEntityId,
            dobFrom,
            dobTo,
            postCode,
            searchText,
            paging: {
                limit: 100,
                offset: 0,
            },
        };

        this.props.getUserDashboardTextualAction(filter);
    }

    onSaveButton = () => {
        this.setState({ getDataLoading: true });
    }

    footerView = (isSubmitting) => {
        const { liveScoreCommunicationState } = this.props;
        const editData = liveScoreCommunicationState.addEditcommunication;

        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm pl-3">
                            <div className="reg-add-save-button">
                                <NavLink
                                    to={{
                                        pathname: "/CommunicationList",
                                        state: { screenKey: this.state.screenKey },
                                    }}
                                >
                                    <Button className="cancelBtnWidth" type="cancel-button">
                                        {AppConstants.cancel}
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm pr-3">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text mr-0" type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.next}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const stateWideMsg = getKeyForStateWideMessage();
        return (
            <div className="fluid-width default-bg">
                <Loader visible={this.props.liveScoreCommunicationState.onLoad_2} />
                <DashboardLayout menuHeading={AppConstants.Communication} menuName={AppConstants.Communication} />

                <InnerHorizontalMenu menu="communication" userSelectedKey="1" />

                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        noValidate="noValidate"
                    >
                        <Content>
                            <div className="formView">{this.contentView()}</div>
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
        getliveScoreScorerList,
        liveScoreManagerListAction,
        setDefaultImageVideoNewAction,
        getAffiliateToOrganisationAction,
        clearListAction,
        getUserDashboardTextualAction,
        updateCommunicationModuleData,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        liveScoreCommunicationState: state.liveScoreCommunicationState,
        liveScoreScorerState: state.LiveScoreScorerState,
        liveScoreMangerState: state.LiveScoreMangerState,
        liveScoreState: state.LiveScoreState,
        userState: state.UserState,
        communicationModuleState: state.CommunicationModuleState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCommunication);
