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
import { EditorState, ContentState, convertFromHTML, convertFromRaw, convertToRaw } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ApiConstants from "../../themes/apiConstants";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage';
import { isArrayNotEmpty, isNullOrEmptyString } from "../../util/helpers";
import { liveScoreManagerListAction } from '../../store/actions/LiveScoreAction/liveScoreManagerAction'


const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;


class LiveScoreAddNews extends Component {
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
            imageSelection: '',
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
        };
    }


    componentDidMount() {

        const AuthorData = JSON.parse(getLiveScoreCompetiton())

        const name = AuthorData.longName
        // this.setState({  })
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.props.getliveScoreScorerList(id, 4)
        this.props.liveScoreManagerListAction(3, 1, id)
        this.setState({ getDataLoading: false, authorName: name })

        const { addEditNews } = this.props.liveScoreNewsState;

        this.props.form.setFieldsValue({
            'author': addEditNews.author ? addEditNews.author : name
        })
        if (this.state.isEdit == true) {
            this.props.setDefaultImageVideoNewAction({ newsImage: this.props.location.state.item.newsImage, newsVideo: this.props.location.state.item.newsVideo, author: name })
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
        let editData = liveScoreNewsState.addEditNews;
        const { editorState } = this.state;
        return (
            <div className="fluid-width mt-3" style={{ border: "1px solid rgb(212, 212, 212)", }}>
                <div className="livescore-editor-news col-sm">
                    <Editor
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        toolbarClassName="toolbar-class"
                        placeholder="News body"
                        onChange={(e) => this.onChangeEditorData(e.blocks)}
                        onEditorStateChange={this.onEditorStateChange}
                        toolbar={{
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
        const { addEditNews } = this.props.liveScoreNewsState;
        const authorData = JSON.parse(getLiveScoreCompetiton())
        console.log(authorData, 'authorDataauthorData')
        this.props.form.setFieldsValue({
            'news_Title': data.title,
            'author': author ? author : authorData.longName
        })
        let finalBody = data ? data.body ? data.body : "" : ""
        let body = EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(finalBody)))
        this.setState({ editorState: body })
    }

    componentDidUpdate(nextProps) {
        let newsState = this.props.liveScoreNewsState.addNewsResult
        let onLoad_2Data = this.props.liveScoreNewsState
        if (nextProps.newsState !== newsState) {
            if (onLoad_2Data.onLoad_2 == false && this.state.getDataLoading == true) {
                // debugger
                const appendData = this.props.liveScoreNewsState.addNewsResult
                if (this.state.isEdit == true) {
                    if (!appendData.hasOwnProperty('newsVideo')) {
                        appendData['newsVideo'] = this.props.location.state.item.newsVideo
                    }
                    if (!appendData.hasOwnProperty('newsImage')) {
                        appendData['newsImage'] = this.props.location.state.item.newsImage
                    }
                    // history.push('./liveScoreNewsView', { item: this.props.liveScoreNewsState.addNewsResult, id: this.state.key })
                }
                history.push('./liveScoreNewsView', { item: appendData, id: this.state.key })
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

        const { liveScoreNewsState } = this.props;
        let editData = liveScoreNewsState.addEditNews;

        if (data.files[0] !== undefined) {

            if (this.state.isEdit == true) {
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
        if (data.files[0] !== undefined) {
            if (this.state.isEdit == true) {
                editData.newsVideo = ''
            }
            this.setState({ video: data.files[0], videoSelection: URL.createObjectURL(data.files[0]) })
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
                centered={true}
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
        console.log(this.state.key)
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
                            {isEdit == true ? AppConstants.editNews : AppConstants.addNews}
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
        console.log(scorerListResult, 'scorerList****')
        return (
            <div className="row" >
                <div className="col-sm" >
                    <InputWithHead required={'pb-0'} heading={AppConstants.scorerHeading} />
                    <Select
                        mode="tags"
                        placeholder={AppConstants.searchScorer}
                        style={{ width: "100%", }}
                        placeholder={'Select Scorer'}
                    // onChange={(scorerId) => this.props.liveScoreUpdateNewsAction(scorerId, "title")}
                    // value={editData.title}
                    >
                        {scorerList.map((item) => {
                            return <Option key={'scorer' + item.firstName} value={item.firstName}>
                                {item.firstName + " " + item.lastName}
                            </Option>
                        })}
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
            <div className="row" >
                <div className="col-sm" >
                    <InputWithHead required={'pb-0'} heading={AppConstants.managerHeading} />
                    <Select
                        mode="tags"
                        placeholder={'Select Manager'}
                        style={{ width: "100%", }}
                    // onChange={e => this.venueChange(e)}
                    // value={this.state.venue === [] ? AppConstants.selectVenue : this.state.venue}
                    >
                        {managerList.map((item) => {
                            return <Option value={item.firstName}>
                                {item.firstName + " " + item.lastName}
                            </Option>
                        })}
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

    ////////form content view
    contentView = (getFieldDecorator) => {
        const { liveScoreNewsState } = this.props;
        let editData = liveScoreNewsState.addEditNews;
        let expiryDate = liveScoreNewsState.expire_date
        let expiryTime = liveScoreNewsState.expire_time

        let expiryTime_formate = expiryTime ? moment(expiryTime).format("HH:mm") : null;


        return (
            <div className="content-view pt-4">
                <Form.Item >
                    {getFieldDecorator('news_Title', {
                        rules: [{ required: true, message: ValidationConstants.newsValidation[0] }],
                    })(
                        <InputWithHead
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.newsTitle}
                            placeholder={AppConstants.enterNewsTitle}
                            name={'newsTitle'}
                            onChange={(event) => this.props.liveScoreUpdateNewsAction(event.target.value, "title")}
                            value={editData.title}
                        />
                    )}
                </Form.Item>
                <InputWithHead heading={AppConstants.newsBody}
                // value={editData.body}
                />

                {this.EditorView()}

                <Form.Item >
                    {getFieldDecorator('author', {
                        rules: [{ required: true, message: ValidationConstants.newsValidation[1] }],
                    })(
                        <InputWithHead
                            required={"required-field pb-0 pt-0"}
                            heading={AppConstants.author}
                            placeholder={AppConstants.enterAuthor}
                            name={'authorName'}
                            onChange={(event) => this.props.liveScoreUpdateNewsAction(event.target.value, "author")}
                        // value={'xyz'}
                        // {editData.author}
                        />
                    )}
                </Form.Item>

                <InputWithHead heading={AppConstants.recipients} />
                <div>
                    <Select
                        placeholder={AppConstants.recipientSelection}
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={recipientSelection => this.setRecipientData(recipientSelection, 'recipients')}
                        value={editData.recipients}
                    >
                        <Option value={"All Managers"}>{'All Managers'}</Option>
                        <Option value={"All Scorers"}>{'All Scorers'}</Option>
                        <Option value={"All Managers and Scorers"}>{'All Managers and Scorers'}</Option>
                        <Option value={"All Users"}>{'All Users'}</Option>
                        <Option value={"Individual Manager"}>{'Individual Manager'}</Option>
                        <Option value={"Individual Scorer"}>{'Individual Scorer'}</Option>
                    </Select>
                </div>
                {this.state.recipientSelection == "Individual Manager" && this.managerView()}
                {this.state.recipientSelection == "Individual Scorer" && this.scorerView()}
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.newsImage} />
                        <div className="reg-competition-logo-view" onClick={this.selectImage}>
                            <label>
                                <img
                                    src={editData.newsImage ? editData.newsImage : this.state.imageSelection}
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
                        // value={editData.newsImage}
                        // value={this.state.image}
                        />
                        {/* onChange={recipientSelection => this.props.liveScoreUpdateNewsAction(recipientSelection, "recipients")} */}

                    </div>
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.newsVideo} />
                        <div className="reg-competition-logo-view" onClick={this.selectVideo}>
                            <label>
                                <video
                                    src={editData.newsVideo ? editData.newsVideo : this.state.videoSelection}
                                    height='120'
                                    width='120'
                                    poster={(editData.newsVideo || this.state.videoSelection != '') ? '' : AppImages.circleImage} />
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

                {/* News expiry date and time  row */}
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.newsExpiryDate} />
                        <DatePicker
                            size="large"
                            style={{ width: "100%" }}
                            // onChange={(date) => this.props.liveScoreUpdateNewsAction(moment(date).format('MM/DD/YYYY'), "expire_date")}
                            onChange={(date) => this.props.liveScoreUpdateNewsAction(date, "expire_date")}
                            format={"DD-MM-YYYY"}
                            // value={editData.news_expire_date ? moment(editData.news_expire_date) : editData.expire_date}
                            value={expiryDate ? moment(expiryDate) : ''}
                            showTime={false}
                            placeholder='Select Date'
                            name={'registrationOepn'}
                        />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead
                            heading={AppConstants.newsExpiryTime} />
                        <TimePicker
                            className="comp-venue-time-timepicker"
                            style={{ width: "100%" }}
                            format={"HH:mm"}
                            // onChange={(time) => time !== null && this.props.liveScoreUpdateNewsAction(time.format('HH:mm'), "expire_time")}
                            value={expiryTime_formate !== null && moment(expiryTime_formate, "HH:mm")}


                            onChange={(time) => this.props.liveScoreUpdateNewsAction(time, "expire_time")}

                            // value={editData.news_expire_date ? moment(editData.news_expire_date, 'HH:mm') : editData.expire_time}

                            // minuteStep={15}
                            placeholder='Select Time'
                        // use12Hours={true}
                        />
                    </div>
                </div>
            </div >
        );
    };

    onSaveButton = (e) => {
        let newsId = this.props.location.state ? this.props.location.state.item ? this.props.location.state.item.id ? this.props.location.state.item.id : null : null : null
        // let newsId = null
        let mediaArry = []
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.image !== null && this.state.video !== null) {
                    mediaArry = [
                        this.state.image,
                        this.state.video
                    ]
                }
                else if (this.state.image !== null) {
                    mediaArry = [
                        this.state.image
                    ]
                }
                else if (this.state.video !== null) {
                    mediaArry = [
                        this.state.video
                    ]
                }
                const { liveScoreNewsState } = this.props;



                let data = liveScoreNewsState

                if(data.newExpiryDate && data.expire_time){
                    let experyDate = moment(data.newExpiryDate).format("YYYY-MM-DD")

                    let expiryTime = moment.utc(data.expire_time).format("HH:mm")
    
    
    
                    let postDate = experyDate + " " + expiryTime + " " + "UTC"
                    let formatedDate = new Date(postDate).toISOString()
                    liveScoreNewsState.addEditNews.news_expire_date = formatedDate
                    
                }

              

               if(data.newsBody){
                let newstringArr = []
                for(let i in data.newsBody){
                    newstringArr.push(data.newsBody[i].text)
                }

                let bodyText =  newstringArr.join(`<br/>`)
                // let bodyText = newstringArr.join("")
              
                liveScoreNewsState.addEditNews.body = bodyText
               }
               
                let editData = liveScoreNewsState.addEditNews;


                // console.log(editData)


                this.props.liveScoreAddNewsAction(editData, mediaArry, newsId, this.state.key)
                this.setState({ getDataLoading: true })
            }
        });


    }

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        const { liveScoreNewsState } = this.props;
        let editData = liveScoreNewsState.addEditNews;

        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button onClick={() => history.push(this.state.key == 'dashboard' ? 'liveScoreDashboard' : '/liveScoreNewsList')} type="cancel-button">{AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="user-approval-button"
                                    type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.next}
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
        const { getFieldDecorator } = this.props.form;
        console.log(this.props.liveScoreNewsState)
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <Loader visible={this.props.liveScoreNewsState.onLoad_2} />
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={this.state.key == 'dashboard' ? '1' : "21"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        autoComplete='off'
                        onSubmit={this.onSaveButton}
                        noValidate="noValidate">
                        <Content>
                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
                            {/* {this.ModalView()} */}
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
        liveScoreAddNewsDetailsAction,
        liveScoreAddNewsAction,
        liveScoreUpdateNewsAction,
        liveScoreRefreshNewsAction,
        getliveScoreScorerList,
        liveScoreManagerListAction,
        setDefaultImageVideoNewAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreNewsState: state.LiveScoreNewsState,
        liveScoreScorerState: state.LiveScoreScorerState,
        liveScoreMangerState: state.LiveScoreMangerState,
        liveScoreState: state.LiveScoreState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LiveScoreAddNews));

