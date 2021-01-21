/* eslint-disable react/sort-comp */
/* eslint-disable camelcase */
import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    DatePicker,
    TimePicker,
    Form,
    Modal,
    Spin,
    Checkbox,
    message,
    Radio,
} from "antd";
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import moment from "moment";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import htmlToDraft from 'html-to-draftjs';
import { Editor } from "react-draft-wysiwyg";

import draftToHtml from "draftjs-to-html";
import ImageLoader from '../../customComponents/ImageLoader';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import ValidationConstants from "../../themes/validationConstant";

import { getLiveScoreCompetiton, getOrganisationData } from '../../util/sessionStorage';
import { isArrayNotEmpty, captializedString } from "../../util/helpers";
import {
    getAffiliatesListingAction,
    filterByRelations,
    getAffiliateToOrganisationAction,
    clearListAction,
    getUserDashboardTextualAction,
    getRoleAction,
} from '../../store/actions/userAction/userAction';
import { liveScoreManagerListAction } from '../../store/actions/LiveScoreAction/liveScoreManagerAction';

import {
    refreshCommunicationModuleDataAction,
    updateCommunicationModuleData,
    setDefaultImageVideoNewAction,
} from '../../store/actions/communicationAction/communicationAction';
import Loader from "../../customComponents/loader";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class AddCommunication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: '',
            author: '',
            expiryDate: null,
            expiryTime: null,
            toOrganisationIds: [],
            toUserRoleIds: [],
            toUserIds: [],
            recipientSelection: AppConstants.selectRecipients,
            communicationImage: null,
            communicationVideo: null,
            image: null,
            imageSelection: AppImages.circleImage,
            videoSelection: '',
            isEdit: props.location.state ? props.location.state.isEdit : false,
            visible: false,
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
            dobFrom: '-1',
            dobTo: '-1',
            postCode: "-1",
            allOrg: true,
            individualOrg: false,
            allUser: true,
            selectedRoles: false,
            individualUsers: false,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        let name;
        if (getOrganisationData()) {
            name = getOrganisationData().name;
        } else {
            name = 'World sport action';
        }

        this.props.getRoleAction();

        this.setState({ getDataLoading: false, authorName: name });
        this.formRef.current.setFieldsValue({
            author: name,
        });

        if (this.state.isEdit === true) {
            this.props.setDefaultImageVideoNewAction({
                communicationImage: this.props.location.state.item.communicationImage,
                communicationVideo: this.props.location.state.item.communicationVideo,
                author: name,
            });
            this.setInitialFilledValue(this.props.location.state.item, name);
        } else {
            this.props.refreshCommunicationModuleDataAction();
        }

        this.props.getAffiliatesListingAction({
            organisationId: getOrganisationData().organisationUniqueKey,
            affiliatedToOrgId: -1,
            organisationTypeRefId: -1,
            statusRefId: -1,
            paging: { limit: -1, offset: 0 },
            stateOrganisations: true,
        });
    }

    componentDidUpdate() {
    }

    handleChangeState(field, value) {
        this.setState({
            [field]: value,
        });
    }

    onChangeEditorData = (event) => {
        this.setState({ body: event });
    }

    onEditorStateChange = (editorState) => {
        const body = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        this.setState({
            editorState,
            body,
        });
    };

    setInitialFilledValue(data, author) {
        let authorData = null;
        if (getLiveScoreCompetiton()) {
            authorData = JSON.parse(getLiveScoreCompetiton());
        }
        this.formRef.current.setFieldsValue({
            communication_Title: data.title,
            author: data.author ? data.author : author || (authorData ? authorData.longName : 'World sport action'),
        });

        const finalBody = data ? data.body ? data.body : "" : "";

        const html = finalBody;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState,
                body: data.body,
            });
        }
    }

    /// method to show modal view after click
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    /// method to hide modal view after ok click
    handleOk = () => {
        this.setState({
            visible: false,
        });
    };

    /// method to hide modal view after click on cancle button
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    /// method to setimage
    setImage = (data) => {
        this.setState({ imageSelection: null, image: null, communicationImage: null });
        this.setState({ });

        const editData = this.state;

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

    /// /method to setVideo
    setVideo = (data) => {
        this.setState({
            video: null, videoSelection: '', crossVideoIcon: false, communicationVideo: null,
        });

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
                this.setState({ communicationVideo: null });
            }
        }
    };

    /// method to open file to select video
    // eslint-disable-next-line class-methods-use-this
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
        this.setState({ title });
    }

    /// /modal view
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

    /// view for breadcrumb
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

    deleteImage() {
        this.setState({
            image: null, imageSelection: AppImages.circleImage, crossImageIcon: false, communicationImage: null,
        });
    }

    deleteVideo() {
        this.setState({
            video: null, videoSelection: '', crossVideoIcon: false, communicationVideo: null,
        });
    }

    contentView = () => {
        const {
            expiryDate, expiryTime, communicationImage, communicationVideo,
        } = this.state;
        const editData = this.state;
        const expiryTime_format = expiryTime ? moment(expiryTime).format("HH:mm") : null;

        return (
            <div className="content-view pt-4">
                <Form.Item name="communication_Title" rules={[{ required: true, message: ValidationConstants.communicationValidation[0] }]}>
                    <InputWithHead
                        required="required-field pt-0"
                        heading={AppConstants.communicationTitle}
                        placeholder={AppConstants.enterCommunicationTitle}
                        name="communicationTitle"
                        onChange={(event) => this.setState({ title: captializedString(event.target.value) })}
                        value={editData.title}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            communication_Title: captializedString(i.target.value),
                        })}
                    />
                </Form.Item>
                <InputWithHead
                    heading={AppConstants.communicationBody}
                />
                <div className="fluid-width mt-2" style={{ border: "1px solid rgb(212, 212, 212)" }}>
                    <div className="livescore-editor-news col-sm">
                        <Editor
                            editorState={this.state.editorState}
                            editorClassName="newsDetailEditor"
                            placeholder={AppConstants.communicationBody}
                            onChange={(e) => this.onChangeEditorData(e.blocks)}
                            onEditorStateChange={this.onEditorStateChange}
                            toolbar={{
                                options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign',
                                    'colorPicker', 'link', 'embedded', 'emoji', 'remove', 'history'],
                                inline: { inDropdown: true },
                                list: { inDropdown: true },
                                textAlign: { inDropdown: true },
                                link: { inDropdown: true },
                                history: { inDropdown: true },
                            }}
                        />
                    </div>
                </div>
                <Form.Item name="author" rules={[{ required: true, message: ValidationConstants.communicationValidation[1] }]}>
                    <InputWithHead
                        required="required-field pt-4"
                        heading={AppConstants.author}
                        placeholder={AppConstants.enterAuthor}
                        name="authorName"
                        onChange={(event) => this.setState({ author: captializedString(event.target.value) })}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            author: captializedString(i.target.value),
                        })}
                    />
                </Form.Item>
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
                                    // eslint-disable-next-line no-param-reassign
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
                                poster={(communicationVideo || this.state.videoSelection !== '') ? '' : AppImages.circleImage}
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
                                // eslint-disable-next-line no-param-reassign
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

                {/* communication expiry date and time  row */}
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.communicationExpiryDate} />
                        <DatePicker
                            style={{ width: '100%' }}
                            onChange={(date) => this.setState({ expiryDate: date })}
                            format="DD-MM-YYYY"
                            value={expiryDate ? moment(expiryDate) : ''}
                            showTime={false}
                            placeholder="dd-mm-yyyy"
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.communicationExpiryTime} />
                        <TimePicker
                            className="comp-venue-time-timepicker"
                            style={{ width: '100%' }}
                            format="HH:mm"
                            value={expiryTime_format !== null && moment(expiryTime_format, "HH:mm")}
                            onChange={(time) => this.setState({ expiryTime: time })}
                            onBlur={
                                (e) => {
                                    this.setState({ expiryTime: e.target.value && moment(e.target.value, "HH:mm") });
                                }
                            }
                            placeholder="Select Time"
                        />
                    </div>
                </div>

                {this.stateWideMsgView()}
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

    stateWideMsgView() {
        const {
            allOrg,
            individualOrg,
            individualUsers,
            allUser,
            selectedRoles,
            userName,
            orgName,
        } = this.state;

        const {
            impersonationList, userDashboardTextualList, onLoadSearch, onTextualLoad,
        } = this.props.userState;

        const affiliateToData = isArrayNotEmpty(impersonationList) ? impersonationList : [];
        const userData = isArrayNotEmpty(userDashboardTextualList) ? userDashboardTextualList : [];

        const selctedRolArr = [
            { label: 'Managers', value: "manager" },
            { label: 'Coaches', value: "coach" },
            { label: 'Scorers', value: "scorer" },
            { label: 'Players', value: "player" },
            { label: 'Umpires', value: "umpire" },
        ];

        return (
            <div>
                <InputWithHead heading={`${AppConstants.organisation}(s)`} />
                <div className="d-flex flex-column">
                    <Radio
                        className="mt-3"
                        onChange={() => {
                            this.setState({
                                allOrg: true,
                                individualOrg: false,
                            });
                        }}
                        checked={allOrg}
                    >
                        {AppConstants.allOrganisation}
                    </Radio>
                    <Radio
                        className="mt-3"
                        onChange={() => {
                            this.setState({
                                allOrg: false,
                                individualOrg: true,
                            });
                        }}
                        checked={individualOrg}
                    >
                        {`${AppConstants.individualOrganisation}(s)`}
                    </Radio>
                </div>

                {individualOrg && (
                    <div className="mt-3">
                        <Select
                            mode="multiple"
                            className="ml-5"
                            style={{ width: '97%', height: '44px' }}
                            placeholder={AppConstants.selectOrganisation}
                            onChange={(value) => {
                                this.setState({
                                    toOrganisationIds: value,
                                });
                            }}
                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            notFoundContent={onLoadSearch === true ? <Spin size="small" /> : null}
                            value={orgName || undefined}
                        >
                            {
                                affiliateToData.length > 0 && affiliateToData.map((org, index) => (
                                    <Option key={`${org.id}_${index}`} value={org.id}>
                                        {org.name}
                                    </Option>
                                ))
                            }
                        </Select>

                    </div>
                )}

                <InputWithHead heading={AppConstants.recipients} />
                <div
                    className="mt-3"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <Radio
                        onChange={() => {
                            this.setState({
                                allUser: true,
                                selectedRoles: false,
                                individualUsers: false,
                            });
                        }}
                        checked={allUser}
                    >
                        All Users
                    </Radio>
                </div>

                <div
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <Radio
                        className="mt-3"
                        onChange={() => {
                            this.setState({
                                allUser: false,
                                selectedRoles: true,
                                individualUsers: false,
                            });
                        }}
                        checked={selectedRoles}
                    >
                        Selected Role(s)
                    </Radio>

                </div>

                <div className="col-sm">
                    {selectedRoles && (
                        <Checkbox.Group
                            onChange={(value) => {
                                const selected = value.length > 0
                                    ? value.map((item) => {
                                        const role = this.props.userState.roles.find((rol) => rol.name === item);
                                        return role?.id;
                                    }).filter((item) => item)
                                    : [];
                                this.setState({
                                    toUserRoleIds: selected,
                                });
                            }}
                        >

                            {selctedRolArr.map((item) => (
                                <div key={item.value}>
                                    <Checkbox className="single-checkbox-radio-style pt-4 ml-0" value={item.value}>
                                        {item.label}
                                    </Checkbox>
                                </div>
                            ))}

                        </Checkbox.Group>
                    )}
                </div>

                <div
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <Radio
                        className="mt-3"
                        onChange={() => {
                            this.setState({
                                allUser: false,
                                selectedRoles: false,
                                individualUsers: true,
                            });
                        }}
                        checked={individualUsers}
                    >
                        Individual User(s)
                    </Radio>
                </div>

                {individualUsers && (
                    <div className="mt-3">

                        <Select
                            className="ml-5"
                            mode="multiple"
                            style={{ width: '97%', height: '44px' }}
                            placeholder="Select User"
                            filterOption={false}
                            onChange={(value) => {
                                this.setState({
                                    toUserIds: value,
                                });
                            }}
                            notFoundContent={onTextualLoad === true ? <Spin size="small" /> : null}
                            onSearch={(value) => {
                                this.setState({ userValue: value });
                                if (value && value.length > 2) {
                                    this.userSearchApi(value);
                                }
                            }}
                            value={userName || undefined}
                        >
                            {
                                userData.length > 0 && userData.map((item) => (
                                    <Option key={item.userId} value={item.userId}>
                                        {item.name}
                                    </Option>
                                ))
                            }
                        </Select>

                    </div>
                )}

            </div>
        );
    }

    onSaveButton = () => {
        const mediaArray = [
            this.state.image,
            this.state.video,
        ].filter((media) => media);

        const expiryDate = moment(this.state.newExpiryDate).format("YYYY-MM-DD");
        const expiryTime = moment(this.state.expire_time).format("HH:mm");
        const postDate = moment(`${expiryDate} ${expiryTime}`);

        const payload = {
            id: null,
            title: this.state.title,
            author: this.state.author,
            body: this.state.body,
            key: this.state.key,
            mediaArray,
            expiryDate: postDate,
            organisationId: this.state.organisationId,
            toOrganisationIds: this.state.toOrganisationIds,
            toUserRoleIds: this.state.toUserRoleIds,
            toUserIds: this.state.toUserIds,
            communicationImage: this.state.communicationImage,
            communicationVideo: this.state.communicationVideo,
        };


        console.log('===============', payload);
    }

    footerView = (isSubmitting) => (
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

    onFinishFailed = () => {
        message.config({ maxCount: 1, duration: 1.5 });
        message.error(ValidationConstants.plzReviewPage);
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <Loader
                    visible={
                        this.props.userState.onImpersonationLoad
                        || this.props.userState.onLoad
                    }
                />
                <DashboardLayout menuHeading={AppConstants.Communication} menuName={AppConstants.Communication} />

                <InnerHorizontalMenu menu="communication" userSelectedKey="1" />

                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        noValidate="noValidate"
                        onFinish={this.onSaveButton}
                        onFinishFailed={this.onFinishFailed}
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
        getRoleAction,
        getAffiliatesListingAction,
        refreshCommunicationModuleDataAction,
        liveScoreManagerListAction,
        setDefaultImageVideoNewAction,
        getAffiliateToOrganisationAction,
        clearListAction,
        getUserDashboardTextualAction,
        updateCommunicationModuleData,
        filterByRelations,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        liveScoreScorerState: state.LiveScoreScorerState,
        liveScoreMangerState: state.LiveScoreMangerState,
        liveScoreState: state.LiveScoreState,
        userState: state.UserState,
        communicationModuleState: state.CommunicationModuleState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCommunication);
