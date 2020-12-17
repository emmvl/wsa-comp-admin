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
    Radio
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import moment from "moment";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    liveScoreAddNewsDetailsAction,
    liveScoreAddNewsAction,
    liveScoreUpdateNewsAction,
    liveScoreRefreshNewsAction,
    setDefaultImageVideoNewAction
} from "../../store/actions/LiveScoreAction/liveScoreNewsAction";
import { getliveScoreScorerList } from '../../store/actions/LiveScoreAction/liveScoreAction';
import ValidationConstants from "../../themes/validationConstant";
import history from '../../util/history'
import Loader from '../../customComponents/loader';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import { getLiveScoreCompetiton, getKeyForStateWideMessage } from '../../util/sessionStorage';
import { isArrayNotEmpty, captializedString } from "../../util/helpers";
import { liveScoreManagerListAction } from '../../store/actions/LiveScoreAction/liveScoreManagerAction'
import ImageLoader from '../../customComponents/ImageLoader'
import { NavLink } from "react-router-dom";
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { getOrganisationData } from "../../util/sessionStorage";
import { getAffiliateToOrganisationAction, clearListAction, getUserDashboardTextualAction } from "../../store/actions/userAction/userAction";
import { isEmptyArray } from "formik";
import { updateCommunicationModuleData } from '../../store/actions/communicationAction/communicationAction'

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class AddCommunication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            // newsImage: AppImages.circleImage,
            recipientSelection: AppConstants.selectRecipients,
            newsTitle: null,
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
            userValue: undefined
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        let name
        if (getLiveScoreCompetiton()) {
            const AuthorData = JSON.parse(getLiveScoreCompetiton())
            name = AuthorData.longName
        } else {
            name = 'World sport actioa'
        }

        if (getLiveScoreCompetiton()) {
            const { id, organisationId } = JSON.parse(getLiveScoreCompetiton())
            if (this.state.screenKey === 'stateWideMsg') {
                this.props.getliveScoreScorerList(organisationId, 4)
                this.props.liveScoreManagerListAction(3, 1, null, null, null, null, null, null, organisationId)
            } else {

                this.props.getliveScoreScorerList(id, 4)
                this.props.liveScoreManagerListAction(3, 1, null, null, null, null, null, null, 1)
            }
        } else {
            this.props.getliveScoreScorerList(1, 4)
            this.props.liveScoreManagerListAction(3, 1, 1)
        }

        this.setState({ getDataLoading: false, authorName: name })
        const { addEditNews } = this.props.liveScoreNewsState;
        this.formRef.current.setFieldsValue({
            'author': addEditNews.author ? addEditNews.author : name
        })

        if (this.state.isEdit === true) {
            this.props.setDefaultImageVideoNewAction({
                newsImage: this.props.location.state.item.newsImage,
                newsVideo: this.props.location.state.item.newsVideo,
                author: name
            })
            this.props.liveScoreAddNewsDetailsAction(this.props.location.state.item)
            this.setInitalFiledValue(this.props.location.state.item, name)
        } else {
            this.props.liveScoreRefreshNewsAction()
        }
    }

    onChangeEditorData = (event) => {
        this.props.liveScoreUpdateNewsAction(event, "body")
        // this.setState({ editorState: event })
    }

    EditorView = () => {
        const { liveScoreNewsState } = this.props;
        const { editorState } = this.state;
        return (
            <div className="fluid-width mt-2" style={{ border: "1px solid rgb(212, 212, 212)", }}>
                <div className="livescore-editor-news col-sm">
                    <Editor
                        editorState={editorState}
                        editorClassName="newsDetailEditor"
                        placeholder="News body"
                        onChange={(e) => this.onChangeEditorData(e.blocks)}
                        onEditorStateChange={this.onEditorStateChange}
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'remove', 'history'],
                            inline: { inDropdown: true },
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            history: { inDropdown: true },
                        }}
                    />
                </div>
            </div>
        )
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    setInitalFiledValue(data, author) {
        let authorData = null
        if (getLiveScoreCompetiton()) {
            authorData = JSON.parse(getLiveScoreCompetiton())
        }
        this.formRef.current.setFieldsValue({
            'news_Title': data.title,
            'author': data.author ? data.author : author ? author : authorData ? authorData.longName : 'World sport actioa'
        })
        // let finalBody = data ? data.body ? data.body : "" : ""
        // let body = EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(finalBody)))
        // this.setState({ editorState: body })

        let finalBody = data ? data.body ? data.body : "" : ""
        // const contentState = convertFromRaw({ "entityMap": {}, "blocks": finalBody });
        // const editorState = EditorState.createWithContent(contentState);
        // this.setState({
        //     editorState
        // })

        const html = finalBody;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState
            })
        }
    }

    componentDidUpdate(nextProps) {
        let newsState = this.props.liveScoreNewsState.addNewsResult
        let onLoad_2Data = this.props.liveScoreNewsState
        if (nextProps.newsState !== newsState) {
            if (onLoad_2Data.onLoad_2 === false && this.state.getDataLoading === true) {
                // debugger
                const appendData = this.props.liveScoreNewsState.addNewsResult
                if (this.state.isEdit === true) {
                    if (!appendData.hasOwnProperty('newsVideo')) {
                        appendData['newsVideo'] = this.props.location.state.item.newsVideo
                    }
                    if (!appendData.hasOwnProperty('newsImage')) {
                        appendData['newsImage'] = this.props.location.state.item.newsImage
                    }
                }

                const { success } = this.props.liveScoreNewsState;

                if (success) {
                    history.push({
                        pathname: '/matchDayNewsView',
                        state: { item: appendData, id: this.state.key, screenKey: this.state.screenKey }
                    })
                }
            }
        }
    }

    ////method to show modal view after click
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    ////method to hide modal view after ok click
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    ////method to hide modal view after click on cancle button
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    onChangeExpiryDate(date) {
        let { addEditNews } = this.props.liveScoreNewsState
    }

    ///method to change time slots
    onChangeTime(time, timeString) {
    }

    ////method to setimage
    setImage = (data) => {
        this.setState({ imageSelection: null, image: null })
        this.props.liveScoreUpdateNewsAction(null, "newsImage")

        const { liveScoreNewsState } = this.props;
        let editData = liveScoreNewsState.addEditNews;

        if (data.files[0] !== undefined) {
            // if (data.files[0].size > AppConstants.logo_size) {
            //     message.error(AppConstants.videoSize);
            //     return;
            // }

            if (this.state.isEdit) {
                editData.newsImage = ''
            }

            this.setState({ image: data.files[0], imageSelection: URL.createObjectURL(data.files[0]) })
            // this.props.liveScoreUpdateNewsAction(data.files[0], "newsImage")
        }
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

    ////method to setVideo
    setVideo = (data) => {
        const { liveScoreNewsState } = this.props;
        let editData = liveScoreNewsState.addEditNews;

        this.setState({ video: null, videoSelection: '', crossVideoIcon: false })
        this.props.liveScoreUpdateNewsAction(null, "newsVideo")

        if (data.files[0] !== undefined) {
            if (data.files[0].size > AppConstants.video_size) {
                message.error(AppConstants.videoSize);
                return;
            } else {
                this.setState({
                    videoTimeout: 2000,
                    crossVideoIcon: false,
                    video: data.files[0],
                    videoSelection: URL.createObjectURL(data.files[0])
                })
                setTimeout(() => {
                    this.setState({ videoTimeout: null, crossVideoIcon: true })
                }, 2000);
            }

            if (this.state.isEdit) {
                editData.newsVideo = ''
            }
            // this.setState({ video: data.files[0], videoSelection: URL.createObjectURL(data.files[0]) })
            // this.props.liveScoreUpdateNewsAction(URL.createObjectURL(data.files[0]), "newsVideo")
        }
    };

    ///method to open file to select video
    selectVideo() {
        const fileInput = document.getElementById('user-vdo');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "video/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    //On change title
    onChangeTitle(title) {
        const { liveScoreNewsState } = this.props;
        let editData = liveScoreNewsState.addEditNews;
        editData.title = title
        this.props.liveScoreUpdateNewsAction(editData)
    }

    ////modal view
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
                {/* <div style={{ backgroundColor: 'red', height: 100, width: 100 }}> */}
                <Spin size="large" />
                {/* </div> */}
            </Modal>
        )
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
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {isEdit ? AppConstants.editNews : AppConstants.addNews}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    /// Manager and Scorer view
    scorerView = () => {
        const { scorerListResult } = this.props.liveScoreState
        let scorerList = isArrayNotEmpty(scorerListResult) ? scorerListResult : []

        return (
            <div className="row">
                <div className="col-sm">
                    <InputWithHead required="pb-0" heading={AppConstants.scorerHeading} />
                    <Select
                        mode="tags"
                        placeholder={AppConstants.searchScorer}
                        style={{ width: '100%' }}
                    // onChange={(scorerId) => this.props.liveScoreUpdateNewsAction(scorerId, "title")}
                    // value={editData.title}
                    >
                        {scorerList.map((item) => (
                            <Option key={'scorer_' + item.firstName} value={item.firstName}>
                                {item.NameWithNumber}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
        )
    }

    /// Manager and Scorer view
    managerView = () => {
        const { managerListResult } = this.props.liveScoreMangerState
        let managerList = isArrayNotEmpty(managerListResult) ? managerListResult : []

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
                            <Option key={'manager_' + item.firstName} value={item.firstName}>
                                {item.firstName + " " + item.lastName}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
        )
    }

    html2text(html) {
        var d = document.createElement('div');
        d.innerHTML = html;
        return d.textContent;
    }

    setRecipientData(recipientName, recipientKey) {
        this.setState({ recipientSelection: recipientName })
        this.props.liveScoreUpdateNewsAction(recipientName, recipientKey)
    }

    deleteImage() {
        this.setState({ image: null, imageSelection: AppImages.circleImage, crossImageIcon: false })
        this.props.liveScoreUpdateNewsAction(null, "newsImage")
    }

    deleteVideo() {
        this.setState({ video: null, videoSelection: '', crossVideoIcon: false })
        this.props.liveScoreUpdateNewsAction(null, "newsVideo")
    }

    contentView = () => {
        const { addEditNews, news_expire_date, expire_time, newsImage, newsVideo } = this.props.liveScoreNewsState;
        let editData = addEditNews;
        let expiryDate = news_expire_date
        let expiryTime = expire_time
        let expiryTime_formate = expiryTime ? moment(expiryTime).format("HH:mm") : null;
        let stateWideMsg = getKeyForStateWideMessage()
        return (
            <div className="content-view pt-4">
                <Form.Item name="news_Title" rules={[{ required: true, message: ValidationConstants.newsValidation[0] }]}>
                    <InputWithHead
                        required="required-field pt-0"
                        heading={AppConstants.newsTitle}
                        placeholder={AppConstants.enterNewsTitle}
                        name="newsTitle"
                        onChange={(event) => this.props.liveScoreUpdateNewsAction(captializedString(event.target.value), "title")}
                        value={editData.title}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            'news_Title': captializedString(i.target.value)
                        })}
                    />
                </Form.Item>
                <InputWithHead
                    // required=""
                    heading={AppConstants.newsBody}
                // value={editData.body}
                />

                {this.EditorView()}

                <Form.Item name="author" rules={[{ required: true, message: ValidationConstants.newsValidation[1] }]}>
                    <InputWithHead
                        required="required-field pt-4"
                        heading={AppConstants.author}
                        placeholder={AppConstants.enterAuthor}
                        name="authorName"
                        onChange={(event) => this.props.liveScoreUpdateNewsAction(captializedString(event.target.value), "author")}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            'author': captializedString(i.target.value)
                        })}
                    />
                </Form.Item>
                {this.state.recipientSelection === "Individual Manager" && this.managerView()}
                {this.state.recipientSelection === "Individual Scorer" && this.scorerView()}
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.newsImage} />
                        <div className="reg-competition-logo-view" onClick={this.selectImage}>
                            <ImageLoader
                                timeout={this.state.imageTimeout}
                                src={newsImage ? newsImage : this.state.imageSelection}
                            />
                        </div>
                        <div>
                            <input
                                type="file"
                                id="user-pic"
                                style={{ display: 'none' }}
                                onChange={(event) => {
                                    this.setImage(event.target, 'evt.target')
                                    this.setState({ imageTimeout: 2000, crossImageIcon: false })
                                    setTimeout(() => {
                                        this.setState({ imageTimeout: null, crossImageIcon: true })
                                    }, 2000);
                                }}
                                onClick={(event) => {
                                    event.target.value = null
                                }}
                            />

                            <div style={{ position: 'absolute', bottom: 65, left: 150 }}>
                                {(this.state.crossImageIcon || newsImage) && (
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
                        <InputWithHead heading={AppConstants.newsVideo} />
                        <div className="reg-competition-logo-view" onClick={this.selectVideo}>
                            <ImageLoader
                                timeout={this.state.videoTimeout}
                                video
                                src={newsVideo ? newsVideo : this.state.videoSelection}
                                poster={(newsVideo || this.state.videoSelection != '') ? '' : AppImages.circleImage}
                            />
                        </div>
                        <input
                            type="file"
                            id="user-vdo"
                            style={{ display: 'none' }}
                            onChange={(event) => {
                                this.setVideo(event.target, "evt.target")
                                // this.setState({ videoTimeout: 2000, crossVideoIcon: false })
                                // setTimeout(() => {
                                //     this.setState({ videoTimeout: null, crossVideoIcon: true })
                                // }, 2000);
                            }}
                            onClick={(event) => {
                                event.target.value = null
                            }}
                        />
                        <div style={{ position: 'absolute', bottom: 65, left: 150 }}>
                            {(this.state.crossVideoIcon || newsVideo) &&
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
                            }
                        </div>
                        <span className="video_Message">{AppConstants.videoSizeMessage}</span>
                    </div>
                </div>

                {/* News expiry date and time  row */}
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.newsExpiryDate} />
                        <DatePicker
                            // size="large"
                            style={{ width: '100%' }}
                            onChange={(date) => this.props.liveScoreUpdateNewsAction(date, "expire_date")}
                            format="DD-MM-YYYY"
                            value={expiryDate ? moment(expiryDate) : ''}
                            showTime={false}
                            placeholder="dd-mm-yyyy"
                            name="registrationOepn"
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead  heading={AppConstants.newsExpiryTime} />
                        <TimePicker
                            className="comp-venue-time-timepicker"
                            style={{ width: '100%' }}
                            format="HH:mm"
                            value={expiryTime_formate !== null && moment(expiryTime_formate, "HH:mm")}
                            onChange={(time) => this.props.liveScoreUpdateNewsAction(time, "expire_time")}
                            onBlur={(e) => this.props.liveScoreUpdateNewsAction(e.target.value && moment(e.target.value, "HH:mm"), 'expire_time')}
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
            postCode

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
            indivisualOrg,
            indivisualUsers,
            allUser,
            selectedRoles,
            onTextualLoad,
            userDashboardTextualList,
            userName,
            orgName,
            affiliateTo,
            onLoadSearch
        } = this.props.communicationModuleState;
        let organisationUniqueKey = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;
        let affiliateToData = isArrayNotEmpty(affiliateTo.affiliatedTo) ? affiliateTo.affiliatedTo : [];
        let userData = isArrayNotEmpty(userDashboardTextualList) ? userDashboardTextualList : [];
        let uniqueValues = [];
        // if (affiliateToData.affiliatedTo != undefined) {
        //     let obj = {
        //         organisationId: getOrganisationData().organisationUniqueKey,
        //         name: getOrganisationData().name
        //     }
        //     uniqueValues.push(obj);
        //     let arr = [...new Map(affiliateToData.affiliatedTo.map(obj => [obj["organisationId"], obj])).values()];
        //     if (isEmptyArray) {
        //         uniqueValues = [...uniqueValues, ...arr];
        //     }
        // }

        const selctedRolArr = [
            { label: 'Managers', value: "manager", },
            { label: 'Coaches', value: "coaches", },
            { label: 'Scorers', value: "scorers", },
            { label: 'Players', value: "players", },
            { label: 'Umpires', value: "umpires", },
        ];
        return (
            <div>
                <InputWithHead heading={AppConstants.organisation + "(s)"} />
                <div className="d-flex flex-column">
                    <Radio className='mt-3'
                        onChange={(e) => this.props.updateCommunicationModuleData({ data: e.target.checked, key: "allOrg" })}
                        checked={allOrg}
                    >
                        {AppConstants.allOrganisation}
                    </Radio>
                    <Radio className='mt-3'
                        onChange={(e) => this.props.updateCommunicationModuleData({ data: e.target.checked, key: "indivisualOrg" })}
                        checked={indivisualOrg}
                    >
                        {AppConstants.individualOrganisation + '(s)'}
                    </Radio>
                </div>



                {indivisualOrg && (
                    <div className='mt-3'>

                        <Select
                            mode='multiple'
                            className='ml-5'
                            style={{ width: '97%', height: '44px' }}
                            placeholder="Select User"
                            onChange={(item, option) => {
                                const orgName = option.children
                                const orgId = option.key
                                // this.props.clearListAction()
                                this.props.updateCommunicationModuleData({ dara: orgId, key: 'orgId', selectedName: orgName, subKey: 'orgName' })
                            }}
                            notFoundContent={onLoadSearch === true ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={(value) => {
                                this.setState({ exsitingValue: value })
                                value && value.length > 2
                                    && this.props.getAffiliateToOrganisationAction(organisationUniqueKey, value)
                                // : this.props.clearListAction()
                            }}
                            value={orgName ? orgName : undefined}
                        >
                            {

                                this.state.exsitingValue &&
                                affiliateToData.map((org) => (
                                    <Option key={org.organisationId} value={org.organisationId}>
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
                        onChange={(e) => this.props.updateCommunicationModuleData({ data: e.target.checked, key: "allUser" })}
                        checked={allUser}
                    >
                        {"All Users"}
                    </Radio>
                </div>

                <div
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <Radio className='mt-3'
                        onChange={(e) => this.props.updateCommunicationModuleData({ data: e.target.checked, key: "selectedRoles" })}
                        checked={selectedRoles}
                    >
                        {"Selected Role(s)"}
                    </Radio>

                </div>

                <div className="col-sm">
                    {selectedRoles && (
                        <Checkbox.Group
                        >

                            {selctedRolArr.map((item) => (
                                <div>
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
                    <Radio className='mt-3'
                        onChange={(e) => this.props.updateCommunicationModuleData({ data: e.target.checked, key: "indivisualUsers" })}
                        checked={indivisualUsers}
                    >
                        {"Individual User(s)"}
                    </Radio>
                </div>

                {indivisualUsers && (
                    <div className='mt-3'>

                        <Select
                            className='ml-5'
                            mode='multiple'
                            style={{ width: '97%', height: '44px' }}
                            placeholder="Select User"
                            filterOption={false}
                            onChange={(item, option) => {
                                const userName = option.children
                                const userId = option.value
                                // this.props.clearListAction()
                                this.props.updateCommunicationModuleData({ data: userId, key: 'userId', selectedName: userName, subKey: "userName" })
                            }}
                            notFoundContent={onTextualLoad === true ? <Spin size="small" /> : null}
                            onSearch={(value) => {
                                this.setState({ userValue: value })
                                value && value.length > 2
                                    && this.userSearchApi(value)
                                // : this.props.clearListAction()
                            }}
                            value={userName ? userName : undefined}
                        >
                            {

                                this.state.userValue &&
                                userData.map((item) => (
                                    <Option key={item.userId} value={item.userId}>
                                        {item.name}
                                    </Option>
                                ))
                            }
                        </Select>

                    </div>
                )}

            </div>
        )
    }

    onSaveButton = () => {
        let newsId = this.props.location.state ? this.props.location.state.item ? this.props.location.state.item.id ? this.props.location.state.item.id : null : null : null
        let mediaArry = []

        if (this.state.image !== null && this.state.video !== null) {
            mediaArry = [
                this.state.image,
                this.state.video
            ]
        } else if (this.state.image !== null) {
            mediaArry = [
                this.state.image
            ]
        } else if (this.state.video !== null) {
            mediaArry = [
                this.state.video
            ]
        }

        const { liveScoreNewsState } = this.props;
        let data = liveScoreNewsState

        if (data.newExpiryDate && data.expire_time) {
            let expiry__Date = data.news_expire_date
            let experyDate = moment(data.newExpiryDate).format("YYYY-MM-DD")
            let expiryTime = moment(data.expire_time).format("HH:mm")
            let postDate = moment(expiry__Date + " " + expiryTime);

            let formatedDate = new Date(postDate).toISOString()
            liveScoreNewsState.addEditNews.news_expire_date = formatedDate
        }

        if (data.newsBody) {
            let newstringArr = []
            for (let i in data.newsBody) {
                newstringArr.push(data.newsBody[i].text)
            }

            let bodyDetails = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            liveScoreNewsState.addEditNews.body = bodyDetails
        }

        let editData = liveScoreNewsState.addEditNews;
        if (getLiveScoreCompetiton()) {
            const { id } = JSON.parse(getLiveScoreCompetiton())
            this.props.liveScoreAddNewsAction({
                editData: editData,
                mediaArry: mediaArry,
                newsId: newsId,
                key: this.state.key,
                compId: id,
                newsImage: data.newsImage,
                newsVideo: data.newsVideo
            })
        } else {
            this.props.liveScoreAddNewsAction({
                editData: editData,
                mediaArry: mediaArry,
                newsId: newsId,
                key: this.state.key,
                compId: 1,
                newsImage: data.newsImage,
                newsVideo: data.newsVideo
            })
        }
        this.setState({ getDataLoading: true })
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        const { liveScoreNewsState } = this.props;
        let editData = liveScoreNewsState.addEditNews;

        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm pl-3">
                            <div className="reg-add-save-button">
                                <NavLink
                                    to={{
                                        pathname: "/CommunicationList",
                                        state: { screenKey: this.state.screenKey }
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
        let stateWideMsg = getKeyForStateWideMessage()
        return (
            <div className="fluid-width default-bg">
                <Loader visible={this.props.liveScoreNewsState.onLoad_2} />
                <DashboardLayout menuHeading={AppConstants.Communication} menuName={AppConstants.Communication} />

                <InnerHorizontalMenu menu="communication" userSelectedKey="1" />

                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        // onFinish={this.onSaveButton}
                        noValidate="noValidate"
                    >
                        <Content>
                            <div className="formView">{this.contentView()}</div>
                            {/* {this.ModalView()} */}
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
        liveScoreAddNewsDetailsAction,
        liveScoreAddNewsAction,
        liveScoreUpdateNewsAction,
        liveScoreRefreshNewsAction,
        getliveScoreScorerList,
        liveScoreManagerListAction,
        setDefaultImageVideoNewAction,
        getAffiliateToOrganisationAction,
        clearListAction,
        getUserDashboardTextualAction,
        updateCommunicationModuleData
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreNewsState: state.LiveScoreNewsState,
        liveScoreScorerState: state.LiveScoreScorerState,
        liveScoreMangerState: state.LiveScoreMangerState,
        liveScoreState: state.LiveScoreState,
        userState: state.UserState,
        communicationModuleState: state.CommunicationModuleState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCommunication);
